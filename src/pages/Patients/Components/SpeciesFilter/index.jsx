import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

const OPTIONS = [
  { value: 'todos',  label: 'Todos',   emoji: '🐾' },
  { value: 'Canino', label: 'Canino',  emoji: '🐕' },
  { value: 'Felino', label: 'Felino',  emoji: '🐱' },
  { value: 'Ave',    label: 'Ave',     emoji: '🦜' },
  { value: 'Reptil', label: 'Reptil',  emoji: '🦎' },
]

/**
 * SpeciesFilter — dropdown de filtro por especie.
 * @param {string}   value    — valor activo ('todos' | especie)
 * @param {Function} onChange — callback: onChange(newValue)
 */
export function SpeciesFilter({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const active = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={(e) => { if (!ref.current?.contains(e.relatedTarget)) setOpen(false) }}
        className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-colors ${
          value !== 'todos'
            ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400'
            : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)] hover:bg-[var(--surface-2)]'
        }`}
      >
        <span className="text-base leading-none">{active.emoji}</span>
        <span>{active.label}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 min-w-[160px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onMouseDown={() => { onChange(opt.value); setOpen(false) }}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--surface-2)] ${
                value === opt.value ? 'text-violet-600 dark:text-blue-400' : 'text-[var(--text-2)]'
              }`}
            >
              <span className="text-base">{opt.emoji}</span>
              {opt.label}
              {value === opt.value && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
