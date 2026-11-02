// Voice Changer: take the clip the customer uploaded, convert it to the chosen
// stock voice with ElevenLabs speech-to-speech, save the result to their history.
//
// Billing: 1,000 credits per minute in 15-second blocks (250 credits each), using the
// length WE measure from the file, never a number sent by the browser.
// Privacy: the uploaded clip is deleted from our storage as soon as the request ends.
import fetch from 'node-fetch'
import FormData from 'form-data'
import { put, del } from '@vercel/blob'
import { Redis } from '@upstash/redis'
import { createHash } from 'crypto'
import { parseBuffer } from 'music-metadata'
import { reserve, finalize, keysFor } from '../../../lib/credits'
import {
  canUseVoiceChanger, voiceChangerCost, isOwnUpload, VOICE_ID_RE,
  MAX_SECONDS, MAX_UPLOAD_BYTES,
} from '../../../lib/voiceChanger'

export const config = { maxDuration: 60 }

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const MAX_HISTORY = 5
const STALE_THRESHOLD_MS = 120_000

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { sourceUrl, voiceId, voiceName, idempotencyKey, consent, removeNoise } = req.body || {}

  if (typeof sourceUrl !== 'string' || !sourceUrl) {
    return res.status(400).json({ code: 'INVALID_INPUT', error: 'No audio uploaded.' })
  }
  if (typeof voiceId !== 'string' || !VOICE_ID_RE.test(voiceId)) {
    return res.status(400).json({ code: 'INVALID_INPUT', error: 'No voice selected.' })
  }
  if (typeof idempotencyKey !== 'string' || idempotencyKey.length < 8) {
    return res.status(400).json({ code: 'INVALID_INPUT', error: 'Valid idempotency key required.' })
  }
  if (consent !== true) {
    return res.status(400).json({ code: 'CONSENT_REQUIRED', error: 'Please confirm you have the right to use this audio.' })
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const sessionToken = req.cookies.swor_session
  if (!sessionToken) return res.status(401).json({ code: 'NOT_LOGGED_IN', error: 'Not logged in' })

  let email, user
  try {
    const rawEmail = await redis.get(`session:${sessionToken}`)
    if (!rawEmail) return res.status(401).json({ code: 'INVALID_SESSION', error: 'Invalid session' })
    email = String(rawEmail).trim().toLowerCase()
    const raw = await redis.get(`user:${email}`)
    if (!raw) return res.status(401).json({ code: 'USER_NOT_FOUND', error: 'User not found' })
    user = typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch (err) {
    console.error('voice changer session error:', err)
    return res.status(500).json({ code: 'SERVER_ERROR', error: 'Server error. Please try again.' })
  }

  if (user.isPendingPayment) {
    return res.status(403).json({ code: 'PENDING_PAYMENT', error: 'Your account is pending payment activation. Please contact support via WhatsApp.' })
  }
  if (!canUseVoiceChanger(user)) {
    return res.status(403).json({ code: 'PLAN_REQUIRED', error: 'Voice Changer is included with the Creator and Founders packs.' })
  }
  if (!isOwnUpload(sourceUrl, email)) {
    return res.status(400).json({ code: 'INVALID_INPUT', error: 'Please upload your audio again.' })
  }

  const noise = removeNoise === true
  const payloadHash = createHash('sha256').update(`${sourceUrl}|${voiceId}|${noise}`).digest('hex')
  const { userKey, idemKey } = keysFor(email, idempotencyKey)

  // The clip is gone once a request finishes, so a repeat of the same request must be
  // answered from the saved record BEFORE we try to read the clip again.
  try {
    const raw = await redis.get(idemKey)
    if (raw) {
      const idem = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (idem.payloadHash !== payloadHash) {
        return res.status(409).json({ code: 'PAYLOAD_MISMATCH', error: 'Please start a new conversion.' })
      }
      if (idem.status === 'complete') {
        return res.status(200).json({ url: idem.url, credits: idem.creditsAfter, cached: true })
      }
      if (idem.status === 'failed') {
        return res.status(422).json({ code: 'CONVERSION_FAILED', error: idem.error || 'Conversion failed. Please try again.', credits: idem.creditsAfter, cached: true })
      }
      if (idem.status === 'processing') {
        if (Date.now() - (idem.ts || 0) > STALE_THRESHOLD_MS) {
          const cost = idem.creditsDeducted || 0
          await finalize(redis, email, idempotencyKey, 'failed', cost, (idem.creditsAfter ?? 0) + cost, null, 'Conversion timed out. Credits refunded.')
          return res.status(422).json({ code: 'CONVERSION_FAILED', error: 'The previous conversion timed out. Credits were refunded. Please try again.' })
        }
        return res.status(202).json({ code: 'IN_PROGRESS', error: 'Conversion is already in progress. Please wait.' })
      }
    }
  } catch (err) {
    console.error('voice changer idem lookup error (non-fatal):', err)
  }

  // From here on the uploaded clip must always be removed when we finish.
  let reservedCost = 0
  let creditsAfterReserve = null
  const fail = async (status, code, userMsg, refund = true) => {
    let credits
    if (refund && reservedCost > 0) {
      const r = await finalize(redis, email, idempotencyKey, 'failed', reservedCost, creditsAfterReserve + reservedCost, null, userMsg)
      credits = r.credits ?? creditsAfterReserve + reservedCost
    }
    return res.status(status).json({ code, error: userMsg, ...(credits !== undefined ? { credits } : {}) })
  }

  try {
    // ── Read the clip and measure its real length ───────────────────────────
    let audioIn
    try {
      const src = await fetch(sourceUrl)
      if (!src.ok) throw new Error(`source ${src.status}`)
      audioIn = Buffer.from(await src.arrayBuffer())
    } catch (e) {
      console.error('voice changer source fetch error:', e.message)
      return fail(400, 'INVALID_INPUT', 'We could not read your audio. Please upload it again.', false)
    }
    if (audioIn.length > MAX_UPLOAD_BYTES) {
      return fail(400, 'FILE_TOO_LARGE', 'That file is too large. Please upload a clip of 60 seconds or less.', false)
    }

    let seconds
    try {
      const meta = await parseBuffer(audioIn, undefined, { duration: true })
      seconds = meta.format.duration
    } catch (e) {
      console.error('voice changer metadata error:', e.message)
    }
    const cost = voiceChangerCost(seconds)
    if (cost === null) {
      const msg = Number.isFinite(seconds) && seconds > 0
        ? `Your clip is ${Math.round(seconds)} seconds. The limit is ${MAX_SECONDS} seconds. Please trim it and try again.`
        : 'We could not read the length of this audio. Please use an MP3, WAV or M4A file.'
      return fail(400, 'INVALID_AUDIO', msg, false)
    }

    // ── Take the credits first ──────────────────────────────────────────────
    const r = await reserve(redis, email, idempotencyKey, cost, payloadHash)
    if (!r.ok) {
      return res.status(r.status).json({ code: r.code, error: r.error, credits: r.credits, required: r.required })
    }
    reservedCost = cost
    creditsAfterReserve = r.credits

    // ── Convert ─────────────────────────────────────────────────────────────
    let audioOut
    try {
      const form = new FormData()
      form.append('audio', audioIn, { filename: 'input.mp3', contentType: 'audio/mpeg' })
      form.append('model_id', 'eleven_multilingual_sts_v2')
      form.append('voice_settings', JSON.stringify({ stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true }))
      form.append('remove_background_noise', noise ? 'true' : 'false')

      const response = await fetch(
        `https://api.elevenlabs.io/v1/speech-to-speech/${voiceId}?output_format=mp3_44100_64`,
        {
          method: 'POST',
          headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, Accept: 'audio/mpeg', ...form.getHeaders() },
          body: form,
        }
      )
      if (!response.ok) {
        console.error('voice changer ElevenLabs error:', response.status)
        return fail(422, 'CONVERSION_FAILED', 'Voice conversion failed. Your credits were refunded. Please try again.')
      }
      audioOut = Buffer.from(await response.arrayBuffer())
    } catch (e) {
      console.error('voice changer convert error:', e.message)
      return fail(500, 'CONVERSION_FAILED', 'Voice conversion failed due to a network error. Your credits were refunded. Please try again.')
    }

    // ── Save the result ─────────────────────────────────────────────────────
    const timestamp = Date.now()
    let blobUrl
    try {
      const blob = await put(`voiceovers/${email}/${timestamp}.mp3`, audioOut, { access: 'public', contentType: 'audio/mpeg' })
      blobUrl = blob.url
    } catch (e) {
      console.error('voice changer store error:', e)
      return fail(500, 'CONVERSION_FAILED', 'Failed to store the audio. Your credits were refunded. Please try again.')
    }

    // History (best effort), same last-5 rule as voiceovers.
    try {
      const historyRaw = await redis.get(`history:${email}`)
      const history = historyRaw ? (typeof historyRaw === 'string' ? JSON.parse(historyRaw) : historyRaw) : []
      const entry = {
        id: timestamp,
        text: `Voice Changer · ${Math.round(seconds)}s`,
        voiceName: voiceName ? String(voiceName).slice(0, 40) : voiceId,
        url: blobUrl,
        createdAt: new Date().toISOString(),
      }
      const updated = [entry, ...history]
      await redis.set(`history:${email}`, JSON.stringify(updated.slice(0, MAX_HISTORY)))
      const evicted = updated.slice(MAX_HISTORY).map(h => h && h.url).filter(Boolean)
      if (evicted.length) { try { await del(evicted) } catch (e) { console.error('Blob cleanup error:', e) } }
    } catch (e) {
      console.error('voice changer history error (non-fatal):', e)
    }

    const fin = await finalize(redis, email, idempotencyKey, 'complete', 0, creditsAfterReserve, blobUrl, null)
    if (fin.conflictStatus === 'failed') {
      return res.status(409).json({ code: 'CONFLICT', error: 'Conversion finished, but a timeout recovery had already refunded your credits. Please try again.' })
    }
    if (fin.credits === null) {
      console.error(`CRITICAL: voice changer finalize failed email=${email} key=${idempotencyKey} blobUrl=${blobUrl} cost=${cost}`)
      return res.status(503).json({ code: 'FINALIZE_PENDING', error: 'Conversion finished but could not be confirmed. Please try again.' })
    }

    return res.status(200).json({ url: blobUrl, credits: fin.credits, seconds: Math.round(seconds), cost })
  } finally {
    // Always remove the customer's uploaded clip.
    try { await del(sourceUrl) } catch (e) { console.error('voice changer source delete error:', e.message) }
  }
}
