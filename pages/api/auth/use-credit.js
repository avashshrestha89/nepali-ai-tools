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

    const charLimit = user.charsPerGeneration || 500
    if (charCount > charLimit) {
      return res.status(400).json({
        error: `Text too long. Maximum ${charLimit} characters allowed.`,
        limit: charLimit,
      })
    }

    // Use beta credits first
    if (user.betaActive && user.generationsUsed < user.generationsLimit) {
      user.generationsUsed += 1
      await redis.set(`user:${email}`, JSON.stringify(user))
      return res.status(200).json({
        success: true,
        source: 'beta',
        betaRemaining: user.generationsLimit - user.generationsUsed,
        paidBalance: user.balance || 0,
      })
    }

    // Use paid balance
    const balance = user.balance || 0
    if (balance > 0) {
      user.balance = balance - 1
      await redis.set(`user:${email}`, JSON.stringify(user))
      return res.status(200).json({
        success: true,
        source: 'paid',
        betaRemaining: 0,
        paidBalance: user.balance,
      })
    }

    return res.status(403).json({
      error: 'No credits remaining',
      betaRemaining: 0,
      paidBalance: 0,
    })
  } catch (error) {
    console.error('Use credit error:', error)
    return res.status(500).json({ error: error.message })
  }
}
