import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// Credit packs
const PACKS = {
  starter:   { credits: 500,  label: 'Starter Pack (NPR 499)' },
  creator:   { credits: 1100, label: 'Creator Pack (NPR 999)' },
  founders:  { credits: 12500, label: "Founders' Lifetime Pack (NPR 2,500)", isFounder: true },
  custom:    { credits: 0,    label: 'Custom amount' },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, pack, customCredits, adminPassword } = req.body

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!email) return res.status(400).json({ error: 'Email required' })

  try {
    const raw = await redis.get(`user:${email}`)

    const packData = PACKS[pack]
    const creditsToAdd = pack === 'custom'
      ? parseInt(customCredits) || 0
      : packData?.credits || 0

    const isFounderPack = packData?.isFounder || false

    if (!raw) {
      // Create new user
      const newUser = {
        email,
        createdAt: new Date().toISOString(),
        tier: 'paid',
        generationsUsed: 0,
        generationsLimit: 0,
        charsPerGeneration: 500,
        betaActive: false,
        betaEndNotified: false,
        credits: creditsToAdd,
        musicFreeUsed: false,
        isFounder: isFounderPack,
       founderMusicRemaining: isFounderPack ? 50 : 0,
      }
      await redis.set(`user:${email}`, JSON.stringify(newUser))
      return res.status(200).json({
        success: true,
        email,
        newCredits: creditsToAdd,
        isFounder: isFounderPack,
        message: `New user created — ${packData?.label || 'custom'} activated`,
      })
    }

    const user = typeof raw === 'string' ? JSON.parse(raw) : raw
    const oldCredits = user.credits || 0
    user.credits = oldCredits + creditsToAdd

if (isFounderPack) {
  user.isFounder = true
  user.founderMusicRemaining = 50
}

    user.tier = 'paid'
    await redis.set(`user:${email}`, JSON.stringify(user))

    return res.status(200).json({
      success: true,
      email,
      packActivated: packData?.label || 'custom',
      oldCredits,
      creditsAdded: creditsToAdd,
      newCredits: user.credits,
      isFounder: user.isFounder,
      message: `${packData?.label || `${creditsToAdd} credits`} activated for ${email}`,
    })
  } catch (error) {
    console.error('Add balance error:', error)
    return res.status(500).json({ error: error.message })
  }
}
