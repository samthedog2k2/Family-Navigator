/**
 * Token Bucket Rate Limiter Implementation
 * Provides smooth rate limiting with burst capacity
 */

export interface RateLimiterConfig {
  requestsPerSecond: number;
  burstSize: number;
  enabled: boolean;
}

export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly config: RateLimiterConfig;

  constructor(config: RateLimiterConfig) {
    this.config = config;
    this.tokens = config.burstSize;
    this.lastRefill = Date.now();
  }

  /**
   * Check if request is allowed and consume a token
   */
  async allowRequest(): Promise<boolean> {
    if (!this.config.enabled) {
      return true;
    }

    this.refillTokens();

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }

    return false;
  }

  /**
   * Wait until a token becomes available
   */
  async waitForToken(): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    while (!(await this.allowRequest())) {
      // Calculate wait time until next token
      const waitTime = 1000 / this.config.requestsPerSecond;
      await this.delay(Math.min(waitTime, 100)); // Cap at 100ms
    }
  }

  /**
   * Get current rate limiter status
   */
  getStatus(): {
    availableTokens: number;
    maxTokens: number;
    refillRate: number;
    isEnabled: boolean;
  } {
    this.refillTokens();

    return {
      availableTokens: Math.floor(this.tokens),
      maxTokens: this.config.burstSize,
      refillRate: this.config.requestsPerSecond,
      isEnabled: this.config.enabled,
    };
  }

  /**
   * Reset the rate limiter
   */
  reset(): void {
    this.tokens = this.config.burstSize;
    this.lastRefill = Date.now();
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<RateLimiterConfig>): void {
    Object.assign(this.config, newConfig);

    // Reset if burst size changed
    if (newConfig.burstSize !== undefined) {
      this.tokens = Math.min(this.tokens, newConfig.burstSize);
    }
  }

  // Private methods

  private refillTokens(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = (timePassed / 1000) * this.config.requestsPerSecond;

    this.tokens = Math.min(this.config.burstSize, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Multi-tier rate limiter for different priority levels
 */
export class PriorityRateLimiter {
  private limiters: Map<string, RateLimiter> = new Map();

  constructor(configs: Record<string, RateLimiterConfig>) {
    for (const [priority, config] of Object.entries(configs)) {
      this.limiters.set(priority, new RateLimiter(config));
    }
  }

  async allowRequest(priority: string = 'medium'): Promise<boolean> {
    const limiter = this.limiters.get(priority);
    if (!limiter) {
      throw new Error(`Unknown priority level: ${priority}`);
    }

    return limiter.allowRequest();
  }

  async waitForToken(priority: string = 'medium'): Promise<void> {
    const limiter = this.limiters.get(priority);
    if (!limiter) {
      throw new Error(`Unknown priority level: ${priority}`);
    }

    return limiter.waitForToken();
  }

  getStatus(): Record<string, ReturnType<RateLimiter['getStatus']>> {
    const status: Record<string, ReturnType<RateLimiter['getStatus']>> = {};

    for (const [priority, limiter] of this.limiters.entries()) {
      status[priority] = limiter.getStatus();
    }

    return status;
  }

  updateConfig(priority: string, config: Partial<RateLimiterConfig>): void {
    const limiter = this.limiters.get(priority);
    if (limiter) {
      limiter.updateConfig(config);
    }
  }
}