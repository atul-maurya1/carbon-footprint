// src/components/ui/Button.jsx
import { Loader2 } from 'lucide-react'

const variantStyles = {
  primary:
    'bg-eco-500 hover:bg-eco-400 text-surface-950 font-semibold border border-transparent shadow-sm hover:shadow-eco-400/25 hover:shadow-md',
  outline:
    'border border-eco-500/40 text-eco-400 hover:bg-eco-500/10 hover:border-eco-500/60 font-semibold',
  ghost:
    'border border-transparent text-gray-400 hover:text-gray-100 hover:bg-white/5 font-medium',
  danger:
    'bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 hover:border-red-500/50 font-semibold',
}

const sizeStyles = {
  sm: 'px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
}

const iconSizes = {
  sm: 14,
  md: 16,
  lg: 18,
}

/**
 * @param {{ children: React.ReactNode, variant?: 'primary'|'outline'|'ghost'|'danger', size?: 'sm'|'md'|'lg', icon?: React.ElementType, loading?: boolean, className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) {
  const isDisabled = disabled || loading

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eco-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 active:scale-[0.97]',
        variantStyles[variant] ?? variantStyles.primary,
        sizeStyles[size] ?? sizeStyles.md,
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading ? (
        <Loader2
          size={iconSizes[size]}
          className="animate-spin shrink-0"
          aria-hidden="true"
        />
      ) : Icon ? (
        <Icon
          size={iconSizes[size]}
          className="shrink-0"
          aria-hidden="true"
        />
      ) : null}
      {children}
    </button>
  )
}
