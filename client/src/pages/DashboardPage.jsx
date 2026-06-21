import React from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { TrendingDown, TrendingUp, Flame, Bot, ChevronRight, Zap, Target, Trophy, Plus, Car, Utensils, Zap as ZapIcon, ShoppingBag, Trash2 } from 'lucide-react'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/constants'
import { formatCO2 } from '../utils/formatters'

const MOCK_TREND_DATA = [
  { date: 'Jun 1', co2: 8.2 }, { date: 'Jun 2', co2: 7.5 }, { date: 'Jun 3', co2: 9.1 },
  { date: 'Jun 4', co2: 6.8 }, { date: 'Jun 5', co2: 12.4 }, { date: 'Jun 6', co2: 5.2 },
  { date: 'Jun 7', co2: 8.9 }, { date: 'Jun 8', co2: 7.1 }, { date: 'Jun 9', co2: 6.5 },
  { date: 'Jun 10', co2: 8.0 }, { date: 'Jun 11', co2: 2.3 }
]

const MOCK_PIE_DATA = [
  { name: 'Transport', value: 42 },
  { name: 'Food', value: 31 },
  { name: 'Energy', value: 18 },
  { name: 'Shopping', value: 6 },
  { name: 'Waste', value: 3 }
]

const MOCK_ACTIVITIES = [
  { icon: '🚗', category: 'transport', desc: 'Drove 22km (gasoline)', co2: 4.2, date: 'Today' },
  { icon: '🍽️', category: 'food', desc: 'Beef burger for lunch', co2: 2.7, date: 'Today' },
  { icon: '⚡', category: 'energy', desc: 'Home electricity (3 hrs AC)', co2: 1.3, date: 'Yesterday' },
  { icon: '🛍️', category: 'shopping', desc: 'New shirt purchase', co2: 10.0, date: '2 days ago' },
  { icon: '♻️', category: 'waste', desc: 'Recycled 2kg paper', co2: -0.04, date: '3 days ago' }
]

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      <Sidebar />
      <div className="ml-64 flex-1 overflow-y-auto p-4 sm:p-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-fade-up">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Good morning, Alex 👋</h1>
            <p className="text-gray-400 text-sm mt-1">Wednesday, June 11 · Your footprint is 12% below average</p>
          </div>
          <button
            onClick={() => navigate('/calculator')}
            className="flex items-center justify-center gap-2 bg-eco-500 hover:bg-eco-400 text-surface-950 font-semibold rounded-xl px-5 py-2.5 transition-all"
          >
            <Plus className="w-5 h-5" /> Log Activity
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <StatCard label="Today's CO₂" value="2.3 kg" trend="-8%" icon={Zap} color="eco" />
          <StatCard label="This Week" value="18.4 kg" trend="-12%" icon={TrendingDown} color="eco" />
          <StatCard label="This Month" value="74.2 kg" trend="-5%" icon={Target} color="eco" />
          <StatCard label="CO₂ Saved" value="47.3 kg" trend="+18%" icon={Trophy} color="lime" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white">Footprint Trend</h3>
                <div className="flex bg-surface-900 rounded-lg p-1">
                  <button className="px-3 py-1 rounded-md text-xs font-medium text-gray-400 hover:text-white">7d</button>
                  <button className="px-3 py-1 rounded-md text-xs font-medium bg-surface-700 text-white">30d</button>
                  <button className="px-3 py-1 rounded-md text-xs font-medium text-gray-400 hover:text-white">90d</button>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <LineChart data={MOCK_TREND_DATA} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f1912', borderColor: '#166534', borderRadius: '12px', color: '#f3f4f6' }}
                      itemStyle={{ color: '#4ade80' }}
                    />
                    <Line type="monotone" dataKey="co2" stroke="#4ade80" strokeWidth={3} dot={{ fill: '#22c55e', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#a3e635' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Recent Activities</h3>
                <button className="text-sm text-eco-400 hover:text-eco-300">View all</button>
              </div>
              <div className="space-y-3">
                {MOCK_ACTIVITIES.map((act, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-700/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: CATEGORY_COLORS[act.category] + '20' }}>
                        {act.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{act.desc}</div>
                        <div className="text-xs text-gray-400">{act.date}</div>
                      </div>
                    </div>
                    <Badge variant={act.co2 < 0 ? 'green' : 'gray'}>{act.co2 > 0 ? '+' : ''}{act.co2} kg</Badge>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Quick Log Section */}
            <div>
              <h3 className="font-bold text-white mb-4">Quick Log</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { id: 'transport', icon: Car, label: 'Transport', color: 'bg-sky-400/10 text-sky-400 border-sky-400/20 hover:bg-sky-400/20 hover:border-sky-400/40' },
                  { id: 'food', icon: Utensils, label: 'Food', color: 'bg-eco-400/10 text-eco-400 border-eco-400/20 hover:bg-eco-400/20 hover:border-eco-400/40' },
                  { id: 'energy', icon: ZapIcon, label: 'Energy', color: 'bg-amber-400/10 text-amber-400 border-amber-400/20 hover:bg-amber-400/20 hover:border-amber-400/40' },
                  { id: 'shopping', icon: ShoppingBag, label: 'Shopping', color: 'bg-violet-400/10 text-violet-400 border-violet-400/20 hover:bg-violet-400/20 hover:border-violet-400/40' },
                  { id: 'waste', icon: Trash2, label: 'Waste', color: 'bg-red-400/10 text-red-400 border-red-400/20 hover:bg-red-400/20 hover:border-red-400/40' },
                ].map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => navigate(`/calculator?category=${cat.id}`)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${cat.color}`}
                  >
                    <cat.icon className="w-6 h-6" />
                    <span className="text-xs font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card glow className="bg-gradient-to-br from-surface-800 to-surface-900 border-eco-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="w-5 h-5 text-eco-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-eco-400">AI Insight</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                Your beef consumption accounts for 31% of your food footprint. Try replacing 2 meals/week with legumes — saves ~6kg CO₂/week.
              </p>
              <button onClick={() => navigate('/insights')} className="text-sm text-eco-400 font-medium hover:text-eco-300 flex items-center gap-1">
                Chat with AI Coach <ChevronRight className="w-4 h-4" />
              </button>
            </Card>

            <Card>
              <h3 className="font-bold text-white mb-4">Footprint Breakdown</h3>
              <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <PieChart>
                    <Pie data={MOCK_PIE_DATA} innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                      {MOCK_PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name.toLowerCase()]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f1912', borderColor: '#166534', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-display font-bold text-white">74.2</span>
                  <span className="text-xs text-gray-400">kg CO₂</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {MOCK_PIE_DATA.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[entry.name.toLowerCase()] }}></div>
                      <span className="text-gray-400">{entry.name}</span>
                    </div>
                    <span className="text-white font-medium">{entry.value}%</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-bold text-white mb-4">Active Challenges</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-white">No-Car Week</span>
                    <span className="text-eco-400 text-xs font-bold">150 XP</span>
                  </div>
                  <ProgressBar value={60} color="eco" showPercent={false} />
                  <div className="text-right text-xs text-gray-500 mt-1">60% Complete</div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-white">Plant-Based Week</span>
                    <span className="text-eco-400 text-xs font-bold">100 XP</span>
                  </div>
                  <ProgressBar value={35} color="lime" showPercent={false} />
                  <div className="text-right text-xs text-gray-500 mt-1">35% Complete</div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-white">7 Day Streak 🔥</h3>
                  <p className="text-xs text-gray-400">Log activity today to keep it going!</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-surface-900 border border-surface-700 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌾</span>
                  <span className="font-bold text-white text-sm">Level 3: Sprout</span>
                </div>
                <Badge variant="green">780 XP</Badge>
              </div>
              <ProgressBar value={78} color="eco" showPercent={false} />
              <div className="text-center text-xs text-gray-500 mt-2">220 XP to Level 4 (Leafy)</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
