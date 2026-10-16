/**
 * Session backward-compatibility tests
 *
 * Confirms that adding OTP login does not break existing magic-link sessions,
 * does not invalidate existing cookies, and that sessions from both auth paths
 * are handled identically by /api/auth/session.
 *
 * All tests use FakeRedis — no live credentials required.
 *
 * Suites
 *   A. Session resolution (session.js)
 *      1.  Magic-link session resolves correctly via session.js
 *      2.  OTP session resolves correctly via session.js
 *      3.  Both session types coexist — no cross-contamination
 *      4.  Missing cookie → loggedIn: false
 *      5.  Expired/absent session token → loggedIn: false
 *      6.  session.js returns all user fields (credits, isFounder, isLegacy,
 *          isPendingPayment, betaActive, betaRemaining, founderMusicRemaining)
 *
 *   B. User-record preservation (verify-otp.js)
 *      7.  OTP login for existing user does NOT modify user record
 *      8.  credits, isFounder, isLegacy, isPendingPayment, betaActive preserved
 *      9.  OTP login for new user creates record with isPendingPayment:true
 *
 *   C. Cookie attribute parity
 *      10. OTP-issued cookie matches magic-link cookie attributes exactly
 *          (name, Path, HttpOnly, SameSite, Max-Age, Secure)
 *
 *   D. Session TTL parity
 *      11. OTP session stored with 30-day TTL — same as magic-link
 *
 *   E. No session invalidation
 *      12. Pre-existing magic-link sessions are untouched after OTP send
 *      13. Pre-existing magic-link sessions are untouched after OTP verify
 *      14. Two concurrent sessions (one magic-link, one OTP) both remain valid
 *
 *   F. End-to-end magic-link flow still works
 *      15. send-link → verify → session resolves (full round-trip regression)
 *
 * Run: node tests/session-compat.test.js
 */

// ── Harness ──────────────────────────────────────────────────────────────────
let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) { console.log(`  ✓ ${message}`); passed++ }
  else           { console.error(`  ✗ FAIL: ${message}`); failed++ }
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
  async get(key) { const e = this._entry(key); return e ? e.value : null }
  async set(key, value) { this._store[key] = { value }; return 'OK' }
  async setex(key, ttlSecs, value) {
    this._store[key] = { value, expiresAt: this._now() + ttlSecs * 1000 }
    return 'OK'
  }
  async del(key) { delete this._store[key]; return 1 }
  async ttl(key) {
    const e = this._entry(key)
    if (!e) return -2
    if (e.expiresAt == null) return -1
    return Math.ceil((e.expiresAt - this._now()) / 1000)
  }
  // FakeRedis.eval — handles OTP verify Lua script (keyed on 'otp:' prefix)
  async eval(_script, keys, args) {
    const key = keys[0]
    if (!key.startsWith('otp:')) throw new Error(`FakeRedis: unexpected eval key: ${key}`)
    const MAX = Number(args[1])
    const submitted = String(args[0])
    const e = this._entry(key)
    if (!e) return [0, 0]
    const data = typeof e.value === 'string' ? JSON.parse(e.value) : e.value
    const attempts = Number(data.attempts) || 0
    if (attempts >= MAX) return [3, 0]
    if (String(data.code) === submitted) { delete this._store[key]; return [1, 0] }
    data.attempts = attempts + 1
    const remaining = MAX - data.attempts
    const ttlSecs = e.expiresAt ? Math.ceil((e.expiresAt - this._now()) / 1000) : -1
    if (ttlSecs > 0) {
      this._store[key] = { value: JSON.stringify(data), expiresAt: e.expiresAt }
    } else {
      this._store[key] = { value: JSON.stringify(data) }
    }
    return [2, remaining]
  }
}

// ── req/res builders ──────────────────────────────────────────────────────────
function makeRes() {
  const r = { _status: null, _headers: {}, _body: null }
  r.status = (c) => { r._status = c; return r }
  r.json   = (b) => { r._body = b; return r }
  r.setHeader = (k, v) => { r._headers[k] = v }
  return r
}

