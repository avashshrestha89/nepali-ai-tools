import Head from 'next/head'
import Link from 'next/link'

export default function NepaliYoutubeVoiceover() {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>Nepali YouTube Voiceover Generator — Free AI Nepali Voice | Swor AI</title>
        <meta name="description" content="Free Nepali YouTube voiceover generator. Create professional AI Nepali narration for your YouTube channel without a microphone. 20 natural voices. Try free at meroadai.com" />
        <meta name="keywords" content="nepali youtube voiceover, nepali voice for youtube, faceless nepali youtube channel, nepali youtube narration, nepali documentary voice youtube, nepali ai voice youtube, nepali youtube voice generator, nepali voice without microphone" />
        <link rel="canonical" href="https://meroadai.com/nepali-youtube-voiceover" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Manrope',sans-serif;background:#fff;color:#1d1d1f;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
      `}</style>

      {/* NAV */}
      <nav style={{position:'sticky',top:0,background:'rgba(255,255,255,.95)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(0,0,0,.06)',padding:'0 32px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',zIndex:100}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'#fff',fontWeight:800}}>M</div>
          <span style={{fontSize:15,fontWeight:700,fontFamily:'Sora,sans-serif'}}>Swor AI</span>
        </Link>
        <Link href="/voiceover">
          <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'9px 20px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>Try Free →</button>
        </Link>
      </nav>

      {/* HERO */}
      <section style={{background:'linear-gradient(160deg,#fff 0%,#fff5f7 50%,#fff 100%)',padding:'80px 24px 60px',textAlign:'center'}}>
        <div style={{maxWidth:760,margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(220,20,60,.08)',border:'1px solid rgba(220,20,60,.15)',borderRadius:20,padding:'5px 14px',fontSize:12,fontWeight:700,color:'#DC143C',marginBottom:24}}>
            🎬 NEPALI YOUTUBE VOICEOVER
          </div>
          <h1 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(28px,5vw,52px)',fontWeight:800,letterSpacing:'-1.5px',lineHeight:1.1,marginBottom:20}}>
            Free Nepali YouTube<br />Voiceover Generator
          </h1>
          <p style={{fontSize:18,color:'#6e6e73',lineHeight:1.7,marginBottom:32,maxWidth:560,margin:'0 auto 32px'}}>
            Create professional AI Nepali narration for your YouTube channel without recording your own voice. Perfect for faceless channels, documentaries, tutorials and more.
          </p>
          <Link href="/voiceover">
            <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'16px 40px',borderRadius:14,fontSize:17,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif',boxShadow:'0 8px 32px rgba(220,20,60,.25)'}}>
              Generate YouTube Voiceover Free →
            </button>
          </Link>
          <div style={{fontSize:13,color:'#999',marginTop:12}}>✓ 20 Nepali voices &nbsp;·&nbsp; ✓ No microphone needed &nbsp;·&nbsp; ✓ 100% royalty-free &nbsp;·&nbsp; ✓ Download MP3</div>
        </div>
      </section>

      {/* FACELESS CHANNEL SECTION */}
      <section style={{padding:'80px 24px',background:'#fff'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:12}}>
            Start a Faceless Nepali YouTube Channel
          </h2>
          <p style={{textAlign:'center',color:'#6e6e73',fontSize:16,marginBottom:48,maxWidth:560,margin:'0 auto 48px',lineHeight:1.65}}>
            Thousands of successful YouTube channels never show their creator's face. Use Swor AI to generate professional Nepali narration and build your channel without a camera or microphone.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16}}>
            {[
              {emoji:'📰',title:'News & Current Affairs',desc:'Create daily Nepali news summary videos using Vanishree (Professional News) or Bishnu (Wise Documentary) voice.'},
              {emoji:'📚',title:'Educational & Tutorial',desc:'Explain topics in Nepali for students, Lok Sewa aspirants, and learners using clear, authoritative voices like Prakash.'},
              {emoji:'🌍',title:'History & Documentary',desc:'Produce compelling Nepali documentary narration using Dhurundhar (Deep & Commanding) or Karan (Dark Documentary).'},
              {emoji:'💰',title:'Finance & Business',desc:'Share investment tips, business advice, and financial education in Nepali without revealing your identity.'},
              {emoji:'🏔️',title:'Travel & Nepal Culture',desc:'Create travel documentaries and Nepal culture content with cinematic Nepali narration for diaspora audiences.'},
              {emoji:'🎮',title:'Gaming & Entertainment',desc:'Add Nepali commentary and narration to gaming videos, countdown lists, and entertainment content.'},
            ].map(u=>(
              <div key={u.title} style={{background:'#f5f5f7',borderRadius:16,padding:'22px 20px'}}>
                <div style={{fontSize:28,marginBottom:10}}>{u.emoji}</div>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:14,fontWeight:700,marginBottom:8}}>{u.title}</div>
                <div style={{fontSize:13,color:'#6e6e73',lineHeight:1.65}}>{u.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEST VOICES FOR YOUTUBE */}
      <section style={{padding:'80px 24px',background:'#f5f5f7'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:48}}>
            Best Nepali Voices for YouTube
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16}}>
            {[
              {name:'Vanishree',desc:'Professional News — broadcast-quality narration for news and current affairs channels',color:'#0077CC',gender:'Female'},
              {name:'Bishnu',desc:'Wise Documentary — deep, authoritative tone for documentary and history content',color:'#4E342E',gender:'Male'},
              {name:'Dhurundhar',desc:'Deep & Commanding — powerful narration for cinematic documentary content',color:'#1A3A5C',gender:'Male'},
              {name:'Prakash',desc:'Clear & Professional — clean, educational delivery for tutorial channels',color:'#37474F',gender:'Male'},
              {name:'Karan',desc:'Dark Documentary — intense narration for crime, mystery and thriller content',color:'#212121',gender:'Male'},
              {name:'Vikram',desc:'Confident & Warm — versatile voice for general YouTube content and vlogs',color:'#2E7D32',gender:'Male'},
            ].map(v=>(
              <div key={v.name} style={{background:'#fff',borderRadius:14,padding:'20px',border:'1.5px solid #e8e8ed',display:'flex',gap:14,alignItems:'flex-start'}}>
                <div style={{width:42,height:42,borderRadius:10,background:v.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:'#fff',flexShrink:0}}>{v.name[0]}</div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:'#1d1d1f'}}>{v.name}</div>
                  <div style={{fontSize:11,fontWeight:700,color:v.gender==='Female'?'#E91E8C':'#1565C0',marginTop:2,textTransform:'uppercase'}}>{v.gender}</div>
                  <div style={{fontSize:12,color:'#6e6e73',marginTop:4,lineHeight:1.5}}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:36}}>
            <Link href="/voiceover">
              <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'14px 32px',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer'}}>
                Try All 20 Voices Free →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:'80px 24px',background:'#fff'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:48}}>
            How to Create Nepali YouTube Voiceover
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}>
            {[
              {step:'01',icon:'✍️',title:'Write your script',desc:'Type your Nepali script in Devanagari. Split long scripts into 500-character segments for each scene or section.'},
              {step:'02',icon:'🎙️',title:'Choose your voice',desc:'Pick the perfect voice for your YouTube niche. Use emotion tags like [calm] or [serious] for professional delivery.'},
              {step:'03',icon:'⬇️',title:'Download MP3',desc:'Download your professional Nepali voiceover as MP3 and import into Premiere Pro, DaVinci Resolve, or CapCut.'},
              {step:'04',icon:'🎬',title:'Publish your video',desc:'Combine voiceover with stock footage or screen recordings. Upload to YouTube and start growing your channel.'},
            ].map(s=>(
              <div key={s.step} style={{background:'#f5f5f7',borderRadius:16,padding:'24px'}}>
                <div style={{fontSize:11,fontWeight:800,color:'#DC143C',letterSpacing:'0.12em',marginBottom:12}}>{s.step}</div>
                <div style={{fontSize:24,marginBottom:10}}>{s.icon}</div>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:16,fontWeight:700,marginBottom:8}}>{s.title}</div>
                <div style={{fontSize:14,color:'#6e6e73',lineHeight:1.65}}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'80px 24px',background:'linear-gradient(160deg,#1d1d1f 0%,#2d1020 100%)',textAlign:'center'}}>
        <div style={{maxWidth:600,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(24px,4vw,40px)',fontWeight:800,color:'#fff',letterSpacing:'-1px',marginBottom:16}}>
            Start Your Nepali YouTube Channel Today
          </h2>
          <p style={{fontSize:16,color:'rgba(255,255,255,.55)',lineHeight:1.7,marginBottom:36,maxWidth:440,margin:'0 auto 36px'}}>
            Nepal's only AI voice generator built specifically for Nepali YouTube creators. Professional narration in seconds, no microphone needed.
          </p>
          <Link href="/voiceover">
            <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'16px 40px',borderRadius:14,fontSize:17,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif',boxShadow:'0 8px 32px rgba(220,20,60,.3)'}}>
              Generate YouTube Voiceover Now →
            </button>
          </Link>
          <div style={{fontSize:13,color:'rgba(255,255,255,.3)',marginTop:16}}>meroadai.com · Built in Kathmandu, Nepal 🇳🇵</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:'32px 24px',background:'#111',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
        <div style={{fontSize:12,color:'rgba(255,255,255,.25)'}}>© 2026 Swor AI · A product of MeroAD.ai · Kathmandu, Nepal</div>
        <div style={{display:'flex',gap:12}}>
          <Link href="/" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Home</Link>
          <Link href="/voiceover" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Try Tool</Link>
          <Link href="/nepali-text-to-speech" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Nepali TTS</Link>
          <Link href="/nepali-voice-generator" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Voice Generator</Link>
          <Link href="/nepali-tiktok-voiceover" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>TikTok Voiceover</Link>
          <a href="mailto:meroadaiofficial@gmail.com" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Contact</a>
        </div>
      </footer>
    </>
  )
}
