import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) setDark(saved === 'dark')
  }, [])

  useEffect(() => {
    const root = document.documentElement

    if (dark) {
      root.setAttribute('data-theme', 'dark')
      document.body.style.background = '#020811'
      document.body.style.color = '#e8eaf0'
      root.style.setProperty('--bg-page',    '#020811')
      root.style.setProperty('--bg-card',    'rgba(255,255,255,0.025)')
      root.style.setProperty('--bg-input',   'rgba(255,255,255,0.04)')
      root.style.setProperty('--border-col', 'rgba(255,255,255,0.07)')
      root.style.setProperty('--text-main',  '#e8eaf0')
      root.style.setProperty('--text-muted', 'rgba(255,255,255,0.4)')
      root.style.setProperty('--nav-bg',     'rgba(2,8,17,0.85)')
      root.style.setProperty('--slate-800',  'rgba(255,255,255,0.025)')
      root.style.setProperty('--slate-900',  'rgba(0,0,0,0.3)')
    } else {
      root.setAttribute('data-theme', 'light')
      document.body.style.background = '#f0f4f8'
      document.body.style.color = '#1a1a2e'
      root.style.setProperty('--bg-page',    '#f0f4f8')
      root.style.setProperty('--bg-card',    'rgba(255,255,255,0.9)')
      root.style.setProperty('--bg-input',   'rgba(0,0,0,0.04)')
      root.style.setProperty('--border-col', 'rgba(0,0,0,0.1)')
      root.style.setProperty('--text-main',  '#1a1a2e')
      root.style.setProperty('--text-muted', 'rgba(0,0,0,0.5)')
      root.style.setProperty('--nav-bg',     'rgba(240,244,248,0.95)')
      root.style.setProperty('--slate-800',  'rgba(255,255,255,0.8)')
      root.style.setProperty('--slate-900',  'rgba(240,244,248,0.6)')
    }

    document.body.style.transition = 'background 0.3s ease, color 0.3s ease'
  }, [dark])

  const toggle = () => {
    setDark(d => {
      localStorage.setItem('theme', !d ? 'dark' : 'light')
      return !d
    })
  }

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

export function ThemeToggle() {
  const { dark, toggle } = useTheme()
  return (
    <button onClick={toggle} style={{
      background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)'}`,
      borderRadius: 50, padding: '7px 16px', cursor: 'pointer',
      fontSize: 14, transition: 'all 0.25s',
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: 'inherit',
      color: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    }}>
      {dark ? '☀️' : '🌙'}
      <span style={{ fontSize: 12 }}>{dark ? 'Light' : 'Dark'}</span>
    </button>
  )
}