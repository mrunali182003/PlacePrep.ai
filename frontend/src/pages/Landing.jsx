import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  speed: Math.random() * 0.3 + 0.1,
  opacity: Math.random() * 0.5 + 0.2,
}))

const WORDS = ['Dream Job', 'Top Company', 'Dream Offer', 'Success']

const FEATURES = [
  {
    icon: '◈',
    title: 'Resume Analyzer',
    desc: 'AI scores your resume, extracts skills, and gives actionable improvement tips instantly.',
    color: '#00f5d4',
    path: '/resume',
    stat: '98% accuracy',
  },
  {
    icon: '◉',
    title: 'Mock Interview',
    desc: 'Practice with an AI interviewer tailored to your role. Get scored feedback on every answer.',
    color: '#7b61ff',
    path: '/interview',
    stat: '50+ roles',
  },
  {
    icon: '◎',
    title: 'Coding Practice',
    desc: 'Solve real problems in a live editor. Run code, pass test cases, level up fast.',
    color: '#ff6b6b',
    path: '/coding',
    stat: '200+ problems',
  },
  {
    icon: '◇',
    title: 'Job Match',
    desc: 'AI matches your profile to live job listings across LinkedIn, Naukri, and Indeed.',
    color: '#ffd166',
    path: '/dashboard',
    stat: '10k+ listings',
  },
]

const STATS = [
  { value: '12,000+', label: 'Students Placed' },
  { value: '500+', label: 'Partner Companies' },
  { value: '95%', label: 'Success Rate' },
  { value: '4.9★', label: 'User Rating' },
]

