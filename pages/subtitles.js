import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

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

export default function Subtitles() {
  const [isMobile, setIsMobile] = useState(false)
  const [file, setFile] = useState(null)
  const [style, setStyle] = useState('devanagari')
  const [step, setStep] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  function handleFileSelect(f) {
    if (!f) return
    if (f.size > 500 * 1024 * 1024) { setError('File too large. Maximum 500MB.'); return }
    setFile(f); setResult(null); setError(null); setStep(null)
  }

  function handleDrop(e) {
    e.preventDefault(); setDragOver(false)
    handleFileSelect(e.dataTransfer.files[0])
  }

  async function handleGenerate() {
    if (!file) return
    setResult(null); setError(null)
    let fileToUpload = file
    if (!isAudioFile(file)) {
      setStep('extracting')
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        const ctx = new AudioCtx({ sampleRate: 16000 })
        const buf = await file.arrayBuffer()
        const decoded = await ctx.decodeAudioData(buf)
        const wav = audioBufferToWav(decoded)
        fileToUpload = new File([wav], 'audio.wav', { type: 'audio/wav' })
      } catch {
        setError('Could not extract audio. Try uploading an MP3 file directly.')
        setStep(null); return
      }
    }
    setStep('transcribing')
    const formData = new FormData()
    formData.append('audio', fileToUpload)
    formData.append('style', style)
    try {
      const res = await fetch('/api/transcribe', { method: 'POST', body: formData })
      if (!res.ok) { const e = await res.json(); throw new Error(e.error) }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const text = await blob.text()
      const lineCount = text.split('\n\n').filter(Boolean).length
      setResult({ url, filename: `nepali_subtitles_${Date.now()}.srt`, lines: lineCount })
      setStep('done')
    } catch (e) { setError(e.message); setStep(null) }
  }

  const loading = step === 'extracting' || step === 'transcribing'
  const canGenerate = file && !loading

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>Nepali Subtitle Generator — Swor AI</title>
        <meta name="description" content="Generate accurate Nepali subtitles from any video or audio. Free forever. Devanagari and Romanized." />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Manrope',sans-serif;background:#FAFAFA;color:#1d1d1f;-webkit-font-smoothing:antialiased}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeIn .2s ease}
      `}</style>

      {/* NAV */}
      <nav style={{padding:'0 24px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #e8e8ed',background:'#fff',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:6,textDecoration:'none'}}>
            <div style={{width:26,height:26,borderRadius:6,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#fff',fontWeight:800}}>M</div>
            <span style={{fontSize:14,fontWeight:700,fontFamily:'Sora,sans-serif',color:'#1d1d1f'}}>Swor AI</span>
          </Link>
          <Link href="/tool" style={{fontSize:13,color:'#888',textDecoration:'none'}}>← All Tools</Link>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{fontSize:12,fontWeight:700,background:'#FFFDE7',color:'#F57F17',border:'1px solid #FFF176',padding:'5px 12px',borderRadius:20}}>
            Always Free
          </div>
        </div>
      </nav>

      {/* PAGE TITLE */}
      <div style={{background:'#fff',borderBottom:'1px solid #e8e8ed',padding:'20px 24px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:40,height:40,borderRadius:10,background:'#FFFDE7',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>🎬</div>
          <div>
            <h1 style={{fontFamily:'Sora,sans-serif',fontSize:20,fontWeight:800,color:'#1d1d1f',letterSpacing:'-0.4px'}}>Nepali Subtitle Generator</h1>
            <p style={{fontSize:13,color:'#888',marginTop:2}}>Upload any video or audio and get accurate Nepali subtitles instantly. Free forever.</p>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{maxWidth:1100,margin:'0 auto',padding:isMobile?'20px 16px':'32px 24px',display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:20}}>

        {/* LEFT */}
        <div>
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !loading && inputRef.current?.click()}
            style={{
              border:`2px dashed ${dragOver ? '#F57F17' : file ? '#2E7D32' : '#d0ccc5'}`,
              borderRadius:14,
              padding:'48px 24px',
              textAlign:'center',
              cursor:loading?'not-allowed':'pointer',
              background:dragOver?'#FFFDE7':file?'#F0FAF5':'#fff',
              marginBottom:16,
              transition:'all .2s'
            }}
          >
            <input ref={inputRef} type="file" accept="video/*,audio/*,.mp4,.mov,.mp3,.wav,.m4a,.aac" style={{display:'none'}} onChange={e => handleFileSelect(e.target.files[0])} />
            <div style={{fontSize:40,marginBottom:12}}>{file ? '✅' : '🎬'}</div>
            {file ? (
              <>
                <div style={{fontSize:15,fontWeight:700,color:'#2E7D32',marginBottom:4}}>{file.name}</div>
                <div style={{fontSize:13,color:'#888'}}>{(file.size/1048576).toFixed(1)} MB{!loading && ' — Click to change file'}</div>
              </>
            ) : (
              <>
                <div style={{fontSize:15,fontWeight:700,color:'#1d1d1f',marginBottom:6}}>Drop your video or audio here</div>
                <div style={{fontSize:13,color:'#888',marginBottom:4}}>MP4, MOV, MP3, WAV, M4A up to 500MB</div>
                <div style={{fontSize:12,color:'#bbb'}}>or click to browse files</div>
              </>
            )}
          </div>

          {/* Script style selector */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:8}}>Subtitle Script</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {[
                { id:'devanagari', label:'देवनागरी', sub:'Nepali script', font:'Noto Sans Devanagari, sans-serif' },
                { id:'romanized', label:'Romanized', sub:'English letters', font:'Manrope, sans-serif' },
              ].map(s => (
                <button key={s.id} onClick={() => !loading && setStyle(s.id)}
                  style={{padding:'14px 16px',borderRadius:12,border:`2px solid ${style===s.id?'#F57F17':'#e8e8ed'}`,background:style===s.id?'#FFFDE7':'#fff',cursor:loading?'not-allowed':'pointer',textAlign:'left',transition:'all .15s'}}>
                  <div style={{fontFamily:s.font,fontSize:15,fontWeight:700,color:style===s.id?'#F57F17':'#1d1d1f',marginBottom:3}}>{s.label}</div>
                  <div style={{fontSize:11,color:'#888'}}>{s.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Progress indicators */}
          {step === 'extracting' && (
            <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',background:'#FFF8F0',border:'1px solid rgba(255,149,0,.2)',borderRadius:10,marginBottom:12,fontSize:13,fontWeight:600,color:'#B45309'}}>
              <div style={{width:14,height:14,border:'2px solid #F97316',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite',flexShrink:0}}/>
              🎵 Extracting audio from video...
            </div>
          )}
          {step === 'transcribing' && (
            <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',background:'#F0F9FF',border:'1px solid rgba(0,119,204,.2)',borderRadius:10,marginBottom:12,fontSize:13,fontWeight:600,color:'#0077CC'}}>
              <div style={{width:14,height:14,border:'2px solid #0077CC',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite',flexShrink:0}}/>
              📡 Generating Nepali subtitles...
            </div>
          )}

          {/* Generate button (mobile only — full width) */}
          {isMobile && (
            <button onClick={handleGenerate} disabled={!canGenerate}
              style={{width:'100%',padding:'14px',borderRadius:12,border:'none',marginBottom:12,
                background:canGenerate?'#F57F17':'#ccc',color:'#fff',fontSize:15,fontWeight:700,
                cursor:canGenerate?'pointer':'not-allowed',fontFamily:'Sora,sans-serif'}}>
              {step==='extracting'?'🎵 Extracting...':step==='transcribing'?'📡 Generating...':'🎬 Generate Subtitles'}
            </button>
          )}

          {/* Error */}
          {error && (
            <div style={{background:'#FFF0F0',border:'1px solid #FFB8B8',borderRadius:10,padding:'12px 16px',fontSize:13,color:'#CC3333',marginBottom:12}}>
              ❌ {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="fade-in">
              <div style={{background:'#E8F5E9',border:'1.5px solid #A5D6A7',borderRadius:14,padding:16,marginBottom:14,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:'#2E7D32'}}>✓ Subtitles ready! {result.lines && `(${result.lines} segments)`}</div>
                  <div style={{fontSize:11,color:'#888',marginTop:2}}>{result.filename}</div>
                </div>
                <a href={result.url} download={result.filename}
                  style={{background:'#2E7D32',color:'#fff',padding:'8px 16px',borderRadius:8,fontSize:12,fontWeight:700,textDecoration:'none',flexShrink:0}}>
                  ⬇ Download .SRT
                </a>
              </div>

              {/* CapCut instructions */}
              <div style={{background:'#fff',border:'1px solid #e8e8ed',borderRadius:14,padding:18}}>
                <div style={{fontSize:13,fontWeight:700,color:'#1d1d1f',marginBottom:12}}>📲 How to import in CapCut</div>
                <div style={{fontSize:13,color:'#555',lineHeight:1.8,marginBottom:12}}>
                  <strong style={{color:'#1d1d1f'}}>CapCut Desktop/Web:</strong> Open project → Click <strong>Text</strong> → Click <strong>Local Captions</strong> → Click <strong>Import</strong> → Select your .SRT file
                </div>
                <div style={{background:'#FFFDE7',border:'1px solid #FFF176',borderRadius:8,padding:'10px 12px'}}>
                  <div style={{fontSize:11,color:'#856404',fontWeight:600}}>⚠️ CapCut mobile does not support direct SRT import. Use CapCut on your computer or browser instead.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>

          {/* Generate button (desktop) */}
          {!isMobile && (
            <button onClick={handleGenerate} disabled={!canGenerate}
              style={{width:'100%',padding:'14px',borderRadius:12,border:'none',
                background:canGenerate?'#F57F17':'#ccc',color:'#fff',fontSize:15,fontWeight:700,
                cursor:canGenerate?'pointer':'not-allowed',fontFamily:'Sora,sans-serif',
                boxShadow:canGenerate?'0 4px 20px rgba(245,127,23,.3)':'none'}}>
              {step==='extracting'?'🎵 Extracting...':step==='transcribing'?'📡 Generating...':'🎬 Generate Subtitles'}
            </button>
          )}

          {/* Free badge */}
          <div style={{background:'#FFFDE7',border:'2px solid #FFF176',borderRadius:12,padding:'14px 16px',textAlign:'center'}}>
            <div style={{fontSize:28,marginBottom:6}}>🎉</div>
            <div style={{fontSize:14,fontWeight:800,color:'#F57F17',fontFamily:'Sora,sans-serif',marginBottom:4}}>100% Free</div>
            <div style={{fontSize:12,color:'#888',lineHeight:1.6}}>Subtitle generation is always free. No credits needed. No signup required.</div>
          </div>

          {/* Supported formats */}
          <div style={{background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed',padding:'14px 16px'}}>
            <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>Supported Formats</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {['MP4','MOV','MP3','WAV','M4A','AAC','FLAC','OGG'].map(f => (
                <span key={f} style={{background:'#f5f5f7',borderRadius:6,padding:'4px 8px',fontSize:11,fontWeight:600,color:'#555'}}>{f}</span>
              ))}
            </div>
            <div style={{fontSize:11,color:'#888',marginTop:8}}>Max file size: 500MB</div>
          </div>

          {/* Output info */}
          <div style={{background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed',padding:'14px 16px'}}>
            <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>Output</div>
            <div style={{display:'flex',flexDirection:'column',gap:8,fontSize:13}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{width:28,height:28,background:'#FFFDE7',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#F57F17',flexShrink:0}}>.SRT</span>
                <div>
                  <div style={{fontWeight:600,color:'#1d1d1f'}}>SRT subtitle file</div>
                  <div style={{fontSize:11,color:'#888'}}>Compatible with CapCut, Premiere, DaVinci</div>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:16}}>🇳🇵</span>
                <div style={{fontSize:12,color:'#555'}}>Nepali Devanagari or Romanized script</div>
              </div>
            </div>
          </div>

          {/* Other tools */}
          <div style={{background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed',padding:'14px 16px'}}>
            <div style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:10}}>Other Tools</div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <Link href="/voiceover" style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:8,background:'#E8F4FD',textDecoration:'none',fontSize:13,fontWeight:600,color:'#1976D2'}}>
                🎙️ Nepali Voiceover
              </Link>
              <Link href="/music" style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:8,background:'#E8F5E9',textDecoration:'none',fontSize:13,fontWeight:600,color:'#2E7D32'}}>
                🎵 Create Music
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
