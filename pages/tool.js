import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const VOICES = [
  { voice_id: '1zUSi8LeHs9M2mV8X6YS', name: 'Priyanka — Romantic & Elegant (Female)' },
  { voice_id: 'LK1Sn9bmEczSFI65RF0v', name: 'Sunita — Soft Spoken Nepali Aunty (Female)' },
  { voice_id: 'duDBJHU6G1oq7ZdK4Kxf', name: 'Anjali — Motivational & Uplifting (Female)' },
  { voice_id: 'TmPeb2hSxdVrThJLywkg', name: 'Vanishree — Professional & News Style (Female)' },
  { voice_id: 'ecp3DWciuUyW7BYM7II1', name: 'Anika — Sweet & Lively Reels Voice (Female)' },
  { voice_id: 'f0JpDwzbGK384Dd1WH2s', name: 'Mina — Friendly & Polished (Female)' },
  { voice_id: 'Pc57DSBXmCXyEAmow7lW', name: 'Shraddha — Credible & Trustworthy (Female)' },
  { voice_id: '6qL48o1LBmtR94hIYAQh', name: 'Monika — Suspense & Drama Narrator (Female)' },
  { voice_id: 'FszY75334ExxVmg7yl0U', name: 'Dhurundhar — Deep & Commanding (Male)' },
  { voice_id: 'WdZjiN0nNcik2LBjOHiv', name: 'Bishnu — Wise Documentary Narrator (Male)' },
  { voice_id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Rohan — Casual & Laid-Back (Male)' },
  { voice_id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Arjun — Energetic Social Media Creator (Male)' },
  { voice_id: 'g1FVKFidZjHPxXdfA89c', name: 'Vikram — Confident & Warm (Male)' },
  { voice_id: '2W8HrWcBFzCEf5cQQdIL', name: 'Karan — Dark Documentary Narrator (Male)' },
  { voice_id: 'rHhok70RpCi5GgianXRA', name: 'Rudra — Intense & Romantic (Male)' },
]

const ANON_GEN_LIMIT = 2
const ANON_CHAR_LIMIT = 100
const ANON_KEY = 'swor_anon_gens'
const MAX_FILE_SIZE = 500 * 1024 * 1024
const VOICEOVER_CREDIT_COST = 25
const MUSIC_DURATIONS = [
  { label: '15s', seconds: 15, credits: 50 },
  { label: '30s', seconds: 30, credits: 100 },
  { label: '60s', seconds: 60, credits: 200 },
  { label: '2min', seconds: 120, credits: 400 },
]

const MUSIC_PROMPTS = [
  'Upbeat Nepali folk with madal drums',
  'Romantic Nepali pop ballad',
  'Devotional bhajan style',
  'Wedding celebration music',
  'Cinematic background score',
  'Energetic TikTok beat',
]

function isAudioFile(file) {
  return file.type.startsWith('audio/') ||
    ['.mp3','.wav','.m4a','.ogg','.aac','.flac'].some(ext => file.name.toLowerCase().endsWith(ext))
}

function audioBufferToWav(buffer) {
  const sampleRate = buffer.sampleRate
  let samples
  if (buffer.numberOfChannels > 1) {
    const l = buffer.getChannelData(0), r = buffer.getChannelData(1)
    samples = new Float32Array(l.length)
    for (let i = 0; i < l.length; i++) samples[i] = (l[i] + r[i]) / 2
  } else { samples = buffer.getChannelData(0) }
  const pcm = new Int16Array(samples.length)
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
  }
  const wav = new ArrayBuffer(44 + pcm.byteLength)
  const v = new DataView(wav)
  const ws = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)) }
  ws(0,'RIFF'); v.setUint32(4, 36 + pcm.byteLength, true); ws(8,'WAVE')
  ws(12,'fmt '); v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true)
  v.setUint32(24,sampleRate,true); v.setUint32(28,sampleRate*2,true)
  v.setUint16(32,2,true); v.setUint16(34,16,true)
  ws(36,'data'); v.setUint32(40,pcm.byteLength,true)
  new Int16Array(wav,44).set(pcm)
  return new Blob([wav], { type: 'audio/wav' })
}

