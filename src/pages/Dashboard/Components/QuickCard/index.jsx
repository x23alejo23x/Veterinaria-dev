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
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl p-4 transition-all duration-200 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] ${gradient}`}
      style={{ minHeight: 110 }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div
        className="pointer-events-none absolute -bottom-1 right-1 select-none leading-none transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1"
        style={{ fontSize: 62, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))', opacity: 0.92 }}
        aria-hidden="true"
      >
        {pet}
      </div>
      <div className="relative flex items-start justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 backdrop-blur-sm">
          <Icon size={18} className="text-white" />
        </div>
        <ArrowUpRight size={15} className="text-white/40 transition-all duration-200 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <div className="relative">
        <motion.p
          className="text-3xl font-bold text-white tabular-nums"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          {value}
        </motion.p>
        <p className="text-sm font-semibold text-white/80">{label}</p>
        {sub && <p className="mt-0.5 text-[11px] text-white/60">{sub}</p>}
      </div>
    </Link>
  )
}
