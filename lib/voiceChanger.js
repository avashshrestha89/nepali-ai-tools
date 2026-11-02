// Voice Changer rules, shared by the API routes, the page and the tests.
//
// Included in the Creator and Founders packs. It is paid with the same credits
// as a normal voiceover: 1,000 credits per minute of audio (the same rate as
// text-to-speech, where 1 credit = 1 spoken character and ~1,000 = 1 minute).
// No surcharge.

export const BLOCK_SECONDS = 15            // billed in 15-second blocks, rounded up
export const CREDITS_PER_BLOCK = 250       // 250 x 4 blocks = 1,000 credits per minute
export const MAX_SECONDS = 60              // longest clip we accept
export const DURATION_TOLERANCE = 0.5      // encoders report 60.02s for a "60s" clip
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024   // 60s of stereo WAV is ~10.6 MB
export const UPLOAD_PREFIX = 'voicechanger-in'
export const ALLOWED_TYPES = [
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/wave',
  'audio/mp4', 'audio/x-m4a', 'audio/m4a', 'audio/aac', 'audio/ogg',
]

// Only these plans may use it. user.voiceChangerAccess === true is a manual override.
export function canUseVoiceChanger(user) {
  if (!user || user.isPendingPayment) return false
  if (user.voiceChangerAccess === true) return true
  if (user.isFounder) return true
  return user.plan === 'creator' || user.plan === 'founders'
}

// Cost in credits for a clip of this many seconds. Returns null if it is too long
// or the length is not a usable number.
export function voiceChangerCost(durationSeconds) {
  const d = Number(durationSeconds)
  if (!Number.isFinite(d) || d <= 0) return null
  if (d > MAX_SECONDS + DURATION_TOLERANCE) return null
  const blocks = Math.min(MAX_SECONDS / BLOCK_SECONDS, Math.max(1, Math.ceil(d / BLOCK_SECONDS)))
  return blocks * CREDITS_PER_BLOCK
}

// Only accept files our own upload route created for this user.
export function isOwnUpload(url, email) {
  try {
    const u = new URL(url)
    if (u.protocol !== 'https:') return false
    if (!u.hostname.endsWith('.public.blob.vercel-storage.com')) return false
    return decodeURIComponent(u.pathname).startsWith(`/${UPLOAD_PREFIX}/${email}/`)
  } catch {
    return false
  }
}

export const VOICE_ID_RE = /^[A-Za-z0-9]{10,40}$/
