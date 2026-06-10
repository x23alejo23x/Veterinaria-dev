import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

/**
 * Section — contenedor colapsable con título y badge opcional.
 * @param {string}    title       — título de la sección
 * @param {string}    [badge]     — texto del badge (ej: conteo de alertas)
 * @param {boolean}   [defaultOpen=true]
 * @param {ReactNode} children
 */
export function Section({ title, badge, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-[var(--surface-2)]"
      >
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-3)]">{title}</p>
          {badge && (
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
              {badge}
            </span>
          )}
        </div>
        <ChevronRight
          size={14}
          className={`text-[var(--text-3)] transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}
