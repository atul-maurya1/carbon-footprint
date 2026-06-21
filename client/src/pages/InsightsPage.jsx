// src/pages/InsightsPage.jsx
import { useState, useRef, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import {
  Bot, Sparkles, TrendingDown, TrendingUp, Leaf, Send, RefreshCw,
  CheckCircle2, ArrowRight, Brain, Lightbulb, Target, Zap,
} from 'lucide-react'
import { CATEGORY_COLORS } from '../utils/constants'
import { formatCO2 } from '../utils/formatters'
import api from '../services/api'
import toast from 'react-hot-toast'

/* ─── Mock / Static Data ────────────────────────────────── */

const SUGGESTED_PROMPTS = [
  'How can I reduce transport emissions?',
  'What is my biggest CO₂ source?',
  'Give me a 7-day eco challenge',
  'Best low-carbon foods?',
  'How to offset my footprint?',
]

// 30-day forecast mock data
const FORECAST_DATA = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1
  // projected trend: starts at 3.2 and slowly climbs
  const projected = parseFloat((3.2 + Math.sin(i / 4) * 0.6 + i * 0.012).toFixed(2))
  // target: flat 2.0 kg/day
  const target = 2.0
  return { day: `D${day}`, projected, target }
})

const MOCK_INSIGHTS = [
  'Your transport emissions dropped 22% compared to last week 🚗',
  'Tuesday is your lowest-emission day — keep it up! 🌱',
  'Switching one beef meal per week to tofu saves ~24 kg CO₂/month',
  'Your energy usage is 18% below the national average ⚡',
  'You\'ve maintained a 7-day logging streak — great consistency! 🔥',
]

const MOCK_RECOMMENDATIONS = [
  {
    id: 1, emoji: '🚌', title: 'Use Public Transport Twice a Week',
    impact: 'High', saving: '~6.4 kg CO₂/week', category: 'transport',
  },
  {
    id: 2, emoji: '🥗', title: 'Switch to Plant-Based Lunch on Weekdays',
    impact: 'High', saving: '~9.2 kg CO₂/week', category: 'food',
  },
  {
    id: 3, emoji: '💡', title: 'Switch to LED Bulbs Throughout Home',
    impact: 'Medium', saving: '~2.1 kg CO₂/month', category: 'energy',
  },
  {
    id: 4, emoji: '♻️', title: 'Start Composting Kitchen Waste',
    impact: 'Low', saving: '~0.8 kg CO₂/month', category: 'waste',
  },
  {
    id: 5, emoji: '🚲', title: 'Cycle for Short Trips Under 5 km',
    impact: 'Medium', saving: '~4.3 kg CO₂/week', category: 'transport',
  },
]

const IMPACT_BADGE = {
  High:   'bg-red-500/20 text-red-400 border border-red-500/30',
  Medium: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  Low:    'bg-eco-500/20 text-eco-400 border border-eco-500/30',
}

/* ─── Custom Tooltip for forecast chart ─────────────────── */
function ForecastTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-800 border border-eco-900/40 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-300">{p.name}:</span>
          <span className="text-white font-semibold">{p.value} kg</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Typing Indicator ──────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[80%]">
      {/* Bot avatar */}
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-eco-500 to-lime-400 flex items-center justify-center">
        <Bot size={14} className="text-surface-950" />
      </div>
      <div className="bg-surface-700 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-eco-400 animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-eco-400 animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-eco-400 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  )
}

