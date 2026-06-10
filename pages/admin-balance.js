import { useState } from 'react'
import Head from 'next/head'

const PACKS = [
  { key: 'starter',  label: 'Starter Pack — 500 credits (NPR 499)' },
  { key: 'creator',  label: 'Creator Pack — 1,100 credits (NPR 999)' },
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

  // Check user balance
  const [checkEmail, setCheckEmail] = useState('')
  const [checkStatus, setCheckStatus] = useState('idle')
  const [checkResult, setCheckResult] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading'); setResult(null)
    try {
      const res = await fetch('/api/add-balance', {
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

  async function handleCheckUser(e) {
    e.preventDefault()
    setCheckStatus('loading'); setCheckResult(null)
    try {
      const res = await fetch('/api/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: checkEmail, adminPassword: password }),
      })
      const data = await res.json()
      setCheckResult(res.ok ? { success: true, ...data } : { success: false, error: data.error })
    } catch (err) { setCheckResult({ success: false, error: err.message }) }
    setCheckStatus('idle')
  }

  const inputStyle = {width:'100%',padding:'11px 14px',borderRadius:10,border:'1.5px solid #E0DDD7',fontSize:14,outline:'none',fontFamily:'inherit'}
  const labelStyle = {fontSize:11,fontWeight:700,color:'#888',letterSpacing:'0.08em',textTransform:'uppercase',display:'block',marginBottom:5}

  return (
    <>
      <Head><title>Swor AI — Admin</title></Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:sans-serif;background:#0E0E16;min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding:40px 20px;gap:20px;flex-wrap:wrap}`}</style>

      {/* ── ACTIVATE CREDITS ── */}
      <div style={{background:'#fff',borderRadius:20,padding:'36px 32px',width:'100%',maxWidth:440,boxShadow:'0 24px 60px rgba(0,0,0,.3)'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:22,fontWeight:800,background:'linear-gradient(135deg,#DC143C,#FF9500)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',letterSpacing:'2px',marginBottom:4}}>SWOR AI</div>
          <div style={{fontSize:13,color:'#999'}}>Admin — Activate Credits</div>
        </div>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:12}}>
          <div>
            <label style={labelStyle}>Admin Password</label>
            <input type="password" placeholder="Enter password" required value={password} onChange={e=>setPassword(e.target.value)} style={inputStyle}/>
          </div>
          <div>
            <label style={labelStyle}>Customer Email</label>
            <input type="email" placeholder="customer@email.com" required value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle}/>
          </div>
          <div>
            <label style={labelStyle}>Pack to Activate</label>
            <select value={pack} onChange={e=>setPack(e.target.value)} style={{...inputStyle,cursor:'pointer'}}>
              {PACKS.map(p=><option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
          </div>
          {pack==='custom'&&(
            <div>
              <label style={labelStyle}>Custom Credits</label>
              <input type="number" min="1" placeholder="e.g. 500" value={custom} onChange={e=>setCustom(e.target.value)} style={inputStyle}/>
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

      {/* ── CHECK USER BALANCE ── */}
      <div style={{background:'#fff',borderRadius:20,padding:'36px 32px',width:'100%',maxWidth:440,boxShadow:'0 24px 60px rgba(0,0,0,.3)'}}>
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:22,fontWeight:800,background:'linear-gradient(135deg,#0077CC,#00C7FF)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',letterSpacing:'2px',marginBottom:4}}>SWOR AI</div>
          <div style={{fontSize:13,color:'#999'}}>Admin — Check User Balance</div>
        </div>
        <form onSubmit={handleCheckUser} style={{display:'flex',flexDirection:'column',gap:12}}>
          <div>
            <label style={labelStyle}>Admin Password</label>
            <input type="password" placeholder="Enter password" required value={password} onChange={e=>setPassword(e.target.value)} style={inputStyle}/>
          </div>
          <div>
            <label style={labelStyle}>Customer Email</label>
            <input type="email" placeholder="customer@email.com" required value={checkEmail} onChange={e=>setCheckEmail(e.target.value)} style={inputStyle}/>
          </div>
          <button type="submit" disabled={checkStatus==='loading'}
            style={{background:checkStatus==='loading'?'#ccc':'#0077CC',color:'#fff',border:'none',padding:'13px',borderRadius:10,fontSize:15,fontWeight:700,cursor:checkStatus==='loading'?'not-allowed':'pointer',marginTop:4}}>
            {checkStatus==='loading'?'Checking...':'Check User Balance →'}
          </button>
        </form>

        {checkResult&&(
          <div style={{marginTop:14,padding:'16px',borderRadius:10,background:checkResult.success?'#F0F8FF':'#FFF0F0',border:`1px solid ${checkResult.success?'#0077CC':'#FFB8B8'}`}}>
            {checkResult.success?(
              <div style={{fontSize:13,lineHeight:2}}>
                <div style={{fontWeight:700,color:'#0077CC',marginBottom:8,fontSize:14}}>
                  👤 {checkResult.email}
                </div>
                {[
                  {label:'Credits',value:`${checkResult.credits} Swor Credits`,color: checkResult.credits > 0 ? '#1A9E6A' : '#CC3333'},
                  {label:'Tier',value:checkResult.tier || 'beta'},
                  {label:'Beta Active',value:checkResult.betaActive ? `✅ Yes (${checkResult.betaRemaining} gens left)` : '❌ No'},
                  {label:'Founders Status',value:checkResult.isFounder ? '🏆 Yes' : 'No'},
                  {label:'Founder Music This Month',value:checkResult.isFounder ? `${checkResult.founderMusicRemaining}/5 remaining` : 'N/A'},
                  {label:'Free Music Trial Used',value:checkResult.musicFreeUsed ? '✅ Used' : '🎁 Available'},
                  {label:'Account Created',value:checkResult.createdAt ? new Date(checkResult.createdAt).toLocaleDateString() : 'Unknown'},
                ].map(row=>(
                  <div key={row.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'4px 0',borderBottom:'1px solid rgba(0,0,0,.05)'}}>
                    <span style={{color:'#888',fontSize:12,fontWeight:600}}>{row.label}</span>
                    <span style={{color:row.color||'#1d1d1f',fontWeight:700,fontSize:13}}>{row.value}</span>
                  </div>
                ))}
              </div>
            ):(
              <div style={{fontSize:13,color:'#CC3333'}}>❌ {checkResult.error}</div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
