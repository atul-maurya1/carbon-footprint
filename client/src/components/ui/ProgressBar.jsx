// src/components/ui/ProgressBar.jsx

const colorStyles = {
  eco:    'from-eco-500 to-lime-400',
  amber:  'from-amber-400 to-yellow-300',
  red:    'from-red-500 to-rose-400',
  blue:   'from-blue-500 to-cyan-400',
  purple: 'from-purple-500 to-violet-400',
}

/**
 * @param {{
 *   value: number,
 *   max?: number,
 *   label?: string,
 *   showPercent?: boolean,
 *   color?: 'eco'|'amber'|'red'|'blue'|'purple',
 *   animated?: boolean,
 *   className?: string,
 * }} props
 */
export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = true,
  color = 'eco',
  animated = true,
  className = '',
}) {
  const clamped = Math.min(Math.max(value, 0), max)
  const percent = max > 0 ? Math.round((clamped / max) * 100) : 0
  const gradient = colorStyles[color] ?? colorStyles.eco

  return (
    <div className={`w-full ${className}`}>
      {/* Label row */}
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs font-medium text-gray-400">{label}</span>
          )}
          {showPercent && (
            <span className="text-xs font-semibold text-gray-300 ml-auto">
              {percent}%
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div
        className="h-2 w-full bg-surface-700 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? `Progress: ${percent}%`}
      >
        {/* Fill */}
        <div
          className={[
            'h-full rounded-full bg-gradient-to-r',
            gradient,
            animated ? 'transition-all duration-700 ease-out' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
