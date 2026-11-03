import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * QuickCard — tarjeta colorida con gradiente, animación y emoji decorativo.
 * @param {Component} icon     — icono lucide-react
 * @param {string}    label    — nombre de la métrica
 * @param {number}    value    — valor principal
 * @param {string}    sub      — subtítulo
 * @param {string}    gradient — clases Tailwind del gradiente
 * @param {string}    to       — ruta de destino
 * @param {string}    pet      — emoji decorativo
 */
export function QuickCard({ icon: Icon, label, value, sub, gradient, to, pet }) {
  return (
    <Link
      to={to}
      className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] ${gradient}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="pointer-events-none absolute -right-2 -bottom-2 select-none leading-none transition-transform duration-300 group-hover:scale-110"
        style={{ fontSize: 44, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))', opacity: 0.85 }}
        aria-hidden="true"
      >
        {pet}
      </div>
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/20 backdrop-blur-sm">
        <Icon size={16} className="text-white" />
      </div>
      <div className="relative flex-1 min-w-0">
        <motion.p
          className="text-2xl font-bold text-white tabular-nums leading-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          {value}
        </motion.p>
        <p className="text-xs font-semibold text-white/80 mt-0.5">{label}</p>
      </div>
      <ArrowUpRight size={14} className="shrink-0 text-white/30 transition-all duration-200 group-hover:text-white" />
    </Link>
  )
}
