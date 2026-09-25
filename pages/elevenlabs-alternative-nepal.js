import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function ElevenLabsAlternativeNepal() {
  const [openFaq, setOpenFaq] = useState(null)

  const FAQS = [
    {
      q: 'What is the best alternative to ElevenLabs for Nepali text to speech?',
      a: 'Swor AI is the top ElevenLabs alternative for Nepali creators. It offers 30+ natural Nepali voices, understands native Devanagari script natively, and allows users to purchase credits using local NPR payment methods without requiring an international credit card.',
    },
    {
      q: 'How can I generate AI voiceovers in Nepal without a USD card?',
      a: 'Swor AI allows local creators to bypass USD payments entirely. You can purchase one-time credit packs starting at NPR 499 using local payment gateways like eSewa, Khalti, or direct bank transfer, and the generated credits never expire.',
    },
    {
      q: 'Why does CapCut text to speech not sound natural in Nepali?',
      a: "CapCut's auto-caption and TTS features are heavily optimized for English and frequently struggle with accurate Indic script rendering on mobile devices, leading to missing characters or robotic mispronunciations. Swor AI uses dedicated emotion tags and native Devanagari processing to generate accurate, studio-quality audio that can be instantly exported and imported into CapCut.",
    },
    {
      q: 'Is Swor AI free to try?',
      a: 'Yes. Swor AI offers a free 200-character preview with no signup required. You can test any of the 30+ Nepali AI voices instantly at meroadai.com before purchasing any credit pack.',
    },
    {
      q: 'Can I use Swor AI voiceovers for commercial YouTube and TikTok content?',
      a: 'Yes. All audio generated on Swor AI includes a 100% commercial usage license. You can monetize your content across YouTube AdSense, TikTok Creator Rewards, Facebook in-stream ads, and brand sponsorships without copyright strikes.',
    },
    {
      q: 'Does Swor AI support emotion and tone control like ElevenLabs?',
      a: 'Yes. Swor AI supports 20+ emotion tags including [excited], [calm], [whispers], [serious], [aggressive], [sad], and more. Simply add the tag before your Nepali text to control vocal delivery — similar to ElevenLabs emotion controls but optimized specifically for Nepali voice models.',
    },
  ]

  const features = [
    { label: 'Primary Focus', swor: 'Native Nepali (Devanagari)', eleven: 'Global / English-first', murf: 'Global / English-first', capcut: 'Global Mobile Video' },
    { label: 'Nepali Voice Quality', swor: '30+ studio-grade voices', eleven: 'High but not Nepali-specific', murf: 'Robotic / Limited Nepali', capcut: 'Basic / Auto-generated' },
    { label: 'Payment Method', swor: 'NPR via eSewa, Khalti, Bank', eleven: 'USD (Int\'l Credit Card only)', murf: 'USD (Int\'l Credit Card only)', capcut: 'Free / Pro requires USD' },
    { label: 'Credit System', swor: 'Credits NEVER expire', eleven: 'Monthly reset (lose unused)', murf: 'Monthly reset (lose unused)', capcut: 'N/A' },
    { label: 'Emotion / Tone Tags', swor: '20+ emotion tags built-in', eleven: 'Yes (voice settings)', murf: 'Limited', capcut: 'None' },
    { label: 'AI Script Generator', swor: 'Built-in Gemini-powered', eleven: 'None', murf: 'None', capcut: 'Basic AI writer' },
    { label: 'Devanagari Rendering', swor: 'Flawless native processing', eleven: 'Good', murf: 'Fair', capcut: 'Inconsistent / Broken' },
    { label: 'Customer Support', swor: 'Direct WhatsApp (Nepal time)', eleven: 'Email ticket system', murf: 'Email ticket system', capcut: 'Community forums' },
    { label: 'Free Trial', swor: '200 chars free — no signup', eleven: '10,000 chars/month free', murf: 'Limited free plan', capcut: 'Free with watermark' },
    { label: 'Starting Price', swor: 'NPR 499 (~$4)', eleven: '$5/month (USD card required)', murf: '$19/month (USD card required)', capcut: 'Free / $7.99/month' },
  ]

  return (
    <>
      <Head>
        <link rel="canonical" href="https://meroadai.com/elevenlabs-alternative-nepal" />
        <meta name="description" content="Looking for the best ElevenLabs alternative for Nepali text to speech? Swor AI offers 30+ natural Nepali AI voices, NPR pricing via eSewa and Khalti, credits that never expire, and no USD card needed. Compare Swor AI vs ElevenLabs vs Murf AI vs CapCut TTS." />
        <meta name="keywords" content="elevenlabs alternative nepal, nepali text to speech, best nepali ai voice generator, nepali voiceover tool, esewa khalti ai voice, cheap elevenlabs alternative, nepali tts comparison" />
        <title>Best ElevenLabs Alternative for Nepal — Swor AI Nepali Text to Speech</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />

        {/* SoftwareApplication Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Swor AI",
          "url": "https://meroadai.com",
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Web",
          "description": "Nepal's first AI Nepali voice generator and text to speech platform. 30+ natural Nepali voices, NPR pricing via eSewa and Khalti, credits never expire.",
          "offers": {
            "@type": "Offer",
            "price": "499",
            "priceCurrency": "NPR"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "50"
          }
        })}} />

        {/* FAQPage Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQS.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        })}} />
      </Head>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Manrope', sans-serif; color: #1d1d1f; background: #fff; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
        .btn-primary { background: #DC143C; color: #fff; border: none; padding: 14px 28px; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-block; }
        .btn-primary:hover { background: #b01030; }
        .win { color: #34C759; font-weight: 700; }
        .lose { color: #999; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
        th { background: #1d1d1f; color: #fff; font-weight: 700; font-size: 13px; }
        tr:nth-child(even) { background: #f9f9f9; }
        td:first-child { font-weight: 600; color: #555; }
        td:nth-child(2) { color: #DC143C; font-weight: 700; }
        .faq-item { border-bottom: 1px solid #f0f0f0; padding: 20px 0; cursor: pointer; }
        @media (max-width: 768px) {
          th, td { padding: 8px 10px; font-size: 12px; }
          .hide-mobile { display: none; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{borderBottom:'1px solid #f0f0f0',padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{fontFamily:'Sora,sans-serif',fontSize:18,fontWeight:800,color:'#DC143C',textDecoration:'none'}}>SWOR AI</Link>
        <div style={{display:'flex',gap:12}}>
          <Link href="/voiceover"><button style={{background:'#f5f5f7',color:'#1d1d1f',border:'none',padding:'9px 20px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>Try Free</button></Link>
          <Link href="/#pricing"><button style={{background:'#DC143C',color:'#fff',border:'none',padding:'9px 20px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>View Pricing</button></Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{background:'linear-gradient(160deg,#fff 0%,#fff5f7 100%)',padding:'80px 24px 60px',textAlign:'center'}}>
        <div className="container">
          <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(220,20,60,.08)',border:'1px solid rgba(220,20,60,.15)',borderRadius:20,padding:'5px 16px',fontSize:12,fontWeight:700,color:'#DC143C',marginBottom:20}}>
            🇳🇵 Built specifically for Nepali creators
          </div>
          <h1 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(24px,4vw,52px)',fontWeight:800,letterSpacing:'-1.2px',lineHeight:1.15,marginBottom:20}}>
            The Best ElevenLabs Alternative<br/>
            for <span style={{color:'#DC143C'}}>Nepali Creators</span>
          </h1>
          <p style={{fontSize:18,color:'#6e6e73',lineHeight:1.75,maxWidth:680,margin:'0 auto 16px'}}>
            Studio-quality Nepali AI voiceover without the USD price tag. Pay with <strong style={{color:'#1d1d1f'}}>eSewa or Khalti</strong>, get <strong style={{color:'#1d1d1f'}}>30+ natural Nepali voices</strong>, and keep your credits forever.
          </p>
          <p style={{fontSize:15,color:'#6e6e73',lineHeight:1.75,maxWidth:680,margin:'0 auto 32px'}}>
            Swor AI is Nepal's fastest <strong style={{color:'#1d1d1f'}}>Nepali text to speech</strong> and <strong style={{color:'#1d1d1f'}}>Nepali AI voice generator</strong> platform. Turn raw Devanagari text into professional voiceovers in under 10 seconds — no USD card, no monthly fees, no unused credit waste.
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/voiceover"><button className="btn-primary">Try Free — No Signup Needed →</button></Link>
            <Link href="/#pricing"><button style={{background:'#f5f5f7',color:'#1d1d1f',border:'none',padding:'14px 28px',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer'}}>View Pricing</button></Link>
          </div>
          <p style={{fontSize:13,color:'#999',marginTop:16}}>Free 200-character preview · No credit card required · NPR pricing</p>
        </div>
      </section>

      {/* WHY SWOR AI */}
      <section style={{padding:'80px 24px',background:'#fff'}}>
        <div className="container">
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3vw,38px)',fontWeight:800,letterSpacing:'-0.8px',marginBottom:12,textAlign:'center'}}>
            Why Swor AI is the Best AI Voice Generator for Nepal
          </h2>
          <p style={{fontSize:16,color:'#6e6e73',textAlign:'center',marginBottom:48,maxWidth:600,margin:'0 auto 48px'}}>
            ElevenLabs is a great global platform. But it was not built for Nepal. Swor AI was.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24}}>
            {[
              {
                icon:'💳',
                title:'Native Nepali Payment — No USD Card',
                body:'ElevenLabs requires an international credit card. Most Nepali creators and businesses do not have one. Swor AI accepts eSewa, Khalti, and local bank transfer starting at NPR 499.',
              },
              {
                icon:'🎙️',
                title:'30+ Voices Built for Nepali Content',
                body:'ElevenLabs has thousands of voices but very few trained specifically on Nepali language patterns. Swor AI has 30+ voices curated for Nepali news, TikTok reels, storytelling, documentary, ASMR, and advertising.',
              },
              {
                icon:'♾️',
                title:'Credits That Never Expire',
                body:'ElevenLabs resets your credits every month — unused credits are lost. Swor AI credits never expire. Buy once, use whenever you want. Perfect for creators who produce content at their own pace.',
              },
              {
                icon:'🏷️',
                title:'Emotion Tags for Natural Nepali Delivery',
                body:'Add [excited], [calm], [whispers], [serious], [aggressive], and 15+ more emotion tags directly in your Devanagari script. Swor AI adjusts tone and pacing automatically — no manual voice settings needed.',
              },
              {
                icon:'🤖',
                title:'Built-in AI Nepali Script Generator',
                body:'Describe your content in English and Swor AI generates a complete, structured Nepali Devanagari script automatically. ElevenLabs has no script generation feature.',
              },
              {
                icon:'💬',
                title:'Direct WhatsApp Support in Nepal Time',
                body:'ElevenLabs support is a ticket system with international response times. Swor AI offers direct WhatsApp support — real humans, Nepal time, fast activation within 10 minutes of payment.',
              },
            ].map((f,i) => (
              <div key={i} style={{background:'#f8f8f8',borderRadius:16,padding:'24px',border:'1px solid #e8e8ed'}}>
                <div style={{fontSize:32,marginBottom:12}}>{f.icon}</div>
                <h3 style={{fontFamily:'Sora,sans-serif',fontSize:16,fontWeight:700,marginBottom:8,color:'#1d1d1f'}}>{f.title}</h3>
                <p style={{fontSize:14,color:'#6e6e73',lineHeight:1.7}}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section style={{padding:'80px 24px',background:'#f5f5f7'}}>
        <div className="container">
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3vw,38px)',fontWeight:800,letterSpacing:'-0.8px',marginBottom:12,textAlign:'center'}}>
            Feature Comparison: Swor AI vs The Competition
          </h2>
          <p style={{fontSize:16,color:'#6e6e73',textAlign:'center',marginBottom:48,maxWidth:600,margin:'0 auto 48px'}}>
            Swor AI vs ElevenLabs vs Murf AI vs CapCut TTS
          </p>
          <div style={{background:'#fff',borderRadius:20,overflow:'hidden',boxShadow:'0 4px 24px rgba(0,0,0,.06)'}}>
            <div style={{overflowX:'auto'}}>
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th style={{background:'#DC143C'}}>Swor AI ✓</th>
                    <th>ElevenLabs</th>
                    <th className="hide-mobile">Murf AI</th>
                    <th className="hide-mobile">CapCut TTS</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((f,i) => (
                    <tr key={i}>
                      <td>{f.label}</td>
                      <td style={{color:'#DC143C',fontWeight:700}}>{f.swor}</td>
                      <td className="lose">{f.eleven}</td>
                      <td className="hide-mobile lose">{f.murf}</td>
                      <td className="hide-mobile lose">{f.capcut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* VS SECTIONS */}
      <section style={{padding:'80px 24px',background:'#fff'}}>
        <div className="container">
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3vw,38px)',fontWeight:800,letterSpacing:'-0.8px',marginBottom:48,textAlign:'center'}}>
            Head-to-Head Comparisons
          </h2>

          {/* VS ElevenLabs */}
          <div style={{marginBottom:48,background:'#fff5f7',borderRadius:20,padding:'32px',border:'1px solid rgba(220,20,60,.12)'}}>
            <h3 style={{fontFamily:'Sora,sans-serif',fontSize:22,fontWeight:800,color:'#DC143C',marginBottom:12}}>
              Swor AI vs ElevenLabs: Price, Expiry, and Accessibility
            </h3>
            <p style={{fontSize:15,color:'#6e6e73',lineHeight:1.75,marginBottom:16}}>
              ElevenLabs is the global leader in AI voice synthesis and offers excellent voice quality. However, for Nepali creators, it has three critical barriers: it requires an international USD credit card, charges monthly subscriptions where unused credits are lost, and has no voices specifically trained for the Nepali language and Devanagari script.
            </p>
            <p style={{fontSize:15,color:'#6e6e73',lineHeight:1.75}}>
              Swor AI solves all three. Pay in NPR via eSewa or Khalti, buy credits once and keep them forever, and access 30+ voices specifically curated for Nepali news, storytelling, reels, documentary, and advertising content.
            </p>
          </div>

          {/* VS Murf */}
          <div style={{marginBottom:48,background:'#f0f7ff',borderRadius:20,padding:'32px',border:'1px solid rgba(25,118,210,.1)'}}>
            <h3 style={{fontFamily:'Sora,sans-serif',fontSize:22,fontWeight:800,color:'#1976D2',marginBottom:12}}>
              Swor AI vs Murf AI: Natural Emotion Tags for Nepali Storytelling
            </h3>
            <p style={{fontSize:15,color:'#6e6e73',lineHeight:1.75,marginBottom:16}}>
              Murf AI is designed primarily for English corporate presentations and e-learning. Its Nepali voice support is extremely limited and often sounds robotic on Devanagari text. It also requires a USD subscription starting at $19/month.
            </p>
            <p style={{fontSize:15,color:'#6e6e73',lineHeight:1.75}}>
              Swor AI offers 20+ emotion tags like [excited], [whispers], [sorrowful], and [confident] that work natively with Nepali Devanagari text — giving storytellers, news channels, and content creators precise control over vocal delivery that Murf AI simply cannot match for Nepali content.
            </p>
          </div>

          {/* VS CapCut */}
          <div style={{background:'#fffbf0',borderRadius:20,padding:'32px',border:'1px solid rgba(201,148,10,.15)'}}>
            <h3 style={{fontFamily:'Sora,sans-serif',fontSize:22,fontWeight:800,color:'#C9940A',marginBottom:12}}>
              Swor AI vs CapCut TTS: Reliable Indic Script Rendering
            </h3>
            <p style={{fontSize:15,color:'#6e6e73',lineHeight:1.75,marginBottom:16}}>
              CapCut's built-in text to speech feature is heavily optimized for English and Chinese. On mobile, Devanagari script frequently renders incorrectly — missing matras, broken conjuncts, and robotic mispronunciation of Nepali words are common complaints from Nepali creators.
            </p>
            <p style={{fontSize:15,color:'#6e6e73',lineHeight:1.75}}>
              Swor AI generates clean, accurate Nepali audio from native Devanagari processing and exports as MP3 — which you can import directly into CapCut for your video editing workflow. The best of both worlds.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{padding:'80px 24px',background:'#f5f5f7'}}>
        <div className="container" style={{textAlign:'center'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3vw,38px)',fontWeight:800,letterSpacing:'-0.8px',marginBottom:12}}>
            Simple NPR Pricing — No USD Card Needed
          </h2>
          <p style={{fontSize:16,color:'#6e6e73',marginBottom:48,maxWidth:560,margin:'0 auto 48px'}}>
            Pay with eSewa, Khalti, or bank transfer. Credits never expire.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:20,maxWidth:900,margin:'0 auto'}}>
            {[
              { name:'Starter Pack', price:'NPR 499', credits:'8,000 credits', desc:'Test your first videos this weekend.', badge:'' },
              { name:'Creator Pack', price:'NPR 999', credits:'20,000 credits', desc:'Post consistently for a full month.', badge:'⭐ Most Popular' },
              { name:'Founders Lifetime', price:'NPR 2,500', credits:'50,000 credits', desc:'One payment. Lifetime access. Never pay again.', badge:'🔥 Best Value' },
            ].map((p,i) => (
              <div key={i} style={{background:'#fff',borderRadius:20,padding:'28px 24px',border: i===1 ? '2px solid #DC143C':'1.5px solid #e8e8ed',position:'relative',boxShadow: i===1 ? '0 8px 32px rgba(220,20,60,.12)':'none'}}>
                {p.badge && <div style={{position:'absolute',top:-14,left:'50%',transform:'translateX(-50%)',background:'#DC143C',color:'#fff',fontSize:11,fontWeight:700,padding:'4px 14px',borderRadius:20,whiteSpace:'nowrap'}}>{p.badge}</div>}
                <div style={{fontSize:13,fontWeight:700,color:'#6e6e73',marginBottom:8}}>{p.name}</div>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:34,fontWeight:800,color:'#1d1d1f',marginBottom:4}}>{p.price}</div>
                <div style={{fontSize:14,color:'#DC143C',fontWeight:700,marginBottom:12}}>{p.credits}</div>
                <div style={{fontSize:13,color:'#6e6e73',marginBottom:20,lineHeight:1.6}}>{p.desc}</div>
                <a href={`https://wa.me/19255379425?text=Hi! I want to buy the Swor AI ${p.name} (${p.price}). Please confirm.`} target="_blank" rel="noreferrer" style={{display:'block',background:'#25D366',color:'#fff',padding:'11px',borderRadius:10,fontSize:14,fontWeight:700,textDecoration:'none',textAlign:'center'}}>
                  💬 Buy via WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        itemScope
        itemType="https://schema.org/FAQPage"
        style={{padding:'80px 24px',background:'#fff'}}>
        <div className="container" style={{maxWidth:760}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3vw,38px)',fontWeight:800,letterSpacing:'-0.8px',marginBottom:12,textAlign:'center'}}>
            Frequently Asked Questions
          </h2>
          <p style={{fontSize:16,color:'#6e6e73',textAlign:'center',marginBottom:48}}>
            Everything about Nepali AI voice generators and ElevenLabs alternatives.
          </p>
          <div style={{background:'#f8f8f8',borderRadius:20,padding:'8px 32px'}}>
            {FAQS.map((faq,i) => (
              <article
                key={i}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                className="faq-item"
                onClick={() => setOpenFaq(openFaq===i?null:i)}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16}}>
                  <h3 itemProp="name" style={{fontFamily:'Sora,sans-serif',fontSize:15,fontWeight:700,color:'#1d1d1f',margin:0}}>{faq.q}</h3>
                  <div style={{fontSize:18,color:'#DC143C',flexShrink:0,transition:'transform .2s',transform:openFaq===i?'rotate(45deg)':'rotate(0deg)'}}>+</div>
                </div>
                {openFaq===i && (
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p itemProp="text" style={{fontSize:14,color:'#6e6e73',lineHeight:1.75,marginTop:12,marginBottom:0}}>{faq.a}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'80px 24px',background:'linear-gradient(135deg,#1d1d1f,#2d1020)',textAlign:'center'}}>
        <div className="container">
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3vw,38px)',fontWeight:800,color:'#fff',marginBottom:16}}>
            Ready to switch from ElevenLabs?
          </h2>
          <p style={{fontSize:16,color:'rgba(255,255,255,.6)',marginBottom:32,maxWidth:480,margin:'0 auto 32px'}}>
            Try Swor AI free — 200 characters, no signup, no USD card needed.
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/voiceover"><button className="btn-primary" style={{fontSize:16,padding:'16px 32px'}}>Try Free Now →</button></Link>
            <a href="https://wa.me/19255379425" target="_blank" rel="noreferrer"><button style={{background:'#25D366',color:'#fff',border:'none',padding:'16px 32px',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer'}}>💬 WhatsApp Us</button></a>
          </div>
          <p style={{fontSize:13,color:'rgba(255,255,255,.3)',marginTop:16}}>meroadai.com · sworai.com · WhatsApp: +1 925 537 9425</p>
        </div>
      </section>
    </>
  )
}
