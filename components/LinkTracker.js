import { useEffect } from 'react'
import { trackBeacon } from '../lib/track'

// Pack names we recognise in a WhatsApp message or a PayPal amount.
const PACKS = ['YouTube Starter', 'YouTube Pro', 'YouTube Empire', 'Starter', 'Creator', 'Founders', 'Custom']
const PAYPAL_AMOUNTS = { '4.99': 'Starter', '8.99': 'Creator', '19.99': 'Founders', '22.50': 'YouTube Starter', '37.50': 'YouTube Pro', '67.50': 'YouTube Empire' }

// One listener for every WhatsApp and PayPal link on the site, so no page needs editing.
function handleLinkClick(e) {
  try {
    const a = e.target && e.target.closest ? e.target.closest('a[href]') : null
    if (!a) return
    const href = a.getAttribute('href') || ''
    const page = window.location.pathname
    if (href.includes('wa.me')) {
      let msg = ''
      try { msg = decodeURIComponent((href.split('text=')[1] || '').replace(/\+/g, ' ')) } catch {}
      const pack = PACKS.find(p => msg.toLowerCase().includes(p.toLowerCase())) || ''
      const lower = msg.toLowerCase()
      const intent = lower.includes('completed my payment') ? 'payment_done'
        : lower.includes('buy') || lower.includes('custom plan') ? 'buy'
        : lower.includes('demo') || lower.includes('preview') ? 'demo_unlock'
        : lower.includes('business') ? 'business'
        : 'help'
      trackBeacon('whatsapp_click', { page, intent, pack })
      if (intent === 'buy') trackBeacon('buy_click', { page, pack, method: 'whatsapp' })
    } else if (href.includes('paypal.me')) {
      const amount = (href.split('paypal.me/sworai/')[1] || '').split(/[?#]/)[0]
      trackBeacon('buy_click', { page, pack: PAYPAL_AMOUNTS[amount] || '', method: 'paypal' })
    }
  } catch {}
}

// Renders nothing. Mount once (in _app.js) to track WhatsApp and PayPal link clicks site-wide.
export default function LinkTracker() {
  useEffect(() => {
    document.addEventListener('click', handleLinkClick, true)
    return () => document.removeEventListener('click', handleLinkClick, true)
  }, [])
  return null
}
