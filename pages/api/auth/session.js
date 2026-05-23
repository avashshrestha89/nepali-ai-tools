import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const sessionToken = req.cookies.swor_session
  if (!sessionToken) return res.status(200).json({ loggedIn: false })

  try {
    const email = await redis.get(`session:${sessionToken}`)
    if (!email) return res.status(200).json({ loggedIn: false })

    const raw = await redis.get(`user:${email}`)
    if (!raw) return res.status(200).json({ loggedIn: false })

    const user = typeof raw === 'string' ? JSON.parse(raw) : raw

    const betaRemaining = user.betaActive
      ? Math.max(0, user.generationsLimit - user.generationsUsed)
      : 0

    const paidBalance = user.balance || 0
    const totalRemaining = betaRemaining + paidBalance

    return res.status(200).json({
      loggedIn: true,
      email: user.email,
      betaActive: user.betaActive,
      betaRemaining,
      paidBalance,
      totalRemaining,
      charsPerGeneration: user.charsPerGeneration || 500,
    })
  } catch (error) {
    console.error('Session error:', error)
    return res.status(500).json({ error: error.message })
  }
}
