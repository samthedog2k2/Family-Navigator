import { TripRequest, TripPlan, FamilyData } from './types';

export interface AgentConfig {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  circuitBreaker: {
    threshold: number;
    resetTime: number;
  };
  cacheSettings: {
    enabled: boolean;
    ttl: number; // Time to live in milliseconds
  };
}

export interface AgentResponse<T = any> {
  agentId: string;
  success: boolean;
  data?: T;
  error?: string;
  processingTime: number;
  confidence: number;
  fromCache?: boolean;
  retryCount?: number;
  timestamp: number;
}

export interface CoordinatorRequest extends TripRequest {
  family: FamilyData;
  activeAgents: string[];
  priority?: 'low' | 'medium' | 'high';
  requestId?: string;
  metadata?: Record<string, any>;
}

export interface ExecutionPlan {
  phase1Agents: string[];
  phase2Agents: string[];
  phase3Agents: string[];
  dependencies: Map<string, string[]>;
  estimatedDuration: number;
}

export interface ProcessingMetrics {
  requestId: string;
  startTime: number;
  endTime?: number;
  totalDuration?: number;
  agentMetrics: Map<string, AgentMetrics>;
  cacheHits: number;
  cacheMisses: number;
  errors: ProcessingError[];
}

export interface AgentMetrics {
  agentId: string;
  attempts: number;
  successCount: number;
  errorCount: number;
  totalTime: number;
  averageTime: number;
  lastExecution: number;
}

export interface ProcessingError {
  agentId: string;
  error: string;
  timestamp: number;
  context?: Record<string, any>;
}

export interface CacheEntry<T = any> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

export interface CircuitBreakerState {
  agentId: string;
  state: 'closed' | 'open' | 'half-open';
  failures: number;
  lastFailure?: number;
  nextAttempt?: number;
}

export interface TravelAgent {
  id: string;
  name: string;
  initialize?(): Promise<void>;
  search?(params: any): Promise<any>;
  optimize?(params: any): Promise<any>;
  forecast?(params: any): Promise<any>;
  findDeals?(params: any): Promise<any>;
  getHealth?(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details?: string }>;
}

export interface CoordinatorConfig {
  agents: AgentConfig[];
  globalTimeout: number;
  maxConcurrentAgents: number;
  cacheEnabled: boolean;
  circuitBreakerEnabled: boolean;
  retryEnabled: boolean;
  telemetryEnabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export interface TelemetryData {
  requestId: string;
  timestamp: number;
  event: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  data?: Record<string, any>;
  agentId?: string;
  duration?: number;
}