// src/components/ui/StatCard.jsx
import Card from './Card'
import { TrendingUp, TrendingDown } from 'lucide-react'

const colorMap = {
  eco:    { bg: 'bg-eco-500/15',    icon: 'text-eco-400',    ring: 'ring-eco-500/20'    },
  lime:   { bg: 'bg-lime-400/15',   icon: 'text-lime-400',   ring: 'ring-lime-400/20'   },
  amber:  { bg: 'bg-amber-400/15',  icon: 'text-amber-400',  ring: 'ring-amber-400/20'  },
  red:    { bg: 'bg-red-400/15',    icon: 'text-red-400',    ring: 'ring-red-400/20'    },
  blue:   { bg: 'bg-blue-400/15',   icon: 'text-blue-400',   ring: 'ring-blue-400/20'   },
  purple: { bg: 'bg-purple-400/15', icon: 'text-purple-400', ring: 'ring-purple-400/20' },
}

/**
 * @param {{
 *   label: string,
 *   value: string | number,
 *   sub?: string,
 *   icon?: React.ElementType,
 *   trend?: number,
 *   color?: 'eco'|'lime'|'amber'|'red'|'blue'|'purple'
 * }} props
 */
export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  color = 'eco',
}) {
  const palette = colorMap[color] ?? colorMap.eco
  const trendPositive = typeof trend === 'number' && trend > 0
  const trendNegative = typeof trend === 'number' && trend < 0
  const hasTrend = typeof trend === 'number'

  return (
    <Card hover>
      <div className="flex items-start justify-between gap-4">
        {/* Icon */}
        {Icon && (
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${palette.bg} ring-1 ${palette.ring}`}
          >
            <Icon size={20} className={palette.icon} aria-hidden="true" />
          </div>
        )}

        {/* Trend badge */}
        {hasTrend && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
              trendPositive
                ? 'bg-eco-500/15 text-eco-400'
                : trendNegative
                ? 'bg-red-500/15 text-red-400'
                : 'bg-gray-500/15 text-gray-400'
            }`}
          >
            {trendPositive ? (
              <TrendingUp size={11} aria-hidden="true" />
            ) : trendNegative ? (
              <TrendingDown size={11} aria-hidden="true" />
            ) : null}
            {trendPositive ? '+' : ''}
            {trend}%
          </span>
        )}
      </div>

      {/* Value */}
      <p className="font-display text-3xl font-bold text-gray-100 mt-4 leading-none">
        {value}
      </p>

      {/* Label */}
      <p className="text-gray-400 text-sm mt-1.5 font-medium">{label}</p>

      {/* Sub text */}
      {sub && (
        <p className="text-gray-500 text-xs mt-1">{sub}</p>
      )}
    </Card>
  )
}
