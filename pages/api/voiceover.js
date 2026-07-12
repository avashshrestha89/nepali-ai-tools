import fetch from 'node-fetch'
import { put } from '@vercel/blob'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const MAX_HISTORY = 5

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, voiceId, voiceName } = req.body

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'No text provided' })
  }
  if (!voiceId) {
    return res.status(400).json({ error: 'No voice selected' })
  }

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
          text: text.trim(),
          model_id: 'eleven_v3',
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
      const errText = await response.text()
      return res.status(500).json({ error: 'ElevenLabs error: ' + errText })
    }

    const audioBuffer = await response.arrayBuffer()
    const audioBytes = Buffer.from(audioBuffer)

    // Save to Vercel Blob
    const timestamp = Date.now()
    const sessionToken = req.cookies.swor_session
    let blobUrl = null

    if (sessionToken) {
      try {
        const email = await redis.get(`session:${sessionToken}`)
        if (email) {
          const filename = `voiceovers/${email}/${timestamp}.mp3`
          const blob = await put(filename, audioBytes, {
            access: 'public',
            contentType: 'audio/mpeg',
          })
          blobUrl = blob.url

          // Save to history in Redis (keep last 5 only)
          const historyRaw = await redis.get(`history:${email}`)
          const history = historyRaw
            ? (typeof historyRaw === 'string' ? JSON.parse(historyRaw) : historyRaw)
            : []

          const newEntry = {
            id: timestamp,
            text: text.trim().slice(0, 80),
            voiceName: voiceName || voiceId,
            url: blobUrl,
            createdAt: new Date().toISOString(),
          }

          const updated = [newEntry, ...history].slice(0, MAX_HISTORY)
          await redis.set(`history:${email}`, JSON.stringify(updated))
        }
      } catch (historyError) {
        console.error('History save error:', historyError)
        // Don't fail the whole request if history saving fails
      }
    }

    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Disposition', 'attachment; filename="nepali_voiceover.mp3"')
    return res.send(audioBytes)

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
