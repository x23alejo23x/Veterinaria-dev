import { motion, useReducedMotion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const styles = {
  primary: [
    'bg-gradient-to-r from-violet-600 to-indigo-600 text-white',
    'shadow-[0_4px_14px_rgba(124,58,237,0.4)]',
  ].join(' '),
  default: [
    'bg-[var(--surface)] text-[var(--text)]',
    'border border-[var(--border)] shadow-[var(--shadow-sm)]',
  ].join(' '),
  ghost: 'bg-transparent text-[var(--text-2)]',
  danger: [
    'bg-gradient-to-r from-rose-500 to-pink-600 text-white',
    'shadow-[0_4px_14px_rgba(225,29,72,0.3)]',
  ].join(' '),
}

const hoverStyles = {
  primary: { background: 'linear-gradient(to right,#7c3aed,#4f46e5)', boxShadow: '0 6px 20px rgba(124,58,237,0.55)' },
  default: {},
  ghost:   {},
  danger:  { background: 'linear-gradient(to right,#fb7185,#ec4899)' },
}

/**
 * Button — micro-animaciones con framer-motion.
 * API idéntica a la versión anterior + prop `loading`.
 */
export function Button({ children, variant = 'default', className = '', type = 'button', onClick, disabled, loading = false, ...props }) {
  const reduced = useReducedMotion()

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={reduced ? {} : hoverStyles[variant]}
      whileTap={reduced  ? {} : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={[
        'relative inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 overflow-hidden',
        'text-sm font-semibold',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        styles[variant] ?? styles.default,
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {/* Shimmer en primary */}
      {variant === 'primary' && !reduced && (
        <motion.span
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ translateX: ['−100%', '200%'] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 3, ease: 'linear' }}
        />
      )}
      {loading && <Loader2 size={14} className="animate-spin shrink-0" />}
      {children}
    </motion.button>
  )
}
