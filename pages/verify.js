import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

export default function Verify() {
  const router = useRouter()
  const { token } = router.query
  const [status, setStatus] = useState('loading') // loading | success | error

  useEffect(() => {
    if (!token) return

    async function verifyToken() {
      try {
        const res = await fetch(`/api/auth/verify?token=${token}`)
        const data = await res.json()

        if (data.success) {
          setStatus('success')
          setTimeout(() => router.push('/tool'), 2000)
        } else {
          setStatus('error')
        }
      } catch {
        setStatus('error')
      }
    }

    verifyToken()
  }, [token])

  return (
    <>
      <Head>
        <title>Accessing Swor AI...</title>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Sora',sans-serif;background:#0E0E16;min-height:100vh;display:flex;align-items:center;justify-content:center;color:#fff}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div style={{textAlign:'center',padding:'40px 24px',animation:'fadeUp .5s ease'}}>

        {/* Logo */}
        <div style={{fontSize:36,fontWeight:800,background:'linear-gradient(135deg,#DC143C,#FF9500)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',letterSpacing:'3px',marginBottom:8}}>
          SWOR AI
        </div>
        <div style={{fontSize:12,color:'rgba(255,255,255,.35)',marginBottom:48,letterSpacing:'0.06em'}}>
          A PRODUCT OF MEROAD.AI
        </div>

        {status === 'loading' && (
          <div>
            <div style={{width:48,height:48,border:'3px solid rgba(220,20,60,.2)',borderTopColor:'#DC143C',borderRadius:'50%',margin:'0 auto 20px',animation:'spin 0.8s linear infinite'}} />
            <div style={{fontSize:18,fontWeight:600,color:'#fff',marginBottom:8}}>Verifying your link...</div>
            <div style={{fontSize:14,color:'rgba(255,255,255,.4)'}}>Just a moment</div>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{fontSize:52,marginBottom:20}}>✅</div>
            <div style={{fontSize:22,fontWeight:700,color:'#fff',marginBottom:10}}>You're in!</div>
            <div style={{fontSize:15,color:'rgba(255,255,255,.5)',marginBottom:8}}>Redirecting to the tool...</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,.3)'}}>
              If you're not redirected automatically,{' '}
              <Link href="/tool" style={{color:'#DC143C'}}>click here</Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{fontSize:52,marginBottom:20}}>⚠️</div>
            <div style={{fontSize:22,fontWeight:700,color:'#fff',marginBottom:10}}>Link expired or invalid</div>
            <div style={{fontSize:15,color:'rgba(255,255,255,.5)',marginBottom:32,lineHeight:1.7}}>
              Magic links expire after 24 hours.<br/>
              Request a new one below.
            </div>
            <Link href="/tool">
              <button style={{background:'#DC143C',color:'#fff',border:'none',padding:'14px 32px',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer'}}>
                Request new link →
              </button>
            </Link>
          </div>
        )}

      </div>
    </>
  )
}
