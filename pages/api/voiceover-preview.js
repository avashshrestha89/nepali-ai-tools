import fetch from 'node-fetch'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const PREVIEW_CHAR_LIMIT = 200
const PREVIEW_COOLDOWN_SECONDS = 86400 // 24 hours
const MAX_PREVIEWS_PER_DAY = 3

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, voiceId } = req.body
  if (!text || !voiceId) {
    return res.status(400).json({ error: 'Missing text or voice' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress
  const redisKey = `preview:${ip}`

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
