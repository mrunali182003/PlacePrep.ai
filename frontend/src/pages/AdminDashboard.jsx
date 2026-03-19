import { useEffect, useState } from 'react'
import { getAdminStats } from '../services/api'

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!value) return
    const step = value / 40
    let current = 0
    const timer = setInterval(() => {
      current += step
      if (current >= value) { setDisplay(value); clearInterval(timer) }
      else setDisplay(Math.floor(current))
    }, 30)
    return () => clearInterval(timer)
  }, [value])
  return <>{display.toLocaleString()}</>
}

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]       = useState('overview')

  useEffect(() => {
    getAdminStats()
      .then(({ data }) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  const s = stats || {
    totalUsers: 0, totalResumes: 0, totalInterviews: 0,
    newUsersToday: 0, activeToday: 0,
    avgResumeScore: 0, avgInterviewScore: 0, recentUsers: [],
  }

  return (
    <div style={{ minHeight:'100vh', background:'#020811',
      color:'#e8eaf0', fontFamily:"'DM Sans','Segoe UI',sans-serif", paddingTop:80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        .card { background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.07); border-radius:20px; padding:24px; }
        .tab-btn { padding:9px 20px; border-radius:10px; font-size:13px; cursor:pointer; transition:all 0.2s; border:none; font-family:inherit; font-weight:500; }
        .tab-btn.active { background:rgba(0,245,212,0.1); color:#00f5d4; border:1px solid rgba(0,245,212,0.2); }
        .tab-btn:not(.active) { background:transparent; color:rgba(255,255,255,0.35); border:1px solid transparent; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .skeleton { background:rgba(255,255,255,0.06); border-radius:8px; animation:pulse 1.5s ease infinite; }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        padding:'18px 40px', display:'flex', alignItems:'center', justifyContent:'space-between',
        background:'rgba(2,8,17,0.9)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600 }}>
            PlacePrep<span style={{ color:'#00f5d4' }}>.ai</span>
          </span>
          <span style={{ fontSize:11, padding:'3px 10px', borderRadius:50,
            background:'rgba(255,107,107,0.1)', border:'1px solid rgba(255,107,107,0.2)',
            color:'#ff6b6b', fontWeight:600, letterSpacing:1 }}>ADMIN</span>
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {['overview','users'].map(t => (
            <button key={t} className={`tab-btn ${tab===t?'active':''}`}
              onClick={() => setTab(t)} style={{ textTransform:'capitalize' }}>{t}</button>
          ))}
        </div>
        {!loading && (
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>
            🟢 {s.activeToday} new today
          </div>
        )}
      </nav>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom:36 }}>
          <div style={{ fontSize:11, letterSpacing:3, textTransform:'uppercase',
            color:'rgba(255,255,255,0.3)', marginBottom:10 }}>Admin Panel</div>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif",
            fontSize:32, fontWeight:700, letterSpacing:'-1px' }}>Platform Overview</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', marginTop:6 }}>
            Real-time stats from your MongoDB database
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
          {loading ? (
            Array.from({length:4}).map((_,i) => (
              <div key={i} className="card">
                <div className="skeleton" style={{ height:12, width:'60%', marginBottom:12 }}/>
                <div className="skeleton" style={{ height:32, width:'40%' }}/>
              </div>
            ))
          ) : (
            [
              { label:'Total Users',      value:s.totalUsers,      color:'#00f5d4', icon:'👤' },
              { label:'Resumes Analyzed', value:s.totalResumes,    color:'#7b61ff', icon:'📄' },
              { label:'Interviews Done',  value:s.totalInterviews, color:'#ffd166', icon:'🎤' },
              { label:'New Users Today',  value:s.newUsersToday,   color:'#ff6b6b', icon:'🚀' },
            ].map((st,i) => (
              <div key={i} className="card">
                <div style={{ display:'flex', justifyContent:'space-between',
                  alignItems:'flex-start', marginBottom:12 }}>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)',
                    letterSpacing:1, textTransform:'uppercase' }}>{st.label}</div>
                  <div style={{ fontSize:20 }}>{st.icon}</div>
                </div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif",
                  fontSize:30, fontWeight:700, color:st.color }}>
                  <AnimatedNumber value={st.value}/>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Platform Health */}
        {(tab==='overview') && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
            <div className="card">
              <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase',
                color:'rgba(255,255,255,0.3)', marginBottom:20 }}>Platform Health</div>
              {loading ? (
                Array.from({length:3}).map((_,i) => (
                  <div key={i} style={{ marginBottom:16 }}>
                    <div className="skeleton" style={{ height:12, width:'50%', marginBottom:8 }}/>
                    <div className="skeleton" style={{ height:4, width:'100%' }}/>
                  </div>
                ))
              ) : (
                [
                  { label:'Avg Resume Score',    value:s.avgResumeScore,    max:100, color:'#00f5d4', display:`${s.avgResumeScore}/100` },
                  { label:'Avg Interview Score', value:s.avgInterviewScore*10, max:100, color:'#7b61ff', display:`${s.avgInterviewScore}/10` },
                  { label:'Users with Resumes',  value:s.totalResumes > 0 ? Math.round((s.totalResumes/Math.max(s.totalUsers,1))*100) : 0, max:100, color:'#ffd166', display:`${s.totalResumes > 0 ? Math.round((s.totalResumes/Math.max(s.totalUsers,1))*100) : 0}%` },
                ].map((m,i) => (
                  <div key={i} style={{ marginBottom:16 }}>
                    <div style={{ display:'flex', justifyContent:'space-between',
                      fontSize:13, marginBottom:6 }}>
                      <span style={{ color:'rgba(255,255,255,0.65)' }}>{m.label}</span>
                      <span style={{ color:m.color, fontWeight:500 }}>{m.display}</span>
                    </div>
                    <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:4 }}>
                      <div style={{
                        height:'100%', width:`${Math.min(m.value,100)}%`, borderRadius:4,
                        background:m.color, transition:'width 1s ease',
                        boxShadow:`0 0 8px ${m.color}60`,
                      }}/>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="card">
              <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase',
                color:'rgba(255,255,255,0.3)', marginBottom:20 }}>Quick Stats</div>
              {loading ? (
                <div className="skeleton" style={{ height:120, borderRadius:12 }}/>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  {[
                    { label:'New Users',        value:s.newUsersToday,   color:'#00f5d4' },
                    { label:'Total Resumes',    value:s.totalResumes,    color:'#7b61ff' },
                    { label:'Total Interviews', value:s.totalInterviews, color:'#ffd166' },
                    { label:'Total Users',      value:s.totalUsers,      color:'#ff6b6b' },
                  ].map((st,i) => (
                    <div key={i} style={{
                      padding:'14px 16px', borderRadius:12,
                      background:'rgba(255,255,255,0.03)',
                      border:`1px solid ${st.color}20`,
                    }}>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>{st.label}</div>
                      <div style={{ fontFamily:"'Space Grotesk',sans-serif",
                        fontSize:22, fontWeight:700, color:st.color }}>
                        <AnimatedNumber value={st.value}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Users Table */}
        {(tab==='overview' || tab==='users') && (
          <div className="card">
            <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase',
              color:'rgba(255,255,255,0.3)', marginBottom:20 }}>
              {s.recentUsers?.length > 0 ? 'Recent Users' : 'No users yet'}
            </div>
            {loading ? (
              Array.from({length:3}).map((_,i) => (
                <div key={i} style={{ display:'flex', gap:12, padding:'14px 0',
                  borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <div className="skeleton" style={{ width:36, height:36, borderRadius:8, flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div className="skeleton" style={{ height:13, width:'40%', marginBottom:8 }}/>
                    <div className="skeleton" style={{ height:11, width:'25%' }}/>
                  </div>
                </div>
              ))
            ) : s.recentUsers?.length > 0 ? (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ fontSize:11, letterSpacing:1, textTransform:'uppercase',
                      color:'rgba(255,255,255,0.25)' }}>
                      {['User','Email','Role','Resume Score','Joined'].map(h => (
                        <th key={h} style={{ textAlign:'left', padding:'8px 12px',
                          borderBottom:'1px solid rgba(255,255,255,0.06)', fontWeight:500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.recentUsers.map((u,i) => (
                      <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:14 }}>
                        <td style={{ padding:'14px 12px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{
                              width:32, height:32, borderRadius:8, flexShrink:0,
                              background:'rgba(0,245,212,0.1)', border:'1px solid rgba(0,245,212,0.2)',
                              display:'flex', alignItems:'center', justifyContent:'center',
                              fontSize:13, color:'#00f5d4', fontWeight:600,
                            }}>{u.name?.[0]}</div>
                            <span style={{ fontWeight:500 }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding:'14px 12px', color:'rgba(255,255,255,0.5)', fontSize:13 }}>{u.email}</td>
                        <td style={{ padding:'14px 12px' }}>
                          <span style={{ fontSize:12, padding:'3px 10px', borderRadius:50,
                            background:'rgba(123,97,255,0.1)', color:'#b39dff',
                            border:'1px solid rgba(123,97,255,0.2)' }}>{u.role}</span>
                        </td>
                        <td style={{ padding:'14px 12px' }}>
                          <span style={{ color: u.resumeScore>=80?'#00f5d4':u.resumeScore>=60?'#ffd166':'#ff6b6b', fontWeight:600 }}>
                            {u.resumeScore}/100
                          </span>
                        </td>
                        <td style={{ padding:'14px 12px', color:'rgba(255,255,255,0.35)', fontSize:12 }}>{u.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'40px 0',
                color:'rgba(255,255,255,0.3)', fontSize:14 }}>
                No users registered yet. Share your platform to get started!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}