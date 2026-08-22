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
    const keys = await redis.lrange('demo_leads', 0, -1)
    
    if (!keys || keys.length === 0) {
      return res.status(200).json({ leads: [] })
    }

    const leads = []
    for (const key of keys) {
      const raw = await redis.get(key)
      if (raw) {
        const lead = typeof raw === 'string' ? JSON.parse(raw) : raw
        leads.push(lead)
      }
    }

    // Sort by newest first
    leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return res.status(200).json({ leads })

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
