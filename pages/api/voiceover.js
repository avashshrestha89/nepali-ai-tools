import fetch from 'node-fetch'
import { put } from '@vercel/blob'
import { Redis } from '@upstash/redis'
import { createHash } from 'crypto'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const MAX_HISTORY = 5
const LEGACY_VOICEOVER_COST = 25
const LEGACY_CHAR_LIMIT = 500
const STALE_THRESHOLD_MS = 120_000  // 2 minutes
const IDEM_TTL_S = 86400            // 24 hours — idempotency record lifetime

// ─────────────────────────────────────────────────────────────────────────────
// Lua: atomic credit reservation + idempotency record creation
//
// KEYS[1] = "user:{email}"
// KEYS[2] = "vo_idem:{email}:{uuid}"
// KEYS[3] = "vo_active_idem:{email}"   ← active HASH (crash-safe orphan tracking)
// ARGV[1] = cost (string int)
// ARGV[2] = idempotency payload JSON (status: processing)
// ARGV[3] = idem TTL in seconds        (IDEM_TTL_S = 24 h)
// ARGV[4] = idempotencyKey UUID        (field stored in active hash)
//
// Returns: remaining credit balance as string
// Errors:  IDEM_EXISTS:{existing_json}  — key already set (race)
//          USER_NOT_FOUND               — session/user mismatch
//          INSUFFICIENT:{have}:{need}   — not enough credits
//
// NOTE: HSET {uuid → cost} is atomic with credit deduction.  The active hash has
// NO TTL — entries persist until explicitly removed by HDEL in LUA_FINALIZE or
// LUA_DIRECT_REFUND.  This ensures unresolved reservations are never silently lost
// regardless of how long a user is inactive.  Storing the cost allows
// LUA_DIRECT_REFUND to refund even after the idem key has expired (>24 h crash).
// ─────────────────────────────────────────────────────────────────────────────
const LUA_RESERVE = `
local existing = redis.call('GET', KEYS[2])
if existing then
  return redis.error_reply('IDEM_EXISTS:' .. existing)
end
local raw = redis.call('GET', KEYS[1])
if not raw then
  return redis.error_reply('USER_NOT_FOUND')
end
local user = cjson.decode(raw)
local credits = user.credits or 0
local cost = tonumber(ARGV[1])
if credits < cost then
  return redis.error_reply('INSUFFICIENT:' .. tostring(credits) .. ':' .. tostring(cost))
end
user.credits = credits - cost
redis.call('SET', KEYS[1], cjson.encode(user))
redis.call('SET', KEYS[2], ARGV[2])
redis.call('EXPIRE', KEYS[2], tonumber(ARGV[3]))
redis.call('HSET', KEYS[3], ARGV[4], ARGV[1])
return tostring(user.credits)
`

// ─────────────────────────────────────────────────────────────────────────────
// Lua: idempotent finalization — complete or fail the reservation
//
// KEYS[1] = "user:{email}"
// KEYS[2] = "vo_idem:{email}:{uuid}"
// KEYS[3] = "vo_active_idem:{email}"   ← active HASH (remove field on finalize)
// ARGV[1] = new status: 'complete' | 'failed'
// ARGV[2] = refund amount (string int; 0 for success)
// ARGV[3] = creditsAfter (string int; informational for idem record)
// ARGV[4] = url (string; '' for none)
// ARGV[5] = error message (string; '' for none)
// ARGV[6] = idempotencyKey UUID (field to HDEL from active hash)
//
// Returns: creditsAfter as string
// Errors:  IDEM_NOT_FOUND      — key expired or never existed
//          ALREADY_FINALIZED:{status} — already completed/failed (idempotent noop)
//
// NOTE: HDEL on KEYS[3] is atomic with status update — no window where idem is
// finalized but UUID still appears as a recoverable orphan in the tracking hash.
// ─────────────────────────────────────────────────────────────────────────────
const LUA_FINALIZE = `
local raw = redis.call('GET', KEYS[2])
if not raw then
  return redis.error_reply('IDEM_NOT_FOUND')
end
local idem = cjson.decode(raw)
if idem.status ~= 'processing' then
  return redis.error_reply('ALREADY_FINALIZED:' .. idem.status)
end
idem.status = ARGV[1]
idem.creditsAfter = tonumber(ARGV[3])
if ARGV[4] ~= '' then idem.url = ARGV[4] else idem.url = cjson.null end
if ARGV[5] ~= '' then idem.error = ARGV[5] else idem.error = cjson.null end
redis.call('SET', KEYS[2], cjson.encode(idem), 'KEEPTTL')
local refund = tonumber(ARGV[2])
if refund > 0 then
  local userRaw = redis.call('GET', KEYS[1])
  if userRaw then
    local user = cjson.decode(userRaw)
    user.credits = (user.credits or 0) + refund
    idem.creditsAfter = user.credits
    redis.call('SET', KEYS[1], cjson.encode(user))
  end
end
redis.call('HDEL', KEYS[3], ARGV[6])
return tostring(idem.creditsAfter)
`

