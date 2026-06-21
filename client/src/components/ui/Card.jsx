// src/components/ui/Card.jsx

/**
 * @param {{ children: React.ReactNode, className?: string, hover?: boolean, glow?: boolean } & React.HTMLAttributes<HTMLDivElement>} props
 */
export default function Card({
  children,
  className = '',
  hover = false,
  glow = false,
  ...props
}) {
  return (
    <div
      className={[
        'bg-surface-800 border border-eco-900/40 rounded-2xl p-6',
        hover &&
          'hover:border-eco-500/30 hover:shadow-lg hover:shadow-eco-500/5 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
        glow && 'animate-glow-pulse',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
