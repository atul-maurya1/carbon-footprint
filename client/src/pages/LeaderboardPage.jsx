// src/pages/LeaderboardPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import {
  Trophy,
  Crown,
  Medal,
  TrendingUp,
  TrendingDown,
  Users,
  Globe,
  Minus,
  Star,
} from 'lucide-react'
import { formatCO2, formatNumber } from '../utils/formatters'

/* ─── Mock Data ─────────────────────────────────────── */
const MOCK_USERS = [
  { rank: 1,  name: 'Priya Sharma',       country: '🇮🇳', level: 8, co2Reduced: 342.1, xp: 15800, change:  0, isMe: false },
  { rank: 2,  name: 'Lucas Green',        country: '🇩🇪', level: 7, co2Reduced: 298.4, xp: 12400, change:  2, isMe: false },
  { rank: 3,  name: 'Aiko Tanaka',        country: '🇯🇵', level: 7, co2Reduced: 276.9, xp: 11900, change: -1, isMe: false },
  { rank: 4,  name: 'Omar Hassan',        country: '🇪🇬', level: 6, co2Reduced: 241.3, xp:  9800, change:  1, isMe: false },
  { rank: 5,  name: 'Sofia Costa',        country: '🇧🇷', level: 6, co2Reduced: 228.7, xp:  9200, change:  3, isMe: false },
  { rank: 6,  name: 'James Park',         country: '🇺🇸', level: 5, co2Reduced: 199.5, xp:  7600, change: -2, isMe: false },
  { rank: 7,  name: 'Alex Johnson',       country: '🇬🇧', level: 3, co2Reduced:  47.3, xp:   780, change:  1, isMe: true  },
  { rank: 8,  name: 'Mei-Ling Zhou',      country: '🇨🇳', level: 5, co2Reduced: 183.2, xp:  7100, change:  0, isMe: false },
  { rank: 9,  name: 'Carlos Rivera',      country: '🇲🇽', level: 5, co2Reduced: 172.8, xp:  6800, change:  2, isMe: false },
  { rank: 10, name: 'Elena Petrov',       country: '🇷🇺', level: 4, co2Reduced: 161.5, xp:  5900, change: -1, isMe: false },
  { rank: 11, name: 'Amara Diallo',       country: '🇸🇳', level: 4, co2Reduced: 155.0, xp:  5500, change:  3, isMe: false },
  { rank: 12, name: 'Keanu Makoa',        country: '🇳🇿', level: 4, co2Reduced: 143.7, xp:  5100, change: -2, isMe: false },
  { rank: 13, name: 'Hana Ito',           country: '🇯🇵', level: 4, co2Reduced: 136.1, xp:  4700, change:  1, isMe: false },
  { rank: 14, name: 'Lena Müller',        country: '🇩🇪', level: 4, co2Reduced: 128.5, xp:  4300, change:  0, isMe: false },
  { rank: 15, name: 'Diego Torres',       country: '🇦🇷', level: 3, co2Reduced: 119.2, xp:  3800, change:  2, isMe: false },
  { rank: 16, name: 'Fatima Al-Sayed',    country: '🇸🇦', level: 3, co2Reduced: 105.6, xp:  3200, change: -1, isMe: false },
  { rank: 17, name: 'Raj Krishnamurthy',  country: '🇮🇳', level: 3, co2Reduced:  91.8, xp:  2700, change:  4, isMe: false },
  { rank: 18, name: 'Isabelle Moreau',    country: '🇫🇷', level: 2, co2Reduced:  78.4, xp:  2100, change:  0, isMe: false },
  { rank: 19, name: 'Nathan Osei',        country: '🇬🇭', level: 2, co2Reduced:  63.7, xp:  1600, change: -3, isMe: false },
  { rank: 20, name: 'Yuna Kim',           country: '🇰🇷', level: 2, co2Reduced:  55.2, xp:  1200, change:  1, isMe: false },
]

const TABS = ['Global', 'This Month', 'Friends']

const FRIENDS_INDICES = [0, 2, 4, 6, 8, 11, 14, 16]

/* ─── Helper: Avatar initials ───────────────────────── */
function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

/* ─── Avatar colors by rank ─────────────────────────── */
function avatarStyle(rank, isMe) {
  if (isMe) return 'bg-eco-500/20 text-eco-400 ring-2 ring-eco-500/40'
  if (rank === 1) return 'bg-amber-500/20 text-amber-400'
  if (rank === 2) return 'bg-gray-400/15 text-gray-300'
  if (rank === 3) return 'bg-orange-700/20 text-orange-400'
  return 'bg-surface-700 text-gray-400'
}

