import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

const FAQS = [
  {
    q: 'What is Nepali text to speech?',
    a: 'Nepali text to speech (TTS) is AI technology that converts written Nepali (Devanagari) text into natural-sounding spoken audio. Swor AI uses advanced ElevenLabs technology to generate the most realistic Nepali voices available — far more natural than traditional robotic TTS systems.'
  },
  {
    q: 'How do I convert Nepali text to audio?',
    a: 'With Swor AI, it takes 3 steps: (1) Type or paste your Nepali text, (2) Choose from 15 premium Nepali voices, (3) Click Generate and download your MP3 in seconds. No recording equipment, no studio, no voice artist needed.'
  },
  {
    q: 'Is Swor AI free to use?',
    a: 'Yes — you get 2 free voiceover generations without signing up. Register for free beta access to get 10 full generations. Paid credit packs start at NPR 499 for ongoing professional use.'
  },
  {
    q: 'What is the difference between Swor AI and other text to speech tools?',
    a: 'Most global TTS tools do not support Nepali language natively. Swor AI is built specifically for Nepali — with 15 voices designed for Nepali content creators, businesses, and brands. All pricing is in NPR with eSewa and Khalti payment support.'
  },
  {
    q: 'Can I use Swor AI voiceovers for commercial content?',
    a: 'Yes. All voiceovers generated on Swor AI are yours to use commercially — for TikTok videos, YouTube, Instagram Reels, business advertisements, NGO awareness campaigns, and more.'
  },
  {
    q: 'What Nepali voices are available?',
    a: 'Swor AI has 15 premium Nepali voices including Priyanka (Romantic & Elegant), Vanishree (Professional News Style), Dhurundhar (Deep & Commanding), Anika (Sweet & Lively for Reels), Rudra (Intense & Romantic), and 10 more. Both male and female voices available.'
  },
  {
    q: 'Does Swor AI support Devanagari script?',
    a: 'Yes. Swor AI fully supports Devanagari Nepali script. Type your text in नेपाली and the AI generates natural, fluent speech — correctly pronouncing all Nepali words and characters.'
  },
  {
    q: 'Can I generate Nepali subtitles too?',
    a: 'Yes — Swor AI also generates automatic Nepali subtitles from any video or audio file. Upload your video and get a .SRT subtitle file in Devanagari or Romanized Nepali, ready to import into CapCut or any video editor.'
  },
]

