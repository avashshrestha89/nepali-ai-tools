import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { adminPassword } = req.body

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Get all user keys from Redis
    const keys = await redis.keys('user:*')
    
    if (!keys || keys.length === 0) {
      return res.status(200).json({ customers: [] })
    }

    // Fetch all users
    const customers = []
for (const key of keys) {
  const raw = await redis.get(key)
  if (raw) {
    const user = typeof raw === 'string' ? JSON.parse(raw) : raw
    
    // Fetch admin notes
    const adminRaw = await redis.get(`admin:user:${user.email}`)
    const adminData = adminRaw ? (typeof adminRaw === 'string' ? JSON.parse(adminRaw) : adminRaw) : {}

    customers.push({
      email: user.email,
      credits: user.credits || 0,
      tier: user.tier || 'free',
      isLegacy: user.isLegacy || false,
      isFounder: user.isFounder || false,
      createdAt: user.createdAt || null,
      totalCreditsAssigned: user.totalCreditsAssigned || null,
      generationsUsed: user.generationsUsed || 0,
      // Admin notes
      adminName: adminData.name || '',
      adminPhone: adminData.phone || '',
      adminNotes: adminData.notes || '',
      adminTags: adminData.tags || [],
    })
  }
}

    // Sort by credits descending
    customers.sort((a, b) => b.credits - a.credits)

    return res.status(200).json({ customers })

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
