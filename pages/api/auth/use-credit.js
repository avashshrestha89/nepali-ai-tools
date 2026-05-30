import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Credit costs
const VOICEOVER_CREDIT_COST = 25
const MUSIC_CREDIT_COST_PER_30S = 100

function getMusicCreditCost(durationSeconds) {
  return Math.ceil(durationSeconds * MUSIC_CREDIT_COST_PER_30S / 30)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { type, charCount, durationSeconds, isFreeMusciTrial } = req.body
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
      const charLimit = 500
      if (charCount > charLimit) {
        return res.status(400).json({ error: `Maximum ${charLimit} characters allowed.` })
      }

      // Use beta gens first
      if (user.betaActive && user.generationsUsed < user.generationsLimit) {
        user.generationsUsed += 1
        await redis.set(`user:${email}`, JSON.stringify(user))
        return res.status(200).json({
          success: true,
          source: 'beta',
          betaRemaining: user.generationsLimit - user.generationsUsed,
          credits: user.credits || 0,
        })
      }

      // Use paid credits
      const credits = user.credits || 0
      if (credits < VOICEOVER_CREDIT_COST) {
        return res.status(403).json({
          error: 'Not enough credits. Purchase a credit pack to continue.',
          credits,
          required: VOICEOVER_CREDIT_COST,
        })
      }

      user.credits = credits - VOICEOVER_CREDIT_COST
      await redis.set(`user:${email}`, JSON.stringify(user))
      return res.status(200).json({
        success: true,
        source: 'credits',
        credits: user.credits,
        creditsUsed: VOICEOVER_CREDIT_COST,
      })
    }

    // ── MUSIC ──
    if (type === 'music') {
      const dur = parseInt(durationSeconds) || 30

      // Free 15-second trial
      if (isFreeMusciTrial) {
        if (user.musicFreeUsed) {
          return res.status(403).json({ error: 'Free music trial already used.' })
        }
        if (dur > 15) {
          return res.status(400).json({ error: 'Free trial is limited to 15 seconds.' })
        }
        user.musicFreeUsed = true
        await redis.set(`user:${email}`, JSON.stringify(user))
        return res.status(200).json({ success: true, source: 'free_trial', credits: user.credits || 0 })
      }

      // Founders monthly music bonus
      if (user.isFounder) {
        const now = new Date()
        const resetDate = user.founderMusicResetAt ? new Date(user.founderMusicResetAt) : null

        // Reset monthly counter if new month
        if (!resetDate || now >= resetDate) {
          user.founderMusicThisMonth = 5
          const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1)
          user.founderMusicResetAt = nextReset.toISOString()
        }

        if (user.founderMusicThisMonth > 0) {
          user.founderMusicThisMonth -= 1
          await redis.set(`user:${email}`, JSON.stringify(user))
          return res.status(200).json({
            success: true,
            source: 'founder_bonus',
            founderMusicRemaining: user.founderMusicThisMonth,
            credits: user.credits || 0,
          })
        }
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
