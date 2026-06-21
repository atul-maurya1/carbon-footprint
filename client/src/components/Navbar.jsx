// src/components/Navbar.jsx
import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Bell, Menu, X, Zap, MessageSquare, ClipboardList } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { LEVELS } from '../utils/constants'

const navLinks = [
  { to: '/dashboard',   label: 'Dashboard'  },
  { to: '/log',         label: 'Log'        },
  { to: '/calculator',  label: 'Calculator' },
  { to: '/insights',    label: 'Insights'   },
  { to: '/ai-coach',    label: 'AI Coach'   },
  { to: '/challenges',  label: 'Challenges' },
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

export default function Navbar() {
  const { user, isAuthenticated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const userXP = user?.stats?.xp ?? 0
  const currentLevel = [...LEVELS].reverse().find(l => userXP >= l.minXP) || LEVELS[0]

  const linkBase =
    'text-sm font-medium transition-colors duration-200'
  const linkActive = 'text-eco-400 font-semibold'
  const linkInactive = 'text-gray-400 hover:text-gray-100'

  return (
    <header className="sticky top-0 z-50 glass">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* ── Logo ── */}
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0 group"
          aria-label="EcoGuide AI home"
        >
          <LeafIcon />
          <span className="font-display font-bold text-xl text-gray-100 group-hover:text-eco-400 transition-colors">
            EcoGuide <span className="gradient-text">AI</span>
          </span>
        </Link>

        {isAuthenticated ? (
          <>
            {/* ── Desktop Nav (Authenticated) ── */}
            <ul className="hidden md:flex items-center gap-1" role="list">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? linkActive : linkInactive} px-4 py-2 rounded-xl hover:bg-eco-500/8 transition-all`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* ── Right Controls (Authenticated) ── */}
            <div className="flex items-center gap-3">
              {/* XP Badge */}
              <span className="hidden sm:inline-flex items-center gap-1.5 bg-eco-500/15 border border-eco-500/25 text-eco-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                <Zap size={12} className="fill-eco-400 text-eco-400" />
                {userXP} XP
              </span>

              {/* Notification Bell */}
              <button
                type="button"
                className="relative p-2 rounded-xl text-gray-400 hover:text-eco-400 hover:bg-eco-500/8 transition-all"
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-eco-400 rounded-full ring-2 ring-surface-950" />
              </button>

              {/* Avatar */}
              <button
                type="button"
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-eco-500 to-lime-400 flex items-center justify-center text-surface-950 font-bold text-sm shrink-0 hover:opacity-90 transition-opacity"
                aria-label="User menu"
              >
                {getInitials(user)}
              </button>

              {/* Hamburger (mobile) */}
              <button
                type="button"
                className="md:hidden p-2 rounded-xl text-gray-400 hover:text-eco-400 hover:bg-eco-500/8 transition-all"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </>
        ) : (
          /* ── Right Controls (Public / Not Authenticated) ── */
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-400 hover:text-gray-100 px-4 py-2 rounded-xl hover:bg-eco-500/8 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-eco-500 hover:bg-eco-400 text-surface-950 font-semibold text-sm px-5 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-eco-400/25 hover:shadow-md"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>

      {/* ── Mobile Menu (Authenticated only) ── */}
      {isAuthenticated && (
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          aria-hidden={!mobileOpen}
        >
          <div className="px-4 pb-4 pt-2 flex flex-col gap-1 border-t border-eco-900/30">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive
                      ? 'text-eco-400 font-semibold bg-eco-500/12 border border-eco-500/20'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-eco-500/8'
                  } px-4 py-3 rounded-xl transition-all`
                }
              >
                {label}
              </NavLink>
            ))}

            {/* Mobile XP */}
            <div className="mt-2 pt-3 border-t border-eco-900/30 flex items-center justify-between">
              <span className="flex items-center gap-1.5 bg-eco-500/15 border border-eco-500/25 text-eco-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                <Zap size={12} className="fill-eco-400 text-eco-400" />
                {userXP} XP
              </span>
              <span className="text-gray-500 text-xs">{user?.displayName ?? user?.email ?? 'Guest'}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

