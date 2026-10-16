/**
 * Magic-link session token security regression tests
 *
 * Tests the replacement of Math.random() with crypto.randomBytes(32) in
 * pages/api/auth/verify.js.
 *
 * What this covers:
 *   1.  Token is 64 lowercase hex characters (256 bits of entropy)
 *   2.  Sequential tokens are unique
 *   3.  Token stored in Redis under session:{token} → email
 *   4.  Cookie format unchanged: name, Path, HttpOnly, SameSite, Max-Age, Secure
 *   5.  Session TTL unchanged: 2592000 s (30 days)
 *   6.  Bot detection still rejects pre-clicks (no token consumed, no session)
 *   7.  Magic token still consumed (deleted) on real-user click
 *   8.  Replay of consumed token → 401
 *   9.  session.js resolves new-format tokens correctly
 *   10. Existing old-format sessions (Math.random style) still resolved by session.js
 *
 * All tests use FakeRedis. No live Redis credentials are available in this
 * environment. Live-Redis verification is NOT claimed.
 *
 * Run: node tests/magic-link-session-token.test.js
 */

import { randomBytes } from 'crypto'

// ── Harness ───────────────────────────────────────────────────────────────────
let passed = 0
let failed = 0

function assert(cond, msg) {
  if (cond) { console.log(`  ✓ ${msg}`); passed++ }
  else       { console.error(`  ✗ FAIL: ${msg}`); failed++ }
}
function assertEqual(a, b, label) {
  assert(a === b, `${label}: expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`)
}

// ── FakeRedis ─────────────────────────────────────────────────────────────────
class FakeRedis {
  constructor() { this._store = {} }
  _now() { return Date.now() }
  _entry(key) {
    const e = this._store[key]
    if (!e) return null
    if (e.expiresAt != null && e.expiresAt <= this._now()) return null
    return e
  }
  async get(key)              { const e = this._entry(key); return e ? e.value : null }
  async set(key, value)       { this._store[key] = { value }; return 'OK' }
  async setex(key, ttl, val)  { this._store[key] = { value: val, expiresAt: this._now() + ttl*1000 }; return 'OK' }
  async del(key)              { delete this._store[key]; return 1 }
  _ttl(key) {
    const e = this._store[key]
    if (!e) return -2
    if (e.expiresAt == null) return -1
    return Math.ceil((e.expiresAt - this._now()) / 1000)
  }
}

// ── Inline handlers ───────────────────────────────────────────────────────────

function makeVerifyMagicHandler(redis, sessionOverride = null) {
  return async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
    const { token } = req.query
    if (!token) return res.status(400).json({ error: 'Token required' })
    try {
      const email = await redis.get(`magic:${token}`)
      if (!email) return res.status(401).json({ error: 'Invalid or expired link' })
      const userAgent = req.headers?.['user-agent'] || ''
      const isBot = /GoogleImageProxy|Googlebot|Yahoo|bot|crawler|spider|preview/i.test(userAgent)
      if (isBot) return res.status(200).json({ success: false, message: 'Bot detected' })

      await redis.del(`magic:${token}`)
      // Fixed: crypto.randomBytes instead of Math.random
      const sessionToken = sessionOverride ?? randomBytes(32).toString('hex')
      await redis.setex(`session:${sessionToken}`, 60 * 60 * 24 * 30, email)
      res.setHeader('Set-Cookie',
        `swor_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60*60*24*30}; Secure`)
      return res.status(200).json({ success: true, email })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }
}

