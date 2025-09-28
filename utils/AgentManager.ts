import {
  TravelAgent,
  AgentConfig,
  AgentResponse,
  CircuitBreakerState,
  AgentMetrics,
  TelemetryData
} from '../lib/coordinator-types';

export class AgentManager {
  private agents: Map<string, TravelAgent> = new Map();
  private configs: Map<string, AgentConfig> = new Map();
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
  private metrics: Map<string, AgentMetrics> = new Map();
  private telemetry: TelemetryData[] = [];

  constructor(private readonly globalConfig: {
    maxRetries: number;
    defaultTimeout: number;
    telemetryEnabled: boolean;
  }) {}

  /**
   * Register an agent with its configuration
   */
  registerAgent(agent: TravelAgent, config: AgentConfig): void {
    this.agents.set(agent.id, agent);
    this.configs.set(agent.id, config);

    // Initialize circuit breaker
    this.circuitBreakers.set(agent.id, {
      agentId: agent.id,
      state: 'closed',
      failures: 0,
    });

    // Initialize metrics
    this.metrics.set(agent.id, {
      agentId: agent.id,
      attempts: 0,
      successCount: 0,
      errorCount: 0,
      totalTime: 0,
      averageTime: 0,
      lastExecution: 0,
    });

    this.logTelemetry('info', 'agent_registered', { agentId: agent.id });
  }

  /**
   * Execute an agent with resilience patterns
   */
  async executeAgent<T>(
    agentId: string,
    method: string,
    params: any,
    requestId?: string
  ): Promise<AgentResponse<T>> {
    const config = this.configs.get(agentId);
    const agent = this.agents.get(agentId);

    if (!config || !agent) {
      throw new Error(`Agent ${agentId} not found or not configured`);
    }

    // Check circuit breaker
    if (!this.isCircuitClosed(agentId)) {
      return this.createErrorResponse<T>(agentId, 'Circuit breaker open', 0);
    }

    const startTime = Date.now();
    let lastError: Error | null = null;

    // Retry logic
    for (let attempt = 0; attempt <= config.retryAttempts; attempt++) {
      try {
        this.updateMetrics(agentId, 'attempt');

        const result = await this.executeWithTimeout(
          agent,
          method,
          params,
          config.timeout
        );

        const processingTime = Date.now() - startTime;
        this.updateMetrics(agentId, 'success', processingTime);
        this.resetCircuitBreaker(agentId);

        this.logTelemetry('info', 'agent_success', {
          agentId,
          method,
          processingTime,
          attempt,
          requestId,
        });

        return {
          agentId,
          success: true,
          data: result,
          processingTime,
          confidence: this.calculateConfidence(agentId, result),
          retryCount: attempt,
          timestamp: Date.now(),
        };

      } catch (error) {
        lastError = error as Error;
        this.updateMetrics(agentId, 'error');

        this.logTelemetry('error', 'agent_error', {
          agentId,
          method,
          error: lastError.message,
          attempt,
          requestId,
        });

        // Don't retry on the last attempt
        if (attempt < config.retryAttempts) {
          await this.delay(config.retryDelay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }

    // All retries failed
    this.tripCircuitBreaker(agentId);
    const processingTime = Date.now() - startTime;

    return this.createErrorResponse<T>(
      agentId,
      lastError?.message || 'Unknown error',
      processingTime,
      config.retryAttempts
    );
  }

  /**
   * Execute multiple agents in parallel with controlled concurrency
   */
  async executeParallel<T>(
    executions: Array<{
      agentId: string;
      method: string;
      params: any;
    }>,
    maxConcurrency: number = 5,
    requestId?: string
  ): Promise<AgentResponse<T>[]> {
    const results: AgentResponse<T>[] = [];
    const executing: Promise<void>[] = [];

    for (const execution of executions) {
      // Wait if we've reached max concurrency
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing);
      }

      const promise = this.executeAgent<T>(
        execution.agentId,
        execution.method,
        execution.params,
        requestId
      ).then(result => {
        results.push(result);
      }).finally(() => {
        const index = executing.indexOf(promise);
        if (index > -1) {
          executing.splice(index, 1);
        }
      });

      executing.push(promise);
    }

    // Wait for all remaining executions
    await Promise.all(executing);
    return results;
  }

  /**
   * Get agent health status
   */
  async getAgentHealth(agentId: string): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: string;
    metrics: AgentMetrics;
  }> {
    const agent = this.agents.get(agentId);
    const metrics = this.metrics.get(agentId);
    const circuitBreaker = this.circuitBreakers.get(agentId);

    if (!agent || !metrics || !circuitBreaker) {
      return {
        status: 'unhealthy',
        details: 'Agent not found',
        metrics: {} as AgentMetrics,
      };
    }

    // Check circuit breaker state
    if (circuitBreaker.state === 'open') {
      return {
        status: 'unhealthy',
        details: 'Circuit breaker open',
        metrics,
      };
    }

    // Check error rate
    const errorRate = metrics.attempts > 0 ? metrics.errorCount / metrics.attempts : 0;

    if (errorRate > 0.5) {
      return {
        status: 'unhealthy',
        details: `High error rate: ${(errorRate * 100).toFixed(1)}%`,
        metrics,
      };
    }

    if (errorRate > 0.2) {
      return {
        status: 'degraded',
        details: `Elevated error rate: ${(errorRate * 100).toFixed(1)}%`,
        metrics,
      };
    }

    // Check if agent has health method
    if (agent.getHealth) {
      try {
        const agentHealth = await agent.getHealth();
        return {
          status: agentHealth.status,
          details: agentHealth.details || 'Agent reported status',
          metrics,
        };
      } catch (error) {
        return {
          status: 'unhealthy',
          details: `Health check failed: ${(error as Error).message}`,
          metrics,
        };
      }
    }

    return {
      status: 'healthy',
      details: 'All metrics within normal range',
      metrics,
    };
  }

