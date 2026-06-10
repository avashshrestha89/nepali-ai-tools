// pages/api/generate-api-key.js
// Admin endpoint to generate API key for a user
// Usage: POST /api/generate-api-key
// Body: { email, adminPassword }

import { Redis } from '@upstash/redis'
import crypto from 'crypto'

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
    if (!raw) return res.status(404).json({ error: `No account found for ${email}` })

    const user = typeof raw === 'string' ? JSON.parse(raw) : raw

    // Generate unique API key: swor_ + 32 random hex chars
    const apiKey = `swor_${crypto.randomBytes(16).toString('hex')}`

    // Store in Redis: apikey:KEY → email (for lookup)
    await redis.set(`apikey:${apiKey}`, email)

    // Store key in user record
    user.apiKey = apiKey
    user.apiKeyCreatedAt = new Date().toISOString()
    await redis.set(`user:${email}`, JSON.stringify(user))

    return res.status(200).json({
      success: true,
      email,
      api_key: apiKey,
      message: `API key generated for ${email}. Send this key via WhatsApp.`,
      usage: {
        endpoint: 'POST https://meroadai.com/api/v1/voiceover',
        header: `x-swor-api-key: ${apiKey}`,
        body: '{ "text": "नमस्ते...", "voice_id": "1zUSi8LeHs9M2mV8X6YS" }',
        credits_check: 'GET https://meroadai.com/api/v1/credits'
      }
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
