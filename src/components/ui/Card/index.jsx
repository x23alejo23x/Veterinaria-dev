import { motion } from 'framer-motion'

export function Card({ children, className = '', hover = true }) {
  return (
    <motion.div
      className={`rounded-2xl border border-slate-200/80 bg-white/75 shadow-[0_10px_36px_rgba(20,51,80,0.08)] backdrop-blur-xl ${className}`}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
