import { useState } from 'react'
import Head from 'next/head'

const PACKS = [
  { key: 'starter',  label: 'Starter Pack — 500 credits (NPR 499)' },
  { key: 'creator',  label: 'Creator Pack — 1,100 credits (NPR 999)' },
  { key: 'pro',      label: 'Pro Studio Pack — 3,000 credits (NPR 2,499)' },
  { key: 'founders', label: "Founders' Lifetime Pack (NPR 2,500) + music bonus" },
  { key: 'custom',   label: 'Custom credits' },
]

export default function AdminBalance() {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [pack, setPack] = useState('starter')
  const [custom, setCustom] = useState('')
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading'); setResult(null)
    try {
      const res = await fetch('/api/auth/add-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pack, customCredits: custom, adminPassword: password }),
      })
      const data = await res.json()
      setResult(res.ok ? { success: true, ...data } : { success: false, error: data.error })
      if (res.ok) setEmail('')
    } catch (err) { setResult({ success: false, error: err.message }) }
    setStatus('idle')
  }

  return (
    <>
      <Head><title>Swor AI — Admin</title></Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:sans-serif;background:#0E0E16;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}`}</style>
      <div style={{background:'#fff',borderRadius:20,padding:'36px 32px',width:'100%',maxWidth:480,boxShadow:'0 24px 60px rgba(0,0,0,.3)'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:22,fontWeight:800,background:'linear-gradient(135deg,#DC143C,#FF9500)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',letterSpacing:'2px',marginBottom:4}}>SWOR AI</div>
          <div style={{fontSize:13,color:'#999'}}>Admin — Activate Credits</div>
        </div>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:12}}>
          {[
            {label:'Admin Password',type:'password',val:password,set:setPassword,ph:'Enter password'},
            {label:'Customer Email',type:'email',val:email,set:setEmail,ph:'customer@email.com'},
          ].map(f=>(
            <div key={f.label}>
              <label style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',display:'block',marginBottom:5}}>{f.label}</label>
              <input type={f.type} placeholder={f.ph} required value={f.val} onChange={e=>f.set(e.target.value)}
                style={{width:'100%',padding:'11px 14px',borderRadius:10,border:'1.5px solid #E0DDD7',fontSize:14,outline:'none',fontFamily:'inherit'}}/>
            </div>
          ))}
          <div>
            <label style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',display:'block',marginBottom:5}}>Pack to Activate</label>
            <select value={pack} onChange={e=>setPack(e.target.value)}
              style={{width:'100%',padding:'11px 14px',borderRadius:10,border:'1.5px solid #E0DDD7',fontSize:13,outline:'none',fontFamily:'inherit'}}>
              {PACKS.map(p=><option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
          </div>
          {pack==='custom'&&(
            <div>
              <label style={{fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',display:'block',marginBottom:5}}>Custom Credits</label>
              <input type="number" min="1" placeholder="e.g. 500" value={custom} onChange={e=>setCustom(e.target.value)}
                style={{width:'100%',padding:'11px 14px',borderRadius:10,border:'1.5px solid #E0DDD7',fontSize:14,outline:'none',fontFamily:'inherit'}}/>
            </div>
          )}
          <div style={{background:'#FFF5F5',border:'1px solid rgba(220,20,60,.15)',borderRadius:10,padding:'10px 14px',fontSize:12,color:'#555'}}>
            <strong style={{color:'#DC143C'}}>Credit rates:</strong> 1 voiceover = 25 cr · 30s music = 100 cr · 60s music = 200 cr
          </div>
          <button type="submit" disabled={status==='loading'}
            style={{background:status==='loading'?'#ccc':'#DC143C',color:'#fff',border:'none',padding:'13px',borderRadius:10,fontSize:15,fontWeight:700,cursor:status==='loading'?'not-allowed':'pointer',marginTop:4}}>
            {status==='loading'?'Activating...':'Activate Credits →'}
          </button>
        </form>
        {result&&(
          <div style={{marginTop:14,padding:'14px',borderRadius:10,background:result.success?'#F0FAF5':'#FFF0F0',border:`1px solid ${result.success?'#1A9E6A':'#FFB8B8'}`}}>
            {result.success?(
              <div style={{fontSize:13,color:'#1A9E6A',lineHeight:1.7}}>
                ✅ <strong>{result.message}</strong><br/>
                Credits: {result.newCredits || result.creditsAdded}
                {result.isFounder&&<><br/>🏆 Founders status activated — 5 music tracks/month</>}
              </div>
            ):(
              <div style={{fontSize:13,color:'#CC3333'}}>❌ {result.error}</div>
            )}
          </div>
        )}
        <div style={{marginTop:16,paddingTop:14,borderTop:'1px solid #f0f0f0',fontSize:11,color:'#ccc',textAlign:'center',lineHeight:1.7}}>
          Credits activated daily at 8AM and 6PM NST<br/>
          Customer pays → screenshots WhatsApp → you activate here
        </div>
      </div>
    </>
  )
}
