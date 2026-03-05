import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'
import { Navbar, ToastContainer } from '../components/Layout'
import { toast } from '../utils/toast'

export default function Login() {
  const { login, register, confirm } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login') // login | signup | confirm
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
      if (err.code === 'UserNotConfirmedException') {
        setMode('confirm')
        setError('Please verify your email first.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(email, password, name)
      toast.success('Verification code sent to your email!')
      setMode('confirm')
    } catch (err) {
      setError(err.message || 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await confirm(email, code)
      toast.success('Email verified! Please login.')
      setMode('login')
    } catch (err) {
      setError(err.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'rgba(15,23,42,0.6)',
    border: '1px solid rgba(59,130,246,0.2)',
    color: '#e2e8f0',
  }

  return (
    <div className="min-h-screen bg-grid">
      <Navbar />
      <ToastContainer />

      <div className="min-h-screen flex items-center justify-center pt-16 px-4">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ background: 'radial-gradient(circle, #1E40AF, transparent)' }} />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-15"
            style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
        </div>

        <div className="relative w-full max-w-md">
          {/* Card */}
          <div className="glass rounded-2xl p-8" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🧬</div>
              <h1 className="text-2xl font-black gradient-text mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Verify Email'}
              </h1>
              <p className="text-slate-400 text-sm">
                {mode === 'login'
                  ? 'Sign in to access your health dashboard'
                  : mode === 'signup'
                  ? 'Join BioClock Predictive Health AI'
                  : 'Enter the code sent to your email'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-xl text-sm"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                ❌ {error}
              </div>
            )}

            {/* Login Form */}
            {mode === 'login' && (
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                    <input
                      type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <button onClick={handleLogin} disabled={loading}
                  className="btn-primary w-full mt-6 py-3 text-base font-semibold">
                  {loading ? '⏳ Signing in...' : '🔐 Sign In'}
                </button>
                <p className="text-center text-slate-500 text-sm mt-6">
                  Don't have an account?{' '}
                  <button onClick={() => { setMode('signup'); setError('') }}
                    className="text-blue-400 hover:text-blue-300 font-semibold">
                    Sign Up
                  </button>
                </p>
              </div>
            )}

            {/* Signup Form */}
            {mode === 'signup' && (
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Arjun Sharma"
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                    <input
                      type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 chars, uppercase, number, symbol"
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <button onClick={handleSignup} disabled={loading}
                  className="btn-primary w-full mt-6 py-3 text-base font-semibold">
                  {loading ? '⏳ Creating account...' : '🚀 Create Account'}
                </button>
                <p className="text-center text-slate-500 text-sm mt-6">
                  Already have an account?{' '}
                  <button onClick={() => { setMode('login'); setError('') }}
                    className="text-blue-400 hover:text-blue-300 font-semibold">
                    Sign In
                  </button>
                </p>
              </div>
            )}

            {/* Confirm Form */}
            {mode === 'confirm' && (
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                      Verification Code
                    </label>
                    <input
                      type="text" value={code} onChange={(e) => setCode(e.target.value)}
                      placeholder="123456"
                      className="w-full px-4 py-3 rounded-xl text-sm text-center tracking-[0.5em] text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={inputStyle}
                      maxLength={6}
                    />
                    <p className="text-xs text-slate-500 mt-2">Check your email ({email}) for the 6-digit code</p>
                  </div>
                </div>
                <button onClick={handleConfirm} disabled={loading}
                  className="btn-primary w-full mt-6 py-3 text-base font-semibold">
                  {loading ? '⏳ Verifying...' : '✅ Verify Email'}
                </button>
                <p className="text-center text-slate-500 text-sm mt-6">
                  <button onClick={() => { setMode('login'); setError('') }}
                    className="text-blue-400 hover:text-blue-300 font-semibold">
                    ← Back to Login
                  </button>
                </p>
              </div>
            )}

            {/* Powered by */}
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                <span>🔐</span>
                <span>Secured by AWS Cognito</span>
                <span>•</span>
                <span>🧬 BioClock AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
