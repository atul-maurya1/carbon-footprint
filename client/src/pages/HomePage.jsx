// src/pages/HomePage.jsx
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingDown,
  PlayCircle,
  Brain,
  BarChart3,
  Users,
  Trophy,
  Zap,
  Camera,
  Leaf,
  Star,
  ArrowRight,
} from 'lucide-react'
import Navbar from '../components/Navbar'

// ─── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-eco-900/30 bg-surface-900 py-12 mt-0">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-eco-500 to-lime-400 flex items-center justify-center">
              <Leaf size={16} className="text-surface-950" />
            </div>
            <span className="font-display font-bold text-gray-100 text-lg">EcoGuide AI</span>
          </div>
          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} EcoGuide AI. Built for a greener planet. 🌍
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-eco-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-eco-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-eco-400 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Animated Counter ───────────────────────────────────────────────────────
function Counter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1600
          const steps = 60
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

// ─── Feature Card ───────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <div
      className="bg-surface-800 border border-eco-900/30 hover:border-eco-500/30 rounded-2xl p-6 group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-eco-500/5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-eco-500/20 to-lime-400/10 group-hover:from-eco-500/30 group-hover:to-lime-400/20 transition-all duration-300 flex items-center justify-center mb-4">
        <Icon size={22} className="text-eco-400" />
      </div>
      <h3 className="font-display font-semibold text-gray-100 text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

