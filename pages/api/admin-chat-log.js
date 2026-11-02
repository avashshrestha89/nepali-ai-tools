// Admin only: the questions the chat assistant could not answer (newest first).
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { adminPassword } = req.body || {}
  if (!process.env.ADMIN_PASSWORD || adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const rows = await redis.lrange('chat_unanswered', 0, 199)
    const items = (rows || []).map(r => (typeof r === 'string' ? JSON.parse(r) : r))
    return res.status(200).json({ items })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
