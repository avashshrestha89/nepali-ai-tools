import { Redis } from '@upstash/redis'
import { Resend } from 'resend'
import { randomInt } from 'crypto'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const resend = new Resend(process.env.RESEND_API_KEY)

const OTP_TTL     = 600  // 10 minutes in seconds
const RL_MAX      = 3    // max OTP sends per window
const RL_WINDOW   = 600  // rate-limit window (same as OTP TTL)

// Atomic: INCR the send counter; set EXPIRE only on the first increment so
// the window is anchored to the first request, not reset on each one.
const LUA_RL = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
end
return count
`

function generateCode() {
  // crypto.randomInt(min, max) — uniform integer in [min, max)
  return String(randomInt(100000, 1000000))  // 6 digits, zero-padded not needed (always 6)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email: rawEmail } = req.body
  const email = rawEmail?.trim().toLowerCase()
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  // ── Rate limit: 3 OTP sends per email per 10-minute window ──────────────
  let rlCount
  try {
    rlCount = Number(
      await redis.eval(LUA_RL, [`rl:sendotp:${email}`], [String(RL_WINDOW)])
    )
  } catch (rlErr) {
    console.error('OTP rate limit check failed:', rlErr.message)
    return res.status(503).json({ error: 'Service temporarily unavailable. Please try again shortly.' })
  }

  if (rlCount > RL_MAX) {
    const ttl = await redis.ttl(`rl:sendotp:${email}`).catch(() => RL_WINDOW)
    res.setHeader('Retry-After', String(Math.max(Number(ttl), 1)))
    return res.status(429).json({ error: 'Too many code requests. Please wait before requesting another.' })
  }

  try {
    // ── Create user record if this is a new email ──────────────────────────
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
        isPendingPayment: true,
      }))
    }

    // ── Generate OTP and store it, replacing any previous code ────────────
    // Replacing supersedes the old code atomically — the old key is
    // overwritten so it cannot be verified after a resend.
    const code = generateCode()
    await redis.setex(`otp:${email}`, OTP_TTL, JSON.stringify({
      code,
      attempts: 0,
    }))

    // ── Send email ─────────────────────────────────────────────────────────
    await resend.emails.send({
      from: 'Swor AI <hello@meroadai.com>',
      to: email,
      subject: `${code} — your Swor AI access code`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 20px;background:#fff">
          <div style="text-align:center;margin-bottom:32px">
            <div style="font-size:36px;font-weight:800;background:linear-gradient(135deg,#DC143C,#FF9500);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:2px">SWOR AI</div>
            <div style="color:#999;font-size:12px;margin-top:4px">A Product of MeroAD.ai</div>
          </div>
          <h2 style="font-size:22px;font-weight:700;color:#1d1d1f;margin-bottom:12px">Your access code 🙏</h2>
          <p style="color:#6e6e73;font-size:15px;line-height:1.7;margin-bottom:28px">
            Enter this 6-digit code in Swor AI to sign in. It expires in <strong>10 minutes</strong>.
          </p>
          <div style="background:#f5f5f7;border-radius:14px;padding:24px;text-align:center;margin-bottom:28px">
            <div style="font-size:42px;font-weight:800;letter-spacing:0.2em;color:#1d1d1f;font-family:monospace">${code}</div>
          </div>
          <p style="color:#aaa;font-size:12px;text-align:center;line-height:1.6">
            If you didn't request this code, you can safely ignore this email.
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
    console.error('Send OTP error:', error.message)
    return res.status(500).json({ error: 'Failed to send code. Please try again.' })
  }
}
