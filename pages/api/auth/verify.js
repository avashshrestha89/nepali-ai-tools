import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { token } = req.query
  if (!token) return res.status(400).json({ error: 'Token required' })

  try {
    const email = await redis.get(`magic:${token}`)
    if (!email) return res.status(401).json({ error: 'Invalid or expired link' })

    // One-time use — delete magic token
    await redis.del(`magic:${token}`)

    // Create session token — expires in 30 days
    const sessionToken = Math.random().toString(36).substr(2) +
      Math.random().toString(36).substr(2) +
      Date.now().toString(36)

    await redis.setex(`session:${sessionToken}`, 60 * 60 * 24 * 30, email)

    // Set session cookie
    res.setHeader('Set-Cookie',
      `swor_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}; Secure`
    )

    return res.status(200).json({ success: true, email })
  } catch (error) {
    console.error('Verify error:', error)
    return res.status(500).json({ error: error.message })
  }
}
