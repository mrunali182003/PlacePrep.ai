import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboardStats } from '../services/api'

const ACTIONS = [
  { icon:'◈', label:'Resume Analyzer',  sub:'Upload & analyze',     path:'/resume',          color:'#00f5d4' },
  { icon:'◉', label:'Mock Interview',   sub:'AI-powered practice',  path:'/interview',       color:'#7b61ff' },
  { icon:'🎤', label:'Voice Interview', sub:'Speak your answers',   path:'/voice-interview', color:'#00b4d8' },
  { icon:'◎', label:'Coding Practice',  sub:'Solve problems',       path:'/coding',          color:'#ff6b6b' },
  { icon:'📄', label:'Resume Builder',  sub:'Generate PDF resume',  path:'/resume-builder',  color:'#7b61ff' },
  { icon:'💼', label:'Job Match',       sub:'Find jobs for you',    path:'/jobs',            color:'#ffd166' },
  { icon:'📊', label:'My Progress',     sub:'Track improvement',    path:'/progress',        color:'#00f5d4' },
  { icon:'🏆', label:'Leaderboard',     sub:'See top students',     path:'/leaderboard',     color:'#ffd166' },
]

function RingProgress({ value, size=80, stroke=6, color='#00f5d4', label, sublabel }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const [animated, setAnimated] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 400)
    return () => clearTimeout(t)
  }, [value])
  const offset = circ - (animated / 100) * circ
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition:'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
          fill="#e8eaf0" fontSize={size*0.22} fontWeight="600"
          style={{ transform:`rotate(90deg)`, transformOrigin:`${size/2}px ${size/2}px` }}>
          {animated}
        </text>
      </svg>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:13, fontWeight:500, color:'#e8eaf0' }}>{label}</div>
        {sublabel && <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{sublabel}</div>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

 useEffect(() => {
  const fetchStats = () => {
    getDashboardStats()
      .then(({ data }) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }

  fetchStats()

  // ✅ Refresh stats when user comes back to this tab
  window.addEventListener('focus', fetchStats)
  return () => window.removeEventListener('focus', fetchStats)
}, [])

  const resumeScore       = stats?.resumeScore       || 0
  const interviewCount    = stats?.interviewCount    || 0
  const avgInterviewScore = stats?.avgInterviewScore || 0
  const resumeCount       = stats?.resumeCount       || 0

  return (
    <div style={{
      minHeight:'100vh', background:'#020811',
      color:'#e8eaf0', fontFamily:"'DM Sans','Segoe UI',sans-serif",
      paddingTop:80,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        .card { background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07); border-radius:20px; padding:28px; }
        .action-card { background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:24px; cursor:pointer; transition:all 0.25s ease; display:flex; align-items:center; gap:16px; }
        .action-card:hover { background:rgba(255,255,255,0.045); transform:translateY(-2px); border-color:rgba(255,255,255,0.12); }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .skeleton { background:rgba(255,255,255,0.06); border-radius:8px; animation:pulse 1.5s ease infinite; }
      `}</style>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom:40 }}>
          <div style={{ fontSize:11, letterSpacing:3, textTransform:'uppercase',
            color:'rgba(255,255,255,0.3)', marginBottom:8 }}>Dashboard</div>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif",
            fontSize:36, fontWeight:700, letterSpacing:'-1px', margin:0 }}>
            {user ? `Welcome back, ${user.name?.split(' ')[0]} 👋` : 'Your Dashboard'}
          </h1>
          <p style={{ color:'rgba(255,255,255,0.4)', marginTop:8, fontSize:15 }}>
            {user?.role ? `Target Role: ${user.role}` : "Here's your placement prep overview"}
          </p>
        </div>

        {/* Progress Rings */}
        <div className="card" style={{
          marginBottom:20, display:'flex', alignItems:'center',
          justifyContent:'space-around', flexWrap:'wrap', gap:32, padding:36,
        }}>
          {loading ? (
            Array.from({length:4}).map((_,i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div className="skeleton" style={{ width:80, height:80, borderRadius:'50%', marginBottom:8 }}/>
                <div className="skeleton" style={{ width:60, height:12, margin:'0 auto' }}/>
              </div>
            ))
          ) : (
            <>
              <RingProgress value={resumeScore} color="#00f5d4" label="Resume Score" sublabel="out of 100" />
              <RingProgress value={Math.min(Math.round(parseFloat(avgInterviewScore)*10),100)} color="#7b61ff" label="Interview Score" sublabel={`avg ${avgInterviewScore}/10`} />
              <RingProgress value={Math.min(interviewCount*10,100)} color="#ff6b6b" label="Interviews" sublabel={`${interviewCount} done`} />
              <RingProgress value={Math.min(resumeCount*25,100)} color="#ffd166" label="Resumes" sublabel={`${resumeCount} analyzed`} />
            </>
          )}
        </div>

        {/* Stats Cards */}
        {!loading && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:20 }}>
            {[
              { label:'Resume Score',        value:`${resumeScore}/100`,        color:'#00f5d4' },
              { label:'Interviews Done',      value:interviewCount,              color:'#7b61ff' },
              { label:'Avg Interview Score',  value:`${avgInterviewScore}/10`,   color:'#ffd166' },
              { label:'Resumes Analyzed',     value:resumeCount,                 color:'#ff6b6b' },
            ].map((s,i) => (
              <div key={i} className="card" style={{ padding:20 }}>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:6, margin:'0 0 6px' }}>{s.label}</p>
                <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:24, fontWeight:700, color:s.color, margin:0 }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="card">
          <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase',
            color:'rgba(255,255,255,0.3)', marginBottom:20 }}>Quick Actions</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
            {ACTIONS.map((a,i) => (
              <div key={i} className="action-card" onClick={() => navigate(a.path)}>
                <div style={{
                  width:42, height:42, borderRadius:10,
                  background:`${a.color}15`, border:`1px solid ${a.color}30`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:18, color:a.color, flexShrink:0,
                }}>{a.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:500 }}>{a.label}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:2 }}>{a.sub}</div>
                </div>
                <div style={{ color:'rgba(255,255,255,0.2)' }}>→</div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {!loading && resumeScore === 0 && interviewCount === 0 && (
          <div style={{
            marginTop:20, padding:'28px 24px', borderRadius:16, textAlign:'center',
            background:'rgba(0,245,212,0.04)', border:'1px dashed rgba(0,245,212,0.2)',
          }}>
            <div style={{ fontSize:32, marginBottom:10 }}>🚀</div>
            <div style={{ fontWeight:500, marginBottom:6 }}>Start your prep journey!</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:16 }}>
              Upload your resume to get your first AI score
            </div>
            <button onClick={() => navigate('/resume')} style={{
              background:'linear-gradient(135deg,#00f5d4,#00b4d8)',
              color:'#020811', border:'none', padding:'10px 24px',
              borderRadius:50, fontWeight:600, cursor:'pointer', fontSize:14, fontFamily:'inherit',
            }}>Analyze Resume →</button>
          </div>
        )}
      </div>
    </div>
  )
}