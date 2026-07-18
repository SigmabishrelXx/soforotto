// Lightweight client-side rate limiting.
//
// NOTE: this is a UX guard, not a security control. It prevents accidental
// double-submits and casual spam from a single browser tab. The authoritative
// rate limit must live on the Sub0 backend (per-IP / per-token). See
// DEPLOY.md. A determined user can bypass anything client-side.

type Bucket = { timestamps: number[] }

const buckets: Record<string, Bucket> = {}

export type RateLimitResult = { allowed: boolean; retryAfterMs: number }

export function rateLimit(
  key: string,
  opts: { max: number; windowMs: number; minGapMs?: number },
): RateLimitResult {
  const now = Date.now()
  const bucket = (buckets[key] ??= { timestamps: [] })

  // Drop timestamps outside the window.
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < opts.windowMs)

  // Enforce a minimum gap between consecutive actions.
  if (opts.minGapMs && bucket.timestamps.length > 0) {
    const gap = now - bucket.timestamps[bucket.timestamps.length - 1]
    if (gap < opts.minGapMs) {
      return { allowed: false, retryAfterMs: opts.minGapMs - gap }
    }
  }

  // Enforce the window cap.
  if (bucket.timestamps.length >= opts.max) {
    const retryAfterMs = opts.windowMs - (now - bucket.timestamps[0])
    return { allowed: false, retryAfterMs: Math.max(0, retryAfterMs) }
  }

  bucket.timestamps.push(now)
  return { allowed: true, retryAfterMs: 0 }
}

export function secondsFromMs(ms: number): number {
  return Math.max(1, Math.ceil(ms / 1000))
}