// ─────────────────────────────────────────────────────────────────────────────
// Lua: direct refund for TTL-expired orphan idem records
//
// Called when orphan recovery finds a UUID in the active hash but its
// vo_idem:{email}:{uuid} key has already expired (>24 h since crash).
// We still have the cost stored in the hash — use it to refund the user.
//
// KEYS[1] = "user:{email}"
// KEYS[2] = "vo_active_idem:{email}"   ← active HASH
// ARGV[1] = uuid (hash field to remove)
// ARGV[2] = cost to refund (stored in hash; may be '0')
//
// Returns: user's new credit balance as string
// Errors:  ALREADY_REMOVED — hash field already gone (idempotent; concurrent worker)
//          USER_NOT_FOUND  — user key missing (edge case; hash field is still removed)
//
// NOTE: HDEL return value (1 = removed, 0 = already gone) is the double-refund
// guard.  Concurrent recovery workers racing on the same UUID each call HDEL;
// only the one that gets removed=1 performs the credit restore.
// ─────────────────────────────────────────────────────────────────────────────
const LUA_DIRECT_REFUND = `
local removed = redis.call('HDEL', KEYS[2], ARGV[1])
if removed == 0 then
  return redis.error_reply('ALREADY_REMOVED')
end
local cost = tonumber(ARGV[2])
if cost > 0 then
  local userRaw = redis.call('GET', KEYS[1])
  if userRaw then
    local user = cjson.decode(userRaw)
    user.credits = (user.credits or 0) + cost
    redis.call('SET', KEYS[1], cjson.encode(user))
    return tostring(user.credits)
  end
end
return '0'
`

