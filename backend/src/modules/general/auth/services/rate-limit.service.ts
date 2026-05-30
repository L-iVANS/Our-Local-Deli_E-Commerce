import { Injectable } from '@nestjs/common';

interface RequestRecord {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimitService {
  private store = new Map<string, RequestRecord>();

  check(
    key: string,
    limit: number,
    windowMs: number,
  ): { allowed: boolean; remaining: number; retryAfter?: number } {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || now >= record.resetTime) {
      this.store.set(key, { count: 1, resetTime: now + windowMs });
      return { allowed: true, remaining: limit - 1 };
    }

    if (record.count >= limit) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      return { allowed: false, remaining: 0, retryAfter };
    }

    record.count++;
    return { allowed: true, remaining: limit - record.count };
  }

  reset(key: string): void {
    this.store.delete(key);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now >= record.resetTime) {
        this.store.delete(key);
      }
    }
  }
}
