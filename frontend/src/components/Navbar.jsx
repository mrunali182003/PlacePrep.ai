import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ThemeToggle } from '../ThemeContext'

export default function Navbar() {
  const [moreOpen, setMoreOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '18px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(2,8,17,0.85)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, color: '#e8eaf0' }}>
          PlacePrep<span style={{ color: '#00f5d4' }}>.ai</span>
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {[
          ['Resume',      '/resume'],
          ['Interview',   '/interview'],
          ['Coding',      '/coding'],
          ['Jobs',        '/jobs'],
          ['Dashboard',   '/dashboard'],
          ['Leaderboard', '/leaderboard'],
          ['Progress',    '/progress'],
        ].map(([label, path]) => (
          <Link key={label} to={path} style={{
            fontSize: 13, color: 'rgba(255,255,255,0.45)',
            textDecoration: 'none', padding: '6px 10px', borderRadius: 8,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.target.style.color='#00f5d4'; e.target.style.background='rgba(0,245,212,0.06)' }}
          onMouseLeave={e => { e.target.style.color='rgba(255,255,255,0.45)'; e.target.style.background='transparent' }}
          >{label}</Link>
        ))}

        {/* More Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            style={{
              fontSize: 13, color: moreOpen ? '#00f5d4' : 'rgba(255,255,255,0.45)',
              background: moreOpen ? 'rgba(0,245,212,0.08)' : 'transparent',
              border: 'none', padding: '6px 10px', borderRadius: 8,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
            More {moreOpen ? '▴' : '▾'}
          </button>

          {moreOpen && (
            <>
              {/* Backdrop to close */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                onClick={() => setMoreOpen(false)}
              />
              <div style={{
                position: 'absolute', top: '100%', left: 0, marginTop: 8,
                background: 'rgba(8,16,32,0.98)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14, padding: 8, minWidth: 210,
                backdropFilter: 'blur(20px)', zIndex: 200,
                boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              }}>
                {[
                  ['🎤', 'Voice Interview',  '/voice-interview', '#00f5d4'],
                  ['📄', 'Resume Builder',   '/resume-builder',  '#7b61ff'],
                  ['🏆', 'Leaderboard',      '/leaderboard',     '#ffd166'],
                  ['👨‍💼', 'Admin Dashboard', '/admin',           '#ff6b6b'],
                ].map(([icon, label, path, color]) => (
                  <div key={label}
                    onClick={() => { navigate(path); setMoreOpen(false) }}
                    style={{
                      padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                      fontSize: 14, color: 'rgba(255,255,255,0.65)',
                      transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${color}15`
                      e.currentTarget.style.color = color
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right side */}
<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
  <ThemeToggle />

  {JSON.parse(localStorage.getItem('user') || 'null') ? (
    <button
      onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login' }}
      style={{
        fontSize: 14, color: '#ff6b6b',
        background: 'rgba(255,107,107,0.08)',
        border: '1px solid rgba(255,107,107,0.2)',
        borderRadius: 50, padding: '8px 20px',
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => e.target.style.background='rgba(255,107,107,0.18)'}
      onMouseLeave={e => e.target.style.background='rgba(255,107,107,0.08)'}
    >
      Sign Out
    </button>
  ) : (
    <>
      <Link to="/login" style={{
        fontSize: 14, color: 'rgba(255,255,255,0.45)',
        textDecoration: 'none', padding: '8px 18px',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 50,
      }}>Login</Link>
      <Link to="/register" style={{
        fontSize: 14, fontWeight: 600, color: '#020811',
        textDecoration: 'none', padding: '8px 20px',
        background: 'linear-gradient(135deg, #00f5d4, #00b4d8)',
        borderRadius: 50,
      }}>Get Started</Link>
    </>
  )}
</div>

    </nav>
  )
}