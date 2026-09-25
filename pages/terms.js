import Head from 'next/head'
import Link from 'next/link'

export default function Terms() {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://meroadai.com/terms" />
        <meta name="description" content="Swor AI Terms of Service — credit policy, commercial usage rights, refund policy, and acceptable use. Swor AI is Nepal's #1 Nepali AI voiceover platform." />
        <title>Terms of Service — Swor AI by MeroAD.ai</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Manrope', sans-serif; color: #1d1d1f; background: #fff; }
        h1 { font-family: 'Sora', sans-serif; font-size: clamp(24px, 3vw, 40px); font-weight: 800; letter-spacing: -0.8px; margin-bottom: 8px; }
        h2 { font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 700; color: #DC143C; margin: 32px 0 12px; }
        p { font-size: 15px; color: #444; line-height: 1.8; margin-bottom: 12px; }
        ul { margin: 8px 0 16px 20px; }
        ul li { font-size: 15px; color: #444; line-height: 1.8; margin-bottom: 6px; }
        a { color: #DC143C; }
      `}</style>

      {/* NAV */}
      <nav style={{borderBottom:'1px solid #f0f0f0',padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{fontFamily:'Sora,sans-serif',fontSize:18,fontWeight:800,color:'#DC143C',textDecoration:'none'}}>SWOR AI</Link>
        <Link href="/voiceover"><button style={{background:'#DC143C',color:'#fff',border:'none',padding:'9px 20px',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>Try Free →</button></Link>
      </nav>

      {/* CONTENT */}
      <main style={{maxWidth:760,margin:'0 auto',padding:'60px 24px 80px'}}>
        <h1>Terms of Service</h1>
        <p style={{fontSize:13,color:'#999',marginBottom:32}}>Last updated: September 25, 2026</p>

        <p>Welcome to Swor AI, a product of MeroAD.ai. By accessing or using our platform at meroadai.com and sworai.com, you agree to these Terms of Service. Please read them carefully before using our services.</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By creating an account or using Swor AI, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our platform.</p>

        <h2>2. Description of Service</h2>
        <p>Swor AI is a Nepali AI voice generator and text to speech platform that allows users to convert Nepali Devanagari text into professional audio voiceovers using a credit-based system. Additional features include AI music generation, Nepali subtitle generation, and an AI script generator.</p>

        <h2>3. Account Registration</h2>
        <ul>
          <li>You must provide a valid email address to create an account.</li>
          <li>You are responsible for maintaining the security of your account.</li>
          <li>One account per person or organization. Multiple accounts are not permitted.</li>
          <li>You must be at least 13 years old to use Swor AI.</li>
          <li>Accounts are non-transferable.</li>
        </ul>

        <h2>4. Credits and Payment</h2>
        <ul>
          <li>Swor AI operates on a credit-based system. 1 credit = 1 character of Nepali text.</li>
          <li>Credits are deducted only after a successful voiceover generation.</li>
          <li>Credits on all paid packs never expire — you keep them until you use them.</li>
          <li>Credit packs are non-refundable once activated.</li>
          <li>Payments are accepted via eSewa, Khalti, bank transfer, and PayPal.</li>
          <li>All NPR prices are inclusive of any applicable taxes.</li>
          <li>We reserve the right to change pricing with reasonable notice.</li>
          <li>Credits cannot be transferred between accounts.</li>
        </ul>

        <h2>5. Commercial Usage Rights</h2>
        <p>All audio generated on Swor AI includes full commercial usage rights. You may use the generated voiceovers for:</p>
        <ul>
          <li>YouTube monetization (AdSense, sponsorships, memberships)</li>
          <li>TikTok Creator Rewards and brand partnerships</li>
          <li>Facebook in-stream ads and sponsored content</li>
          <li>Instagram Reels and Stories monetization</li>
          <li>Commercial advertisements and marketing campaigns</li>
          <li>Broadcast media including radio and television</li>
          <li>Corporate presentations and internal communications</li>
          <li>Educational content and e-learning platforms</li>
        </ul>
        <p>The AI voices used on Swor AI are licensed from ElevenLabs and are cleared for commercial use under their terms of service.</p>

        <h2>6. Acceptable Use Policy</h2>
        <p>You agree NOT to use Swor AI to generate content that:</p>
        <ul>
          <li>Is defamatory, harassing, threatening, or abusive toward any individual or group.</li>
          <li>Impersonates real individuals, public figures, or organizations without consent.</li>
          <li>Spreads misinformation, fake news, or deliberately misleading content.</li>
          <li>Violates any applicable law or regulation in Nepal or internationally.</li>
          <li>Contains hate speech, discrimination, or incitement to violence.</li>
          <li>Is sexually explicit or obscene.</li>
          <li>Infringes on the intellectual property rights of others.</li>
          <li>Is used for spam, phishing, or fraudulent purposes.</li>
        </ul>
        <p>Violation of this policy may result in immediate account suspension without refund.</p>

        <h2>7. Intellectual Property</h2>
        <p>The Swor AI platform, brand, logo, and underlying technology are owned by MeroAD.ai. You retain ownership of the text content you submit. The AI-generated audio output is licensed to you for commercial use as described in Section 5. You may not resell, sublicense, or redistribute the Swor AI platform or its underlying technology.</p>

        <h2>8. Refund Policy</h2>
        <p>Due to the digital nature of our service:</p>
        <ul>
          <li>Credit packs are non-refundable once activated to your account.</li>
          <li>If you experience a technical issue that caused incorrect credit deduction, contact us within 7 days via WhatsApp for a credit restoration review.</li>
          <li>Refunds may be considered at our sole discretion for exceptional circumstances such as double payment or non-delivery of credits.</li>
          <li>All refund requests must be submitted to meroadaiofficial@gmail.com with payment proof.</li>
        </ul>

        <h2>9. Service Availability</h2>
        <p>We strive to maintain 99% uptime but do not guarantee uninterrupted service. We are not liable for any loss or damage caused by temporary service unavailability, including but not limited to scheduled maintenance, API outages from third-party providers (ElevenLabs, Vercel, Upstash), or force majeure events.</p>

        <h2>10. Limitation of Liability</h2>
        <p>Swor AI and MeroAD.ai shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our maximum liability to you for any claim shall not exceed the amount you paid for the credit pack in the most recent transaction.</p>

        <h2>11. Termination</h2>
        <p>We reserve the right to suspend or terminate accounts that violate these Terms of Service without prior notice or refund. You may cancel your account at any time by contacting us via WhatsApp or email. Unused credits are forfeited upon account termination due to policy violations.</p>

        <h2>12. Changes to Terms</h2>
        <p>We may update these Terms of Service at any time. We will notify users of significant changes via email or a notice on our platform. Continued use of Swor AI after changes constitutes acceptance of the updated terms.</p>

        <h2>13. Governing Law</h2>
        <p>These Terms of Service are governed by the laws of Nepal. Any disputes arising from these terms shall be resolved through good-faith negotiation. If negotiation fails, disputes shall be subject to the jurisdiction of the courts of Kathmandu, Nepal.</p>

        <h2>14. Contact Us</h2>
        <p>If you have any questions about these Terms of Service, please contact us:</p>
        <ul>
          <li>Email: <a href="mailto:meroadaiofficial@gmail.com">meroadaiofficial@gmail.com</a></li>
          <li>WhatsApp: <a href="https://wa.me/19255379425" target="_blank" rel="noreferrer">+1 925 537 9425</a></li>
          <li>Website: <a href="https://meroadai.com">meroadai.com</a></li>
          <li>Address: Kathmandu, Nepal</li>
        </ul>
      </main>

      {/* FOOTER */}
      <footer style={{borderTop:'1px solid #f0f0f0',padding:'24px',textAlign:'center'}}>
        <p style={{fontSize:12,color:'#999'}}>© 2026 Swor AI · MeroAD.ai · Kathmandu, Nepal · <Link href="/privacy-policy" style={{color:'#999'}}>Privacy Policy</Link></p>
      </footer>
    </>
  )
}
