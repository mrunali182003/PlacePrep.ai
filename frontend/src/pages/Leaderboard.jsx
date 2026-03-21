import { useEffect, useState } from 'react'
import { getLeaderboard, getMyRank } from '../services/api'

const MOCK_LEADERS = [
  { rank:1,  name:'Arjun Sharma',  score:9.4, interviews:12, resumeScore:88, badge:'🥇', college:'IIT Bombay' },
  { rank:2,  name:'Priya Patel',   score:9.1, interviews:10, resumeScore:82, badge:'🥈', college:'NIT Pune' },
  { rank:3,  name:'Rohit Kumar',   score:8.8, interviews:15, resumeScore:79, badge:'🥉', college:'BITS Pilani' },
  { rank:4,  name:'Sneha Joshi',   score:8.5, interviews:8,  resumeScore:75, badge:'',   college:'VIT Vellore' },
  { rank:5,  name:'Amit Singh',    score:8.2, interviews:11, resumeScore:71, badge:'',   college:'SRM Chennai' },
  { rank:6,  name:'Kavya Reddy',   score:8.0, interviews:9,  resumeScore:68, badge:'',   college:'COEP Pune' },
  { rank:7,  name:'Dev Mehta',     score:7.8, interviews:7,  resumeScore:65, badge:'',   college:'DTU Delhi' },
  { rank:8,  name:'Ananya Rao',    score:7.5, interviews:6,  resumeScore:72, badge:'',   college:'NSIT Delhi' },
  { rank:9,  name:'Vikram Nair',   score:7.2, interviews:8,  resumeScore:60, badge:'',   college:'MIT Manipal' },
  { rank:10, name:'Riya Gupta',    score:7.0, interviews:5,  resumeScore:55, badge:'',   college:'Symbiosis Pune' },
]

const CATEGORIES = ['Overall', 'Interview Score', 'Resume Score']

