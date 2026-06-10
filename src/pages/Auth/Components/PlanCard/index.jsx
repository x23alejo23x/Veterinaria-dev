import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * PlanCard — tarjeta de plan de suscripción para el panel de precios.
 * @param {Object}  plan        — objeto de PLANS
 * @param {boolean} [compact]   — variante pequeña para el panel lateral
 */
export function PlanCard({ plan, compact = false }) {
  const Icon = plan.icon

  if (compact) {
    return (
      <div className={`relative overflow-hidden rounded-2xl ring-1 ${plan.ring} transition-all ${plan.highlighted ? `bg-gradient-to-br ${plan.gradient} shadow-lg` : 'bg-white/8 hover:bg-white/12'}`}>
        <div className="px-4 py-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${plan.highlighted ? 'bg-white/20' : `bg-gradient-to-br ${plan.gradient}`}`}>
                <Icon size={15} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{plan.name}</p>
                <p className="text-[11px] text-white/60">{plan.description}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              {plan.currency ? (
                <>
                  <p className="text-base font-bold text-white">${plan.price}</p>
                  <p className="text-[10px] text-white/50">{plan.currency}/{plan.period}</p>
                </>
              ) : (
                <p className="text-sm font-bold text-white/80">{plan.price}</p>
              )}
            </div>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {plan.features.slice(0, 3).map((f) => (
              <span key={f} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${plan.highlighted ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'}`}>
                <Check size={9} /> {f}
              </span>
            ))}
          </div>
        </div>
        {plan.highlighted && (
          <div className="absolute right-3 top-3">
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Popular</span>
          </div>
        )}
      </div>
    )
  }

  // Full-size card (para mostrar si se amplía la vista)
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`relative overflow-hidden rounded-2xl p-5 ring-1 ${plan.ring} ${plan.highlighted ? `bg-gradient-to-br ${plan.gradient}` : 'bg-[var(--surface)] border border-[var(--border)]'}`}
    >
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${plan.highlighted ? 'bg-white/20' : `bg-gradient-to-br ${plan.gradient}`} mb-3`}>
        <Icon size={18} className="text-white" />
      </div>
      <h3 className={`text-lg font-bold ${plan.highlighted ? 'text-white' : 'text-[var(--text)]'}`}>{plan.name}</h3>
      <p className={`text-sm ${plan.highlighted ? 'text-white/70' : 'text-[var(--text-3)]'}`}>{plan.description}</p>
      <div className="mt-3 mb-4">
        {plan.currency ? (
          <p className={`text-2xl font-black ${plan.highlighted ? 'text-white' : 'text-[var(--text)]'}`}>
            <span className="text-sm font-semibold mr-0.5">{plan.currency}</span>${plan.price}
            <span className={`text-sm font-normal ml-1 ${plan.highlighted ? 'text-white/60' : 'text-[var(--text-3)]'}`}>/{plan.period}</span>
          </p>
        ) : (
          <p className={`text-xl font-bold ${plan.highlighted ? 'text-white' : 'text-[var(--text)]'}`}>{plan.price}</p>
        )}
      </div>
      <ul className="space-y-1.5">
        {plan.features.map((f) => (
          <li key={f} className={`flex items-center gap-2 text-xs ${plan.highlighted ? 'text-white/85' : 'text-[var(--text-2)]'}`}>
            <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full ${plan.highlighted ? 'bg-white/20' : `bg-gradient-to-br ${plan.gradient}`}`}>
              <Check size={9} className="text-white" />
            </span>
            {f}
          </li>
        ))}
      </ul>
      {plan.highlighted && (
        <div className="absolute right-4 top-4">
          <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Popular</span>
        </div>
      )}
    </motion.div>
  )
}
