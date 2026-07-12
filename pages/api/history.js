import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const sessionToken = req.cookies.swor_session
  if (!sessionToken) return res.status(401).json({ error: 'Not logged in' })

  try {
    const email = await redis.get(`session:${sessionToken}`)
    if (!email) return res.status(401).json({ error: 'Invalid session' })

    const history = await redis.get(`history:${email}`)
    const parsed = history
      ? (typeof history === 'string' ? JSON.parse(history) : history)
      : []

    return res.status(200).json({ success: true, history: parsed })
  } catch (error) {
    console.error('History fetch error:', error)
    return res.status(500).json({ error: error.message })
  }
}
