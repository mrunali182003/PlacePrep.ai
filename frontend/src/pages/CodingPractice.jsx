import axios from 'axios'
import { useEffect, useState } from 'react'

const PROBLEMS = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Arrays', desc: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', example: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]', starter: '// Write your solution\nfunction twoSum(nums, target) {\n  // your code here\n}\n\nconsole.log(twoSum([2,7,11,15], 9))' },
  { id: 2, title: 'Reverse String', difficulty: 'Easy', category: 'Strings', desc: 'Write a function that reverses a string. The input string is given as an array of characters.', example: 'Input: ["h","e","l","l","o"]\nOutput: ["o","l","l","e","h"]', starter: '// Write your solution\nfunction reverseString(s) {\n  // your code here\n}\n\nconsole.log(reverseString(["h","e","l","l","o"]))' },
  { id: 3, title: 'Valid Parentheses', difficulty: 'Medium', category: 'Stack', desc: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.', example: 'Input: s = "()[]{}" \nOutput: true', starter: '// Write your solution\nfunction isValid(s) {\n  // your code here\n}\n\nconsole.log(isValid("()[]{}"))' },
  { id: 4, title: 'FizzBuzz', difficulty: 'Easy', category: 'Math', desc: 'Given an integer n, return a string array where: "FizzBuzz" if divisible by both 3 and 5, "Fizz" if by 3, "Buzz" if by 5, else the number.', example: 'Input: n = 5\nOutput: ["1","2","Fizz","4","Buzz"]', starter: '// Write your solution\nfunction fizzBuzz(n) {\n  // your code here\n}\n\nconsole.log(fizzBuzz(15))' },
  { id: 5, title: 'Maximum Subarray', difficulty: 'Medium', category: 'Arrays', desc: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.', example: 'Input: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6', starter: '// Write your solution\nfunction maxSubArray(nums) {\n  // your code here\n}\n\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))' },
]

const DIFF_COLOR = { Easy: '#00f5d4', Medium: '#ffd166', Hard: '#ff6b6b' }
const CAT_COLOR = { Arrays: '#7b61ff', Strings: '#00b4d8', Stack: '#ff6b6b', Math: '#ffd166' }

export default function CodingPractice() {
  const [selected, setSelected] = useState(PROBLEMS[0])
  const [code, setCode] = useState(PROBLEMS[0].starter)
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('All')
  const [outputType, setOutputType] = useState('idle') // idle | success | error | running
  const [lineCount, setLineCount] = useState(1)

  useEffect(() => { setLineCount(code.split('\n').length) }, [code])

  const selectProblem = (p) => { setSelected(p); setCode(p.starter); setOutput(''); setOutputType('idle') }

  const runCode = async () => {
    setLoading(true); setOutputType('running'); setOutput('')
    try {
      const { data } = await axios.post('http://localhost:5000/run-code', { code, language: 'javascript', problemId: selected.id })
      setOutput(data.output || 'No output'); setOutputType('success')
    } catch {
      try {
        const logs = []; const fn = new Function('console', code); fn({ log: (...a) => logs.push(a.join(' ')) })
        setOutput(logs.join('\n') || 'No output'); setOutputType('success')
      } catch (e) { setOutput(`Error: ${e.message}`); setOutputType('error') }
    } finally { setLoading(false) }
  }

  const filtered = filter === 'All' ? PROBLEMS : PROBLEMS.filter(p => p.difficulty === filter)

  return (
    <div style={{ minHeight: '100vh', background: '#020811', color: '#e8eaf0', fontFamily: "'DM Sans','Segoe UI',sans-serif", display: 'flex', flexDirection: 'column', paddingTop: 72 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box}
        .prob-item{padding:14px 16px;border-radius:12px;cursor:pointer;transition:all .2s ease;border:1px solid transparent}
        .prob-item:hover{background:rgba(255,255,255,0.04)}
        .prob-item.active{background:rgba(123,97,255,0.1);border-color:rgba(123,97,255,0.25)}
        .filter-btn{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.4);padding:6px 16px;border-radius:50px;cursor:pointer;font-size:12px;transition:all .2s ease;font-family:inherit}
        .filter-btn:hover{border-color:rgba(255,255,255,0.2);color:#fff}
        .filter-btn.on{background:rgba(123,97,255,0.15);border-color:rgba(123,97,255,0.4);color:#a89cff}
        .code-editor{width:100%;background:transparent;border:none;outline:none;color:#e8eaf0;font-family:'JetBrains Mono',monospace;font-size:14px;line-height:1.7;resize:none;padding:20px 20px 20px 0;caret-color:#7b61ff}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes blink{50%{opacity:0.3}}
      `}</style>

      <div style={{ display: 'flex', height: 'calc(100vh - 72px)' }}>

        {/* Sidebar */}
        <div style={{ width: 280, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '24px 20px 16px' }}>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Problems</h2>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['All','Easy','Medium','Hard'].map(f => (
                <button key={f} className={`filter-btn ${filter===f?'on':''}`} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 20px' }}>
            {filtered.map(p => (
              <div key={p.id} className={`prob-item ${selected.id===p.id?'active':''}`} onClick={() => selectProblem(p)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{p.title}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: DIFF_COLOR[p.difficulty], background: `${DIFF_COLOR[p.difficulty]}15`, padding: '2px 8px', borderRadius: 50 }}>{p.difficulty}</span>
                </div>
                <span style={{ fontSize: 11, color: CAT_COLOR[p.category] || 'rgba(255,255,255,0.3)', background: `${CAT_COLOR[p.category] || 'rgba(255,255,255,0.1)'}15`, padding: '2px 8px', borderRadius: 50 }}>{p.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Problem + Editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Problem Description */}
          <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', maxHeight: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 22 }}>{selected.title}</h2>
              <span style={{ fontSize: 12, fontWeight: 600, color: DIFF_COLOR[selected.difficulty], background: `${DIFF_COLOR[selected.difficulty]}15`, padding: '4px 12px', borderRadius: 50, border: `1px solid ${DIFF_COLOR[selected.difficulty]}30` }}>{selected.difficulty}</span>
              <span style={{ fontSize: 11, color: CAT_COLOR[selected.category], background: `${CAT_COLOR[selected.category]}15`, padding: '4px 12px', borderRadius: 50 }}>{selected.category}</span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 12 }}>{selected.desc}</p>
            <pre style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 16px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{selected.example}</pre>
          </div>

          {/* Code Editor */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Editor Toolbar */}
            <div style={{ padding: '12px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.015)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['#ff6b6b','#ffd166','#00f5d4'].map((c,i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.6 }} />)}
                </div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono',monospace" }}>solution.js</span>
              </div>
              <button onClick={runCode} disabled={loading} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px',
                background: loading ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#00f5d4,#00b4d8)',
                border: 'none', borderRadius: 8, color: loading ? 'rgba(255,255,255,0.4)' : '#020811',
                fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all .3s ease',
              }}>
                {loading
                  ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />Running...</>
                  : <>▶ Run Code</>}
              </button>
            </div>

            {/* Editor */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
              {/* Line Numbers */}
              <div style={{ width: 48, padding: '20px 0', background: 'rgba(0,0,0,0.2)', borderRight: '1px solid rgba(255,255,255,0.04)', overflowY: 'hidden', flexShrink: 0 }}>
                {Array.from({ length: Math.max(lineCount, 10) }, (_, i) => (
                  <div key={i} style={{ height: '1.7em', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 12, fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: 'rgba(255,255,255,0.15)', lineHeight: 1.7 }}>{i+1}</div>
                ))}
              </div>
              <textarea
                className="code-editor"
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                style={{ flex: 1, paddingLeft: 20, overflowY: 'auto' }}
              />
            </div>

            {/* Output */}
            {output && (
              <div style={{
                borderTop: `1px solid ${outputType==='error' ? 'rgba(255,107,107,0.2)' : 'rgba(0,245,212,0.15)'}`,
                padding: '16px 32px', maxHeight: 160, overflowY: 'auto',
                background: outputType==='error' ? 'rgba(255,107,107,0.03)' : 'rgba(0,245,212,0.02)',
              }}>
                <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: outputType==='error' ? '#ff6b6b' : '#00f5d4', marginBottom: 8 }}>
                  {outputType==='error' ? '✗ Error' : '✓ Output'}
                </div>
                <pre style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: outputType==='error' ? '#ff6b6b' : 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>{output}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}