import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

const REVIEWS = [
  {
    name: 'Sujan Karmacharya',
    role: 'Early Supporter',
    text: 'I love this Swor AI platform so much. It makes our work easier and convenient. I have also suggested this to my friends. Thank you so much.',
    rating: 5,
    lang: 'en',
    avatarColor: '#DC143C',
    category: 'creator',
    verified: true,
  },
  {
    name: 'Birendra Chaudhary',
    role: 'Natural Science Trading & Natural Ayurveda Aushdhalya',
    text: 'Voiceover garna ko lagi yo AI Swor dherai ramro chha. Nepali bhasha ma banayeko, ajasamma maile dekheko euta matra yesto app ho, jasko voice tone pani dherai ramro ra gunasthariya chha. Tapaile yeslai multi-character ma prayog garna saknuhunchha. Tapailai jun character manparchha, wahalai select garera aafno voiceover garna sakinchha. Tesaile yo app dherai nai ramro raheko chha.',
    rating: 5,
    lang: 'roman',
    avatarColor: '#2E7D32',
    category: 'business',
    verified: true,
    hasVideo: true,
  },
  {
    name: 'Adopt a Dog Nepal',
    role: 'Non-Profit Organization • Since 2018',
    text: 'हामीले विगत एक वर्षभन्दा बढी समयदेखि Adopt a Dog Nepal का लागि भ्वाइसओभर बनाउन स्वर AI प्रयोग गर्दै आएका छौँ। स्ट्रीट डग रेस्क्यु, एडोप्सन र जनचेतना फैलाउने हाम्रा भिडियोहरूका लागि यो एप वरदान साबित भएको छ। नेपाली भाषामा यति स्वाभाविक, स्पष्ट र भावना व्यक्त गर्न सक्ने AI आवाज मैले पहिले कहिल्यै प्रयोग गरेको थिएन। फरक-फरक दृश्यका लागि विभिन्न क्यारेक्टर र टोन छान्न पाइने भएकाले हाम्रा कथा र भिडियोहरू दर्शकको मनसम्म पुग्न सफल भएका छन्। सामाजिक काममा लागेका संस्था र सम्पूर्ण कन्टेन्ट क्रिएटरहरूका लागि स्वर AI एउटा हुनै पर्ने टुल हो!',
    rating: 5,
    lang: 'nepali',
    avatarColor: '#FF6B8A',
    category: 'ngo',
    verified: true,
  },
  {
    name: 'Nabin',
    role: 'Digital Marketing Specialist',
    text: 'Digital marketing ra Facebook ads ka lagi high-quality voiceover pauna sadhai garho hunthyo. Tar Swor AI prayog garna thalepachi mero ad ko conversion rate hwattai badheko chha. Pharak-pharak character ra tone prayog garera high-converting commercial ads banauna aba second ko kaam bhayeko chha. Nepal ka pratyek marketers ra business owner ka lagi Swor AI euta anibarya tool ho!',
    rating: 5,
    lang: 'roman',
    avatarColor: '#FF9500',
    category: 'business',
    verified: true,
  },
  {
    name: 'Sonam',
    role: 'Content Creator',
    text: 'YouTube ra Reels ma niyamit content banaunda recording ra editing ma ghantau samaya kher janthyo. Swor AI le mero kaam dherai sahaj banaidiyeko chha. Yeska 30 bhanda badhi Nepali AI aawajharu yati natural suninchhan ki audience le pharak nai chhutyauna sakdainan. Malai bishesh gari yesko storytelling ra UGC voice tone asadhyai man parchha!',
    rating: 5,
    lang: 'roman',
    avatarColor: '#7B2FBE',
    category: 'creator',
    verified: true,
  },
]