export default function Tool() {
  const [activeTab, setActiveTab] = useState('subtitle')
  const [session, setSession] = useState(null)
  const [anonGens, setAnonGens] = useState(0)
  const [showSignup, setShowSignup] = useState(false)
  const [signupEmail, setSignupEmail] = useState('')
  const [signupStatus, setSignupStatus] = useState('idle')

  // Subtitle
  const [subFile, setSubFile] = useState(null)
  const [subStyle, setSubStyle] = useState('devanagari')
  const [subStep, setSubStep] = useState(null)
  const [subResult, setSubResult] = useState(null)
  const [subError, setSubError] = useState(null)
  const [subDragOver, setSubDragOver] = useState(false)
  const subInputRef = useRef(null)

  // Voiceover
  const [voiceText, setVoiceText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('1zUSi8LeHs9M2mV8X6YS')
  const [voiceLoading, setVoiceLoading] = useState(false)
  const [voiceResult, setVoiceResult] = useState(null)
  const [voiceError, setVoiceError] = useState(null)

  // Music
  const [musicPrompt, setMusicPrompt] = useState('')
  const [musicDuration, setMusicDuration] = useState(30)
  const [musicLoading, setMusicLoading] = useState(false)
  const [musicResult, setMusicResult] = useState(null)
  const [musicError, setMusicError] = useState(null)

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(ANON_KEY) || '0', 10)
    setAnonGens(stored)
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(data => setSession(data.loggedIn ? data : false))
      .catch(() => setSession(false))
  }, [])

  const charLimit = session ? session.charsPerGeneration : ANON_CHAR_LIMIT
  const charCount = voiceText.length
  const isVoiceLocked = session === false && anonGens > ANON_GEN_LIMIT
  const isVoiceCreditLocked = session && !session.betaRemaining && (session.credits || 0) < VOICEOVER_CREDIT_COST

  const selectedDuration = MUSIC_DURATIONS.find(d => d.seconds === musicDuration) || MUSIC_DURATIONS[1]
  const canUseFreeMusic = session && !session.musicFreeUsed && musicDuration <= 15
  const hasMusicCredits = session && ((session.credits || 0) >= selectedDuration.credits || session.founderMusicRemaining > 0 || canUseFreeMusic)

  async function sendMagicLink(e) {
    e.preventDefault()
    setSignupStatus('loading')
    try {
      const res = await fetch('/api/auth/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail }),
      })
      const data = await res.json()
      setSignupStatus(data.success ? 'sent' : 'error')
    } catch { setSignupStatus('error') }
  }

  function handleFileSelect(file) {
    if (!file) return
    if (file.size > MAX_FILE_SIZE) { setSubError('File too large. Maximum 500MB.'); return }
    setSubFile(file); setSubResult(null); setSubError(null); setSubStep(null)
  }

  function handleFileDrop(e) {
    e.preventDefault(); setSubDragOver(false)
    handleFileSelect(e.dataTransfer.files[0])
  }

  async function handleTranscribe() {
    if (!subFile) return
    setSubResult(null); setSubError(null)
    let fileToUpload = subFile
    if (!isAudioFile(subFile)) {
      setSubStep('extracting')
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        const ctx = new AudioCtx({ sampleRate: 16000 })
        const buf = await subFile.arrayBuffer()
        const decoded = await ctx.decodeAudioData(buf)
        const wav = audioBufferToWav(decoded)
        fileToUpload = new File([wav], 'audio.wav', { type: 'audio/wav' })
      } catch {
        setSubError('Could not extract audio. Try uploading an MP3 file directly.')
        setSubStep(null); return
      }
    }
    setSubStep('transcribing')
    const formData = new FormData()
    formData.append('audio', fileToUpload)
    formData.append('style', subStyle)
    try {
      const res = await fetch('/api/transcribe', { method: 'POST', body: formData })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const text = await blob.text()
      const lineCount = text.split('\n\n').filter(Boolean).length
      setSubResult({ url, filename: `nepali_subtitles_${Date.now()}.srt`, lines: lineCount })
      setSubStep('done')
    } catch (e) { setSubError(e.message); setSubStep(null) }
  }

  async function handleVoiceover() {
    if (!voiceText.trim() || voiceText.length > charLimit) return
    if (isVoiceLocked) { setShowSignup(true); return }
    setVoiceLoading(true); setVoiceResult(null); setVoiceError(null)
    try {
      if (session) {
        const cr = await fetch('/api/auth/use-credit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'voiceover', charCount: voiceText.length }),
        })
        const cd = await cr.json()
        if (!cr.ok) throw new Error(cd.error)
        setSession(prev => ({ ...prev, credits: cd.credits, betaRemaining: cd.betaRemaining ?? prev.betaRemaining }))
      } else {
        const n = anonGens + 1
        localStorage.setItem(ANON_KEY, String(n)); setAnonGens(n)
      }
      const res = await fetch('/api/voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: voiceText, voiceId: selectedVoice }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      const blob = await res.blob()
      setVoiceResult({ url: URL.createObjectURL(blob), filename: `nepali_voice_${Date.now()}.mp3` })
    } catch (e) { setVoiceError(e.message) }
    setVoiceLoading(false)
  }

  async function handleMusic() {
    if (!musicPrompt.trim()) { setMusicError('Please describe the music you want.'); return }
    if (!session) { setShowSignup(true); return }
    setMusicLoading(true); setMusicResult(null); setMusicError(null)
    try {
      const isFree = canUseFreeMusic
      const cr = await fetch('/api/auth/use-credit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'music', durationSeconds: musicDuration, isFreeMusciTrial: isFree }),
      })
      const cd = await cr.json()
      if (!cr.ok) throw new Error(cd.error)
      setSession(prev => ({
        ...prev,
        credits: cd.credits,
        musicFreeUsed: isFree ? true : prev.musicFreeUsed,
        founderMusicRemaining: cd.founderMusicRemaining ?? prev.founderMusicRemaining,
      }))
      const res = await fetch('/api/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt, durationSeconds: musicDuration }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      const blob = await res.blob()
      setMusicResult({ url: URL.createObjectURL(blob), filename: `swor_music_${Date.now()}.mp3` })
    } catch (e) { setMusicError(e.message) }
    setMusicLoading(false)
  }

  function downloadFile(url, filename) {
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
  }

  const subLoading = subStep === 'extracting' || subStep === 'transcribing'

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>Swor AI — Nepali Subtitle, Voiceover & Music Tool</title>
        <meta name="description" content="Generate Nepali subtitles, AI voiceovers, and original Nepali music" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Plus Jakarta Sans',sans-serif;background:#F5F3EF;color:#1A1A1A;min-height:100vh}
        .devanagari{font-family:'Noto Sans Devanagari','Plus Jakarta Sans',sans-serif}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease;backdrop-filter:blur(4px)}
        .modal{background:#fff;border-radius:20px;padding:32px;max-width:440px;width:90%;box-shadow:0 24px 60px rgba(0,0,0,.15)}
        .dur-btn{padding:8px 16px;border-radius:8px;border:1.5px solid #E0DDD7;background:#FAFAF8;cursor:pointer;font-size:12px;font-weight:600;transition:all .15s;font-family:inherit}
        .dur-btn.active{background:#0E0E16;color:#fff;border-color:#0E0E16}
        .prompt-chip{padding:6px 12px;border-radius:20px;border:1px solid #E0DDD7;background:#fff;cursor:pointer;font-size:11px;font-weight:500;transition:all .15s;white-space:nowrap}
        .prompt-chip:hover{border-color:#DC143C;color:#DC143C}
      `}</style>

      {/* TOPBAR */}
      <div style={{background:'#0E0E16',padding:'0 24px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,.06)'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}>
          <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:12,fontWeight:800}}>M</div>
          <span style={{color:'#fff',fontSize:15,fontWeight:700}}>MeroAD.ai</span>
        </Link>
        <Link href="/" style={{fontSize:12,color:'rgba(255,255,255,.45)',textDecoration:'none'}}>← Home</Link>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          {session && (
            <div style={{fontSize:12,color:'rgba(255,255,255,.6)',background:'rgba(255,255,255,.06)',padding:'5px 12px',borderRadius:20}}>
              {session.credits || 0} credits
            </div>
          )}
          {session === false && (
            <div style={{fontSize:12,color:'rgba(255,255,255,.5)',background:'rgba(255,255,255,.06)',padding:'5px 12px',borderRadius:20}}>
              {Math.max(0,ANON_GEN_LIMIT-anonGens)} free tries
            </div>
          )}
          <Link href="/#access">
            <button style={{fontSize:12,fontWeight:600,padding:'6px 14px',borderRadius:20,background:'#DC143C',color:'#fff',border:'none',cursor:'pointer'}}>
              Apply for Beta →
            </button>
          </Link>
        </div>
      </div>

      {/* MAIN */}
      <div style={{maxWidth:680,margin:'40px auto',padding:'0 20px 80px'}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <h1 style={{fontSize:26,fontWeight:700,letterSpacing:-0.5,marginBottom:8}}>Nepali AI Tools</h1>
          <p style={{fontSize:13,color:'#666'}}>Subtitles · Voiceover · Music — all in one place.</p>
        </div>

        {/* TABS */}
        <div style={{display:'flex',gap:4,marginBottom:24,background:'#ECEAE5',borderRadius:12,padding:4}}>
          {[
            {id:'subtitle',label:'🎬 Subtitles',sub:'Video → .SRT'},
            {id:'voiceover',label:'🎙️ Voiceover',sub:'Text → .MP3'},
            {id:'music',label:'🎵 Create Music',sub:'Prompt → Song'},
          ].map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              style={{flex:1,padding:'10px 8px',borderRadius:9,border:'none',cursor:'pointer',
                background:activeTab===t.id?'#fff':'transparent',
                boxShadow:activeTab===t.id?'0 1px 4px rgba(0,0,0,.08)':'none',transition:'all .15s'}}>
              <div style={{fontSize:12,fontWeight:600,color:activeTab===t.id?'#0E0E16':'#888'}}>{t.label}</div>
              <div style={{fontSize:10,color:activeTab===t.id?'#666':'#aaa',marginTop:1}}>{t.sub}</div>
            </button>
          ))}
        </div>

        {/* ── SUBTITLE TAB ── */}
        {activeTab==='subtitle'&&(
          <div style={{background:'#fff',borderRadius:16,border:'0.5px solid #E0DDD7',padding:28}}>
            <div
              onDragOver={e=>{e.preventDefault();setSubDragOver(true)}}
              onDragLeave={()=>setSubDragOver(false)}
              onDrop={handleFileDrop}
              onClick={()=>!subLoading&&subInputRef.current?.click()}
              style={{border:`2px dashed ${subDragOver?'#DC143C':subFile?'#1A9E6A':'#D0CCC5'}`,borderRadius:12,padding:'32px 20px',textAlign:'center',cursor:subLoading?'not-allowed':'pointer',marginBottom:20,background:subDragOver?'#FFF8F8':subFile?'#F0FAF5':'#FAFAF8'}}
            >
              <input ref={subInputRef} type="file" accept="video/*,audio/*,.mp4,.mov,.mp3,.wav,.m4a,.aac" style={{display:'none'}} onChange={e=>handleFileSelect(e.target.files[0])} />
              <div style={{fontSize:28,marginBottom:8}}>{subFile?'✅':'🎬'}</div>
              {subFile?(
                <>
                  <div style={{fontSize:14,fontWeight:600,color:'#1A9E6A'}}>{subFile.name}</div>
                  <div style={{fontSize:12,color:'#888',marginTop:4}}>{(subFile.size/1048576).toFixed(1)} MB{!subLoading&&' — Click to change'}</div>
                </>
              ):(
                <>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>Drop your video or audio file here</div>
                  <div style={{fontSize:12,color:'#888'}}>MP4, MOV, MP3, WAV, M4A — up to 500MB</div>
                </>
              )}
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:600,color:'#888',letterSpacing:'0.08em',marginBottom:8,textTransform:'uppercase'}}>Subtitle Script</div>
              <div style={{display:'flex',gap:8}}>
                {[{id:'devanagari',label:'देवनागरी',sub:'Nepali script'},{id:'romanized',label:'Romanized',sub:'English letters'}].map(s=>(
                  <button key={s.id} onClick={()=>!subLoading&&setSubStyle(s.id)}
                    style={{flex:1,padding:'10px 14px',borderRadius:10,border:`1.5px solid ${subStyle===s.id?'#DC143C':'#E0DDD7'}`,background:subStyle===s.id?'#FFF5F5':'#FAFAF8',cursor:subLoading?'not-allowed':'pointer'}}>
                    <div className={s.id==='devanagari'?'devanagari':''} style={{fontSize:14,fontWeight:600,color:subStyle===s.id?'#DC143C':'#555'}}>{s.label}</div>
                    <div style={{fontSize:11,color:'#888',marginTop:2}}>{s.sub}</div>
                  </button>
                ))}
              </div>
            </div>
            {subStep==='extracting'&&(
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',background:'#FFF8F0',border:'1px solid rgba(255,149,0,.2)',borderRadius:10,marginBottom:14,fontSize:13,fontWeight:600,color:'#B45309'}}>
                <div style={{width:14,height:14,border:'2px solid #F97316',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite',flexShrink:0}}/>
                🎵 Extracting audio from video...
              </div>
            )}
            {subStep==='transcribing'&&(
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',background:'#F0F9FF',border:'1px solid rgba(0,119,204,.2)',borderRadius:10,marginBottom:14,fontSize:13,fontWeight:600,color:'#0077CC'}}>
                <div style={{width:14,height:14,border:'2px solid #0077CC',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite',flexShrink:0}}/>
                📡 Generating Nepali subtitles...
              </div>
            )}
            <button onClick={handleTranscribe} disabled={!subFile||subLoading}
              style={{width:'100%',padding:'13px',borderRadius:10,border:'none',cursor:subFile&&!subLoading?'pointer':'not-allowed',background:subFile&&!subLoading?'#0E0E16':'#CCC',color:'#fff',fontSize:14,fontWeight:600,marginBottom:14}}>
              {subStep==='extracting'?'🎵 Extracting audio...':subStep==='transcribing'?'📡 Generating subtitles...':'✨ Generate Nepali Subtitles'}
            </button>
            {subError&&<div style={{background:'#FFF0F0',border:'1px solid #FFB8B8',borderRadius:10,padding:'12px 16px',fontSize:13,color:'#CC3333',marginBottom:14}}>❌ {subError}</div>}
            {subResult&&(
              <div>
                <div style={{background:'#F0FAF5',border:'1.5px solid #1A9E6A',borderRadius:10,padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:'#1A9E6A'}}>✓ Subtitles ready! {subResult.lines&&`(${subResult.lines} segments)`}</div>
                  </div>
                  <button onClick={()=>downloadFile(subResult.url,subResult.filename)}
                    style={{padding:'8px 16px',borderRadius:8,background:'#1A9E6A',color:'#fff',border:'none',fontSize:12,fontWeight:600,cursor:'pointer'}}>⬇ Download .SRT</button>
                </div>
                <div style={{background:'#F8F8FF',border:'1px solid #E0E0F0',borderRadius:10,padding:'14px'}}>
                  <div style={{fontSize:12,fontWeight:700,color:'#1d1d1f',marginBottom:8}}>📲 How to import in CapCut:</div>
                  <div style={{fontSize:12,color:'#555',lineHeight:1.7,marginBottom:8}}>
                    <strong style={{color:'#0E0E16'}}>CapCut Desktop/Web:</strong> Open project → Click <strong>Text</strong> → Click <strong>Local Captions</strong> → Click <strong>Import</strong> → Select your .SRT file
                  </div>
                  <div style={{background:'#FFF3CD',border:'1px solid #FFD700',borderRadius:8,padding:'8px 12px'}}>
                    <div style={{fontSize:11,color:'#856404',fontWeight:600}}>⚠️ CapCut mobile does not support direct SRT import. Use CapCut on your computer or browser instead.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── VOICEOVER TAB ── */}
        {activeTab==='voiceover'&&(
          <div style={{background:'#fff',borderRadius:16,border:'0.5px solid #E0DDD7',padding:28}}>
            {isVoiceLocked?(
              <div style={{textAlign:'center',padding:'40px 20px'}}>
                <div style={{fontSize:44,marginBottom:16}}>🔒</div>
                <div style={{fontSize:18,fontWeight:700,marginBottom:10}}>2 free tries used</div>
                <p style={{fontSize:14,color:'#666',lineHeight:1.7,marginBottom:28,maxWidth:340,margin:'0 auto 28px'}}>Sign up free to get beta access with 10 voiceover generations.</p>
                <button onClick={()=>setShowSignup(true)} style={{background:'#DC143C',color:'#fff',border:'none',padding:'14px 32px',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer'}}>Sign up free →</button>
              </div>
            ):isVoiceCreditLocked?(
              <div style={{textAlign:'center',padding:'40px 20px'}}>
                <div style={{fontSize:44,marginBottom:16}}>⭐</div>
                <div style={{fontSize:18,fontWeight:700,marginBottom:10}}>Not enough credits</div>
                <p style={{fontSize:14,color:'#666',lineHeight:1.7,marginBottom:28,maxWidth:340,margin:'0 auto 28px'}}>Purchase a credit pack to continue generating voiceovers.</p>
                <a href="/#pricing"><button style={{background:'#DC143C',color:'#fff',border:'none',padding:'14px 32px',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer'}}>Buy credits →</button></a>
              </div>
            ):(
              <>
                <div style={{background:'linear-gradient(90deg,#FFF0F3,#FFF5F0)',border:'1px solid rgba(220,20,60,.15)',borderRadius:10,padding:'10px 14px',marginBottom:18,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{fontSize:12,color:'#555'}}>
                    {session
                      ? session.betaRemaining > 0
                        ? `✨ Beta — ${session.betaRemaining} gens remaining`
                        : `💳 ${session.credits || 0} credits remaining (${VOICEOVER_CREDIT_COST} per voiceover)`
                      : `🎁 ${Math.max(0,ANON_GEN_LIMIT-anonGens)} of ${ANON_GEN_LIMIT} free tries`}
                  </div>
                  {!session&&<button onClick={()=>setShowSignup(true)} style={{fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:8,background:'#DC143C',color:'#fff',border:'none',cursor:'pointer'}}>Get more →</button>}
                </div>
                <div style={{marginBottom:18}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                    <div style={{fontSize:11,fontWeight:600,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase'}}>Nepali Text</div>
                    <div style={{fontSize:11,color:charCount>charLimit?'#E8533A':'#aaa'}}>{charCount} / {charLimit}</div>
                  </div>
                  <textarea value={voiceText} onChange={e=>setVoiceText(e.target.value.slice(0,charLimit))}
                    placeholder="नमस्ते! आज हामी एउटा नयाँ उत्पादनको बारेमा..."
                    className="devanagari"
                    style={{width:'100%',minHeight:120,padding:'12px 14px',border:`1.5px solid ${charCount>charLimit?'#E8533A':'#E0DDD7'}`,borderRadius:10,fontSize:14,lineHeight:1.7,resize:'vertical',fontFamily:'Noto Sans Devanagari,Plus Jakarta Sans,sans-serif',background:'#FAFAF8',outline:'none'}}
                  />
                </div>
                <div style={{marginBottom:18}}>
                  <div style={{fontSize:11,fontWeight:600,color:'#888',letterSpacing:'0.08em',marginBottom:8,textTransform:'uppercase'}}>Select Voice</div>
                  <select value={selectedVoice} onChange={e=>setSelectedVoice(e.target.value)}
                    style={{width:'100%',padding:'10px 14px',borderRadius:10,border:'1.5px solid #E0DDD7',background:'#FAFAF8',fontSize:13,outline:'none',cursor:'pointer'}}>
                    {VOICES.map(v=><option key={v.voice_id} value={v.voice_id}>{v.name}</option>)}
                  </select>
                </div>
                <button onClick={handleVoiceover} disabled={!voiceText.trim()||voiceLoading||charCount>charLimit}
                  style={{width:'100%',padding:'13px',borderRadius:10,border:'none',cursor:voiceText.trim()&&!voiceLoading?'pointer':'not-allowed',background:voiceText.trim()&&!voiceLoading?'#0E0E16':'#CCC',color:'#fff',fontSize:14,fontWeight:600,marginBottom:14}}>
                  {voiceLoading?'⏳ Generating...':'🎙️ Generate Nepali Voiceover'}
                </button>
                {voiceError&&<div style={{background:'#FFF0F0',border:'1px solid #FFB8B8',borderRadius:10,padding:'12px 16px',fontSize:13,color:'#CC3333',marginBottom:14}}>❌ {voiceError}</div>}
                {voiceResult&&(
                  <div>
                    <div style={{background:'#F0FAF5',border:'1.5px solid #1A9E6A',borderRadius:10,padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                      <div style={{fontSize:13,fontWeight:600,color:'#1A9E6A'}}>✓ Voiceover ready!</div>
                      <button onClick={()=>downloadFile(voiceResult.url,voiceResult.filename)}
                        style={{padding:'8px 16px',borderRadius:8,background:'#1A9E6A',color:'#fff',border:'none',fontSize:12,fontWeight:600,cursor:'pointer'}}>⬇ Download</button>
                    </div>
                    <audio controls src={voiceResult.url} style={{width:'100%',borderRadius:8}} />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── CREATE MUSIC TAB ── */}
        {activeTab==='music'&&(
          <div style={{background:'#fff',borderRadius:16,border:'0.5px solid #E0DDD7',padding:28}}>
            {!session?(
              <div style={{textAlign:'center',padding:'40px 20px'}}>
                <div style={{fontSize:44,marginBottom:16}}>🎵</div>
                <div style={{fontSize:18,fontWeight:700,marginBottom:10}}>Sign up to create music</div>
                <p style={{fontSize:14,color:'#666',lineHeight:1.7,marginBottom:12,maxWidth:340,margin:'0 auto 12px'}}>
                  Registered users get <strong>1 free 15-second Nepali music generation</strong> to try before buying.
                </p>
                <button onClick={()=>setShowSignup(true)} style={{background:'#DC143C',color:'#fff',border:'none',padding:'14px 32px',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',boxShadow:'0 4px 18px rgba(220,20,60,.25)'}}>
                  Sign up free →
                </button>
              </div>
            ):(
              <>
                {/* Credit/free trial status */}
                <div style={{background:'linear-gradient(90deg,#F0F0FF,#F5F0FF)',border:'1px solid rgba(107,63,190,.15)',borderRadius:10,padding:'10px 14px',marginBottom:18}}>
                  {session.isFounder&&session.founderMusicRemaining>0?(
                    <div style={{fontSize:12,color:'#6B3FBE',fontWeight:600}}>
                      🏆 Founders bonus — {session.founderMusicRemaining} free tracks this month
                    </div>
                  ):canUseFreeMusic?(
                    <div style={{fontSize:12,color:'#6B3FBE',fontWeight:600}}>
                      🎁 1 free 15-second track available — try before you buy!
                    </div>
                  ):(
                    <div style={{fontSize:12,color:'#555'}}>
                      💳 {session.credits||0} credits · This track costs {selectedDuration.credits} credits
                    </div>
                  )}
                </div>

                {/* Prompt */}
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:11,fontWeight:600,color:'#888',letterSpacing:'0.08em',marginBottom:8,textTransform:'uppercase'}}>Describe Your Music</div>
                  <textarea value={musicPrompt} onChange={e=>setMusicPrompt(e.target.value)}
                    placeholder="E.g. Upbeat Nepali folk song with madal drums and flute..."
                    style={{width:'100%',minHeight:90,padding:'12px 14px',border:'1.5px solid #E0DDD7',borderRadius:10,fontSize:14,lineHeight:1.6,resize:'vertical',background:'#FAFAF8',outline:'none',fontFamily:'Plus Jakarta Sans,sans-serif'}}
                  />
                  {/* Quick prompts */}
                  <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:8}}>
                    {MUSIC_PROMPTS.map(p=>(
                      <button key={p} className="prompt-chip" onClick={()=>setMusicPrompt(p)}>{p}</button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:11,fontWeight:600,color:'#888',letterSpacing:'0.08em',marginBottom:8,textTransform:'uppercase'}}>Duration</div>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    {MUSIC_DURATIONS.map(d=>(
                      <button key={d.seconds} className={`dur-btn${musicDuration===d.seconds?' active':''}`}
                        onClick={()=>setMusicDuration(d.seconds)}>
                        {d.label}
                        <span style={{display:'block',fontSize:10,opacity:.7,marginTop:1}}>
                          {d.seconds===15&&!session?.musicFreeUsed?'FREE':d.credits+' cr'}
                        </span>
                      </button>
                    ))}
                  </div>
                  {canUseFreeMusic&&musicDuration>15&&(
                    <div style={{fontSize:11,color:'#F97316',marginTop:6,fontWeight:500}}>⚠️ Select 15s to use your free trial</div>
                  )}
                </div>

                {/* Not enough credits */}
                {session&&!canUseFreeMusic&&!session.founderMusicRemaining&&(session.credits||0)<selectedDuration.credits&&(
                  <div style={{background:'#FFF8F0',border:'1px solid rgba(255,149,0,.3)',borderRadius:10,padding:'12px 14px',marginBottom:14,fontSize:13,color:'#B45309',fontWeight:500}}>
                    Not enough credits for {selectedDuration.label} track ({selectedDuration.credits} needed).{' '}
                    <a href="/#pricing" style={{color:'#DC143C',fontWeight:700}}>Buy credits →</a>
                  </div>
                )}

                <button onClick={handleMusic}
                  disabled={!musicPrompt.trim()||musicLoading||(!canUseFreeMusic&&!session?.founderMusicRemaining&&(session?.credits||0)<selectedDuration.credits)}
                  style={{width:'100%',padding:'13px',borderRadius:10,border:'none',
                    cursor:musicPrompt.trim()&&!musicLoading&&hasMusicCredits?'pointer':'not-allowed',
                    background:musicPrompt.trim()&&!musicLoading&&hasMusicCredits?'linear-gradient(135deg,#7B2FBE,#DC143C)':'#CCC',
                    color:'#fff',fontSize:14,fontWeight:600,marginBottom:14}}>
                  {musicLoading?'🎵 Generating your Nepali music...':'🎵 Create Music'}
                </button>

                {musicError&&<div style={{background:'#FFF0F0',border:'1px solid #FFB8B8',borderRadius:10,padding:'12px 16px',fontSize:13,color:'#CC3333',marginBottom:14}}>❌ {musicError}</div>}

                {musicResult&&(
                  <div>
                    <div style={{background:'linear-gradient(90deg,#F5F0FF,#FFF0F5)',border:'1.5px solid #7B2FBE',borderRadius:10,padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:'#7B2FBE'}}>🎵 Music ready!</div>
                        <div style={{fontSize:11,color:'#888',marginTop:2}}>Royalty-free · Commercial use allowed</div>
                      </div>
                      <button onClick={()=>downloadFile(musicResult.url,musicResult.filename)}
                        style={{padding:'8px 16px',borderRadius:8,background:'#7B2FBE',color:'#fff',border:'none',fontSize:12,fontWeight:600,cursor:'pointer'}}>⬇ Download</button>
                    </div>
                    <audio controls src={musicResult.url} style={{width:'100%',borderRadius:8}} />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* SIGNUP MODAL */}
      {showSignup&&(
        <div className="overlay" onClick={e=>{if(e.target===e.currentTarget)setShowSignup(false)}}>
          <div className="modal">
            <div style={{textAlign:'center',marginBottom:24}}>
              <div style={{fontSize:28,fontWeight:800,background:'linear-gradient(135deg,#DC143C,#FF9500)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',letterSpacing:'2px',marginBottom:4}}>SWOR AI</div>
              <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>Sign up for free beta access</div>
              <p style={{fontSize:13,color:'#888',lineHeight:1.6}}>Magic link sent instantly. No password needed.</p>
            </div>
            {signupStatus==='sent'?(
              <div style={{textAlign:'center',padding:'20px 0'}}>
                <div style={{fontSize:40,marginBottom:12}}>📧</div>
                <div style={{fontSize:16,fontWeight:700,marginBottom:8}}>Check your inbox!</div>
                <p style={{fontSize:13,color:'#888'}}>Magic link sent to <strong>{signupEmail}</strong></p>
              </div>
            ):(
              <form onSubmit={sendMagicLink}>
                <input type="email" placeholder="your@email.com" required value={signupEmail}
                  onChange={e=>setSignupEmail(e.target.value)}
                  style={{width:'100%',padding:'13px 16px',borderRadius:10,border:'1.5px solid #E0DDD7',fontSize:14,outline:'none',marginBottom:10,fontFamily:'inherit'}}/>
                <button type="submit" disabled={signupStatus==='loading'}
                  style={{width:'100%',padding:'13px',borderRadius:10,border:'none',background:'#DC143C',color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',opacity:signupStatus==='loading'?.7:1}}>
                  {signupStatus==='loading'?'Sending...':'Send magic link →'}
                </button>
                {signupStatus==='error'&&<p style={{fontSize:12,color:'#CC3333',marginTop:8,textAlign:'center'}}>Something went wrong. Try again.</p>}
                <p style={{fontSize:11,color:'#bbb',textAlign:'center',marginTop:10}}>No password. No spam.</p>
              </form>
            )}
            <button onClick={()=>setShowSignup(false)}
              style={{width:'100%',marginTop:10,padding:'10px',borderRadius:10,border:'1px solid #E0DDD7',background:'transparent',fontSize:13,color:'#888',cursor:'pointer'}}>
              Maybe later
            </button>
          </div>
        </div>
      )}
    </>
  )
}
