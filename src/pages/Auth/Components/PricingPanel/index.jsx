import { motion } from 'framer-motion'
import { BadgeCheck, Check, Clock, FileText, PawPrint } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PLANS } from '@/pages/Auth/constants'

const TRUST = [
  { icon: BadgeCheck, label: 'Vets certificados' },
  { icon: Clock,      label: 'Soporte 24/7'     },
  { icon: FileText,   label: 'Historial digital' },
]

/* Ilustración 3D por plan — thiings.co */
const PLAN_IMG = {
  basico:     '/animals/cat.png',
  pro:        '/animals/dog.png',
  enterprise: '/animals/parrot.png',
}

export function PricingPanel() {
  const navigate = useNavigate()
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden px-8 py-10"
      style={{ background: 'linear-gradient(150deg, #ece8ff 0%, #e4deff 45%, #d6cefc 100%)' }}
    >
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(#6d28d9 1.5px, transparent 1.5px)',
          backgroundSize:  '26px 26px',
        }}
      />

      {/* Blobs de fondo */}
      <motion.div
        className="pointer-events-none absolute -left-[12%] -top-[8%] h-[50%] w-[70%] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(109,40,217,0.13) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-[8%] -right-[12%] h-[45%] w-[65%] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(79,46,220,0.09) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.09, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 flex shrink-0 items-center gap-2.5"
      >
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/30">
          <PawPrint size={17} className="text-white" />
        </div>
        <span className="text-[13px] font-black tracking-tight text-violet-950">Nura VetCare</span>
      </motion.div>

      {/* Titular */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 30 }}
        className="relative z-10 mt-6 mb-5 shrink-0"
      >
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600/55">
          Planes &amp; Precios
        </p>
        <h2 className="text-[1.5rem] font-black leading-[1.2] tracking-tight text-violet-950">
          El plan ideal para<br />tu clínica veterinaria
        </h2>
      </motion.div>

      {/* ── Tarjetas ── */}
      <div className="relative z-10 flex flex-1 gap-3 pb-5">
        {PLANS.map((plan, i) => {
          const PlanIcon = plan.icon
          const animalSrc = PLAN_IMG[plan.id]
          const hl = plan.highlighted
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 250, damping: 25 }}
              style={hl ? { flex: '1.3' } : { flex: '1' }}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/registro?plan=${plan.id}`)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/registro?plan=${plan.id}`)}
              className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl p-5 transition-all duration-250 ${
                hl
                  ? 'bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 shadow-2xl shadow-violet-700/40 hover:shadow-violet-700/55 hover:scale-[1.015]'
                  : 'bg-white/80 shadow-lg ring-1 ring-violet-200/60 hover:-translate-y-1.5 hover:bg-white hover:shadow-2xl hover:shadow-violet-300/20'
              }`}
            >
              {/* Badge popular */}
              {hl && (
                <span className="absolute -top-px left-0 right-0 flex justify-center">
                  <span className="inline-flex items-center gap-1 rounded-b-xl bg-amber-400 px-3 py-[3px] text-[8px] font-black uppercase tracking-widest text-amber-900 shadow-md">
                    ★ Más popular
                  </span>
                </span>
              )}

              {/* Glow interior featured */}
              {hl && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: 'radial-gradient(ellipse at 70% 15%, rgba(196,181,253,0.3) 0%, transparent 60%)' }}
                />
              )}

              {/* ── Ilustración 3D flotante ── */}
              <motion.div
                className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 origin-bottom"
                animate={{
                  y:      [0, -14, 0],
                  rotate: [-2, 2, -2],
                  scale:  [1, 1.04, 1],
                }}
                transition={{
                  duration: 6 + i * 1.4,
                  repeat:   Infinity,
                  ease:     'easeInOut',
                  delay:    i * 0.9,
                }}
              >
                <img
                  src={animalSrc}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="select-none"
                  style={{
                    width:   hl ? 175 : 155,
                    opacity: hl ? 0.92 : 0.88,
                    filter:  hl
                      ? 'drop-shadow(0 12px 32px rgba(139,92,246,0.55))'
                      : 'drop-shadow(0 8px 20px rgba(109,40,217,0.30))',
                  }}
                />
              </motion.div>

              {/* Glow suave detrás de la ilustración */}
              <motion.div
                className={`pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full blur-3xl ${
                  hl ? 'bg-white/20' : 'bg-violet-400/18'
                }`}
                animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
              />

              {/* ── Contenido ── */}
              <div className="relative z-10 flex h-full flex-col">
                {/* Header */}
                <div className={`mb-4 flex items-center gap-2.5 ${hl ? 'mt-5' : 'mt-1'}`}>
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${
                      hl
                        ? 'bg-white/20 ring-1 ring-white/25 shadow-inner'
                        : `bg-gradient-to-br ${plan.gradient} shadow-md shadow-violet-500/20`
                    }`}
                  >
                    <PlanIcon size={16} className="text-white" />
                  </div>
                  <div>
                    <p className={`text-[13px] font-black tracking-tight ${hl ? 'text-white' : 'text-violet-950'}`}>
                      {plan.name}
                    </p>
                    {plan.description && (
                      <p className={`text-[9px] font-medium leading-tight ${hl ? 'text-white/55' : 'text-violet-500/70'}`}>
                        {plan.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Precio */}
                <div className={`mb-4 rounded-xl p-3 ${hl ? 'bg-white/12' : 'bg-violet-50/80'}`}>
                  {plan.currency ? (
                    <>
                      <p className={`text-[2rem] font-black leading-none tracking-tight ${hl ? 'text-white' : 'text-violet-900'}`}>
                        ${plan.price}
                      </p>
                      <p className={`mt-1 text-[10px] font-semibold ${hl ? 'text-white/50' : 'text-violet-400'}`}>
                        {plan.currency} / {plan.period}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className={`text-[1.4rem] font-black leading-none tracking-tight ${hl ? 'text-white' : 'text-violet-700'}`}>
                        {plan.price}
                      </p>
                      <p className={`mt-1 text-[9px] font-medium ${hl ? 'text-white/45' : 'text-violet-400/80'}`}>
                        Precio personalizado
                      </p>
                    </>
                  )}
                </div>

                {/* Separador */}
                <div className={`mb-3 h-px ${hl ? 'bg-white/12' : 'bg-violet-200/50'}`} />

                {/* Features */}
                <div className="flex flex-1 flex-col gap-2">
                  {plan.features.slice(0, hl ? 5 : 4).map((f) => (
                    <span
                      key={f}
                      className={`inline-flex items-start gap-2 text-[10px] font-medium leading-tight ${
                        hl ? 'text-white/80' : 'text-violet-700/80'
                      }`}
                    >
                      <span
                        className={`mt-[1px] grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full ${
                          hl ? 'bg-white/20' : `bg-gradient-to-br ${plan.gradient}`
                        }`}
                      >
                        <Check size={8} strokeWidth={3} className="text-white" />
                      </span>
                      {f}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className={`mt-4 rounded-xl py-2.5 text-center text-[11px] font-bold tracking-wide transition-all duration-200 ${
                  hl
                    ? 'bg-white/20 text-white group-hover:bg-white/30'
                    : 'bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 group-hover:from-violet-200 group-hover:to-indigo-200'
                }`}>
                  Elegir plan →
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Trust bar */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.52 }}
        className="relative z-10 shrink-0 flex items-center justify-around gap-2 rounded-2xl bg-white/45 px-4 py-3 ring-1 ring-white/60 backdrop-blur-sm"
      >
        {TRUST.map(({ icon: TIcon, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <TIcon size={13} className="shrink-0 text-violet-600" />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-violet-800/80">{label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
