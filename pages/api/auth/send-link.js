import { Redis } from '@upstash/redis'
import { Resend } from 'resend'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const resend = new Resend(process.env.RESEND_API_KEY)

function generateToken() {
  return Math.random().toString(36).substr(2) +
    Math.random().toString(36).substr(2) +
    Date.now().toString(36)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

const { email: rawEmail } = req.body
const email = rawEmail?.trim().toLowerCase()
if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required' })

  try {
    // Create user if doesn't exist
    const existing = await redis.get(`user:${email}`)
    if (!existing) {
   await redis.set(`user:${email}`, JSON.stringify({
  email,
  createdAt: new Date().toISOString(),
  tier: 'registered',
  generationsUsed: 0,
  generationsLimit: 0,
  charsPerGeneration: 500,
  betaActive: false,
  betaEndNotified: false,
  credits: 0,
}))
    }

    // Generate magic token — expires in 24 hours
    const token = generateToken()
    await redis.setex(`magic:${token}`, 86400, email)

    const magicLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`

    await resend.emails.send({
      from: 'Swor AI <hello@meroadai.com>',
      to: email,
      subject: 'Your Swor AI access link',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 20px;background:#fff">
          <div style="text-align:center;margin-bottom:32px">
            <div style="font-size:36px;font-weight:800;background:linear-gradient(135deg,#DC143C,#FF9500);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:2px">SWOR AI</div>
            <div style="color:#999;font-size:12px;margin-top:4px">A Product of MeroAD.ai</div>
          </div>
          <h2 style="font-size:22px;font-weight:700;color:#1d1d1f;margin-bottom:12px">Your access link is ready 🙏</h2>
          <p style="color:#6e6e73;font-size:15px;line-height:1.7;margin-bottom:32px">
            Click the button below to access Swor AI and start generating Nepali voiceovers and subtitles.
            This link expires in <strong>24 hours</strong>.
          </p>
          <a href="${magicLink}"
            style="display:block;background:#DC143C;color:#fff;text-align:center;padding:16px 32px;border-radius:12px;font-size:16px;font-weight:700;text-decoration:none;margin-bottom:24px">
            Access Swor AI →
          </a>
          <div style="background:#f9f9f9;border-radius:10px;padding:16px;margin-bottom:24px">
            <div style="font-size:12px;color:#999;margin-bottom:8px">Your beta access includes:</div>
            <div style="font-size:13px;color:#555;line-height:1.8">
              ✓ 10 Nepali voiceover generations<br/>
              ✓ 500 characters per generation<br/>
              ✓ Unlimited Nepali subtitle generation<br/>
              ✓ All 15 premium Nepali voices
            </div>
          </div>
          <p style="color:#aaa;font-size:12px;text-align:center;line-height:1.6">
            If you didn't request this, you can safely ignore this email.
          </p>
          <hr style="border:none;border-top:1px solid #f0f0f0;margin:24px 0"/>
          <p style="color:#ccc;font-size:11px;text-align:center">
            © 2026 Swor AI by MeroAD.ai · Kathmandu, Nepal · meroadaiofficial@gmail.com
          </p>
        </div>
      `,
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Send link error:', error)
    return res.status(500).json({ error: error.message })
  }
}
