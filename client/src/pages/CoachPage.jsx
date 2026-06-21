// src/pages/CoachPage.jsx
import { useState, useRef, useEffect } from 'react'
import { Send, Brain, Leaf, Sparkles, MessageSquare, Loader2 } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Card from '../components/ui/Card'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const SUGGESTED_PROMPTS = [
  { icon: '🌍', text: 'How can I reduce my carbon footprint?' },
  { icon: '🚗', text: "What's the impact of my daily commute?" },
  { icon: '🥗', text: 'Suggest eco-friendly meal alternatives' },
  { icon: '📋', text: 'Help me create a sustainability plan' },
]

function getInitials(user) {
  if (!user) return 'U'
  const name = user.displayName || user.name
  if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  return (user.email?.[0] ?? 'U').toUpperCase()
}

export default function CoachPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const sendMessage = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || isLoading) return

    const newUserMsg = { role: 'user', content: userMsg, timestamp: new Date() }
    setMessages(prev => [...prev, newUserMsg])
    setInput('')
    setIsLoading(true)

    try {
      const history = [...messages, newUserMsg].map(m => ({
        role: m.role,
        content: m.content,
      }))

      const res = await api.post('/ai/chat', { message: userMsg, history })
      const reply = res.data.data.reply

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: reply, timestamp: new Date() },
      ])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I couldn't process that request right now. Please try again in a moment. 🌿",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (d) => new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 min-h-screen bg-surface-950 flex flex-col">
        {/* Header */}
        <div className="glass border-b border-eco-900/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-eco-500 to-lime-400 flex items-center justify-center">
              <Brain size={20} className="text-surface-950" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-gray-100">
                Eco <span className="gradient-text">AI Coach</span>
              </h1>
              <p className="text-xs text-gray-500">Your personal sustainability advisor — powered by Gemini AI</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 ? (
            /* Welcome Screen */
            <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto text-center animate-fade-up">
              <div className="w-20 h-20 rounded-2xl bg-eco-500/15 border border-eco-500/25 flex items-center justify-center mb-6 animate-float">
                <Leaf size={36} className="text-eco-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-100 mb-2">
                Hi{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}! I'm <span className="gradient-text">Eco</span>
              </h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-md">
                I'm your personal sustainability coach. I can help you understand your carbon footprint,
                suggest eco-friendly alternatives, and create personalized reduction plans based on your lifestyle.
              </p>

              {/* Suggested Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt.text)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-surface-800 border border-eco-900/40 text-left hover:border-eco-500/30 hover:bg-surface-800/80 hover:shadow-lg hover:shadow-eco-500/5 transition-all duration-200 group"
                  >
                    <span className="text-xl shrink-0">{prompt.icon}</span>
                    <span className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors">{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="max-w-3xl mx-auto space-y-5">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 animate-fade-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {/* AI Avatar */}
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-eco-500/15 border border-eco-500/25 flex items-center justify-center shrink-0 mt-1">
                      <Leaf size={14} className="text-eco-400" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-eco-500/15 border border-eco-500/25 rounded-br-md'
                      : 'bg-surface-800 border border-eco-900/40 border-l-2 border-l-eco-500/50 rounded-bl-md'
                  }`}>
                    <div className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>
                    <p className="text-[10px] text-gray-600 mt-2">{formatTime(msg.timestamp)}</p>
                  </div>

                  {/* User Avatar */}
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-eco-500 to-lime-400 flex items-center justify-center text-surface-950 font-bold text-xs shrink-0 mt-1">
                      {getInitials(user)}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex gap-3 animate-fade-up">
                  <div className="w-8 h-8 rounded-xl bg-eco-500/15 border border-eco-500/25 flex items-center justify-center shrink-0">
                    <Leaf size={14} className="text-eco-400" />
                  </div>
                  <div className="bg-surface-800 border border-eco-900/40 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-eco-400/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-eco-400/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-eco-400/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-eco-900/30 bg-surface-900/60 backdrop-blur-sm px-6 py-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Eco anything about sustainability..."
              disabled={isLoading}
              className="flex-1 bg-surface-700 text-gray-100 placeholder-gray-500 rounded-xl border border-eco-900/40 px-4 py-3 text-sm outline-none focus:border-eco-500 focus:ring-2 focus:ring-eco-500/20 transition-all disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 rounded-xl bg-eco-500 hover:bg-eco-400 text-surface-950 flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shrink-0"
              aria-label="Send message"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          <p className="max-w-3xl mx-auto text-[10px] text-gray-600 mt-2 text-center">
            Eco provides general sustainability advice. Always verify specific environmental claims.
          </p>
        </div>
      </main>
    </div>
  )
}