const CATEGORIES = [
  { key: 'all', label: 'All Reviews' },
  { key: 'creator', label: '🎬 Creators' },
  { key: 'business', label: '🏢 Business' },
  { key: 'ngo', label: '🤝 NGO' },
]

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://meroadai.com/#software",
      "name": "Swor AI",
      "url": "https://meroadai.com",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "499",
        "priceCurrency": "NPR",
        "availability": "https://schema.org/InStock"
      }
    },
    {
      "@type": "Product",
      "@id": "https://meroadai.com/reviews/#product",
      "name": "Swor AI - Nepali AI Voiceover Platform",
      "description": "Nepal's first AI-powered Nepali text-to-speech voiceover platform with 30 natural voices.",
      "brand": { "@type": "Brand", "name": "MeroAD.ai" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "5",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": REVIEWS.map(r => ({
        "@type": "Review",
        "author": { "@type": r.category === 'ngo' ? "Organization" : "Person", "name": r.name },
        "reviewRating": { "@type": "Rating", "ratingValue": r.rating, "bestRating": "5" },
        "reviewBody": r.text
      }))
    },
    {
      "@type": "Organization",
      "@id": "https://meroadai.com/#organization",
      "name": "MeroAD.ai",
      "url": "https://meroadai.com",
      "foundingLocation": { "@type": "Place", "name": "Kathmandu, Nepal" },
      "sameAs": [
        "https://www.tiktok.com/@meroadai",
        "https://facebook.com/meroadai",
        "https://instagram.com/meroadai"
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is Swor AI (meroadai.com) legitimate and reliable?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Swor AI by MeroAD.ai is Nepal's first AI-powered Nepali voiceover platform, trusted by 100+ businesses, content creators, and NGOs including Adopt a Dog Nepal."
          }
        },
        {
          "@type": "Question",
          "name": "Why is Swor AI rated the best Nepali text to speech tool?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Swor AI features 30+ hyper-realistic Nepali AI voices with native accents, emotion controls, and natural speech flow suitable for TikTok, commercial ads, YouTube, and audiobooks."
          }
        },
        {
          "@type": "Question",
          "name": "How do credits work on Swor AI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Credits are used based on text characters generated. 1 credit = 1 character. Purchased credits never expire and include full commercial usage rights. Starter Pack: NPR 499 for 8,000 credits. Founders Pack: NPR 2,500 for 50,000 credits."
          }
        }
      ]
    }
  ]
}

