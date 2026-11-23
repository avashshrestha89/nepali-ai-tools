// Tiny GA4 helper. Safe to call anywhere: does nothing if GA is not loaded
// (no NEXT_PUBLIC_GA_ID, ad blocker, server render). Never pass emails or
// other personal data in params.
export function track(name, params = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', name, params)
    }
  } catch {}
}

// Same, but uses a beacon so the event still goes out when the click leaves
// the page (WhatsApp, PayPal).
export function trackBeacon(name, params = {}) {
  track(name, { ...params, transport_type: 'beacon' })
}
