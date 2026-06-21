// src/components/ui/Modal.jsx
import { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

/**
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   title?: string,
 *   children: React.ReactNode,
 *   size?: 'sm'|'md'|'lg'|'xl',
 * }} props
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'Dialog'}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-up"
        style={{ animationDuration: '150ms' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal box */}
      <div
        className={[
          'relative z-10 w-full bg-surface-800 border border-eco-900/40 rounded-2xl shadow-2xl shadow-black/50',
          'animate-fade-up',
          sizeStyles[size] ?? sizeStyles.md,
        ].join(' ')}
        style={{ animationDuration: '200ms' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title !== undefined) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-eco-900/30">
            <h2 className="font-display font-semibold text-lg text-gray-100">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-500 hover:text-gray-100 hover:bg-white/5 transition-all"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* If no title, render close button absolutely */}
        {title === undefined && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-500 hover:text-gray-100 hover:bg-white/5 transition-all z-10"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        )}

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