  /**
   * Get comprehensive metrics for all agents
   */
  getAllMetrics(): Map<string, AgentMetrics> {
    return new Map(this.metrics);
  }

  /**
   * Get telemetry data
   */
  getTelemetry(since?: number): TelemetryData[] {
    if (since) {
      return this.telemetry.filter(entry => entry.timestamp >= since);
    }
    return [...this.telemetry];
  }

  /**
   * Clear old telemetry data
   */
  cleanupTelemetry(olderThan: number = 24 * 60 * 60 * 1000): void {
    const cutoff = Date.now() - olderThan;
    this.telemetry = this.telemetry.filter(entry => entry.timestamp >= cutoff);
  }

  // Private methods

  private async executeWithTimeout<T>(
    agent: TravelAgent,
    method: string,
    params: any,
    timeout: number
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Agent method ${method} timed out after ${timeout}ms`));
      }, timeout);

      const agentMethod = (agent as any)[method];
      if (typeof agentMethod !== 'function') {
        clearTimeout(timeoutId);
        reject(new Error(`Method ${method} not found on agent ${agent.id}`));
        return;
      }

      Promise.resolve(agentMethod.call(agent, params))
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  private isCircuitClosed(agentId: string): boolean {
    const breaker = this.circuitBreakers.get(agentId);
    if (!breaker) return true;

    if (breaker.state === 'open') {
      // Check if we should try half-open
      if (breaker.nextAttempt && Date.now() >= breaker.nextAttempt) {
        breaker.state = 'half-open';
        return true;
      }
      return false;
    }

    return true;
  }

  private tripCircuitBreaker(agentId: string): void {
    const config = this.configs.get(agentId);
    const breaker = this.circuitBreakers.get(agentId);

    if (!config || !breaker) return;

    breaker.failures++;
    breaker.lastFailure = Date.now();

    if (breaker.failures >= config.circuitBreaker.threshold) {
      breaker.state = 'open';
      breaker.nextAttempt = Date.now() + config.circuitBreaker.resetTime;

      this.logTelemetry('warn', 'circuit_breaker_opened', { agentId });
    }
  }

  private resetCircuitBreaker(agentId: string): void {
    const breaker = this.circuitBreakers.get(agentId);
    if (breaker) {
      breaker.failures = 0;
      breaker.state = 'closed';
      breaker.nextAttempt = undefined;
    }
  }

  private updateMetrics(agentId: string, type: 'attempt' | 'success' | 'error', duration?: number): void {
    const metrics = this.metrics.get(agentId);
    if (!metrics) return;

    if (type === 'attempt') {
      metrics.attempts++;
      metrics.lastExecution = Date.now();
    } else if (type === 'success') {
      metrics.successCount++;
      if (duration) {
        metrics.totalTime += duration;
        metrics.averageTime = metrics.totalTime / metrics.successCount;
      }
    } else if (type === 'error') {
      metrics.errorCount++;
    }
  }

  private calculateConfidence(agentId: string, result: any): number {
    const metrics = this.metrics.get(agentId);
    if (!metrics || metrics.attempts === 0) return 0.5;

    // Base confidence on success rate
    const successRate = metrics.successCount / metrics.attempts;

    // Adjust based on data quality
    let dataQuality = 0.5;
    if (result && typeof result === 'object') {
      const hasResults = result.results || result.data || result.flights || result.hotels;
      if (hasResults && Array.isArray(hasResults)) {
        dataQuality = Math.min(hasResults.length / 5, 1); // More results = higher confidence
      }
    }

    return Math.min((successRate * 0.7) + (dataQuality * 0.3), 1);
  }

  private createErrorResponse<T>(
    agentId: string,
    error: string,
    processingTime: number,
    retryCount: number = 0
  ): AgentResponse<T> {
    return {
      agentId,
      success: false,
      error,
      processingTime,
      confidence: 0,
      retryCount,
      timestamp: Date.now(),
    };
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private logTelemetry(
    level: 'debug' | 'info' | 'warn' | 'error',
    event: string,
    data?: Record<string, any>
  ): void {
    if (!this.globalConfig.telemetryEnabled) return;

    const entry: TelemetryData = {
      requestId: data?.requestId || 'unknown',
      timestamp: Date.now(),
      event,
      level,
      data,
      agentId: data?.agentId,
      duration: data?.processingTime || data?.duration,
    };

    this.telemetry.push(entry);

    // Keep only last 1000 entries to prevent memory bloat
    if (this.telemetry.length > 1000) {
      this.telemetry = this.telemetry.slice(-1000);
    }

    // Also log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level.toUpperCase()}] ${event}:`, data);
    }
  }
}