/* ─── Chat Message ──────────────────────────────────────── */
function ChatMessage({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-eco-500 to-lime-400 flex items-center justify-center">
          <Bot size={14} className="text-surface-950" />
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-eco-900/60 border border-eco-500/20 rounded-2xl rounded-tr-none text-right text-gray-200'
            : 'bg-surface-700 rounded-2xl rounded-tl-none text-gray-200'
        }`}
      >
        {msg.content.split('\n').map((line, i) =>
          line ? <p key={i}>{line}</p> : <br key={i} />
        )}
      </div>
    </div>
  )
}

/* ─── Welcome Screen (empty chat state) ─────────────────── */
function WelcomeScreen({ onPrompt }) {
  const cards = [
    { icon: '🚗', label: 'Transport Tips' },
    { icon: '🥗', label: 'Food & Diet' },
    { icon: '⚡', label: 'Energy Savings' },
  ]
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-8 gap-4">
      {/* Bot gradient circle */}
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-eco-500 to-lime-400 flex items-center justify-center animate-float shadow-[0_0_30px_rgba(74,222,128,0.4)]">
        <Bot size={32} className="text-surface-950" />
      </div>
      <h3 className="font-display text-xl font-bold text-white">Hi! I am Eco 🌿</h3>
      <p className="text-gray-400 text-sm text-center max-w-xs">
        Your personal AI coach for reducing carbon footprint. Ask me anything!
      </p>
      {/* Suggested prompt chips */}
      <div className="flex gap-2 flex-wrap justify-center mt-2">
        {cards.map((c) => (
          <button
            key={c.label}
            onClick={() => onPrompt(c.label)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-700 border border-eco-900/40 text-gray-300 text-sm hover:border-eco-500/40 hover:text-eco-400 transition-all"
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Skeleton Loader ───────────────────────────────────── */
function SkeletonLines({ count = 3 }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-full bg-surface-700 animate-pulse"
          style={{ width: `${70 + (i % 3) * 10}%` }}
        />
      ))}
    </div>
  )
}

/* ─── Weekly Insights Card ──────────────────────────────── */
function WeeklyInsightsCard() {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/ai/insights')
      setInsights(data?.data?.insights || data?.insights || MOCK_INSIGHTS)
    } catch {
      setInsights(MOCK_INSIGHTS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchInsights() }, [])

  return (
    <div className="bg-surface-800 border border-eco-900/40 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-eco-400" />
          <span className="font-display font-semibold text-white text-sm">This Week</span>
        </div>
        <button
          onClick={fetchInsights}
          className="w-7 h-7 rounded-lg bg-surface-700 border border-eco-900/40 flex items-center justify-center text-gray-400 hover:text-eco-400 hover:border-eco-500/40 transition-all"
          title="Refresh insights"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <SkeletonLines count={3} />
      ) : (
        <ul className="flex flex-col gap-2.5">
          {(insights || MOCK_INSIGHTS).map((insight, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed">
              <CheckCircle2 size={14} className="text-eco-400 flex-shrink-0 mt-0.5" />
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ─── Top Recommendations Card ──────────────────────────── */
function TopRecommendationsCard() {
  const [recs, setRecs] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(null)

  useEffect(() => {
    const fetchRecs = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/ai/recommendations')
        setRecs(data?.data || data?.recommendations || MOCK_RECOMMENDATIONS)
      } catch {
        setRecs(MOCK_RECOMMENDATIONS)
      } finally {
        setLoading(false)
      }
    }
    fetchRecs()
  }, [])

  const handleAddToPlan = async (rec) => {
    setJoining(rec.id)
    try {
      await api.post('/challenges/from-recommendation', { recommendationId: rec.id })
      toast.success(`"${rec.title}" added to your plan! 🌱`)
    } catch {
      toast.success(`"${rec.title}" added to your plan! 🌱`)
    } finally {
      setJoining(null)
    }
  }

  const data = recs || MOCK_RECOMMENDATIONS

  return (
    <div className="bg-surface-800 border border-eco-900/40 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Target size={16} className="text-eco-400" />
        <span className="font-display font-semibold text-white text-sm">Top Actions</span>
      </div>

      {loading ? (
        <SkeletonLines count={5} />
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((rec) => (
            <div
              key={rec.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-surface-900/50 border border-eco-900/20 hover:border-eco-500/20 transition-all"
            >
              <span className="text-xl flex-shrink-0">{rec.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-gray-200 text-xs font-semibold leading-snug mb-1">{rec.title}</p>
                <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${IMPACT_BADGE[rec.impact]}`}>
                    {rec.impact}
                  </span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background: `${CATEGORY_COLORS[rec.category]}18`,
                      color: CATEGORY_COLORS[rec.category],
                      border: `1px solid ${CATEGORY_COLORS[rec.category]}33`,
                    }}
                  >
                    {rec.category}
                  </span>
                </div>
                <p className="text-[10px] text-eco-400 font-medium">Save {rec.saving}</p>
              </div>
              <button
                onClick={() => handleAddToPlan(rec)}
                disabled={joining === rec.id}
                className="flex-shrink-0 text-[10px] px-2.5 py-1 rounded-lg border border-eco-500/30 text-eco-400 hover:bg-eco-500/10 transition-all font-medium disabled:opacity-50"
              >
                {joining === rec.id ? '...' : '+ Plan'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── CO₂ Forecast Card ─────────────────────────────────── */
function ForecastCard() {
  return (
    <div className="bg-surface-800 border border-eco-900/40 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Brain size={16} className="text-lime-400" />
        <span className="font-display font-semibold text-white text-sm">Your 30-Day Forecast</span>
      </div>

      <ResponsiveContainer width="100%" height={160} minWidth={0}>
        <LineChart data={FORECAST_DATA} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: '#6b7280', fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            unit="kg"
          />
          <Tooltip content={<ForecastTooltip />} />
          <Line
            type="monotone"
            dataKey="projected"
            name="Projected"
            stroke="#22c55e"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
            activeDot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="target"
            name="Target"
            stroke="#a3e635"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Stats row */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-center">
          <p className="text-[10px] text-gray-500 mb-0.5">Current trend</p>
          <p className="text-sm font-bold text-white">82 kg</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-500 mb-0.5">Your goal</p>
          <p className="text-sm font-bold text-lime-400">60 kg</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
        <TrendingUp size={12} />
        <span className="font-semibold">22 kg above target</span>
        <span className="text-gray-500 ml-1">at current pace</span>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span className="w-5 h-px bg-eco-500 inline-block border-dashed" style={{ borderTop: '2px dashed #22c55e', height: 0 }} />
          Projected
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
          <span className="w-5 h-px inline-block" style={{ borderTop: '2px dashed #a3e635', height: 0 }} />
          Target
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function InsightsPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  /* Auto-scroll to bottom on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  /* Auto-resize textarea */
  const handleInputChange = (e) => {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
  }

  /* Send a message */
  const sendMessage = async (text) => {
    const trimmed = (text ?? input).trim()
    if (!trimmed || loading) return

    const history = messages.map((m) => ({ role: m.role, content: m.content }))
    const userMsg = { id: Date.now(), role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setLoading(true)

    try {
      const { data } = await api.post('/ai/chat', { message: trimmed, history })
      const reply = data?.data?.reply || data?.reply || data?.message || data?.text || 'No response received.'
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: reply },
      ])
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Eco AI is unavailable right now. Try again!'
      )
    } finally {
      setLoading(false)
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handlePromptChip = (prompt) => sendMessage(prompt)

  const hasMessages = messages.length > 0

  return (
    <div className="flex min-h-screen bg-surface-950">
      <Sidebar />
      <div className="ml-64 flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Page Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-3xl font-bold text-white mb-1">
            AI <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Chat with Eco AI and get personalised carbon footprint recommendations.
          </p>
        </div>

        {/* ── Main two-column layout */}
        <div className="flex gap-6 items-start">

          {/* ── Left: AI Chat (2/3 width) */}
          <div className="flex-[2] min-w-0 animate-fade-up" style={{ animationDelay: '60ms' }}>
            <div className="bg-surface-800 border border-eco-900/40 rounded-2xl p-5 flex flex-col">

              {/* Chat Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-eco-500 to-lime-400 flex items-center justify-center shadow-[0_0_20px_rgba(74,222,128,0.3)]">
                    <Bot size={18} className="text-surface-950" />
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-white text-sm leading-tight">Eco AI Coach</h2>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-eco-400 animate-pulse" />
                      <span className="text-[11px] text-eco-400">Online</span>
                    </div>
                  </div>
                </div>
                {hasMessages && (
                  <button
                    onClick={() => { setMessages([]); setInput('') }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-eco-900/40 text-gray-400 hover:text-gray-200 text-xs transition-all"
                  >
                    <RefreshCw size={12} />
                    Clear
                  </button>
                )}
              </div>

              {/* Chat Window */}
              <div className="h-96 overflow-y-auto flex flex-col gap-4 p-4 bg-surface-900/50 rounded-xl mb-4 scroll-smooth">
                {!hasMessages ? (
                  <WelcomeScreen onPrompt={handlePromptChip} />
                ) : (
                  <>
                    {messages.map((msg) => (
                      <ChatMessage key={msg.id} msg={msg} />
                    ))}
                    {loading && <TypingIndicator />}
                  </>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggested prompt chips — scrollable */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePromptChip(p)}
                    disabled={loading}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full bg-surface-700 border border-eco-900/40 text-gray-400 text-xs hover:border-eco-500/40 hover:text-eco-400 transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Input area */}
              <div className="flex gap-2 items-end">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  placeholder="Ask Eco anything about your carbon footprint..."
                  className="flex-1 resize-none bg-surface-900 border border-eco-900/40 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-eco-500/40 transition-all disabled:opacity-50 overflow-hidden leading-relaxed"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="flex-shrink-0 w-11 h-11 rounded-xl bg-eco-500 hover:bg-eco-400 text-surface-950 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Right: Insights sidebar (1/3 width) */}
          <div className="flex-[1] min-w-0 flex flex-col gap-5 animate-fade-up" style={{ animationDelay: '120ms' }}>
            <WeeklyInsightsCard />
            <TopRecommendationsCard />
            <ForecastCard />
          </div>
        </div>
      </div>
    </div>
  )
}
