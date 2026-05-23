import { useState, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const [activeTab, setActiveTab] = useState('subtitle')

  // Subtitle state
  const [subFile, setSubFile] = useState(null)
  const [subStyle, setSubStyle] = useState('devanagari')
  const [subLoading, setSubLoading] = useState(false)
  const [subResult, setSubResult] = useState(null)
  const [subError, setSubError] = useState(null)
  const [subDragOver, setSubDragOver] = useState(false)
  const subInputRef = useRef(null)

  // 15 voices — Nepali audience naming
  const VOICES = [
    // ── Female Voices ──
    { voice_id: '1zUSi8LeHs9M2mV8X6YS', name: 'Priyanka — Romantic & Elegant (Female)' },
    { voice_id: 'LK1Sn9bmEczSFI65RF0v', name: 'Sunita — Soft Spoken Nepali Aunty (Female)' },
    { voice_id: 'duDBJHU6G1oq7ZdK4Kxf', name: 'Anjali — Motivational & Uplifting (Female)' },
    { voice_id: 'TmPeb2hSxdVrThJLywkg', name: 'Vanishree — Professional & News Style (Female)' },
    { voice_id: 'ecp3DWciuUyW7BYM7II1', name: 'Anika — Sweet & Lively Reels Voice (Female)' },
    { voice_id: 'f0JpDwzbGK384Dd1WH2s', name: 'Mina — Friendly & Polished (Female)' },
    { voice_id: 'Pc57DSBXmCXyEAmow7lW', name: 'Shraddha — Credible & Trustworthy (Female)' },
    { voice_id: '6qL48o1LBmtR94hIYAQh', name: 'Monika — Suspense & Drama Narrator (Female)' },
    // ── Male Voices ──
    { voice_id: 'FszY75334ExxVmg7yl0U', name: 'Dhurundhar — Deep & Commanding (Male)' },
    { voice_id: 'WdZjiN0nNcik2LBjOHiv', name: 'Bishnu — Wise Documentary Narrator (Male)' },
    { voice_id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Rohan — Casual & Laid-Back (Male)' },
    { voice_id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Arjun — Energetic Social Media Creator (Male)' },
    { voice_id: 'g1FVKFidZjHPxXdfA89c', name: 'Vikram — Confident & Warm (Male)' },
    { voice_id: '2W8HrWcBFzCEf5cQQdIL', name: 'Karan — Dark Documentary Narrator (Male)' },
    { voice_id: 'rHhok70RpCi5GgianXRA', name: 'Rudra — Intense & Romantic (Male)' },
  ]

  // Voiceover state
  const [voiceText, setVoiceText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('1zUSi8LeHs9M2mV8X6YS')
  const [voiceLoading, setVoiceLoading] = useState(false)
  const [voiceResult, setVoiceResult] = useState(null)
  const [voiceError, setVoiceError] = useState(null)

  function handleFileDrop(e) {
    e.preventDefault()
    setSubDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setSubFile(file)
  }

  async function handleTranscribe() {
    if (!subFile) return
    setSubLoading(true)
    setSubResult(null)
    setSubError(null)

    const formData = new FormData()
    formData.append('audio', subFile)
    formData.append('style', subStyle)

    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Transcription failed')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const filename = `nepali_subtitles_${Date.now()}.srt`
      setSubResult({ url, filename, lines: null })

      const text = await blob.text()
      const lineCount = text.split('\n\n').filter(Boolean).length
      setSubResult({ url, filename, lines: lineCount })
    } catch (e) {
      setSubError(e.message)
    }
    setSubLoading(false)
  }

  async function handleVoiceover() {
    if (!voiceText.trim() || !selectedVoice) return
    setVoiceLoading(true)
    setVoiceResult(null)
    setVoiceError(null)

    try {
      const res = await fetch('/api/voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: voiceText, voiceId: selectedVoice }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Voiceover generation failed')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const filename = `nepali_voiceover_${Date.now()}.mp3`
      setVoiceResult({ url, filename })
    } catch (e) {
      setVoiceError(e.message)
    }
    setVoiceLoading(false)
  }

  function downloadFile(url, filename) {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }

  const charCount = voiceText.length
  const charWarning = charCount > 5000
  const charLimit = 100

  return (
    <>
      <Head>
        <title>Swor — AI Nepali Tools by MeroAD.ai</title>
        <meta name="description" content="Nepali subtitle and voiceover generator" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #F5F3EF; color: #1A1A1A; min-height: 100vh; }
        .devanagari { font-family: 'Noto Sans Devanagari', 'Inter', sans-serif; }
      `}</style>

      {/* TOPBAR */}
      <div style={{ background: '#0E0E16', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#DC143C,#FF6B8A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 800 }}>स्</div>
            <span style={{ color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: '-0.3px' }}>Swor</span>
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 14 }}>|</span>
          <Link href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            ← Home
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Beta Tool</span>
          <Link href="/#apply" style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 20, background: '#DC143C', color: '#fff', textDecoration: 'none' }}>Apply for Beta →</Link>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 20px 80px' }}>

        {/* HEADLINE */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5, marginBottom: 8 }}>
            AI-Powered Nepali Tools
          </h1>
          <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
            Generate Nepali subtitles and voiceovers using AI.<br />
            Subtitles in Devanagari or Romanized script. Voiceovers in 24 hours.
          </p>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, background: '#ECEAE5', borderRadius: 12, padding: 4 }}>
          {[
            { id: 'subtitle', label: '🎬 Nepali Subtitles', sub: 'Video → .SRT file' },
            { id: 'voiceover', label: '🎙️ Nepali Voiceover', sub: 'Text → .MP3 file' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
                background: activeTab === t.id ? '#fff' : 'transparent',
                boxShadow: activeTab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: activeTab === t.id ? '#0E0E16' : '#888' }}>{t.label}</div>
              <div style={{ fontSize: 11, color: activeTab === t.id ? '#666' : '#aaa', marginTop: 1 }}>{t.sub}</div>
            </button>
          ))}
        </div>

        {/* ── SUBTITLE TAB ── */}
        {activeTab === 'subtitle' && (
          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0DDD7', padding: 28 }}>

            {/* Upload area */}
            <div
              onDragOver={e => { e.preventDefault(); setSubDragOver(true) }}
              onDragLeave={() => setSubDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => subInputRef.current?.click()}
              style={{
                border: `2px dashed ${subDragOver ? '#FF4757' : subFile ? '#1A9E6A' : '#D0CCC5'}`,
                borderRadius: 12, padding: '32px 20px', textAlign: 'center',
                cursor: 'pointer', marginBottom: 20, transition: 'border-color 0.15s',
                background: subDragOver ? '#FFF8F8' : subFile ? '#F0FAF5' : '#FAFAF8',
              }}
            >
              <input
                ref={subInputRef} type="file"
                accept="video/*,audio/*,.mp4,.mov,.mp3,.wav,.m4a,.webm,.ogg"
                style={{ display: 'none' }}
                onChange={e => setSubFile(e.target.files[0])}
              />
              <div style={{ fontSize: 28, marginBottom: 8 }}>{subFile ? '✅' : '🎬'}</div>
              {subFile ? (
                <>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A9E6A' }}>{subFile.name}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                    {(subFile.size / (1024 * 1024)).toFixed(1)} MB — Click to change
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>
                    Drop your video or audio file here
                  </div>
                  <div style={{ fontSize: 12, color: '#888' }}>MP4, MOV, MP3, WAV, M4A — up to 25MB</div>
                </>
              )}
            </div>

            {/* Style toggle */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>Subtitle Script</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { id: 'devanagari', label: 'देवनागरी', sub: 'Nepali script' },
                  { id: 'romanized', label: 'Romanized', sub: 'English letters' },
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSubStyle(s.id)}
                    style={{
                      flex: 1, padding: '10px 14px', borderRadius: 10,
                      border: `1.5px solid ${subStyle === s.id ? '#FF4757' : '#E0DDD7'}`,
                      background: subStyle === s.id ? '#FFF5F5' : '#FAFAF8',
                      cursor: 'pointer', transition: 'all 0.12s',
                    }}
                  >
                    <div className={s.id === 'devanagari' ? 'devanagari' : ''} style={{ fontSize: 14, fontWeight: 600, color: subStyle === s.id ? '#FF4757' : '#555' }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{s.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleTranscribe}
              disabled={!subFile || subLoading}
              style={{
                width: '100%', padding: '13px 20px', borderRadius: 10,
                border: 'none', cursor: subFile && !subLoading ? 'pointer' : 'not-allowed',
                background: subFile && !subLoading ? '#0E0E16' : '#CCC',
                color: '#fff', fontSize: 14, fontWeight: 600,
                transition: 'background 0.15s', marginBottom: 14,
              }}
            >
              {subLoading ? '⏳ Generating subtitles... (may take 30–60 seconds)' : '✨ Generate Nepali Subtitles'}
            </button>

            {/* Error */}
            {subError && (
              <div style={{ background: '#FFF0F0', border: '1px solid #FFB8B8', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#CC3333', marginBottom: 14 }}>
                ❌ {subError}
              </div>
            )}

            {/* Result */}
            {subResult && (
              <div style={{ background: '#F0FAF5', border: '1.5px solid #1A9E6A', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A9E6A' }}>✓ Subtitles ready!</div>
                  {subResult.lines && <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{subResult.lines} subtitle segments generated</div>}
                </div>
                <button
                  onClick={() => downloadFile(subResult.url, subResult.filename)}
                  style={{ padding: '8px 18px', borderRadius: 8, border: '1.5px solid #1A9E6A', background: '#1A9E6A', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                >
                  ⬇ Download .SRT
                </button>
              </div>
            )}

            <div style={{ marginTop: 16, fontSize: 11, color: '#aaa', lineHeight: 1.6, borderTop: '1px solid #F0EDE8', paddingTop: 14 }}>
              <strong style={{ color: '#888' }}>How to use the .SRT file:</strong> In CapCut → open your project → Subtitles → Import → select the .SRT file. Done. Works with TikTok, Instagram, YouTube.
            </div>
          </div>
        )}

        {/* ── VOICEOVER TAB ── */}
        {activeTab === 'voiceover' && (
          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #E0DDD7', padding: 28 }}>

            {/* Text input */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Nepali Text</div>
                <div style={{ fontSize: 11, color: charWarning ? '#E8533A' : '#aaa' }}>{charCount.toLocaleString()} / {charLimit.toLocaleString()} characters</div>
              </div>
              <textarea
                value={voiceText}
                onChange={e => setVoiceText(e.target.value.slice(0, charLimit))}
                placeholder={'नमस्ते! आज हामी एउटा नयाँ उत्पादनको बारेमा कुरा गर्दैछौं...\n\nType or paste your Nepali text here. Works with Devanagari script.'}
                className="devanagari"
                style={{
                  width: '100%', minHeight: 160, padding: '12px 14px',
                  border: `1.5px solid ${charWarning ? '#E8533A' : '#E0DDD7'}`,
                  borderRadius: 10, fontSize: 14, lineHeight: 1.7, resize: 'vertical',
                  fontFamily: 'Noto Sans Devanagari, Inter, sans-serif',
                  color: '#1A1A1A', background: '#FAFAF8', outline: 'none',
                }}
              />
              {charWarning && (
                <div style={{ fontSize: 11, color: '#E8533A', marginTop: 4 }}>⚠ Over 5,000 characters may take longer to generate</div>
              )}
              <div style={{ background: 'linear-gradient(90deg,#FFF0F3,#F8F0FF)', border: '1.5px solid rgba(220,20,60,.2)', borderRadius: 10, padding: '12px 14px', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#DC143C' }}>🔒 Preview mode — 100 character limit</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Apply for beta access to unlock 5,000 characters/month free</div>
                </div>
                <a href="/" style={{ fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 8, background: '#DC143C', color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap' }}>Apply Free →</a>
              </div>
            </div>

            {/* Voice selection */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>
                Select Voice
              </div>
              <select
                value={selectedVoice}
                onChange={e => setSelectedVoice(e.target.value)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  border: '1.5px solid #E0DDD7', background: '#FAFAF8',
                  fontSize: 13, color: '#1A1A1A', outline: 'none', cursor: 'pointer',
                }}
              >
                {VOICES.map(v => (
                  <option key={v.voice_id} value={v.voice_id}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* Generate button */}
            <button
              onClick={handleVoiceover}
              disabled={!voiceText.trim() || !selectedVoice || voiceLoading}
              style={{
                width: '100%', padding: '13px 20px', borderRadius: 10,
                border: 'none', cursor: voiceText.trim() && selectedVoice && !voiceLoading ? 'pointer' : 'not-allowed',
                background: voiceText.trim() && selectedVoice && !voiceLoading ? '#0E0E16' : '#CCC',
                color: '#fff', fontSize: 14, fontWeight: 600,
                transition: 'background 0.15s', marginBottom: 14,
              }}
            >
              {voiceLoading ? '⏳ Generating voiceover...' : '🎙️ Generate Nepali Voiceover'}
            </button>

            {/* Error */}
            {voiceError && (
              <div style={{ background: '#FFF0F0', border: '1px solid #FFB8B8', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#CC3333', marginBottom: 14 }}>
                ❌ {voiceError}
              </div>
            )}

            {/* Result */}
            {voiceResult && (
              <div>
                <div style={{ background: '#F0FAF5', border: '1.5px solid #1A9E6A', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A9E6A' }}>✓ Voiceover ready!</div>
                    <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>Preview below or download</div>
                  </div>
                  <button
                    onClick={() => downloadFile(voiceResult.url, voiceResult.filename)}
                    style={{ padding: '8px 18px', borderRadius: 8, border: '1.5px solid #1A9E6A', background: '#1A9E6A', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    ⬇ Download .MP3
                  </button>
                </div>
                <audio controls src={voiceResult.url} style={{ width: '100%', borderRadius: 8 }} />
              </div>
            )}

            <div style={{ marginTop: 16, fontSize: 11, color: '#aaa', lineHeight: 1.6, borderTop: '1px solid #F0EDE8', paddingTop: 14 }}>
              <strong style={{ color: '#888' }}>How to use the .MP3:</strong> In CapCut → open your project → Audio → Import → select the .MP3 file. Adjust volume and sync to your video.
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 11, color: '#bbb' }}>
          Powered by Groq Whisper + ElevenLabs · Built by MeroAD.ai · Kathmandu, Nepal
        </div>
      </div>
    </>
  )
}
