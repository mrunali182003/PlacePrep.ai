import { useEffect, useState } from 'react'
import { getJobs } from '../services/api'

export default function Jobs() {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('All')

  useEffect(() => {
    getJobs()
      .then(({ data }) => setJobs(data))
      .catch(() => setJobs(MOCK_JOBS))
      .finally(() => setLoading(false))
  }, [])

  const types = ['All', 'Full-time', 'Internship', 'Remote']
  const filtered = filter === 'All' ? jobs : jobs.filter(j =>
    filter === 'Remote'
      ? j.location?.toLowerCase().includes('remote')
      : j.type === filter
  )

  return (
    <div style={{ minHeight:'100vh', background:'#020811',
      color:'#e8eaf0', fontFamily:"'DM Sans','Segoe UI',sans-serif",
      paddingTop:80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .job-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 24px;
          transition: all 0.25s ease; cursor: pointer;
        }
        .job-card:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(0,245,212,0.2);
          transform: translateY(-2px);
        }
        .filter-pill {
          padding: 8px 18px; border-radius: 50px; font-size: 13px;
          cursor: pointer; transition: all 0.2s; border: 1px solid transparent;
          font-family: inherit; font-weight: 500;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .skeleton { background: rgba(255,255,255,0.06); border-radius: 8px;
          animation: pulse 1.5s ease infinite; }
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
        <div style={{ display:'flex', gap:28 }}>
          {[['Resume','/resume'],['Interview','/interview'],['Coding','/coding'],['Jobs','/jobs']].map(([l,p])=>(
            <span key={l} onClick={()=>window.location.href=p} style={{
              fontSize:14, color: l==='Jobs'?'#00f5d4':'rgba(255,255,255,0.45)',
              cursor:'pointer',
            }}>{l}</span>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom:40 }}>
          <div style={{ fontSize:11, letterSpacing:3, textTransform:'uppercase',
            color:'rgba(255,255,255,0.3)', marginBottom:10 }}>Job Recommendations</div>
          <h1 style={{ fontFamily:"'Space Grotesk',sans-serif",
            fontSize:36, fontWeight:700, letterSpacing:'-1px', marginBottom:10 }}>
            Jobs matched for you
          </h1>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:15 }}>
            Based on your resume skills and target role
          </p>
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:8, marginBottom:32, flexWrap:'wrap' }}>
          {types.map(t => (
            <button key={t} className="filter-pill" onClick={() => setFilter(t)}
              style={{
                background: filter===t ? 'rgba(0,245,212,0.1)' : 'transparent',
                borderColor: filter===t ? 'rgba(0,245,212,0.4)' : 'rgba(255,255,255,0.1)',
                color: filter===t ? '#00f5d4' : 'rgba(255,255,255,0.5)',
              }}>{t}</button>
          ))}
          <div style={{ marginLeft:'auto', fontSize:13, color:'rgba(255,255,255,0.3)',
            display:'flex', alignItems:'center' }}>
            {filtered.length} jobs found
          </div>
        </div>

        {/* Job cards */}
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ background:'rgba(255,255,255,0.025)',
                border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:24 }}>
                <div className="skeleton" style={{ height:20, width:'60%', marginBottom:12 }}/>
                <div className="skeleton" style={{ height:14, width:'40%', marginBottom:8 }}/>
                <div className="skeleton" style={{ height:14, width:'30%' }}/>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
            {filtered.map((job, i) => (
              <div key={i} className="job-card"
                onClick={() => job.url && window.open(job.url, '_blank')}>

                {/* Company avatar */}
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                  <div style={{
                    width:42, height:42, borderRadius:10, flexShrink:0,
                    background:`hsl(${i*47%360},60%,25%)`,
                    border:`1px solid hsl(${i*47%360},60%,35%)`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:16, fontWeight:700, color:`hsl(${i*47%360},80%,70%)`,
                    fontFamily:"'Space Grotesk',sans-serif",
                  }}>
                    {job.company?.[0] || 'C'}
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:500, color:'#e8eaf0' }}>
                      {job.company}
                    </div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>
                      {job.location}
                    </div>
                  </div>
                  <div style={{ marginLeft:'auto' }}>
                    <span style={{
                      fontSize:11, padding:'3px 10px', borderRadius:50,
                      background: job.type==='Internship'
                        ? 'rgba(255,209,102,0.1)' : 'rgba(0,245,212,0.1)',
                      color: job.type==='Internship' ? '#ffd166' : '#00f5d4',
                      border: `1px solid ${job.type==='Internship' ? 'rgba(255,209,102,0.2)' : 'rgba(0,245,212,0.2)'}`,
                    }}>{job.type}</span>
                  </div>
                </div>

                <h3 style={{ fontFamily:"'Space Grotesk',sans-serif",
                  fontSize:16, fontWeight:600, marginBottom:8, lineHeight:1.3 }}>
                  {job.title}
                </h3>

                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                  marginTop:16 }}>
                  <div style={{ fontSize:13, color:'#00f5d4', fontWeight:500 }}>
                    {job.salary}
                  </div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>
                    Apply →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{
          marginTop:48, textAlign:'center', padding:'40px 24px',
          background:'rgba(255,255,255,0.025)',
          border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:20,
        }}>
          <div style={{ fontSize:18, fontWeight:600, fontFamily:"'Space Grotesk',sans-serif",
            marginBottom:8 }}>Want more personalized results?</div>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>
            Upload your resume to get jobs matched to your exact skills
          </p>
          <button onClick={() => window.location.href='/resume'}
            style={{
              background:'linear-gradient(135deg,#00f5d4,#00b4d8)',
              color:'#020811', border:'none', padding:'12px 32px',
              borderRadius:50, fontWeight:600, cursor:'pointer',
              fontSize:14, fontFamily:'inherit',
            }}>
            Analyze My Resume →
          </button>
        </div>
      </div>
    </div>
  )
}

const MOCK_JOBS = [
  { title:'Frontend Developer', company:'TCS', location:'Pune', salary:'₹4L - ₹6L', type:'Full-time', url:'https://www.naukri.com' },
  { title:'Junior React Developer', company:'Infosys', location:'Bangalore', salary:'₹5L - ₹8L', type:'Full-time', url:'https://www.naukri.com' },
  { title:'Full Stack Intern', company:'Startup', location:'Remote', salary:'₹15k/mo', type:'Internship', url:'https://internshala.com' },
  { title:'Node.js Developer', company:'Wipro', location:'Hyderabad', salary:'₹4L - ₹7L', type:'Full-time', url:'https://www.naukri.com' },
  { title:'MERN Stack Developer', company:'HCL', location:'Noida', salary:'₹5L - ₹9L', type:'Full-time', url:'https://www.naukri.com' },
  { title:'React Intern', company:'MNC', location:'Remote', salary:'₹20k/mo', type:'Internship', url:'https://internshala.com' },
]