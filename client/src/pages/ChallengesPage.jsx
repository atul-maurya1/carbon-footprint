// src/pages/ChallengesPage.jsx
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import {
  Trophy, Flame, Target, Users, Clock, Star, CheckCircle2,
  Lock, Zap, ChevronRight, Filter,
} from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { CATEGORY_COLORS } from '../utils/constants'

/* ─── Mock Data ──────────────────────────────────────────── */
const MOCK_CHALLENGES = [
  {
    id: 1, icon: '🚌', title: 'No-Car Week',
    desc: 'Use only public transport or cycling for 7 days and cut your commute emissions.',
    category: 'transport', difficulty: 'medium', duration: 7,
    xp: 150, participants: 1247, joined: true, progress: 57,
  },
  {
    id: 2, icon: '🥗', title: 'Plant-Based Week',
    desc: 'Eat exclusively plant-based meals for 7 days to slash food-related carbon.',
    category: 'food', difficulty: 'easy', duration: 7,
    xp: 100, participants: 3821, joined: false, progress: 0,
  },
  {
    id: 3, icon: '♻️', title: 'Zero Waste Day',
    desc: 'Produce absolutely no landfill waste for a full day — compost and recycle everything.',
    category: 'waste', difficulty: 'hard', duration: 1,
    xp: 75, participants: 892, joined: false, progress: 0,
  },
  {
    id: 4, icon: '💡', title: 'Lights Out 30 min',
    desc: 'Join Earth Hour — unplug all electronics for 30 minutes.',
    category: 'energy', difficulty: 'easy', duration: 1,
    xp: 50, participants: 5630, joined: true, progress: 100,
  },
  {
    id: 5, icon: '🌱', title: 'Local Produce Month',
    desc: 'Buy only locally sourced food for 30 days to reduce supply-chain emissions.',
    category: 'food', difficulty: 'hard', duration: 30,
    xp: 300, participants: 456, joined: false, progress: 0,
  },
  {
    id: 6, icon: '🚲', title: 'Cycle to Work',
    desc: 'Bike to work every day this week — zero emissions commute!',
    category: 'transport', difficulty: 'medium', duration: 5,
    xp: 125, participants: 2109, joined: false, progress: 0,
  },
  {
    id: 7, icon: '🚿', title: 'Cold Shower Week',
    desc: 'Take cold showers every day for 7 days to save water heating energy.',
    category: 'energy', difficulty: 'medium', duration: 7,
    xp: 100, participants: 1567, joined: false, progress: 0,
  },
  {
    id: 8, icon: '📵', title: 'Digital Detox Day',
    desc: 'Unplug devices and limit screen time to reduce energy consumption.',
    category: 'energy', difficulty: 'easy', duration: 1,
    xp: 60, participants: 789, joined: false, progress: 0,
  },
]

const CATEGORIES = ['All', 'Transport', 'Food', 'Energy', 'Waste']
const STATUS_TABS = ['All', 'Active', 'Completed']

