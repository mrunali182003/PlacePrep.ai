import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'



export default function Register() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: '', experience: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  const roles = ['Frontend Developer', 'Backend Developer', 'Full Stack', 'Data Analyst', 'DevOps']
  const levels = ['Fresher', '1-2 Years', '3-5 Years', '5+ Years']

  const validateStep1 = () => {
    if (!form.name.trim()) return setError('Please enter your name.'), false
    if (!form.email.trim()) return setError('Please enter your email.'), false
    if (!form.email.includes('@')) return setError('Please enter a valid email.'), false
    if (form.password.length < 6) return setError('Password must be at least 6 characters.'), false
    return true
  }

  const handleNext = () => {
    setError('')
    if (step === 1 && validateStep1()) setStep(2)
  }




const handleSubmit = async () => {
  if (!form.role) return setError('Please select your target role.')
  setError(''); setLoading(true)
  try {
    const { data } = await registerUser({
      name:       form.name,
      email:      form.email,
      password:   form.password,
      role:       form.role,
      experience: form.experience,
    })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    navigate('/dashboard')
  } catch (err) {
    setError(err.response?.data?.error || 'Registration failed. Try again.')
  } finally {
    setLoading(false)
  }
}

  const strength = form.password.length === 0 ? 0
    : form.password.length < 4 ? 1
    : form.password.length < 6 ? 2
    : form.password.length < 10 ? 3 : 4

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', '#ff6b6b', '#ffd166', '#00b4d8', '#00f5d4']

  return (
    <div style={{
      minHeight: '100vh', background: '#020811',
      display: 'flex', fontFamily: "'DM Sans','Segoe UI',sans-serif",
      position: 'relative', overflow: 'hidden',
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
        .input-field-simple {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 14px 16px;
          color: #e8eaf0; font-size: 14px; font-family: inherit;
          outline: none; transition: all 0.25s ease;
        }
        .input-field-simple:focus {
          border-color: rgba(0,245,212,0.5);
          background: rgba(0,245,212,0.04);
          box-shadow: 0 0 0 3px rgba(0,245,212,0.08);
        }
        .input-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3); font-size: 15px; pointer-events: none;
        }
        .input-right {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3); font-size: 13px;
          cursor: pointer; transition: color 0.2s;
          background: none; border: none; font-family: inherit;
        }
        .input-right:hover { color: #00f5d4; }

        .primary-btn {
          width: 100%;
          background: linear-gradient(135deg, #00f5d4, #00b4d8);
          color: #020811; border: none; padding: 15px;
          border-radius: 12px; font-size: 15px; font-weight: 600;
          cursor: pointer; font-family: inherit;
          transition: all 0.25s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .primary-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 32px rgba(0,245,212,0.4), 0 8px 24px rgba(0,0,0,0.3);
        }
        .primary-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .role-card {
          padding: 14px 16px; border-radius: 12px; cursor: pointer;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          transition: all 0.2s; text-align: left;
          font-family: inherit; color: rgba(255,255,255,0.6); font-size: 13px;
        }
        .role-card:hover {
          border-color: rgba(0,245,212,0.3);
          background: rgba(0,245,212,0.04);
          color: #e8eaf0;
        }
        .role-card.selected {
          border-color: rgba(0,245,212,0.5);
          background: rgba(0,245,212,0.08);
          color: #00f5d4;
        }

        .level-pill {
          flex: 1; padding: 10px 8px; border-radius: 10px; cursor: pointer;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          transition: all 0.2s; text-align: center;
          font-family: inherit; color: rgba(255,255,255,0.5); font-size: 12px;
          font-weight: 500;
        }
        .level-pill:hover { border-color: rgba(123,97,255,0.3); color: #e8eaf0; }
        .level-pill.selected {
          border-color: rgba(123,97,255,0.5);
          background: rgba(123,97,255,0.1); color: #b39dff;
        }

        .social-btn {
          flex: 1; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 12px;
          color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: inherit; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .social-btn:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.18); color: #e8eaf0;
        }

        .glow { position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 16px; height: 16px; border: 2px solid rgba(2,8,17,0.3);
          border-top-color: #020811; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-in { animation: fadeUp 0.4s ease both; }
      `}</style>

      {/* Background */}
      <div className="glow" style={{
        width: 500, height: 500, top: -150, right: -100,
        background: 'radial-gradient(circle, rgba(123,97,255,0.08) 0%, transparent 70%)',
      }} />
      <div className="glow" style={{
        width: 400, height: 400, bottom: -100, left: -100,
        background: 'radial-gradient(circle, rgba(0,245,212,0.07) 0%, transparent 70%)',
      }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
        opacity: 0.03, pointerEvents: 'none' }}>
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`v${i}`} x1={`${(i+1)*8.33}%`} y1="0"
            x2={`${(i+1)*8.33}%`} y2="100%"
            stroke="#7b61ff" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={`${(i+1)*12.5}%`}
            x2="100%" y2={`${(i+1)*12.5}%`}
            stroke="#7b61ff" strokeWidth="0.5" />
        ))}
      </svg>

      {/* Left panel — only on wide screens */}
      <div style={{
        width: '42%', background: 'rgba(123,97,255,0.04)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        padding: '60px 48px', display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
      }}
        className="left-panel"
      >
        <div style={{ marginBottom: 48 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12, marginBottom: 20,
            background: 'linear-gradient(135deg,#00f5d4,#7b61ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, color: '#020811',
            fontFamily: "'Space Grotesk',sans-serif",
          }}>P</div>
          <h2 style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: 32, fontWeight: 700, color: '#e8eaf0',
            letterSpacing: '-1px', lineHeight: 1.2, marginBottom: 14,
          }}>
            Land your<br />
            <span style={{
              background: 'linear-gradient(135deg,#00f5d4,#7b61ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>dream job</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            Join 12,000+ students who used PlacePrep.ai to get placed at top companies.
          </p>
        </div>

        {[
          { icon: '◈', color: '#00f5d4', title: 'AI Resume Analysis', desc: 'Get your resume scored and improved instantly' },
          { icon: '◉', color: '#7b61ff', title: 'Mock Interviews', desc: 'Practice with AI and get real feedback' },
          { icon: '◎', color: '#ff6b6b', title: 'Coding Practice', desc: 'Solve problems with a live code editor' },
        ].map((f, i) => (
          <div key={i} style={{
            display: 'flex', gap: 14, alignItems: 'flex-start',
            marginBottom: 20,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: `${f.color}15`, border: `1px solid ${f.color}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: f.color,
            }}>{f.icon}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf0',
                marginBottom: 2 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{f.desc}</div>
            </div>
          </div>
        ))}

        <div style={{
          marginTop: 32, padding: '16px 20px', borderRadius: 14,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ display: 'flex' }}>
              {['#00f5d4','#7b61ff','#ff6b6b','#ffd166'].map((c,i) => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: c, marginLeft: i > 0 ? -8 : 0,
                  border: '2px solid #020811', opacity: 0.8,
                }} />
              ))}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf0' }}>
                12,000+ students
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                already placed this year
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            {[1, 2].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: step >= s
                    ? 'linear-gradient(135deg,#00f5d4,#7b61ff)'
                    : 'rgba(255,255,255,0.06)',
                  border: step >= s ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600,
                  color: step >= s ? '#020811' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s',
                }}>{step > s ? '✓' : s}</div>
                <span style={{
                  fontSize: 13,
                  color: step >= s ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)',
                }}>
                  {s === 1 ? 'Account' : 'Profile'}
                </span>
                {s < 2 && (
                  <div style={{
                    width: 32, height: 1,
                    background: step > s ? 'rgba(0,245,212,0.5)' : 'rgba(255,255,255,0.1)',
                    transition: 'all 0.3s',
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: 26, fontWeight: 700, color: '#e8eaf0',
              letterSpacing: '-0.5px', marginBottom: 6,
            }}>
              {step === 1 ? 'Create your account' : 'Set up your profile'}
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
              {step === 1
                ? 'Start your placement journey today — free forever'
                : 'Help us personalize your experience'}
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24, padding: '32px 28px',
            backdropFilter: 'blur(20px)',
          }}>

            {error && (
              <div style={{
                marginBottom: 16, padding: '10px 14px', borderRadius: 10,
                background: 'rgba(255,107,107,0.08)',
                border: '1px solid rgba(255,107,107,0.2)',
                color: '#ff6b6b', fontSize: 13,
              }}>{error}</div>
            )}

            {step === 1 && (
              <div className="slide-in">
                {/* Social */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  <button className="social-btn">
                    <svg width="15" height="15" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button className="social-btn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="#e8eaf0">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', letterSpacing: 1 }}>OR</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="input-wrap">
                    <span className="input-icon">👤</span>
                    <input className="input-field" placeholder="Full name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="input-wrap">
                    <span className="input-icon">✉</span>
                    <input className="input-field" type="email" placeholder="Email address"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="input-wrap">
                    <span className="input-icon">🔒</span>
                    <input className="input-field"
                      type={showPass ? 'text' : 'password'}
                      placeholder="Create password"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })} />
                    <button className="input-right" onClick={() => setShowPass(!showPass)}>
                      {showPass ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {/* Password strength */}
                  {form.password.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                        {[1,2,3,4].map(i => (
                          <div key={i} style={{
                            flex: 1, height: 3, borderRadius: 2,
                            background: i <= strength ? strengthColor[strength] : 'rgba(255,255,255,0.08)',
                            transition: 'all 0.3s',
                          }} />
                        ))}
                      </div>
                      <div style={{ fontSize: 11, color: strengthColor[strength] }}>
                        {strengthLabel[strength]}
                      </div>
                    </div>
                  )}
                </div>

                <button className="primary-btn" onClick={handleNext} style={{ marginTop: 20 }}>
                  Continue →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="slide-in">
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>Target Role</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {roles.map(r => (
                      <button key={r} className={`role-card ${form.role === r ? 'selected' : ''}`}
                        onClick={() => { setForm({ ...form, role: r }); setError('') }}>
                        {form.role === r && <span style={{ marginRight: 6 }}>✓</span>}
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>Experience Level</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {levels.map(l => (
                      <button key={l}
                        className={`level-pill ${form.experience === l ? 'selected' : ''}`}
                        onClick={() => setForm({ ...form, experience: l })}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { setStep(1); setError('') }} style={{
                    flex: '0 0 auto', padding: '15px 20px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer', fontFamily: 'inherit', fontSize: 14,
                    transition: 'all 0.2s',
                  }}>← Back</button>
                  <button className="primary-btn" onClick={handleSubmit}
                    disabled={loading} style={{ flex: 1 }}>
                    {loading ? (
                      <><div className="spinner" /> Setting up...</>
                    ) : (
                      '🚀 Get Started'
                    )}
                  </button>
                </div>
              </div>
            )}

            <p style={{
              textAlign: 'center', marginTop: 20,
              fontSize: 13, color: 'rgba(255,255,255,0.3)',
            }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#00f5d4',
                textDecoration: 'none', fontWeight: 500 }}>
                Sign in
              </Link>
            </p>
          </div>

          <p style={{
            textAlign: 'center', marginTop: 20, fontSize: 12,
            color: 'rgba(255,255,255,0.2)', lineHeight: 1.6,
          }}>
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}