import { Injectable } from '@nestjs/common';

interface FailedAttempt {
  count: number;
  lastAttempt: number;
  lockoutUntil?: number;
}

@Injectable()
export class BruteForceService {
  private failedAttempts = new Map<string, FailedAttempt>();

  private readonly maxAttempts = 5;
  private readonly lockoutDurationMs = 15 * 60 * 1000;
  private readonly resetWindowMs = 15 * 60 * 1000;
  private readonly progressiveDelayMs: number[] = [0, 500, 1000, 2000, 4000];

  isLocked(key: string): { locked: boolean; remainingMs?: number } {
    const record = this.failedAttempts.get(key);
    const now = Date.now();

    if (!record) {
      return { locked: false };
    }

    if (now - record.lastAttempt > this.resetWindowMs) {
      this.failedAttempts.delete(key);
      return { locked: false };
    }

    if (record.lockoutUntil && now < record.lockoutUntil) {
      const remainingMs = record.lockoutUntil - now;
      return { locked: true, remainingMs };
    }

    return { locked: false };
  }

  recordFailure(key: string): {
    locked: boolean;
    delay: number;
    remainingMs?: number;
  } {
    const record = this.failedAttempts.get(key) || {
      count: 0,
      lastAttempt: Date.now(),
    };
    const now = Date.now();

    if (now - record.lastAttempt > this.resetWindowMs) {
      record.count = 0;
    }

    record.count++;
    record.lastAttempt = now;

    const delayIndex = Math.min(
      record.count - 1,
      this.progressiveDelayMs.length - 1,
    );
    const delay = this.progressiveDelayMs[delayIndex];

    if (record.count >= this.maxAttempts) {
      record.lockoutUntil = now + this.lockoutDurationMs;
      this.failedAttempts.set(key, record);
      return { locked: true, delay, remainingMs: this.lockoutDurationMs };
    }

    this.failedAttempts.set(key, record);
    return { locked: false, delay };
  }

  clearFailures(key: string): void {
    this.failedAttempts.delete(key);
  }

  getAttempts(key: string): number {
    const record = this.failedAttempts.get(key);
    if (!record) return 0;

    const now = Date.now();
    if (now - record.lastAttempt > this.resetWindowMs) {
      this.failedAttempts.delete(key);
      return 0;
    }

    return record.count;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.failedAttempts.entries()) {
      if (
        now - record.lastAttempt > this.resetWindowMs &&
        (!record.lockoutUntil || now > record.lockoutUntil)
      ) {
        this.failedAttempts.delete(key);
      }
    }
  }
}
