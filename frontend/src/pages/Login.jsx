import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, saveToken } from '../services/api'

export default function Login() {
  const [form, setForm]         = useState({ email: '', password: '' })
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [showPass, setShowPass] = useState(false)
  const [toast, setToast]       = useState('')
  const navigate = useNavigate()

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleSubmit = async () => {
    if (!form.email || !form.password) return setError('Please fill in all fields.')
    setError(''); setLoading(true)
    try {
      const { data } = await loginUser(form)
      saveToken(data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#020811',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .input-wrap { position: relative; }
        .input-field {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 14px 48px 14px 48px;
          color: #e8eaf0; font-size: 14px; font-family: inherit;
          outline: none; transition: all 0.25s ease;
        }
        .input-field:focus {
          border-color: rgba(0,245,212,0.5);
          background: rgba(0,245,212,0.04);
          box-shadow: 0 0 0 3px rgba(0,245,212,0.08);
        }
        .input-field::placeholder { color: rgba(255,255,255,0.25); }
        .input-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3); font-size: 15px; pointer-events: none;
        }
        .input-right {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3); font-size: 13px;
          cursor: pointer; background: none; border: none; font-family: inherit;
        }
        .input-right:hover { color: #00f5d4; }
        .login-btn {
          width: 100%;
          background: linear-gradient(135deg, #00f5d4, #00b4d8);
          color: #020811; border: none; padding: 15px;
          border-radius: 12px; font-size: 15px; font-weight: 600;
          cursor: pointer; font-family: inherit; transition: all 0.25s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 32px rgba(0,245,212,0.4);
        }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .glow { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 16px; height: 16px; border: 2px solid rgba(2,8,17,0.3);
          border-top-color: #020811; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        .card { animation: fadeUp 0.6s ease both; }
        .social-btn {
          flex: 1; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px;
          color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: inherit; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .social-btn:hover { background: rgba(255,255,255,0.07); color: #e8eaf0; }
        @keyframes toastIn {
          from { opacity:0; transform: translate(-50%, 20px); }
          to   { opacity:1; transform: translate(-50%, 0); }
        }
        .toast {
          position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
          background: rgba(10,20,40,0.97); border: 1px solid rgba(0,245,212,0.3);
          color: #00f5d4; padding: 12px 28px; border-radius: 50px;
          font-size: 14px; font-weight: 500; z-index: 9999;
          animation: toastIn 0.3s ease both;
          box-shadow: 0 0 32px rgba(0,245,212,0.15);
          white-space: nowrap;
        }
      `}</style>

      {/* Toast */}
      {toast && <div className="toast">🚧 {toast}</div>}

      <div className="glow" style={{ width:500, height:500, top:-150, left:-150,
        background:'radial-gradient(circle, rgba(0,245,212,0.07) 0%, transparent 70%)' }} />
      <div className="glow" style={{ width:400, height:400, bottom:-100, right:-100,
        background:'radial-gradient(circle, rgba(123,97,255,0.07) 0%, transparent 70%)' }} />

      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%',
        opacity:0.03, pointerEvents:'none' }}>
        {Array.from({length:12},(_,i)=>(
          <line key={`v${i}`} x1={`${(i+1)*8.33}%`} y1="0"
            x2={`${(i+1)*8.33}%`} y2="100%" stroke="#00f5d4" strokeWidth="0.5"/>
        ))}
        {Array.from({length:8},(_,i)=>(
          <line key={`h${i}`} x1="0" y1={`${(i+1)*12.5}%`}
            x2="100%" y2={`${(i+1)*12.5}%`} stroke="#00f5d4" strokeWidth="0.5"/>
        ))}
      </svg>

      <div className="card" style={{ width:'100%', maxWidth:440, position:'relative', zIndex:1 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{
            width:52, height:52, borderRadius:14, margin:'0 auto 16px',
            background:'linear-gradient(135deg,#00f5d4,#7b61ff)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:22, fontWeight:700, color:'#020811',
            fontFamily:"'Space Grotesk',sans-serif",
            boxShadow:'0 0 32px rgba(0,245,212,0.3)',
          }}>P</div>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif",
            fontSize:26, fontWeight:700, color:'#e8eaf0',
            letterSpacing:'-0.5px', marginBottom:6 }}>Welcome back</h1>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)' }}>
            Login to continue your placement prep
          </p>
        </div>

        <div style={{
          background:'rgba(255,255,255,0.025)',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:24, padding:'36px 32px',
          backdropFilter:'blur(20px)',
        }}>

          {/* Social Buttons */}
          <div style={{ display:'flex', gap:10, marginBottom:24 }}>
            <button className="social-btn"
              onClick={() => showToast('Google login coming soon! Use email & password.')}>
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="social-btn"
              onClick={() => showToast('GitHub login coming soon! Use email & password.')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#e8eaf0">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }}/>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.25)', letterSpacing:1 }}>OR</span>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }}/>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom:16, padding:'10px 14px', borderRadius:10,
              background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.2)',
              color:'#ff6b6b', fontSize:13 }}>{error}</div>
          )}

          {/* Fields */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="input-wrap">
              <span className="input-icon">✉</span>
              <input className="input-field" type="email" placeholder="Email address"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                onKeyDown={e => e.key==='Enter' && handleSubmit()} />
            </div>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input className="input-field"
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                onKeyDown={e => e.key==='Enter' && handleSubmit()} />
              <button className="input-right" onClick={() => setShowPass(!showPass)}>
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div style={{ textAlign:'right', marginTop:10, marginBottom:24 }}>
            <span style={{ fontSize:13, color:'#00f5d4', cursor:'pointer' }}
              onClick={() => showToast('Password reset coming soon!')}>
              Forgot password?
            </span>
          </div>

          {/* Login Button */}
          <button className="login-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? <><div className="spinner"/>Signing in...</> : 'Sign In →'}
          </button>

          {/* Register link */}
          <p style={{ textAlign:'center', marginTop:24,
            fontSize:14, color:'rgba(255,255,255,0.35)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'#00f5d4',
              textDecoration:'none', fontWeight:500 }}>
              Create one free
            </Link>
          </p>
        </div>

        {/* Bottom badges */}
        <div style={{ display:'flex', justifyContent:'center', gap:20, marginTop:28 }}>
          {['🔒 Secure','⚡ Instant Access','🎯 Free Forever'].map((b,i) => (
            <span key={i} style={{ fontSize:12, color:'rgba(255,255,255,0.25)' }}>{b}</span>
          ))}
        </div>
      </div>
    </div>
  )
}