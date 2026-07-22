import fetch from 'node-fetch'

const DEMO_VOICES = [
  { voice_id: '1zUSi8LeHs9M2mV8X6YS', name: 'Priyanka', desc: 'Romantic & Elegant' },
  { voice_id: 'WdZjiN0nNcik2LBjOHiv', name: 'Bishnu', desc: 'Wise Documentary' },
  { voice_id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Arjun', desc: 'Energetic Reels' },
]

const DEMO_CHAR_LIMIT = 50
const DEMO_COOLDOWN_MS = 60000 // 1 minute per IP

const ipCooldowns = new Map()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, voiceId } = req.body

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'No text provided.' })
  }

  if (text.length > DEMO_CHAR_LIMIT) {
    return res.status(400).json({ 
      error: `Demo limited to ${DEMO_CHAR_LIMIT} characters.` 
    })
  }

  const validVoice = DEMO_VOICES.find(v => v.voice_id === voiceId)
  if (!validVoice) {
    return res.status(400).json({ error: 'Invalid voice.' })
  }

  // IP rate limiting — 1 demo per minute per IP
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const now = Date.now()
  const lastUsed = ipCooldowns.get(ip)

  if (lastUsed && (now - lastUsed) < DEMO_COOLDOWN_MS) {
    const waitSeconds = Math.ceil((DEMO_COOLDOWN_MS - (now - lastUsed)) / 1000)
    return res.status(429).json({ 
      error: `Please wait ${waitSeconds} seconds before trying again.` 
    })
  }

  ipCooldowns.set(ip, now)

  // Clean up old entries every 100 requests
  if (ipCooldowns.size > 100) {
    for (const [key, val] of ipCooldowns.entries()) {
      if (now - val > DEMO_COOLDOWN_MS) ipCooldowns.delete(key)
    }
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
      return res.status(500).json({ error: 'Demo generation failed.' })
    }

    const audioBuffer = await response.arrayBuffer()
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'no-store')
    return res.send(Buffer.from(audioBuffer))

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
