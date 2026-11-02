// Credit reservation for the Voice Changer.
//
// This deliberately uses the SAME Redis keys and Lua scripts as pages/api/voiceover.js
// (vo_idem:{email}:{uuid} and the vo_active_idem:{email} hash). That means the
// existing orphan recovery in /api/voiceover also refunds a voice changer request
// that crashed half way, with no extra code.
//
// reserve()  -> takes the credits first, atomically
// finalize() -> marks it complete (no refund) or failed (full refund)

const IDEM_TTL_S = 86400

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

export function keysFor(email, uuid) {
  return {
    userKey: `user:${email}`,
    idemKey: `vo_idem:${email}:${uuid}`,
    activeKey: `vo_active_idem:${email}`,
  }
}

// Returns { ok: true, credits } or { ok: false, code, status, error, ... }
export async function reserve(redis, email, uuid, cost, payloadHash) {
  const { userKey, idemKey, activeKey } = keysFor(email, uuid)
  const payload = JSON.stringify({
    status: 'processing', payloadHash, creditsDeducted: cost,
    creditsAfter: null, ts: Date.now(), url: null, error: null,
  })
  try {
    const r = await redis.eval(LUA_RESERVE, [userKey, idemKey, activeKey],
      [String(cost), payload, String(IDEM_TTL_S), uuid])
    return { ok: true, credits: parseInt(r, 10) }
  } catch (err) {
    const msg = err?.message || String(err)
    if (msg.startsWith('IDEM_EXISTS:')) {
      return { ok: false, status: 202, code: 'IN_PROGRESS', error: 'This conversion is already in progress. Please wait.' }
    }
    if (msg.startsWith('INSUFFICIENT:')) {
      const [, have, need] = msg.split(':')
      return {
        ok: false, status: 403, code: 'INSUFFICIENT_CREDITS',
        error: `Not enough credits. This conversion costs ${need} credits but you have ${have}.`,
        credits: parseInt(have, 10), required: parseInt(need, 10),
      }
    }
    if (msg === 'USER_NOT_FOUND') {
      return { ok: false, status: 401, code: 'USER_NOT_FOUND', error: 'User not found' }
    }
    console.error('voice changer reserve error:', err)
    return { ok: false, status: 500, code: 'RESERVE_FAILED', error: 'Could not reserve credits. Please try again.' }
  }
}

// status: 'complete' | 'failed'.  Failed refunds `cost` in full.
export async function finalize(redis, email, uuid, status, cost, creditsAfter, url, errorMsg) {
  const { userKey, idemKey, activeKey } = keysFor(email, uuid)
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, 100 * attempt))
    try {
      const r = await redis.eval(LUA_FINALIZE, [userKey, idemKey, activeKey], [
        status, String(status === 'failed' ? cost : 0), String(creditsAfter),
        url || '', errorMsg || '', uuid,
      ])
      return { credits: parseInt(r, 10), conflictStatus: null }
    } catch (err) {
      const msg = err?.message || String(err)
      if (msg.startsWith('ALREADY_FINALIZED:')) {
        return { credits: creditsAfter, conflictStatus: msg.slice('ALREADY_FINALIZED:'.length) }
      }
      console.error('voice changer finalize error:', err)
    }
  }
  return { credits: null, conflictStatus: null }
}
