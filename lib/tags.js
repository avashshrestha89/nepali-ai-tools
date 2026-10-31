// Emotion / sound tags like [excited] or [long pause] are free: only the words
// that are actually spoken cost credits. Client and server both use this.
// A tag is square brackets around 1-25 Latin letters/spaces. Devanagari text
// in brackets is NOT a tag and is still billed.
const TAG_RE = /\[[A-Za-z][A-Za-z ]{0,24}\] ?/g

export function stripTags(text) {
  return String(text || '').replace(TAG_RE, '')
}

// Tags the Auto tag button is allowed to add.
export const AUTO_TAGS = ['pause', 'long pause', 'whispers', 'excited', 'calm', 'serious', 'sad', 'happy', 'curious']

// Letters/marks/digits only. Used to prove the AI changed no words.
export function wordsOnly(text) {
  return stripTags(text).replace(/\.{2,}|…/g, '').replace(/[^\p{L}\p{M}\p{N}]/gu, '')
}
