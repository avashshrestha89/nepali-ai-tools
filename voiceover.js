import fetch from 'node-fetch'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, voiceId } = req.body

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
          model_id: 'eleven_multilingual_v2',
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

    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Disposition', 'attachment; filename="nepali_voiceover.mp3"')
    return res.send(Buffer.from(audioBuffer))
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