// ─────────────────────────────────────────────────────────────────────────────
// finalize: call LUA_FINALIZE; swallow ALREADY_FINALIZED (idempotent)
// Passes 3 KEYS (user, idem, activeSet) and 6 ARGV (status, refund, credits,
// url, error, idemUuid) so the active-set SREM is atomic with the status write.
// Returns { credits, conflictStatus } — conflictStatus is non-null on race.
// ─────────────────────────────────────────────────────────────────────────────
async function finalize(userKey, idemKey, status, refundAmt, creditsAfter, url, errorMsg) {
  const email = userKey.slice('user:'.length)
  const idemUuid = idemKey.split(':').pop()
  const activeSetKey = `vo_active_idem:${email}`
  try {
    const result = await redis.eval(LUA_FINALIZE, [userKey, idemKey, activeSetKey], [
      status,
      String(refundAmt),
      String(creditsAfter),
      url || '',
      errorMsg || '',
      idemUuid,
    ])
    return { credits: parseInt(result, 10), conflictStatus: null }
  } catch (err) {
    const msg = err?.message || String(err)
    if (msg.startsWith('ALREADY_FINALIZED:')) {
      // Race with another worker — record what it was finalized as so callers
      // can distinguish an idempotent duplicate ('complete') from a conflict ('failed')
      const conflictStatus = msg.slice('ALREADY_FINALIZED:'.length)
      return { credits: creditsAfter, conflictStatus }
    }
    console.error('LUA_FINALIZE error:', err)
    return { credits: null, conflictStatus: null }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, voiceId, voiceName, idempotencyKey } = req.body

  // ── Input validation ──────────────────────────────────────────────────────
  if (!text || !text.trim()) {
    return res.status(400).json({ code: 'INVALID_INPUT', error: 'No text provided' })
  }
  if (!voiceId) {
    return res.status(400).json({ code: 'INVALID_INPUT', error: 'No voice selected' })
  }
  if (!idempotencyKey || typeof idempotencyKey !== 'string' || idempotencyKey.length < 8) {
    return res.status(400).json({ code: 'INVALID_INPUT', error: 'Valid idempotency key required' })
  }

  const billableText = text.trim()   // B3 fix: billing and synthesis both use trim()

  if (billableText.length > 3500) {
    return res.status(400).json({
      code: 'TEXT_TOO_LONG',
      error: 'Your script exceeds the 3,500 character limit. Please split it into smaller parts and generate each part separately.',
    })
  }

  // ── Server-side auth ──────────────────────────────────────────────────────
  const sessionToken = req.cookies.swor_session
  if (!sessionToken) {
    return res.status(401).json({ code: 'NOT_LOGGED_IN', error: 'Not logged in' })
  }

  let email
  try {
    const rawEmail = await redis.get(`session:${sessionToken}`)
    if (!rawEmail) return res.status(401).json({ code: 'INVALID_SESSION', error: 'Invalid session' })
    email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : String(rawEmail)
  } catch (err) {
    console.error('Session lookup error:', err)
    return res.status(500).json({ code: 'SERVER_ERROR', error: 'Server error. Please try again.' })
  }

  let user
  try {
    const rawUser = await redis.get(`user:${email}`)
    if (!rawUser) return res.status(401).json({ code: 'USER_NOT_FOUND', error: 'User not found' })
    user = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser
  } catch (err) {
    console.error('User lookup error:', err)
    return res.status(500).json({ code: 'SERVER_ERROR', error: 'Server error. Please try again.' })
  }

  // ── Block pending-payment accounts ────────────────────────────────────────
  if (user.isPendingPayment) {
    return res.status(403).json({
      code: 'PENDING_PAYMENT',
      error: 'Your account is pending payment activation. Please contact support via WhatsApp.',
    })
  }

  // ── Server-side cost calculation (B3 fix) ────────────────────────────────
  const isLegacy = !!user.isLegacy
  let cost
  if (isLegacy) {
    if (billableText.length > LEGACY_CHAR_LIMIT) {
      return res.status(400).json({
        code: 'TEXT_TOO_LONG',
        error: `Maximum ${LEGACY_CHAR_LIMIT} characters allowed on your plan.`,
      })
    }
    cost = LEGACY_VOICEOVER_COST
  } else {
    cost = billableText.length   // 1 credit per trimmed character
  }

  // ── Idempotency key setup ─────────────────────────────────────────────────
  const payloadHash = createHash('sha256')
    .update(`${billableText}|${voiceId}`)
    .digest('hex')

  const userKey = `user:${email}`
  const idemKey = `vo_idem:${email}:${idempotencyKey}`

  // ── Proactive orphan recovery ─────────────────────────────────────────────
  // The client generates a new UUID per click, so a crashed request's idem key
  // is never retried by the same client.  We track ALL in-progress UUIDs for
  // this user in vo_active_idem:{email}, a Redis HASH of {uuid → cost} written
  // atomically inside LUA_RESERVE and cleaned up atomically inside LUA_FINALIZE.
  // On any new request we scan the whole hash and recover every stale orphan.
  //
  // Two recovery paths:
  //   A) Idem key still alive (crash within 24 h): LUA_FINALIZE marks failed +
  //      refunds + removes from hash in one atomic op.
  //   B) Idem key expired (crash >24 h ago):  LUA_DIRECT_REFUND uses the stored
  //      cost in the hash to refund credits + removes the hash field atomically,
  //      with HDEL-based double-refund guard for concurrent workers.
  try {
    const activeHashKey = `vo_active_idem:${email}`
    const activeHash = await redis.hgetall(activeHashKey)
    if (activeHash) {
      for (const [activeUuid, costStr] of Object.entries(activeHash)) {
        if (activeUuid === idempotencyKey) continue   // skip current request
        const orphanFull = `vo_idem:${email}:${activeUuid}`
        const orphanRaw = await redis.get(orphanFull)
        if (!orphanRaw) {
          // PATH B: Idem key expired — refund using cost stored in active hash
          const storedCost = parseInt(costStr, 10) || 0
          try {
            const result = await redis.eval(LUA_DIRECT_REFUND, [userKey, activeHashKey],
              [activeUuid, String(storedCost)])
            console.log(`Direct refund for TTL-expired orphan: ${email}:${activeUuid}, cost=${storedCost}, creditsAfter=${result}`)
          } catch (refundErr) {
            const refundMsg = refundErr?.message || String(refundErr)
            if (!refundMsg.startsWith('ALREADY_REMOVED')) {
              // ALREADY_REMOVED = concurrent worker beat us; idempotent, not an error
              console.error(`Direct refund error for ${email}:${activeUuid}:`, refundErr)
            }
          }
          continue
        }
        // PATH A: Idem key still alive — check if processing and stale
        const orphan = typeof orphanRaw === 'string' ? JSON.parse(orphanRaw) : orphanRaw
        if (orphan.status === 'processing') {
          const ageMs = Date.now() - (orphan.ts || 0)
          if (ageMs > STALE_THRESHOLD_MS) {
            const staleCost = orphan.creditsDeducted || 0
            const staleAfter = (orphan.creditsAfter ?? 0) + staleCost
            await finalize(userKey, orphanFull, 'failed', staleCost, staleAfter, null,
              'Generation timed out. Credits refunded.')
            console.log(`Proactive orphan recovery: ${orphanFull} (age ${ageMs}ms)`)
          }
        }
      }
    }
  } catch (orphanErr) {
    console.error('Orphan recovery error (non-fatal):', orphanErr)
  }

  // ── Check existing idempotency record ─────────────────────────────────────
  let existingIdem = null
  try {
    const raw = await redis.get(idemKey)
    if (raw) {
      existingIdem = typeof raw === 'string' ? JSON.parse(raw) : raw
    }
  } catch (err) {
    console.error('Idem lookup error:', err)
    // Non-fatal — proceed as if no record
  }

  if (existingIdem) {
    // Reject reuse of the same key with different content
    if (existingIdem.payloadHash !== payloadHash) {
      return res.status(409).json({
        code: 'PAYLOAD_MISMATCH',
        error: 'Idempotency key reused with different content. Please use a new key.',
      })
    }

    if (existingIdem.status === 'complete') {
      return res.status(200).json({
        url: existingIdem.url,
        credits: existingIdem.creditsAfter,
        cached: true,
      })
    }

    if (existingIdem.status === 'failed') {
      return res.status(422).json({
        code: 'GENERATION_FAILED',
        error: existingIdem.error || 'Generation failed. Please try again.',
        credits: existingIdem.creditsAfter,
        cached: true,
      })
    }

    // status === 'processing': check for stale crash
    if (existingIdem.status === 'processing') {
      const ageMs = Date.now() - (existingIdem.ts || 0)
      if (ageMs > STALE_THRESHOLD_MS) {
        // Stale — recover: refund and mark failed
        console.warn(`Stale idem record for ${email}:${idempotencyKey}, age=${ageMs}ms — recovering`)
        const staleCost = existingIdem.creditsDeducted || 0
        const staleCreditsAfter = (existingIdem.creditsAfter ?? 0) + staleCost
        await finalize(userKey, idemKey, 'failed', staleCost, staleCreditsAfter,
          null, 'Generation timed out. Credits refunded.')
        return res.status(422).json({
          code: 'GENERATION_FAILED',
          error: 'Previous generation timed out. Credits have been refunded. Please try again with a new request.',
        })
      }
      // Still in progress — tell client to wait
      return res.status(202).json({
        code: 'IN_PROGRESS',
        error: 'Generation is already in progress. Please wait a moment and try again.',
      })
    }
  }

  // ── Atomic credit reservation (B1 + B2 fix) ──────────────────────────────
  const idemPayload = JSON.stringify({
    status: 'processing',
    payloadHash,
    creditsDeducted: cost,
    creditsAfter: null,
    ts: Date.now(),
    url: null,
    error: null,
  })

  let creditsAfterReserve
  try {
    const activeSetKey = `vo_active_idem:${email}`
    const result = await redis.eval(LUA_RESERVE, [userKey, idemKey, activeSetKey], [
      String(cost),
      idemPayload,
      String(IDEM_TTL_S),
      idempotencyKey,
      // No 5th arg: active hash has no TTL — entries live until HDEL in LUA_FINALIZE
    ])
    creditsAfterReserve = parseInt(result, 10)
  } catch (err) {
    const msg = err?.message || String(err)
    if (msg.startsWith('IDEM_EXISTS:')) {
      // Another request just created this record — race condition handled
      return res.status(202).json({
        code: 'IN_PROGRESS',
        error: 'Generation is already in progress. Please wait.',
      })
    }
    if (msg.startsWith('INSUFFICIENT:')) {
      const parts = msg.split(':')
      const have = parseInt(parts[1] || '0', 10)
      const need = parseInt(parts[2] || String(cost), 10)
      return res.status(403).json({
        code: 'INSUFFICIENT_CREDITS',
        error: `Not enough credits. This generation costs ${need} credits but you have ${have}.`,
        credits: have,
        required: need,
      })
    }
    if (msg === 'USER_NOT_FOUND') {
      return res.status(401).json({ code: 'USER_NOT_FOUND', error: 'User not found' })
    }
    console.error('LUA_RESERVE error:', err)
    return res.status(500).json({ code: 'RESERVE_FAILED', error: 'Failed to reserve credits. Please try again.' })
  }

  // ── Generate audio via AI voice engine ───────────────────────────────────
  let audioBytes
  try {
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
          text: billableText,
          model_id: 'eleven_v4',
          output_format: 'mp3_44100_64',
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
      const errData = await response.json().catch(() => ({}))
      const errCode = errData?.detail?.code || ''
      let userMsg = 'Voice generation failed. Please try again.'
      if (errCode === 'max_character_limit_exceeded') {
        userMsg = 'Your script is too long. Please split it into parts of 3,500 characters or less.'
      } else if (errCode === 'invalid_api_key' || errCode === 'invalid_api_key_prefix') {
        userMsg = 'Voice generation is temporarily unavailable. Please try again in a few minutes.'
      }
      // Definitive failure — refund in full
      const finalCredits = creditsAfterReserve + cost
      await finalize(userKey, idemKey, 'failed', cost, finalCredits, null, userMsg)
      return res.status(422).json({
        code: 'GENERATION_FAILED',
        error: userMsg,
        credits: finalCredits,
      })
    }

    const audioBuffer = await response.arrayBuffer()
    audioBytes = Buffer.from(audioBuffer)
  } catch (fetchErr) {
    console.error('Voice generation fetch error:', fetchErr)
    const userMsg = 'Voice generation failed due to a network error. Credits have been refunded. Please try again.'
    const finalCredits = creditsAfterReserve + cost
    await finalize(userKey, idemKey, 'failed', cost, finalCredits, null, userMsg)
    return res.status(500).json({
      code: 'GENERATION_FAILED',
      error: userMsg,
      credits: finalCredits,
    })
  }

  // ── Store audio blob ──────────────────────────────────────────────────────
  const timestamp = Date.now()
  let blobUrl
  try {
    const filename = `voiceovers/${email}/${timestamp}.mp3`
    const blob = await put(filename, audioBytes, { access: 'public', contentType: 'audio/mpeg' })
    blobUrl = blob.url
  } catch (blobErr) {
    console.error('Blob storage error:', blobErr)
    const userMsg = 'Failed to store audio. Credits have been refunded. Please try again.'
    const finalCredits = creditsAfterReserve + cost
    await finalize(userKey, idemKey, 'failed', cost, finalCredits, null, userMsg)
    return res.status(500).json({
      code: 'GENERATION_FAILED',
      error: userMsg,
      credits: finalCredits,
    })
  }

  // ── Save history (best-effort) ────────────────────────────────────────────
  try {
    const historyRaw = await redis.get(`history:${email}`)
    const history = historyRaw
      ? (typeof historyRaw === 'string' ? JSON.parse(historyRaw) : historyRaw)
      : []
    const newEntry = {
      id: timestamp,
      text: billableText.slice(0, 80),
      voiceName: voiceName || voiceId,
      url: blobUrl,
      createdAt: new Date().toISOString(),
    }
    await redis.set(`history:${email}`, JSON.stringify([newEntry, ...history].slice(0, MAX_HISTORY)))
  } catch (histErr) {
    console.error('History save error:', histErr)
    // Non-fatal — generation succeeded; continue
  }

  // ── Finalize success (with retry) ────────────────────────────────────────
  // If Redis is briefly down after audio is generated, finalize() returns
  // {credits:null, conflictStatus:null}.  We retry up to 3× with back-off.
  // If ALL attempts fail we MUST NOT return the audio URL — the idem stays
  // 'processing', and orphan recovery would later refund credits if we had
  // already delivered audio (violating the invariant).  Instead we return 503
  // so the client retries with the same idempotency key:
  //   • retry within stale window (120 s): 202 IN_PROGRESS
  //   • retry after stale window:  orphan recovery refunds + 422
  // The blob is orphaned but credits are safe.
  const MAX_FINALIZE_RETRIES = 3
  let finalResult = { credits: null, conflictStatus: null }
  for (let attempt = 0; attempt < MAX_FINALIZE_RETRIES; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, 100 * attempt))
    finalResult = await finalize(userKey, idemKey, 'complete', 0, creditsAfterReserve, blobUrl, null)
    // Break on success OR on a definitive conflict (don't retry ALREADY_FINALIZED)
    if (finalResult.credits !== null || finalResult.conflictStatus !== null) break
  }
  const { credits: finalCredits, conflictStatus } = finalResult

  if (conflictStatus === 'failed') {
    // A stale recovery already refunded credits before we could write 'complete'.
    // Do NOT deliver the audio URL — the user's credits are already back.
    console.error(`Late-success conflict for ${email}: idem finalized as 'failed' before 'complete'`)
    return res.status(409).json({
      code: 'CONFLICT',
      error: 'Generation completed, but a timeout recovery had already refunded your credits. Please try again.',
    })
  }

  if (finalResult.credits === null) {
    // All 3 finalize retries failed — do NOT deliver audio URL.
    // Idem stays 'processing'; client retries with the same key.
    // Within stale window → 202; after stale window → orphan recovery refunds + 422.
    console.error(
      `CRITICAL: finalize failed after ${MAX_FINALIZE_RETRIES} attempts — ` +
      `email=${email} idemKey=${idemKey} blobUrl=${blobUrl} creditsDeducted=${cost}. ` +
      `Returning 503; client retry will resolve via idem record or stale recovery.`
    )
    return res.status(503).json({
      code: 'FINALIZE_PENDING',
      error: 'Generation completed but could not be confirmed. Please retry your request to retrieve your audio.',
    })
  }

  return res.status(200).json({
    url: blobUrl,
    credits: finalCredits,
  })
}
