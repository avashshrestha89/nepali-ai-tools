

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY },
    })

    if (!response.ok) {
      return res.status(500).json({ error: 'Could not fetch voices' })
    }

    const data = await response.json()
    const voices = data.voices.map((v) => ({
      voice_id: v.voice_id,
      name: v.name,
      category: v.category || 'general',
      preview_url: v.preview_url,
    }))

    return res.status(200).json({ voices })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
