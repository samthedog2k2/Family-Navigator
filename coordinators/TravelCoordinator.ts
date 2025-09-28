/**
 * Enhanced SP Travel Coordinator Agent
 * Enterprise-grade orchestration with resilience patterns and comprehensive monitoring
 */

import { TripPlan, TripSegment } from '../lib/types';
import {
  CoordinatorRequest,
  CoordinatorConfig,
  AgentResponse,
  ProcessingMetrics,
  TravelAgent,
  AgentConfig,
  ExecutionPlan
} from '../lib/coordinator-types';

import { AgentManager } from '../utils/AgentManager';
import { CacheManager } from '../utils/CacheManager';
import { ResilienceWrapper } from '../utils/ResilienceManager';

// Import agents (these would be your existing agent classes)
import { CruiseSearchAgent } from '../cruise/CruiseSearchAgent';
import { FlightSearchAgent } from '../flight/FlightSearchAgent';
import { HotelSearchAgent } from '../hotel/HotelSearchAgent';
import { RouteOptimizer } from '../roadtrip/RouteOptimizer';
import { WeatherMonitorAgent } from '../weather/WeatherMonitorAgent';
import { ExpenseTrackerAgent } from '../financial/ExpenseTrackerAgent';
import { DealFinderAgent } from '../deals/DealFinderAgent';

export class TravelCoordinator {
  private agentManager: AgentManager;
  private cacheManager: CacheManager;
  private resilienceWrapper: ResilienceWrapper;
  private config: CoordinatorConfig;
  private initialized = false;
  private metrics: Map<string, ProcessingMetrics> = new Map();

  constructor(config?: Partial<CoordinatorConfig>) {
    this.config = this.mergeWithDefaults(config);
    this.initializeManagers();
  }

  /**
   * Initialize all sub-agents with enterprise-grade configuration
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.logInfo('🚀 SP Travel Coordinator: Initializing with enterprise patterns...');

    try {
      // Register all agents with their configurations
      await this.registerAgents();

      // Validate agent health
      await this.validateAgentHealth();

      this.initialized = true;
      this.logInfo('✅ SP Travel Coordinator: All agents initialized successfully');

      // Start background monitoring
      this.startHealthMonitoring();

    } catch (error) {
      this.logError('❌ SP Travel Coordinator: Initialization failed', error);
      throw new Error(`Failed to initialize travel coordinator: ${(error as Error).message}`);
    }
  }

  /**
   * Main trip planning orchestration with enterprise patterns
   */
  async planTrip(request: CoordinatorRequest): Promise<TripPlan> {
    if (!this.initialized) {
      await this.initialize();
    }

    const requestId = request.requestId || this.generateRequestId();
    const startTime = Date.now();

    this.logInfo(`🧠 SP Processing trip request ${requestId} with ${request.activeAgents.length} agents`);

    try {
      // Initialize metrics tracking
      const metrics = this.initializeMetrics(requestId, startTime);

      // Validate request
      this.validateRequest(request);

      // Check cache first
      const cacheKey = this.cacheManager.generateKey('trip-plan', {
        type: request.type,
        destinations: request.destinations,
        dates: [request.startDate.toISOString(), request.endDate.toISOString()],
        budget: request.budget.total,
        members: request.family.members.length,
      });

      const cachedPlan = this.cacheManager.get<TripPlan>(cacheKey);
      if (cachedPlan) {
        this.logInfo(`📦 Cache hit for request ${requestId}`);
        metrics.cacheHits++;
        return this.updateCachedPlan(cachedPlan, request);
      }

      metrics.cacheMisses++;

      // Create execution plan
      const executionPlan = this.createExecutionPlan(request);
      this.logInfo(`📋 Execution plan: ${executionPlan.phase1Agents.length} parallel agents`);

      // Execute agents in phases
      const agentResponses = await this.executeAgentPipeline(request, executionPlan, requestId);

      // Synthesize results
      const tripPlan = this.synthesizeTripPlan(request, agentResponses);

      // Optimize plan
      const optimizedPlan = await this.optimizePlan(tripPlan, request.family);

      // Cache the result
      this.cacheManager.set(cacheKey, optimizedPlan, 15 * 60 * 1000); // 15 minutes

      // Update metrics
      this.finalizeMetrics(metrics, startTime);

      this.logInfo(`✨ SP Trip planning completed for ${requestId} in ${metrics.totalDuration}ms`);

      return optimizedPlan;

    } catch (error) {
      this.logError(`❌ Trip planning failed for ${requestId}`, error);
      throw error;
    }
  }