export default function NepaliTextToSpeech() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>Free Nepali Text to Speech | Convert नेपाली Text to Audio — Swor AI</title>
        <meta name="description" content="Free Nepali text to speech converter. Type नेपाली text and get realistic AI voiceover in seconds. 15 premium voices for TikTok, YouTube, business ads. Try free — no signup needed." />
        <meta name="keywords" content="Nepali text to speech, नेपाली text to speech, Nepali TTS, Nepali voice generator, Nepali AI voiceover, नेपाली voiceover, convert Nepali text to audio, Nepali speech synthesis" />
        <link rel="canonical" href="https://meroadai.com/nepali-text-to-speech" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Manrope',sans-serif;background:#fff;color:#1d1d1f;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        .faq-item{border-bottom:1px solid #f0f0f0;padding:20px 0;cursor:pointer}
        .faq-q{display:flex;justify-content:space-between;align-items:center;gap:16px}
        .faq-icon{width:28px;height:28px;border-radius:50%;background:#f5f5f7;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;transition:all .2s}
        .faq-a{font-size:15px;color:#6e6e73;line-height:1.75;padding-top:12px;max-width:680px}
        .step-card{background:#f5f5f7;border-radius:16px;padding:24px;flex:1}
        .voice-pill{background:#fff;border:1.5px solid #f0f0f0;borderRadius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px;font-size:13px}
      `}</style>

      {/* NAV */}
      <nav style={{position:'sticky',top:0,background:'rgba(255,255,255,.95)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(0,0,0,.06)',padding:'0 32px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',zIndex:100}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'#fff',fontWeight:800}}>M</div>
          <span style={{fontSize:15,fontWeight:700,fontFamily:'Sora,sans-serif'}}>MeroAD.ai</span>
        </Link>
        <Link href="/tool">
          <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'9px 20px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif'}}>
            Try Free →
          </button>
        </Link>
      </nav>

      {/* HERO */}
      <section style={{background:'linear-gradient(160deg,#fff 0%,#fff5f7 50%,#fff 100%)',padding:'80px 24px 60px',textAlign:'center'}}>
        <div style={{maxWidth:760,margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(220,20,60,.08)',border:'1px solid rgba(220,20,60,.15)',borderRadius:20,padding:'5px 14px',fontSize:12,fontWeight:700,color:'#DC143C',marginBottom:24,letterSpacing:'0.06em'}}>
            🎙️ FREE NEPALI TEXT TO SPEECH
          </div>
          <h1 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(28px,5vw,52px)',fontWeight:800,letterSpacing:'-1.5px',lineHeight:1.1,marginBottom:20,color:'#1d1d1f'}}>
            Convert{' '}
            <span style={{fontFamily:'Noto Sans Devanagari,sans-serif',color:'#DC143C'}}>नेपाली</span>
            {' '}Text to Speech<br />
            in Seconds
          </h1>
          <p style={{fontSize:18,color:'#6e6e73',lineHeight:1.7,marginBottom:12,maxWidth:560,margin:'0 auto 12px'}}>
            Nepal's most realistic AI Nepali voice generator. Type your Nepali text and get a professional voiceover instantly — no microphone, no studio, no voice artist.
          </p>
          <p style={{fontSize:14,color:'#DC143C',fontWeight:600,marginBottom:36}}>
            ✓ Free to try &nbsp;·&nbsp; ✓ 15 premium Nepali voices &nbsp;·&nbsp; ✓ Download MP3 instantly
          </p>
          <Link href="/tool">
            <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'16px 40px',borderRadius:14,fontSize:17,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif',boxShadow:'0 8px 32px rgba(220,20,60,.25)',marginBottom:12}}>
              Convert Nepali Text to Speech Free →
            </button>
          </Link>
          <div style={{fontSize:13,color:'#999',marginTop:8}}>No signup required for first 2 generations</div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:'80px 24px',background:'#fff'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:12}}>
            How to Convert Nepali Text to Audio
          </h2>
          <p style={{textAlign:'center',color:'#6e6e73',fontSize:16,marginBottom:48,lineHeight:1.6}}>
            Three simple steps — from typed text to professional Nepali voiceover in under 30 seconds.
          </p>
          <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
            {[
              {step:'01',title:'Type your Nepali text',desc:'Paste or type up to 500 characters of Nepali text in Devanagari script. Works with any Nepali content — ads, videos, announcements, vlogs.',icon:'✍️'},
              {step:'02',title:'Choose your Nepali voice',desc:'Pick from 15 premium AI Nepali voices — male and female, romantic to documentary, news style to casual social media. Preview any voice before generating.',icon:'🎙️'},
              {step:'03',title:'Download your MP3',desc:'Click Generate. Your professional Nepali voiceover is ready in 8 seconds. Download as MP3 and import directly into CapCut, Premiere Pro, or any video editor.',icon:'⬇️'},
            ].map(s=>(
              <div key={s.step} className="step-card" style={{minWidth:220}}>
                <div style={{fontSize:11,fontWeight:800,color:'#DC143C',letterSpacing:'0.12em',marginBottom:12}}>{s.step}</div>
                <div style={{fontSize:24,marginBottom:10}}>{s.icon}</div>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:16,fontWeight:700,marginBottom:8}}>{s.title}</div>
                <div style={{fontSize:14,color:'#6e6e73',lineHeight:1.65}}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY SWOR AI */}
      <section style={{padding:'80px 24px',background:'#f5f5f7'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:12}}>
            Why Swor AI is Nepal's Best Nepali Text to Speech Tool
          </h2>
          <p style={{textAlign:'center',color:'#6e6e73',fontSize:16,marginBottom:48,lineHeight:1.6,maxWidth:560,margin:'0 auto 48px'}}>
            Most global TTS tools treat Nepali as an afterthought. Swor AI is built exclusively for Nepali creators and businesses.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16}}>
            {[
              {icon:'🇳🇵',title:'Built for Nepali — not translated',desc:'Unlike Google TTS or ElevenLabs used directly, Swor AI is designed specifically for Nepali content. Every voice is trained and tested for natural Nepali pronunciation.'},
              {icon:'🎭',title:'15 distinct Nepali voices',desc:'From deep documentary narrators to sweet social media personalities. Male and female voices covering every content style — something no other Nepal tool offers.'},
              {icon:'⚡',title:'8 seconds to generate',desc:'Professional Nepali voiceover in the time it takes to pour a cup of tea. No waiting for a voice artist to reply, no booking studios, no revision delays.'},
              {icon:'💰',title:'Priced in NPR for Nepal',desc:'Pay with eSewa, Khalti, IME Pay, or bank transfer. Starting at NPR 499 — that\'s less than hiring a voice artist for a single 30-second script.'},
              {icon:'📱',title:'Made for TikTok & Reels',desc:'500 characters per generation — perfect for TikTok voiceovers, Instagram Reels narration, YouTube Shorts, and Facebook video ads.'},
              {icon:'📝',title:'Nepali subtitles included free',desc:'Upload any video and get accurate Nepali subtitles in Devanagari or Romanized script — ready for CapCut import. Subtitle generation is always free.'},
            ].map(f=>(
              <div key={f.title} style={{background:'#fff',borderRadius:16,padding:'24px 22px',border:'1.5px solid #e8e8ed'}}>
                <div style={{fontSize:28,marginBottom:12}}>{f.icon}</div>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:15,fontWeight:700,marginBottom:8,color:'#1d1d1f'}}>{f.title}</div>
                <div style={{fontSize:13,color:'#6e6e73',lineHeight:1.65}}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section style={{padding:'80px 24px',background:'#fff'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:48}}>
            Who Uses Nepali Text to Speech?
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>
            {[
              {emoji:'📱',who:'TikTok & Reels Creators',use:'Add professional Nepali narration to dance videos, travel vlogs, food content, and lifestyle reels without recording your own voice.'},
              {emoji:'🏢',who:'Nepal Businesses & Brands',use:'Create professional Nepali voiceovers for product ads, promotional videos, and social media content at 75% less cost than hiring a voice artist.'},
              {emoji:'🎓',who:'Education & Coaching Centers',use:'Generate Nepali audio for online courses, Lok Sewa prep materials, tutorial videos, and explainer content quickly and affordably.'},
              {emoji:'🏔️',who:'Tourism & Travel Companies',use:'Create Nepali narration for destination videos, trekking package promos, and travel guides targeting Nepal diaspora and domestic tourists.'},
              {emoji:'🏥',who:'Healthcare & NGOs',use:'Produce Nepali health awareness campaigns, community announcements, and public service messages with a credible, professional voice.'},
              {emoji:'🎬',who:'Video Editors & Agencies',use:'Offer Nepali voiceover as a service to your clients. Generate professional audio in seconds instead of coordinating with freelance voice artists.'},
            ].map(u=>(
              <div key={u.who} style={{background:'#f5f5f7',borderRadius:16,padding:'22px 20px'}}>
                <div style={{fontSize:28,marginBottom:10}}>{u.emoji}</div>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:14,fontWeight:700,marginBottom:8,color:'#1d1d1f'}}>{u.who}</div>
                <div style={{fontSize:13,color:'#6e6e73',lineHeight:1.65}}>{u.use}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{padding:'80px 24px',background:'#f5f5f7'}}>
        <div style={{maxWidth:760,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3.5vw,36px)',fontWeight:800,textAlign:'center',letterSpacing:'-0.8px',marginBottom:12}}>
            Frequently Asked Questions
          </h2>
          <p style={{textAlign:'center',color:'#6e6e73',fontSize:16,marginBottom:48}}>
            Everything you need to know about Nepali text to speech.
          </p>
          <div style={{background:'#fff',borderRadius:20,padding:'8px 32px'}}>
            {FAQS.map((faq,i)=>(
              <div key={i} className="faq-item" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                <div className="faq-q">
                  <div style={{fontFamily:'Sora,sans-serif',fontSize:16,fontWeight:700,color:'#1d1d1f',lineHeight:1.4}}>{faq.q}</div>
                  <div className="faq-icon" style={{background:openFaq===i?'#DC143C':'#f5f5f7',color:openFaq===i?'#fff':'#555'}}>
                    {openFaq===i?'−':'+'}
                  </div>
                </div>
                {openFaq===i&&(
                  <div className="faq-a">{faq.a}</div>
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
            Try Nepali Text to Speech Free
          </h2>
          <p style={{fontSize:16,color:'rgba(255,255,255,.55)',lineHeight:1.7,marginBottom:36,maxWidth:440,margin:'0 auto 36px'}}>
            Join hundreds of Nepali creators and businesses already using Swor AI. First 2 generations free — no signup required.
          </p>
          <Link href="/tool">
            <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'16px 40px',borderRadius:14,fontSize:17,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif',boxShadow:'0 8px 32px rgba(220,20,60,.3)',marginBottom:16}}>
              Convert Nepali Text to Speech Now →
            </button>
          </Link>
          <div style={{fontSize:13,color:'rgba(255,255,255,.3)',marginTop:12}}>
            meroadai.com · Built in Kathmandu, Nepal 🇳🇵
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:'32px 24px',background:'#111',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
        <div style={{fontSize:12,color:'rgba(255,255,255,.25)'}}>© 2026 Swor AI · A product of MeroAD.ai · Kathmandu, Nepal</div>
        <div style={{display:'flex',gap:12}}>
          <Link href="/" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Home</Link>
          <Link href="/tool" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Try Tool</Link>
          <a href="mailto:meroadaiofficial@gmail.com" style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Contact</a>
        </div>
      </footer>
    </>
  )
}
