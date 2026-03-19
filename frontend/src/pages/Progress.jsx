import { useEffect, useState } from 'react'
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    PolarAngleAxis,
    PolarGrid,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts'
import { getDashboardStats, getInterviewHistory, getResumeHistory } from '../services/api'


const MOCK_INTERVIEWS = [
  { date:'Mar 1',  score:5.5, role:'Frontend' },
  { date:'Mar 4',  score:6.0, role:'Frontend' },
  { date:'Mar 7',  score:6.8, role:'Full Stack' },
  { date:'Mar 10', score:7.2, role:'Full Stack' },
  { date:'Mar 13', score:7.0, role:'Backend' },
  { date:'Mar 16', score:7.8, role:'Backend' },
  { date:'Mar 18', score:8.1, role:'Frontend' },
]

const MOCK_RESUMES = [
  { date:'Mar 1',  score:60 },
  { date:'Mar 8',  score:68 },
  { date:'Mar 15', score:72 },
  { date:'Mar 18', score:78 },
]

const SKILLS_RADAR = [
  { skill:'React',         score:82 },
  { skill:'Node.js',       score:68 },
  { skill:'Python',        score:74 },
  { skill:'MongoDB',       score:55 },
  { skill:'System Design', score:30 },
  { skill:'DSA',           score:65 },
]

const CustomTooltip = ({ active, payload, label, unit='' }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background:'rgba(2,8,17,0.95)', border:'1px solid rgba(255,255,255,0.1)',
      borderRadius:10, padding:'10px 14px', fontSize:13,
    }}>
      <div style={{ color:'rgba(255,255,255,0.5)', marginBottom:4 }}>{label}</div>
      <div style={{ color:'#00f5d4', fontWeight:600 }}>
        {payload[0].value}{unit}
      </div>
    </div>
  )
}

