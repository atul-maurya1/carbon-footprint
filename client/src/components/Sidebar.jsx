// src/components/Sidebar.jsx
import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Calculator,
  Sparkles,
  Trophy,
  BarChart3,
  User,
  LogOut,
  ClipboardList,
  MessageSquare,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { LEVELS } from '../utils/constants'

const navItems = [
  { to: '/dashboard',   label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/log',         label: 'Log Activity', icon: ClipboardList   },
  { to: '/calculator',  label: 'Carbon Calc',  icon: Calculator      },
  { to: '/insights',    label: 'AI Insights',  icon: Sparkles        },
  { to: '/ai-coach',    label: 'AI Coach',     icon: MessageSquare   },
  { to: '/challenges',  label: 'Challenges',   icon: Trophy          },
  { to: '/leaderboard', label: 'Leaderboard',  icon: BarChart3       },
  { to: '/profile',     label: 'Profile',      icon: User            },
]

function LeafIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4ade80"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

function getInitials(user) {
  if (!user) return 'U'
  const name = user.displayName || user.name
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return (user.email?.[0] ?? 'U').toUpperCase()
}

function getUserLevel(xp) {
  const level = [...LEVELS].reverse().find(l => xp >= l.minXP) || LEVELS[0]
  const nextLevel = LEVELS.find(l => l.minXP > xp) || LEVELS[LEVELS.length - 1]
  const progress = nextLevel.minXP > level.minXP
    ? ((xp - level.minXP) / (nextLevel.minXP - level.minXP)) * 100
    : 100
  return { ...level, nextLevel, progress: Math.round(progress) }
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const userXP = user?.stats?.xp ?? 0
  const levelInfo = getUserLevel(userXP)

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-900 border-r border-eco-900/30 flex flex-col z-40">
      {/* ── Logo ── */}
      <div className="px-5 py-5 border-b border-eco-900/30">
        <Link
          to="/"
          className="flex items-center gap-2 group"
          aria-label="EcoGuide AI home"
        >
          <LeafIcon />
          <span className="font-display font-bold text-xl text-gray-100 group-hover:text-eco-400 transition-colors">
            EcoGuide <span className="gradient-text">AI</span>
          </span>
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-4" aria-label="Sidebar navigation">
        <ul className="flex flex-col gap-0.5" role="list">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to} className="px-2">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? 'bg-eco-500/12 text-eco-400 border border-eco-500/20 font-medium'
                      : 'text-gray-400 hover:text-eco-400 hover:bg-eco-500/8 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={`shrink-0 transition-colors ${
                        isActive ? 'text-eco-400' : 'text-gray-500'
                      }`}
                    />
                    <span>{label}</span>
                    {/* Active indicator dot */}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-eco-400" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── User Card ── */}
      <div className="p-3 border-t border-eco-900/30">
        <div className="bg-surface-800 border border-eco-900/30 rounded-xl p-3">
          {/* User info row */}
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-eco-500 to-lime-400 flex items-center justify-center text-surface-950 font-bold text-sm shrink-0">
              {getInitials(user)}
            </div>
            <div className="min-w-0">
              <p className="text-gray-100 text-sm font-medium truncate">
                {user?.displayName ?? user?.email ?? 'Guest User'}
              </p>
              <p className="text-gray-500 text-xs truncate">Level {levelInfo.level} {levelInfo.name} {levelInfo.emoji}</p>
            </div>
          </div>

          {/* XP progress */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{userXP} XP</span>
              <span>{levelInfo.nextLevel.minXP} XP</span>
            </div>
            <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-eco-500 to-lime-400 rounded-full transition-all duration-700"
                style={{ width: `${levelInfo.progress}%` }}
              />
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            type="button"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/8 border border-transparent hover:border-red-500/20 transition-all text-xs font-medium"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  )
}
