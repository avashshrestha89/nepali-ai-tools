export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { prompt, durationSeconds } = req.body

  if (!prompt || prompt.trim().length < 3) {
    return res.status(400).json({ error: 'Please describe the music you want to generate.' })
  }

  const duration = Math.min(Math.max(parseInt(durationSeconds) || 30, 5), 120)

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-music', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        duration_seconds: duration,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('ElevenLabs Music error:', errText)
      return res.status(500).json({ error: 'Music generation failed. Please try again.' })
    }

    const audioBuffer = await response.arrayBuffer()
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Disposition', 'attachment; filename="swor_music.mp3"')
    res.setHeader('Cache-Control', 'no-store')
    return res.send(Buffer.from(audioBuffer))
  } catch (error) {
    console.error('Music API error:', error)
    return res.status(500).json({ error: error.message })
  }
}
