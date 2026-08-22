import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { adminPassword, email, name, phone, notes, tags } = req.body

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!email) {
    return res.status(400).json({ error: 'Email required' })
  }

  try {
    const existing = await redis.get(`admin:user:${email}`)
    const current = existing ? (typeof existing === 'string' ? JSON.parse(existing) : existing) : {}

    const updated = {
      ...current,
      name: name || current.name || '',
      phone: phone || current.phone || '',
      notes: notes !== undefined ? notes : current.notes || '',
      tags: tags || current.tags || [],
      updatedAt: new Date().toISOString()
    }

    await redis.set(`admin:user:${email}`, JSON.stringify(updated))

    return res.status(200).json({ success: true, data: updated })

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
