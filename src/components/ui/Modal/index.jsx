import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

/*
 * Tamaños — se incluyen con el prefijo `sm:` completo para que Tailwind v4
 * los detecte estáticamente (las clases dinámicas `sm:${x}` no se escanean).
 * Mobile: full width (bottom sheet). Desktop ≥640px: ancho fijo.
 */
const SIZE_MAP = {
  sm:   'sm:max-w-sm',     //  384px — confirmaciones, alertas
  md:   'sm:max-w-md',     //  448px — formularios simples (owner, medication)
  lg:   'sm:max-w-xl',     //  576px — formularios complejos (patient, appointment)
  xl:   'sm:max-w-2xl',    //  672px — contenido rich (calculadora, vista previa)
  full: 'sm:max-w-[92vw]',
}

/* ── Animaciones ── */
// Entrada: spring con rebote sutil
const SPRING_IN  = { type: 'spring', stiffness: 380, damping: 30, mass: 0.75 }
// Salida: más rápida (~65% del tiempo de entrada) — se siente responsiva
const EASE_OUT   = { duration: 0.16, ease: [0.4, 0, 1, 1] }
// Backdrop: ease suave
const BACKDROP   = [0.22, 1, 0.36, 1]

/**
 * Modal — dialog accesible con backdrop blur, spring animation y footer fijo.
 *
 * @param {boolean}     isOpen
 * @param {Function}    onClose
 * @param {string}      title
 * @param {string}      [description]
 * @param {ReactNode}   [icon]        — icono con gradiente en el header
 * @param {ReactNode}   [footer]      — botones de acción (fuera del scroll)
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [size='md']
 * @param {string}      [maxWidth]    — clase Tailwind legacy (backward-compat)
 * @param {ReactNode}   children
 */
export function Modal({
  isOpen, onClose, title,
  description,
  icon,
  footer,
  size = 'md',
  maxWidth,
  children,
}) {
  const reduced    = useReducedMotion()
  const widthClass = maxWidth ?? SIZE_MAP[size] ?? SIZE_MAP.md
  const hasIcon    = !!icon

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">

          {/* ── Backdrop ── */}
          <motion.div
            className="absolute inset-0 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.22, ease: BACKDROP }}
            onClick={onClose}
            aria-hidden="true"
          >
            {/* Capa blur */}
            <div className="absolute inset-0 backdrop-blur-[6px]" />
            {/* Scrim base 45% */}
            <div className="absolute inset-0 bg-black/45" />
            {/* Vignette radial — focaliza el modal */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_40%,rgba(0,0,0,0.28)_100%)]" />
          </motion.div>

          {/* ── Dialog ── */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={[
              'relative z-10 flex w-full flex-col',
              'rounded-t-2xl sm:rounded-2xl',
              'max-h-[90svh] sm:max-h-[88svh]',
              widthClass,   // ya incluye prefijo sm: desde SIZE_MAP
              'border border-[var(--border)]',
              'bg-[var(--surface)]',
              'shadow-[0_24px_64px_-8px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.03)]',
              'overflow-hidden',
            ].join(' ')}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.87, y: 28 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduced    ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
            transition={reduced ? { duration: 0.15 } : isOpen ? SPRING_IN : EASE_OUT}
          >
            {/* Brillo superior */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/35 to-transparent" />

            {/* ── Header ── */}
            <div className={[
              'flex shrink-0 items-start justify-between gap-4 px-5 py-4',
              'border-b border-[var(--border)]',
              hasIcon
                ? 'bg-gradient-to-br from-violet-50 via-indigo-50/50 to-transparent dark:from-violet-950/20 dark:via-indigo-950/10 dark:to-transparent'
                : '',
            ].join(' ')}>
              <div className="flex items-start gap-3">
                {hasIcon && (
                  <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-[0_4px_10px_rgba(124,58,237,0.3)]">
                    {icon}
                  </div>
                )}
                <div>
                  <h2 id="modal-title" className="text-[15px] font-semibold leading-snug text-[var(--text)]">{title}</h2>
                  {description && (
                    <p className="mt-0.5 text-xs text-[var(--text-3)]">{description}</p>
                  )}
                </div>
              </div>

              <motion.button
                onClick={onClose}
                whileHover={reduced ? {} : { scale: 1.1, rotate: 90 }}
                whileTap={reduced   ? {} : { scale: 0.9 }}
                transition={{ duration: 0.13 }}
                className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                aria-label="Cerrar"
              >
                <X size={15} />
              </motion.button>
            </div>

            {/* ── Body scrollable ── */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {children}
            </div>

            {/* ── Footer fijo ── */}
            {footer && (
              <div className="shrink-0 border-t border-[var(--border)] bg-[var(--surface-2)/50] px-5 py-3.5">
                <div className="flex items-center justify-end gap-2">
                  {footer}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
