export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, duration, style } = req.body

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  console.log('Gemini API key exists:', !!process.env.SWORAIAPIKEY)
  console.log('Prompt received:', prompt)

  const systemPrompt = `You are a professional Nepali voiceover script writer. 
Generate a voiceover script in pure Devanagari Nepali script only.
Rules:
- Use ONLY Devanagari script (नेपाली) — no Roman Nepali, no English words
- Include appropriate emotion tags like [excited] [calm] [aggressive] [urgent] [whispers] [confident] where suitable
- Make it natural and conversational for voiceover
- Keep it within ${duration || 30} seconds of speech (roughly ${duration ? duration * 15 : 450} characters)
- Style: ${style || 'professional and engaging'}
- Do NOT include any explanation, just the script itself`

  const userPrompt = `Write a Nepali voiceover script for: ${prompt}`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.SWORAIAPIKEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\n${userPrompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      }
    )

    if (!response.ok) {
      const err = await response.json()
      console.log('Gemini API error:', JSON.stringify(err))
      return res.status(500).json({ error: 'Script generation failed. Please try again.' })
    }

    const data = await response.json()
    const script = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    if (!script) {
      return res.status(500).json({ error: 'No script generated. Please try again.' })
    }

    return res.status(200).json({ script: script.trim() })

  } catch (error) {
    console.log('Generate script error:', error.message)
    return res.status(500).json({ error: 'Script generation failed. Please try again.' })
  }
}
