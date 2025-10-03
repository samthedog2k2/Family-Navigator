import { TelemetryEvent, AgentMetrics } from '../lib/base-agent-types';

/**
 * Comprehensive telemetry system for agent monitoring
 */
export class AgentTelemetry {
  private events: TelemetryEvent[] = [];
  private metrics: Map<string, AgentMetrics> = new Map();
  private readonly maxEvents: number;
  private readonly flushInterval: number;
  private flushTimer?: NodeJS.Timeout;

  constructor(config: {
    maxEvents?: number;
    flushInterval?: number;
    autoFlush?: boolean;
  } = {}) {
    this.maxEvents = config.maxEvents || 10000;
    this.flushInterval = config.flushInterval || 60000; // 1 minute

    if (config.autoFlush !== false) {
      this.startAutoFlush();
    }
  }

  /**
   * Log a telemetry event
   */
  logEvent(event: Omit<TelemetryEvent, 'timestamp'>): void {
    const fullEvent: TelemetryEvent = {
      ...event,
      timestamp: Date.now(),
    };

    this.events.push(fullEvent);

    // Update metrics
    this.updateMetrics(fullEvent);

    // Maintain event buffer size
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      this.logToConsole(fullEvent);
    }
  }

  /**
   * Log API request start
   */
  logRequestStart(agentId: string, requestId: string, endpoint: string, metadata?: Record<string, any>): void {
    this.logEvent({
      agentId,
      eventType: 'request',
      level: 'debug',
      message: `API request started: ${endpoint}`,
      requestId,
      data: { endpoint, ...metadata },
    });
  }

  /**
   * Log API request completion
   */
  logRequestSuccess(
    agentId: string,
    requestId: string,
    endpoint: string,
    duration: number,
    cached: boolean = false
  ): void {
    this.logEvent({
      agentId,
      eventType: 'response',
      level: 'info',
      message: `API request completed: ${endpoint}${cached ? ' (cached)' : ''}`,
      requestId,
      duration,
      data: { endpoint, cached, responseTime: duration },
    });
  }

  /**
   * Log API request error
   */
  logRequestError(
    agentId: string,
    requestId: string,
    endpoint: string,
    error: Error,
    duration?: number
  ): void {
    this.logEvent({
      agentId,
      eventType: 'error',
      level: 'error',
      message: `API request failed: ${endpoint} - ${error.message}`,
      requestId,
      duration,
      data: {
        endpoint,
        error: error.message,
        stack: error.stack,
        errorType: error.constructor.name,
      },
    });
  }

  /**
   * Log cache hit
   */
  logCacheHit(agentId: string, requestId: string, cacheKey: string): void {
    this.logEvent({
      agentId,
      eventType: 'cache_hit',
      level: 'debug',
      message: `Cache hit: ${cacheKey}`,
      requestId,
      data: { cacheKey },
    });
  }

  /**
   * Log cache miss
   */
  logCacheMiss(agentId: string, requestId: string, cacheKey: string): void {
    this.logEvent({
      agentId,
      eventType: 'cache_miss',
      level: 'debug',
      message: `Cache miss: ${cacheKey}`,
      requestId,
      data: { cacheKey },
    });
  }

  /**
   * Log circuit breaker trip
   */
  logCircuitBreakerTrip(agentId: string, reason: string): void {
    this.logEvent({
      agentId,
      eventType: 'circuit_breaker',
      level: 'warn',
      message: `Circuit breaker tripped: ${reason}`,
      data: { reason },
    });
  }

  /**
   * Log rate limit hit
   */
  logRateLimit(agentId: string, requestId: string): void {
    this.logEvent({
      agentId,
      eventType: 'rate_limit',
      level: 'warn',
      message: 'Request rate limited',
      requestId,
    });
  }

  /**
   * Get metrics for a specific agent
   */
  getAgentMetrics(agentId: string): AgentMetrics | null {
    return this.metrics.get(agentId) || null;
  }

  /**
   * Get metrics for all agents
   */
  getAllMetrics(): Map<string, AgentMetrics> {
    return new Map(this.metrics);
  }

  /**
   * Get recent events
   */
  getEvents(options: {
    agentId?: string;
    eventType?: TelemetryEvent['eventType'];
    level?: TelemetryEvent['level'];
    since?: number;
    limit?: number;
  } = {}): TelemetryEvent[] {
    let filtered = [...this.events];

    if (options.agentId) {
      filtered = filtered.filter(event => event.agentId === options.agentId);
    }

    if (options.eventType) {
      filtered = filtered.filter(event => event.eventType === options.eventType);
    }

    if (options.level) {
      filtered = filtered.filter(event => event.level === options.level);
    }

    if (options.since) {
      filtered = filtered.filter(event => event.timestamp >= options.since);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp - a.timestamp);

    if (options.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  /**
   * Get error rate for an agent
   */
  getErrorRate(agentId: string, timeWindow: number = 5 * 60 * 1000): number {
    const since = Date.now() - timeWindow;
    const events = this.getEvents({ agentId, since });

    const total = events.filter(e => e.eventType === 'request' || e.eventType === 'error').length;
    const errors = events.filter(e => e.eventType === 'error').length;

    return total > 0 ? errors / total : 0;
  }

  /**
   * Get average response time for an agent
   */
  getAverageResponseTime(agentId: string, timeWindow: number = 5 * 60 * 1000): number {
    const since = Date.now() - timeWindow;
    const responseEvents = this.getEvents({
      agentId,
      eventType: 'response',
      since,
    });

    if (responseEvents.length === 0) return 0;

    const totalTime = responseEvents.reduce((sum, event) => sum + (event.duration || 0), 0);
    return totalTime / responseEvents.length;
  }

  /**
   * Generate health report for an agent
   */
  generateHealthReport(agentId: string): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    metrics: AgentMetrics;
    details: string[];
    recommendations: string[];
  } {
    const metrics = this.getAgentMetrics(agentId);
    const errorRate = this.getErrorRate(agentId);
    const avgResponseTime = this.getAverageResponseTime(agentId);

    const details: string[] = [];
    const recommendations: string[] = [];
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    // Check error rate
    if (errorRate > 0.1) {
      status = errorRate > 0.3 ? 'unhealthy' : 'degraded';
      details.push(`High error rate: ${(errorRate * 100).toFixed(1)}%`);
      recommendations.push('Investigate API issues or increase retry attempts');
    }

    // Check response time
    if (avgResponseTime > 5000) {
      status = avgResponseTime > 10000 ? 'unhealthy' : 'degraded';
      details.push(`Slow response time: ${avgResponseTime.toFixed(0)}ms`);
      recommendations.push('Consider optimizing API calls or increasing timeout');
    }

    // Check circuit breaker trips
    const recentBreakers = this.getEvents({
      agentId,
      eventType: 'circuit_breaker',
      since: Date.now() - 10 * 60 * 1000, // Last 10 minutes
    });

    if (recentBreakers.length > 0) {
      status = 'degraded';
      details.push(`Circuit breaker trips: ${recentBreakers.length}`);
      recommendations.push('Wait for circuit breaker recovery or check API health');
    }

    return {
      status,
      metrics: metrics || this.createEmptyMetrics(),
      details,
      recommendations,
    };
  }

  /**
   * Export telemetry data for external systems
   */
  exportData(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      return this.exportCSV();
    }

    return JSON.stringify({
      metadata: {
        exportTime: new Date().toISOString(),
        eventCount: this.events.length,
        agentCount: this.metrics.size,
      },
      events: this.events,
      metrics: Object.fromEntries(this.metrics),
    }, null, 2);
  }

  /**
   * Clear old telemetry data
   */
  cleanup(olderThan: number = 24 * 60 * 60 * 1000): number {
    const cutoff = Date.now() - olderThan;
    const initialCount = this.events.length;

    this.events = this.events.filter(event => event.timestamp >= cutoff);

    return initialCount - this.events.length;
  }

  /**
   * Shutdown telemetry system
   */
  shutdown(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }

    // Final flush
    this.flush();
  }

  // Private methods

  private updateMetrics(event: TelemetryEvent): void {
    const agentId = event.agentId;
    let metrics = this.metrics.get(agentId);

    if (!metrics) {
      metrics = this.createEmptyMetrics();
      this.metrics.set(agentId, metrics);
    }

    metrics.lastActivity = event.timestamp;

    switch (event.eventType) {
      case 'request':
        metrics.requestCount++;
        break;

      case 'response':
        metrics.successCount++;
        if (event.duration) {
          this.updateResponseTimeMetrics(metrics, event.duration);
        }
        break;

      case 'error':
        metrics.errorCount++;
        break;

      case 'cache_hit':
        // Cache hit rate is calculated dynamically
        break;

      case 'circuit_breaker':
        metrics.circuitBreakerTrips++;
        break;

      case 'rate_limit':
        metrics.rateLimitHits++;
        break;
    }

    // Update calculated metrics
    if (metrics.requestCount > 0) {
      metrics.averageResponseTime = this.getAverageResponseTime(agentId, 5 * 60 * 1000);
    }
  }

  private updateResponseTimeMetrics(metrics: AgentMetrics, responseTime: number): void {
    // This is a simplified implementation
    // In production, you'd want a proper percentile calculation
    metrics.p95ResponseTime = Math.max(metrics.p95ResponseTime, responseTime * 0.95);
    metrics.p99ResponseTime = Math.max(metrics.p99ResponseTime, responseTime * 0.99);
  }

  private createEmptyMetrics(): AgentMetrics {
    return {
      requestCount: 0,
      successCount: 0,
      errorCount: 0,
      averageResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
      cacheHitRate: 0,
      circuitBreakerTrips: 0,
      rateLimitHits: 0,
      lastActivity: Date.now(),
    };
  }

  private startAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private flush(): void {
    // In production, this would send data to external monitoring systems
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Telemetry] Flushed ${this.events.length} events for ${this.metrics.size} agents`);
    }
  }

  private logToConsole(event: TelemetryEvent): void {
    const timestamp = new Date(event.timestamp).toISOString();
    const prefix = `[${event.level.toUpperCase()}][${event.agentId}]`;

    switch (event.level) {
      case 'error':
        console.error(`${timestamp} ${prefix} ${event.message}`, event.data);
        break;
      case 'warn':
        console.warn(`${timestamp} ${prefix} ${event.message}`, event.data);
        break;
      case 'info':
        console.info(`${timestamp} ${prefix} ${event.message}`, event.data);
        break;
      case 'debug':
        console.debug(`${timestamp} ${prefix} ${event.message}`, event.data);
        break;
    }
  }

  private exportCSV(): string {
    const headers = [
      'timestamp',
      'agentId',
      'eventType',
      'level',
      'message',
      'requestId',
      'duration',
    ];

    const rows = this.events.map(event => [
      new Date(event.timestamp).toISOString(),
      event.agentId,
      event.eventType,
      event.level,
      event.message,
      event.requestId || '',
      event.duration?.toString() || '',
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }
}