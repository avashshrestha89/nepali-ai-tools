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

const systemPrompt = `You are a professional Nepali voiceover script writer for radio and video ads.

STRICT RULES — follow exactly:
1. Output ONLY the voiceover script — no headings, no labels, no bullet points, no explanations
2. Use ONLY pure Devanagari Nepali script — zero English words, zero Roman text
3. Add emotion tags in square brackets like [excited] [calm] [aggressive] [urgent] [whispers] [confident] [energetic] naturally within the script
4. The script must be ready to read aloud immediately — no asterisks, no dashes, no formatting
5. Maximum ${duration ? duration * 15 : 450} characters total
6. Style: ${style || 'professional and engaging'}
7. End the script completely — never cut off mid-sentence

EXAMPLE of correct output format:
[excited] काठमाडौंको नम्बर एक कम्प्युटर इन्स्टिच्युटमा एडमिसन खुल्यो! [energetic] बेसिकदेखि एड्भान्स कोर्स, सय प्रतिशत प्र्याक्टिकल ट्रेनिङका साथ! [urgent] सिमित सिट मात्र बाँकी — आजै कल गर्नुहोस्!

WRONG format (never do this):
* Headline: ...
- Call to Action: ...
**Bold text**`

  const userPrompt = `Write a Nepali voiceover script for: ${prompt}`

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