export default function Landing() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  // Typewriter effect
  useEffect(() => {
    const word = WORDS[wordIndex]
    let timeout
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setWordIndex((wordIndex + 1) % WORDS.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, wordIndex])

  // Animated canvas background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = PARTICLES.map(p => ({ ...p }))

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.y -= p.speed * 0.3
        if (p.y < -2) p.y = 102
        const x = (p.x / 100) * canvas.width
        const y = (p.y / 100) * canvas.height
        ctx.beginPath()
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 245, 212, ${p.opacity * 0.6})`
        ctx.fill()
      })
      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.03)'
      ctx.lineWidth = 1
      for (let x = 0; x < canvas.width; x += 80) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += 80) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke()
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#020811',
      color: '#e8eaf0',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      overflowX: 'hidden',
      position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(0,245,212,0.3); }
        .fade-up {
          opacity: 0; transform: translateY(32px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.1s; }
        .d2 { transition-delay: 0.25s; }
        .d3 { transition-delay: 0.4s; }
        .d4 { transition-delay: 0.55s; }
        .d5 { transition-delay: 0.7s; }
        .btn-primary {
          background: linear-gradient(135deg, #00f5d4, #00b4d8);
          color: #020811; border: none; padding: 14px 36px;
          border-radius: 50px; font-size: 15px; font-weight: 600;
          cursor: pointer; transition: all 0.25s ease;
          font-family: inherit; letter-spacing: 0.3px;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 32px rgba(0,245,212,0.4), 0 8px 24px rgba(0,0,0,0.4);
        }
        .btn-ghost {
          background: transparent;
          color: #a0aec0; border: 1px solid rgba(255,255,255,0.12);
          padding: 14px 36px; border-radius: 50px;
          font-size: 15px; font-weight: 500; cursor: pointer;
          transition: all 0.25s ease; font-family: inherit;
        }
        .btn-ghost:hover {
          border-color: rgba(0,245,212,0.4);
          color: #00f5d4;
          background: rgba(0,245,212,0.05);
        }
        .feature-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 32px;
          cursor: pointer; transition: all 0.3s ease;
          position: relative; overflow: hidden;
        }
        .feature-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--card-color), transparent);
          opacity: 0; transition: opacity 0.3s ease;
        }
        .feature-card:hover::before { opacity: 1; }
        .feature-card:hover {
          background: rgba(255,255,255,0.045);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-4px);
        }
        .stat-card {
          text-align: center; padding: 32px 24px;
          border-right: 1px solid rgba(255,255,255,0.07);
        }
        .stat-card:last-child { border-right: none; }
        .nav-link {
          color: rgba(255,255,255,0.5); text-decoration: none;
          font-size: 14px; transition: color 0.2s ease; cursor: pointer;
        }
        .nav-link:hover { color: #00f5d4; }
        .glow-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
        }
        .cursor-blink {
          display: inline-block; width: 3px; height: 1.1em;
          background: #00f5d4; margin-left: 4px;
          vertical-align: text-bottom;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }
        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(0,245,212,0.08);
          border: 1px solid rgba(0,245,212,0.2);
          color: #00f5d4; font-size: 12px; font-weight: 500;
          padding: 6px 16px; border-radius: 50px;
          letter-spacing: 1px; text-transform: uppercase;
        }
        .badge::before {
          content: ''; width: 6px; height: 6px;
          background: #00f5d4; border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .section-label {
          font-size: 11px; letter-spacing: 3px;
          text-transform: uppercase; color: rgba(255,255,255,0.3);
          font-weight: 500;
        }
      `}</style>

      {/* Canvas Background */}
      <canvas ref={canvasRef} style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
      }} />

      {/* Glow Orbs */}
      <div className="glow-orb" style={{
        width: 600, height: 600, top: -200, left: -200,
        background: 'radial-gradient(circle, rgba(0,245,212,0.08) 0%, transparent 70%)',
      }} />
      <div className="glow-orb" style={{
        width: 500, height: 500, top: 200, right: -150,
        background: 'radial-gradient(circle, rgba(123,97,255,0.07) 0%, transparent 70%)',
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '20px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(2,8,17,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #00f5d4, #7b61ff)',
            borderRadius: 8, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 16, fontWeight: 700,
            color: '#020811',
          }}>P</div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16 }}>
            PlacePrep<span style={{ color: '#00f5d4' }}>.ai</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {['Resume', 'Interview', 'Coding', 'Dashboard'].map(item => (
            <span key={item} className="nav-link"
              onClick={() => navigate('/' + item.toLowerCase())}>
              {item}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn-ghost" style={{ padding: '10px 24px', fontSize: 14 }}
            onClick={() => navigate('/login')}>Login</button>
          <button className="btn-primary" style={{ padding: '10px 24px', fontSize: 14 }}
            onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column',
        textAlign: 'center', padding: '120px 24px 80px',
      }}>
        <div className={`fade-up d1 ${visible ? 'visible' : ''}`}>
          <div className="badge">AI-Powered Placement Platform</div>
        </div>

        <h1 className={`fade-up d2 ${visible ? 'visible' : ''}`} style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(42px, 7vw, 80px)',
          fontWeight: 700, lineHeight: 1.1,
          marginTop: 32, marginBottom: 24,
          letterSpacing: '-2px',
        }}>
          Land Your<br />
          <span style={{
            background: 'linear-gradient(135deg, #00f5d4 0%, #7b61ff 50%, #ff6b6b 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {displayed}
          </span>
          <span className="cursor-blink" />
        </h1>

        <p className={`fade-up d3 ${visible ? 'visible' : ''}`} style={{
          fontSize: 18, color: 'rgba(255,255,255,0.45)',
          maxWidth: 520, lineHeight: 1.7, marginBottom: 48,
        }}>
          Resume analysis, AI mock interviews, coding practice — one platform
          built to get students placed at top companies.
        </p>

        <div className={`fade-up d4 ${visible ? 'visible' : ''}`}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn-primary" onClick={() => navigate('/register')}>
            Start for Free →
          </button>
          <button className="btn-ghost" onClick={() => navigate('/dashboard')}>
            View Demo
          </button>
        </div>

        {/* Floating terminal preview */}
        <div className={`fade-up d5 ${visible ? 'visible' : ''}`} style={{
          marginTop: 80, width: '100%', maxWidth: 680,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, overflow: 'hidden',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            padding: '12px 20px',
            display: 'flex', alignItems: 'center', gap: 8,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            {['#ff6b6b', '#ffd166', '#00f5d4'].map((c, i) => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8,
              }} />
            ))}
            <span style={{ marginLeft: 8, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
              ai-analysis / resume.pdf
            </span>
          </div>
          <div style={{ padding: '24px 28px', fontFamily: 'monospace', fontSize: 13, textAlign: 'left' }}>
            {[
              { label: '→ Analyzing resume...', color: '#00f5d4' },
              { label: '✓ Skills found: React, Node.js, Python, MongoDB', color: '#7b61ff' },
              { label: '✓ Resume Score: 78/100', color: '#00f5d4' },
              { label: '⚠ Missing: Docker, System Design, TypeScript', color: '#ffd166' },
              { label: '→ Generating interview questions...', color: '#00f5d4' },
              { label: '✓ 12 questions ready for Frontend Developer role', color: '#7b61ff' },
            ].map((line, i) => (
              <div key={i} style={{
                color: line.color, marginBottom: 8, opacity: 0.9,
                animation: `fadeIn 0.5s ease ${i * 0.3}s both`,
              }}>
                {line.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        }}>
          {STATS.map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 32, fontWeight: 700,
                background: 'linear-gradient(135deg, #00f5d4, #7b61ff)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: 6,
              }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1100, margin: '0 auto',
        padding: '120px 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Everything you need</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 700, letterSpacing: '-1.5px',
          }}>
            One platform.<br />
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Complete preparation.</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
        }}>
          {FEATURES.map((f, i) => (
            <div key={i}
              className="feature-card"
              style={{ '--card-color': f.color }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(f.path)}>

              <div style={{
                width: 48, height: 48,
                background: `${f.color}15`,
                border: `1px solid ${f.color}30`,
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, color: f.color,
                marginBottom: 24, transition: 'all 0.3s ease',
                ...(hoveredCard === i ? {
                  background: `${f.color}25`,
                  boxShadow: `0 0 20px ${f.color}30`,
                } : {}),
              }}>{f.icon}</div>

              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 18, fontWeight: 600, marginBottom: 10,
              }}>{f.title}</h3>

              <p style={{
                fontSize: 14, color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.7, marginBottom: 24,
              }}>{f.desc}</p>

              <div style={{
                display: 'inline-block',
                background: `${f.color}12`,
                border: `1px solid ${f.color}25`,
                color: f.color, fontSize: 12, fontWeight: 500,
                padding: '4px 12px', borderRadius: 50,
              }}>{f.stat}</div>

              <div style={{
                position: 'absolute', bottom: 28, right: 28,
                color: 'rgba(255,255,255,0.2)',
                fontSize: 18, transition: 'all 0.3s ease',
                ...(hoveredCard === i ? { color: f.color, transform: 'translate(4px, -4px)' } : {}),
              }}>↗</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '80px 24px 120px',
        textAlign: 'center',
      }}>
        <div style={{
          maxWidth: 640, margin: '0 auto',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 28, padding: '64px 48px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -60, left: '50%',
            transform: 'translateX(-50%)',
            width: 300, height: 200,
            background: 'radial-gradient(circle, rgba(0,245,212,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div className="section-label" style={{ marginBottom: 20 }}>Get started today</div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 36, fontWeight: 700,
            letterSpacing: '-1px', marginBottom: 16,
          }}>Ready to get placed?</h2>
          <p style={{
            color: 'rgba(255,255,255,0.4)', fontSize: 16,
            lineHeight: 1.7, marginBottom: 36,
          }}>
            Join 12,000+ students who used PlacePrep.ai to land offers at Google, Microsoft, and top startups.
          </p>
          <button className="btn-primary" onClick={() => navigate('/register')}
            style={{ fontSize: 16, padding: '16px 48px' }}>
            Create Free Account →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '32px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
          PlacePrep<span style={{ color: '#00f5d4' }}>.ai</span>
        </span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>
          Built for students. Powered by AI.
        </span>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  )
}