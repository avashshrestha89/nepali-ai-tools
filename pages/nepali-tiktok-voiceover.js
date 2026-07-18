import Head from 'next/head'
import Link from 'next/link'

export default function NepaliTiktokVoiceover() {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>Nepali TikTok Voiceover Generator — Free AI Nepali Voice | Swor AI</title>
        <meta name="description" content="Free Nepali TikTok voiceover generator. Add professional AI Nepali narration to your TikTok and Reels without recording your own voice. 20 natural voices. Try free at meroadai.com" />
        <meta name="keywords" content="nepali tiktok voiceover, nepali reels voiceover, nepali voice for tiktok, tiktok nepali voice generator, nepali ai voice tiktok, nepali voiceover for reels, nepali content creator voice, tiktok voice nepali" />
        <link rel="canonical" href="https://meroadai.com/nepali-tiktok-voiceover" />
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
            🎵 NEPALI TIKTOK VOICEOVER
          </div>
          <h1 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(28px,5vw,52px)',fontWeight:800,letterSpacing:'-1.5px',lineHeight:1.1,marginBottom:20}}>
            Free Nepali TikTok<br />Voiceover Generator
          </h1>
          <p style={{fontSize:18,color:'#6e6e73',lineHeight:1.7,marginBottom:32,maxWidth:560,margin:'0 auto 32px'}}>
            Add professional AI Nepali narration to your TikTok videos and Instagram Reels in seconds. No microphone, no recording, no voice artist fees.
          </p>
          <Link href="/voiceover">
            <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'16px 40px',borderRadius:14,fontSize:17,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif',boxShadow:'0 8px 32px rgba(220,20,60,.25)'}}>
              Generate TikTok Voiceover Free →
            </button>
          </Link>
          <div style={{fontSize:13,color:'#999',marginTop:12}}>✓ 20 Nepali voices &nbsp;·&nbsp; ✓ Emotion control &nbsp;·&nbsp; ✓ 100% royalty-free &nbsp;·&nbsp; ✓ Download MP3</div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:'80px 24px',background:'#fff'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:48}}>
            How to Add Nepali Voiceover to TikTok
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}>
            {[
              {step:'01',icon:'✍️',title:'Write your TikTok script',desc:'Type your Nepali script in Devanagari. Up to 500 characters per generation — perfect for a 30-40 second TikTok video.'},
              {step:'02',icon:'🎙️',title:'Pick your voice',desc:'Choose from 20 AI Nepali voices. Add emotion tags like [excited] or [whispers] for dynamic TikTok delivery.'},
              {step:'03',icon:'⬇️',title:'Download and import',desc:'Download your MP3 voiceover and import directly into CapCut, InShot, or TikTok\'s video editor. Done in under 60 seconds.'},
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

      {/* BEST VOICES FOR TIKTOK */}
      <section style={{padding:'80px 24px',background:'#f5f5f7'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:12}}>
            Best Nepali Voices for TikTok & Reels
          </h2>
          <p style={{textAlign:'center',color:'#6e6e73',fontSize:16,marginBottom:48}}>
            These voices are most popular among Nepali TikTok and Reels creators.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16}}>
            {[
              {name:'Anika',desc:'Sweet & Lively — perfect for lifestyle, fashion and food content',color:'#7B2FBE',gender:'Female'},
              {name:'Arjun',desc:'Energetic Reels — high energy delivery for viral content',color:'#F57C00',gender:'Male'},
              {name:'Priyanka',desc:'Romantic & Elegant — ideal for love, travel and beauty content',color:'#FF6B8A',gender:'Female'},
              {name:'Asha',desc:'Conversational & Bright — natural, friendly tone for everyday vlogs',color:'#D81B60',gender:'Female'},
              {name:'Rohan',desc:'Casual & Laid-Back — relaxed tone for comedy and reaction videos',color:'#546E7A',gender:'Male'},
              {name:'Suraj',desc:'Upbeat TV Announcer — high-energy for product reveals and promos',color:'#FFA000',gender:'Male'},
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

      {/* EMOTION TAGS */}
      <section style={{padding:'80px 24px',background:'#fff'}}>
        <div style={{maxWidth:760,margin:'0 auto',textAlign:'center'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3.5vw,36px)',fontWeight:800,letterSpacing:'-0.8px',marginBottom:12}}>
            Make Your TikTok Voiceover More Dynamic
          </h2>
          <p style={{color:'#6e6e73',fontSize:16,marginBottom:32,lineHeight:1.65}}>
            Use emotion tags in your script to control exactly how the voice sounds — no other Nepali TTS tool offers this.
          </p>
          <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',marginBottom:32}}>
            {['[excited]','[whispers]','[laughs]','[calm]','[sad]','[nervous]','[angry]','[playfully]','[cheerfully]','[sighs]','[gasps]','[shouts]'].map(tag=>(
              <span key={tag} style={{background:'#E8EEFF',color:'#1976D2',padding:'6px 14px',borderRadius:20,fontSize:13,fontWeight:600}}>{tag}</span>
            ))}
          </div>
          <div style={{background:'#f5f5f7',borderRadius:14,padding:'20px 24px',textAlign:'left',marginBottom:32}}>
            <div style={{fontSize:11,fontWeight:700,color:'#DC143C',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.08em'}}>Example TikTok Script</div>
            <div style={{fontSize:14,color:'#1d1d1f',lineHeight:1.8,fontFamily:'Noto Sans Devanagari, sans-serif'}}>
              [excited] साथीहरू, आज म तपाईंलाई एउटा कमालको कुरा बताउँछु! [whispers] यो कुरा धेरैलाई थाहा छैन। [laughs] तर अब तपाईंलाई थाहा हुन्छ!
            </div>
          </div>
          <Link href="/voiceover">
            <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'14px 32px',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer'}}>
              Try It Free →
            </button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'80px 24px',background:'linear-gradient(160deg,#1d1d1f 0%,#2d1020 100%)',textAlign:'center'}}>
        <div style={{maxWidth:600,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(24px,4vw,40px)',fontWeight:800,color:'#fff',letterSpacing:'-1px',marginBottom:16}}>
            Start Creating TikTok Voiceovers in Nepali
          </h2>
          <p style={{fontSize:16,color:'rgba(255,255,255,.55)',lineHeight:1.7,marginBottom:36,maxWidth:440,margin:'0 auto 36px'}}>
            Join hundreds of Nepali TikTok creators using Swor AI to produce professional content without a microphone.
          </p>
          <Link href="/voiceover">
            <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'16px 40px',borderRadius:14,fontSize:17,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif',boxShadow:'0 8px 32px rgba(220,20,60,.3)'}}>
              Generate TikTok Voiceover Now →
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
          <a href="mailto:meroadaiofficial@gmail.com" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Contact</a>
        </div>
      </footer>
    </>
  )
}
