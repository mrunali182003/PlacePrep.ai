import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

function ScoreRing({ score, visible }) {
  const size = 160, r = 66
  const circ = 2 * Math.PI * r
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (visible && score) {
      const t = setTimeout(() => setProgress(score / 100), 200)
      return () => clearTimeout(t)
    }
  }, [visible, score])
  const color = score >= 80 ? '#00f5d4' : score >= 60 ? '#ffd166' : '#ff6b6b'
  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto 24px' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={10}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress)}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)',
            filter: `drop-shadow(0 0 8px ${color}80)`,
          }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: "'Space Grotesk',sans-serif",
          fontSize: 40, fontWeight: 700, color, lineHeight: 1,
        }}>{score}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
          out of 100
        </div>
      </div>
    </div>
  )
}

export default function ResumeAnalyzer() {
  const [file, setFile]               = useState(null)
  const [dragging, setDragging]       = useState(false)
  const [result, setResult]           = useState(null)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [progress, setProgress]       = useState(0)
  const [resultVisible, setResultVisible] = useState(false)
  const inputRef = useRef()

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') { setFile(f); setError('') }
    else setError('Please upload a PDF file.')
  }

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const analyze = async () => {
    if (!file) return setError('Please select a PDF file.')
    setLoading(true); setError(''); setResult(null)
    setProgress(0); setResultVisible(false)

    const interval = setInterval(() => setProgress(p => Math.min(p + 8, 90)), 200)
    const formData = new FormData()
    formData.append('resume', file)

    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.post('http://localhost:5000/analyze-resume', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => setResult(data), 400)
      setTimeout(() => setResultVisible(true), 500)
    } catch {
      clearInterval(interval)
      setProgress(0)
      setError('Analysis failed. Make sure your backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#020811', color: '#e8eaf0',
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      padding: '100px 48px 60px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');
        * { box-sizing: border-box; }
        .card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; }
        .tag { display: inline-flex; align-items: center; font-size: 13px; font-weight: 500; padding: 6px 14px; border-radius: 50px; }
        .fu { opacity: 0; transform: translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .fu.v { opacity: 1; transform: none; }
        .d1 { transition-delay: .05s; }
        .d2 { transition-delay: .2s; }
        .d3 { transition-delay: .35s; }
        .d4 { transition-delay: .5s; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>AI-Powered</div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 40,
            fontWeight: 700, letterSpacing: '-1.5px', marginBottom: 12 }}>
            Resume Analyzer
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, lineHeight: 1.7 }}>
            Upload your resume and get instant AI feedback, skill extraction, and improvement tips.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          style={{
            border: `2px dashed ${dragging ? '#00f5d4' : file ? 'rgba(0,245,212,0.4)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 20, padding: '60px 40px', textAlign: 'center', cursor: 'pointer',
            background: dragging ? 'rgba(0,245,212,0.04)' : file ? 'rgba(0,245,212,0.02)' : 'rgba(255,255,255,0.015)',
            transition: 'all 0.3s ease', marginBottom: 20,
          }}>
          <input ref={inputRef} type="file" accept=".pdf"
            style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
          {file ? (
            <>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600,
                fontSize: 18, color: '#00f5d4', marginBottom: 6 }}>{file.name}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                {(file.size / 1024).toFixed(0)} KB · Click to change
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>⬆</div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600,
                fontSize: 18, marginBottom: 8 }}>Drop your resume here</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
                or click to browse · PDF only
              </div>
            </>
          )}
        </div>

        {/* Progress bar */}
        {loading && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
              fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
              <span>Analyzing with AI...</span>
              <span>{progress}%</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
              <div style={{
                height: '100%', width: `${progress}%`,
                background: 'linear-gradient(90deg, #00f5d4, #7b61ff)',
                borderRadius: 4, transition: 'width 0.3s ease',
                boxShadow: '0 0 10px rgba(0,245,212,0.5)',
              }} />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ color: '#ff6b6b', fontSize: 14, marginBottom: 16,
            padding: '12px 16px', background: 'rgba(255,107,107,0.08)',
            borderRadius: 12, border: '1px solid rgba(255,107,107,0.2)' }}>
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <button onClick={analyze} disabled={loading || !file} style={{
          width: '100%', padding: '16px', borderRadius: 14, border: 'none',
          cursor: file && !loading ? 'pointer' : 'not-allowed',
          background: file && !loading
            ? 'linear-gradient(135deg,#00f5d4,#00b4d8)'
            : 'rgba(255,255,255,0.06)',
          color: file && !loading ? '#020811' : 'rgba(255,255,255,0.3)',
          fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 16,
          transition: 'all 0.3s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          ...(file && !loading ? { boxShadow: '0 0 30px rgba(0,245,212,0.25)' } : {}),
        }}>
          {loading ? (
            <>
              <div style={{
                width: 18, height: 18,
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              Analyzing your resume...
            </>
          ) : '◈ Analyze Resume'}
        </button>

        {/* Results */}
        {result && (
          <div style={{ marginTop: 40 }}>

            {/* Score Card */}
            <div className={`card fu ${resultVisible ? 'v' : ''} d1`}
              style={{ padding: '40px', textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)', marginBottom: 24 }}>Resume Score</div>
              <ScoreRing score={result.score} visible={resultVisible} />
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                {result.score >= 80
                  ? '🌟 Excellent resume!'
                  : result.score >= 60
                  ? '👍 Good, with room to improve'
                  : '⚠ Needs significant improvement'}
              </div>
            </div>

            {/* Skills + Missing */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className={`card fu ${resultVisible ? 'v' : ''} d2`} style={{ padding: '28px' }}>
                <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
                  color: '#00f5d4', marginBottom: 16 }}>✓ Skills Found</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.skills?.map(s => (
                    <span key={s} className="tag" style={{
                      background: 'rgba(0,245,212,0.1)',
                      border: '1px solid rgba(0,245,212,0.25)', color: '#00f5d4',
                    }}>{s}</span>
                  ))}
                </div>
              </div>

              <div className={`card fu ${resultVisible ? 'v' : ''} d3`} style={{ padding: '28px' }}>
                <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
                  color: '#ff6b6b', marginBottom: 16 }}>✗ Missing Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.missing?.map(s => (
                    <span key={s} className="tag" style={{
                      background: 'rgba(255,107,107,0.1)',
                      border: '1px solid rgba(255,107,107,0.25)', color: '#ff6b6b',
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            {result.suggestions && (
              <div className={`card fu ${resultVisible ? 'v' : ''} d4`} style={{ padding: '28px' }}>
                <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
                  color: '#ffd166', marginBottom: 20 }}>→ Suggestions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {result.suggestions.map((s, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 16, alignItems: 'flex-start',
                      padding: '14px 18px',
                      background: 'rgba(255,209,102,0.05)', borderRadius: 12,
                      border: '1px solid rgba(255,209,102,0.1)',
                    }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: 'rgba(255,209,102,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, color: '#ffd166', fontWeight: 700, flexShrink: 0,
                      }}>{i + 1}</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                        {s}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Note if fallback was used */}
            {result.note && (
              <div style={{
                marginTop: 12, padding: '10px 16px', borderRadius: 10,
                background: 'rgba(255,209,102,0.06)',
                border: '1px solid rgba(255,209,102,0.15)',
                fontSize: 13, color: 'rgba(255,209,102,0.7)',
              }}>
                ℹ️ {result.note}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}