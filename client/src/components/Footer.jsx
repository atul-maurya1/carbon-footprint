// src/components/Footer.jsx
import { Link } from 'react-router-dom'

const footerLinks = [
  { label: 'Privacy',  to: '/privacy'  },
  { label: 'Terms',    to: '/terms'    },
  { label: 'About',    to: '/about'    },
  { label: 'Contact',  to: '/contact'  },
]

function LeafIcon() {
  return (
    <svg
      width="20"
      height="20"
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

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-surface-900 border-t border-eco-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">

          {/* ── Logo + Tagline ── */}
          <div className="flex flex-col items-center sm:items-start gap-1.5">
            <Link to="/" className="flex items-center gap-2 group" aria-label="EcoGuide AI home">
              <LeafIcon />
              <span className="font-display font-bold text-lg text-gray-100 group-hover:text-eco-400 transition-colors">
                EcoGuide <span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-gray-500 text-xs text-center sm:text-left max-w-[200px]">
              AI-powered carbon footprint awareness & reduction.
            </p>
          </div>

          {/* ── Links ── */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2" role="list">
              {footerLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-400 hover:text-eco-400 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Copyright ── */}
          <p className="text-gray-500 text-xs text-center sm:text-right shrink-0">
            &copy; {year} EcoGuide AI.
            <br className="hidden sm:block" />
            <span className="sm:block"> All rights reserved.</span>
          </p>

        </div>
      </div>
    </footer>
  )
}