export default function Leaderboard() {
  const [leaders, setLeaders]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [myRank, setMyRank]     = useState('...')
  const [category, setCategory] = useState('Overall')
  const [isReal, setIsReal]     = useState(false)

  useEffect(() => {
    Promise.allSettled([getLeaderboard(), getMyRank()])
      .then(([lb, rank]) => {
        if (lb.status === 'fulfilled' && lb.value.data.length > 0) {
          setLeaders(lb.value.data)
          setIsReal(true)
        } else {
          setLeaders(MOCK_LEADERS)
        }
        if (rank.status === 'fulfilled') {
          setMyRank(rank.value.data.rank)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const sorted = [...leaders].sort((a, b) => {
    if (category === 'Resume Score')   return b.resumeScore - a.resumeScore
    if (category === 'Interview Score') return b.score - a.score
    return a.rank - b.rank
  })

  const getRankColor = (rank) => {
    if (rank === 1) return '#ffd166'
    if (rank === 2) return '#b0c4de'
    if (rank === 3) return '#cd7f32'
    return 'rgba(255,255,255,0.4)'
  }

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
        .leader-row { display:flex; align-items:center; gap:16px; padding:16px 20px; border-radius:14px; transition:all 0.2s; cursor:default; border:1px solid transparent; margin-bottom:8px; }
        .leader-row:hover { background:rgba(255,255,255,0.04); border-color:rgba(255,255,255,0.08); }
        .leader-row.top3 { background:rgba(255,209,102,0.04); border-color:rgba(255,209,102,0.12); }
        .cat-btn { padding:8px 18px; border-radius:50px; font-size:13px; cursor:pointer; transition:all 0.2s; border:1px solid transparent; font-family:inherit; font-weight:500; }
        .cat-btn.active { background:rgba(0,245,212,0.1); color:#00f5d4; border-color:rgba(0,245,212,0.3); }
        .cat-btn:not(.active) { background:transparent; color:rgba(255,255,255,0.4); border-color:rgba(255,255,255,0.08); }
        .cat-btn:not(.active):hover { color:rgba(255,255,255,0.7); }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .skeleton { background:rgba(255,255,255,0.06); border-radius:8px; animation:pulse 1.5s ease infinite; }
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
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {!isReal && (
            <span style={{ fontSize:12, color:'rgba(255,209,102,0.7)',
              background:'rgba(255,209,102,0.08)', border:'1px solid rgba(255,209,102,0.2)',
              padding:'4px 12px', borderRadius:50 }}>
              Demo data — analyze resume to appear here
            </span>
          )}
          <div style={{ background:'rgba(0,245,212,0.08)', border:'1px solid rgba(0,245,212,0.2)',
            padding:'6px 16px', borderRadius:50, fontSize:13, color:'#00f5d4' }}>
            Your Rank: <strong>#{myRank}</strong>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth:800, margin:'0 auto', padding:'40px 24px' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🏆</div>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:36, fontWeight:700,
            letterSpacing:'-1px', marginBottom:8 }}>Leaderboard</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:15 }}>
            Top students on PlacePrep.ai this week
          </p>
        </div>

        {/* Top 3 Podium */}
        {!loading && sorted.length >= 3 && (
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'center',
            gap:16, marginBottom:40 }}>
            {[sorted[1], sorted[0], sorted[2]].map((leader, i) => {
              const heights = [140, 180, 120]
              const colors  = ['#b0c4de','#ffd166','#cd7f32']
              return (
                <div key={i} style={{ textAlign:'center', flex:1, maxWidth:180 }}>
                  <div style={{
                    width:52, height:52, borderRadius:'50%', margin:'0 auto 8px',
                    background:`${colors[i]}20`, border:`2px solid ${colors[i]}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:20, fontWeight:700, color:colors[i],
                    fontFamily:"'Space Grotesk',sans-serif",
                  }}>{leader?.name?.[0] || '?'}</div>
                  <div style={{ fontSize:13, fontWeight:500, marginBottom:2 }}>
                    {leader?.name?.split(' ')[0]}
                  </div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>
                    {leader?.score}/10
                  </div>
                  <div style={{
                    height:heights[i], borderRadius:'12px 12px 0 0',
                    background:`linear-gradient(180deg,${colors[i]}30,${colors[i]}10)`,
                    border:`1px solid ${colors[i]}40`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:28, borderBottom:'none',
                  }}>
                    {['🥈','🥇','🥉'][i]}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Category filters */}
        <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} className={`cat-btn ${category===c?'active':''}`}
              onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        {/* Leaderboard table */}
        <div className="card" style={{ padding:'8px 0' }}>
          <div style={{
            display:'grid', gridTemplateColumns:'60px 1fr 100px 110px 100px',
            padding:'10px 20px', marginBottom:4,
            fontSize:11, letterSpacing:2, textTransform:'uppercase',
            color:'rgba(255,255,255,0.25)',
          }}>
            <span>Rank</span>
            <span>Student</span>
            <span style={{ textAlign:'center' }}>Interview</span>
            <span style={{ textAlign:'center' }}>Resume</span>
            <span style={{ textAlign:'center' }}>Badge</span>
          </div>

          {loading ? (
            Array.from({length:5}).map((_,i) => (
              <div key={i} style={{ display:'flex', gap:16, padding:'16px 20px', marginBottom:8 }}>
                <div className="skeleton" style={{ width:36, height:36, borderRadius:8, flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <div className="skeleton" style={{ height:14, width:'50%', marginBottom:8 }}/>
                  <div className="skeleton" style={{ height:11, width:'30%' }}/>
                </div>
              </div>
            ))
          ) : (
            sorted.map((leader, i) => (
              <div key={i} className={`leader-row ${leader.rank<=3?'top3':''}`}
                style={{ display:'grid', gridTemplateColumns:'60px 1fr 100px 110px 100px' }}>
                <div style={{
                  fontFamily:"'Space Grotesk',sans-serif", fontSize:16, fontWeight:700,
                  color:getRankColor(leader.rank),
                }}>
                  {leader.badge || `#${leader.rank}`}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{
                    width:36, height:36, borderRadius:10, flexShrink:0,
                    background:`hsl(${leader.rank*37%360},50%,20%)`,
                    border:`1px solid hsl(${leader.rank*37%360},50%,35%)`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:14, fontWeight:600, color:`hsl(${leader.rank*37%360},80%,70%)`,
                  }}>{leader.name?.[0]}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:500 }}>{leader.name}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{leader.college}</div>
                  </div>
                </div>
                <div style={{ textAlign:'center', fontSize:14, color:'#7b61ff', fontWeight:500 }}>
                  {leader.score}/10
                </div>
                <div style={{ textAlign:'center', fontSize:14, color:'#00f5d4', fontWeight:500 }}>
                  {leader.resumeScore}/100
                </div>
                <div style={{ textAlign:'center' }}>
                  <span style={{
                    fontSize:12, fontWeight:600, padding:'4px 10px', borderRadius:50,
                    background: leader.score>=9?'rgba(0,245,212,0.1)':leader.score>=8?'rgba(123,97,255,0.1)':'rgba(255,255,255,0.06)',
                    color: leader.score>=9?'#00f5d4':leader.score>=8?'#b39dff':'rgba(255,255,255,0.5)',
                  }}>
                    {leader.score>=9?'🔥 Elite':leader.score>=8?'⭐ Pro':'Rising'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* My rank */}
        <div style={{
          marginTop:20, padding:'16px 20px', borderRadius:14,
          background:'rgba(0,245,212,0.05)', border:'1px solid rgba(0,245,212,0.15)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{
              width:36, height:36, borderRadius:10,
              background:'rgba(0,245,212,0.15)', border:'1px solid rgba(0,245,212,0.3)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:14, color:'#00f5d4', fontWeight:600,
            }}>Y</div>
            <div>
              <div style={{ fontSize:14, fontWeight:500 }}>You</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>
                Keep improving to climb the ranks!
              </div>
            </div>
          </div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif",
            fontSize:20, fontWeight:700, color:'#00f5d4' }}>#{myRank}</div>
        </div>
      </div>
    </div>
  )
}