// src/pages/LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, Leaf, Check, TrendingDown, Users, Activity } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// ─── Google SVG Icon ────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

// ─── Input Component ─────────────────────────────────────────────────────────
function Input({ label, type = 'text', value, onChange, placeholder, icon: Icon, rightElement, error, autoComplete }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
            <Icon size={17} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full bg-surface-900 border rounded-xl py-3 text-gray-100 placeholder-gray-600 text-sm transition-all outline-none focus:border-eco-500/60 focus:ring-2 focus:ring-eco-500/10 ${
            Icon ? 'pl-10' : 'pl-4'
          } ${rightElement ? 'pr-12' : 'pr-4'} ${
            error ? 'border-red-500/50' : 'border-eco-900/50'
          }`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
    </div>
  )
}

// ─── Decorative Left Panel ───────────────────────────────────────────────────
function LeftPanel() {
  const bullets = [
    'AI-powered carbon footprint analysis',
    'Daily habit tracking with instant insights',
    'Community challenges & eco leaderboards',
  ]

  return (
    <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-eco-900 via-surface-900 to-surface-950">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_20%,rgba(34,197,94,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-eco-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-eco-500 to-lime-400 flex items-center justify-center shadow-lg shadow-eco-500/20">
          <Leaf size={18} className="text-surface-950" />
        </div>
        <span className="font-display font-bold text-gray-100 text-xl">EcoGuide AI</span>
      </div>

      {/* Floating leaf SVG */}
      <div className="relative z-10 flex flex-col items-center py-8">
        <div className="animate-float mb-8">
          <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="leafGrad" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#4ade80" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#16a34a" stopOpacity="0.6" />
              </radialGradient>
            </defs>
            <path
              d="M100 180 C100 180 20 130 20 70 C20 35 55 10 100 10 C145 10 180 35 180 70 C180 130 100 180 100 180Z"
              fill="url(#leafGrad)"
              opacity="0.85"
            />
            <path
              d="M100 170 L100 30 M100 80 C100 80 140 60 160 50 M100 100 C100 100 60 90 40 75 M100 120 C100 120 135 108 150 100"
              stroke="#a3e635"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </div>

        <h2 className="font-display text-3xl font-black text-center mb-3 leading-tight">
          <span className="gradient-text">Welcome back,</span>
          <br />
          <span className="text-gray-100">eco warrior</span>
        </h2>
        <p className="text-gray-400 text-sm text-center max-w-xs leading-relaxed">
          Your planet needs you. Every action you track helps build a clearer picture of our collective impact.
        </p>

        {/* Bullets */}
        <div className="mt-8 flex flex-col gap-4 w-full max-w-xs">
          {bullets.map((bullet) => (
            <div key={bullet} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-eco-500/20 border border-eco-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={11} className="text-eco-400" />
              </div>
              <p className="text-gray-300 text-sm leading-snug">{bullet}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom stats */}
      <div className="relative z-10 grid grid-cols-3 gap-0 bg-surface-800/50 border border-eco-900/30 rounded-2xl overflow-hidden">
        {[
          { icon: Users, value: '12K', label: 'Users' },
          { icon: Activity, value: '284K', label: 'Activities' },
          { icon: TrendingDown, value: '94%', label: 'Satisfaction' },
        ].map(({ icon: Icon, value, label }, i) => (
          <div key={label} className={`flex flex-col items-center py-4 px-2 ${i > 0 ? 'border-l border-eco-900/30' : ''}`}>
            <Icon size={14} className="text-eco-500 mb-1" />
            <p className="font-display font-bold text-gray-100 text-base">{value}</p>
            <p className="text-gray-500 text-xs">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Login Page ─────────────────────────────────────────────────────────
export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email'
    if (!password) errs.password = 'Password is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const errs = validate()
    if (Object.keys(errs).length) {
      setFieldErrors(errs)
      return
    }
    setFieldErrors({})
    setIsLoading(true)
    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (err) {
      const message =
        err?.response?.data?.error?.message || err?.response?.data?.message || 'Invalid email or password. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-950 grid grid-cols-1 lg:grid-cols-2">
      {/* Left decorative panel */}
      <LeftPanel />

      {/* Right: form panel */}
      <div className="flex flex-col items-center justify-center px-6 py-12 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-eco-500 to-lime-400 flex items-center justify-center">
              <Leaf size={18} className="text-surface-950" />
            </div>
            <span className="font-display font-bold text-gray-100 text-xl">EcoGuide AI</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-display text-3xl font-black text-gray-100 mb-2">
              Sign in to <span className="gradient-text">EcoGuide AI</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-eco-400 hover:text-eco-300 font-medium transition-colors">
                Create one free
              </Link>
            </p>
          </div>

          {/* Google OAuth button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-surface-900 border border-white/10 hover:border-white/20 hover:bg-surface-800 text-gray-100 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200 mb-6"
            onClick={() => {/* OAuth handler */}}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* OR divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-eco-900/40" />
            <span className="text-gray-600 text-xs font-medium uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-eco-900/40" />
          </div>

          {/* Error alert */}
          {error && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-400 text-xs font-bold">!</span>
              </div>
              <p className="text-red-300 text-sm leading-snug">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: '' })) }}
              placeholder="you@example.com"
              icon={Mail}
              error={fieldErrors.email}
              autoComplete="email"
            />

            <div className="flex flex-col gap-1.5">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: '' })) }}
                placeholder="Enter your password"
                icon={Lock}
                error={fieldErrors.password}
                autoComplete="current-password"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="text-gray-500 hover:text-gray-300 transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-eco-400 hover:text-eco-300 text-xs font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-eco-500 hover:bg-eco-400 disabled:opacity-60 disabled:cursor-not-allowed text-surface-950 font-semibold rounded-xl px-5 py-3.5 text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-eco-500/20 hover:shadow-eco-500/35"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-gray-600 text-xs text-center mt-8 leading-relaxed">
            By signing in, you agree to our{' '}
            <a href="#" className="text-gray-500 hover:text-gray-400 underline">Terms of Service</a> and{' '}
            <a href="#" className="text-gray-500 hover:text-gray-400 underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
