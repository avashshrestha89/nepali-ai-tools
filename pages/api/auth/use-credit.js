import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { charCount } = req.body
  const sessionToken = req.cookies.swor_session

  if (!sessionToken) return res.status(401).json({ error: 'Not logged in' })

  try {
    const email = await redis.get(`session:${sessionToken}`)
    if (!email) return res.status(401).json({ error: 'Invalid session' })

    const raw = await redis.get(`user:${email}`)
    if (!raw) return res.status(401).json({ error: 'User not found' })

    const user = typeof raw === 'string' ? JSON.parse(raw) : raw

    // Check char limit
    if (charCount > user.charsPerGeneration) {
      return res.status(400).json({
        error: `Text too long. Maximum ${user.charsPerGeneration} characters allowed.`,
        limit: user.charsPerGeneration,
      })
    }

    // Check generation limit
    if (user.generationsUsed >= user.generationsLimit) {
      return res.status(403).json({
        error: 'Generation limit reached',
        generationsUsed: user.generationsUsed,
        generationsLimit: user.generationsLimit,
      })
    }

    // Deduct one generation
    user.generationsUsed += 1
    await redis.set(`user:${email}`, JSON.stringify(user))

    return res.status(200).json({
      success: true,
      generationsRemaining: user.generationsLimit - user.generationsUsed,
    })
  } catch (error) {
    console.error('Use credit error:', error)
    return res.status(500).json({ error: error.message })
  }
}
