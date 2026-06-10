import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, ChevronDown, Search, SearchX } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

/**
 * Combobox — Select con búsqueda integrada.
 *
 * @param {Array}    options     — string[] | {value, label}[]
 * @param {string}   value       — valor seleccionado (controlado)
 * @param {Function} onChange    — callback: onChange({ target: { value } })
 * @param {string}   placeholder — texto cuando no hay selección
 * @param {boolean}  required    — campo requerido
 * @param {string}   className   — clases adicionales
 *
 * @example
 * <Select options={['Canino','Felino']} value={v} onChange={(e) => set(e.target.value)} searchable />
 */
export function Combobox({ options = [], value, onChange, placeholder = 'Seleccionar…', required, className = '' }) {
  const reduced   = useReducedMotion()
  const [open,    setOpen]    = useState(false)
  const [query,   setQuery]   = useState('')
  const [cursor,  setCursor]  = useState(-1)
  const triggerRef = useRef(null)
  const inputRef   = useRef(null)
  const listRef    = useRef(null)
  const wrapRef    = useRef(null)

  const dQuery = useDebounce(query, 180)

  const items = useMemo(() =>
    options.map((o) => typeof o === 'string' ? { value: o, label: o } : o),
    [options]
  )

  const filtered = useMemo(() => {
    const q = dQuery.toLowerCase().trim()
    if (!q) return items
    return items.filter((i) => i.label.toLowerCase().includes(q))
  }, [items, dQuery])

  const selected = items.find((i) => i.value === value)

  /* ── Abrir / cerrar ── */
  const openDropdown = () => {
    setOpen(true)
    setQuery('')
    setCursor(-1)
    setTimeout(() => inputRef.current?.focus(), 30)
  }
  const closeDropdown = () => { setOpen(false); setQuery(''); setCursor(-1) }
  const toggle = () => open ? closeDropdown() : openDropdown()

  /* ── Click fuera ── */
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) closeDropdown()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* ── Teclado ── */
  const handleKeyDown = (e) => {
    if (!open) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDropdown() }; return }
    if (e.key === 'Escape') { closeDropdown(); triggerRef.current?.focus(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)) }
    if (e.key === 'Enter' && cursor >= 0) { e.preventDefault(); pick(filtered[cursor]) }
  }

  /* ── Scroll cursor visible ── */
  useEffect(() => {
    if (cursor < 0 || !listRef.current) return
    const el = listRef.current.children[cursor]
    el?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  /* ── Seleccionar ── */
  const pick = (item) => {
    onChange?.({ target: { value: item.value } })
    closeDropdown()
    triggerRef.current?.focus()
  }

  /* ── Highlight ── */
  const highlight = (label) => {
    const q = dQuery.trim()
    if (!q) return label
    const idx = label.toLowerCase().indexOf(q.toLowerCase())
    if (idx === -1) return label
    return (
      <>
        {label.slice(0, idx)}
        <strong className="font-bold text-violet-600 dark:text-violet-400">
          {label.slice(idx, idx + q.length)}
        </strong>
        {label.slice(idx + q.length)}
      </>
    )
  }

  const SPRING = reduced
    ? { duration: 0.1 }
    : { type: 'spring', stiffness: 380, damping: 28 }

  return (
    <div ref={wrapRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        className={[
          'flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2',
          'border text-sm transition-all duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30',
          open
            ? 'border-violet-500 bg-[var(--surface)] ring-2 ring-violet-500/15'
            : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-violet-400/50',
        ].join(' ')}
      >
        <span className={selected ? 'text-[var(--text)]' : 'text-[var(--text-3)]'}>
          {selected?.label ?? placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-[var(--text-3)]"
        >
          <ChevronDown size={15} />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced   ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
            transition={SPRING}
            className={[
              'absolute left-0 right-0 top-full z-50 mt-1.5',
              'overflow-hidden rounded-xl border border-[var(--border)]',
              'bg-[var(--surface)] shadow-[var(--shadow-lg)]',
            ].join(' ')}
          >
            {/* Buscador */}
            <div className="flex items-center gap-2 border-b border-[var(--border)] px-3 py-2">
              <Search size={14} className="shrink-0 text-[var(--text-3)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setCursor(-1) }}
                placeholder="Buscar…"
                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-3)]"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-[var(--text-3)] hover:text-[var(--text)]">
                  <SearchX size={13} />
                </button>
              )}
            </div>

            {/* Opciones */}
            <ul ref={listRef} className="max-h-52 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className="flex flex-col items-center gap-1.5 py-6 text-center">
                  <SearchX size={20} className="text-[var(--text-3)]" />
                  <span className="text-xs text-[var(--text-3)]">
                    Sin resultados para <strong className="text-[var(--text-2)]">"{dQuery}"</strong>
                  </span>
                </li>
              ) : (
                filtered.map((item, i) => {
                  const isActive   = item.value === value
                  const isFocused  = i === cursor
                  return (
                    <li
                      key={item.value}
                      role="option"
                      aria-selected={isActive}
                      onClick={() => pick(item)}
                      onMouseEnter={() => setCursor(i)}
                      className={[
                        'flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm',
                        'transition-colors duration-100',
                        isFocused || isActive
                          ? 'bg-[var(--primary-10)] text-violet-700 dark:text-violet-300'
                          : 'text-[var(--text-2)] hover:bg-[var(--surface-2)]',
                      ].join(' ')}
                    >
                      <span>{highlight(item.label)}</span>
                      {isActive && <Check size={13} className="shrink-0 text-violet-600 dark:text-violet-400" />}
                    </li>
                  )
                })
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
