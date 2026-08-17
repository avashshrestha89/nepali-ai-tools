import fetch from 'node-fetch'

const PREVIEW_CHAR_LIMIT = 200
const previewTimestamps = new Map()
const PREVIEW_COOLDOWN_MS = 30000

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, voiceId, speed } = req.body

  if (!text || !voiceId) {
    return res.status(400).json({ error: 'Missing text or voice' })
  }

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const lastPreview = previewTimestamps.get(ip)
  if (lastPreview && Date.now() - lastPreview < PREVIEW_COOLDOWN_MS) {
    const waitSeconds = Math.ceil((PREVIEW_COOLDOWN_MS - (Date.now() - lastPreview)) / 1000)
    return res.status(429).json({ error: `Please wait ${waitSeconds} seconds before previewing again.` })
  }
  previewTimestamps.set(ip, Date.now())

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
            speed: parseFloat(speed) || 1.0,
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
    return res.status(500).json({ error: 'Preview failed. Please try again.' })
  }
}
