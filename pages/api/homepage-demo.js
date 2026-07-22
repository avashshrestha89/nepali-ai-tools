import fetch from 'node-fetch'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const DEMO_VOICES = [
  '1zUSi8LeHs9M2mV8X6YS',
  'WdZjiN0nNcik2LBjOHiv',
  'TX3LPaxmHKxFdv7VOQHJ',
]

const DEMO_CHAR_LIMIT = 50

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, phone, email, text, voiceId } = req.body

  // Validate inputs
  if (!name || !phone || !email || !text || !voiceId) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }

  if (text.length > DEMO_CHAR_LIMIT) {
    return res.status(400).json({ error: `Demo limited to ${DEMO_CHAR_LIMIT} characters.` })
  }

  if (!DEMO_VOICES.includes(voiceId)) {
    return res.status(400).json({ error: 'Invalid voice selected.' })
  }

  try {
    // Send lead notification email to Avash
    await resend.emails.send({
      from: 'Swor AI <hello@meroadai.com>',
      to: 'AVASHSHRESTHAUSA@GMAIL.COM',
      subject: `🎙️ New Swor AI Demo Lead — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 20px">
          <div style="font-size:24px;font-weight:800;color:#DC143C;margin-bottom:4px">SWOR AI</div>
          <div style="color:#999;font-size:12px;margin-bottom:24px">New Homepage Demo Lead</div>
          
          <h2 style="font-size:18px;font-weight:700;color:#1d1d1f;margin-bottom:16px">
            Someone just tried your free demo 🎉
          </h2>
          
          <div style="background:#f5f5f7;border-radius:12px;padding:20px;margin-bottom:20px">
            <div style="margin-bottom:10px">
              <div style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;margin-bottom:4px">Name</div>
              <div style="font-size:15px;font-weight:600;color:#1d1d1f">${name}</div>
            </div>
            <div style="margin-bottom:10px">
              <div style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;margin-bottom:4px">Phone</div>
              <div style="font-size:15px;font-weight:600;color:#1d1d1f">${phone}</div>
            </div>
            <div style="margin-bottom:10px">
              <div style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;margin-bottom:4px">Email</div>
              <div style="font-size:15px;font-weight:600;color:#1d1d1f">${email}</div>
            </div>
            <div>
              <div style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;margin-bottom:4px">Script they typed</div>
              <div style="font-size:15px;font-weight:600;color:#1d1d1f">${text}</div>
            </div>
          </div>

          <a href="https://wa.me/${phone.replace(/\D/g,'')}" 
            style="display:block;background:#25D366;color:#fff;text-align:center;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;margin-bottom:12px">
            💬 WhatsApp ${name} Now
          </a>

          <p style="color:#aaa;font-size:12px;text-align:center">
            Follow up while interest is hot 🔥
          </p>
        </div>
      `,
    })

    // Generate the voiceover
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
      return res.status(500).json({ error: 'Voice generation failed. Please try again.' })
    }

    const audioBuffer = await response.arrayBuffer()
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'no-store')
    return res.send(Buffer.from(audioBuffer))

  } catch (error) {
    console.error('Homepage demo error:', error)
    return res.status(500).json({ error: error.message })
  }
}
