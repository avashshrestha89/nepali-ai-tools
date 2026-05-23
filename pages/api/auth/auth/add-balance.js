import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, amount, adminPassword } = req.body

  // Verify admin password
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!email || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Email and valid amount required' })
  }

  try {
    const raw = await redis.get(`user:${email}`)

    if (!raw) {
      // Create user if they don't exist yet
      const newUser = {
        email,
        createdAt: new Date().toISOString(),
        tier: 'paid',
        generationsUsed: 0,
        generationsLimit: 0,
        charsPerGeneration: 500,
        betaActive: false,
        betaEndNotified: false,
        balance: parseInt(amount),
      }
      await redis.set(`user:${email}`, JSON.stringify(newUser))
      return res.status(200).json({
        success: true,
        email,
        newBalance: parseInt(amount),
        message: `New user created with ${amount} credits`,
      })
    }

    const user = typeof raw === 'string' ? JSON.parse(raw) : raw
    const oldBalance = user.balance || 0
    user.balance = oldBalance + parseInt(amount)
    user.tier = 'paid'

    await redis.set(`user:${email}`, JSON.stringify(user))

    return res.status(200).json({
      success: true,
      email,
      oldBalance,
      added: parseInt(amount),
      newBalance: user.balance,
      message: `Added ${amount} credits to ${email}`,
    })
  } catch (error) {
    console.error('Add balance error:', error)
    return res.status(500).json({ error: error.message })
  }
}
