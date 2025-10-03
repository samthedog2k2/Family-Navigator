import { TelemetryData } from '../lib/coordinator-types';

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
}

export interface TimeoutConfig {
  timeout: number;
  timeoutMessage?: string;
}

export interface BulkheadConfig {
  maxConcurrency: number;
  queueSize: number;
  queueTimeout: number;
}

/**
 * Retry pattern with exponential backoff and jitter
 */
export class RetryManager {
  constructor(private config: RetryConfig) {}

  async execute<T>(
    operation: () => Promise<T>,
    context?: { operationName?: string; agentId?: string }
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on the last attempt
        if (attempt === this.config.maxAttempts) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = this.calculateDelay(attempt);

        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `Retry attempt ${attempt}/${this.config.maxAttempts} for ${context?.operationName || 'operation'} failed:`,
            lastError.message,
            `Retrying in ${delay}ms...`
          );
        }

        await this.delay(delay);
      }
    }

    throw new Error(
      `Operation failed after ${this.config.maxAttempts} attempts. Last error: ${lastError.message}`
    );
  }

  private calculateDelay(attempt: number): number {
    const baseDelay = this.config.baseDelay * Math.pow(this.config.backoffMultiplier, attempt - 1);
    const delay = Math.min(baseDelay, this.config.maxDelay);

    // Add jitter to prevent thundering herd
    if (this.config.jitter) {
      return delay * (0.5 + Math.random() * 0.5);
    }

    return delay;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Timeout pattern for operations
 */
export class TimeoutManager {
  static async execute<T>(
    operation: () => Promise<T>,
    config: TimeoutConfig
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(config.timeoutMessage || `Operation timed out after ${config.timeout}ms`));
      }, config.timeout);

      operation()
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
}

/**
 * Bulkhead pattern for isolating resources
 */
export class BulkheadManager {
  private queue: Array<{
    operation: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
    timestamp: number;
  }> = [];
  private running = 0;

  constructor(private config: BulkheadConfig) {
    // Start queue processing
    this.processQueue();
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // Check if we can execute immediately
      if (this.running < this.config.maxConcurrency) {
        this.executeOperation(operation, resolve, reject);
        return;
      }

      // Check queue capacity
      if (this.queue.length >= this.config.queueSize) {
        reject(new Error('Bulkhead queue is full'));
        return;
      }

      // Add to queue
      this.queue.push({
        operation,
        resolve,
        reject,
        timestamp: Date.now(),
      });
    });
  }

  private async executeOperation<T>(
    operation: () => Promise<T>,
    resolve: (value: T) => void,
    reject: (error: any) => void
  ): Promise<void> {
    this.running++;

    try {
      const result = await operation();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.processQueue();
    }
  }

  private processQueue(): void {
    // Process expired queue items
    const now = Date.now();
    this.queue = this.queue.filter(item => {
      if (now - item.timestamp > this.config.queueTimeout) {
        item.reject(new Error('Queue timeout exceeded'));
        return false;
      }
      return true;
    });

    // Execute next item if capacity allows
    while (this.running < this.config.maxConcurrency && this.queue.length > 0) {
      const item = this.queue.shift()!;
      this.executeOperation(item.operation, item.resolve, item.reject);
    }
  }

  getStats(): {
    running: number;
    queued: number;
    capacity: number;
    utilization: number;
  } {
    return {
      running: this.running,
      queued: this.queue.length,
      capacity: this.config.maxConcurrency,
      utilization: this.running / this.config.maxConcurrency,
    };
  }
}

/**
 * Circuit breaker pattern implementation
 */
export class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private failures = 0;
  private lastFailureTime = 0;
  private nextAttemptTime = 0;
  private successCount = 0;

  constructor(private config: {
    failureThreshold: number;
    recoveryTimeout: number;
    monitoringPeriod: number;
    successThreshold?: number;
  }) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() < this.nextAttemptTime) {
        throw new Error('Circuit breaker is open');
      }
      this.state = 'half-open';
      this.successCount = 0;
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;

    if (this.state === 'half-open') {
      this.successCount++;
      if (this.successCount >= (this.config.successThreshold || 1)) {
        this.state = 'closed';
      }
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.config.failureThreshold) {
      this.state = 'open';
      this.nextAttemptTime = Date.now() + this.config.recoveryTimeout;
    }
  }

  getState(): {
    state: string;
    failures: number;
    lastFailureTime: number;
    nextAttemptTime: number;
  } {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime,
    };
  }

  reset(): void {
    this.state = 'closed';
    this.failures = 0;
    this.lastFailureTime = 0;
    this.nextAttemptTime = 0;
    this.successCount = 0;
  }
}

/**
 * Comprehensive resilience wrapper
 */
export class ResilienceWrapper {
  private retryManager: RetryManager;
  private bulkheadManager: BulkheadManager;
  private circuitBreaker: CircuitBreaker;

  constructor(config: {
    retry?: RetryConfig;
    timeout?: TimeoutConfig;
    bulkhead?: BulkheadConfig;
    circuitBreaker?: {
      failureThreshold: number;
      recoveryTimeout: number;
      monitoringPeriod: number;
      successThreshold?: number;
    };
  }) {
    if (config.retry) {
      this.retryManager = new RetryManager(config.retry);
    }

    if (config.bulkhead) {
      this.bulkheadManager = new BulkheadManager(config.bulkhead);
    }

    if (config.circuitBreaker) {
      this.circuitBreaker = new CircuitBreaker(config.circuitBreaker);
    }
  }

  async execute<T>(
    operation: () => Promise<T>,
    options?: {
      timeout?: TimeoutConfig;
      context?: { operationName?: string; agentId?: string };
    }
  ): Promise<T> {
    const wrappedOperation = async () => {
      let currentOperation = operation;

      // Apply timeout if specified
      if (options?.timeout) {
        currentOperation = () => TimeoutManager.execute(operation, options.timeout!);
      }

      // Apply circuit breaker
      if (this.circuitBreaker) {
        currentOperation = () => this.circuitBreaker.execute(currentOperation);
      }

      // Apply bulkhead
      if (this.bulkheadManager) {
        currentOperation = () => this.bulkheadManager.execute(currentOperation);
      }

      return currentOperation();
    };

    // Apply retry with all other patterns
    if (this.retryManager) {
      return this.retryManager.execute(wrappedOperation, options?.context);
    }

    return wrappedOperation();
  }

  getStats(): {
    bulkhead?: ReturnType<BulkheadManager['getStats']>;
    circuitBreaker?: ReturnType<CircuitBreaker['getState']>;
  } {
    return {
      bulkhead: this.bulkheadManager?.getStats(),
      circuitBreaker: this.circuitBreaker?.getState(),
    };
  }
}