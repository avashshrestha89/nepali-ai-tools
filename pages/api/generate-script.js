export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { prompt, duration, style } = req.body
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  const durationSecs = parseInt(duration) || 30
  const targetWords = Math.round(durationSecs * 2.3)

  const systemPrompt = `You are an expert Nepali voiceover scriptwriter for high-converting ads and video content.

STRICT RULES:
1. Use ONLY pure Devanagari Nepali script — zero English words, zero Roman text
2. Target length: exactly ${targetWords} Nepali words for ${durationSecs} seconds of audio
3. Add emotion tags like [excited] [calm] [aggressive] [urgent] [whispers] [confident] [energetic] naturally
4. Structure the script in timed blocks: [०:०० - ०:३०] [०:३० - १:००] etc.
5. Include: Hook → Problem → Solution → Call to Action
6. Output ONLY the script — no explanations, no headings outside the timed blocks
7. NEVER end mid-sentence — complete the full script
8. Style: ${style || 'professional and engaging'}

EXAMPLE FORMAT:
[०:०० - ०:३०]
[excited] काठमाडौंको नम्बर एक कम्प्युटर इन्स्टिच्युटमा एडमिसन खुल्यो!

[०:३० - १:००]
[energetic] बेसिकदेखि एड्भान्स कोर्स, सय प्रतिशत प्र्याक्टिकल ट्रेनिङका साथ!

[१:०० - १:३०]
[urgent] सिमित सिट मात्र बाँकी छन्!

[१:३० - २:००]
[aggressive] आजै कल गर्नुहोस् र आफ्नो भविष्य सुरक्षित गर्नुहोस्!`

  const userPrompt = `Generate a complete ${durationSecs}-second voiceover script for: "${prompt}". Must be approximately ${targetWords} Nepali words. Do NOT stop until the script is complete.`

  const maxAttempts = 3

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.SWORAIAPIKEY}`,
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
              maxOutputTokens: 8192,
            }
          })
        }
      )

      if (!response.ok) {
        const err = await response.json()
        console.log('Gemini API error:', JSON.stringify(err))
        if (err?.error?.code === 503 && attempt < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000))
          continue
        }
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
      if (attempt < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
  }

  return res.status(500).json({ error: 'Script generation failed. Please try again.' })
}
