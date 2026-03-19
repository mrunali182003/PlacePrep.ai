import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

const ROLES = ['Frontend Developer','Backend Developer','Full Stack','Data Analyst','DevOps']

export default function VoiceInterview() {
  const [role, setRole]             = useState('Frontend Developer')
  const [messages, setMessages]     = useState([])
  const [listening, setListening]   = useState(false)
  const [transcript, setTranscript] = useState('')
  const [loading, setLoading]       = useState(false)
  const [started, setStarted]       = useState(false)
  const [scores, setScores]         = useState([])
  const [supported, setSupported]   = useState(true)
  const [browser, setBrowser]       = useState('')
  const recognitionRef              = useRef(null)
  const bottomRef                   = useRef()
  const synthRef                    = useRef(window.speechSynthesis)

  useEffect(() => {
    // Detect browser
    const ua = navigator.userAgent
    if (ua.includes('Chrome') && !ua.includes('Edg')) setBrowser('chrome')
    else if (ua.includes('Edg'))  setBrowser('edge')
    else if (ua.includes('Firefox')) setBrowser('firefox')
    else if (ua.includes('Safari') && !ua.includes('Chrome')) setBrowser('safari')
    else setBrowser('other')

    // Check speech recognition support
    const hasSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    setSupported(hasSpeech)

    return () => {
      recognitionRef.current?.stop()
      synthRef.current?.cancel()
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages, loading])

  const speak = (text) => {
    if (!window.speechSynthesis) return
    synthRef.current.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = 0.95; utter.pitch = 1
    const voices = synthRef.current.getVoices()
    const preferred = voices.find(v => v.name.includes('Google') || v.name.includes('Natural'))
    if (preferred) utter.voice = preferred
    synthRef.current.speak(utter)
  }

  const startListening = () => {
    if (!supported) return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.onstart = () => setListening(true)
    recognition.onend   = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognition.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join('')
      setTranscript(t)
      if (e.results[e.results.length-1].isFinal) {
        sendAnswer(t); setTranscript('')
      }
    }
    recognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => { recognitionRef.current?.stop(); setListening(false) }

  const startInterview = async () => {
    setStarted(true); setMessages([]); setScores([]); setLoading(true)
    synthRef.current?.cancel()
    try {
      const { data } = await axios.post('http://localhost:5000/interview', { answer:'', role, action:'start' })
      const q = data.question || data.response || `Tell me about yourself and your experience with ${role}.`
      setMessages([{ from:'ai', text:q }])
      speak(q)
    } catch {
      const q = `Hello! I'm your AI interviewer for ${role}. Tell me about yourself.`
      setMessages([{ from:'ai', text:q }])
      speak(q)
    } finally { setLoading(false) }
  }

  const sendAnswer = async (text) => {
    if (!text?.trim()) return
    setMessages(p => [...p, { from:'user', text }])
    setLoading(true); synthRef.current?.cancel()
    try {
      const { data } = await axios.post('http://localhost:5000/interview', { answer:text, role, action:'answer' })
      const feedback = data.feedback || 'Good answer!'
      const question = data.question || ''
      const score    = data.score    || null
      if (score) setScores(p => [...p, parseFloat(score)])
      const aiText = `${feedback}${question ? '\n\n' + question : ''}`
      setMessages(p => [...p, { from:'ai', text:aiText, score }])
      speak(aiText)
    } catch {
      const msg = 'Good attempt! Keep going.'
      setMessages(p => [...p, { from:'ai', text:msg }])
      speak(msg)
    } finally { setLoading(false) }
  }

  const manualSend = () => {
    if (transcript.trim()) { sendAnswer(transcript); setTranscript('') }
  }

  const avg = scores.length ? (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1) : null

  return (
    <div style={{
      minHeight:'100vh', background:'#020811', color:'#e8eaf0',
      fontFamily:"'DM Sans','Segoe UI',sans-serif", display:'flex', flexDirection:'column',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        .msg-ai { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:4px 18px 18px 18px; }
        .msg-user { background:linear-gradient(135deg,rgba(0,245,212,0.15),rgba(123,97,255,0.15)); border:1px solid rgba(0,245,212,0.2); border-radius:18px 4px 18px 18px; }
        @keyframes pulse { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(0,245,212,0.4)} 50%{transform:scale(1.05);box-shadow:0 0 0 16px rgba(0,245,212,0)} }
        @keyframes ripple { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.4);opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        .mic-btn { width:80px; height:80px; border-radius:50%; border:none; cursor:pointer; font-size:28px; display:flex; align-items:center; justify-content:center; transition:all 0.3s ease; position:relative; outline:none; }
        .mic-btn.idle { background:rgba(255,255,255,0.06); border:2px solid rgba(255,255,255,0.15); }
        .mic-btn.listening { background:linear-gradient(135deg,#00f5d4,#00b4d8); animation:pulse 1.5s ease-in-out infinite; }
        .mic-btn.idle:hover { background:rgba(0,245,212,0.1); border-color:rgba(0,245,212,0.4); }
        .mic-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .ripple { position:absolute; width:80px; height:80px; border-radius:50%; border:2px solid #00f5d4; animation:ripple 1.5s ease-out infinite; }
        .dot { width:8px; height:8px; border-radius:50%; background:#00f5d4; display:inline-block; margin:0 2px; animation:bounce 1.2s ease-in-out infinite; }
        .dot:nth-child(2){animation-delay:0.2s} .dot:nth-child(3){animation-delay:0.4s}
        select { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); color:#e8eaf0; padding:10px 16px; border-radius:10px; font-family:inherit; font-size:14px; cursor:pointer; outline:none; }
        .start-btn { background:linear-gradient(135deg,#00f5d4,#7b61ff); color:#020811; border:none; padding:12px 28px; border-radius:50px; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit; transition:all 0.25s; }
        .start-btn:hover { transform:translateY(-1px); box-shadow:0 0 20px rgba(0,245,212,0.3); }
      `}</style>

      {/* Navbar */}
      <nav style={{
        padding:'16px 40px', display:'flex', alignItems:'center', justifyContent:'space-between',
        background:'rgba(2,8,17,0.9)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.05)', flexShrink:0,
      }}>
        <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600 }}>
          PlacePrep<span style={{ color:'#00f5d4' }}>.ai</span>
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>🎤 Voice Interview</span>
          {avg && (
            <div style={{ background:'rgba(0,245,212,0.08)', border:'1px solid rgba(0,245,212,0.2)', padding:'6px 16px', borderRadius:50, fontSize:14, fontWeight:600, color:'#00f5d4' }}>
              Avg: {avg}/10
            </div>
          )}
        </div>
      </nav>

      {/* Browser warning banner */}
      {!supported && (
        <div style={{
          margin:'16px auto', maxWidth:700, width:'calc(100% - 48px)',
          padding:'14px 20px', borderRadius:12,
          background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.25)',
          display:'flex', alignItems:'center', gap:12,
        }}>
          <span style={{ fontSize:20 }}>⚠️</span>
          <div>
            <div style={{ color:'#ff6b6b', fontWeight:500, fontSize:14 }}>
              Voice recognition not supported in your browser
            </div>
            <div style={{ color:'rgba(255,255,255,0.45)', fontSize:13, marginTop:2 }}>
              Please use <strong style={{ color:'#fff' }}>Google Chrome</strong> or <strong style={{ color:'#fff' }}>Microsoft Edge</strong> for voice features. You can still type your answers below.
            </div>
          </div>
        </div>
      )}

      {/* Chrome/Edge tip for supported browsers */}
      {supported && browser !== 'chrome' && browser !== 'edge' && (
        <div style={{
          margin:'16px auto', maxWidth:700, width:'calc(100% - 48px)',
          padding:'12px 20px', borderRadius:12,
          background:'rgba(255,209,102,0.06)', border:'1px solid rgba(255,209,102,0.2)',
          display:'flex', alignItems:'center', gap:12,
        }}>
          <span style={{ fontSize:18 }}>💡</span>
          <div style={{ color:'rgba(255,255,255,0.6)', fontSize:13 }}>
            For best voice experience, use <strong style={{ color:'#ffd166' }}>Chrome</strong> or <strong style={{ color:'#ffd166' }}>Edge</strong>. Your current browser may have limited support.
          </div>
        </div>
      )}

      {supported && (browser === 'chrome' || browser === 'edge') && (
        <div style={{
          margin:'12px auto', maxWidth:700, width:'calc(100% - 48px)',
          padding:'10px 20px', borderRadius:12,
          background:'rgba(0,245,212,0.05)', border:'1px solid rgba(0,245,212,0.15)',
          display:'flex', alignItems:'center', gap:10,
        }}>
          <span style={{ fontSize:16 }}>✅</span>
          <div style={{ color:'rgba(255,255,255,0.5)', fontSize:13 }}>
            Voice recognition is fully supported in your browser. Microphone permission may be required.
          </div>
        </div>
      )}

      <div style={{ flex:1, display:'flex', flexDirection:'column', maxWidth:800, width:'100%', margin:'0 auto', padding:'0 24px 24px' }}>

        {/* Config Bar */}
        <div style={{ padding:'20px 0', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <select value={role} onChange={e => setRole(e.target.value)}>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
          <button className="start-btn" onClick={startInterview}>
            {started ? '↺ Restart' : '▶ Start Voice Interview'}
          </button>
          {started && (
            <div style={{ marginLeft:'auto', fontSize:13, color:'rgba(255,255,255,0.4)' }}>
              {scores.length} answers given
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div style={{ flex:1, overflowY:'auto', padding:'24px 0', display:'flex', flexDirection:'column', gap:16, minHeight:300 }}>
          {!started && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'60px 20px' }}>
              <div style={{ width:80, height:80, borderRadius:20, marginBottom:24, background:'rgba(0,245,212,0.08)', border:'1px solid rgba(0,245,212,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>🎤</div>
              <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:22, fontWeight:600, marginBottom:10 }}>Voice-Powered Interview</h2>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, lineHeight:1.7, maxWidth:360 }}>
                Select your role and click Start. The AI will ask questions out loud — speak your answer or type it below!
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{ display:'flex', justifyContent:m.from==='user'?'flex-end':'flex-start', animation:'fadeUp 0.3s ease both' }}>
              {m.from==='ai' && (
                <div style={{ width:32, height:32, borderRadius:8, flexShrink:0, marginRight:10, background:'rgba(0,245,212,0.1)', border:'1px solid rgba(0,245,212,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'#00f5d4', alignSelf:'flex-end' }}>AI</div>
              )}
              <div style={{ maxWidth:'75%' }}>
                <div className={m.from==='user'?'msg-user':'msg-ai'} style={{ padding:'14px 18px', fontSize:14, lineHeight:1.7, whiteSpace:'pre-wrap' }}>
                  {m.text}
                </div>
                {m.score && (
                  <div style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:6, padding:'4px 12px', borderRadius:50, background:m.score>=7?'rgba(0,245,212,0.1)':m.score>=5?'rgba(255,209,102,0.1)':'rgba(255,107,107,0.1)', border:`1px solid ${m.score>=7?'rgba(0,245,212,0.2)':m.score>=5?'rgba(255,209,102,0.2)':'rgba(255,107,107,0.2)'}`, color:m.score>=7?'#00f5d4':m.score>=5?'#ffd166':'#ff6b6b', fontSize:12, fontWeight:600 }}>
                    Score: {m.score}/10
                  </div>
                )}
              </div>
              {m.from==='user' && (
                <div style={{ width:32, height:32, borderRadius:8, flexShrink:0, marginLeft:10, background:'rgba(123,97,255,0.1)', border:'1px solid rgba(123,97,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#b39dff', alignSelf:'flex-end' }}>You</div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display:'flex', alignItems:'flex-end', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:'rgba(0,245,212,0.1)', border:'1px solid rgba(0,245,212,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#00f5d4', fontSize:14 }}>AI</div>
              <div className="msg-ai" style={{ padding:'14px 20px' }}>
                <span className="dot"/><span className="dot"/><span className="dot"/>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Voice Controls */}
        {started && (
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:24, display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
            {transcript && (
              <div style={{ width:'100%', padding:'12px 16px', borderRadius:12, background:'rgba(0,245,212,0.06)', border:'1px solid rgba(0,245,212,0.15)', fontSize:14, color:'rgba(255,255,255,0.7)', fontStyle:'italic' }}>
                "{transcript}"
              </div>
            )}

            <div style={{ display:'flex', alignItems:'center', gap:24 }}>
              <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {listening && <div className="ripple"/>}
                {listening && <div className="ripple" style={{ animationDelay:'0.5s' }}/>}
                <button
                  className={`mic-btn ${listening?'listening':'idle'}`}
                  onClick={listening ? stopListening : startListening}
                  disabled={loading || !supported}
                  style={{ color:listening?'#020811':'#00f5d4' }}>
                  {listening ? '⏹' : '🎤'}
                </button>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:13, fontWeight:500, color:listening?'#00f5d4':'rgba(255,255,255,0.4)' }}>
                  {listening ? 'Listening... speak now' : supported ? 'Click mic to speak' : 'Voice not supported'}
                </div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', marginTop:4 }}>
                  {loading ? 'AI is thinking...' : 'or type below'}
                </div>
              </div>
            </div>

            {/* Text input fallback */}
            <div style={{ display:'flex', gap:10, width:'100%' }}>
              <input
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                onKeyDown={e => e.key==='Enter' && manualSend()}
                placeholder={supported ? 'Or type your answer here...' : 'Type your answer here (voice not supported)...'}
                style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'11px 16px', color:'#e8eaf0', fontSize:14, fontFamily:'inherit', outline:'none' }}
              />
              <button onClick={manualSend} disabled={!transcript.trim()||loading}
                style={{ background:'linear-gradient(135deg,#00f5d4,#00b4d8)', color:'#020811', border:'none', padding:'11px 20px', borderRadius:12, fontWeight:600, cursor:'pointer', fontSize:14, fontFamily:'inherit', opacity:!transcript.trim()||loading?0.4:1 }}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}