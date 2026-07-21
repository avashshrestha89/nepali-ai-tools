import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Credit costs
const MUSIC_CREDIT_COST_PER_30S = 100

function getMusicCreditCost(durationSeconds) {
  return Math.ceil(durationSeconds * MUSIC_CREDIT_COST_PER_30S / 30)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { type, charCount, durationSeconds } = req.body
  const sessionToken = req.cookies.swor_session

  if (!sessionToken) return res.status(401).json({ error: 'Not logged in' })

  try {
    const email = await redis.get(`session:${sessionToken}`)
    if (!email) return res.status(401).json({ error: 'Invalid session' })

    const raw = await redis.get(`user:${email}`)
    if (!raw) return res.status(401).json({ error: 'User not found' })

    const user = typeof raw === 'string' ? JSON.parse(raw) : raw

    // ── VOICEOVER ──
    if (type === 'voiceover') {
      const charsToCharge = parseInt(charCount) || 0

      if (charsToCharge <= 0) {
        return res.status(400).json({ error: 'No text provided.' })
      }

      // 1 credit per character
      const credits = user.credits || 0
      if (credits < charsToCharge) {
        return res.status(403).json({
          error: `Not enough credits. This generation costs ${charsToCharge} credits.`,
          credits,
          required: charsToCharge,
        })
      }

      user.credits = credits - charsToCharge
      await redis.set(`user:${email}`, JSON.stringify(user))
      return res.status(200).json({
        success: true,
        source: 'credits',
        credits: user.credits,
        creditsUsed: charsToCharge,
      })
    }

    // ── MUSIC ──
    if (type === 'music') {
      const dur = parseInt(durationSeconds) || 30

      // Founders lifetime music bonus (50 tracks total, never resets)
      if (user.isFounder && user.founderMusicRemaining > 0) {
        user.founderMusicRemaining -= 1
        await redis.set(`user:${email}`, JSON.stringify(user))
        return res.status(200).json({
          success: true,
          source: 'founder_bonus',
          founderMusicRemaining: user.founderMusicRemaining,
          credits: user.credits || 0,
        })
      }

      // Use paid credits
      const creditCost = getMusicCreditCost(dur)
      const credits = user.credits || 0

      if (credits < creditCost) {
        return res.status(403).json({
          error: `Not enough credits. This ${dur}s track costs ${creditCost} credits.`,
          credits,
          required: creditCost,
        })
      }

      user.credits = credits - creditCost
      await redis.set(`user:${email}`, JSON.stringify(user))
      return res.status(200).json({
        success: true,
        source: 'credits',
        credits: user.credits,
        creditsUsed: creditCost,
      })
    }

    return res.status(400).json({ error: 'Invalid type. Use voiceover or music.' })

  } catch (error) {
    console.error('Use credit error:', error)
    return res.status(500).json({ error: error.message })
  }
}
