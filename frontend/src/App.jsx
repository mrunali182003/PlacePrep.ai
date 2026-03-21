import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import AdminDashboard from './pages/AdminDashboard'
import CodingPractice from './pages/CodingPractice'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Landing from './pages/Landing'
import Leaderboard from './pages/Leaderboard'
import Login from './pages/Login'
import ResumeBuilder from './pages/MakeResume'
import MockInterview from './pages/MockInterview'
import Progress from './pages/Progress'
import Register from './pages/Register'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import VoiceInterview from './pages/VoiceInterview'

// ── Protected Route Guard ──────────────────────────────────
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

// ── Auth Route (redirect if already logged in) ─────────────
function AuthRoute({ children }) {
  const token = localStorage.getItem('token')
  if (token) return <Navigate to="/dashboard" replace />
  return children
}

// ── 404 Page ───────────────────────────────────────────────
function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: '#020811',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      color: '#e8eaf0', fontFamily: "'DM Sans',sans-serif", gap: 16,
      textAlign: 'center', padding: '0 24px',
    }}>
      <div style={{ fontSize: 80 }}>🚀</div>
      <h1 style={{
        fontFamily: "'Space Grotesk',sans-serif",
        fontSize: 72, fontWeight: 700, margin: 0,
        background: 'linear-gradient(135deg,#00f5d4,#7b61ff)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>404</h1>
      <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
        Oops! This page doesn't exist.
      </p>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
        Looks like you took a wrong turn in the galaxy.
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <a href="/" style={{
          background: 'linear-gradient(135deg,#00f5d4,#00b4d8)',
          color: '#020811', padding: '12px 28px', borderRadius: 50,
          textDecoration: 'none', fontWeight: 600, fontSize: 14,
        }}>← Go Home</a>
        <a href="/dashboard" style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#e8eaf0', padding: '12px 28px', borderRadius: 50,
          textDecoration: 'none', fontWeight: 500, fontSize: 14,
        }}>Dashboard</a>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/"    element={<Landing />} />
        <Route path="/jobs"         element={<Jobs />} />
        <Route path="/leaderboard"  element={<Leaderboard />} />

        {/* Auth routes — redirect to dashboard if already logged in */}
        <Route path="/login"    element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

        {/* Protected routes — redirect to login if not logged in */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/resume" element={
          <ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>
        } />
        <Route path="/interview" element={
          <ProtectedRoute><MockInterview /></ProtectedRoute>
        } />
        <Route path="/coding" element={
          <ProtectedRoute><CodingPractice /></ProtectedRoute>
        } />
        <Route path="/voice-interview" element={
          <ProtectedRoute><VoiceInterview /></ProtectedRoute>
        } />
        <Route path="/resume-builder" element={
          <ProtectedRoute><ResumeBuilder /></ProtectedRoute>
        } />
        <Route path="/progress" element={
          <ProtectedRoute><Progress /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* ✅ FOOTER ADDED (YOUR NAME) */}
      <div style={{
        textAlign: "center",
        padding: "12px",
        fontSize: "13px",
        color: "rgba(255,255,255,0.5)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        marginTop: "20px"
      }}>
        Made with ❤️ by{" "}
        <a 
          href="https://linkedin.com/in/yourprofile" 
          target="_blank"
          style={{ color: "#00f5d4", textDecoration: "none" }}
        >
          Mrunali Deshmukh
        </a>
      </div>

    </Router>
  )
}

export default App