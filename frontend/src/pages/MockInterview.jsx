import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

const ROLES = ['Frontend Developer', 'Backend Developer', 'Full Stack', 'Data Analyst', 'DevOps Engineer', 'React Developer']

const AVATAR_LINES = ['Ready to interview you.', 'Ask me anything.', 'Let\'s begin.']

export default function MockInterview() {
  const [role, setRole] = useState('Frontend Developer')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const [avatarLine, setAvatarLine] = useState(0)
  const bottomRef = useRef()

  useEffect(() => {
    const t = setInterval(() => setAvatarLine(l => (l + 1) % AVATAR_LINES.length), 3000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const startInterview = async () => {
    setStarted(true); setLoading(true); setMessages([])
    try {
      const { data } = await axios.post('http://localhost:5000/interview', { answer: '', role, action: 'start' })
      setMessages([{ from: 'ai', text: data.question || data.response || 'Tell me about yourself.' }])
    } catch {
      setMessages([{ from: 'ai', text: `Hello! I'll be your ${role} interviewer today. Tell me about yourself.` }])
    } finally { setLoading(false) }
  }

  const sendAnswer = async () => {
    if (!input.trim() || loading) return
    const text = input.trim()
    setMessages(m => [...m, { from: 'user', text }]); setInput(''); setLoading(true)
    try {
      const { data } = await axios.post('http://localhost:5000/interview', { answer: text, role, action: 'answer' })
      setMessages(m => [...m, { from: 'ai', text: data.feedback || data.response, score: data.score, next: data.question }])
    } catch {
      setMessages(m => [...m, { from: 'ai', text: 'Good answer! Let me ask you the next question. What are your core technical strengths?' }])
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#020811', color: '#e8eaf0', fontFamily: "'DM Sans','Segoe UI',sans-serif", display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');
        *{box-sizing:border-box}
        .msg-ai{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:4px 18px 18px 18px}
        .msg-user{background:linear-gradient(135deg,rgba(123,97,255,0.3),rgba(0,180,216,0.2));border:1px solid rgba(123,97,255,0.3);border-radius:18px 4px 18px 18px}
        .role-btn{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.5);padding:8px 18px;border-radius:50px;cursor:pointer;font-size:13px;transition:all .2s ease;font-family:inherit}
        .role-btn:hover{border-color:rgba(123,97,255,0.4);color:#a89cff}
        .role-btn.active{background:rgba(123,97,255,0.15);border-color:rgba(123,97,255,0.5);color:#a89cff}
        .chat-input{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:14px 20px;color:#e8eaf0;font-size:15px;font-family:inherit;width:100%;outline:none;resize:none;transition:border-color .2s ease}
        .chat-input:focus{border-color:rgba(123,97,255,0.5)}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes blink{50%{opacity:0}}
        @keyframes fadeSlideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        .msg-in{animation:fadeSlideIn 0.4s ease}
        @keyframes wave{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1)}}
      `}</style>

      {/* Top Bar */}
      <div style={{ padding: '80px 48px 0', maxWidth: 900, width: '100%', margin: '0 auto' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>AI Interviewer</div>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 36, fontWeight: 700, letterSpacing: '-1px', marginBottom: 32 }}>Mock Interview</h1>

        {/* Role Selector */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
          {ROLES.map(r => (
            <button key={r} className={`role-btn ${role===r?'active':''}`} onClick={() => { setRole(r); setStarted(false); setMessages([]) }}>{r}</button>
          ))}
        </div>

        {/* AI Avatar Card */}
        <div style={{
          background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20, padding: '24px 32px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg,#7b61ff,#00b4d8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0,
              boxShadow: '0 0 20px rgba(123,97,255,0.3)',
            }}>AI</div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600 }}>AI Interviewer</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                {started ? `Interviewing for ${role}` : AVATAR_LINES[avatarLine]}
              </div>
            </div>
          </div>
          <button onClick={startInterview} style={{
            background: started ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#7b61ff,#00b4d8)',
            border: 'none', color: '#fff', padding: '12px 28px', borderRadius: 50,
            fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 14,
            cursor: 'pointer', transition: 'all 0.3s ease',
            ...(started ? {} : { boxShadow: '0 0 24px rgba(123,97,255,0.3)' }),
          }}>
            {started ? 'Restart ↺' : 'Start Interview →'}
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, maxWidth: 900, width: '100%', margin: '0 auto', padding: '0 48px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          flex: 1, minHeight: 340, maxHeight: 420,
          overflowY: 'auto', padding: '8px 4px',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {!started && messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>◉</div>
              <div style={{ fontSize: 16 }}>Select a role and start the interview</div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className="msg-in" style={{ display: 'flex', justifyContent: m.from==='user' ? 'flex-end' : 'flex-start', gap: 12, alignItems: 'flex-start' }}>
              {m.from === 'ai' && (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7b61ff,#00b4d8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 4 }}>AI</div>
              )}
              <div style={{ maxWidth: '72%' }}>
                <div className={m.from==='ai' ? 'msg-ai' : 'msg-user'} style={{ padding: '14px 18px', fontSize: 15, lineHeight: 1.65 }}>
                  {m.text}
                  {m.next && <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)', color: '#a89cff' }}>{m.next}</div>}
                </div>
                {m.score && (
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ height: 4, width: 80, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${m.score * 10}%`, background: m.score >= 7 ? '#00f5d4' : m.score >= 5 ? '#ffd166' : '#ff6b6b', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Score: {m.score}/10</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="msg-in" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7b61ff,#00b4d8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>AI</div>
              <div className="msg-ai" style={{ padding: '14px 20px', display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#7b61ff', animation: `wave 1s ease-in-out ${i*0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '20px 0 40px', display: 'flex', gap: 12 }}>
          <textarea
            className="chat-input"
            rows={2}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAnswer() } }}
            placeholder={started ? "Type your answer... (Enter to send)" : "Start the interview first"}
            disabled={!started || loading}
          />
          <button onClick={sendAnswer} disabled={!started || loading || !input.trim()} style={{
            width: 52, height: 52, borderRadius: 14, border: 'none', flexShrink: 0, alignSelf: 'flex-end',
            background: input.trim() && started && !loading ? 'linear-gradient(135deg,#7b61ff,#00b4d8)' : 'rgba(255,255,255,0.06)',
            color: '#fff', fontSize: 20, cursor: 'pointer', transition: 'all 0.3s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {loading
              ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              : '↑'}
          </button>
        </div>
      </div>
    </div>
  )
}