import fetch from 'node-fetch'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const PREVIEW_CHAR_LIMIT = 200
const PREVIEW_COOLDOWN_SECONDS = 86400 // 24 hours
const MAX_PREVIEWS_PER_DAY = 1

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, voiceId } = req.body
  if (!text || !voiceId) {
    return res.status(400).json({ error: 'Missing text or voice' })
  }

 const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress
const ja4 = req.headers['x-vercel-ja4-digest'] || 'unknown'

// Get or create device cookie
let deviceId = req.cookies?.['_swor_device_id']
if (!deviceId) {
  deviceId = Math.random().toString(36).substr(2) + Date.now().toString(36)
}

// Check ALL identifiers
const [ipCount, deviceCount, ja4Count] = await Promise.all([
  redis.get(`preview:ip:${ip}`),
  redis.get(`preview:device:${deviceId}`),
  redis.get(`preview:ja4:${ja4}`),
])

if (ipCount >= 1 || deviceCount >= 1 || ja4Count >= 1) {
  return res.status(429).json({ 
    error: 'Free preview limit reached. Purchase a pack to continue.' 
  })
}

// Set all limits
await Promise.all([
  redis.setex(`preview:ip:${ip}`, 86400, 1),
  redis.setex(`preview:device:${deviceId}`, 2592000, 1), // 30 days
  redis.setex(`preview:ja4:${ja4}`, 86400, 1),
])

// Set device cookie on response
res.setHeader('Set-Cookie', `_swor_device_id=${deviceId}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=31536000`)
  // Check how many previews this IP has done today
  const count = await redis.get(redisKey)
  const currentCount = count ? parseInt(count) : 0

  if (currentCount >= MAX_PREVIEWS_PER_DAY) {
    return res.status(429).json({ 
      error: 'Daily free preview limit reached. Sign up for a pack to continue generating voiceovers.' 
    })
  }

  // Increment counter — expires in 24 hours
  if (currentCount === 0) {
    await redis.setex(redisKey, PREVIEW_COOLDOWN_SECONDS, 1)
  } else {
    await redis.incr(redisKey)
  }

  const previewText = text.trim().slice(0, PREVIEW_CHAR_LIMIT)

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: previewText,
          model_id: 'eleven_v3',
          output_format: 'mp3_44100_64',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.4,
            use_speaker_boost: true,
          },
        }),
      }
    )

    if (!response.ok) {
      return res.status(500).json({ error: 'Preview generation failed. Please try again.' })
    }

    const audioBuffer = await response.arrayBuffer()
    const audioBytes = Buffer.from(audioBuffer)
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Disposition', 'inline; filename="preview.mp3"')
    return res.send(audioBytes)

  } catch (error) {
    return res.status(500).json({ error: 'Preview generation failed. Please try again.' })
  }
}
