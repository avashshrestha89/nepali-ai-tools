import Head from 'next/head'
import Link from 'next/link'

export default function NepaliVoiceGenerator() {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>Nepali Voice Generator — Free AI Nepali Voice Online | Swor AI</title>
        <meta name="description" content="Free Nepali voice generator online. Generate natural AI Nepali voices for TikTok, YouTube, ads and documentary. 20 premium Nepali voices. Try free at meroadai.com" />
        <meta name="keywords" content="nepali voice generator, nepali ai voice generator, nepali voice generator online, free nepali voice generator, ai nepali voice, nepali voice maker, nepali voice creator" />
        <link rel="canonical" href="https://meroadai.com/nepali-voice-generator" />
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
            🎙️ NEPALI VOICE GENERATOR
          </div>
          <h1 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(28px,5vw,52px)',fontWeight:800,letterSpacing:'-1.5px',lineHeight:1.1,marginBottom:20}}>
            Nepal's #1 Free Nepali<br />Voice Generator Online
          </h1>
          <p style={{fontSize:18,color:'#6e6e73',lineHeight:1.7,marginBottom:32,maxWidth:560,margin:'0 auto 32px'}}>
            Generate professional AI Nepali voices in seconds. 20 natural-sounding voices for TikTok, YouTube, documentary, news, ads and more. No microphone needed.
          </p>
          <Link href="/voiceover">
            <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'16px 40px',borderRadius:14,fontSize:17,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif',boxShadow:'0 8px 32px rgba(220,20,60,.25)'}}>
              Generate Nepali Voice Free →
            </button>
          </Link>
          <div style={{fontSize:13,color:'#999',marginTop:12}}>✓ 20 voices &nbsp;·&nbsp; ✓ Emotion control &nbsp;·&nbsp; ✓ Voice cloning &nbsp;·&nbsp; ✓ 100% royalty-free</div>
        </div>
      </section>

      {/* VOICES GRID */}
      <section style={{padding:'80px 24px',background:'#fff'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:48}}>
            20 Premium Nepali AI Voices
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12}}>
            {[
              {name:'Priyanka',desc:'Romantic & Elegant',gender:'Female',color:'#FF6B8A'},
              {name:'Sunita',desc:'Soft Spoken Aunty',gender:'Female',color:'#E91E8C'},
              {name:'Anjali',desc:'Motivational',gender:'Female',color:'#FF8C42'},
              {name:'Vanishree',desc:'Professional News',gender:'Female',color:'#0077CC'},
              {name:'Anika',desc:'Sweet & Lively',gender:'Female',color:'#7B2FBE'},
              {name:'Mina',desc:'Friendly & Polished',gender:'Female',color:'#00897B'},
              {name:'Shraddha',desc:'Credible & Trustworthy',gender:'Female',color:'#5C6BC0'},
              {name:'Monika',desc:'Suspense & Drama',gender:'Female',color:'#1C1C2E'},
              {name:'Ridhi',desc:'Elegant Ad Narration',gender:'Female',color:'#00ACC1'},
              {name:'Asha',desc:'Conversational & Bright',gender:'Female',color:'#D81B60'},
              {name:'Dhurundhar',desc:'Deep & Commanding',gender:'Male',color:'#1A3A5C'},
              {name:'Bishnu',desc:'Wise Documentary',gender:'Male',color:'#4E342E'},
              {name:'Rohan',desc:'Casual & Laid-Back',gender:'Male',color:'#546E7A'},
              {name:'Arjun',desc:'Energetic Reels',gender:'Male',color:'#F57C00'},
              {name:'Vikram',desc:'Confident & Warm',gender:'Male',color:'#2E7D32'},
              {name:'Karan',desc:'Dark Documentary',gender:'Male',color:'#212121'},
              {name:'Rudra',desc:'Intense & Romantic',gender:'Male',color:'#880E4F'},
              {name:'Suraj',desc:'Upbeat TV Announcer',gender:'Male',color:'#FFA000'},
              {name:'Saurav',desc:'Sports Commentator',gender:'Male',color:'#B71C1C'},
              {name:'Prakash',desc:'Clear & Professional',gender:'Male',color:'#37474F'},
            ].map(v=>(
              <div key={v.name} style={{background:'#f8f8f8',borderRadius:12,padding:'14px 16px',border:'1.5px solid #e8e8ed'}}>
                <div style={{width:36,height:36,borderRadius:9,background:v.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#fff',marginBottom:8}}>{v.name[0]}</div>
                <div style={{fontSize:13,fontWeight:700,color:'#1d1d1f'}}>{v.name}</div>
                <div style={{fontSize:11,color:'#888',marginTop:2}}>{v.desc}</div>
                <div style={{fontSize:10,fontWeight:700,color:v.gender==='Female'?'#E91E8C':'#1565C0',marginTop:4,textTransform:'uppercase'}}>{v.gender}</div>
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

      {/* USE CASES */}
      <section style={{padding:'80px 24px',background:'#f5f5f7'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:48}}>
            What Can You Do With a Nepali Voice Generator?
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16}}>
            {[
              {emoji:'📱',title:'TikTok & Reels Voiceover',desc:'Add professional Nepali narration to TikTok videos, Instagram Reels, and YouTube Shorts without recording your own voice.'},
              {emoji:'🎬',title:'Faceless YouTube Channels',desc:'Run a successful faceless Nepali YouTube channel. Generate documentary, educational, or entertainment narration instantly.'},
              {emoji:'📺',title:'News & Documentary',desc:'Create broadcast-quality Nepali news narration and documentary voiceover using Vanishree, Bishnu or Dhurundhar voices.'},
              {emoji:'🏢',title:'Business Advertisements',desc:'Generate professional Nepali voiceovers for product ads, promotional videos, and social media content at 75% less cost.'},
              {emoji:'🎓',title:'Educational Content',desc:'Convert educational scripts to Nepali audio for online courses, tutorials, Lok Sewa prep materials, and e-learning content.'},
              {emoji:'🎵',title:'Voice + Music Together',desc:'Combine Nepali AI voiceover with AI-generated Nepali background music — both available in one platform at meroadai.com.'},
            ].map(u=>(
              <div key={u.title} style={{background:'#fff',borderRadius:16,padding:'22px 20px',border:'1.5px solid #e8e8ed'}}>
                <div style={{fontSize:28,marginBottom:10}}>{u.emoji}</div>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:14,fontWeight:700,marginBottom:8}}>{u.title}</div>
                <div style={{fontSize:13,color:'#6e6e73',lineHeight:1.65}}>{u.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'80px 24px',background:'linear-gradient(160deg,#1d1d1f 0%,#2d1020 100%)',textAlign:'center'}}>
        <div style={{maxWidth:600,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(24px,4vw,40px)',fontWeight:800,color:'#fff',letterSpacing:'-1px',marginBottom:16}}>
            Start Generating Nepali Voices Free
          </h2>
          <p style={{fontSize:16,color:'rgba(255,255,255,.55)',lineHeight:1.7,marginBottom:36,maxWidth:440,margin:'0 auto 36px'}}>
            Nepal's only AI voice generator with 20 Nepali voices, emotion control, voice cloning and AI music — all in one platform.
          </p>
          <Link href="/voiceover">
            <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'16px 40px',borderRadius:14,fontSize:17,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif',boxShadow:'0 8px 32px rgba(220,20,60,.3)'}}>
              Generate Nepali Voice Now →
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
          <a href="mailto:meroadaiofficial@gmail.com" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Contact</a>
        </div>
      </footer>
    </>
  )
}
