import { useRef, useState } from 'react'

const EMPTY = {
  name:'', email:'', phone:'', location:'', linkedin:'', github:'',
  summary:'',
  skills:'',
  experience:[{ company:'', role:'', duration:'', points:'' }],
  education:[{ college:'', degree:'', year:'', gpa:'' }],
  projects:[{ name:'', tech:'', desc:'' }],
}

export default function ResumeBuilder() {
  const [form, setForm]     = useState(EMPTY)
  const [preview, setPreview] = useState(false)
  const previewRef          = useRef()

  const upd = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const updArr = (arr, i, field, val) => {
    setForm(f => {
      const copy = [...f[arr]]
      copy[i] = { ...copy[i], [field]: val }
      return { ...f, [arr]: copy }
    })
  }

  const addRow = (arr, empty) => setForm(f => ({ ...f, [arr]: [...f[arr], empty] }))
  const delRow = (arr, i)    => setForm(f => ({ ...f, [arr]: f[arr].filter((_,j)=>j!==i) }))

  const downloadPDF = () => {
    const el = previewRef.current
    if (!el) return
    const w = window.open('', '_blank')
    w.document.write(`
      <html><head><title>${form.name} Resume</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: 'Arial', sans-serif; color:#1a1a1a; padding:32px; font-size:13px; line-height:1.5; }
        h1 { font-size:24px; font-weight:700; color:#0d0d0d; }
        .contact { color:#555; font-size:12px; margin-top:4px; display:flex; gap:16px; flex-wrap:wrap; }
        .contact a { color:#1a73e8; text-decoration:none; }
        .section { margin-top:20px; }
        .section-title {
          font-size:13px; font-weight:700; text-transform:uppercase;
          letter-spacing:1.5px; color:#333; border-bottom:2px solid #1a73e8;
          padding-bottom:4px; margin-bottom:12px;
        }
        .summary { color:#444; font-size:13px; line-height:1.6; }
        .skills-wrap { display:flex; flex-wrap:wrap; gap:8px; }
        .skill { background:#f0f4ff; color:#1a73e8; padding:4px 12px;
          border-radius:20px; font-size:12px; font-weight:500; }
        .exp-item, .edu-item, .proj-item { margin-bottom:14px; }
        .exp-header { display:flex; justify-content:space-between; align-items:baseline; }
        .exp-title { font-weight:700; font-size:14px; }
        .exp-sub { color:#555; font-size:12px; }
        .exp-date { color:#888; font-size:12px; }
        ul { margin-left:20px; margin-top:6px; }
        li { color:#444; font-size:12px; margin-bottom:3px; }
        .proj-name { font-weight:700; }
        .proj-tech { color:#1a73e8; font-size:12px; margin-bottom:4px; }
        .proj-desc { color:#444; font-size:12px; }
      </style>
      </head><body>
      ${el.innerHTML}
      </body></html>
    `)
    w.document.close()
    w.focus()
    setTimeout(() => { w.print(); w.close() }, 500)
  }

  const InputField = ({ label, value, onChange, placeholder, type='text' }) => (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:12, color:'rgba(255,255,255,0.4)',
        letterSpacing:1, textTransform:'uppercase', display:'block', marginBottom:6 }}>
        {label}
      </label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width:'100%', background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.1)', borderRadius:10,
          padding:'11px 14px', color:'#e8eaf0', fontSize:14,
          fontFamily:'inherit', outline:'none', transition:'border-color 0.2s',
        }}
        onFocus={e=>e.target.style.borderColor='rgba(0,245,212,0.4)'}
        onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}
      />
    </div>
  )

  const TextArea = ({ label, value, onChange, placeholder, rows=3 }) => (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:12, color:'rgba(255,255,255,0.4)',
        letterSpacing:1, textTransform:'uppercase', display:'block', marginBottom:6 }}>
        {label}
      </label>
      <textarea value={value} onChange={e=>onChange(e.target.value)}
        placeholder={placeholder} rows={rows}
        style={{
          width:'100%', background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.1)', borderRadius:10,
          padding:'11px 14px', color:'#e8eaf0', fontSize:14,
          fontFamily:'inherit', outline:'none', resize:'vertical',
          transition:'border-color 0.2s',
        }}
        onFocus={e=>e.target.style.borderColor='rgba(0,245,212,0.4)'}
        onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}
      />
    </div>
  )

  const Section = ({ title, color='#00f5d4', children }) => (
    <div style={{
      background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)',
      borderRadius:16, padding:24, marginBottom:16,
    }}>
      <div style={{ fontSize:11, letterSpacing:3, textTransform:'uppercase',
        color, marginBottom:20, fontWeight:500 }}>{title}</div>
      {children}
    </div>
  )

  return (
    <div style={{
      minHeight:'100vh', background:'#020811', color:'#e8eaf0',
      fontFamily:"'DM Sans','Segoe UI',sans-serif", paddingTop:70,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
        .add-btn {
          background:rgba(0,245,212,0.08); border:1px dashed rgba(0,245,212,0.3);
          color:#00f5d4; border-radius:10px; padding:10px; width:100%;
          cursor:pointer; font-family:inherit; font-size:13px; transition:all 0.2s;
        }
        .add-btn:hover { background:rgba(0,245,212,0.12); }
        .del-btn {
          background:rgba(255,107,107,0.08); border:1px solid rgba(255,107,107,0.2);
          color:#ff6b6b; border-radius:8px; padding:6px 12px;
          cursor:pointer; font-family:inherit; font-size:12px; transition:all 0.2s;
        }
        .del-btn:hover { background:rgba(255,107,107,0.15); }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        padding:'16px 40px', display:'flex', alignItems:'center', justifyContent:'space-between',
        background:'rgba(2,8,17,0.9)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.05)',
      }}>
        <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600 }}>
          PlacePrep<span style={{ color:'#00f5d4' }}>.ai</span>
          <span style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginLeft:12, fontWeight:400 }}>
            Resume Builder
          </span>
        </span>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => setPreview(!preview)} style={{
            background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
            color:'#e8eaf0', padding:'10px 20px', borderRadius:10,
            cursor:'pointer', fontSize:14, fontFamily:'inherit', transition:'all 0.2s',
          }}>{preview ? '✏️ Edit' : '👁 Preview'}</button>
          <button onClick={downloadPDF} style={{
            background:'linear-gradient(135deg,#00f5d4,#00b4d8)',
            color:'#020811', border:'none', padding:'10px 24px',
            borderRadius:10, fontWeight:600, cursor:'pointer',
            fontSize:14, fontFamily:'inherit',
          }}>⬇ Download PDF</button>
        </div>
      </nav>

      <div style={{ display:'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr',
        gap:0, maxWidth:preview?1400:800, margin:'0 auto', padding:'32px 24px' }}>

        {/* Form */}
        {!preview && (
          <div>
            <div style={{ marginBottom:32 }}>
              <div style={{ fontSize:11, letterSpacing:3, textTransform:'uppercase',
                color:'rgba(255,255,255,0.3)', marginBottom:10 }}>Resume Builder</div>
              <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:32,
                fontWeight:700, letterSpacing:'-1px' }}>Build your resume</h1>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:15, marginTop:8 }}>
                Fill in your details and download a professional PDF instantly.
              </p>
            </div>

            {/* Personal Info */}
            <Section title="Personal Information" color="#00f5d4">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                <InputField label="Full Name" value={form.name} onChange={v=>upd('name',v)} placeholder="Lalit Yelane"/>
                <InputField label="Email" value={form.email} onChange={v=>upd('email',v)} placeholder="lalit@gmail.com"/>
                <InputField label="Phone" value={form.phone} onChange={v=>upd('phone',v)} placeholder="+91 9876543210"/>
                <InputField label="Location" value={form.location} onChange={v=>upd('location',v)} placeholder="Pune, India"/>
                <InputField label="LinkedIn" value={form.linkedin} onChange={v=>upd('linkedin',v)} placeholder="linkedin.com/in/lalit"/>
                <InputField label="GitHub" value={form.github} onChange={v=>upd('github',v)} placeholder="github.com/lalit"/>
              </div>
            </Section>

            {/* Summary */}
            <Section title="Professional Summary" color="#7b61ff">
              <TextArea label="Summary" value={form.summary}
                onChange={v=>upd('summary',v)} rows={4}
                placeholder="Passionate Full Stack Developer with experience in React, Node.js, and MongoDB. Built AI-powered web applications..."/>
            </Section>

            {/* Skills */}
            <Section title="Skills" color="#00f5d4">
              <TextArea label="Skills (comma separated)" value={form.skills}
                onChange={v=>upd('skills',v)} rows={2}
                placeholder="React, Node.js, Python, MongoDB, JavaScript, TypeScript, Docker"/>
            </Section>

            {/* Experience */}
            <Section title="Work Experience" color="#ffd166">
              {form.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom:20, padding:16,
                  background:'rgba(255,255,255,0.02)', borderRadius:10,
                  border:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between',
                    alignItems:'center', marginBottom:12 }}>
                    <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>Experience {i+1}</span>
                    {form.experience.length > 1 &&
                      <button className="del-btn" onClick={()=>delRow('experience',i)}>Remove</button>}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                    <InputField label="Company" value={exp.company}
                      onChange={v=>updArr('experience',i,'company',v)} placeholder="Google"/>
                    <InputField label="Role" value={exp.role}
                      onChange={v=>updArr('experience',i,'role',v)} placeholder="Software Engineer"/>
                    <InputField label="Duration" value={exp.duration}
                      onChange={v=>updArr('experience',i,'duration',v)} placeholder="Jun 2023 - Present"/>
                  </div>
                  <TextArea label="Key Points (one per line)" value={exp.points}
                    onChange={v=>updArr('experience',i,'points',v)} rows={3}
                    placeholder="Built REST APIs using Node.js serving 10k+ users&#10;Reduced load time by 40% using Redis caching"/>
                </div>
              ))}
              <button className="add-btn"
                onClick={()=>addRow('experience',{company:'',role:'',duration:'',points:''})}>
                + Add Experience
              </button>
            </Section>

            {/* Education */}
            <Section title="Education" color="#00f5d4">
              {form.education.map((edu, i) => (
                <div key={i} style={{ marginBottom:16, padding:16,
                  background:'rgba(255,255,255,0.02)', borderRadius:10,
                  border:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between',
                    alignItems:'center', marginBottom:12 }}>
                    <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>Education {i+1}</span>
                    {form.education.length > 1 &&
                      <button className="del-btn" onClick={()=>delRow('education',i)}>Remove</button>}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                    <InputField label="College/University" value={edu.college}
                      onChange={v=>updArr('education',i,'college',v)} placeholder="MIT College of Engineering"/>
                    <InputField label="Degree" value={edu.degree}
                      onChange={v=>updArr('education',i,'degree',v)} placeholder="B.E. Computer Engineering"/>
                    <InputField label="Year" value={edu.year}
                      onChange={v=>updArr('education',i,'year',v)} placeholder="2020 - 2024"/>
                    <InputField label="CGPA/Percentage" value={edu.gpa}
                      onChange={v=>updArr('education',i,'gpa',v)} placeholder="8.5 CGPA"/>
                  </div>
                </div>
              ))}
              <button className="add-btn"
                onClick={()=>addRow('education',{college:'',degree:'',year:'',gpa:''})}>
                + Add Education
              </button>
            </Section>

            {/* Projects */}
            <Section title="Projects" color="#ff6b6b">
              {form.projects.map((proj, i) => (
                <div key={i} style={{ marginBottom:16, padding:16,
                  background:'rgba(255,255,255,0.02)', borderRadius:10,
                  border:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between',
                    alignItems:'center', marginBottom:12 }}>
                    <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>Project {i+1}</span>
                    {form.projects.length > 1 &&
                      <button className="del-btn" onClick={()=>delRow('projects',i)}>Remove</button>}
                  </div>
                  <InputField label="Project Name" value={proj.name}
                    onChange={v=>updArr('projects',i,'name',v)} placeholder="AI Placement Platform"/>
                  <InputField label="Tech Stack" value={proj.tech}
                    onChange={v=>updArr('projects',i,'tech',v)} placeholder="React, Node.js, Python, MongoDB"/>
                  <TextArea label="Description" value={proj.desc}
                    onChange={v=>updArr('projects',i,'desc',v)} rows={3}
                    placeholder="Built a full-stack AI platform that helps students prepare for placements through resume analysis and mock interviews."/>
                </div>
              ))}
              <button className="add-btn"
                onClick={()=>addRow('projects',{name:'',tech:'',desc:''})}>
                + Add Project
              </button>
            </Section>

            <button onClick={downloadPDF} style={{
              width:'100%', background:'linear-gradient(135deg,#00f5d4,#00b4d8)',
              color:'#020811', border:'none', padding:16, borderRadius:12,
              fontWeight:600, cursor:'pointer', fontSize:16, fontFamily:'inherit',
              marginTop:8,
            }}>⬇ Download PDF Resume</button>
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div style={{ position:'sticky', top:90, height:'calc(100vh - 110px)',
            overflowY:'auto', background:'white', borderRadius:16,
            boxShadow:'0 0 60px rgba(0,0,0,0.5)', marginLeft:24 }}>
            <div ref={previewRef} style={{
              padding:'40px 48px', fontFamily:'Arial,sans-serif',
              color:'#1a1a1a', fontSize:13, lineHeight:1.5,
            }}>
              {/* Header */}
              <h1 style={{ fontSize:26, fontWeight:700, color:'#0d0d0d', marginBottom:4 }}>
                {form.name || 'Your Name'}
              </h1>
              <div style={{ display:'flex', gap:16, flexWrap:'wrap',
                color:'#555', fontSize:12, marginBottom:20 }}>
                {form.email && <span>✉ {form.email}</span>}
                {form.phone && <span>📱 {form.phone}</span>}
                {form.location && <span>📍 {form.location}</span>}
                {form.linkedin && <span style={{ color:'#1a73e8' }}>🔗 {form.linkedin}</span>}
                {form.github && <span style={{ color:'#1a73e8' }}>💻 {form.github}</span>}
              </div>

              {/* Summary */}
              {form.summary && <>
                <div style={{ fontSize:12, fontWeight:700, textTransform:'uppercase',
                  letterSpacing:'1.5px', color:'#333', borderBottom:'2px solid #1a73e8',
                  paddingBottom:4, marginBottom:10 }}>Summary</div>
                <p style={{ color:'#444', marginBottom:18, fontSize:13 }}>{form.summary}</p>
              </>}

              {/* Skills */}
              {form.skills && <>
                <div style={{ fontSize:12, fontWeight:700, textTransform:'uppercase',
                  letterSpacing:'1.5px', color:'#333', borderBottom:'2px solid #1a73e8',
                  paddingBottom:4, marginBottom:12 }}>Skills</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:18 }}>
                  {form.skills.split(',').map((s,i) => s.trim() && (
                    <span key={i} style={{ background:'#f0f4ff', color:'#1a73e8',
                      padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:500 }}>
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </>}

              {/* Experience */}
              {form.experience.some(e=>e.company) && <>
                <div style={{ fontSize:12, fontWeight:700, textTransform:'uppercase',
                  letterSpacing:'1.5px', color:'#333', borderBottom:'2px solid #1a73e8',
                  paddingBottom:4, marginBottom:12 }}>Experience</div>
                {form.experience.filter(e=>e.company).map((exp,i) => (
                  <div key={i} style={{ marginBottom:14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <strong style={{ fontSize:14 }}>{exp.role}</strong>
                      <span style={{ color:'#888', fontSize:12 }}>{exp.duration}</span>
                    </div>
                    <div style={{ color:'#555', fontSize:12, marginBottom:4 }}>{exp.company}</div>
                    <ul style={{ marginLeft:18 }}>
                      {exp.points.split('\n').filter(Boolean).map((p,j) => (
                        <li key={j} style={{ color:'#444', fontSize:12, marginBottom:2 }}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>}

              {/* Education */}
              {form.education.some(e=>e.college) && <>
                <div style={{ fontSize:12, fontWeight:700, textTransform:'uppercase',
                  letterSpacing:'1.5px', color:'#333', borderBottom:'2px solid #1a73e8',
                  paddingBottom:4, marginBottom:12, marginTop:4 }}>Education</div>
                {form.education.filter(e=>e.college).map((edu,i) => (
                  <div key={i} style={{ marginBottom:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <strong style={{ fontSize:14 }}>{edu.degree}</strong>
                      <span style={{ color:'#888', fontSize:12 }}>{edu.year}</span>
                    </div>
                    <div style={{ color:'#555', fontSize:12 }}>{edu.college}</div>
                    {edu.gpa && <div style={{ color:'#888', fontSize:12 }}>{edu.gpa}</div>}
                  </div>
                ))}
              </>}

              {/* Projects */}
              {form.projects.some(p=>p.name) && <>
                <div style={{ fontSize:12, fontWeight:700, textTransform:'uppercase',
                  letterSpacing:'1.5px', color:'#333', borderBottom:'2px solid #1a73e8',
                  paddingBottom:4, marginBottom:12, marginTop:4 }}>Projects</div>
                {form.projects.filter(p=>p.name).map((proj,i) => (
                  <div key={i} style={{ marginBottom:12 }}>
                    <strong style={{ fontSize:14 }}>{proj.name}</strong>
                    {proj.tech && <div style={{ color:'#1a73e8', fontSize:12, marginBottom:3 }}>
                      Tech: {proj.tech}</div>}
                    {proj.desc && <div style={{ color:'#444', fontSize:12 }}>{proj.desc}</div>}
                  </div>
                ))}
              </>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}