  /**
   * Get comprehensive system health and metrics
   */
  async getSystemHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    agents: Array<{
      id: string;
      status: 'healthy' | 'degraded' | 'unhealthy';
      details: string;
      metrics: any;
    }>;
    cache: ReturnType<CacheManager['getStats']>;
    resilience: ReturnType<ResilienceWrapper['getStats']>;
    processing: {
      activeRequests: number;
      totalProcessed: number;
      averageTime: number;
    };
  }> {
    const agentHealthChecks = await Promise.allSettled(
      this.config.agents.map(async (agentConfig) => {
        const health = await this.agentManager.getAgentHealth(agentConfig.id);
        return {
          id: agentConfig.id,
          ...health,
        };
      })
    );

    const agents = agentHealthChecks.map(result =>
      result.status === 'fulfilled' ? result.value : {
        id: 'unknown',
        status: 'unhealthy' as const,
        details: 'Health check failed',
        metrics: {},
      }
    );

    const unhealthyAgents = agents.filter(agent => agent.status === 'unhealthy').length;
    const degradedAgents = agents.filter(agent => agent.status === 'degraded').length;

    let systemStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (unhealthyAgents > 0) {
      systemStatus = unhealthyAgents > agents.length / 2 ? 'unhealthy' : 'degraded';
    } else if (degradedAgents > 0) {
      systemStatus = 'degraded';
    }

    return {
      status: systemStatus,
      agents,
      cache: this.cacheManager.getStats(),
      resilience: this.resilienceWrapper.getStats(),
      processing: this.getProcessingStats(),
    };
  }

  /**
   * Gracefully shutdown the coordinator
   */
  async shutdown(): Promise<void> {
    this.logInfo('🛑 Shutting down Travel Coordinator...');

    // Stop health monitoring
    this.stopHealthMonitoring();

    // Cleanup cache
    this.cacheManager.destroy();

    // Clear metrics
    this.metrics.clear();

    this.initialized = false;
    this.logInfo('✅ Travel Coordinator shutdown complete');
  }

  // Private implementation methods

  private mergeWithDefaults(config?: Partial<CoordinatorConfig>): CoordinatorConfig {
    const defaultConfig: CoordinatorConfig = {
      agents: [
        {
          id: 'cruise',
          name: 'Cruise Search Agent',
          enabled: true,
          priority: 1,
          timeout: 30000,
          retryAttempts: 3,
          retryDelay: 1000,
          circuitBreaker: { threshold: 5, resetTime: 60000 },
          cacheSettings: { enabled: true, ttl: 10 * 60 * 1000 },
        },
        {
          id: 'flight',
          name: 'Flight Search Agent',
          enabled: true,
          priority: 1,
          timeout: 25000,
          retryAttempts: 3,
          retryDelay: 1000,
          circuitBreaker: { threshold: 5, resetTime: 60000 },
          cacheSettings: { enabled: true, ttl: 5 * 60 * 1000 },
        },
        {
          id: 'hotel',
          name: 'Hotel Search Agent',
          enabled: true,
          priority: 2,
          timeout: 20000,
          retryAttempts: 2,
          retryDelay: 1000,
          circuitBreaker: { threshold: 5, resetTime: 60000 },
          cacheSettings: { enabled: true, ttl: 15 * 60 * 1000 },
        },
        {
          id: 'route',
          name: 'Route Optimizer',
          enabled: true,
          priority: 1,
          timeout: 15000,
          retryAttempts: 2,
          retryDelay: 1000,
          circuitBreaker: { threshold: 3, resetTime: 30000 },
          cacheSettings: { enabled: true, ttl: 30 * 60 * 1000 },
        },
        {
          id: 'weather',
          name: 'Weather Monitor',
          enabled: true,
          priority: 3,
          timeout: 10000,
          retryAttempts: 2,
          retryDelay: 500,
          circuitBreaker: { threshold: 3, resetTime: 30000 },
          cacheSettings: { enabled: true, ttl: 60 * 60 * 1000 },
        },
        {
          id: 'expense',
          name: 'Expense Tracker',
          enabled: true,
          priority: 3,
          timeout: 5000,
          retryAttempts: 1,
          retryDelay: 500,
          circuitBreaker: { threshold: 3, resetTime: 30000 },
          cacheSettings: { enabled: false, ttl: 0 },
        },
        {
          id: 'deals',
          name: 'Deal Finder',
          enabled: true,
          priority: 2,
          timeout: 15000,
          retryAttempts: 2,
          retryDelay: 1000,
          circuitBreaker: { threshold: 5, resetTime: 60000 },
          cacheSettings: { enabled: true, ttl: 20 * 60 * 1000 },
        },
      ],
      globalTimeout: 120000, // 2 minutes
      maxConcurrentAgents: 5,
      cacheEnabled: true,
      circuitBreakerEnabled: true,
      retryEnabled: true,
      telemetryEnabled: true,
      logLevel: 'info',
    };

    return { ...defaultConfig, ...config };
  }

  private initializeManagers(): void {
    // Initialize agent manager
    this.agentManager = new AgentManager({
      maxRetries: 3,
      defaultTimeout: 30000,
      telemetryEnabled: this.config.telemetryEnabled,
    });

    // Initialize cache manager
    this.cacheManager = new CacheManager({
      maxSize: 1000,
      defaultTtl: 10 * 60 * 1000, // 10 minutes
      cleanupInterval: 60 * 1000, // 1 minute
    });

    // Initialize resilience wrapper
    this.resilienceWrapper = new ResilienceWrapper({
      retry: {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 10000,
        backoffMultiplier: 2,
        jitter: true,
      },
      timeout: {
        timeout: this.config.globalTimeout,
        timeoutMessage: 'Global operation timeout exceeded',
      },
      bulkhead: {
        maxConcurrency: this.config.maxConcurrentAgents,
        queueSize: 20,
        queueTimeout: 30000,
      },
      circuitBreaker: {
        failureThreshold: 5,
        recoveryTimeout: 60000,
        monitoringPeriod: 300000,
        successThreshold: 3,
      },
    });
  }

  private async registerAgents(): Promise<void> {
    const agentInstances: Array<{ agent: TravelAgent; config: AgentConfig }> = [
      { agent: new CruiseSearchAgent(), config: this.config.agents.find(a => a.id === 'cruise')! },
      { agent: new FlightSearchAgent(), config: this.config.agents.find(a => a.id === 'flight')! },
      { agent: new HotelSearchAgent(), config: this.config.agents.find(a => a.id === 'hotel')! },
      { agent: new RouteOptimizer(), config: this.config.agents.find(a => a.id === 'route')! },
      { agent: new WeatherMonitorAgent(), config: this.config.agents.find(a => a.id === 'weather')! },
      { agent: new ExpenseTrackerAgent(), config: this.config.agents.find(a => a.id === 'expense')! },
      { agent: new DealFinderAgent(), config: this.config.agents.find(a => a.id === 'deals')! },
    ];

    for (const { agent, config } of agentInstances) {
      if (config?.enabled) {
        this.agentManager.registerAgent(agent, config);

        // Initialize agent if it has an initialize method
        if (agent.initialize) {
          await agent.initialize();
        }
      }
    }
  }

  private async validateAgentHealth(): Promise<void> {
    const healthChecks = await Promise.allSettled(
      this.config.agents
        .filter(config => config.enabled)
        .map(config => this.agentManager.getAgentHealth(config.id))
    );

    const unhealthyAgents = healthChecks
      .map((result, index) => ({
        result,
        agentId: this.config.agents.filter(c => c.enabled)[index].id,
      }))
      .filter(({ result }) =>
        result.status === 'rejected' ||
        (result.status === 'fulfilled' && result.value.status === 'unhealthy')
      );

    if (unhealthyAgents.length > 0) {
      this.logWarn(`Some agents are unhealthy: ${unhealthyAgents.map(a => a.agentId).join(', ')}`);
    }
  }

  private createExecutionPlan(request: CoordinatorRequest): ExecutionPlan {
    const enabledAgents = this.config.agents
      .filter(config => config.enabled && request.activeAgents.includes(config.id))
      .sort((a, b) => a.priority - b.priority);

    // Group agents by priority for phased execution
    const phase1Agents = enabledAgents.filter(agent => agent.priority === 1).map(a => a.id);
    const phase2Agents = enabledAgents.filter(agent => agent.priority === 2).map(a => a.id);
    const phase3Agents = enabledAgents.filter(agent => agent.priority === 3).map(a => a.id);

    return {
      phase1Agents,
      phase2Agents,
      phase3Agents,
      dependencies: new Map(), // Could be enhanced with dependency mapping
      estimatedDuration: this.estimateExecutionTime(enabledAgents),
    };
  }

  private async executeAgentPipeline(
    request: CoordinatorRequest,
    plan: ExecutionPlan,
    requestId: string
  ): Promise<AgentResponse[]> {
    const allResponses: AgentResponse[] = [];

    // Phase 1: Critical agents (flights, cruises, routes)
    if (plan.phase1Agents.length > 0) {
      const phase1Responses = await this.executeAgentsInParallel(
        plan.phase1Agents,
        request,
        requestId,
        'phase1'
      );
      allResponses.push(...phase1Responses);
    }

    // Phase 2: Secondary agents (hotels, deals)
    if (plan.phase2Agents.length > 0) {
      const phase2Responses = await this.executeAgentsInParallel(
        plan.phase2Agents,
        request,
        requestId,
        'phase2'
      );
      allResponses.push(...phase2Responses);
    }

    // Phase 3: Supporting agents (weather, expense tracking)
    if (plan.phase3Agents.length > 0) {
      const phase3Responses = await this.executeAgentsInParallel(
        plan.phase3Agents,
        request,
        requestId,
        'phase3'
      );
      allResponses.push(...phase3Responses);
    }

    return allResponses;
  }

  private async executeAgentsInParallel(
    agentIds: string[],
    request: CoordinatorRequest,
    requestId: string,
    phase: string
  ): Promise<AgentResponse[]> {
    this.logInfo(`🚀 Executing ${phase} with agents: ${agentIds.join(', ')}`);

    const executions = agentIds.map(agentId => ({
      agentId,
      method: this.getAgentMethod(agentId, request.type),
      params: this.buildAgentParams(agentId, request),
    }));

    return this.agentManager.executeParallel(
      executions,
      this.config.maxConcurrentAgents,
      requestId
    );
  }

  private getAgentMethod(agentId: string, tripType: string): string {
    switch (agentId) {
      case 'cruise':
      case 'flight':
      case 'hotel':
        return 'search';
      case 'route':
        return 'optimize';
      case 'weather':
        return 'forecast';
      case 'deals':
        return 'findDeals';
      case 'expense':
        return 'track';
      default:
        return 'execute';
    }
  }

  private buildAgentParams(agentId: string, request: CoordinatorRequest): any {
    const baseParams = {
      destinations: request.destinations,
      startDate: request.startDate,
      endDate: request.endDate,
      budget: request.budget.total,
      familySize: request.family.members.length,
    };

    switch (agentId) {
      case 'cruise':
        return {
          ...baseParams,
          passengers: request.family.members.length,
          cabinPreference: request.family.preferences?.cruiseDefaults?.cabinType || 'balcony',
        };

      case 'flight':
        return {
          ...baseParams,
          origin: request.family.defaultAirport,
          passengers: request.family.members.length,
          class: request.family.preferences?.flightDefaults?.class || 'economy',
        };

      case 'hotel':
        return {
          ...baseParams,
          rooms: Math.ceil(request.family.members.length / 2),
          maxPrice: request.family.preferences?.hotelDefaults?.maxBudgetPerNight || 200,
        };

      case 'route':
        return {
          ...baseParams,
          origin: request.family.homeAddress,
          vehicleMPG: request.family.preferences?.carDefaults?.mpg || 25,
          fuelType: request.family.preferences?.carDefaults?.fuelType || 'gasoline',
        };

      default:
        return baseParams;
    }
  }

  private synthesizeTripPlan(
    request: CoordinatorRequest,
    responses: AgentResponse[]
  ): TripPlan {
    const segments: TripSegment[] = [];
    const recommendations: string[] = [];
    const warnings: string[] = [];

    // Process successful responses
    responses.forEach(response => {
      if (response.success && response.data) {
        this.processAgentResponse(response, segments, recommendations, warnings, request);
      } else if (!response.success) {
        warnings.push(`⚠️ ${response.agentId} failed: ${response.error}`);
      }
    });

    // Calculate costs
    const costBreakdown = this.calculateCostBreakdown(segments, request);

    return {
      id: this.generateRequestId(),
      request,
      segments,
      totalCost: costBreakdown,
      recommendations,
      warnings,
    };
  }

  private processAgentResponse(
    response: AgentResponse,
    segments: TripSegment[],
    recommendations: string[],
    warnings: string[],
    request: CoordinatorRequest
  ): void {
    // Implementation would depend on specific agent response formats
    // This is a simplified version

    if (response.data?.results || response.data?.flights || response.data?.hotels) {
      const results = response.data.results || response.data.flights || response.data.hotels || [];

      results.slice(0, 3).forEach((item: any) => {
        segments.push({
          type: response.agentId as any,
          startDate: request.startDate,
          endDate: request.endDate,
          provider: item.provider || item.airline || item.name || 'Unknown',
          details: item,
          cost: item.price || item.totalPrice || 0,
          bookingUrl: item.bookingUrl,
        });
      });
    }

    if (response.data?.deals) {
      response.data.deals.forEach((deal: any) => {
        recommendations.push(`💰 ${deal.description} - Save ${deal.savings}`);
      });
    }

    if (response.data?.warnings) {
      warnings.push(...response.data.warnings);
    }
  }

  private calculateCostBreakdown(segments: TripSegment[], request: CoordinatorRequest) {
    const days = Math.ceil((request.endDate.getTime() - request.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const memberCount = request.family.members.length;

    return {
      transportation: segments.filter(s => ['flight', 'cruise'].includes(s.type)).reduce((sum, s) => sum + s.cost, 0),
      accommodation: segments.filter(s => s.type === 'hotel').reduce((sum, s) => sum + s.cost, 0),
      meals: memberCount * 50 * days,
      activities: memberCount * 100 * days,
      insurance: request.budget.total * 0.05,
      taxes: 0,
      fees: 0,
      total: 0,
      currency: 'USD',
    };
  }

  private async optimizePlan(tripPlan: TripPlan, family: any): Promise<TripPlan> {
    // Apply optimization logic
    const optimized = { ...tripPlan };

    // Calculate total
    optimized.totalCost.total = Object.values(optimized.totalCost)
      .filter(val => typeof val === 'number')
      .reduce((sum, val) => sum + val, 0);

    // Add budget warnings
    if (optimized.totalCost.total > tripPlan.request.budget.total) {
      optimized.warnings.push(
        `⚠️ Trip exceeds budget by $${(optimized.totalCost.total - tripPlan.request.budget.total).toLocaleString()}`
      );
    }

    // Add family-specific recommendations
    if (family.members.some((m: any) => m.age < 18)) {
      optimized.recommendations.push('👨‍👩‍👧‍👦 Family-friendly options prioritized');
    }

    return optimized;
  }

  // Utility methods

  private generateRequestId(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMetrics(requestId: string, startTime: number): ProcessingMetrics {
    const metrics: ProcessingMetrics = {
      requestId,
      startTime,
      agentMetrics: new Map(),
      cacheHits: 0,
      cacheMisses: 0,
      errors: [],
    };

    this.metrics.set(requestId, metrics);
    return metrics;
  }

  private finalizeMetrics(metrics: ProcessingMetrics, startTime: number): void {
    metrics.endTime = Date.now();
    metrics.totalDuration = metrics.endTime - startTime;
  }

  private validateRequest(request: CoordinatorRequest): void {
    if (!request.destinations || request.destinations.length === 0) {
      throw new Error('At least one destination is required');
    }

    if (!request.startDate || !request.endDate) {
      throw new Error('Start and end dates are required');
    }

    if (request.startDate >= request.endDate) {
      throw new Error('End date must be after start date');
    }

    if (!request.budget || request.budget.total <= 0) {
      throw new Error('Valid budget is required');
    }
  }

  private updateCachedPlan(cachedPlan: TripPlan, request: CoordinatorRequest): TripPlan {
    // Update cached plan with current request details
    return {
      ...cachedPlan,
      request,
      id: this.generateRequestId(),
    };
  }

  private estimateExecutionTime(agents: AgentConfig[]): number {
    return agents.reduce((total, agent) => total + agent.timeout, 0) / 2; // Parallel execution estimate
  }

  private getProcessingStats() {
    const allMetrics = Array.from(this.metrics.values());
    const completed = allMetrics.filter(m => m.endTime);

    return {
      activeRequests: allMetrics.length - completed.length,
      totalProcessed: completed.length,
      averageTime: completed.length > 0
        ? completed.reduce((sum, m) => sum + (m.totalDuration || 0), 0) / completed.length
        : 0,
    };
  }

  // Health monitoring
  private healthMonitorInterval?: NodeJS.Timeout;

  private startHealthMonitoring(): void {
    this.healthMonitorInterval = setInterval(async () => {
      try {
        const health = await this.getSystemHealth();
        if (health.status === 'unhealthy') {
          this.logError('System health check failed', { health });
        } else if (health.status === 'degraded') {
          this.logWarn('System health degraded', { health });
        }
      } catch (error) {
        this.logError('Health monitoring failed', error);
      }
    }, 60000); // Every minute
  }

  private stopHealthMonitoring(): void {
    if (this.healthMonitorInterval) {
      clearInterval(this.healthMonitorInterval);
      this.healthMonitorInterval = undefined;
    }
  }

  // Logging methods
  private logInfo(message: string, data?: any): void {
    if (this.config.logLevel === 'debug' || this.config.logLevel === 'info') {
      console.log(`[INFO] ${message}`, data || '');
    }
  }

  private logWarn(message: string, data?: any): void {
    if (['debug', 'info', 'warn'].includes(this.config.logLevel)) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }

  private logError(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error || '');
  }
}