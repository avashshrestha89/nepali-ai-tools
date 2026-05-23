import { useState } from 'react'
import Head from 'next/head'

const PACKS = [
  { label: 'Starter Pack (15 gens)', value: 15 },
  { label: 'Creator Pack (40 gens)', value: 40 },
  { label: "Founders' Lifetime Pack (500 gens)", value: 500 },
  { label: 'Custom amount', value: 'custom' },
]

export default function AdminBalance() {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [pack, setPack] = useState(15)
  const [custom, setCustom] = useState('')
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)

  const amount = pack === 'custom' ? parseInt(custom) : pack

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !amount || amount <= 0) return
    setStatus('loading')
    setResult(null)

    try {
      const res = await fetch('/api/auth/add-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, amount, adminPassword: password }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult({ success: true, ...data })
        setEmail('')
        setStatus('idle')
      } else {
        setResult({ success: false, error: data.error })
        setStatus('idle')
      }
    } catch (err) {
      setResult({ success: false, error: err.message })
      setStatus('idle')
    }
  }

  return (
    <>
      <Head><title>Swor AI — Admin Balance</title></Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:sans-serif;background:#0E0E16;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
        input,select{font-family:sans-serif}
      `}</style>

      <div style={{background:'#fff',borderRadius:20,padding:'36px 32px',width:'100%',maxWidth:480,boxShadow:'0 24px 60px rgba(0,0,0,.3)'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:24,fontWeight:800,background:'linear-gradient(135deg,#DC143C,#FF9500)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',letterSpacing:'2px',marginBottom:4}}>
            SWOR AI
          </div>
          <div style={{fontSize:13,color:'#999'}}>Admin — Add Credits</div>
        </div>

        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:14}}>

          <div>
            <label style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',display:'block',marginBottom:6}}>Admin Password</label>
            <input
              type="password" placeholder="Enter admin password" required
              value={password} onChange={e=>setPassword(e.target.value)}
              style={{width:'100%',padding:'11px 14px',borderRadius:10,border:'1.5px solid #E0DDD7',fontSize:14,outline:'none'}}
            />
          </div>

          <div>
            <label style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',display:'block',marginBottom:6}}>User Email</label>
            <input
              type="email" placeholder="customer@email.com" required
              value={email} onChange={e=>setEmail(e.target.value)}
              style={{width:'100%',padding:'11px 14px',borderRadius:10,border:'1.5px solid #E0DDD7',fontSize:14,outline:'none'}}
            />
          </div>

          <div>
            <label style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',display:'block',marginBottom:6}}>Pack / Credits to Add</label>
            <select
              value={pack} onChange={e=>setPack(e.target.value==='custom'?'custom':parseInt(e.target.value))}
              style={{width:'100%',padding:'11px 14px',borderRadius:10,border:'1.5px solid #E0DDD7',fontSize:14,outline:'none',marginBottom:8}}
            >
              {PACKS.map(p=>(
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            {pack === 'custom' && (
              <input
                type="number" placeholder="Enter custom amount" min="1"
                value={custom} onChange={e=>setCustom(e.target.value)}
                style={{width:'100%',padding:'11px 14px',borderRadius:10,border:'1.5px solid #E0DDD7',fontSize:14,outline:'none'}}
              />
            )}
          </div>

          {amount > 0 && (
            <div style={{background:'#FFF5F5',border:'1px solid rgba(220,20,60,.2)',borderRadius:10,padding:'10px 14px',fontSize:13,color:'#555'}}>
              Adding <strong style={{color:'#DC143C'}}>{amount} voiceover credits</strong> to <strong>{email || 'this user'}</strong>
            </div>
          )}

          <button
            type="submit"
            disabled={status==='loading'}
            style={{background:status==='loading'?'#ccc':'#DC143C',color:'#fff',border:'none',padding:'13px',borderRadius:10,fontSize:15,fontWeight:700,cursor:status==='loading'?'not-allowed':'pointer',marginTop:4}}
          >
            {status==='loading' ? 'Adding credits...' : 'Add Credits →'}
          </button>

        </form>

        {result && (
          <div style={{marginTop:16,padding:'14px 16px',borderRadius:10,background:result.success?'#F0FAF5':'#FFF0F0',border:`1px solid ${result.success?'#1A9E6A':'#FFB8B8'}`}}>
            {result.success ? (
              <div style={{fontSize:13,color:'#1A9E6A',lineHeight:1.7}}>
                ✅ <strong>Credits added successfully</strong><br/>
                Email: {result.email}<br/>
                Added: {result.added} credits<br/>
                New balance: <strong>{result.newBalance} credits</strong>
              </div>
            ) : (
              <div style={{fontSize:13,color:'#CC3333'}}>
                ❌ Error: {result.error}
              </div>
            )}
          </div>
        )}

        <div style={{marginTop:20,paddingTop:16,borderTop:'1px solid #f0f0f0',fontSize:11,color:'#ccc',textAlign:'center',lineHeight:1.6}}>
          Manual activation flow:<br/>
          User pays → sends WhatsApp screenshot → you come here → add credits → done
        </div>
      </div>
    </>
  )
}
