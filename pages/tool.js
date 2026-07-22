import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

const TOOLS = [
  {
    id: 'voiceover',
    emoji: '🎙️',
    badge: '20 voices',
    badgeColor: '#E8F4FD',
    badgeText: '#1976D2',
    name: 'Nepali Voiceover',
    desc: 'Type Nepali text and get a professional AI voiceover in 8 seconds. 20 premium voices.',
    href: '/voiceover',
    cta: 'Open Nepali Voiceover →',
    color: '#DC143C',
    bg: 'linear-gradient(135deg,#fff5f7 0%,#fff 100%)',
    border: 'rgba(220,20,60,.15)',
    demoLink: true,
  },
  {
    id: 'music',
    emoji: '🎵',
    badge: 'Music v2',
    badgeColor: '#E8F5E9',
    badgeText: '#2E7D32',
    name: 'Create Music',
    desc: 'Type a prompt and generate original royalty-free Nepali music. Folk, pop, devotional and more.',
    href: '/music',
    cta: 'Open Create Music →',
    color: '#2E7D32',
    bg: 'linear-gradient(135deg,#f1f8f1 0%,#fff 100%)',
    border: 'rgba(46,125,50,.15)',
    demoLink: false,
  },
  {
    id: 'subtitles',
    emoji: '🎬',
    badge: 'Always free',
    badgeColor: '#FFFDE7',
    badgeText: '#F57F17',
    name: 'Nepali Subtitles',
    desc: 'Upload any video or audio and get accurate Nepali subtitles in Devanagari or Romanized script.',
    href: '/subtitles',
    cta: 'Open Nepali Subtitles →',
    color: '#F57F17',
    bg: 'linear-gradient(135deg,#fffdf0 0%,#fff 100%)',
    border: 'rgba(245,127,23,.15)',
    demoLink: false,
  },
]

export default function Tool() {
  const [isMobile, setIsMobile] = useState(false)

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>Nepali AI Audio Tools — Swor AI</title>
        <meta name="description" content="Nepal's first AI audio studio. Generate Nepali voiceover, AI music and subtitles in seconds. 20 premium Nepali voices." />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Manrope',sans-serif;background:#FAFAFA;color:#1d1d1f;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
      `}</style>

      {/* NAV */}
      <nav style={{padding:'0 32px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #e8e8ed',background:'#fff',position:'sticky',top:0,zIndex:100}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'#fff',fontWeight:800}}>M</div>
          <span style={{fontSize:15,fontWeight:700,fontFamily:'Sora,sans-serif'}}>Swor AI</span>
        </Link>
        <div style={{display:'flex',gap:8}}>
          <Link href="/#access" style={{fontSize:13,fontWeight:600,color:'#555',padding:'7px 16px',borderRadius:10,border:'1px solid #e8e8ed',background:'#fff'}}>
            Get Access →
          </Link>
        </div>
      </nav>

      {/* HEADER */}
      <div style={{padding:'48px 32px 32px',textAlign:'center',background:'#fff',borderBottom:'1px solid #e8e8ed'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(220,20,60,.08)',border:'1px solid rgba(220,20,60,.15)',borderRadius:20,padding:'5px 14px',fontSize:11,fontWeight:700,color:'#DC143C',marginBottom:16,letterSpacing:'0.06em'}}>
          NEPAL&apos;S FIRST AI AUDIO STUDIO
        </div>
        <h1 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,4vw,36px)',fontWeight:800,letterSpacing:'-0.8px',marginBottom:8}}>
          What do you want to create?
        </h1>
        <p style={{fontSize:15,color:'#6e6e73',maxWidth:480,margin:'0 auto'}}>
          Pick a tool and start creating professional Nepali content in seconds.
        </p>
      </div>

      {/* TOOLS GRID */}
      <div style={{maxWidth:960,margin:'40px auto',padding:'0 24px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
        {TOOLS.map(t => (
          <div key={t.id} style={{background:t.bg,borderRadius:20,padding:28,border:`1.5px solid ${t.border}`,display:'flex',flexDirection:'column',gap:16}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                <div style={{fontSize:28}}>{t.emoji}</div>
                <div style={{background:t.badgeColor,color:t.badgeText,fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:20}}>
                  {t.badge}
                </div>
              </div>
              <div style={{fontFamily:'Sora,sans-serif',fontSize:18,fontWeight:800,marginBottom:8}}>{t.name}</div>
              <div style={{fontSize:13,color:'#6e6e73',lineHeight:1.65}}>{t.desc}</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:'auto'}}>
              <a href={t.href} style={{display:'inline-flex',alignItems:'center',gap:6,background:t.color,color:'#fff',padding:'10px 20px',borderRadius:10,fontSize:13,fontWeight:700,textDecoration:'none'}}>
                {t.cta}
              </a>
              {t.demoLink && (
                <a href="/nepali-text-to-speech" style={{display:'inline-flex',alignItems:'center',gap:6,color:'#888',padding:'4px 0',fontSize:12,fontWeight:600,textDecoration:'none'}}>
                  🎙️ Try free demo first (no login needed) →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer style={{padding:'32px 24px',background:'#111',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16,marginTop:40}}>
        <div style={{fontSize:12,color:'rgba(255,255,255,.25)'}}>© 2026 Swor AI · A product of MeroAD.ai · Kathmandu, Nepal</div>
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          <Link href="/" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Home</Link>
          <Link href="/voiceover" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Voiceover</Link>
          <Link href="/music" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Music</Link>
          <Link href="/subtitles" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Subtitles</Link>
          <Link href="/nepali-text-to-speech" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Nepali TTS</Link>
        </div>
      </footer>
    </>
  )
}
