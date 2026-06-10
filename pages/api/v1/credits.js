// pages/api/v1/credits.js
// Check remaining credits for an API key
// Usage: GET /api/v1/credits
// Headers: x-swor-api-key: YOUR_API_KEY

import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' })
  }

  const apiKey = req.headers['x-swor-api-key']
  if (!apiKey) {
    return res.status(401).json({
      error: 'Missing API key. Add header: x-swor-api-key: YOUR_KEY'
    })
  }

  const email = await redis.get(`apikey:${apiKey}`)
  if (!email) {
    return res.status(401).json({ error: 'Invalid API key.' })
  }

  try {
    const raw = await redis.get(`user:${email}`)
    if (!raw) return res.status(404).json({ error: 'User account not found.' })
    const user = typeof raw === 'string' ? JSON.parse(raw) : raw

    return res.status(200).json({
      success: true,
      email,
      credits_remaining: user.credits || 0,
      credit_costs: {
        voiceover_per_500_chars: 25,
        music_per_30_seconds: 100,
        subtitles: 'free',
      },
      recharge: 'WhatsApp +19255379425 or email meroadaiofficial@gmail.com'
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
