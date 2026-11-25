// Admin only: CSV export for analysis. No full email addresses, no secrets.
// Columns carry the email domain and a short anonymous reference instead of the address.
import crypto from 'crypto'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const COLUMNS = [
  'user_ref', 'email_domain', 'plan', 'tier', 'credits', 'total_credits_assigned',
  'generations_used', 'signup_date', 'last_generation_date', 'saved_history_count',
  'is_legacy', 'is_founder', 'pending_payment',
]

function parse(raw) {
  if (!raw) return null
  if (typeof raw !== 'string') return raw
  try { return JSON.parse(raw) } catch { return null }
}

function csvCell(v) {
  const s = v === null || v === undefined ? '' : String(v)
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}

function day(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(d) ? '' : d.toISOString().slice(0, 10)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { adminPassword } = req.body || {}
  if (!process.env.ADMIN_PASSWORD || adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const keys = (await redis.keys('user:*')) || []
    const rows = []
    for (let i = 0; i < keys.length; i += 100) {
      const chunk = keys.slice(i, i + 100)
      const users = (await redis.mget(...chunk)).map(parse)
      const emails = users.map((u, j) => (u && u.email) || chunk[j].replace(/^user:/, ''))
      const histories = (await redis.mget(...emails.map(e => `history:${e}`))).map(parse)

      users.forEach((u, j) => {
        if (!u) return
        const email = String(emails[j]).toLowerCase()
        const hist = Array.isArray(histories[j]) ? histories[j] : []
        rows.push({
          user_ref: crypto.createHash('sha256').update(email).digest('hex').slice(0, 8),
          email_domain: email.includes('@') ? email.split('@')[1] : '',
          plan: u.plan || '',
          tier: u.tier || '',
          credits: u.credits ?? 0,
          total_credits_assigned: u.totalCreditsAssigned ?? '',
          generations_used: u.generationsUsed ?? 0,
          signup_date: day(u.createdAt),
          last_generation_date: day(hist[0] && hist[0].createdAt),
          saved_history_count: hist.length,
          is_legacy: u.isLegacy ? 'yes' : 'no',
          is_founder: u.isFounder ? 'yes' : 'no',
          pending_payment: u.isPendingPayment ? 'yes' : 'no',
        })
      })
    }

    const csv = [COLUMNS.join(',')]
      .concat(rows.map(r => COLUMNS.map(c => csvCell(r[c])).join(',')))
      .join('\n')

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="swor-ai-export.csv"')
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).send(csv)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
