import { Redis } from '@upstash/redis'
import { stripTags, wordsOnly, AUTO_TAGS } from '../../lib/tags'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash' // same model generate-script.js uses
const MAX_CHARS = 3500
// Daily tries by plan. Founders is also implied by user.isFounder.
const DAILY_LIMITS = { starter: 5, creator: 20, founders: 50 }

const SYSTEM_PROMPT = `You add emotion and pacing tags to a Nepali voiceover script.

STRICT RULES:
1. Do NOT change, add, remove, reorder or translate any word. Keep every character of the original text exactly.
2. You may ONLY insert these tags: ${AUTO_TAGS.map(t => `[${t}]`).join(' ')} and the "..." pause mark.
3. Put a tone tag at the start of a sentence or line, never in the middle of a word. Use [pause] or "..." between ideas. Use [long pause] only for a big dramatic break.
4. Match the mood of the script. News or formal scripts: calm and serious, very few tags. Ads and reels: more energy. Stories: whispers and pauses where it fits.
5. Be light. Roughly one tag per sentence at most. Do not tag every sentence.
6. Keep tags that are already in the text exactly as they are.
7. No XML, no <break>, no markdown, no explanations.
8. Output ONLY the full tagged script.`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const sessionToken = req.cookies.swor_session
  if (!sessionToken) return res.status(401).json({ error: 'Please sign in to use Auto tag.' })

  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : ''
  if (!text) return res.status(400).json({ error: 'Type your script first.' })
  if (text.length > MAX_CHARS) return res.status(400).json({ error: `Script is over ${MAX_CHARS} characters.` })
  if (!process.env.SWORAIAPIKEY) return res.status(503).json({ error: 'Auto tag is not available right now.' })

  let email
  try {
    email = await redis.get(`session:${sessionToken}`)
  } catch (e) {
    return res.status(503).json({ error: 'Please try again in a moment.' })
  }
  if (!email) return res.status(401).json({ error: 'Please sign in to use Auto tag.' })

  let user
  try {
    const raw = await redis.get(`user:${email}`)
    user = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : null
  } catch (e) {
    return res.status(503).json({ error: 'Please try again in a moment.' })
  }
  if (!user) return res.status(401).json({ error: 'Account not found.' })
  if (user.isPendingPayment) return res.status(403).json({ error: 'Your account is pending activation.' })

  // Daily limit. Per-user override: user.autoTagLimit. Otherwise Starter 5, Creator 20, Founders 50 (unknown plan counts as Starter).
  const plan = user.isFounder ? 'founders' : (DAILY_LIMITS[user.plan] ? user.plan : 'starter')
  const limit = Number.isFinite(user.autoTagLimit) ? user.autoTagLimit : DAILY_LIMITS[plan]
  const day = new Date().toISOString().slice(0, 10)
  const key = `autotag:${email}:${day}`
  let used
  try {
    used = await redis.incr(key)
    if (used === 1) await redis.expire(key, 60 * 60 * 30)
  } catch (e) {
    return res.status(503).json({ error: 'Please try again in a moment.' })
  }
  const refund = async () => { try { await redis.decr(key) } catch (e) {} }

  if (used > limit) {
    await refund()
    return res.status(429).json({
      code: 'LIMIT_REACHED',
      error: `You have used all ${limit} Auto tag tries for today. They reset tomorrow.`,
      remaining: 0,
    })
  }

  // Ask Gemini. Up to 2 tries; the result must keep every word unchanged.
  const want = wordsOnly(text)
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.SWORAIAPIKEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: 'user', parts: [{ text }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
          }),
        }
      )
      if (!r.ok) {
        console.error('Auto tag Gemini error:', r.status)
        continue
      }
      const data = await r.json()
      let out = (data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim()
      out = out.replace(/^```[a-z]*\n?|\n?```$/g, '').trim()
      if (!out) continue

      // Drop any tag the AI invented that is not on the allowed list.
      out = out.replace(/\[[A-Za-z][A-Za-z ]{0,24}\]/g, m => {
        const name = m.slice(1, -1).toLowerCase()
        return AUTO_TAGS.includes(name) || text.includes(m) ? m : ''
      })

      if (wordsOnly(out) !== want) {
        console.error('Auto tag rejected: words changed')
        continue
      }
      if (out.length > MAX_CHARS + 600) continue

      return res.status(200).json({
        success: true,
        text: out,
        remaining: Math.max(0, limit - used),
        limit,
      })
    } catch (e) {
      console.error('Auto tag error:', e.message)
    }
  }

  await refund() // a failed try does not count against the daily limit
  return res.status(502).json({ error: 'Auto tag could not finish this time. Please try again.' })
}