/* ─── Change Indicator ──────────────────────────────── */
function ChangeIndicator({ change }) {
  if (change > 0) return (
    <span className="inline-flex items-center gap-1 text-eco-400 text-sm font-semibold">
      <TrendingUp size={14} />+{change}
    </span>
  )
  if (change < 0) return (
    <span className="inline-flex items-center gap-1 text-red-400 text-sm font-semibold">
      <TrendingDown size={14} />{change}
    </span>
  )
  return <span className="text-gray-500"><Minus size={14} /></span>
}

/* ─── Rank Medal ────────────────────────────────────── */
function RankMedal({ rank }) {
  if (rank === 1) return <Crown size={18} className="text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
  if (rank === 2) return <Medal size={18} className="text-gray-300 drop-shadow-[0_0_6px_rgba(148,163,184,0.4)]" />
  if (rank === 3) return <Trophy size={18} className="text-orange-400 drop-shadow-[0_0_6px_rgba(194,118,58,0.4)]" />
  return <span className="text-gray-500 text-sm font-bold font-display">#{rank}</span>
}

/* ─── PodiumSlot ────────────────────────────────────── */
function PodiumSlot({ user, rank, height, standBg, standBorder, standText, medalIcon }) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1 max-w-[180px]">
      {/* Medal icon above avatar */}
      <div className="mb-1">{medalIcon}</div>
      {/* Avatar */}
      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-display font-black text-lg ${avatarStyle(rank, user?.isMe)}`}>
        {user ? getInitials(user.name) : '?'}
      </div>
      {/* Name */}
      <p className={`text-sm font-semibold text-center leading-tight ${rank === 1 ? 'text-eco-400' : 'text-gray-200'}`}>
        {user?.name || '—'}
      </p>
      {/* CO₂ */}
      <p className="text-xs text-gray-500">{user ? formatCO2(user.co2Reduced * 1000) : '—'}</p>
      {/* Platform stand */}
      <div
        className={`w-full flex items-center justify-center gap-1 rounded-t-2xl font-display font-bold text-lg mt-1 ${standBg} border ${standBorder} ${standText}`}
        style={{ height }}
      >
        {rank === 1 ? '1st' : rank === 2 ? '2nd' : '3rd'}
      </div>
    </div>
  )
}

/* ─── Podium ────────────────────────────────────────── */
function Podium({ users }) {
  const top3 = users.slice(0, 3)
  const first  = top3[0]
  const second = top3[1]
  const third  = top3[2]

  return (
    <div className="bg-surface-800 border border-eco-900/40 rounded-2xl p-6 relative overflow-hidden">
      {/* Glow radial bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(74,222,128,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="flex items-end justify-center gap-4">
        {/* 2nd place */}
        <PodiumSlot
          user={second} rank={2}
          height="6rem"
          standBg="bg-gray-400/10"
          standBorder="border-gray-400/20"
          standText="text-gray-300"
          medalIcon={<Medal size={22} className="text-gray-300" />}
        />
        {/* 1st place */}
        <PodiumSlot
          user={first} rank={1}
          height="8rem"
          standBg="bg-amber-500/15"
          standBorder="border-amber-400/25"
          standText="text-amber-400"
          medalIcon={<Crown size={28} className="text-amber-400 animate-[float_2.5s_ease-in-out_infinite] drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />}
        />
        {/* 3rd place */}
        <PodiumSlot
          user={third} rank={3}
          height="4rem"
          standBg="bg-orange-700/10"
          standBorder="border-orange-600/20"
          standText="text-orange-400"
          medalIcon={<Trophy size={20} className="text-orange-400" />}
        />
      </div>
    </div>
  )
}

/* ─── My Rank Banner ────────────────────────────────── */
function MyRankBanner({ me, totalUsers }) {
  if (!me) return null
  const percentile = Math.round((1 - me.rank / totalUsers) * 100)
  const pct = Math.min(100 - (me.rank / totalUsers) * 100, 100)

  return (
    <div className="bg-eco-900/30 border border-eco-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-4">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Your Rank</span>
          <span className="font-display font-black text-2xl gradient-text">#{me.rank}</span>
        </div>
        <div className="h-10 w-px bg-eco-900/60" />
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-200 font-semibold text-sm">{formatCO2(me.co2Reduced * 1000)} CO₂ reduced</span>
          <span className="text-xs text-eco-400 font-medium">Top {100 - percentile}% globally</span>
        </div>
      </div>
      {/* Progress bar */}
      <div className="sm:w-48 w-full">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>#1</span>
          <span>#{totalUsers}</span>
        </div>
        <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-eco-500 to-lime-400 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}

/* ─── Leaderboard Table ─────────────────────────────── */
function LeaderboardTable({ users }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-eco-900/40">
      <table className="w-full border-collapse bg-surface-800">
        <thead>
          <tr className="bg-surface-900 border-b border-eco-900/30">
            {['Rank', 'User', 'Country', 'CO₂ Reduced', 'Level', 'XP', 'Change'].map(h => (
              <th
                key={h}
                className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const rowBg = user.isMe
              ? 'bg-eco-500/8 border-l-2 border-eco-500'
              : user.rank === 1
              ? 'bg-[linear-gradient(90deg,rgba(251,191,36,0.07)_0%,transparent_60%)]'
              : user.rank === 2
              ? 'bg-[linear-gradient(90deg,rgba(148,163,184,0.06)_0%,transparent_60%)]'
              : user.rank === 3
              ? 'bg-[linear-gradient(90deg,rgba(194,118,58,0.06)_0%,transparent_60%)]'
              : ''

            return (
              <tr
                key={user.rank}
                className={`border-b border-eco-900/20 last:border-b-0 hover:bg-surface-700/30 transition-colors ${rowBg}`}
              >
                {/* Rank */}
                <td className="px-5 py-4 w-16 text-center">
                  <RankMedal rank={user.rank} />
                </td>

                {/* User */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black font-display shrink-0 ${avatarStyle(user.rank, user.isMe)}`}>
                      {getInitials(user.name)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-100 font-medium text-sm">{user.name}</span>
                      {user.isMe && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-eco-500/15 text-eco-400 border border-eco-500/20">
                          You
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Country */}
                <td className="px-5 py-4 text-lg">{user.country}</td>

                {/* CO₂ Reduced */}
                <td className="px-5 py-4">
                  <span className="text-eco-400 font-semibold font-display text-sm">
                    {formatCO2(user.co2Reduced * 1000)}
                  </span>
                </td>

                {/* Level */}
                <td className="px-5 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    Lv. {user.level}
                  </span>
                </td>

                {/* XP */}
                <td className="px-5 py-4">
                  <span className="text-gray-300 text-sm font-display">
                    {formatNumber(user.xp, 0)} XP
                  </span>
                </td>

                {/* Change */}
                <td className="px-5 py-4">
                  <ChangeIndicator change={user.change} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Main Page ─────────────────────────────────────── */
export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('Global')

  const me = MOCK_USERS.find(u => u.isMe)

  const displayUsers =
    activeTab === 'Friends'
      ? FRIENDS_INDICES.map(i => MOCK_USERS[i]).filter(Boolean)
      : activeTab === 'This Month'
      ? [...MOCK_USERS].sort(() => Math.random() - 0.5).map((u, i) => ({ ...u, rank: i + 1 }))
      : MOCK_USERS

  return (
    <div className="flex min-h-screen bg-surface-950">
      <Sidebar />

      {/* Main content */}
      <main className="ml-64 flex-1 min-w-0 py-8 px-6 lg:px-10 overflow-y-auto">
        {/* ── Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="font-display font-black text-3xl lg:text-4xl text-gray-100 flex items-center gap-3 mb-1">
              <Trophy size={32} className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]" />
              Global Leaderboard
            </h1>
            <p className="text-gray-400">See how you compare with eco warriors worldwide</p>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 bg-surface-900 border border-eco-900/30 rounded-2xl p-1">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-eco-500/15 text-eco-400 border border-eco-500/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-surface-800'
                }`}
              >
                {tab === 'Global'     && <Globe size={14} />}
                {tab === 'This Month' && <TrendingUp size={14} />}
                {tab === 'Friends'    && <Users size={14} />}
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Community Stats Bar ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Globe,  label: 'Total CO₂ Reduced', value: '234.5 tons', sub: 'by the community' },
            { icon: Users,  label: 'Active Warriors',    value: '18,432',     sub: 'this month' },
            { icon: Trophy, label: 'Challenges Won',     value: '45,120',     sub: 'and counting' },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div
              key={label}
              className="flex items-center gap-4 bg-surface-900 border border-eco-900/30 rounded-2xl px-6 py-4"
            >
              <div className="w-11 h-11 rounded-xl bg-eco-500/10 border border-eco-500/20 flex items-center justify-center text-eco-400 shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <p className="font-display font-extrabold text-xl text-gray-100 leading-tight">{value}</p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
                <p className="text-xs text-gray-600">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Top 3 Podium ── */}
        {activeTab !== 'Friends' && (
          <section className="mb-8">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-200 mb-4">
              <Crown size={18} className="text-amber-400" /> Top Champions
            </h2>
            <Podium users={displayUsers} />
          </section>
        )}

        {/* ── My Rank Banner ── */}
        <MyRankBanner me={me} totalUsers={MOCK_USERS.length} />

        {/* ── Leaderboard Table ── */}
        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-200 mb-4">
            <Medal size={18} className="text-gray-300" /> Rankings
          </h2>
          <LeaderboardTable users={displayUsers} />
        </section>

        {/* Bottom spacer */}
        <div className="h-10" />
      </main>
    </div>
  )
}
