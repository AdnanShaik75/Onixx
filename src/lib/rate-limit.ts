interface RateLimitEntry {
  attempts: number;
  firstAttemptAt: number;
  lastAttemptAt: number;
  lockedUntil: number | null;
}

interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
  lockoutMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5,
  lockoutMs: 30 * 60 * 1000, // 30 minutes lockout
};

const stores = new Map<string, Map<string, RateLimitEntry>>();

function getStore(namespace: string): Map<string, RateLimitEntry> {
  if (!stores.has(namespace)) {
    stores.set(namespace, new Map());
  }
  return stores.get(namespace)!;
}

function cleanup(namespace: string, config: RateLimitConfig) {
  const store = getStore(namespace);
  const now = Date.now();
  const windowStart = now - config.windowMs;

  for (const [key, entry] of store) {
    if (entry.lockedUntil && entry.lockedUntil < now) {
      store.delete(key);
    } else if (entry.lastAttemptAt < windowStart && !entry.lockedUntil) {
      store.delete(key);
    }
  }
}

export function checkRateLimit(
  namespace: string,
  key: string,
  config: Partial<RateLimitConfig> = {}
): { allowed: boolean; retryAfterMs?: number; remaining: number } {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const store = getStore(namespace);

  cleanup(namespace, cfg);

  const now = Date.now();
  const entry = store.get(key);

  if (entry?.lockedUntil) {
    if (entry.lockedUntil > now) {
      return {
        allowed: false,
        retryAfterMs: entry.lockedUntil - now,
        remaining: 0,
      };
    }
    store.delete(key);
  }

  if (!entry || entry.firstAttemptAt < now - cfg.windowMs) {
    store.set(key, {
      attempts: 1,
      firstAttemptAt: now,
      lastAttemptAt: now,
      lockedUntil: null,
    });
    return { allowed: true, remaining: cfg.maxAttempts - 1 };
  }

  entry.attempts++;
  entry.lastAttemptAt = now;

  if (entry.attempts > cfg.maxAttempts) {
    entry.lockedUntil = now + cfg.lockoutMs;
    return {
      allowed: false,
      retryAfterMs: cfg.lockoutMs,
      remaining: 0,
    };
  }

  return {
    allowed: true,
    remaining: cfg.maxAttempts - entry.attempts,
  };
}

export function recordFailure(namespace: string, key: string, config: Partial<RateLimitConfig> = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const store = getStore(namespace);
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.firstAttemptAt < now - cfg.windowMs) {
    store.set(key, {
      attempts: 1,
      firstAttemptAt: now,
      lastAttemptAt: now,
      lockedUntil: null,
    });
    return;
  }

  entry.attempts++;
  entry.lastAttemptAt = now;

  if (entry.attempts > cfg.maxAttempts) {
    entry.lockedUntil = now + cfg.lockoutMs;
  }
}

export function resetRateLimit(namespace: string, key: string) {
  const store = getStore(namespace);
  store.delete(key);
}
