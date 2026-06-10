import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

/**
 * Input — focus ring animado + shake en error.
 * API idéntica: { icon, className, error, ...inputProps }
 * Pasa `error={true}` para activar el shake.
 */
export function Input({ icon, className = '', error, onFocus, onBlur, ...props }) {
  const [focused, setFocused] = useState(false)
  const controls  = useAnimation()
  const reduced   = useReducedMotion()

  const handleFocus = (e) => { setFocused(true);  onFocus?.(e) }
  const handleBlur  = (e) => { setFocused(false); onBlur?.(e)  }

  // Shake cuando llega error
  if (error && !reduced) {
    controls.start({
      x: [0, -6, 6, -4, 4, 0],
      transition: { duration: 0.35, ease: 'easeInOut' },
    })
  }

  return (
    <motion.div
      animate={controls}
      className={[
        'relative flex items-center gap-2 rounded-xl px-3 py-2',
        'border bg-[var(--surface-2)]',
        'transition-colors duration-150',
        error
          ? 'border-rose-400 ring-2 ring-rose-400/20'
          : focused
            ? 'border-violet-500 bg-[var(--surface)] ring-2 ring-violet-500/15'
            : 'border-[var(--border)]',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Focus glow */}
      {focused && !reduced && (
        <motion.span
          layoutId="input-focus-glow"
          className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-violet-500/20"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        />
      )}
      {icon && <span className="relative shrink-0 text-[var(--text-3)]">{icon}</span>}
      <input
        className="relative min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-3)]"
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </motion.div>
  )
}
