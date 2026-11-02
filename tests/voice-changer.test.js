// Run: node tests/voice-changer.test.js   (needs ffmpeg to make the sample clips)
import assert from 'assert'
import { execFileSync } from 'child_process'
import { mkdtempSync, readFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { createRequire } from 'module'
import {
  voiceChangerCost, canUseVoiceChanger, isOwnUpload, VOICE_ID_RE,
} from '../lib/voiceChanger.js'

const require = createRequire(import.meta.url)
const { parseBuffer } = require('music-metadata')

// ── Cost: 1,000 credits per minute, 15-second blocks, rounded up ──────────────
assert.strictEqual(voiceChangerCost(1), 250)
assert.strictEqual(voiceChangerCost(15), 250)
assert.strictEqual(voiceChangerCost(15.01), 500)
assert.strictEqual(voiceChangerCost(30), 500)
assert.strictEqual(voiceChangerCost(45), 750)
assert.strictEqual(voiceChangerCost(59.9), 1000)
assert.strictEqual(voiceChangerCost(60), 1000)
assert.strictEqual(voiceChangerCost(60.02), 1000)   // encoder rounding on a "60s" clip
assert.strictEqual(voiceChangerCost(61), null)      // over the limit
assert.strictEqual(voiceChangerCost(0), null)
assert.strictEqual(voiceChangerCost(-5), null)
assert.strictEqual(voiceChangerCost(NaN), null)
assert.strictEqual(voiceChangerCost(undefined), null)
assert.strictEqual(voiceChangerCost('abc'), null)

// ── Who may use it ────────────────────────────────────────────────────────────
assert.strictEqual(canUseVoiceChanger({ plan: 'creator' }), true)
assert.strictEqual(canUseVoiceChanger({ plan: 'founders' }), true)
assert.strictEqual(canUseVoiceChanger({ isFounder: true }), true)
assert.strictEqual(canUseVoiceChanger({ plan: 'starter' }), false)
assert.strictEqual(canUseVoiceChanger({}), false)
assert.strictEqual(canUseVoiceChanger(null), false)
assert.strictEqual(canUseVoiceChanger({ plan: 'creator', isPendingPayment: true }), false)
assert.strictEqual(canUseVoiceChanger({ plan: 'starter', voiceChangerAccess: true }), true)

// ── Only our own upload URLs are accepted ─────────────────────────────────────
const ok = 'https://abc123.public.blob.vercel-storage.com/voicechanger-in/a@b.com/1-clip-xyz.mp3'
assert.strictEqual(isOwnUpload(ok, 'a@b.com'), true)
assert.strictEqual(isOwnUpload(ok, 'other@b.com'), false)                       // someone else's folder
assert.strictEqual(isOwnUpload('https://evil.com/voicechanger-in/a@b.com/x.mp3', 'a@b.com'), false)
assert.strictEqual(isOwnUpload('http://abc.public.blob.vercel-storage.com/voicechanger-in/a@b.com/x.mp3', 'a@b.com'), false)
assert.strictEqual(isOwnUpload('https://abc.public.blob.vercel-storage.com/voiceovers/a@b.com/x.mp3', 'a@b.com'), false)
assert.strictEqual(isOwnUpload('https://abc.public.blob.vercel-storage.com.evil.com/voicechanger-in/a@b.com/x.mp3', 'a@b.com'), false)
assert.strictEqual(isOwnUpload('not a url', 'a@b.com'), false)
assert.strictEqual(isOwnUpload(undefined, 'a@b.com'), false)

// ── Voice ids ─────────────────────────────────────────────────────────────────
assert.ok(VOICE_ID_RE.test('FszY75334ExxVmg7yl0U'))
assert.ok(!VOICE_ID_RE.test('../../v1/voices'))
assert.ok(!VOICE_ID_RE.test('abc'))

// ── Real files: the server measures the length itself ─────────────────────────
const dir = mkdtempSync(join(tmpdir(), 'vc-'))
async function measure(file) {
  const meta = await parseBuffer(readFileSync(file), undefined, { duration: true })
  return meta.format.duration
}
let ffmpegOk = true
try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }) } catch { ffmpegOk = false }
if (!ffmpegOk) {
  console.log('voice-changer tests passed (ffmpeg missing: skipped real-file checks)')
} else {
  const cases = [
    ['mp3', 14, 250], ['mp3', 15.5, 500], ['mp3', 44, 750], ['mp3', 59, 1000],
    ['wav', 30, 500], ['m4a', 20, 500], ['mp3', 75, null],
  ]
  for (const [ext, secs, expected] of cases) {
    const f = join(dir, `t-${ext}-${secs}.${ext}`)
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', `sine=frequency=440:duration=${secs}`, f])
    const d = await measure(f)
    assert.ok(Math.abs(d - secs) < 0.6, `${ext} ${secs}s measured ${d}`)
    assert.strictEqual(voiceChangerCost(d), expected, `${ext} ${secs}s -> ${d}`)
  }
  // A file with no readable audio must not be billable
  await assert.rejects(() => parseBuffer(Buffer.from('not audio at all'), undefined, { duration: true }))
  console.log('voice-changer tests passed (including real mp3, wav and m4a files)')
}
