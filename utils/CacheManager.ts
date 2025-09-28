import { CacheEntry } from '../lib/coordinator-types';

export class CacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private hitCount: number = 0;
  private missCount: number = 0;
  private maxSize: number;
  private defaultTtl: number;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(config: {
    maxSize?: number;
    defaultTtl?: number;
    cleanupInterval?: number;
  } = {}) {
    this.maxSize = config.maxSize || 1000;
    this.defaultTtl = config.defaultTtl || 5 * 60 * 1000; // 5 minutes

    // Start cleanup process
    if (config.cleanupInterval !== 0) {
      this.startCleanup(config.cleanupInterval || 60 * 1000); // 1 minute
    }
  }

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.missCount++;
      return null;
    }

    // Check if expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    // Update hit count and access time
    entry.hits++;
    this.hitCount++;

    return entry.data as T;
  }

  /**
   * Store data in cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    // Check cache size limit
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }

    const entry: CacheEntry<T> = {
      key,
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTtl,
      hits: 0,
    };

    this.cache.set(key, entry);
  }

  /**
   * Check if data exists in cache (without counting as access)
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry !== undefined && !this.isExpired(entry);
  }

  /**
   * Remove specific entry from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    hitCount: number;
    missCount: number;
    hitRate: number;
    memoryUsage: number;
  } {
    const totalRequests = this.hitCount + this.missCount;
    const hitRate = totalRequests > 0 ? this.hitCount / totalRequests : 0;

    return {
      size: this.cache.size,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate,
      memoryUsage: this.estimateMemoryUsage(),
    };
  }

  /**
   * Get cache entries for debugging
   */
  getEntries(): Array<{ key: string; age: number; hits: number; size: number }> {
    const now = Date.now();
    return Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: now - entry.timestamp,
      hits: entry.hits,
      size: this.estimateEntrySize(entry),
    }));
  }

  /**
   * Generate cache key from parameters
   */
  generateKey(prefix: string, params: Record<string, any>): string {
    // Sort keys for consistent cache keys
    const sortedKeys = Object.keys(params).sort();
    const keyParts = sortedKeys.map(key => `${key}:${JSON.stringify(params[key])}`);
    return `${prefix}:${keyParts.join('|')}`;
  }

  /**
   * Bulk cache operations
   */
  setMany<T>(entries: Array<{ key: string; data: T; ttl?: number }>): void {
    entries.forEach(({ key, data, ttl }) => {
      this.set(key, data, ttl);
    });
  }

  getMany<T>(keys: string[]): Map<string, T> {
    const results = new Map<string, T>();
    keys.forEach(key => {
      const data = this.get<T>(key);
      if (data !== null) {
        results.set(key, data);
      }
    });
    return results;
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    return removedCount;
  }

  /**
   * Destroy cache manager and cleanup resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }

  // Private methods

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private evictLeastUsed(): void {
    if (this.cache.size === 0) return;

    // Find entry with lowest hit count and oldest timestamp
    let leastUsedKey: string | null = null;
    let lowestScore = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      // Score based on hits and age (lower is worse)
      const age = Date.now() - entry.timestamp;
      const score = entry.hits / (age / 1000); // hits per second

      if (score < lowestScore) {
        lowestScore = score;
        leastUsedKey = key;
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  private startCleanup(interval: number): void {
    this.cleanupInterval = setInterval(() => {
      const removed = this.cleanup();
      if (removed > 0 && process.env.NODE_ENV === 'development') {
        console.log(`Cache cleanup: removed ${removed} expired entries`);
      }
    }, interval);
  }

  private estimateMemoryUsage(): number {
    let totalSize = 0;
    for (const entry of this.cache.values()) {
      totalSize += this.estimateEntrySize(entry);
    }
    return totalSize;
  }

  private estimateEntrySize(entry: CacheEntry): number {
    // Rough estimation of memory usage
    const keySize = entry.key.length * 2; // UTF-16
    const dataSize = JSON.stringify(entry.data).length * 2;
    const metadataSize = 64; // Rough estimate for timestamps, hits, etc.

    return keySize + dataSize + metadataSize;
  }
}

/**
 * TTL Cache with automatic expiration
 */
export class TTLCache<K, V> {
  private cache = new Map<K, { value: V; expiry: number }>();

  constructor(private defaultTtl: number = 5 * 60 * 1000) {}

  set(key: K, value: V, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTtl);
    this.cache.set(key, { value, expiry });
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    // Clean up expired entries first
    this.cleanup();
    return this.cache.size;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}