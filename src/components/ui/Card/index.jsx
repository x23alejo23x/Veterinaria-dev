import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

/**
 * Card — hover 3D tilt reactivo al cursor + sombra dinámica.
 * API idéntica: { children, className, hover, glass }
 * El tilt se activa solo con hover=true.
 */
export function Card({ children, className = '', hover = false, glass = false }) {
  const reduced = useReducedMotion()
  const ref     = useRef(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [ 4, -4]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-4,  4]), { stiffness: 300, damping: 30 })

  const handleMove = (e) => {
    if (!hover || reduced) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set((e.clientX - rect.left) / rect.width  - 0.5)
    rawY.set((e.clientY - rect.top)  / rect.height - 0.5)
  }
  const handleLeave = () => { rawX.set(0); rawY.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={hover && !reduced ? { rotateX, rotateY, transformPerspective: 800 } : {}}
      whileHover={hover && !reduced ? { y: -4, boxShadow: 'var(--shadow-lg)' } : {}}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={[
        'rounded-2xl border border-[var(--border)]',
        glass
          ? 'bg-white/60 dark:bg-white/5 backdrop-blur-xl'
          : 'bg-[var(--surface)]',
        'shadow-[var(--shadow-sm)]',
        hover ? 'cursor-pointer' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Reflejo glass al hover */}
      {hover && !reduced && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      )}
      {children}
    </motion.div>
  )
}
