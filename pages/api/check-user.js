import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, adminPassword } = req.body

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!email) return res.status(400).json({ error: 'Email required' })

  try {
    const raw = await redis.get(`user:${email}`)

    if (!raw) {
      return res.status(404).json({ error: `No account found for ${email}` })
    }

    const user = typeof raw === 'string' ? JSON.parse(raw) : raw

    const betaRemaining = user.betaActive
      ? Math.max(0, (user.generationsLimit || 0) - (user.generationsUsed || 0))
      : 0

    let founderMusicRemaining = 0
    if (user.isFounder) {
      const now = new Date()
      const resetDate = user.founderMusicResetAt ? new Date(user.founderMusicResetAt) : null
      founderMusicRemaining = (!resetDate || now >= resetDate) ? 5 : (user.founderMusicThisMonth || 0)
    }

    return res.status(200).json({
      success: true,
      email: user.email,
      credits: user.credits || 0,
      tier: user.tier || 'beta',
      betaActive: user.betaActive || false,
      betaRemaining,
      isFounder: user.isFounder || false,
      founderMusicRemaining,
      musicFreeUsed: user.musicFreeUsed || false,
      createdAt: user.createdAt || null,
    })
  } catch (error) {
    console.error('Check user error:', error)
    return res.status(500).json({ error: error.message })
  }
}
