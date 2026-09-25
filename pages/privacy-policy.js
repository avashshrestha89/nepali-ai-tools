import Head from 'next/head'
import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://meroadai.com/privacy-policy" />
        <meta name="description" content="Swor AI Privacy Policy — how we collect, use, and protect your data. Swor AI is Nepal's #1 Nepali AI voiceover platform by MeroAD.ai." />
        <title>Privacy Policy — Swor AI by MeroAD.ai</title>
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
        <h1>Privacy Policy</h1>
        <p style={{fontSize:13,color:'#999',marginBottom:32}}>Last updated: September 25, 2026</p>

        <p>Swor AI ("we", "our", or "us"), a product of MeroAD.ai, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our platform at meroadai.com and sworai.com.</p>

        <h2>1. Information We Collect</h2>
        <p>We collect the following information when you use Swor AI:</p>
        <ul>
          <li><strong>Email address</strong> — used to create your account and send magic link login emails.</li>
          <li><strong>Generated audio content</strong> — the text you submit and the voiceovers we generate are temporarily stored for download purposes.</li>
          <li><strong>Usage data</strong> — credit usage, generation count, and account activity to manage your subscription.</li>
          <li><strong>Payment information</strong> — we do not store payment details. Payments are processed via eSewa, Khalti, and PayPal which have their own privacy policies.</li>
          <li><strong>IP address</strong> — used for rate limiting on our free preview feature only.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To create and manage your Swor AI account.</li>
          <li>To send magic link login emails via Resend.</li>
          <li>To generate Nepali AI voiceovers using ElevenLabs API.</li>
          <li>To manage your credit balance and activation status.</li>
          <li>To provide customer support via WhatsApp and email.</li>
          <li>To improve the platform and fix technical issues.</li>
        </ul>

        <h2>3. Data Storage</h2>
        <p>Your account data (email, credits, tier) is stored securely in Upstash Redis. Generated audio files are stored temporarily in Vercel Blob storage and are accessible only via your unique download link. We do not sell or share your personal data with third parties for marketing purposes.</p>

        <h2>4. Third-Party Services</h2>
        <p>Swor AI uses the following third-party services to operate:</p>
        <ul>
          <li><strong>ElevenLabs</strong> — AI voice generation API (elevenlabs.io)</li>
          <li><strong>Upstash Redis</strong> — secure database for account data (upstash.com)</li>
          <li><strong>Vercel</strong> — hosting and serverless functions (vercel.com)</li>
          <li><strong>Resend</strong> — transactional email delivery (resend.com)</li>
          <li><strong>Google Gemini API</strong> — AI script generation (google.com)</li>
          <li><strong>eSewa / Khalti / PayPal</strong> — payment processing</li>
        </ul>
        <p>Each of these services has their own privacy policy and data handling practices.</p>

        <h2>5. Cookies</h2>
        <p>Swor AI uses a single session cookie (<code>swor_session</code>) to keep you logged in for 30 days. This cookie is HttpOnly and Secure. We do not use tracking cookies or advertising cookies.</p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Request access to your personal data.</li>
          <li>Request deletion of your account and associated data.</li>
          <li>Update your email address by contacting us on WhatsApp.</li>
        </ul>
        <p>To exercise these rights, contact us at <a href="mailto:meroadaiofficial@gmail.com">meroadaiofficial@gmail.com</a> or WhatsApp <a href="https://wa.me/19255379425" target="_blank" rel="noreferrer">+1 925 537 9425</a>.</p>

        <h2>7. Data Retention</h2>
        <p>We retain your account data for as long as your account is active. Generated audio files are stored for a limited period and may be deleted automatically. If you request account deletion, we will remove your data within 7 business days.</p>

        <h2>8. Children's Privacy</h2>
        <p>Swor AI is not intended for children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.</p>

        <h2>9. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify users of significant changes via email or a notice on our platform. Continued use of Swor AI after changes constitutes acceptance of the updated policy.</p>

        <h2>10. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        <ul>
          <li>Email: <a href="mailto:meroadaiofficial@gmail.com">meroadaiofficial@gmail.com</a></li>
          <li>WhatsApp: <a href="https://wa.me/19255379425" target="_blank" rel="noreferrer">+1 925 537 9425</a></li>
          <li>Website: <a href="https://meroadai.com">meroadai.com</a></li>
          <li>Address: Kathmandu, Nepal</li>
        </ul>
      </main>

      {/* FOOTER */}
      <footer style={{borderTop:'1px solid #f0f0f0',padding:'24px',textAlign:'center'}}>
        <p style={{fontSize:12,color:'#999'}}>© 2026 Swor AI · MeroAD.ai · Kathmandu, Nepal · <Link href="/terms" style={{color:'#999'}}>Terms of Service</Link></p>
      </footer>
    </>
  )
}
