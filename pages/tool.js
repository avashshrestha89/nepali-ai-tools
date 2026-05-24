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
const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB

function isAudioFile(file) {
  return file.type.startsWith('audio/') ||
    ['.mp3', '.wav', '.m4a', '.ogg', '.aac', '.flac'].some(ext =>
      file.name.toLowerCase().endsWith(ext))
}

function audioBufferToWav(buffer) {
  const numChannels = 1
  const sampleRate = buffer.sampleRate
  const bitDepth = 16
  let samples
  if (buffer.numberOfChannels > 1) {
    const left = buffer.getChannelData(0)
    const right = buffer.getChannelData(1)
    samples = new Float32Array(left.length)
    for (let i = 0; i < left.length; i++) samples[i] = (left[i] + right[i]) / 2
  } else {
    samples = buffer.getChannelData(0)
  }
  const pcm = new Int16Array(samples.length)
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
  }
  const wavBuffer = new ArrayBuffer(44 + pcm.byteLength)
  const view = new DataView(wavBuffer)
  const ws = (offset, str) => { for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)) }
  ws(0, 'RIFF'); view.setUint32(4, 36 + pcm.byteLength, true); ws(8, 'WAVE')
  ws(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true)
  view.setUint16(22, numChannels, true); view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * numChannels * bitDepth / 8, true)
  view.setUint16(32, numChannels * bitDepth / 8, true); view.setUint16(34, bitDepth, true)
  ws(36, 'data'); view.setUint32(40, pcm.byteLength, true)
  new Int16Array(wavBuffer, 44).set(pcm)
  return new Blob([wavBuffer], { type: 'audio/wav' })
}

async function extractAudioFromVideo(file) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  const audioContext = new AudioCtx({ sampleRate: 16000 })
  const arrayBuffer = await file.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  return audioBufferToWav(audioBuffer)
}