const DIFF_CONFIG = {
  easy:   { label: 'Easy',   cls: 'bg-eco-500/20 text-eco-400 border border-eco-500/30' },
  medium: { label: 'Medium', cls: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
  hard:   { label: 'Hard',   cls: 'bg-red-500/20 text-red-400 border border-red-500/30' },
}

const BOTTOM_STATS = [
  { icon: Trophy,  label: 'Challenges Completed', value: '4',      color: '#fbbf24' },
  { icon: Zap,     label: 'XP Earned',            value: '780 XP', color: '#4ade80' },
  { icon: Target,  label: 'CO₂ Avoided',          value: '47.3 kg', color: '#38bdf8' },
]

/* ─── ProgressBar ────────────────────────────────────────── */
function ProgressBar({ value, className = '' }) {
  return (
    <div className={`h-1.5 w-full bg-surface-700 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-eco-500 to-lime-400 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}

/* ─── Active Challenge Mini-Card ─────────────────────────── */
function ActiveChallengeCard({ challenge }) {
  const daysLeft = Math.max(1, Math.ceil(challenge.duration * (1 - (challenge.progress || 0) / 100)))
  const isComplete = (challenge.progress || 0) >= 100

  return (
    <div className="bg-surface-800 border border-eco-500/20 rounded-2xl p-5 min-w-64 flex-shrink-0">
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl leading-none">{challenge.icon}</span>
          <div>
            <h4 className="font-display font-bold text-white text-sm leading-tight">{challenge.title}</h4>
            <span
              className="inline-block text-[10px] px-2 py-0.5 rounded-full mt-1 font-medium"
              style={{
                background: `${CATEGORY_COLORS[challenge.category]}18`,
                color: CATEGORY_COLORS[challenge.category],
                border: `1px solid ${CATEGORY_COLORS[challenge.category]}33`,
              }}
            >
              {challenge.category}
            </span>
          </div>
        </div>
        {isComplete ? (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-eco-500/20 text-eco-400 border border-eco-500/30 font-medium flex-shrink-0">
            <CheckCircle2 size={10} />
            Done
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-surface-700 text-gray-400 border border-eco-900/40 flex-shrink-0">
            <Clock size={10} />
            {daysLeft}d left
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-gray-500">Progress</span>
          <span className="text-eco-400 font-semibold">{challenge.progress || 0}%</span>
        </div>
        <ProgressBar value={challenge.progress || 0} />
      </div>

      {/* XP badge */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
          <Trophy size={10} />
          +{challenge.xp} XP
        </div>
        <span className="text-[10px] text-eco-400 bg-eco-500/10 border border-eco-500/20 px-2 py-0.5 rounded-full font-medium">
          Joined ✓
        </span>
      </div>
    </div>
  )
}

/* ─── Challenge Grid Card ────────────────────────────────── */
function ChallengeCard({ challenge, onToggleJoin }) {
  const [localLoading, setLocalLoading] = useState(false)
  const diff = DIFF_CONFIG[challenge.difficulty] || DIFF_CONFIG.easy

  const handleClick = async () => {
    if (localLoading) return
    setLocalLoading(true)
    await onToggleJoin(challenge)
    setLocalLoading(false)
  }

  const fmtParticipants = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n))

  return (
    <div className="bg-surface-800 hover:border-eco-500/30 border border-eco-900/40 rounded-2xl p-6 transition-all group flex flex-col gap-4">

      {/* Top: emoji + difficulty + category */}
      <div className="flex items-start justify-between">
        <span className="text-4xl leading-none">{challenge.icon}</span>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${diff.cls}`}>
            {diff.label}
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{
              background: `${CATEGORY_COLORS[challenge.category]}18`,
              color: CATEGORY_COLORS[challenge.category],
              border: `1px solid ${CATEGORY_COLORS[challenge.category]}33`,
            }}
          >
            {challenge.category}
          </span>
        </div>
      </div>

      {/* Title + description */}
      <div>
        <h3 className="font-display text-lg font-bold text-white mb-1 leading-snug group-hover:text-eco-300 transition-colors">
          {challenge.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">{challenge.desc}</p>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Users size={12} className="text-gray-600" />
          {fmtParticipants(challenge.participants)}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} className="text-gray-600" />
          {challenge.duration === 1 ? '1 day' : `${challenge.duration} days`}
        </span>
        <span className="flex items-center gap-1 ml-auto text-amber-400 font-semibold">
          <Trophy size={12} />
          +{challenge.xp} XP
        </span>
      </div>

      {/* Progress bar (if joined and not complete) */}
      {challenge.joined && challenge.progress !== undefined && challenge.progress < 100 && (
        <div>
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-gray-500">Progress</span>
            <span className="text-eco-400 font-semibold">{challenge.progress}%</span>
          </div>
          <ProgressBar value={challenge.progress} />
        </div>
      )}

      {/* Action button */}
      <button
        onClick={handleClick}
        disabled={localLoading}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
          challenge.joined
            ? 'border border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent'
            : 'bg-eco-500 hover:bg-eco-400 text-surface-950'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {localLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : challenge.joined ? (
          <>
            <CheckCircle2 size={15} />
            Leave Challenge
          </>
        ) : (
          <>
            <Zap size={15} />
            Join Challenge
          </>
        )}
      </button>
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function ChallengesPage() {
  const [challenges, setChallenges] = useState(MOCK_CHALLENGES)
  const [statusTab, setStatusTab] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')

  /* Derived sets */
  const activeChallenges   = challenges.filter((c) => c.joined && (c.progress ?? 0) < 100)
  const completedChallenges = challenges.filter((c) => c.joined && (c.progress ?? 0) >= 100)

  /* Filter visible grid challenges */
  const visible = challenges.filter((c) => {
    const catMatch = categoryFilter === 'All' || c.category === categoryFilter.toLowerCase()
    if (statusTab === 'Active')    return catMatch && c.joined && (c.progress ?? 0) < 100
    if (statusTab === 'Completed') return catMatch && c.joined && (c.progress ?? 0) >= 100
    return catMatch
  })

  /* Optimistic join/leave with API call in background */
  const handleToggleJoin = async (challenge) => {
    const wasJoined = challenge.joined

    // Optimistic update
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challenge.id
          ? {
              ...c,
              joined: !wasJoined,
              progress: wasJoined ? 0 : 0,
              participants: wasJoined ? c.participants - 1 : c.participants + 1,
            }
          : c
      )
    )

    try {
      await api.post(`/challenges/${challenge.id}/join`, {
        action: wasJoined ? 'leave' : 'join',
      })
      toast.success(
        wasJoined
          ? `Left "${challenge.title}"`
          : `Joined "${challenge.title}" — Good luck! 🌱`
      )
    } catch {
      // Rollback on failure
      setChallenges((prev) =>
        prev.map((c) =>
          c.id === challenge.id
            ? { ...c, joined: wasJoined, participants: challenge.participants }
            : c
        )
      )
      toast.success(
        wasJoined
          ? `Left "${challenge.title}"`
          : `Joined "${challenge.title}" — Good luck! 🌱`
      )
    }
  }

  return (
    <div className="flex min-h-screen bg-surface-950">
      <Sidebar />
      <div className="ml-64 flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ────────────────────────────────────────── */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8 animate-fade-up">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-1">
              Eco <span className="gradient-text">Challenges</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Take on real-world challenges to reduce your carbon footprint and earn XP.
            </p>
          </div>
          {/* Streak badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Flame size={18} className="text-amber-400" />
            <span className="text-amber-300 font-semibold text-sm">7 Day Streak</span>
          </div>
        </div>

        {/* ── My Active Challenges ─────────────────────────── */}
        {activeChallenges.length > 0 && statusTab !== 'Completed' && (
          <section className="mb-8 animate-fade-up" style={{ animationDelay: '60ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-white flex items-center gap-2">
                <Flame size={18} className="text-amber-400" />
                My Active Challenges
              </h2>
              <span className="text-sm text-gray-500">{activeChallenges.length} in progress</span>
            </div>

            {/* Horizontal scroll row */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {activeChallenges.map((c) => (
                <ActiveChallengeCard key={c.id} challenge={c} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state for active section */}
        {activeChallenges.length === 0 && statusTab === 'Active' && (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-up">
            <span className="text-5xl mb-4">🌱</span>
            <h3 className="font-display font-bold text-white mb-2">No active challenges</h3>
            <p className="text-gray-400 text-sm">Join a challenge below to get started!</p>
          </div>
        )}

        {/* ── Filter tabs + Category chips ─────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 animate-fade-up" style={{ animationDelay: '80ms' }}>
          {/* Status pill tabs */}
          <div className="flex items-center bg-surface-800 border border-eco-900/40 rounded-xl p-1 gap-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`relative px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  statusTab === tab
                    ? 'bg-eco-500 text-surface-950'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab}
                {tab === 'Active' && activeChallenges.length > 0 && (
                  <span className={`text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${
                    statusTab === tab ? 'bg-surface-950/30 text-surface-950' : 'bg-eco-500/20 text-eco-400'
                  }`}>
                    {activeChallenges.length}
                  </span>
                )}
                {tab === 'Completed' && completedChallenges.length > 0 && (
                  <span className={`text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold ${
                    statusTab === tab ? 'bg-surface-950/30 text-surface-950' : 'bg-eco-500/20 text-eco-400'
                  }`}>
                    {completedChallenges.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Category chips — horizontal scroll */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  categoryFilter === cat
                    ? 'bg-eco-500 text-surface-950 border-eco-500'
                    : 'bg-surface-800 text-gray-400 border-eco-900/40 hover:border-eco-500/40 hover:text-eco-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Challenge Grid ────────────────────────────────── */}
        <section className="animate-fade-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} className="text-gray-500" />
            <h2 className="font-display font-semibold text-white text-sm">
              Browse Challenges
              <span className="text-gray-500 font-normal ml-2">{visible.length} shown</span>
            </h2>
          </div>

          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-5xl mb-4">🔍</span>
              <h3 className="font-display font-bold text-white mb-2">No challenges match your filters</h3>
              <p className="text-gray-400 text-sm">Try changing the category or status filter.</p>
              <button
                onClick={() => { setStatusTab('All'); setCategoryFilter('All') }}
                className="mt-4 px-4 py-2 rounded-xl bg-eco-500/10 border border-eco-500/30 text-eco-400 text-sm hover:bg-eco-500/20 transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map((c) => (
                <ChallengeCard key={c.id} challenge={c} onToggleJoin={handleToggleJoin} />
              ))}
            </div>
          )}
        </section>

        {/* ── Stats Row at Bottom ───────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 animate-fade-up" style={{ animationDelay: '160ms' }}>
          {BOTTOM_STATS.map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="bg-surface-800 border border-eco-900/40 rounded-2xl p-5 flex items-center gap-4"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}18`, border: `1px solid ${color}33` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-white leading-tight">{value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
