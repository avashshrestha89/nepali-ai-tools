/**
 * Shared Redis client factory with environment isolation.
 *
 * Rules:
 *  - Preview deployments (VERCEL_ENV === 'preview') MUST use STAGING_UPSTASH_URL
 *    and STAGING_UPSTASH_TOKEN. If either is missing the factory throws — the
 *    request handler catches this and returns 503. There is NO fallback to the
 *    integration-injected production credentials in Preview.
 *
 *  - Production / Development / local use the integration-injected vars
 *    (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN) as before.
 *
 * Secrets are never written to logs.
 */
import { Redis } from '@upstash/redis'

export function createRedisClient() {
  const env = process.env.VERCEL_ENV // 'production' | 'preview' | 'development' | undefined

  if (env === 'preview') {
    const url   = process.env.STAGING_UPSTASH_URL
    const token = process.env.STAGING_UPSTASH_TOKEN

    if (!url || !token) {
      const missing = [
        !url   && 'STAGING_UPSTASH_URL',
        !token && 'STAGING_UPSTASH_TOKEN',
      ].filter(Boolean).join(', ')

      // Log env name only — never log token values.
      console.error(`[redis] Preview misconfigured — missing env vars: ${missing}`)
      throw new Error(
        `Redis not configured for Preview. Missing: ${missing}. ` +
        `Add these as Preview-only variables in Vercel. ` +
        `Refusing to fall back to production credentials.`
      )
    }

    return new Redis({ url, token })
  }

  // Production / Development / local
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}
