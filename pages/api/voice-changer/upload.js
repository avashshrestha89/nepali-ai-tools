// Issues a short-lived token so the browser can upload the clip straight to Vercel
// Blob. (Going through this server would hit Vercel's ~4.5 MB request limit.)
// Only signed-in Creator / Founders customers get a token, only for their own folder.
import { handleUpload } from '@vercel/blob/client'
import { list, del } from '@vercel/blob'
import { Redis } from '@upstash/redis'
import {
  canUseVoiceChanger, ALLOWED_TYPES, MAX_UPLOAD_BYTES, UPLOAD_PREFIX,
} from '../../../lib/voiceChanger'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const STALE_MS = 2 * 60 * 60 * 1000   // uploads nobody converted within 2 hours are removed

// Clips are deleted right after conversion. This catches the ones that were uploaded
// but never converted (closed tab, error). Runs at most once an hour.
async function sweepStaleUploads() {
  try {
    const gate = await redis.set('vc_sweep_gate', '1', { nx: true, ex: 3600 })
    if (!gate) return
    const { blobs } = await list({ prefix: `${UPLOAD_PREFIX}/`, limit: 1000 })
    const old = blobs.filter(b => Date.now() - new Date(b.uploadedAt).getTime() > STALE_MS).map(b => b.url)
    if (old.length) await del(old)
  } catch (e) {
    console.error('voice changer sweep error (non-fatal):', e.message)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const sessionToken = req.cookies.swor_session
  if (!sessionToken) return res.status(401).json({ error: 'Please sign in to use Voice Changer.' })

  let email, user
  try {
    const rawEmail = await redis.get(`session:${sessionToken}`)
    if (!rawEmail) return res.status(401).json({ error: 'Please sign in to use Voice Changer.' })
    email = String(rawEmail).trim().toLowerCase()
    const raw = await redis.get(`user:${email}`)
    if (!raw) return res.status(401).json({ error: 'Account not found.' })
    user = typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch (e) {
    return res.status(503).json({ error: 'Please try again in a moment.' })
  }

  if (!canUseVoiceChanger(user)) {
    return res.status(403).json({
      code: 'PLAN_REQUIRED',
      error: 'Voice Changer is included with the Creator and Founders packs.',
    })
  }

  try {
    const json = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(`${UPLOAD_PREFIX}/${email}/`) || pathname.includes('..')) {
          throw new Error('Invalid upload path')
        }
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          addRandomSuffix: true,
        }
      },
      onUploadCompleted: async () => {},
    })
    await sweepStaleUploads() // at most once an hour; awaited so it is not cut off when the response is sent
    return res.status(200).json(json)
  } catch (e) {
    console.error('voice changer upload token error:', e.message)
    return res.status(400).json({ error: 'Could not start the upload. Please try again.' })
  }
}