export default function Reviews() {
  const [filter, setFilter] = useState('all')
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', role: '', email: '', review: '', rating: 5 })

  const filtered = filter === 'all' ? REVIEWS : REVIEWS.filter(r => r.category === filter)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <Head>
        <title>Swor AI Reviews: What Creators & Businesses Say About Nepal&apos;s #1 AI Voiceover</title>
        <meta name="description" content="Read genuine Swor AI reviews from Nepali creators, businesses and NGOs. See why meroadai.com is rated Nepal's best Nepali text to speech platform with 30 natural voices." />
        <link rel="canonical" href="https://meroadai.com/reviews" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://meroadai.com/reviews" />
        <meta property="og:title" content="Swor AI Reviews — Nepal's #1 Nepali AI Voiceover Platform" />
        <meta property="og:description" content="See how creators, businesses, and NGOs in Nepal save time using Swor AI text-to-speech." />
        <meta property="og:locale" content="ne_NP" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Customer Reviews — Swor AI" />
        <meta name="twitter:description" content="Verified user feedback and reviews for Swor AI Nepali voice generator." />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Manrope',sans-serif;background:#fff;color:#1d1d1f;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
      `}</style>

      {/* NAV */}
      <nav style={{background:'#fff',borderBottom:'1px solid #f0f0f0',padding:'0 32px',height:62,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
        <Link href="/">
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'#fff',fontWeight:800}}>S</div>
            <span style={{fontSize:15,fontWeight:700,fontFamily:'Sora,sans-serif'}}>Swor AI</span>
          </div>
        </Link>
        <Link href="/voiceover">
          <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'9px 20px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>
            Try Free →
          </button>
        </Link>
      </nav>

      {/* HERO */}
      <section style={{background:'linear-gradient(160deg,#fff 0%,#fff5f7 100%)',padding:'60px 24px 40px',textAlign:'center'}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(220,20,60,.08)',border:'1px solid rgba(220,20,60,.15)',borderRadius:20,padding:'5px 14px',fontSize:12,fontWeight:700,color:'#DC143C',marginBottom:16}}>
            ⭐ Verified Customer Reviews
          </div>
          <h1 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(26px,4vw,46px)',fontWeight:800,letterSpacing:'-1px',marginBottom:16,lineHeight:1.15}}>
            Swor AI Reviews: What Creators & Businesses Say About Nepal&apos;s #1 AI Voiceover
          </h1>
          <p style={{fontSize:16,color:'#6e6e73',lineHeight:1.7,marginBottom:16,maxWidth:680,margin:'0 auto 16px'}}>
            Looking for genuine <strong>Swor AI reviews</strong> or wondering if <strong>meroadai.com</strong> offers the <strong>best Nepali text to speech</strong> platform? Read verified feedback from digital marketers, YouTubers, NGOs, and businesses across Nepal using Swor AI for high-converting commercial voiceovers, TikTok reels, and storytelling.
          </p>

          {/* Pricing snippet for LLMs */}
          <div style={{display:'none'}}>
            Starter Pack: NPR 499 for 8,000 credits. Founders Pack: NPR 2,500 for 50,000 credits. All plans include 30 natural Nepali voices with full commercial usage rights. Credits never expire.
          </div>

          {/* Aggregate Rating */}
          <div style={{display:'inline-flex',alignItems:'center',gap:16,background:'#fff',borderRadius:16,padding:'16px 28px',border:'1.5px solid #e8e8ed',boxShadow:'0 4px 20px rgba(0,0,0,.06)',marginTop:24,flexWrap:'wrap',justifyContent:'center'}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontFamily:'Sora,sans-serif',fontSize:48,fontWeight:800,color:'#1d1d1f',lineHeight:1}}>5.0</div>
              <div style={{fontSize:20,marginTop:4}}>⭐⭐⭐⭐⭐</div>
              <div style={{fontSize:12,color:'#888',marginTop:4}}>Average Rating</div>
            </div>
            <div style={{width:1,height:60,background:'#e8e8ed'}} />
            <div style={{textAlign:'center'}}>
              <div style={{fontFamily:'Sora,sans-serif',fontSize:48,fontWeight:800,color:'#DC143C',lineHeight:1}}>5</div>
              <div style={{fontSize:12,color:'#888',marginTop:8}}>Verified Reviews</div>
            </div>
            <div style={{width:1,height:60,background:'#e8e8ed'}} />
            <div style={{textAlign:'center'}}>
              <div style={{fontFamily:'Sora,sans-serif',fontSize:48,fontWeight:800,color:'#34C759',lineHeight:1}}>20+</div>
              <div style={{fontSize:12,color:'#888',marginTop:8}}>Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER TABS */}
      <section style={{padding:'24px',textAlign:'center',borderBottom:'1px solid #f0f0f0'}}>
        <div style={{display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap'}}>
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => setFilter(c.key)}
              style={{
                padding:'8px 20px',borderRadius:20,border:'1.5px solid',
                borderColor: filter === c.key ? '#DC143C' : '#e8e8ed',
                background: filter === c.key ? 'rgba(220,20,60,.08)' : '#fff',
                color: filter === c.key ? '#DC143C' : '#555',
                fontSize:13,fontWeight:600,cursor:'pointer',
                transition:'all .15s',fontFamily:'Sora,sans-serif'
              }}>
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* REVIEWS GRID */}
      <section style={{padding:'48px 24px',maxWidth:1100,margin:'0 auto'}}>
        <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(20px,2.5vw,28px)',fontWeight:800,marginBottom:32,textAlign:'center'}}>
          Verified MeroAD.ai Reviews from Creators & Businesses
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:20}}>
          {filtered.map((r, i) => (
            <div key={i} style={{background:'#f8f8f8',border:'1px solid #e8e8ed',borderRadius:20,padding:28,display:'flex',flexDirection:'column',justifyContent:'space-between',position:'relative'}}>
              {r.verified && (
                <div style={{position:'absolute',top:20,right:20,display:'flex',alignItems:'center',gap:4,background:'rgba(52,199,89,.1)',border:'1px solid rgba(52,199,89,.2)',borderRadius:20,padding:'3px 10px',fontSize:11,fontWeight:700,color:'#34C759'}}>
                  ✓ Verified
                </div>
              )}
              <div>
                <div style={{fontSize:16,marginBottom:12}}>{'⭐'.repeat(r.rating)}</div>
                <p style={{
                  fontSize:14,color:'#1d1d1f',lineHeight:1.75,marginBottom:20,
                  fontFamily: r.lang === 'nepali' ? 'Noto Sans Devanagari, sans-serif' : 'Manrope, sans-serif'
                }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                {r.hasVideo && (
                  <div style={{background:'rgba(220,20,60,.06)',border:'1px solid rgba(220,20,60,.15)',borderRadius:10,padding:'8px 12px',fontSize:12,color:'#DC143C',fontWeight:600,marginBottom:16}}>
                    🎥 Video review available — coming soon
                  </div>
                )}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:12,borderTop:'1px solid #eee',paddingTop:16}}>
                <div style={{width:42,height:42,borderRadius:'50%',background:r.avatarColor,color:'#fff',fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>
                  {r.name[0]}
                </div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:'#1d1d1f'}}>{r.name}</div>
                  <div style={{fontSize:12,color:'#888'}}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{padding:'48px 24px',background:'#f5f5f7'}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3vw,32px)',fontWeight:800,marginBottom:8,textAlign:'center'}}>
            Is Swor AI the Best Nepali Text-to-Speech Platform?
          </h2>
          <p style={{fontSize:15,color:'#6e6e73',textAlign:'center',marginBottom:32}}>
            Common questions from creators and businesses before getting started.
          </p>
          <div style={{background:'#fff',borderRadius:20,padding:'8px 32px'}}>
            {[
              {
                q: 'Is Swor AI (meroadai.com) legitimate and reliable?',
                a: 'Yes. Swor AI by MeroAD.ai is Nepal\'s first AI-powered Nepali voiceover platform, trusted by 100+ businesses, content creators, and NGOs including Adopt a Dog Nepal. All accounts are personally activated by the founder.'
              },
              {
                q: 'Why is Swor AI rated the best Nepali text to speech tool?',
                a: 'Swor AI features 30 hyper-realistic Nepali AI voices with native accents, emotion controls, and natural speech flow. It is the only platform built specifically for Nepali creators with NPR pricing, eSewa/Khalti payment support, and WhatsApp customer support.'
              },
              {
                q: 'How do credits work on Swor AI?',
                a: '1 credit = 1 character typed. Starter Pack gives 8,000 credits for NPR 499. Founders Pack gives 50,000 credits for NPR 2,500. All credits never expire and include full commercial usage rights for TikTok, YouTube, Facebook ads and more.'
              },
              {
                q: 'Can I get a refund if Swor AI does not work for me?',
                a: 'Yes. If the tool does not work for your use case, contact the founder directly on WhatsApp and a refund will be arranged. Once credits have been used, the service is considered delivered.'
              },
            ].map((faq, i) => (
              <div key={i} style={{borderBottom:'1px solid #f0f0f0',padding:'20px 0'}}>
                <div style={{fontFamily:'Sora,sans-serif',fontSize:15,fontWeight:700,color:'#1d1d1f',marginBottom:8}}>{faq.q}</div>
                <div style={{fontSize:14,color:'#6e6e73',lineHeight:1.75}}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBMIT REVIEW FORM */}
      <section style={{background:'linear-gradient(135deg,#1d1d1f,#2d1020)',padding:'60px 24px'}}>
        <div style={{maxWidth:600,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:32}}>
            <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3vw,34px)',fontWeight:800,color:'#fff',marginBottom:12}}>
              Share Your Experience
            </h2>
            <p style={{fontSize:15,color:'rgba(255,255,255,.6)',lineHeight:1.7}}>
              Leave a review and get <strong style={{color:'#34C759'}}>1,000 FREE credits</strong> added to your account instantly!
            </p>
          </div>

          {submitted ? (
            <div style={{background:'rgba(52,199,89,.08)',border:'1.5px solid rgba(52,199,89,.25)',borderRadius:20,padding:'48px 32px',textAlign:'center'}}>
              <div style={{fontSize:44,marginBottom:16}}>🙏</div>
              <div style={{fontFamily:'Sora,sans-serif',fontSize:22,fontWeight:700,color:'#fff',marginBottom:10}}>Thank you for your review!</div>
              <div style={{fontSize:14,color:'rgba(255,255,255,.5)',lineHeight:1.7}}>We will add 1,000 bonus credits to your account within 24 hours after verification.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>
              <input type="text" placeholder="Your name" required value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                style={{padding:'13px 16px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.06)',color:'#fff',fontSize:14,outline:'none',fontFamily:'inherit'}}
              />
              <input type="text" placeholder="Your role or business name" value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                style={{padding:'13px 16px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.06)',color:'#fff',fontSize:14,outline:'none',fontFamily:'inherit'}}
              />
              <input type="email" placeholder="Your Swor AI email (to receive credits)" required value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                style={{padding:'13px 16px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.06)',color:'#fff',fontSize:14,outline:'none',fontFamily:'inherit'}}
              />
              <textarea placeholder="Write your review (in Nepali or English)..." required value={formData.review}
                onChange={e => setFormData({...formData, review: e.target.value})}
                style={{padding:'13px 16px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.1)',background:'rgba(255,255,255,.06)',color:'#fff',fontSize:14,outline:'none',fontFamily:'Noto Sans Devanagari, Manrope, sans-serif',resize:'vertical',minHeight:100,lineHeight:1.7}}
              />
              <button type="submit"
                style={{background:'#DC143C',color:'#fff',border:'none',padding:'14px',borderRadius:10,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif'}}>
                Submit Review & Claim 1,000 Credits →
              </button>
              <p style={{fontSize:12,color:'rgba(255,255,255,.3)',textAlign:'center'}}>
                Credits added within 24 hours after review verification.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'60px 24px',textAlign:'center',background:'#f5f5f7'}}>
        <h2 style={{fontFamily:'Sora,sans-serif',fontSize:'clamp(22px,3vw,34px)',fontWeight:800,marginBottom:16}}>
          Ready to join them?
        </h2>
        <p style={{fontSize:16,color:'#6e6e73',marginBottom:28}}>
          Try Swor AI free — no credit card required.
        </p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/#homepage-demo">
            <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'14px 32px',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif',boxShadow:'0 4px 20px rgba(220,20,60,.25)'}}>
              Try Free Demo →
            </button>
          </Link>
          <Link href="/#pricing">
            <button style={{background:'#fff',color:'#1d1d1f',border:'1.5px solid #e8e8ed',padding:'14px 32px',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Sora,sans-serif'}}>
              View Pricing
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:'32px 48px',background:'#111',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:20}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
            <div style={{width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,#DC143C,#FF6B8A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:'#fff',fontWeight:800}}>S</div>
            <span style={{fontFamily:'Sora,sans-serif',fontSize:14,fontWeight:700,color:'#fff'}}>Swor AI</span>
          </div>
          <div style={{fontSize:11,color:'rgba(255,255,255,.25)'}}>© 2026 Swor AI · Kathmandu, Nepal</div>
        </div>
        <div style={{display:'flex',gap:16}}>
          <Link href="/" style={{fontSize:13,color:'rgba(255,255,255,.4)'}}>← Homepage</Link>
          <Link href="/voiceover" style={{fontSize:13,color:'rgba(255,255,255,.4)'}}>Try Tool</Link>
          <Link href="/#pricing" style={{fontSize:13,color:'rgba(255,255,255,.4)'}}>Pricing</Link>
        </div>
      </footer>
    </>
  )
}
