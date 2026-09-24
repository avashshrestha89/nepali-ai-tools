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

    // Check if this token already has a session created
    // (Gmail Safe Browsing pre-clicks links — we ignore non-browser requests)
    const userAgent = req.headers['user-agent'] || ''
    const isBot = /GoogleImageProxy|Googlebot|Yahoo|bot|crawler|spider|preview/i.test(userAgent)

    if (isBot) {
      // Gmail or other bot pre-clicked — do NOT consume the token
      return res.status(200).json({ success: false, message: 'Bot detected' })
    }

    // Real user click — consume token and create session
    await redis.del(`magic:${token}`)

    const sessionToken = Math.random().toString(36).substr(2) +
      Math.random().toString(36).substr(2) +
      Date.now().toString(36)

    await redis.setex(`session:${sessionToken}`, 60 * 60 * 24 * 30, email)

    res.setHeader('Set-Cookie',
      `swor_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}; Secure`
    )

    return res.status(200).json({ success: true, email })
  } catch (error) {
    console.error('Verify error:', error)
    return res.status(500).json({ error: error.message })
  }
}
