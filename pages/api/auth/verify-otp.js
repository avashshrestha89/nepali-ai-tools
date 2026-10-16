import { Redis } from '@upstash/redis'
import { randomBytes } from 'crypto'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const MAX_ATTEMPTS = 5

// Atomic OTP verification via Lua:
//
// Returns one of these integer status codes:
//   0  key missing / expired
//   1  correct — code consumed (key deleted)
//   2  wrong code — attempts incremented; returns remaining attempts as second value
//   3  attempts exhausted before this call (already blocked)
//
// KEYS[1] = otp:{email}
// ARGV[1] = submitted code (string)
// ARGV[2] = max attempts (string, e.g. "5")
//
// The script works on the raw JSON stored by send-otp.js.
// It parses/updates/re-stores the JSON atomically so no two concurrent
// requests can both pass the attempt check.
const LUA_VERIFY = `
local raw = redis.call('GET', KEYS[1])
if not raw then
  return {0, 0}
end

local data = cjson.decode(raw)
local storedCode = tostring(data['code'])
local attempts   = tonumber(data['attempts']) or 0
local maxAttempts = tonumber(ARGV[2])

if attempts >= maxAttempts then
  return {3, 0}
end

if storedCode == ARGV[1] then
  redis.call('DEL', KEYS[1])
  return {1, 0}
end

attempts = attempts + 1
data['attempts'] = attempts
local remaining  = maxAttempts - attempts
local ttl = redis.call('TTL', KEYS[1])
if ttl > 0 then
  redis.call('SETEX', KEYS[1], ttl, cjson.encode(data))
else
  -- ttl == 0  : key expiring within <1 s — treat as expired to prevent a
  --             persistent key from being created by the SET without EXPIRY.
  -- ttl == -1 : no TTL set (should never happen; send-otp always uses SETEX) —
  --             delete defensively rather than creating an immortal record.
  -- ttl == -2 : key already gone (race between GET and TTL) — DEL is a no-op.
  -- In all three cases the submitted code is useless; returning {0, 0} sends
  -- the caller to the "expired" path (401, request a new code).
  redis.call('DEL', KEYS[1])
  return {0, 0}
end
return {2, remaining}
`

function createSession() {
  return randomBytes(32).toString('hex')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email: rawEmail, code: rawCode } = req.body

  const email = rawEmail?.trim().toLowerCase()
  const code  = String(rawCode ?? '').trim()

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' })
  }
  if (!/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: 'Code must be 6 digits' })
  }

  // ── Atomic verify ────────────────────────────────────────────────────────
  let result
  try {
    result = await redis.eval(
      LUA_VERIFY,
      [`otp:${email}`],
      [code, String(MAX_ATTEMPTS)]
    )
  } catch (err) {
    console.error('OTP verify Redis error:', err.message)
    return res.status(503).json({ error: 'Service temporarily unavailable. Please try again shortly.' })
  }

  const status    = Number(result[0])
  const remaining = Number(result[1])

  if (status === 0) {
    // Key missing or expired — generic message, no account existence hint
    return res.status(401).json({ error: 'Code expired or not found. Request a new one.' })
  }

  if (status === 3) {
    // Exhausted before this call
    return res.status(429).json({ error: 'Too many incorrect attempts. Request a new code.' })
  }

  if (status === 2) {
    // Wrong code — attempts were incremented atomically
    if (remaining === 0) {
      return res.status(429).json({ error: 'Too many incorrect attempts. Request a new code.' })
    }
    return res.status(401).json({
      error: 'Incorrect code.',
      attemptsRemaining: remaining,
    })
  }

  // status === 1: correct, code consumed — create session
  try {
    const sessionToken = createSession()
    const SESSION_TTL  = 60 * 60 * 24 * 30  // 30 days

    await redis.setex(`session:${sessionToken}`, SESSION_TTL, email)

    res.setHeader('Set-Cookie',
      `swor_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL}; Secure`
    )

    return res.status(200).json({ success: true, email })
  } catch (err) {
    console.error('OTP session creation error:', err.message)
    return res.status(500).json({ error: 'Verification succeeded but session could not be created. Please try again.' })
  }
}