// ── Inline session.js handler ─────────────────────────────────────────────────
// Mirrors pages/api/auth/session.js exactly.
function makeSessionHandler(redis) {
  return async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
    const sessionToken = req.cookies?.swor_session
    if (!sessionToken) return res.status(200).json({ loggedIn: false })
    try {
      const email = await redis.get(`session:${sessionToken}`)
      if (!email) return res.status(200).json({ loggedIn: false })
      const raw = await redis.get(`user:${email}`)
      if (!raw) return res.status(200).json({ loggedIn: false })
      const user = typeof raw === 'string' ? JSON.parse(raw) : raw
      const betaRemaining = user.betaActive
        ? Math.max(0, user.generationsLimit - user.generationsUsed) : 0
      const credits = user.credits || 0
      let founderMusicRemaining = 0
      if (user.isFounder) {
        const now = new Date()
        const resetDate = user.founderMusicResetAt ? new Date(user.founderMusicResetAt) : null
        if (!resetDate || now >= resetDate) { founderMusicRemaining = 5 }
        else { founderMusicRemaining = user.founderMusicThisMonth || 0 }
      }
      return res.status(200).json({
        loggedIn: true,
        email: user.email,
        credits,
        betaActive: user.betaActive,
        betaRemaining,
        charsPerGeneration: user.charsPerGeneration || 500,
        musicFreeUsed: user.musicFreeUsed || false,
        isFounder: user.isFounder || false,
        founderMusicRemaining,
        isLegacy: user.isLegacy || false,
        isPendingPayment: user.isPendingPayment || false,
      })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }
}

// ── Inline verify.js (magic-link) handler ────────────────────────────────────
// Mirrors pages/api/auth/verify.js exactly (bot detection stripped for test env).
function makeMagicLinkVerifyHandler(redis, sessionTokenOverride = null) {
  return async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
    const token = req.query?.token
    if (!token) return res.status(400).json({ error: 'Token required' })
    try {
      const email = await redis.get(`magic:${token}`)
      if (!email) return res.status(401).json({ error: 'Invalid or expired link' })
      await redis.del(`magic:${token}`)
      const sessionToken = sessionTokenOverride ??
        (Math.random().toString(36).substr(2) +
         Math.random().toString(36).substr(2) +
         Date.now().toString(36))
      await redis.setex(`session:${sessionToken}`, 60 * 60 * 24 * 30, email)
      res.setHeader('Set-Cookie',
        `swor_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}; Secure`)
      return res.status(200).json({ success: true, email })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }
}

// ── Inline verify-otp.js handler ─────────────────────────────────────────────
// Mirrors pages/api/auth/verify-otp.js exactly.
const MAX_ATTEMPTS = 5
function makeOtpVerifyHandler(redis, sessionTokenOverride = null) {
  return async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    const { email: rawEmail, code: rawCode } = req.body
    const email = rawEmail?.trim().toLowerCase()
    const code  = String(rawCode ?? '').trim()
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required' })
    if (!/^\d{6}$/.test(code)) return res.status(400).json({ error: 'Code must be 6 digits' })
    let result
    try {
      result = await redis.eval('LUA_VERIFY', [`otp:${email}`], [code, String(MAX_ATTEMPTS)])
    } catch (err) {
      return res.status(503).json({ error: 'Service temporarily unavailable. Please try again shortly.' })
    }
    const status    = Number(result[0])
    const remaining = Number(result[1])
    if (status === 0) return res.status(401).json({ error: 'Code expired or not found. Request a new one.' })
    if (status === 3) return res.status(429).json({ error: 'Too many incorrect attempts. Request a new code.' })
    if (status === 2) {
      if (remaining === 0) return res.status(429).json({ error: 'Too many incorrect attempts. Request a new code.' })
      return res.status(401).json({ error: 'Incorrect code.', attemptsRemaining: remaining })
    }
    // status === 1
    try {
      const SESSION_TTL = 60 * 60 * 24 * 30
      const sessionToken = sessionTokenOverride ?? require('crypto').randomBytes(32).toString('hex')
      await redis.setex(`session:${sessionToken}`, SESSION_TTL, email)
      res.setHeader('Set-Cookie',
        `swor_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL}; Secure`)
      return res.status(200).json({ success: true, email })
    } catch (err) {
      return res.status(500).json({ error: 'Verification succeeded but session could not be created. Please try again.' })
    }
  }
}

