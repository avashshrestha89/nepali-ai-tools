import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ToolHub() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(d => setSession(d.loggedIn ? d : false))
      .catch(() => setSession(false))
  }, [])

  const tools = [
    {
      href: '/voiceover',
      icon: '🎙️',
      title: 'Nepali Voiceover',
      desc: 'Type Nepali text and get a professional AI voiceover in 8 seconds. 15 premium voices.',
      color: '#E8F4FD',
      border: '#90CAF9',
      accent: '#1976D2',
      badge: '15 voices',
    },
    {
      href: '/music',
      icon: '🎵',
      title: 'Create Music',
      desc: 'Type a prompt and generate original royalty-free Nepali music. Folk, pop, devotional and more.',
      color: '#E8F5E9',
      border: '#A5D6A7',
      accent: '#2E7D32',
      badge: 'Music v2',
    },
    {
      href: '/subtitles',
      icon: '🎬',
      title: 'Nepali Subtitles',
      desc: 'Upload any video or audio and get accurate Nepali subtitles in Devanagari or Romanized script.',
      color: '#FFFDE7',
      border: '#FFF176',
      accent: '#F57F17',
      badge: 'Always free',
    },
  ]

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>Swor AI Tools — Nepali Voiceover, Music & Subtitles</title>
        <meta name="description" content="Nepal's first AI audio studio. Generate Nepali voiceovers, original music, and subtitles." />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Manrope',sans-serif;background:#fff;color:#1d1d1f;-webkit-font-smoothing:antialiased}
        .tool-card{border-radius:20px;padding:36px 28px;cursor:pointer;transition:all .2s;text-decoration:none;display:block;border:2px solid}
        .tool-card:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(0,0,0,.1)}
      `}</style>

      {/* NAV */}
      <nav style={{padding:'0 32px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #f0f0f0',background:'#fff',position:'sticky',top:0,zIndex:100}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}>
          <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'#fff',fontWeight:800}}>M</div>
          <span style={{fontSize:15,fontWeight:700,fontFamily:'Sora,sans-serif',color:'#1d1d1f'}}>MeroAD.ai</span>
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          {session && (
            <div style={{fontSize:13,fontWeight:600,color:'#555',background:'#f5f5f7',padding:'6px 14px',borderRadius:20}}>
              {session.credits || 0} credits
            </div>
          )}
          {!session && (
            <Link href="/#access">
              <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'8px 18px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif'}}>
                Get Access →
              </button>
            </Link>
          )}
        </div>
      </nav>

      {/* MAIN */}
      <div style={{maxWidth:960,margin:'0 auto',padding:'80px 24px'}}>
        <div style={{textAlign:'center',marginBottom:64}}>
          <div style={{fontSize:12,fontWeight:700,color:'#DC143C',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:12}}>
            Nepal's First AI Audio Studio
          </div>
          <h1 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(28px,4vw,48px)',fontWeight:800,letterSpacing:'-1.5px',marginBottom:14,color:'#1d1d1f'}}>
            What do you want to create?
          </h1>
          <p style={{fontSize:16,color:'#6e6e73',maxWidth:480,margin:'0 auto',lineHeight:1.7}}>
            Pick a tool and start creating professional Nepali content in seconds.
          </p>
        </div>

        {/* THREE CARDS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:20}}>
          {tools.map(t => (
            <Link key={t.href} href={t.href} className="tool-card"
              style={{background:t.color,borderColor:t.border}}>
              <div style={{fontSize:44,marginBottom:20}}>{t.icon}</div>
              <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(255,255,255,.8)',border:`1px solid ${t.border}`,borderRadius:20,padding:'3px 10px',fontSize:11,fontWeight:700,color:t.accent,marginBottom:14}}>
                {t.badge}
              </div>
              <h2 style={{fontFamily:'Sora,sans-serif',fontSize:20,fontWeight:800,color:'#1d1d1f',marginBottom:10,letterSpacing:'-0.4px'}}>
                {t.title}
              </h2>
              <p style={{fontSize:14,color:'#555',lineHeight:1.65,marginBottom:24}}>
                {t.desc}
              </p>
              <div style={{display:'flex',alignItems:'center',gap:6,fontWeight:700,fontSize:14,color:t.accent,fontFamily:'Sora,sans-serif'}}>
                Open {t.title} <span style={{fontSize:18}}>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* CREDIT INFO */}
        <div style={{marginTop:48,background:'#f5f5f7',borderRadius:16,padding:'20px 24px',display:'flex',gap:24,flexWrap:'wrap',justifyContent:'center',alignItems:'center'}}>
          {[
            {icon:'🎙️',label:'1 voiceover',cost:'25 credits'},
            {icon:'🎵',label:'30s music',cost:'100 credits'},
            {icon:'🎬',label:'Subtitles',cost:'Always free'},
          ].map(c => (
            <div key={c.label} style={{display:'flex',alignItems:'center',gap:8,fontSize:13}}>
              <span>{c.icon}</span>
              <span style={{color:'#888'}}>{c.label}</span>
              <span style={{fontWeight:700,color:'#1d1d1f'}}>{c.cost}</span>
            </div>
          ))}
          <Link href="/#pricing" style={{fontSize:13,fontWeight:700,color:'#DC143C',textDecoration:'none'}}>
            Buy credits →
          </Link>
        </div>
      </div>
    </>
  )
}
