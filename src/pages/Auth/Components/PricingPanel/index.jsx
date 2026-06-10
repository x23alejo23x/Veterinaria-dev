import { motion } from 'framer-motion'
import { Check, PawPrint } from 'lucide-react'
import { PLANS } from '@/pages/Auth/constants'

/* ── Ilustración abstracta SVG — isla flotante vet ── */
function VetIllustration() {
  return (
    <svg viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[360px]" aria-hidden="true">
      <defs>
        <radialGradient id="islandGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="coreGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#4f46e5" />
        </radialGradient>
        <radialGradient id="topGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </radialGradient>
      </defs>

      {/* Halo de fondo */}
      <circle cx="210" cy="215" r="160" fill="url(#islandGrad)" />

      {/* Cuerpo principal de la isla */}
      <ellipse cx="210" cy="255" rx="100" ry="30" fill="#4c1d95" opacity="0.2" />
      <ellipse cx="210" cy="248" rx="100" ry="26" fill="#5b21b6" opacity="0.35" />
      <path d="M 110 230 Q 115 265 210 270 Q 305 265 310 230 Q 280 250 210 252 Q 140 250 110 230Z" fill="#6d28d9" opacity="0.6" />
      <path d="M 115 228 Q 130 248 210 250 Q 290 248 305 228 Q 270 244 210 246 Q 150 244 115 228Z" fill="#7c3aed" />

      {/* Superficie superior - césped */}
      <ellipse cx="210" cy="225" rx="98" ry="24" fill="#7c3aed" />
      <ellipse cx="210" cy="221" rx="95" ry="20" fill="url(#topGrad)" />

      {/* Cruz médica central */}
      <rect x="202" y="175" width="16" height="42" rx="4" fill="white" opacity="0.92" />
      <rect x="190" y="187" width="40" height="16" rx="4" fill="white" opacity="0.92" />

      {/* Árbol / arbusto izquierdo */}
      <circle cx="158" cy="204" r="18" fill="#6d28d9" opacity="0.7" />
      <circle cx="160" cy="198" r="16" fill="#8b5cf6" opacity="0.85" />
      <rect x="157" y="214" width="6" height="10" rx="2" fill="#4c1d95" opacity="0.6" />

      {/* Árbol / arbusto derecho */}
      <circle cx="260" cy="208" r="15" fill="#6d28d9" opacity="0.65" />
      <circle cx="262" cy="203" r="13" fill="#8b5cf6" opacity="0.8" />
      <rect x="259" y="216" width="6" height="9" rx="2" fill="#4c1d95" opacity="0.55" />

      {/* Pata pequeña flotando — arriba derecha */}
      <g transform="translate(308, 128) scale(0.65)" opacity="0.5">
        <circle cx="6"  cy="4"  r="5" fill="#7c3aed" />
        <circle cx="19" cy="2"  r="5" fill="#7c3aed" />
        <circle cx="30" cy="8"  r="5" fill="#7c3aed" />
        <ellipse cx="18" cy="22" rx="13" ry="12" fill="#7c3aed" />
      </g>

      {/* Pata pequeña — abajo izquierda */}
      <g transform="translate(82, 300) scale(0.5)" opacity="0.35">
        <circle cx="6"  cy="4"  r="5" fill="#6d28d9" />
        <circle cx="19" cy="2"  r="5" fill="#6d28d9" />
        <circle cx="30" cy="8"  r="5" fill="#6d28d9" />
        <ellipse cx="18" cy="22" rx="13" ry="12" fill="#6d28d9" />
      </g>

      {/* Puntos flotantes decorativos */}
      <circle cx="80"  cy="150" r="5"   fill="#8b5cf6" opacity="0.4" />
      <circle cx="345" cy="185" r="4"   fill="#7c3aed" opacity="0.35" />
      <circle cx="330" cy="310" r="6"   fill="#a78bfa" opacity="0.3" />
      <circle cx="90"  cy="290" r="3.5" fill="#6d28d9" opacity="0.4" />
      <circle cx="180" cy="130" r="3"   fill="#8b5cf6" opacity="0.5" />
      <circle cx="275" cy="145" r="4"   fill="#7c3aed" opacity="0.4" />

      {/* Nubes abstractas */}
      <ellipse cx="75"  cy="215" rx="24" ry="11" fill="white" opacity="0.22" />
      <ellipse cx="60"  cy="210" rx="16" ry="9"  fill="white" opacity="0.18" />
      <ellipse cx="355" cy="245" rx="22" ry="10" fill="white" opacity="0.2" />
      <ellipse cx="340" cy="240" rx="15" ry="8"  fill="white" opacity="0.15" />
    </svg>
  )
}

/**
 * PricingPanel — panel izquierdo con ilustración, branding y planes.
 * Diseño Island-inspired: fondo cohesivo, ilustración como hero, sin border entre paneles.
 */
export function PricingPanel() {
  return (
    <div className="relative flex h-full flex-col items-center justify-between overflow-hidden px-10 py-10"
      style={{ background: 'linear-gradient(145deg, #ede9ff 0%, #e8e2ff 40%, #ddd6fe 100%)' }}>

      {/* Dots grid sutil */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: 'radial-gradient(#7c3aed 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Blob decorativo grande */}
      <motion.div
        className="pointer-events-none absolute left-[-10%] top-[-5%] h-[50%] w-[70%] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-[-8%] right-[-12%] h-[45%] w-[65%] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(99,60,180,0.1) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 flex w-full items-center gap-2.5"
      >
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-600/30">
          <PawPrint size={17} className="text-white" />
        </div>
        <span className="text-[13px] font-black tracking-tight text-violet-900">Nura VetCare</span>
      </motion.div>

      {/* Ilustración hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 25 }}
        className="relative z-10 flex w-full justify-center"
      >
        <motion.div
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <VetIllustration />
        </motion.div>
      </motion.div>

      {/* Planes — compact row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="relative z-10 w-full space-y-2.5"
      >
        <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-violet-500/70">Elige tu plan</p>
        {PLANS.map((plan) => {
          const Icon = plan.icon
          return (
            <div key={plan.id}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 ring-1 transition-all ${
                plan.highlighted
                  ? 'bg-violet-600 ring-violet-500 shadow-lg shadow-violet-600/25'
                  : 'bg-white/50 ring-white/80 backdrop-blur-sm hover:bg-white/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${plan.highlighted ? 'bg-white/20' : `bg-gradient-to-br ${plan.gradient}`}`}>
                  <Icon size={13} className="text-white" />
                </div>
                <div>
                  <p className={`text-xs font-bold ${plan.highlighted ? 'text-white' : 'text-violet-900'}`}>{plan.name}</p>
                  <div className="mt-0.5 flex gap-1">
                    {plan.features.slice(0, 2).map((f) => (
                      <span key={f} className={`inline-flex items-center gap-0.5 text-[9px] font-medium ${plan.highlighted ? 'text-white/70' : 'text-violet-500/70'}`}>
                        <Check size={7} />{f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {plan.currency
                  ? <p className={`text-sm font-black ${plan.highlighted ? 'text-white' : 'text-violet-900'}`}>${plan.price}</p>
                  : <p className={`text-[11px] font-semibold ${plan.highlighted ? 'text-white/80' : 'text-violet-500'}`}>{plan.price}</p>
                }
                {plan.period && <p className={`text-[9px] ${plan.highlighted ? 'text-white/50' : 'text-violet-400'}`}>{plan.currency}/{plan.period}</p>}
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