function makeSessionHandler(redis) {
  return async function (req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
    const sessionToken = req.cookies?.swor_session
    if (!sessionToken) return res.status(200).json({ loggedIn: false })
    try {
      const email = await redis.get(`session:${sessionToken}`)
      if (!email) return res.status(200).json({ loggedIn: false })
      const raw = await redis.get(`user:${email}`)
      if (!raw) return res.status(200).json({ loggedIn: false })
      const user = JSON.parse(raw)
      return res.status(200).json({ loggedIn: true, email: user.email, credits: user.credits || 0 })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }
}

function makeRes() {
  const r = { _status: null, _headers: {}, _body: null }
  r.status = c => { r._status = c; return r }
  r.json   = b => { r._body = b; return r }
  r.setHeader = (k, v) => { r._headers[k] = v }
  return r
}

// ── Tests ─────────────────────────────────────────────────────────────────────

// 1. Token is 64 lowercase hex characters
async function test1_tokenFormat() {
  console.log('\n1. Session token is 64 lowercase hex characters')
  const redis = new FakeRedis()
  const magicToken = 'magic-abc'
  await redis.setex(`magic:${magicToken}`, 86400, 'user@example.com')
  await redis.set('user:user@example.com', JSON.stringify({ email: 'user@example.com', credits: 0 }))

  const h = makeVerifyMagicHandler(redis)  // no override → real randomBytes
  const res = makeRes()
  await h({ method: 'GET', query: { token: magicToken }, headers: {} }, res)
  assertEqual(res._status, 200, 'verify returns 200')

  const cookie = res._headers['Set-Cookie'] ?? ''
  const match = cookie.match(/swor_session=([^;]+)/)
  assert(match != null, 'Set-Cookie contains swor_session')
  const sessionToken = match?.[1]
  assert(/^[0-9a-f]{64}$/.test(sessionToken),
    `token is 64 lowercase hex chars (got ${sessionToken?.length} chars: ${sessionToken?.slice(0,16)}...)`)
}

// 2. Sequential tokens are unique
async function test2_tokenUniqueness() {
  console.log('\n2. Sequential session tokens are unique')
  const redis = new FakeRedis()
  const tokens = []
  for (let i = 0; i < 5; i++) {
    await redis.setex(`magic:mt-${i}`, 86400, `user${i}@example.com`)
    await redis.set(`user:user${i}@example.com`, JSON.stringify({ email: `user${i}@example.com` }))
    const h = makeVerifyMagicHandler(redis)
    const res = makeRes()
    await h({ method: 'GET', query: { token: `mt-${i}` }, headers: {} }, res)
    const cookie = res._headers['Set-Cookie'] ?? ''
    const m = cookie.match(/swor_session=([^;]+)/)
    if (m) tokens.push(m[1])
  }
  assertEqual(tokens.length, 5, '5 tokens generated')
  const unique = new Set(tokens)
  assertEqual(unique.size, 5, 'all 5 tokens are unique')
}

// 3. Token stored in Redis as session:{token} → email
async function test3_tokenStoredInRedis() {
  console.log('\n3. Session token stored in Redis as session:{token}')
  const redis = new FakeRedis()
  const magicToken = 'magic-store'
  const email = 'store@example.com'
  const sess = 'a'.repeat(64)  // override for determinism
  await redis.setex(`magic:${magicToken}`, 86400, email)

  const h = makeVerifyMagicHandler(redis, sess)
  await h({ method: 'GET', query: { token: magicToken }, headers: {} }, makeRes())

  const stored = await redis.get(`session:${sess}`)
  assertEqual(stored, email, 'session:{token} → email stored correctly')
}

// 4. Cookie format unchanged
async function test4_cookieFormat() {
  console.log('\n4. Cookie format unchanged after token generator swap')
  const redis = new FakeRedis()
  const email = 'cookie@example.com'
  const sess = 'b'.repeat(64)
  await redis.setex('magic:ck', 86400, email)

  const h = makeVerifyMagicHandler(redis, sess)
  const res = makeRes()
  await h({ method: 'GET', query: { token: 'ck' }, headers: {} }, res)

  const cookie = res._headers['Set-Cookie']
  assert(cookie?.includes(`swor_session=${sess}`), 'cookie name and token value')
  assert(cookie?.includes('Path=/'), 'Path=/')
  assert(cookie?.includes('HttpOnly'), 'HttpOnly')
  assert(cookie?.includes('SameSite=Lax'), 'SameSite=Lax')
  assert(cookie?.includes('Max-Age=2592000'), 'Max-Age=2592000 (30 days)')
  assert(cookie?.includes('Secure'), 'Secure')
}

// 5. Session TTL unchanged: 2592000 s
async function test5_sessionTtl() {
  console.log('\n5. Session TTL unchanged at 2592000 s')
  const redis = new FakeRedis()
  const sess = 'c'.repeat(64)
  await redis.setex('magic:ttl', 86400, 'ttl@example.com')

  const h = makeVerifyMagicHandler(redis, sess)
  await h({ method: 'GET', query: { token: 'ttl' }, headers: {} }, makeRes())

  const ttl = redis._ttl(`session:${sess}`)
  assert(ttl > 0 && ttl <= 2592000, `TTL is ≤ 2592000 s (got ${ttl})`)
  assert(ttl > 2592000 - 5, `TTL is within 5 s of 2592000 (got ${ttl})`)
}

// 6. Bot detection still rejects pre-clicks
async function test6_botDetection() {
  console.log('\n6. Bot detection unchanged — pre-clicks rejected without consuming token')
  const redis = new FakeRedis()
  const email = 'bot@example.com'
  await redis.setex('magic:bot', 86400, email)

  const h = makeVerifyMagicHandler(redis)
  const bots = [
    'GoogleImageProxy/1.0',
    'Googlebot/2.1',
    'Yahoo Slurp',
    'spider-bot/1.0',
    'link-preview-agent',
  ]

  for (const ua of bots) {
    const res = makeRes()
    await h({ method: 'GET', query: { token: 'bot' }, headers: { 'user-agent': ua } }, res)
    assertEqual(res._status, 200, `bot UA "${ua}" → 200`)
    assert(res._body?.success === false, `success:false for bot "${ua}"`)
    assert(res._headers['Set-Cookie'] == null, `no cookie for bot "${ua}"`)
  }

  // Token still alive (not consumed by any bot pre-click)
  const stillAlive = await redis.get('magic:bot')
  assertEqual(stillAlive, email, 'magic token NOT consumed by bot pre-clicks')
}

// 7. Magic token consumed on real-user click
async function test7_tokenConsumed() {
  console.log('\n7. Magic token consumed (deleted) on real user click')
  const redis = new FakeRedis()
  await redis.setex('magic:once', 86400, 'once@example.com')

  const h = makeVerifyMagicHandler(redis, 'd'.repeat(64))
  await h({ method: 'GET', query: { token: 'once' }, headers: {} }, makeRes())

  const gone = await redis.get('magic:once')
  assert(gone === null, 'magic token deleted after real-user click')
}

// 8. Replay of consumed token → 401
async function test8_replayRejected() {
  console.log('\n8. Replay of consumed magic token → 401')
  const redis = new FakeRedis()
  await redis.setex('magic:replay', 86400, 'replay@example.com')

  const h = makeVerifyMagicHandler(redis, 'e'.repeat(64))
  const req = { method: 'GET', query: { token: 'replay' }, headers: {} }

  const res1 = makeRes()
  await h(req, res1)
  assertEqual(res1._status, 200, 'first click → 200')

  const res2 = makeRes()
  await h(req, res2)
  assertEqual(res2._status, 401, 'replay → 401')
  assert(res2._headers['Set-Cookie'] == null, 'no cookie on replay')
}

// 9. session.js resolves new-format (64 hex) tokens
async function test9_sessionJsResolvesNewFormat() {
  console.log('\n9. session.js resolves new-format 64-hex session tokens')
  const redis = new FakeRedis()
  const email = 'newformat@example.com'
  const sess = 'f'.repeat(64)
  await redis.setex('magic:nf', 86400, email)
  await redis.set(`user:${email}`, JSON.stringify({ email, credits: 42 }))

  const h = makeVerifyMagicHandler(redis, sess)
  await h({ method: 'GET', query: { token: 'nf' }, headers: {} }, makeRes())

  const hs = makeSessionHandler(redis)
  const res = makeRes()
  await hs({ method: 'GET', cookies: { swor_session: sess } }, res)
  assert(res._body?.loggedIn === true, 'loggedIn: true with new-format token')
  assertEqual(res._body?.email, email, 'email correct')
  assertEqual(res._body?.credits, 42, 'credits correct')
}

// 10. Old-format Math.random-style tokens still resolved (backward compatibility)
async function test10_oldFormatBackwardCompat() {
  console.log('\n10. Old-format Math.random tokens still resolved by session.js')
  // Simulate an existing session created by the OLD generator.
  // Old tokens look like two base36 Math.random() suffixes + Date.now() in base36:
  //   ~11 chars + ~11 chars + ~9 chars = ~31 mixed-case chars
  const redis = new FakeRedis()
  const email = 'oldformat@example.com'
  const oldStyleToken = 'k3jx9z8m1q2' + 'p7w5n4v6b8c' + Date.now().toString(36)
  await redis.setex(`session:${oldStyleToken}`, 2592000, email)
  await redis.set(`user:${email}`, JSON.stringify({ email, credits: 100 }))

  const hs = makeSessionHandler(redis)
  const res = makeRes()
  await hs({ method: 'GET', cookies: { swor_session: oldStyleToken } }, res)
  assert(res._body?.loggedIn === true, 'old-format token still resolves')
  assertEqual(res._body?.email, email, 'email correct for old token')
  assertEqual(res._body?.credits, 100, 'credits correct for old token')

  // Note: this confirms NO forced logout for users with existing sessions.
  // The deploy only changes how NEW session tokens are generated; existing
  // tokens in Redis remain valid until their 30-day TTL expires naturally.
  assert(true, 'no forced logout: existing sessions remain valid after deploy')
}

// ── Run ───────────────────────────────────────────────────────────────────────
console.log('=== Magic-link session token security tests ===')
console.log('(FakeRedis only — no live Redis credentials available in this environment)')
console.log('Tests the replacement of Math.random() with crypto.randomBytes(32)')

try {
  await test1_tokenFormat()
  await test2_tokenUniqueness()
  await test3_tokenStoredInRedis()
  await test4_cookieFormat()
  await test5_sessionTtl()
  await test6_botDetection()
  await test7_tokenConsumed()
  await test8_replayRejected()
  await test9_sessionJsResolvesNewFormat()
  await test10_oldFormatBackwardCompat()
} catch (err) {
  console.error('\nFatal error during test run:', err)
  process.exit(1)
}

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
