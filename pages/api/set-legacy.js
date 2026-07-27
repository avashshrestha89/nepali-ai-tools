import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email: rawEmail, adminPassword, action } = req.body
  const email = rawEmail?.trim().toLowerCase()

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!email) return res.status(400).json({ error: 'Email required' })

  try {
    const raw = await redis.get(`user:${email}`)
    if (!raw) return res.status(404).json({ error: 'User not found' })

    const user = typeof raw === 'string' ? JSON.parse(raw) : raw

    user.isLegacy = action === 'set' ? true : false

    await redis.set(`user:${email}`, JSON.stringify(user))

    return res.status(200).json({
      success: true,
      email,
      isLegacy: user.isLegacy,
      message: `Legacy status ${action === 'set' ? 'enabled' : 'removed'} for ${email}`,
    })
  } catch (error) {
    console.error('Set legacy error:', error)
    return res.status(500).json({ error: error.message })
  }
}
