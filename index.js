
import { useState } from "react";

const FORMSPREE_ID = "YOUR_FORM_ID";

export default function SworLanding() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", useCase: "", hearAbout: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    if (FORMSPREE_ID === "YOUR_FORM_ID") { setTimeout(() => setStatus("success"), 900); return; }
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, _subject: `Swor Beta Application — ${form.name}`, _replyto: form.email })
      });
      setStatus(res.ok ? "success" : "error");
    } catch { setStatus("error"); }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html:`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Sora:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#06060F;--s1:#0C0C1A;--s2:#141428;
          --red:#DC2626;--gold:#D97706;
          --text:#EEE9E0;--muted:#6B6B85;
          --border:rgba(255,255,255,0.06);
        }
        body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif}
        .swor-wrap{min-height:100vh;background:var(--bg)}
        .nav{display:flex;justify-content:space-between;align-items:center;padding:18px 40px;border-bottom:1px solid var(--border);position:sticky;top:0;background:rgba(6,6,15,0.94);backdrop-filter:blur(14px);z-index:100}
        .logo-mark{font-family:'Rajdhani',sans-serif;font-weight:700;font-size:20px;letter-spacing:.06em;color:var(--text)}
        .logo-mark span{color:var(--red)}
        .logo-sub{font-family:'DM Sans',sans-serif;font-size:10px;color:var(--muted);letter-spacing:.14em;text-transform:uppercase;margin-top:-3px}
        .nav-cta{padding:8px 18px;border:1px solid var(--border);background:transparent;color:var(--text);border-radius:6px;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;text-decoration:none;transition:border-color .2s,color .2s}
        .nav-cta:hover{border-color:var(--red);color:var(--red)}
        .hero{padding:72px 40px 56px;text-align:center;max-width:880px;margin:0 auto}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;padding:5px 16px;border:1px solid rgba(220,38,38,.28);border-radius:100px;font-size:11px;color:var(--red);letter-spacing:.14em;text-transform:uppercase;margin-bottom:28px}
        .hero-badge-dot{width:6px;height:6px;border-radius:50%;background:var(--red);animation:blink 2s infinite}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
        .wordmark{font-family:'Rajdhani',sans-serif;font-weight:700;font-size:clamp(80px,14vw,144px);letter-spacing:.1em;line-height:.88;color:var(--text)}
        .wordmark span{color:var(--red)}
        .redline{width:56px;height:3px;background:var(--red);margin:22px auto;border-radius:2px}
        .tagline{font-family:'Sora',sans-serif;font-size:17px;font-weight:300;color:var(--muted);line-height:1.65;max-width:500px;margin:0 auto 36px}
        .tagline strong{color:var(--text);font-weight:600}
        .chips{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:36px}
        .chip{padding:8px 16px;background:var(--s2);border:1px solid var(--border);border-radius:7px;font-size:13px;color:var(--muted)}
        .chip em{font-style:normal;color:var(--text)}
        .scroll-btn{padding:12px 28px;background:var(--red);color:#fff;border:none;border-radius:8px;font-family:'Sora',sans-serif;font-size:14px;font-weight:600;cursor:pointer;letter-spacing:.02em;transition:opacity .2s,transform .1s}
        .scroll-btn:hover{opacity:.88;transform:translateY(-1px)}
        .section{padding:56px 40px;max-width:880px;margin:0 auto}
        .section+.section{border-top:1px solid var(--border)}
        .sec-label{font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--red);margin-bottom:36px;font-weight:500}
        .feat-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
        @media(max-width:580px){.feat-grid{grid-template-columns:1fr}}
        .feat-card{background:var(--s1);border:1px solid var(--border);border-radius:12px;padding:28px;transition:border-color .25s}
        .feat-card:hover{border-color:rgba(220,38,38,.3)}
        .feat-icon{font-size:26px;margin-bottom:14px}
        .feat-title{font-family:'Sora',sans-serif;font-size:19px;font-weight:600;margin-bottom:8px}
        .feat-sub{font-size:13px;color:var(--muted);margin-bottom:18px;line-height:1.55}
        .feat-list{list-style:none;display:flex;flex-direction:column;gap:7px}
        .feat-list li{font-size:13px;color:var(--muted);padding-left:18px;position:relative}
        .feat-list li::before{content:'→';position:absolute;left:0;color:var(--red)}
        .steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
        @media(max-width:580px){.steps-grid{grid-template-columns:1fr}}
        .step-num{font-family:'Rajdhani',sans-serif;font-size:52px;font-weight:700;color:rgba(220,38,38,.13);line-height:1;margin-bottom:10px}
        .step-title{font-family:'Sora',sans-serif;font-size:15px;font-weight:600;margin-bottom:6px}
        .step-desc{font-size:13px;color:var(--muted);line-height:1.6}
        .waitlist-wrap{padding:56px 40px;border-top:1px solid var(--border)}
        .waitlist-inner{max-width:540px;margin:0 auto}
        .wl-head{text-align:center;margin-bottom:36px}
        .spots{display:inline-block;padding:5px 16px;background:rgba(220,38,38,.09);border:1px solid rgba(220,38,38,.2);border-radius:100px;font-size:11px;color:var(--red);letter-spacing:.12em;text-transform:uppercase;margin-bottom:18px}
        .wl-title{font-family:'Sora',sans-serif;font-size:30px;font-weight:600;margin-bottom:10px}
        .wl-sub{font-size:14px;color:var(--muted)}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:11px}
        @media(max-width:480px){.form-row{grid-template-columns:1fr}}
        .fg{display:flex;flex-direction:column;gap:5px}
        .flabel{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:500}
        .finput{background:var(--s1);border:1px solid var(--border);border-radius:8px;padding:11px 13px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;width:100%;transition:border-color .2s;outline:none;-webkit-appearance:none}
        .finput:focus{border-color:rgba(220,38,38,.45)}
        .finput option{background:#0C0C1A}
        .fg-full{margin-bottom:11px}
        .sub-btn{width:100%;padding:13px;background:var(--red);color:#fff;border:none;border-radius:8px;font-family:'Sora',sans-serif;font-size:15px;font-weight:600;cursor:pointer;margin-top:10px;transition:opacity .2s,transform .1s;letter-spacing:.02em}
        .sub-btn:hover:not(:disabled){opacity:.88;transform:translateY(-1px)}
        .sub-btn:disabled{opacity:.45;cursor:not-allowed}
        .err-msg{text-align:center;color:#E63946;font-size:13px;margin-top:10px}
        .success-box{text-align:center;padding:44px 28px;background:var(--s1);border:1px solid rgba(220,38,38,.18);border-radius:12px}
        .success-ico{font-size:44px;margin-bottom:14px}
        .success-title{font-family:'Sora',sans-serif;font-size:22px;font-weight:600;margin-bottom:8px}
        .success-sub{font-size:14px;color:var(--muted);line-height:1.65}
        .pay-section{padding:44px 40px;border-top:1px solid var(--border);max-width:880px;margin:0 auto}
        .pay-label{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);margin-bottom:20px;font-weight:500}
        .pay-pills{display:flex;gap:9px;flex-wrap:wrap}
        .pay-pill{padding:7px 15px;background:var(--s1);border:1px solid var(--border);border-radius:100px;font-size:13px;color:var(--muted)}
        .meroadai-section{padding:56px 40px;border-top:1px solid var(--border);max-width:880px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:36px;flex-wrap:wrap}
        .ma-text h3{font-family:'Sora',sans-serif;font-size:18px;font-weight:600;margin-bottom:8px}
        .ma-text p{font-size:14px;color:var(--muted);line-height:1.6;max-width:420px}
        .soc-links{display:flex;gap:10px;flex-wrap:wrap}
        .soc-link{display:flex;align-items:center;gap:7px;padding:9px 15px;background:var(--s1);border:1px solid var(--border);border-radius:8px;color:var(--text);text-decoration:none;font-size:13px;transition:border-color .2s,color .2s}
        .soc-link:hover{border-color:var(--red);color:var(--red)}
        .footer{padding:28px 40px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;max-width:880px;margin:0 auto}
        .foot-text{font-size:12px;color:var(--muted)}
        .foot-text a{color:var(--muted);text-decoration:none}
        .foot-text a:hover{color:var(--text)}
        .powered{font-size:11px;color:var(--muted);letter-spacing:.07em}
      `}} />

      <div className="swor-wrap">

        {/* NAV */}
        <nav className="nav">
          <div>
            <div className="logo-mark">SW<span>O</span>R</div>
            <div className="logo-sub">by MeroAD.ai</div>
          </div>
          <a href="/tool" className="nav-cta">Already approved? Access Tool →</a>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Beta — Limited Access
          </div>
          <div className="wordmark">SW<span>O</span>R</div>
          <div className="redline" />
          <p className="tagline">
            <strong>Nepal's first AI subtitle and voiceover generator.</strong><br />
            Devanagari or Romanized. Natural Nepali accent. CapCut-ready.
          </p>
          <div className="chips">
            <div className="chip">🎬 <em>Video → .SRT</em> Subtitles</div>
            <div className="chip">🎙️ <em>Text → .MP3</em> Voiceover</div>
            <div className="chip">⚡ <em>24hr</em> Delivery</div>
            <div className="chip">🇳🇵 <em>Made in</em> Kathmandu</div>
          </div>
          <button className="scroll-btn" onClick={() => document.getElementById("waitlist").scrollIntoView({ behavior: "smooth" })}>
            Apply for Beta Access →
          </button>
        </section>

        {/* FEATURES */}
        <section className="section">
          <div className="sec-label">What Swor Does</div>
          <div className="feat-grid">
            <div className="feat-card">
              <div className="feat-icon">🎬</div>
              <div className="feat-title">Nepali Subtitles</div>
              <p className="feat-sub">Upload your video. Get a .SRT file with accurate Nepali subtitles — in minutes.</p>
              <ul className="feat-list">
                <li>Devanagari script support</li>
                <li>Romanized Nepali option</li>
                <li>Mixed Nepali-English handled</li>
                <li>Direct CapCut & TikTok import</li>
              </ul>
            </div>
            <div className="feat-card">
              <div className="feat-icon">🎙️</div>
              <div className="feat-title">Nepali Voiceover</div>
              <p className="feat-sub">Paste your script. Get a natural-sounding Nepali AI voice as .MP3.</p>
              <ul className="feat-list">
                <li>Natural Kathmandu accent</li>
                <li>Zero robotic output</li>
                <li>MP3 download, ready to use</li>
                <li>Powered by ElevenLabs</li>
              </ul>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section">
          <div className="sec-label">How Beta Access Works</div>
          <div className="steps-grid">
            <div>
              <div className="step-num">01</div>
              <div className="step-title">Apply below</div>
              <p className="step-desc">Fill in the short form. Tell us how you plan to use Swor.</p>
            </div>
            <div>
              <div className="step-num">02</div>
              <div className="step-title">We review</div>
              <p className="step-desc">We manually review every application and email you within 48 hours.</p>
            </div>
            <div>
              <div className="step-num">03</div>
              <div className="step-title">Start generating</div>
              <p className="step-desc">Approved users get full free access during beta — subtitles and voiceover.</p>
            </div>
          </div>
        </section>

        {/* WAITLIST FORM */}
        <div className="waitlist-wrap" id="waitlist">
          <div className="waitlist-inner">
            <div className="wl-head">
              <div className="spots">⚡ Only 20 spots available</div>
              <h2 className="wl-title">Apply for Beta Access</h2>
              <p className="wl-sub">Free during beta. No credit card required.</p>
            </div>

            {status === "success" ? (
              <div className="success-box">
                <div className="success-ico">✅</div>
                <h3 className="success-title">Application Received!</h3>
                <p className="success-sub">
                  Thank you! We'll review your application and email <strong>{form.email}</strong> within 48 hours.<br /><br />
                  Follow <strong>@meroadai</strong> on Instagram and TikTok for updates.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="fg">
                    <label className="flabel">Full Name *</label>
                    <input className="finput" type="text" name="name" required placeholder="Priya Shrestha" value={form.name} onChange={handleChange} />
                  </div>
                  <div className="fg">
                    <label className="flabel">Email *</label>
                    <input className="finput" type="email" name="email" required placeholder="you@gmail.com" value={form.email} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="fg">
                    <label className="flabel">Phone / WhatsApp *</label>
                    <input className="finput" type="tel" name="phone" required placeholder="+977 98XXXXXXXX" value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="fg">
                    <label className="flabel">How will you use Swor? *</label>
                    <select className="finput" name="useCase" required value={form.useCase} onChange={handleChange}>
                      <option value="">Select...</option>
                      <option value="subtitles-tiktok">Subtitles for TikTok / Reels</option>
                      <option value="subtitles-youtube">Subtitles for YouTube</option>
                      <option value="voiceover-channel">Voiceover for my channel</option>
                      <option value="voiceover-business">Voiceover for business content</option>
                      <option value="both">Both subtitles and voiceover</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="fg fg-full">
                  <label className="flabel">How did you hear about Swor?</label>
                  <select className="finput" name="hearAbout" value={form.hearAbout} onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="tiktok">TikTok (@meroadai)</option>
                    <option value="instagram">Instagram (@meroadai)</option>
                    <option value="facebook">Facebook (@meroadai)</option>
                    <option value="google">Google Search</option>
                    <option value="friend">Friend / Colleague</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <button className="sub-btn" type="submit" disabled={status === "submitting"}>
                  {status === "submitting" ? "Submitting..." : "Apply for Beta Access →"}
                </button>
                {status === "error" && (
                  <p className="err-msg">Something went wrong. Email us at avashshresthausa@gmail.com</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* PAYMENT METHODS */}
        <div className="pay-section">
          <div className="pay-label">Accepted payment methods for future paid plans</div>
          <div className="pay-pills">
            {["eSewa", "Khalti", "IME Pay", "Bank Transfer", "PayPal"].map(p => (
              <div key={p} className="pay-pill">{p}</div>
            ))}
          </div>
        </div>

        {/* MEROADAI SERVICES SECTION */}
        <div className="meroadai-section">
          <div className="ma-text">
            <h3>Need a full AI-powered advertisement?</h3>
            <p>MeroAD.ai creates AI-powered commercials and advertisements for Nepal brands. Virtual influencers, AI video production, branded content — built for the Nepal market.</p>
          </div>
          <div className="soc-links">
            <a href="https://instagram.com/meroadai" className="soc-link" target="_blank" rel="noreferrer">📷 Instagram</a>
            <a href="https://tiktok.com/@meroadai" className="soc-link" target="_blank" rel="noreferrer">🎵 TikTok</a>
            <a href="https://facebook.com/meroadai" className="soc-link" target="_blank" rel="noreferrer">👤 Facebook</a>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <div className="foot-text">
            © 2026 MeroAD.ai · Kathmandu, Nepal ·{" "}
            <a href="mailto:avashshresthausa@gmail.com">avashshresthausa@gmail.com</a>
          </div>
          <div className="powered">Powered by Groq Whisper + ElevenLabs</div>
        </footer>

      </div>
    </>
  );
}
