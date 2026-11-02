import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { upload } from '@vercel/blob/client'
import { VOICE_CATEGORIES, VOICES } from '../lib/voices'
import {
  voiceChangerCost, MAX_SECONDS, MAX_UPLOAD_BYTES, UPLOAD_PREFIX, DURATION_TOLERANCE,
} from '../lib/voiceChanger'

const WHATSAPP = 'https://wa.me/19255379425?text=' + encodeURIComponent('Hi, I want the Creator pack to use Voice Changer')

const EXT_TYPES = {
  mp3: 'audio/mpeg', wav: 'audio/wav', m4a: 'audio/mp4', mp4: 'audio/mp4',
  aac: 'audio/aac', ogg: 'audio/ogg',
}

function fileContentType(file) {
  if (file.type) return file.type
  const ext = (file.name.split('.').pop() || '').toLowerCase()
  return EXT_TYPES[ext] || 'audio/mpeg'
}

function safeName(name) {
  const clean = name.replace(/[^A-Za-z0-9._-]/g, '_').slice(-60)
  return clean || 'clip.mp3'
}

export default function VoiceChanger() {
  const [session, setSession] = useState(null)        // null = loading, false = signed out
  const [file, setFile] = useState(null)
  const [seconds, setSeconds] = useState(null)
  const [fileError, setFileError] = useState(null)
  const [voice, setVoice] = useState(VOICES.find(v => v.voice_id === 'FszY75334ExxVmg7yl0U') || VOICES[0])
  const [removeNoise, setRemoveNoise] = useState(false)
  const [consent, setConsent] = useState(false)
  const [stage, setStage] = useState('idle')          // idle | uploading | converting
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)          // { url, seconds, cost }
  const urlRef = useRef(null)

  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(d => setSession(d.loggedIn ? d : false)).catch(() => setSession(false))
  }, [])

  useEffect(() => () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current) }, [])

  const cost = seconds ? voiceChangerCost(seconds) : null
  const busy = stage !== 'idle'
  const canRun = !!file && cost !== null && consent && !busy && session && session.canVoiceChange &&
    (session.credits || 0) >= (cost || 0)

  function onPickFile(e) {
    const f = e.target.files && e.target.files[0]
    setResult(null); setError(null); setFileError(null); setSeconds(null); setFile(null)
    if (!f) return
    if (f.size > MAX_UPLOAD_BYTES) { setFileError('That file is too large. Please use a clip of 60 seconds or less (MP3, WAV or M4A).'); return }
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    const objectUrl = URL.createObjectURL(f)
    urlRef.current = objectUrl
    const a = new Audio()
    a.preload = 'metadata'
    a.onloadedmetadata = () => {
      const d = a.duration
      if (!Number.isFinite(d) || d <= 0) { setFileError('We could not read this audio. Please use an MP3, WAV or M4A file.'); return }
      if (d > MAX_SECONDS + DURATION_TOLERANCE) {
        setFileError(`Your clip is ${Math.round(d)} seconds. The limit is ${MAX_SECONDS} seconds. Please trim it and try again.`)
        return
      }
      setFile(f); setSeconds(d)
    }
    a.onerror = () => setFileError('We could not read this audio. Please use an MP3, WAV or M4A file.')
    a.src = objectUrl
  }

  async function convert() {
    if (!canRun) return
    setError(null); setResult(null)
    try {
      setStage('uploading')
      const email = String(session.email).trim().toLowerCase()
      const blob = await upload(`${UPLOAD_PREFIX}/${email}/${Date.now()}-${safeName(file.name)}`, file, {
        access: 'public',
        handleUploadUrl: '/api/voice-changer/upload',
        contentType: fileContentType(file),
      })

      setStage('converting')
      const res = await fetch('/api/voice-changer/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceUrl: blob.url,
          voiceId: voice.voice_id,
          voiceName: voice.name,
          idempotencyKey: crypto.randomUUID(),
          consent: true,
          removeNoise,
        }),
      })
      const d = await res.json().catch(() => ({}))
      if (res.ok && d.url) {
        setResult({ url: d.url, seconds: d.seconds, cost: d.cost })
        if (typeof d.credits === 'number') setSession(s => ({ ...s, credits: d.credits }))
      } else {
        if (typeof d.credits === 'number') setSession(s => ({ ...s, credits: d.credits }))
        setError(d.error || 'Something went wrong. Please try again.')
      }
    } catch (e) {
      setError(/PLAN_REQUIRED|Creator/.test(String(e && e.message))
        ? 'Voice Changer is included with the Creator and Founders packs.'
        : 'Upload failed. Please check your connection and try again.')
    }
    setStage('idle')
  }

  const card = { background: '#fff', borderRadius: 14, border: '1.5px solid #e8e8ed', padding: 18, marginBottom: 14 }
  const label = { fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 8, display: 'block' }

  return (
    <>
      <Head>
        <title>Voice Changer — Swor AI by MeroAD.ai</title>
        <meta name="description" content="Record in your own voice and convert it into a professional Nepali AI voice. Included with the Creator and Founders packs." />
        <link rel="canonical" href="https://meroadai.com/voice-changer" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Manrope', sans-serif; background: #f5f5f7; color: #1d1d1f; }
        select, button { font-family: inherit; }
      `}</style>

      <nav style={{ background: '#fff', borderBottom: '1px solid #e8e8ed', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: 'linear-gradient(135deg,#DC143C,#FF6B8A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 800 }}>M</div>
            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Sora,sans-serif', color: '#1d1d1f' }}>Swor AI</span>
          </Link>
          <Link href="/voiceover" style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}>← Voiceover</Link>
        </div>
        {session && <div style={{ fontSize: 13, fontWeight: 600, background: '#E8F4FD', color: '#1976D2', padding: '5px 12px', borderRadius: 20 }}>{session.credits || 0} credits</div>}
      </nav>

      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8ed', padding: '20px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FDECEF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔄</div>
          <div>
            <h1 style={{ fontFamily: 'Sora,sans-serif', fontSize: 20, fontWeight: 800, letterSpacing: '-0.4px' }}>Voice Changer</h1>
            <p style={{ fontSize: 13, color: '#888', marginTop: 2 }}>Speak or record in your own voice, get it back in a professional AI voice</p>
          </div>
        </div>
      </div>

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px 60px' }}>
        {session === null && <p style={{ color: '#888', fontSize: 14 }}>Loading…</p>}

        {session === false && (
          <div style={card}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Sign in to use Voice Changer</div>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>Voice Changer is included with the Creator and Founders packs.</p>
            <Link href="/voiceover" style={{ background: '#1976D2', color: '#fff', padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>Sign in →</Link>
          </div>
        )}

        {session && !session.canVoiceChange && (
          <div style={{ ...card, background: '#FFF8E1', borderColor: '#FFE082' }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>🔒 Included with Creator and Founders</div>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
              Upgrade to the Creator or Founders pack to turn your own recordings into any of our Nepali AI voices. It uses the same credits as your voiceovers, nothing extra to pay.
            </p>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" style={{ background: '#25D366', color: '#fff', padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>Get Creator on WhatsApp →</a>
            <p style={{ fontSize: 12, color: '#999', marginTop: 10 }}>Already on Creator or Founders? Message us on WhatsApp and we will switch it on for you.</p>
          </div>
        )}

        {session && session.canVoiceChange && (
          <>
            <div style={card}>
              <span style={label}>1. Your audio (MP3, WAV or M4A, up to {MAX_SECONDS} seconds)</span>
              <input type="file" accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg" onChange={onPickFile} disabled={busy} style={{ fontSize: 13 }} />
              {fileError && <p style={{ color: '#C62828', fontSize: 13, marginTop: 8 }}>{fileError}</p>}
              {file && seconds && (
                <p style={{ fontSize: 13, color: '#444', marginTop: 8 }}>
                  {file.name} · {Math.round(seconds)} seconds · <strong>{cost} credits</strong>
                </p>
              )}
              <p style={{ fontSize: 11, color: '#999', marginTop: 8 }}>
                Cost: 1,000 credits per minute, counted in 15-second blocks (250 credits each). Same credits as your voiceovers.
              </p>
            </div>

            <div style={card}>
              <span style={label}>2. Choose the voice you want to hear</span>
              <select value={voice.voice_id} onChange={e => setVoice(VOICES.find(v => v.voice_id === e.target.value))} disabled={busy}
                style={{ width: '100%', padding: '10px 12px', fontSize: 14, borderRadius: 10, border: '1.5px solid #e0e0e0', background: '#fff' }}>
                {VOICE_CATEGORIES.map(cat => (
                  <optgroup key={cat.category} label={cat.category}>
                    {cat.voices.map(v => <option key={v.voice_id} value={v.voice_id}>{v.name} — {v.desc}</option>)}
                  </optgroup>
                ))}
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#444', marginTop: 12 }}>
                <input type="checkbox" checked={removeNoise} onChange={e => setRemoveNoise(e.target.checked)} disabled={busy} />
                Remove background noise
              </label>
            </div>

            <div style={card}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#444', lineHeight: 1.5 }}>
                <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} disabled={busy} style={{ marginTop: 3 }} />
                <span>
                  I own this recording or have permission to use it, and I will not use it to imitate a real person to mislead others.
                  I have read the <Link href="/terms" target="_blank" style={{ color: '#DC143C' }}>Terms</Link> and <Link href="/privacy-policy" target="_blank" style={{ color: '#DC143C' }}>Privacy Policy</Link>.
                </span>
              </label>
            </div>

            <button onClick={convert} disabled={!canRun}
              style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', fontSize: 15, fontWeight: 800, color: '#fff', background: canRun ? '#DC143C' : '#ccc', cursor: canRun ? 'pointer' : 'not-allowed' }}>
              {stage === 'uploading' ? 'Uploading…' : stage === 'converting' ? 'Converting… (up to 30 seconds)' : cost ? `Convert for ${cost} credits` : 'Convert'}
            </button>
            {file && cost && (session.credits || 0) < cost && (
              <p style={{ color: '#C62828', fontSize: 13, marginTop: 10 }}>You have {session.credits || 0} credits but this needs {cost}.</p>
            )}
            {error && <p style={{ color: '#C62828', fontSize: 13, marginTop: 10 }}>{error}</p>}

            {result && (
              <div style={{ ...card, marginTop: 16, borderColor: '#A5D6A7', background: '#F1F8F1' }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>✅ Done · {result.cost} credits used</div>
                <audio controls src={result.url} style={{ width: '100%' }} />
                <a href={result.url} download target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 10, fontSize: 13, fontWeight: 700, color: '#1976D2' }}>Download MP3</a>
                <p style={{ fontSize: 12, color: '#777', marginTop: 8 }}>
                  Saved to your last 5 on the <Link href="/voiceover" style={{ color: '#1976D2' }}>Voiceover page</Link>. Your uploaded recording has been deleted from our storage.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </>
  )
}