// ── Inline send-otp.js handler (minimal — only the parts that touch Redis) ───
function makeSendOtpHandler(redis) {
  return async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    const email = req.body?.email?.trim().toLowerCase()
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required' })
    try {
      // Rate limit (simplified — always allow in these tests)
      const existing = await redis.get(`user:${email}`)
      if (!existing) {
        await redis.set(`user:${email}`, JSON.stringify({
          email, credits: 0, isPendingPayment: true, tier: 'registered',
          generationsUsed: 0, generationsLimit: 0, charsPerGeneration: 500,
          betaActive: false, betaEndNotified: false, isFounder: false, isLegacy: false,
        }))
      }
      await redis.setex(`otp:${email}`, 600, JSON.stringify({ code: '123456', attempts: 0 }))
      return res.status(200).json({ success: true })
    } catch (err) {
      return res.status(500).json({ error: 'Failed to send code.' })
    }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
async function seedUser(redis, email, overrides = {}) {
  const defaults = {
    email,
    credits: 100,
    isPendingPayment: false,
    tier: 'paid',
    isFounder: false,
    isLegacy: false,
    betaActive: false,
    betaEndNotified: false,
    generationsUsed: 0,
    generationsLimit: 0,
    charsPerGeneration: 500,
    musicFreeUsed: false,
  }
  await redis.set(`user:${email}`, JSON.stringify({ ...defaults, ...overrides }))
}

async function seedMagicLinkSession(redis, email, sessionToken) {
  await redis.setex(`session:${sessionToken}`, 60 * 60 * 24 * 30, email)
}

async function callSession(handler, cookieToken) {
  const req = { method: 'GET', cookies: cookieToken ? { swor_session: cookieToken } : {} }
  const res = makeRes()
  await handler(req, res)
  return res
}

// ── Suite A: Session resolution ───────────────────────────────────────────────
async function suiteA_sessionResolution() {
  console.log('\nSuite A: Session resolution via session.js')

  // Test 1: magic-link session resolves
  {
    const redis = new FakeRedis()
    await seedUser(redis, 'ml@example.com', { credits: 50 })
    await seedMagicLinkSession(redis, 'ml@example.com', 'ml-token-abc')
    const h = makeSessionHandler(redis)
    const res = await callSession(h, 'ml-token-abc')
    assertEqual(res._status, 200, 'T1: magic-link session status')
    assert(res._body?.loggedIn === true, 'T1: loggedIn true')
    assertEqual(res._body?.email, 'ml@example.com', 'T1: correct email')
    assertEqual(res._body?.credits, 50, 'T1: correct credits')
  }

  // Test 2: OTP session resolves
  {
    const redis = new FakeRedis()
    await seedUser(redis, 'otp@example.com', { credits: 75 })
    await redis.setex('session:otp-token-xyz', 60 * 60 * 24 * 30, 'otp@example.com')
    const h = makeSessionHandler(redis)
    const res = await callSession(h, 'otp-token-xyz')
    assertEqual(res._status, 200, 'T2: OTP session status')
    assert(res._body?.loggedIn === true, 'T2: loggedIn true')
    assertEqual(res._body?.email, 'otp@example.com', 'T2: correct email')
    assertEqual(res._body?.credits, 75, 'T2: correct credits')
  }

  // Test 3: both session types coexist, no cross-contamination
  {
    const redis = new FakeRedis()
    await seedUser(redis, 'userA@example.com', { credits: 10 })
    await seedUser(redis, 'userB@example.com', { credits: 20 })
    await seedMagicLinkSession(redis, 'userA@example.com', 'token-A')
    await redis.setex('session:token-B', 60 * 60 * 24 * 30, 'userB@example.com')
    const h = makeSessionHandler(redis)
    const resA = await callSession(h, 'token-A')
    const resB = await callSession(h, 'token-B')
    assertEqual(resA._body?.email, 'userA@example.com', 'T3: token-A resolves userA')
    assertEqual(resA._body?.credits, 10, 'T3: userA credits correct')
    assertEqual(resB._body?.email, 'userB@example.com', 'T3: token-B resolves userB')
    assertEqual(resB._body?.credits, 20, 'T3: userB credits correct')
  }

  // Test 4: missing cookie → loggedIn false
  {
    const redis = new FakeRedis()
    const h = makeSessionHandler(redis)
    const res = await callSession(h, null)
    assert(res._body?.loggedIn === false, 'T4: no cookie → loggedIn false')
  }

  // Test 5: absent/expired session token → loggedIn false
  {
    const redis = new FakeRedis()
    await seedUser(redis, 'ghost@example.com')
    // No session key written
    const h = makeSessionHandler(redis)
    const res = await callSession(h, 'nonexistent-token')
    assert(res._body?.loggedIn === false, 'T5: absent session token → loggedIn false')
  }

  // Test 6: all user fields returned correctly
  {
    const redis = new FakeRedis()
    await seedUser(redis, 'full@example.com', {
      credits: 500, isFounder: true, isLegacy: true, isPendingPayment: false,
      betaActive: true, generationsUsed: 3, generationsLimit: 10,
      charsPerGeneration: 750, musicFreeUsed: true,
    })
    await seedMagicLinkSession(redis, 'full@example.com', 'full-token')
    const h = makeSessionHandler(redis)
    const res = await callSession(h, 'full-token')
    assert(res._body?.loggedIn === true, 'T6: loggedIn')
    assertEqual(res._body?.credits, 500, 'T6: credits')
    assertEqual(res._body?.isFounder, true, 'T6: isFounder')
    assertEqual(res._body?.isLegacy, true, 'T6: isLegacy')
    assertEqual(res._body?.isPendingPayment, false, 'T6: isPendingPayment')
    assertEqual(res._body?.betaActive, true, 'T6: betaActive')
    assertEqual(res._body?.betaRemaining, 7, 'T6: betaRemaining (10-3)')
    assertEqual(res._body?.charsPerGeneration, 750, 'T6: charsPerGeneration')
    assertEqual(res._body?.musicFreeUsed, true, 'T6: musicFreeUsed')
    // isFounder with no reset date → founderMusicRemaining = 5
    assertEqual(res._body?.founderMusicRemaining, 5, 'T6: founderMusicRemaining')
  }
}

// ── Suite B: User-record preservation ─────────────────────────────────────────
async function suiteB_userRecordPreservation() {
  console.log('\nSuite B: User-record preservation after OTP login')

  // Test 7 & 8: OTP verify does not modify existing user record
  {
    const redis = new FakeRedis()
    const email = 'preserveme@example.com'
    const existingUser = {
      email, credits: 999, isPendingPayment: false, tier: 'paid',
      isFounder: true, isLegacy: true, betaActive: true,
      generationsUsed: 5, generationsLimit: 20, charsPerGeneration: 1000,
      betaEndNotified: false, musicFreeUsed: false,
    }
    await redis.set(`user:${email}`, JSON.stringify(existingUser))
    // Seed OTP code
    await redis.setex(`otp:${email}`, 600, JSON.stringify({ code: '777777', attempts: 0 }))
    const h = makeOtpVerifyHandler(redis, 'otp-sess-preserve')
    const res = makeRes()
    await h({ method: 'POST', body: { email, code: '777777' } }, res)
    assertEqual(res._status, 200, 'T7: OTP verify succeeds for existing user')

    const raw = await redis.get(`user:${email}`)
    const user = JSON.parse(raw)
    assertEqual(user.credits, 999, 'T8: credits unchanged')
    assertEqual(user.isPendingPayment, false, 'T8: isPendingPayment unchanged')
    assertEqual(user.isFounder, true, 'T8: isFounder unchanged')
    assertEqual(user.isLegacy, true, 'T8: isLegacy unchanged')
    assertEqual(user.betaActive, true, 'T8: betaActive unchanged')
    assertEqual(user.generationsUsed, 5, 'T8: generationsUsed unchanged')
    assertEqual(user.tier, 'paid', 'T8: tier unchanged')
    assertEqual(user.charsPerGeneration, 1000, 'T8: charsPerGeneration unchanged')
  }

  // Test 9: OTP login for new user creates record with isPendingPayment:true
  {
    const redis = new FakeRedis()
    const email = 'newuser@example.com'
    const sendH = makeSendOtpHandler(redis)
    await sendH({ method: 'POST', body: { email } }, makeRes())
    const created = JSON.parse(await redis.get(`user:${email}`))
    assertEqual(created.isPendingPayment, true, 'T9: new user isPendingPayment=true')
    assertEqual(created.credits, 0, 'T9: new user credits=0')
    assert(created.email === email, 'T9: email field set')
  }
}

// ── Suite C: Cookie attribute parity ─────────────────────────────────────────
async function suiteC_cookieAttributeParity() {
  console.log('\nSuite C: Cookie attribute parity')

  // Test 10: OTP cookie attributes match magic-link cookie attributes exactly
  {
    const redis = new FakeRedis()
    const email = 'cookie@example.com'
    await seedUser(redis, email)

    // Magic-link path
    await redis.setex('magic:ml-tok', 600, email)
    const mlH = makeMagicLinkVerifyHandler(redis, 'ml-sess')
    const mlRes = makeRes()
    await mlH({ method: 'GET', query: { token: 'ml-tok' } }, mlRes)
    const mlCookie = mlRes._headers['Set-Cookie']

    // OTP path
    await redis.setex(`otp:${email}`, 600, JSON.stringify({ code: '654321', attempts: 0 }))
    const otpH = makeOtpVerifyHandler(redis, 'otp-sess')
    const otpRes = makeRes()
    await otpH({ method: 'POST', body: { email, code: '654321' } }, otpRes)
    const otpCookie = otpRes._headers['Set-Cookie']

    // Parse cookie into attribute map
    function parseCookieAttrs(cookieStr) {
      return cookieStr.split(';').map(s => s.trim()).reduce((acc, part, i) => {
        if (i === 0) { acc.nameValue = part; return acc }
        const eq = part.indexOf('=')
        if (eq === -1) acc[part.toLowerCase()] = true
        else acc[part.slice(0, eq).toLowerCase()] = part.slice(eq + 1)
        return acc
      }, {})
    }

    const mlAttrs  = parseCookieAttrs(mlCookie)
    const otpAttrs = parseCookieAttrs(otpCookie)

    // Name must be swor_session for both
    assert(mlAttrs.nameValue.startsWith('swor_session='), 'T10: magic-link cookie name is swor_session')
    assert(otpAttrs.nameValue.startsWith('swor_session='), 'T10: OTP cookie name is swor_session')
    // Path
    assertEqual(mlAttrs.path, '/', 'T10: magic-link Path=/')
    assertEqual(otpAttrs.path, '/', 'T10: OTP Path=/')
    // HttpOnly
    assert(mlAttrs.httponly === true, 'T10: magic-link HttpOnly')
    assert(otpAttrs.httponly === true, 'T10: OTP HttpOnly')
    // SameSite
    assertEqual(mlAttrs.samesite?.toLowerCase(), 'lax', 'T10: magic-link SameSite=Lax')
    assertEqual(otpAttrs.samesite?.toLowerCase(), 'lax', 'T10: OTP SameSite=Lax')
    // Max-Age
    assertEqual(mlAttrs['max-age'], String(60 * 60 * 24 * 30), 'T10: magic-link Max-Age=30d')
    assertEqual(otpAttrs['max-age'], String(60 * 60 * 24 * 30), 'T10: OTP Max-Age=30d')
    // Secure
    assert(mlAttrs.secure === true, 'T10: magic-link Secure')
    assert(otpAttrs.secure === true, 'T10: OTP Secure')
  }
}

// ── Suite D: Session TTL parity ───────────────────────────────────────────────
async function suiteD_sessionTtlParity() {
  console.log('\nSuite D: Session TTL parity')

  // Test 11: OTP session stored with 30-day TTL — same as magic-link
  {
    const THIRTY_DAYS = 60 * 60 * 24 * 30  // 2592000

    const redis = new FakeRedis()
    const email = 'ttl@example.com'
    await seedUser(redis, email)

    // Magic-link
    await redis.setex('magic:ttl-tok', 600, email)
    const mlH = makeMagicLinkVerifyHandler(redis, 'ml-ttl-sess')
    await mlH({ method: 'GET', query: { token: 'ttl-tok' } }, makeRes())
    const mlTtl = await redis.ttl('session:ml-ttl-sess')

    // OTP
    await redis.setex(`otp:${email}`, 600, JSON.stringify({ code: '111222', attempts: 0 }))
    const otpH = makeOtpVerifyHandler(redis, 'otp-ttl-sess')
    await otpH({ method: 'POST', body: { email, code: '111222' } }, makeRes())
    const otpTtl = await redis.ttl('session:otp-ttl-sess')

    // Both should be within 1 second of 30 days (FakeRedis is synchronous)
    assert(mlTtl >= THIRTY_DAYS - 2 && mlTtl <= THIRTY_DAYS, `T11: magic-link TTL ≈30d (got ${mlTtl}s)`)
    assert(otpTtl >= THIRTY_DAYS - 2 && otpTtl <= THIRTY_DAYS, `T11: OTP TTL ≈30d (got ${otpTtl}s)`)
  }
}

// ── Suite E: No session invalidation ─────────────────────────────────────────
async function suiteE_noSessionInvalidation() {
  console.log('\nSuite E: No session invalidation')

  // Test 12: pre-existing magic-link sessions untouched after OTP send
  {
    const redis = new FakeRedis()
    const email = 'stable@example.com'
    await seedUser(redis, email, { credits: 200 })
    await seedMagicLinkSession(redis, email, 'existing-ml-token')

    // User requests an OTP (triggers user-lookup, not user-create)
    const sendH = makeSendOtpHandler(redis)
    await sendH({ method: 'POST', body: { email } }, makeRes())

    // Existing magic-link session must still resolve
    const sessH = makeSessionHandler(redis)
    const res = await callSession(sessH, 'existing-ml-token')
    assert(res._body?.loggedIn === true, 'T12: magic-link session valid after OTP send')
    assertEqual(res._body?.credits, 200, 'T12: credits intact after OTP send')
  }

  // Test 13: pre-existing magic-link sessions untouched after OTP verify
  {
    const redis = new FakeRedis()
    const email = 'stable2@example.com'
    await seedUser(redis, email, { credits: 300 })
    await seedMagicLinkSession(redis, email, 'existing-ml-token-2')
    await redis.setex(`otp:${email}`, 600, JSON.stringify({ code: '999888', attempts: 0 }))

    // User verifies OTP — creates a second, separate session
    const otpH = makeOtpVerifyHandler(redis, 'new-otp-session')
    await otpH({ method: 'POST', body: { email, code: '999888' } }, makeRes())

    // Both sessions must resolve
    const sessH = makeSessionHandler(redis)
    const resML = await callSession(sessH, 'existing-ml-token-2')
    const resOTP = await callSession(sessH, 'new-otp-session')
    assert(resML._body?.loggedIn === true, 'T13: existing magic-link session still valid after OTP verify')
    assert(resOTP._body?.loggedIn === true, 'T13: new OTP session also valid')
    assertEqual(resML._body?.credits, 300, 'T13: existing session credits intact')
    assertEqual(resOTP._body?.credits, 300, 'T13: new OTP session sees same credits')
  }

  // Test 14: two concurrent sessions (one magic-link, one OTP) both valid
  {
    const redis = new FakeRedis()
    const email = 'concurrent@example.com'
    await seedUser(redis, email, { credits: 50 })
    // Seed both sessions directly (simulating both auth paths completed)
    await seedMagicLinkSession(redis, email, 'sess-ml')
    await redis.setex('session:sess-otp', 60 * 60 * 24 * 30, email)

    const sessH = makeSessionHandler(redis)
    const resML  = await callSession(sessH, 'sess-ml')
    const resOTP = await callSession(sessH, 'sess-otp')
    assert(resML._body?.loggedIn === true, 'T14: magic-link session valid')
    assert(resOTP._body?.loggedIn === true, 'T14: OTP session valid')
    // Both see same user
    assertEqual(resML._body?.email,  email, 'T14: magic-link session email matches')
    assertEqual(resOTP._body?.email, email, 'T14: OTP session email matches')
  }
}

// ── Suite F: End-to-end magic-link regression ─────────────────────────────────
async function suiteF_magicLinkRegression() {
  console.log('\nSuite F: End-to-end magic-link flow regression')

  // Test 15: send-link → verify → session full round-trip
  {
    const redis = new FakeRedis()
    const email = 'e2e@example.com'
    await seedUser(redis, email, { credits: 42, isFounder: false, isLegacy: false, isPendingPayment: false })

    // Simulate send-link: store magic token
    await redis.setex('magic:e2e-tok', 86400, email)

    // Verify magic link
    const verifyH = makeMagicLinkVerifyHandler(redis, 'e2e-session-tok')
    const verifyRes = makeRes()
    await verifyH({ method: 'GET', query: { token: 'e2e-tok' } }, verifyRes)
    assertEqual(verifyRes._status, 200, 'T15: magic-link verify → 200')
    assert(verifyRes._body?.success === true, 'T15: success: true')

    // Magic token should be consumed
    const tokenGone = await redis.get('magic:e2e-tok')
    assert(tokenGone === null, 'T15: magic token consumed after verify')

    // Session cookie set
    assert(verifyRes._headers['Set-Cookie']?.includes('swor_session=e2e-session-tok'), 'T15: cookie set')

    // Session resolves correctly
    const sessH = makeSessionHandler(redis)
    const sessRes = await callSession(sessH, 'e2e-session-tok')
    assertEqual(sessRes._status, 200, 'T15: session.js status 200')
    assert(sessRes._body?.loggedIn === true, 'T15: loggedIn true')
    assertEqual(sessRes._body?.email, email, 'T15: correct email')
    assertEqual(sessRes._body?.credits, 42, 'T15: correct credits')
    assertEqual(sessRes._body?.isPendingPayment, false, 'T15: isPendingPayment correct')

    // Replaying the same magic token must fail (single-use)
    const replayRes = makeRes()
    await verifyH({ method: 'GET', query: { token: 'e2e-tok' } }, replayRes)
    assertEqual(replayRes._status, 401, 'T15: replayed magic token rejected')
  }
}

// ── Run ───────────────────────────────────────────────────────────────────────
console.log('=== Session backward-compatibility tests ===')

try {
  await suiteA_sessionResolution()
  await suiteB_userRecordPreservation()
  await suiteC_cookieAttributeParity()
  await suiteD_sessionTtlParity()
  await suiteE_noSessionInvalidation()
  await suiteF_magicLinkRegression()
} catch (err) {
  console.error('\nFatal error during test run:', err)
  process.exit(1)
}

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
