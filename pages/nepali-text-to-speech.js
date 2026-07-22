import Head from 'next/head'
import Link from 'next/link'
import { useState, useRef } from 'react'

const DEMO_VOICES = [
  { voice_id: '1zUSi8LeHs9M2mV8X6YS', name: 'Priyanka', desc: 'Romantic & Elegant', color: '#FF6B8A' },
  { voice_id: 'WdZjiN0nNcik2LBjOHiv', name: 'Bishnu', desc: 'Wise Documentary', color: '#4E342E' },
  { voice_id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Arjun', desc: 'Energetic Reels', color: '#F57C00' },
]

const DEMO_CHAR_LIMIT = 50

function DemoBox() {
  const [demoText, setDemoText] = useState('')
  const [demoVoice, setDemoVoice] = useState(DEMO_VOICES[0])
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoError, setDemoError] = useState(null)
  const [demoPlaying, setDemoPlaying] = useState(false)
  const demoAudioRef = useRef(null)

  async function handleDemo() {
    if (!demoText.trim() || demoLoading) return
    setDemoLoading(true)
    setDemoError(null)
    setDemoPlaying(false)

    try {
      const res = await fetch('/api/demo-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: demoText, voiceId: demoVoice.voice_id }),
      })

      if (!res.ok) {
        const e = await res.json()
        throw new Error(e.error)
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      if (demoAudioRef.current) {
        demoAudioRef.current.pause()
      }

      const audio = new Audio(url)
      demoAudioRef.current = audio
      audio.play()
      setDemoPlaying(true)
      audio.onended = () => setDemoPlaying(false)

    } catch (e) {
      setDemoError(e.message)
    }

    setDemoLoading(false)
  }

  return (
    <div style={{background:'#f5f5f7',borderRadius:20,padding:32,border:'1.5px solid #e8e8ed'}}>
      <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap'}}>
        {DEMO_VOICES.map(v => (
          <button key={v.voice_id} onClick={() => setDemoVoice(v)}
            style={{
              display:'flex',alignItems:'center',gap:8,
              padding:'8px 16px',borderRadius:10,border:'1.5px solid',
              borderColor: demoVoice.voice_id === v.voice_id ? v.color : '#e8e8ed',
              background: demoVoice.voice_id === v.voice_id ? `${v.color}15` : '#fff',
              cursor:'pointer',fontSize:13,fontWeight:600,
              color: demoVoice.voice_id === v.voice_id ? v.color : '#555',
              transition:'all .15s'
            }}>
            <div style={{width:20,height:20,borderRadius:5,background:v.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#fff',flexShrink:0}}>
              {v.name[0]}
            </div>
            {v.name} — {v.desc}
          </button>
        ))}
      </div>

      <div style={{background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed',overflow:'hidden',marginBottom:16}}>
        <textarea
          value={demoText}
          onChange={e => setDemoText(e.target.value.slice(0, DEMO_CHAR_LIMIT))}
          placeholder="नमस्ते! यहाँ नेपाली टाइप गर्नुस्..."
          style={{
            width:'100%',height:100,padding:'14px 16px',
            fontSize:16,lineHeight:1.8,border:'none',
            background:'transparent',color:'#1d1d1f',
            fontFamily:'Noto Sans Devanagari, Manrope, sans-serif',
            resize:'none',outline:'none'
          }}
        />
        <div style={{padding:'8px 16px',borderTop:'1px solid #f0f0f0',background:'#fafafa',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:12,color:'#DC143C',fontWeight:600}}>⚠️ Devanagari only — type in नेपाली</span>
          <span style={{fontSize:12,fontWeight:600,color: demoText.length >= DEMO_CHAR_LIMIT ? '#DC143C' : '#888'}}>
            {demoText.length} / {DEMO_CHAR_LIMIT}
          </span>
        </div>
      </div>

      {demoError && (
        <div style={{background:'#FFF0F0',border:'1px solid #FFB8B8',borderRadius:10,padding:'10px 14px',fontSize:13,color:'#CC3333',marginBottom:12}}>
          ❌ {demoError}
        </div>
      )}

      <button
        onClick={handleDemo}
        disabled={!demoText.trim() || demoLoading}
        style={{
          width:'100%',padding:'14px',borderRadius:12,border:'none',
          background: demoText.trim() && !demoLoading ? '#DC143C' : '#ccc',
          color:'#fff',fontSize:15,fontWeight:700,
          cursor: demoText.trim() && !demoLoading ? 'pointer' : 'not-allowed',
          fontFamily:'Sora,sans-serif',
          boxShadow: demoText.trim() ? '0 4px 20px rgba(220,20,60,.25)' : 'none',
          marginBottom:16
        }}>
        {demoLoading ? '⏳ Generating...' : demoPlaying ? '🔊 Playing...' : '🎙️ Hear This Voice Free'}
      </button>

      <div style={{textAlign:'center',padding:'16px',background:'#fff',borderRadius:12,border:'1.5px solid #e8e8ed'}}>
        <div style={{fontSize:13,color:'#1d1d1f',fontWeight:600,marginBottom:6}}>
          Like what you hear? Get 17 more voices + full scripts
        </div>
        <Link href="/tool">
          <button style={{background:'#1d1d1f',color:'#fff',border:'none',padding:'10px 24px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>
            Get Full Access →
          </button>
        </Link>
      </div>
    </div>
  )
}

const FAQS = [
  {
    q: 'What is Nepali text to speech?',
    a: 'Nepali text to speech (TTS) is AI technology that converts written Nepali Devanagari text into natural-sounding spoken audio. Swor AI uses advanced ElevenLabs technology to generate the most realistic Nepali voices available.',
  },
  {
    q: 'How do I convert Nepali text to audio?',
    a: 'With Swor AI, it takes 3 steps: Type or paste your Nepali text in Devanagari script, choose from 20 premium Nepali voices, click Generate and download your MP3 in seconds. No recording equipment, no studio, no voice artist needed. You can also use emotion tags like [excited], [whispers], [calm] to control how the voice sounds.',
  },
  {
    q: 'Can I use Swor AI for TikTok and YouTube voiceover?',
    a: 'Yes — Swor AI is specifically designed for TikTok creators, YouTube channels, and Instagram Reels. Generate professional Nepali narration for your videos in seconds without a microphone. All audio is 100% royalty-free and copyright-free for use on any platform.',
  },
  {
    q: 'Can I create a faceless Nepali YouTube channel using Swor AI?',
    a: 'Absolutely — Swor AI is the go-to tool for faceless Nepali YouTube channels. Generate professional narration without showing your face or recording your own voice.',
  },
  {
    q: 'What Nepali voices are available?',
    a: 'Swor AI has 20 premium Nepali AI voices including Priyanka (Romantic & Elegant), Vanishree (Professional News Style), Dhurundhar (Deep & Commanding), Anika (Sweet & Lively for Reels), Rudra (Intense & Romantic), Suraj (Upbeat TV & Radio Announcer), Saurav (Sports Commentator), Ridhi (Elegant Ad Narration), Asha (Conversational & Bright), Prakash (Clear & Professional) and 10 more. Both male and female voices available. You can also use emotion tags like [excited], [calm], [whispers] for dynamic delivery.',
  },
  {
    q: 'Is Swor AI free to use?',
    a: 'Sign up with your email for free access. Paid credit packs start at NPR 499 (Starter Pack — 2,500 credits) or NPR 999 (Creator Pack — 5,500 credits). Our Founders Lifetime Pack at NPR 2,500 gives you 62,500 credits and 50 AI music tracks — one-time payment, no monthly fees ever.',
  },
  {
    q: 'Does Swor AI support voice cloning?',
    a: 'Yes — Swor AI offers voice cloning for select creators and businesses. Clone your brand ambassador\'s voice for consistent narration across all your content. Contact us via WhatsApp at +1 925 537 9425 to discuss voice cloning options.',
  },
  {
    q: 'Does Swor AI generate Nepali music too?',
    a: 'Yes — Swor AI also generates original royalty-free Nepali AI music. Type a prompt describing the mood and style you want and get a custom music track in seconds. Perfect for video background music, intros, and ads.',
  },
  {
    q: 'What are the pricing plans?',
    a: 'Starter Pack: NPR 499 (2,500 credits). Creator Pack: NPR 999 (5,500 credits). Founders Lifetime Pack: NPR 2,500 one-time payment — 62,500 credits plus 50 AI music tracks, no monthly fees ever. All plans charged at 1 credit per character typed.',
  },
  {
    q: 'Can I generate Nepali subtitles too?',
    a: 'Yes — Swor AI also generates automatic Nepali subtitles for your videos. The subtitle tool is completely free and unlimited. Upload your audio or video and get an accurate Nepali subtitle file in seconds.',
  },
]

export default function NepaliTextToSpeech() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>Free Nepali Text to Speech — Nepal&apos;s #1 AI Voice Generator | Swor AI</title>
        <meta name="description" content="Free Nepali text to speech online. Nepal&apos;s #1 AI Nepali voice generator — 20 natural voices for TikTok, YouTube, documentary, news and ads. Generate professional Nepali voiceover in seconds. Try free at meroadai.com" />
        <meta name="keywords" content="nepali text to speech, nepali ai voice generator, nepali voiceover generator, nepali tts free, ai nepali voice, devanagari text to speech, nepali voice generator online, faceless nepali youtube voice, nepali documentary voice, nepali news voiceover ai, nepali reels voiceover, nepali tiktok voiceover, nepali voice without microphone, nepali voice cloning, नेपाली text to speech, नेपाली voiceover, nepali ai music generator, nepali youtube voiceover, nepali ad voiceover" />
        <link rel="canonical" href="https://meroadai.com/nepali-text-to-speech" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                "name": "Swor AI — Nepali Text to Speech",
                "url": "https://meroadai.com/nepali-text-to-speech",
                "description": "Nepal's #1 Nepali AI voice generator. Convert Nepali text to speech online with 20 natural voices for TikTok, YouTube, documentary, news and ads.",
                "applicationCategory": "MultimediaApplication",
                "operatingSystem": "Web",
                "offers": {
                  "@type": "Offer",
                  "price": "499",
                  "priceCurrency": "NPR",
                  "description": "Starter Pack — 2,500 Swor Credits"
                },
                "creator": {
                  "@type": "Organization",
                  "name": "MeroAD.ai",
                  "url": "https://meroadai.com",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Kathmandu",
                    "addressCountry": "NP"
                  }
                }
              },
              {
                "@type": "FAQPage",
                "mainEntity": FAQS.map(f => ({
                  "@type": "Question",
                  "name": f.q,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.a
                  }
                }))
              }
            ]
          })}}
        />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Manrope',sans-serif;background:#fff;color:#1d1d1f;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        textarea{resize:none;font-family:'Noto Sans Devanagari','Manrope',sans-serif}
        textarea:focus{outline:none}
        .faq-item{border-bottom:1px solid #e8e8ed;padding:20px 0;cursor:pointer}
        .faq-item:last-child{border-bottom:none}
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
            🇳🇵 NEPAL&apos;S #1 NEPALI TEXT TO SPEECH
          </div>
          <h1 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(28px,5vw,52px)',fontWeight:800,letterSpacing:'-1.5px',lineHeight:1.1,marginBottom:20}}>
            Free Nepali Text to Speech<br />AI Voice Generator
          </h1>
          <p style={{fontSize:18,color:'#6e6e73',lineHeight:1.7,marginBottom:32,maxWidth:560,margin:'0 auto 32px'}}>
            Convert Nepali Devanagari text to professional AI voiceover in seconds. 20 natural voices for TikTok, YouTube, documentary, news, ads and more.
          </p>
          <Link href="/voiceover">
            <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'16px 40px',borderRadius:14,fontSize:17,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif',boxShadow:'0 8px 32px rgba(220,20,60,.25)'}}>
              Generate Nepali Voiceover Free →
            </button>
          </Link>
          <div style={{fontSize:13,color:'#999',marginTop:12}}>Nepal&apos;s only AI Nepali voice generator with 20 voices, emotion control and voice cloning</div>
        </div>
      </section>

      {/* FREE DEMO BOX */}
      <section style={{padding:'60px 24px',background:'#fff'}}>
        <div style={{maxWidth:760,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:32}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(220,20,60,.08)',border:'1px solid rgba(220,20,60,.15)',borderRadius:20,padding:'5px 14px',fontSize:12,fontWeight:700,color:'#DC143C',marginBottom:16}}>
              🎙️ TRY IT FREE — NO SIGNUP NEEDED
            </div>
            <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(20px,3vw,32px)',fontWeight:800,letterSpacing:'-0.8px',marginBottom:8}}>
              Hear a Nepali AI Voice Right Now
            </h2>
            <p style={{fontSize:15,color:'#6e6e73',lineHeight:1.65}}>
              Type up to 50 Devanagari characters and hear the difference instantly
            </p>
          </div>
          <DemoBox />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:'80px 24px',background:'#f5f5f7'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:48}}>
            How Nepali Text to Speech Works
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}>
            {[
              {step:'01',icon:'✍️',title:'Type Nepali text',desc:'Type or paste your Nepali script in Devanagari. Add emotion tags like [excited] or [whispers] for dynamic delivery.'},
              {step:'02',icon:'🎙️',title:'Choose your voice',desc:'Pick from 20 premium Nepali AI voices — male and female, covering every content style from documentary to energetic reels.'},
              {step:'03',icon:'⚡',title:'Generate in seconds',desc:'Click Generate and your professional Nepali voiceover is ready in under 8 seconds. Download as MP3.'},
              {step:'04',icon:'🎬',title:'Use anywhere',desc:'Import your MP3 into CapCut, Premiere Pro, DaVinci Resolve or upload directly to TikTok, YouTube or Instagram.'},
            ].map(s=>(
              <div key={s.step} style={{background:'#fff',borderRadius:16,padding:'24px'}}>
                <div style={{fontSize:11,fontWeight:800,color:'#DC143C',letterSpacing:'0.12em',marginBottom:12}}>{s.step}</div>
                <div style={{fontSize:24,marginBottom:10}}>{s.icon}</div>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:16,fontWeight:700,marginBottom:8}}>{s.title}</div>
                <div style={{fontSize:14,color:'#6e6e73',lineHeight:1.65}}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VOICES */}
      <section style={{padding:'80px 24px',background:'#fff'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:12}}>
            20 Premium Nepali AI Voices
          </h2>
          <p style={{textAlign:'center',color:'#6e6e73',fontSize:16,marginBottom:48,lineHeight:1.65}}>
            Every voice is trained specifically for natural Nepali speech — not a generic multilingual model
          </p>
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

      {/* FAQ */}
      <section style={{padding:'80px 24px',background:'#f5f5f7'}}>
        <div style={{maxWidth:760,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:48}}>
            Frequently Asked Questions
          </h2>
          <div style={{background:'#fff',borderRadius:20,padding:'8px 32px'}}>
            {FAQS.map((faq,i)=>(
              <div key={i} className="faq-item" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16}}>
                  <div style={{fontFamily:'Sora,sans-serif',fontSize:15,fontWeight:700,color:'#1d1d1f'}}>{faq.q}</div>
                  <div style={{fontSize:18,color:'#DC143C',flexShrink:0,transition:'transform .2s',transform:openFaq===i?'rotate(45deg)':'rotate(0deg)'}}>+</div>
                </div>
                {openFaq===i && (
                  <div style={{fontSize:14,color:'#6e6e73',lineHeight:1.75,marginTop:12}}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'80px 24px',background:'linear-gradient(160deg,#1d1d1f 0%,#2d1020 100%)',textAlign:'center'}}>
        <div style={{maxWidth:600,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(24px,4vw,40px)',fontWeight:800,color:'#fff',letterSpacing:'-1px',marginBottom:16}}>
            Start Generating Nepali Voiceover Free
          </h2>
          <p style={{fontSize:16,color:'rgba(255,255,255,.55)',lineHeight:1.7,marginBottom:36,maxWidth:440,margin:'0 auto 36px'}}>
            Nepal&apos;s only AI voice generator with 20 Nepali voices, emotion control, voice cloning and AI music — all in one platform.
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
          <Link href="/nepali-voice-generator" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Voice Generator</Link>
          <Link href="/nepali-tiktok-voiceover" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>TikTok Voiceover</Link>
          <Link href="/nepali-youtube-voiceover" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>YouTube Voiceover</Link>
          <a href="mailto:meroadaiofficial@gmail.com" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Contact</a>
        </div>
      </footer>
    </>
  )
}
