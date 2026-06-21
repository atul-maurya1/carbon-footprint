// src/components/ui/Badge.jsx

const variantStyles = {
  green:  'bg-eco-500/15  text-eco-400   border border-eco-500/25',
  amber:  'bg-amber-400/15 text-amber-400 border border-amber-400/25',
  red:    'bg-red-500/15  text-red-400   border border-red-500/25',
  blue:   'bg-blue-400/15 text-blue-400  border border-blue-400/25',
  purple: 'bg-purple-400/15 text-purple-400 border border-purple-400/25',
  gray:   'bg-gray-500/15 text-gray-400  border border-gray-500/25',
}

const sizeStyles = {
  xs: 'text-[10px] px-2 py-0.5 font-semibold',
  sm: 'text-xs px-2.5 py-1 font-semibold',
  md: 'text-sm px-3 py-1.5 font-medium',
}

/**
 * @param {{ children: React.ReactNode, variant?: 'green'|'amber'|'red'|'blue'|'purple'|'gray', size?: 'xs'|'sm'|'md' }} props
 */
export default function Badge({
  children,
  variant = 'green',
  size = 'sm',
}) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full leading-none',
        variantStyles[variant] ?? variantStyles.green,
        sizeStyles[size] ?? sizeStyles.sm,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
