// src/components/ui/Input.jsx
import { useId } from 'react'

/**
 * @param {{
 *   label?: string,
 *   error?: string,
 *   hint?: string,
 *   icon?: React.ElementType,
 * } & React.InputHTMLAttributes<HTMLInputElement>} props
 */
export default function Input({
  label,
  error,
  hint,
  icon: Icon,
  className = '',
  id: externalId,
  ...props
}) {
  const generatedId = useId()
  const id = externalId ?? generatedId
  const hasError = Boolean(error)

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-300"
        >
          {label}
          {props.required && (
            <span className="ml-1 text-eco-400" aria-hidden="true">*</span>
          )}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Left icon */}
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Icon
              size={16}
              className={hasError ? 'text-red-400/70' : 'text-gray-500'}
              aria-hidden="true"
            />
          </div>
        )}

        <input
          id={id}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className={[
            'w-full bg-surface-700 text-gray-100 placeholder-gray-500 rounded-xl border text-sm py-2.5 transition-all duration-200 outline-none',
            Icon ? 'pl-9 pr-4' : 'px-4',
            hasError
              ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-eco-900/40 focus:border-eco-500 focus:ring-2 focus:ring-eco-500/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
      </div>

      {/* Hint */}
      {hint && !hasError && (
        <p id={`${id}-hint`} className="text-xs text-gray-500">
          {hint}
        </p>
      )}

      {/* Error */}
      {hasError && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-red-400 flex items-center gap-1"
        >
          <span aria-hidden="true">✕</span>
          {error}
        </p>
      )}
    </div>
  )
}
