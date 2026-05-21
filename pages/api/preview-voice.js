const PREVIEW_TEXT = 'नमस्ते! म स्वर एआई हुँ। तपाईँको भिडियो र अडियोलाई अझै राम्रो बनाउन म यसरी नै बोल्न सक्छु। ल भन्नुस्, आज हामी कस्तो कन्टेन्ट बनाउने?'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { voiceId } = req.query
  if (!voiceId) return res.status(400).json({ error: 'voiceId required' })

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
          text: PREVIEW_TEXT,
          model_id: 'eleven_v3',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      return res.status(500).json({ error: err })
    }

    const audioBuffer = await response.arrayBuffer()
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'no-cache, no-store')
    return res.send(Buffer.from(audioBuffer))
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
