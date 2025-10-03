export interface AgentHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  details: string;
  lastCheck: number;
  metrics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    errorRate: number;
  };
}

export interface AgentConfig {
  // API Configuration
  baseUrl?: string;
  apiKey?: string;
  timeout: number;

  // Retry Configuration
  maxRetries: number;
  retryDelay: number;
  retryMultiplier: number;
  maxRetryDelay: number;

  // Circuit Breaker Configuration
  circuitBreaker: {
    enabled: boolean;
    failureThreshold: number;
    recoveryTimeout: number;
    monitoringWindow: number;
  };

  // Rate Limiting Configuration
  rateLimit: {
    enabled: boolean;
    requestsPerSecond: number;
    burstSize: number;
  };

  // Caching Configuration
  cache: {
    enabled: boolean;
    defaultTtl: number;
    maxSize: number;
  };

  // Monitoring Configuration
  telemetry: {
    enabled: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    includeRequestBody: boolean;
    includeResponseBody: boolean;
  };
}

export interface APICallOptions extends RequestInit {
  endpoint: string;
  timeout?: number;
  skipCache?: boolean;
  cacheTtl?: number;
  retryable?: boolean;
  priority?: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
}

export interface APIResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
  cached: boolean;
  responseTime: number;
  requestId: string;
}

export interface AgentMetrics {
  requestCount: number;
  successCount: number;
  errorCount: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  cacheHitRate: number;
  circuitBreakerTrips: number;
  rateLimitHits: number;
  lastActivity: number;
}

export interface TelemetryEvent {
  timestamp: number;
  agentId: string;
  eventType: 'request' | 'response' | 'error' | 'cache_hit' | 'cache_miss' | 'circuit_breaker' | 'rate_limit';
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  data?: Record<string, any>;
  requestId?: string;
  duration?: number;
}

export interface ValidationRule<T = any> {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (value: T) => boolean | string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

export abstract class SearchParams {
  abstract validate(): ValidationResult;
  abstract toQuery(): Record<string, any>;
}

export abstract class SearchResult {
  abstract normalize(): any;
  abstract calculateRelevance(): number;
}