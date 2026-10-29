// One-time cleanup: delete voiceover audio that is not in anyone's last-5 history.
//
// Usage (from the repo root, with env vars set):
//   node scripts/cleanup-blobs.js            -> DRY RUN, deletes nothing
//   node scripts/cleanup-blobs.js --confirm  -> actually deletes
//
// Needs: BLOB_READ_WRITE_TOKEN, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
// Safety: files uploaded in the last 2 hours are always kept.

const { list, del } = require('@vercel/blob')
const { Redis } = require('@upstash/redis')

const CONFIRM = process.argv.includes('--confirm')
const MIN_AGE_MS = 2 * 60 * 60 * 1000

async function main() {
  for (const k of ['BLOB_READ_WRITE_TOKEN', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']) {
    if (!process.env[k]) { console.error('Missing env var: ' + k); process.exit(1) }
  }
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

  // 1. Collect every URL that is still in someone's history
  const keep = new Set()
  let cursor = 0
  let histories = 0
  do {
    const [next, keys] = await redis.scan(cursor, { match: 'history:*', count: 500 })
    cursor = Number(next)
    for (const key of keys) {
      const raw = await redis.get(key)
      if (!raw) continue
      let arr
      try { arr = typeof raw === 'string' ? JSON.parse(raw) : raw } catch { continue }
      histories++
      for (const h of arr || []) if (h && h.url) keep.add(h.url)
    }
  } while (cursor !== 0)
  console.log(`Histories read: ${histories}, files to keep: ${keep.size}`)

  // 2. List voiceover blobs, pick the ones not in the keep set
  const toDelete = []
  let total = 0, totalBytes = 0, blobCursor
  do {
    const page = await list({ prefix: 'voiceovers/', cursor: blobCursor, limit: 1000 })
    for (const b of page.blobs) {
      total++; totalBytes += b.size
      const age = Date.now() - new Date(b.uploadedAt).getTime()
      if (!keep.has(b.url) && age > MIN_AGE_MS) toDelete.push(b)
    }
    blobCursor = page.hasMore ? page.cursor : undefined
  } while (blobCursor)

  const freed = toDelete.reduce((n, b) => n + b.size, 0)
  const mb = n => (n / 1024 / 1024).toFixed(1) + ' MB'
  console.log(`Voiceover files in storage: ${total} (${mb(totalBytes)})`)
  console.log(`Not in any last-5 history: ${toDelete.length} files, would free ${mb(freed)}`)

  if (!CONFIRM) {
    console.log('\nDRY RUN. Nothing deleted. Re-run with --confirm to delete.')
    return
  }
  for (let i = 0; i < toDelete.length; i += 100) {
    await del(toDelete.slice(i, i + 100).map(b => b.url))
    console.log(`Deleted ${Math.min(i + 100, toDelete.length)} / ${toDelete.length}`)
  }
  console.log('Done. Freed ' + mb(freed))
}

main().catch(e => { console.error(e); process.exit(1) })