// ─── Step Item ──────────────────────────────────────────────────────────────
function StepItem({ number, title, description, isLast }) {
  return (
    <div className="flex flex-col items-center text-center relative">
      {!isLast && (
        <div className="hidden md:block absolute top-6 left-[calc(50%+28px)] right-[calc(-50%+28px)] h-px bg-gradient-to-r from-eco-500/40 to-eco-500/10" />
      )}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-eco-500 to-lime-400 flex items-center justify-center text-surface-950 font-display font-black text-lg mb-4 shadow-lg shadow-eco-500/20 z-10">
        {number}
      </div>
      <h3 className="font-display font-semibold text-gray-100 text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed max-w-[200px]">{description}</p>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function HomePage() {
  const [demoOpen, setDemoOpen] = useState(false)

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Coach',
      description: 'Gemini AI analyzes your habits and crafts personalized action plans to slash your emissions.',
    },
    {
      icon: BarChart3,
      title: 'Real-time Tracking',
      description: 'Log activities in seconds. Instant carbon calculations across transport, food, energy & more.',
    },
    {
      icon: Users,
      title: 'Community Challenges',
      description: 'Compete with friends, join group challenges, and motivate each other to hit green goals.',
    },
    {
      icon: Trophy,
      title: 'Gamification',
      description: 'Earn XP, level up, and collect badges as you build sustainable habits that stick.',
    },
    {
      icon: Zap,
      title: 'Smart Recommendations',
      description: 'Get your top 5 highest-impact actions every week, tailored to your lifestyle and location.',
    },
    {
      icon: Camera,
      title: 'Receipt Scanner',
      description: 'Snap a receipt and our OCR instantly calculates the carbon footprint of your food and shopping.',
    },
  ]

  const steps = [
    { number: 1, title: 'Sign Up', description: 'Create your profile in under 60 seconds, no credit card needed.' },
    { number: 2, title: 'Set Goals', description: 'Tell us about your lifestyle so we can build your baseline.' },
    { number: 3, title: 'Log Activities', description: 'Track daily habits with quick-log or our receipt scanner.' },
    { number: 4, title: 'Get Insights', description: 'AI suggests the changes with the biggest green impact.' },
  ]

  return (
    <div className="min-h-screen bg-surface-950 overflow-x-hidden">
      <Navbar />

      {/* ── Section 1: Hero ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(34,197,94,0.08),transparent_70%)] pointer-events-none" />
        {/* Decorative orbs */}
        <div className="absolute top-32 left-1/4 w-96 h-96 bg-eco-500/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-32 right-1/4 w-64 h-64 bg-lime-400/4 rounded-full blur-3xl pointer-events-none" />

        {/* Pill badge */}
        <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
          <span className="inline-flex items-center gap-2 bg-eco-500/10 text-eco-400 border border-eco-500/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            🌿 Powered by Gemini AI
          </span>
        </div>

        {/* H1 */}
        <div className="animate-fade-up text-center" style={{ animationDelay: '80ms' }}>
          <h1 className="font-display text-5xl md:text-7xl font-black leading-tight tracking-tight text-gray-100 mb-6">
            Track Your Carbon Footprint
            <br />
            with{' '}
            <span className="gradient-text">AI Intelligence</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="animate-fade-up" style={{ animationDelay: '160ms' }}>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto text-center leading-relaxed mb-10">
            EcoGuide AI makes it effortless to understand, track, and reduce your personal carbon footprint —
            powered by real-time AI insights and a community of 12,000+ eco warriors.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="animate-fade-up flex flex-col sm:flex-row items-center gap-4 mb-10" style={{ animationDelay: '240ms' }}>
          <Link
            to="/register"
            className="bg-eco-500 hover:bg-eco-400 text-surface-950 font-semibold rounded-xl px-7 py-3.5 text-base transition-all duration-200 shadow-lg shadow-eco-500/20 hover:shadow-eco-500/40 hover:-translate-y-0.5 flex items-center gap-2"
          >
            Start Free Today <ArrowRight size={18} />
          </Link>
          <button
            onClick={() => setDemoOpen(true)}
            className="border border-eco-500/40 text-eco-400 hover:bg-eco-500/10 rounded-xl px-7 py-3.5 text-base transition-all duration-200 flex items-center gap-2"
          >
            <PlayCircle size={18} />
            Watch Demo
          </button>
        </div>

        {/* Social proof */}
        <div className="animate-fade-up flex items-center gap-3" style={{ animationDelay: '320ms' }}>
          <div className="flex -space-x-2">
            {['#4ade80', '#22c55e', '#a3e635'].map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-surface-950 flex items-center justify-center text-xs font-bold text-surface-950"
                style={{ backgroundColor: color, zIndex: 3 - i }}
              >
                {['A', 'K', 'R'][i]}
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm">
            <span className="text-eco-400 font-semibold">12,000+</span> eco warriors joined
          </p>
        </div>

        {/* Floating cards */}
        <div className="relative w-full max-w-4xl mt-16">
          {/* Floating card: CO₂ saved — bottom right */}
          <div className="absolute -bottom-4 right-4 md:right-0 glass rounded-2xl px-5 py-4 flex items-center gap-3 animate-float shadow-xl" style={{ animationDelay: '0.5s' }}>
            <div className="w-10 h-10 rounded-xl bg-eco-500/15 flex items-center justify-center">
              <TrendingDown size={20} className="text-eco-400" />
            </div>
            <div>
              <p className="text-gray-500 text-xs">CO₂ Saved This Month</p>
              <p className="text-eco-400 font-display font-bold text-xl">−2.3 tons</p>
            </div>
          </div>

          {/* Floating card: streak — bottom left */}
          <div className="absolute -bottom-4 left-4 md:left-0 glass rounded-2xl px-5 py-4 flex items-center gap-3 shadow-xl" style={{ animation: 'float 3.5s ease-in-out infinite', animationDelay: '0.2s' }}>
            <span className="text-2xl" style={{ animation: 'float 1.2s ease-in-out infinite' }}>🔥</span>
            <div>
              <p className="text-gray-500 text-xs">Current Streak</p>
              <p className="text-gray-100 font-display font-bold text-xl">7 Day Streak</p>
            </div>
          </div>

          {/* Hero mockup bar */}
          <div className="glass rounded-2xl p-1 shadow-2xl overflow-hidden">
            <div className="bg-surface-800 rounded-xl p-6 min-h-[220px] flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-eco-500/10 rounded-full px-4 py-2 mb-4">
                  <Leaf size={16} className="text-eco-500" />
                  <span className="text-eco-400 text-sm font-medium">Your dashboard preview</span>
                </div>
                <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                  {[
                    { label: 'Today', value: '4.2 kg', color: 'text-eco-400' },
                    { label: 'This Week', value: '18.7 kg', color: 'text-lime-400' },
                    { label: 'Saved', value: '−12%', color: 'text-eco-400' },
                  ].map((item) => (
                    <div key={item.label} className="bg-surface-900/60 rounded-xl p-3 text-center">
                      <p className="text-gray-500 text-xs mb-1">{item.label}</p>
                      <p className={`font-display font-bold text-lg ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Stats Bar ─────────────────────────────────────── */}
      <section className="bg-surface-800/50 border-y border-eco-900/30 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {[
              { value: '47B', suffix: '', prefix: '', label: 'Global annual', unit: 'tons CO₂', raw: 47, isFancy: true },
              { value: null, label: 'Active trackers', unit: '12K+ Users', raw: 12000, suffix: '+' },
              { value: null, label: 'Logged this month', unit: '284K Activities', raw: 284000, suffix: 'K' },
              { value: null, label: 'AI predictions', unit: '94% Accuracy', raw: 94, suffix: '%' },
            ].map((stat, i) => (
              <div key={i} className="relative flex flex-col items-center text-center py-6 px-4">
                {i > 0 && (
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-eco-900/50" />
                )}
                <p className="font-display font-black text-3xl text-gray-100 mb-1">
                  {stat.isFancy ? (
                    <span>{stat.value}</span>
                  ) : (
                    <Counter target={stat.raw} suffix={stat.suffix} />
                  )}
                </p>
                <p className="text-eco-400 font-semibold text-sm mb-0.5">{stat.unit}</p>
                <p className="text-gray-500 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Features ──────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-eco-500/10 text-eco-400 border border-eco-500/20 rounded-full px-4 py-1 text-sm font-medium mb-5">
              <Zap size={14} /> Features
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-gray-100 mb-4">
              Everything you need to{' '}
              <span className="gradient-text">go green</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              From AI coaching to community challenges, we've built every tool you need to make a real impact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <FeatureCard key={feat.title} {...feat} delay={i * 60} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: How It Works ──────────────────────────────────── */}
      <section className="py-24 px-6 bg-surface-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-eco-500/10 text-eco-400 border border-eco-500/20 rounded-full px-4 py-1 text-sm font-medium mb-5">
              4 simple steps
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-gray-100">
              Start your green journey <span className="gradient-text">today</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-4">
            {steps.map((step, i) => (
              <StepItem
                key={step.number}
                {...step}
                isLast={i === steps.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: Testimonial ───────────────────────────────────── */}
      <section className="py-24 px-6 bg-surface-800/50">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-eco-500/10 text-eco-400 border border-eco-500/20 rounded-full px-4 py-1 text-sm font-medium mb-10">
            ❤️ What users say
          </span>

          {/* Stars */}
          <div className="flex items-center justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={22} className="text-yellow-400 fill-yellow-400" />
            ))}
          </div>

          <blockquote className="font-display text-2xl md:text-3xl font-semibold text-gray-100 leading-relaxed mb-10">
            "EcoGuide AI completely changed how I think about my daily habits. In just 3 months, I reduced my
            footprint by{' '}
            <span className="gradient-text">34%</span>. The AI coach feels like having a personal sustainability advisor."
          </blockquote>

          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-eco-500 to-lime-400 flex items-center justify-center text-surface-950 font-bold text-xl">
              P
            </div>
            <div className="text-left">
              <p className="text-gray-100 font-semibold text-lg">Priya Sharma</p>
              <p className="text-gray-500 text-sm">Sustainability Manager, Bangalore</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 6: CTA Banner ────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-eco-900/80 to-surface-800 border border-eco-500/20 p-12 md:p-16 text-center shadow-2xl shadow-eco-500/5">
            {/* Decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-eco-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 bg-eco-500/15 text-eco-400 border border-eco-500/20 rounded-full px-4 py-1 text-sm font-medium mb-6">
                🌍 Join the movement
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-black text-gray-100 mb-4">
                Ready to reduce your <span className="gradient-text">footprint?</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
                Join 12,000+ users already making a difference. Set up your account in under 2 minutes — it's completely free.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="bg-eco-500 hover:bg-eco-400 text-surface-950 font-semibold rounded-xl px-8 py-3.5 text-base transition-all duration-200 shadow-lg shadow-eco-500/25 hover:shadow-eco-500/40 hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Get Started Free <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="border border-eco-500/40 text-eco-400 hover:bg-eco-500/10 rounded-xl px-8 py-3.5 text-base transition-all duration-200"
                >
                  I already have an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Demo Modal */}
      {demoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/80 backdrop-blur-sm p-4"
          onClick={() => setDemoOpen(false)}
        >
          <div
            className="glass rounded-2xl p-8 max-w-md w-full text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-2xl bg-eco-500/15 flex items-center justify-center mx-auto mb-4">
              <PlayCircle size={32} className="text-eco-400" />
            </div>
            <h3 className="font-display font-bold text-xl text-gray-100 mb-2">Demo Coming Soon</h3>
            <p className="text-gray-400 text-sm mb-6">Our product demo is being prepared. Jump right in with a free account!</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDemoOpen(false)}
                className="flex-1 border border-eco-500/40 text-eco-400 hover:bg-eco-500/10 rounded-xl px-5 py-2.5 transition-all"
              >
                Close
              </button>
              <Link
                to="/register"
                className="flex-1 bg-eco-500 hover:bg-eco-400 text-surface-950 font-semibold rounded-xl px-5 py-2.5 transition-all text-center"
                onClick={() => setDemoOpen(false)}
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
