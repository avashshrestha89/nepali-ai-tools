/**
 * POST /api/auth/logout
 *
 * Invalidates the current server-side session in Redis and clears the
 * swor_session cookie. Safe to call multiple times (idempotent).
 *
 * Cookie attributes must exactly match those set in verify.js and
 * verify-otp.js so the browser replaces the cookie rather than
 * creating a second one.
 */
import { createRedisClient } from '../../../lib/redis'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const sessionToken = req.cookies?.swor_session

  // Clear the cookie regardless of whether the session exists in Redis.
  // Max-Age=0 instructs the browser to delete the cookie immediately.
  res.setHeader(
    'Set-Cookie',
    'swor_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure'
  )

  if (!sessionToken) {
    // No cookie — already logged out from the browser's perspective.
    return res.status(200).json({ success: true })
  }

  // Best-effort Redis cleanup: delete the server-side session key.
  // If Redis is unavailable the cookie is still cleared, so the user is
  // effectively logged out from the browser. The orphaned session key
  // will expire on its own after 30 days.
  try {
    const redis = createRedisClient()
    await redis.del(`session:${sessionToken}`)
  } catch (err) {
    // Log but do not fail — cookie is already cleared above.
    console.error('logout: Redis DEL failed (session will expire naturally):', err.message)
  }

  return res.status(200).json({ success: true })
}