export default function Progress() {
  const [stats, setStats]         = useState(null)
  const [interviews, setInterviews] = useState(MOCK_INTERVIEWS)
  const [resumes, setResumes]     = useState(MOCK_RESUMES)
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState('overview')

 useEffect(() => {
  Promise.allSettled([
    getDashboardStats(),
    getInterviewHistory(),
    getResumeHistory(),
  ]).then(([s, iv, rv]) => {
    if (s.status === 'fulfilled') setStats(s.value.data)

    // ✅ Use real interview data if available, otherwise mock
    if (iv.status === 'fulfilled' && iv.value.data.length > 0) {
      setInterviews(iv.value.data.map(i => ({
        date: new Date(i.date).toLocaleDateString('en', { month:'short', day:'numeric' }),
        score: parseFloat(i.avgScore) || 0,
        role: i.role,
      })))
    } else {
      setInterviews(MOCK_INTERVIEWS)
    }

    // ✅ Use real resume data if available, otherwise mock
    if (rv.status === 'fulfilled' && rv.value.data.length > 0) {
      setResumes(rv.value.data.map(r => ({
        date: new Date(r.date).toLocaleDateString('en', { month:'short', day:'numeric' }),
        score: r.score,
      })))
    } else {
      setResumes(MOCK_RESUMES)
    }

    setLoading(false)
  })
}, [])

  const avgInterview = interviews.length
    ? (interviews.reduce((a,b)=>a+b.score,0)/interviews.length).toFixed(1) : 0
  const latestResume = resumes[resumes.length-1]?.score || 0
  const improvement  = interviews.length >= 2
    ? (interviews[interviews.length-1].score - interviews[0].score).toFixed(1) : 0

  const TABS = ['overview','interviews','resume','skills']

  return (
    <div style={{ minHeight:'100vh', background:'#020811',
      color:'#e8eaf0', fontFamily:"'DM Sans','Segoe UI',sans-serif", paddingTop:80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        .card { background:rgba(255,255,255,0.025);
          border:1px solid rgba(255,255,255,0.07); border-radius:20px; padding:28px; }
        .tab-btn { padding:9px 20px; border-radius:10px; font-size:13px; cursor:pointer;
          transition:all 0.2s; border:none; font-family:inherit; font-weight:500; }
        .tab-btn.active { background:rgba(0,245,212,0.1); color:#00f5d4;
          border:1px solid rgba(0,245,212,0.2); }
        .tab-btn:not(.active) { background:transparent; color:rgba(255,255,255,0.35);
          border:1px solid transparent; }
        .tab-btn:not(.active):hover { color:rgba(255,255,255,0.6); }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .skeleton { background:rgba(255,255,255,0.06); border-radius:8px;
          animation:pulse 1.5s ease infinite; }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        padding:'18px 40px', display:'flex', alignItems:'center', justifyContent:'space-between',
        background:'rgba(2,8,17,0.85)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.05)',
      }}>
        <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600 }}>
          PlacePrep<span style={{ color:'#00f5d4' }}>.ai</span>
        </span>
        <div style={{ display:'flex', gap:8 }}>
          {TABS.map(t => (
            <button key={t} className={`tab-btn ${tab===t?'active':''}`}
              onClick={()=>setTab(t)} style={{ textTransform:'capitalize' }}>
              {t}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom:40 }}>
          <div style={{ fontSize:11, letterSpacing:3, textTransform:'uppercase',
            color:'rgba(255,255,255,0.3)', marginBottom:10 }}>Progress Tracker</div>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif",
            fontSize:36, fontWeight:700, letterSpacing:'-1px' }}>
            Your Growth Dashboard
          </h1>
          <p style={{ color:'rgba(255,255,255,0.4)', marginTop:8, fontSize:15 }}>
            Track your improvement across interviews, resume, and coding.
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
          {[
            { label:'Resume Score',       value:`${latestResume}/100`, color:'#00f5d4' },
            { label:'Avg Interview Score', value:`${avgInterview}/10`,  color:'#7b61ff' },
            { label:'Interviews Done',     value:interviews.length,     color:'#ffd166' },
            { label:'Score Improvement',   value:`+${improvement}`,     color:'#00f5d4' },
          ].map((s,i) => (
            <div key={i} className="card" style={{ padding:24 }}>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>{s.label}</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif",
                fontSize:28, fontWeight:700, color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {(tab==='overview' || tab==='interviews') && (
          <div className="card" style={{ marginBottom:24 }}>
            <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase',
              color:'rgba(255,255,255,0.3)', marginBottom:24 }}>
              Interview Score Trend
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={interviews}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00f5d4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00f5d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                <XAxis dataKey="date" tick={{ fill:'rgba(255,255,255,0.4)', fontSize:12 }}
                  axisLine={false} tickLine={false}/>
                <YAxis domain={[0,10]} tick={{ fill:'rgba(255,255,255,0.4)', fontSize:12 }}
                  axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip unit="/10"/>}/>
                <Area type="monotone" dataKey="score" stroke="#00f5d4" strokeWidth={2.5}
                  fill="url(#scoreGrad)" dot={{ fill:'#00f5d4', r:4 }}
                  activeDot={{ r:6, fill:'#00f5d4' }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {(tab==='overview' || tab==='resume') && (
          <div className="card" style={{ marginBottom:24 }}>
            <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase',
              color:'rgba(255,255,255,0.3)', marginBottom:24 }}>
              Resume Score History
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={resumes}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                <XAxis dataKey="date" tick={{ fill:'rgba(255,255,255,0.4)', fontSize:12 }}
                  axisLine={false} tickLine={false}/>
                <YAxis domain={[0,100]} tick={{ fill:'rgba(255,255,255,0.4)', fontSize:12 }}
                  axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip unit="/100"/>}/>
                <Bar dataKey="score" fill="#7b61ff" radius={[6,6,0,0]} maxBarSize={60}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {(tab==='overview' || tab==='skills') && (
          <div className="card" style={{ marginBottom:24 }}>
            <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase',
              color:'rgba(255,255,255,0.3)', marginBottom:24 }}>
              Skill Radar
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24,
              alignItems:'center' }}>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={SKILLS_RADAR}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)"/>
                  <PolarAngleAxis dataKey="skill"
                    tick={{ fill:'rgba(255,255,255,0.5)', fontSize:12 }}/>
                  <Radar dataKey="score" stroke="#00f5d4" fill="#00f5d4" fillOpacity={0.15}
                    strokeWidth={2}/>
                </RadarChart>
              </ResponsiveContainer>
              <div>
                {SKILLS_RADAR.map((s,i) => (
                  <div key={i} style={{ marginBottom:14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between',
                      marginBottom:6, fontSize:13 }}>
                      <span style={{ color:'rgba(255,255,255,0.7)' }}>{s.skill}</span>
                      <span style={{ color:'#00f5d4', fontWeight:500 }}>{s.score}%</span>
                    </div>
                    <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:4 }}>
                      <div style={{
                        height:'100%', width:`${s.score}%`, borderRadius:4,
                        background:`linear-gradient(90deg, ${s.score>70?'#00f5d4':s.score>50?'#ffd166':'#ff6b6b'}, ${s.score>70?'#7b61ff':'#ff6b6b'})`,
                        transition:'width 1s ease',
                        boxShadow:`0 0 8px ${s.score>70?'rgba(0,245,212,0.4)':'rgba(255,107,107,0.3)'}`,
                      }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab==='interviews' && (
          <div className="card">
            <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase',
              color:'rgba(255,255,255,0.3)', marginBottom:20 }}>Interview History</div>
            {interviews.map((iv,i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'14px 0', borderBottom: i<interviews.length-1
                  ?'1px solid rgba(255,255,255,0.05)':'none',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{
                    width:36, height:36, borderRadius:8, flexShrink:0,
                    background:'rgba(123,97,255,0.12)', border:'1px solid rgba(123,97,255,0.25)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:14, color:'#b39dff',
                  }}>◉</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:500 }}>{iv.role}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>{iv.date}</div>
                  </div>
                </div>
                <div style={{
                  fontSize:16, fontWeight:700, fontFamily:"'Space Grotesk',sans-serif",
                  color: iv.score>=7?'#00f5d4':iv.score>=5?'#ffd166':'#ff6b6b',
                }}>{iv.score}/10</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}