export default function Tool() {
  const [activeTab, setActiveTab] = useState('subtitle')
  const [session, setSession] = useState(null)
  const [anonGens, setAnonGens] = useState(0)
  const [showSignup, setShowSignup] = useState(false)
  const [signupEmail, setSignupEmail] = useState('')
  const [signupStatus, setSignupStatus] = useState('idle')

  // Subtitle state
  const [subFile, setSubFile] = useState(null)
  const [subStyle, setSubStyle] = useState('devanagari')
  const [subStep, setSubStep] = useState(null) // null | 'extracting' | 'transcribing' | 'done'
  const [subResult, setSubResult] = useState(null)
  const [subError, setSubError] = useState(null)
  const [subDragOver, setSubDragOver] = useState(false)
  const subInputRef = useRef(null)

  // Voiceover state
  const [voiceText, setVoiceText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('1zUSi8LeHs9M2mV8X6YS')
  const [voiceLoading, setVoiceLoading] = useState(false)
  const [voiceResult, setVoiceResult] = useState(null)
  const [voiceError, setVoiceError] = useState(null)

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
  const isLocked = session === false && anonGens > ANON_GEN_LIMIT
  const isRegisteredLocked = session && session.generationsRemaining <= 0

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
    if (file.size > MAX_FILE_SIZE) {
      setSubError('File too large. Maximum 500MB supported.')
      return
    }
    setSubFile(file)
    setSubResult(null)
    setSubError(null)
    setSubStep(null)
  }

  function handleFileDrop(e) {
    e.preventDefault()
    setSubDragOver(false)
    handleFileSelect(e.dataTransfer.files[0])
  }

  async function handleTranscribe() {
    if (!subFile) return
    setSubResult(null)
    setSubError(null)

    let fileToUpload = subFile

    // Step 1 — Extract audio if video file
    if (!isAudioFile(subFile)) {
      setSubStep('extracting')
      try {
        const wavBlob = await extractAudioFromVideo(subFile)
        fileToUpload = new File([wavBlob], 'audio.wav', { type: 'audio/wav' })
      } catch (e) {
        setSubError('Could not extract audio from this video format. Please try uploading an MP3 file directly.')
        setSubStep(null)
        return
      }
    }

    // Step 2 — Transcribe
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
    } catch (e) {
      setSubError(e.message)
      setSubStep(null)
    }
  }

  async function handleVoiceover() {
    if (!voiceText.trim() || !selectedVoice) return
    if (voiceText.length > charLimit) return
    if (isLocked) { setShowSignup(true); return }
    if (isRegisteredLocked) { setVoiceError('Generation limit reached. Subscribe to continue.'); return }

    setVoiceLoading(true)
    setVoiceResult(null)
    setVoiceError(null)

    try {
      if (session) {
        const creditRes = await fetch('/api/auth/use-credit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ charCount: voiceText.length }),
        })
        const creditData = await creditRes.json()
        if (!creditRes.ok) throw new Error(creditData.error)
        setSession(prev => ({ ...prev, generationsRemaining: creditData.generationsRemaining }))
      } else {
        const newCount = anonGens + 1
        localStorage.setItem(ANON_KEY, String(newCount))
        setAnonGens(newCount)
      }
      const res = await fetch('/api/voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: voiceText, voiceId: selectedVoice }),
      })
      if (!res.ok) { const err = await res.json(); throw new Error(err.error) }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setVoiceResult({ url, filename: `nepali_voiceover_${Date.now()}.mp3` })
    } catch (e) { setVoiceError(e.message) }
    setVoiceLoading(false)
  }

  function downloadFile(url, filename) {
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
  }

  const subLoading = subStep === 'extracting' || subStep === 'transcribing'

  return (
    <>
      <Head>
        <title>Swor AI — Nepali Subtitle & Voiceover Tool</title>
        <meta name="description" content="Generate Nepali subtitles and AI voiceovers" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Plus Jakarta Sans',sans-serif;background:#F5F3EF;color:#1A1A1A;min-height:100vh}
        .devanagari{font-family:'Noto Sans Devanagari','Plus Jakarta Sans',sans-serif}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease;backdrop-filter:blur(4px)}
        .modal{background:#fff;border-radius:20px;padding:32px;max-width:440px;width:90%;box-shadow:0 24px 60px rgba(0,0,0,.15)}
        .step-indicator{display:flex;align-items:center;gap:10;padding:14px 16px;border-radius:10px;margin-bottom:14px;font-size:13px;font-weight:600}
      `}</style>

      {/* TOPBAR */}
      <div style={{background:'#0E0E16',padding:'0 24px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,.06)'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}>
          <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:12,fontWeight:800}}>M</div>
          <span style={{color:'#fff',fontSize:15,fontWeight:700,letterSpacing:'-0.3px'}}>MeroAD.ai</span>
        </Link>
        <Link href="/" style={{fontSize:12,color:'rgba(255,255,255,.45)',fontWeight:500,textDecoration:'none'}}>← Home</Link>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          {session && (
            <div style={{fontSize:12,color:'rgba(255,255,255,.5)',background:'rgba(255,255,255,.06)',padding:'5px 12px',borderRadius:20}}>
              {session.generationsRemaining} generations left
            </div>
          )}
          {session === false && (
            <div style={{fontSize:12,color:'rgba(255,255,255,.5)',background:'rgba(255,255,255,.06)',padding:'5px 12px',borderRadius:20}}>
              {Math.max(0, ANON_GEN_LIMIT - anonGens)} free tries left
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
          <p style={{fontSize:13,color:'#666',lineHeight:1.6}}>Generate Nepali subtitles and voiceovers using AI.</p>
        </div>

        {/* TABS */}
        <div style={{display:'flex',gap:6,marginBottom:24,background:'#ECEAE5',borderRadius:12,padding:4}}>
          {[{id:'subtitle',label:'🎬 Nepali Subtitles',sub:'Video → .SRT file'},{id:'voiceover',label:'🎙️ Nepali Voiceover',sub:'Text → .MP3 file'}].map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{flex:1,padding:'10px 16px',borderRadius:9,border:'none',cursor:'pointer',background:activeTab===t.id?'#fff':'transparent',boxShadow:activeTab===t.id?'0 1px 4px rgba(0,0,0,.08)':'none',transition:'all .15s'}}>
              <div style={{fontSize:13,fontWeight:600,color:activeTab===t.id?'#0E0E16':'#888'}}>{t.label}</div>
              <div style={{fontSize:11,color:activeTab===t.id?'#666':'#aaa',marginTop:1}}>{t.sub}</div>
            </button>
          ))}
        </div>

        {/* SUBTITLE TAB */}
        {activeTab==='subtitle' && (
          <div style={{background:'#fff',borderRadius:16,border:'0.5px solid #E0DDD7',padding:28}}>

            {/* Upload area */}
            <div
              onDragOver={e=>{e.preventDefault();setSubDragOver(true)}}
              onDragLeave={()=>setSubDragOver(false)}
              onDrop={handleFileDrop}
              onClick={()=>!subLoading&&subInputRef.current?.click()}
              style={{border:`2px dashed ${subDragOver?'#DC143C':subFile?'#1A9E6A':'#D0CCC5'}`,borderRadius:12,padding:'32px 20px',textAlign:'center',cursor:subLoading?'not-allowed':'pointer',marginBottom:20,background:subDragOver?'#FFF8F8':subFile?'#F0FAF5':'#FAFAF8'}}
            >
              <input ref={subInputRef} type="file" accept="video/*,audio/*,.mp4,.mov,.mp3,.wav,.m4a,.aac" style={{display:'none'}} onChange={e=>handleFileSelect(e.target.files[0])} />
              <div style={{fontSize:28,marginBottom:8}}>{subFile?'✅':'🎬'}</div>
              {subFile ? (
                <>
                  <div style={{fontSize:14,fontWeight:600,color:'#1A9E6A'}}>{subFile.name}</div>
                  <div style={{fontSize:12,color:'#888',marginTop:4}}>{(subFile.size/(1024*1024)).toFixed(1)} MB {!subLoading&&'— Click to change'}</div>
                </>
              ) : (
                <>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>Drop your video or audio file here</div>
                  <div style={{fontSize:12,color:'#888'}}>MP4, MOV, MP3, WAV, M4A — up to 500MB</div>
                </>
              )}
            </div>

            {/* Style selector */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:600,color:'#888',letterSpacing:'0.08em',marginBottom:8,textTransform:'uppercase'}}>Subtitle Script</div>
              <div style={{display:'flex',gap:8}}>
                {[{id:'devanagari',label:'देवनागरी',sub:'Nepali script'},{id:'romanized',label:'Romanized',sub:'English letters'}].map(s=>(
                  <button key={s.id} onClick={()=>!subLoading&&setSubStyle(s.id)} style={{flex:1,padding:'10px 14px',borderRadius:10,border:`1.5px solid ${subStyle===s.id?'#DC143C':'#E0DDD7'}`,background:subStyle===s.id?'#FFF5F5':'#FAFAF8',cursor:subLoading?'not-allowed':'pointer'}}>
                    <div className={s.id==='devanagari'?'devanagari':''} style={{fontSize:14,fontWeight:600,color:subStyle===s.id?'#DC143C':'#555'}}>{s.label}</div>
                    <div style={{fontSize:11,color:'#888',marginTop:2}}>{s.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress steps */}
            {subStep === 'extracting' && (
              <div className="step-indicator" style={{background:'#FFF8F0',border:'1px solid rgba(255,149,0,.2)',color:'#B45309'}}>
                <div style={{width:16,height:16,border:'2px solid #F97316',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite',flexShrink:0}} />
                <span>🎵 Extracting audio from video... this may take a moment</span>
              </div>
            )}
            {subStep === 'transcribing' && (
              <div className="step-indicator" style={{background:'#F0F9FF',border:'1px solid rgba(0,119,204,.2)',color:'#0077CC'}}>
                <div style={{width:16,height:16,border:'2px solid #0077CC',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite',flexShrink:0}} />
                <span>📡 Generating Nepali subtitles via AI...</span>
              </div>
            )}

            {/* Generate button */}
            <button onClick={handleTranscribe} disabled={!subFile||subLoading}
              style={{width:'100%',padding:'13px 20px',borderRadius:10,border:'none',cursor:subFile&&!subLoading?'pointer':'not-allowed',background:subFile&&!subLoading?'#0E0E16':'#CCC',color:'#fff',fontSize:14,fontWeight:600,marginBottom:14}}>
              {subStep==='extracting'?'🎵 Extracting audio...':subStep==='transcribing'?'📡 Generating subtitles...':'✨ Generate Nepali Subtitles'}
            </button>

            {subError&&<div style={{background:'#FFF0F0',border:'1px solid #FFB8B8',borderRadius:10,padding:'12px 16px',fontSize:13,color:'#CC3333',marginBottom:14}}>❌ {subError}</div>}

            {/* Result */}
            {subResult&&(
              <div>
                <div style={{background:'#F0FAF5',border:'1.5px solid #1A9E6A',borderRadius:10,padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:'#1A9E6A'}}>✓ Subtitles ready!</div>
                    {subResult.lines&&<div style={{fontSize:12,color:'#555',marginTop:2}}>{subResult.lines} subtitle segments</div>}
                  </div>
                  <button onClick={()=>downloadFile(subResult.url,subResult.filename)}
                    style={{padding:'8px 18px',borderRadius:8,border:'1.5px solid #1A9E6A',background:'#1A9E6A',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer'}}>
                    ⬇ Download .SRT
                  </button>
                </div>

                {/* CapCut instructions */}
                <div style={{background:'#F8F8FF',border:'1px solid #E0E0F0',borderRadius:10,padding:'16px'}}>
                  <div style={{fontSize:12,fontWeight:700,color:'#1d1d1f',marginBottom:10}}>📲 How to import in CapCut:</div>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    <div style={{fontSize:12,color:'#555',lineHeight:1.7}}>
                      <strong style={{color:'#0E0E16'}}>Desktop:</strong> Open project → Click <strong>Text</strong> in left sidebar → Click <strong>Local Captions</strong> → Click <strong>Import</strong> → Select your .SRT file
                    </div>
                    <div style={{background:'#E8E8F8',height:1}} />
                   <div style={{fontSize:12,color:'#555',lineHeight:1.7}}>
  <strong style={{color:'#0E0E16'}}>Mobile (recommended):</strong> On your computer open <strong>capcut.com</strong> → Create project → Text → Local Captions → Import your .SRT → Project auto-saves to CapCut Cloud → Open CapCut app on phone → find project in Cloud tab → edit and export on phone
</div>
<div style={{background:'#E8E8F8',height:1,margin:'6px 0'}} />
<div style={{fontSize:12,color:'#555',lineHeight:1.7}}>
  <strong style={{color:'#0E0E16'}}>Mobile (phone only):</strong> Import video → Tap <strong>Text</strong> → Tap <strong>Auto Captions</strong> → Set language to <strong>Nepali</strong> → Tap Start. Note: may have minor spelling errors.
</div>
                  </div>
                </div>
              </div>
            )}

            {!subResult&&!subLoading&&(
              <div style={{marginTop:16,fontSize:11,color:'#aaa',lineHeight:1.6,borderTop:'1px solid #F0EDE8',paddingTop:14}}>
                <strong style={{color:'#888'}}>Supports:</strong> Any video up to 500MB. Audio files (MP3, WAV, M4A) also accepted.
              </div>
            )}
          </div>
        )}

        {/* VOICEOVER TAB */}
        {activeTab==='voiceover' && (
          <div style={{background:'#fff',borderRadius:16,border:'0.5px solid #E0DDD7',padding:28}}>
            {isLocked ? (
              <div style={{textAlign:'center',padding:'40px 20px'}}>
                <div style={{fontSize:44,marginBottom:16}}>🔒</div>
                <div style={{fontSize:18,fontWeight:700,marginBottom:10}}>You've used your 2 free tries</div>
                <p style={{fontSize:14,color:'#666',lineHeight:1.7,marginBottom:28,maxWidth:340,margin:'0 auto 28px'}}>
                  Sign up free to get <strong>10 voiceover generations</strong> with 500 characters each.
                </p>
                <button onClick={()=>setShowSignup(true)}
                  style={{background:'#DC143C',color:'#fff',border:'none',padding:'14px 32px',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',boxShadow:'0 4px 18px rgba(220,20,60,.25)'}}>
                  Sign up free →
                </button>
              </div>
            ) : isRegisteredLocked ? (
              <div style={{textAlign:'center',padding:'40px 20px'}}>
                <div style={{fontSize:44,marginBottom:16}}>⭐</div>
                <div style={{fontSize:18,fontWeight:700,marginBottom:10}}>Beta generation limit reached</div>
                <p style={{fontSize:14,color:'#666',lineHeight:1.7,marginBottom:28,maxWidth:340,margin:'0 auto 28px'}}>
                  Subscribe to continue using Swor AI.
                </p>
                <a href="mailto:meroadaiofficial@gmail.com">
                  <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'14px 32px',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer'}}>
                    Contact us to subscribe →
                  </button>
                </a>
              </div>
            ) : (
              <>
                <div style={{background:'linear-gradient(90deg,#FFF0F3,#FFF5F0)',border:'1px solid rgba(220,20,60,.15)',borderRadius:10,padding:'10px 14px',marginBottom:18,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{fontSize:12,color:'#555'}}>
                    {session
                      ? `✨ Beta access — ${session.generationsRemaining} of ${session.generationsLimit} generations remaining`
                      : `🎁 Free preview — ${Math.max(0,ANON_GEN_LIMIT-anonGens)} of ${ANON_GEN_LIMIT} tries remaining`}
                  </div>
                  {!session&&(
                    <button onClick={()=>setShowSignup(true)}
                      style={{fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:8,background:'#DC143C',color:'#fff',border:'none',cursor:'pointer'}}>
                      Get more →
                    </button>
                  )}
                </div>

                <div style={{marginBottom:18}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                    <div style={{fontSize:11,fontWeight:600,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase'}}>Nepali Text</div>
                    <div style={{fontSize:11,color:charCount>charLimit?'#E8533A':'#aaa'}}>{charCount} / {charLimit} characters</div>
                  </div>
                  <textarea
                    value={voiceText}
                    onChange={e=>setVoiceText(e.target.value.slice(0,charLimit))}
                    placeholder={'नमस्ते! आज हामी एउटा नयाँ उत्पादनको बारेमा कुरा गर्दैछौं...'}
                    className="devanagari"
                    style={{width:'100%',minHeight:140,padding:'12px 14px',border:`1.5px solid ${charCount>charLimit?'#E8533A':'#E0DDD7'}`,borderRadius:10,fontSize:14,lineHeight:1.7,resize:'vertical',fontFamily:'Noto Sans Devanagari,Plus Jakarta Sans,sans-serif',color:'#1A1A1A',background:'#FAFAF8',outline:'none'}}
                  />
                </div>

                <div style={{marginBottom:18}}>
                  <div style={{fontSize:11,fontWeight:600,color:'#888',letterSpacing:'0.08em',marginBottom:8,textTransform:'uppercase'}}>Select Voice</div>
                  <select value={selectedVoice} onChange={e=>setSelectedVoice(e.target.value)}
                    style={{width:'100%',padding:'10px 14px',borderRadius:10,border:'1.5px solid #E0DDD7',background:'#FAFAF8',fontSize:13,color:'#1A1A1A',outline:'none',cursor:'pointer'}}>
                    {VOICES.map(v=><option key={v.voice_id} value={v.voice_id}>{v.name}</option>)}
                  </select>
                </div>

                <button onClick={handleVoiceover} disabled={!voiceText.trim()||voiceLoading||charCount>charLimit}
                  style={{width:'100%',padding:'13px 20px',borderRadius:10,border:'none',cursor:voiceText.trim()&&!voiceLoading&&charCount<=charLimit?'pointer':'not-allowed',background:voiceText.trim()&&!voiceLoading&&charCount<=charLimit?'#0E0E16':'#CCC',color:'#fff',fontSize:14,fontWeight:600,marginBottom:14}}>
                  {voiceLoading?'⏳ Generating voiceover...':'🎙️ Generate Nepali Voiceover'}
                </button>

                {voiceError&&<div style={{background:'#FFF0F0',border:'1px solid #FFB8B8',borderRadius:10,padding:'12px 16px',fontSize:13,color:'#CC3333',marginBottom:14}}>❌ {voiceError}</div>}
                {voiceResult&&(
                  <div>
                    <div style={{background:'#F0FAF5',border:'1.5px solid #1A9E6A',borderRadius:10,padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:'#1A9E6A'}}>✓ Voiceover ready!</div>
                        <div style={{fontSize:12,color:'#555',marginTop:2}}>Preview below or download</div>
                      </div>
                      <button onClick={()=>downloadFile(voiceResult.url,voiceResult.filename)}
                        style={{padding:'8px 18px',borderRadius:8,border:'1.5px solid #1A9E6A',background:'#1A9E6A',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer'}}>
                        ⬇ Download .MP3
                      </button>
                    </div>
                    <audio controls src={voiceResult.url} style={{width:'100%',borderRadius:8}} />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* SIGNUP MODAL */}
      {showSignup && (
        <div className="overlay" onClick={e=>{if(e.target===e.currentTarget)setShowSignup(false)}}>
          <div className="modal">
            <div style={{textAlign:'center',marginBottom:24}}>
              <div style={{fontSize:32,fontWeight:800,background:'linear-gradient(135deg,#DC143C,#FF9500)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',letterSpacing:'2px',marginBottom:4}}>SWOR AI</div>
              <div style={{fontSize:14,fontWeight:700,color:'#1d1d1f',marginBottom:6}}>Sign up for free beta access</div>
              <p style={{fontSize:13,color:'#888',lineHeight:1.6}}>Enter your email — we'll send you a magic link instantly. No password needed.</p>
            </div>
            {signupStatus==='sent' ? (
              <div style={{textAlign:'center',padding:'20px 0'}}>
                <div style={{fontSize:40,marginBottom:12}}>📧</div>
                <div style={{fontSize:16,fontWeight:700,marginBottom:8}}>Check your inbox!</div>
                <p style={{fontSize:13,color:'#888',lineHeight:1.6}}>We sent a magic link to <strong>{signupEmail}</strong>. Click it to get instant access.</p>
              </div>
            ) : (
              <form onSubmit={sendMagicLink}>
                <div style={{marginBottom:12}}>
                  <input type="email" placeholder="your@email.com" required
                    value={signupEmail} onChange={e=>setSignupEmail(e.target.value)}
                    style={{width:'100%',padding:'13px 16px',borderRadius:10,border:'1.5px solid #E0DDD7',fontSize:14,fontFamily:'Plus Jakarta Sans,sans-serif',outline:'none'}}
                  />
                </div>
                <button type="submit" disabled={signupStatus==='loading'}
                  style={{width:'100%',padding:'13px',borderRadius:10,border:'none',background:'#DC143C',color:'#fff',fontSize:15,fontWeight:700,cursor:signupStatus==='loading'?'not-allowed':'pointer',opacity:signupStatus==='loading'?.7:1,boxShadow:'0 4px 18px rgba(220,20,60,.25)'}}>
                  {signupStatus==='loading'?'Sending...':'Send magic link →'}
                </button>
                {signupStatus==='error'&&<p style={{fontSize:12,color:'#CC3333',marginTop:8,textAlign:'center'}}>Something went wrong. Try again.</p>}
                <p style={{fontSize:11,color:'#bbb',textAlign:'center',marginTop:12}}>No password. No spam. Cancel anytime.</p>
              </form>
            )}
            <button onClick={()=>setShowSignup(false)}
              style={{width:'100%',marginTop:12,padding:'10px',borderRadius:10,border:'1px solid #E0DDD7',background:'transparent',fontSize:13,color:'#888',cursor:'pointer'}}>
              Maybe later
            </button>
          </div>
        </div>
      )}
    </>
  )
}
