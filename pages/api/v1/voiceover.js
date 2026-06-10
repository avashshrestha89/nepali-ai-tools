// pages/api/v1/voiceover.js
// Public API endpoint for Swor AI voiceover generation
// Usage: POST /api/v1/voiceover
// Headers: x-swor-api-key: YOUR_API_KEY
// Body: { text: "नमस्ते...", voice_id: "1zUSi8LeHs9M2mV8X6YS" }
// Returns: MP3 audio file

import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const VOICEOVER_CREDIT_COST = 25
const MAX_CHARS = 2000
const RATE_LIMIT_REQUESTS = 10
const RATE_LIMIT_WINDOW = 60 // seconds

const VALID_VOICE_IDS = [
  '1zUSi8LeHs9M2mV8X6YS', 'LK1Sn9bmEczSFI65RF0v', 'duDBJHU6G1oq7ZdK4Kxf',
  'TmPeb2hSxdVrThJLywkg', 'ecp3DWciuUyW7BYM7II1', 'f0JpDwzbGK384Dd1WH2s',
  'Pc57DSBXmCXyEAmow7lW', '6qL48o1LBmtR94hIYAQh', 'FszY75334ExxVmg7yl0U',
  'WdZjiN0nNcik2LBjOHiv', 'CwhRBWXzGAHq8TQ4Fs17', 'TX3LPaxmHKxFdv7VOQHJ',
  'g1FVKFidZjHPxXdfA89c', '2W8HrWcBFzCEf5cQQdIL', 'rHhok70RpCi5GgianXRA',
]

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  // 1 — Validate API key
  const apiKey = req.headers['x-swor-api-key']
  if (!apiKey) {
    return res.status(401).json({
      error: 'Missing API key. Add header: x-swor-api-key: YOUR_KEY',
      docs: 'Contact meroadaiofficial@gmail.com to get your API key.'
    })
  }

  const email = await redis.get(`apikey:${apiKey}`)
  if (!email) {
    return res.status(401).json({ error: 'Invalid API key.' })
  }

  // 2 — Rate limiting (10 requests per minute)
  const rateLimitKey = `ratelimit:${apiKey}:${Math.floor(Date.now() / (RATE_LIMIT_WINDOW * 1000))}`
  const requests = await redis.incr(rateLimitKey)
  if (requests === 1) await redis.expire(rateLimitKey, RATE_LIMIT_WINDOW)
  if (requests > RATE_LIMIT_REQUESTS) {
    return res.status(429).json({
      error: `Rate limit exceeded. Max ${RATE_LIMIT_REQUESTS} requests per minute.`
    })
  }

  // 3 — Validate request body
  const { text, voice_id } = req.body
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Missing required field: text' })
  }
  if (text.length > MAX_CHARS) {
    return res.status(400).json({
      error: `Text too long. Maximum ${MAX_CHARS} characters per request. Received: ${text.length}`
    })
  }
  const voiceId = voice_id || '1zUSi8LeHs9M2mV8X6YS'
  if (!VALID_VOICE_IDS.includes(voiceId)) {
    return res.status(400).json({
      error: 'Invalid voice_id.',
      valid_voices: VALID_VOICE_IDS
    })
  }

  // 4 — Check credits
  const raw = await redis.get(`user:${email}`)
  if (!raw) return res.status(404).json({ error: 'User account not found.' })
  const user = typeof raw === 'string' ? JSON.parse(raw) : raw
  const credits = user.credits || 0

  if (credits < VOICEOVER_CREDIT_COST) {
    return res.status(402).json({
      error: `Insufficient credits. Need ${VOICEOVER_CREDIT_COST}, have ${credits}.`,
      credits_remaining: credits,
      recharge: 'Contact meroadaiofficial@gmail.com or WhatsApp +19255379425 to top up.'
    })
  }

  // 5 — Generate voiceover via ElevenLabs
  try {
    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    )

    if (!elevenRes.ok) {
      const err = await elevenRes.text()
      console.error('ElevenLabs error:', err)
      return res.status(500).json({ error: 'Voice generation failed. Please try again.' })
    }

    // 6 — Deduct credits
    user.credits = credits - VOICEOVER_CREDIT_COST
    await redis.set(`user:${email}`, JSON.stringify(user))

    // 7 — Return MP3
    const audioBuffer = await elevenRes.arrayBuffer()
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Disposition', 'attachment; filename="swor_voiceover.mp3"')
    res.setHeader('X-Credits-Used', VOICEOVER_CREDIT_COST)
    res.setHeader('X-Credits-Remaining', user.credits)
    return res.send(Buffer.from(audioBuffer))

  } catch (error) {
    console.error('API voiceover error:', error)
    return res.status(500).json({ error: error.message })
  }
}
