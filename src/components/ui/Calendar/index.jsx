import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/** Colores por tipo de cita */
const TYPE_COLORS = {
  General:    '#2563eb',
  Urgencia:   '#e11d48',
  Control:    '#16a34a',
  Vacunación: '#7c3aed',
  Cirugía:    '#d97706',
}

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

/** Retorna el primer día de la semana (0=lun) para el mes */
function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay  = new Date(year, month + 1, 0)

  // Ajustar: JS domingo=0, necesitamos lunes=0
  const startDow = (firstDay.getDay() + 6) % 7
  const totalDays = lastDay.getDate()

  const cells = []

  // Días del mes anterior
  const prevLastDay = new Date(year, month, 0).getDate()
  for (let i = startDow - 1; i >= 0; i--) {
    cells.push({ day: prevLastDay - i, current: false, date: new Date(year, month - 1, prevLastDay - i) })
  }

  // Días del mes actual
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ day: d, current: true, date: new Date(year, month, d) })
  }

  // Días del mes siguiente (completar a múltiplo de 7)
  let next = 1
  while (cells.length % 7 !== 0) {
    cells.push({ day: next++, current: false, date: new Date(year, month + 1, next - 1) })
  }

  return cells
}

function toYMD(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * CalendarUI — Calendario mensual visual y sofisticado.
 *
 * @param {Date}     month          — Mes actualmente visible
 * @param {Function} onMonthChange  — Callback al navegar: (newDate: Date) => void
 * @param {Array}    events         — Lista de eventos: [{date:'YYYY-MM-DD', title, type, color}]
 * @param {Function} onDayClick     — Click en celda: (date: Date, events: Array) => void
 * @param {Date|null} selectedDate  — Día seleccionado (resaltado con ring)
 *
 * @example
 * <CalendarUI
 *   month={new Date()}
 *   onMonthChange={(d) => setMonth(d)}
 *   events={appointments.map(a => ({ date: a.date, title: a.patientName, type: a.type }))}
 *   onDayClick={(date, evs) => setSelected({ date, events: evs })}
 *   selectedDate={selectedDate}
 * />
 */
export function CalendarUI({
  month       = new Date(),
  onMonthChange,
  events      = [],
  onDayClick,
  selectedDate = null,
}) {
  const [direction, setDirection] = useState(0) // -1 ← | +1 →
  const [animKey,   setAnimKey]   = useState(`${month.getFullYear()}-${month.getMonth()}`)

  const year  = month.getFullYear()
  const mon   = month.getMonth()
  const cells = getMonthGrid(year, mon)
  const today = toYMD(new Date())

  // Índice de eventos por fecha
  const eventMap = {}
  events.forEach((ev) => {
    if (!eventMap[ev.date]) eventMap[ev.date] = []
    eventMap[ev.date].push(ev)
  })

  const navigate = (dir) => {
    setDirection(dir)
    const next = new Date(year, mon + dir, 1)
    setAnimKey(`${next.getFullYear()}-${next.getMonth()}`)
    onMonthChange?.(next)
  }

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">

      {/* ── Header con gradiente ── */}
      <div className="flex items-center justify-between bg-gradient-to-r from-violet-600 to-sky-500 px-5 py-4">
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="grid h-8 w-8 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
        >
          <ChevronLeft size={17} />
        </motion.button>

        <motion.div
          key={animKey}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-lg font-bold text-white leading-tight">
            {MONTHS[mon]}
          </p>
          <p className="text-xs font-semibold text-white/70">{year}</p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(+1)}
          className="grid h-8 w-8 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
        >
          <ChevronRight size={17} />
        </motion.button>
      </div>

      {/* ── Nombres de días ── */}
      <div className="grid grid-cols-7 border-b border-[var(--border)] bg-[var(--surface-2)] px-2 py-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)]">
            {d}
          </div>
        ))}
      </div>

      {/* ── Grid de días con animación ── */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={animKey}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="grid h-full grid-cols-7 grid-rows-6 gap-px bg-[var(--border)] p-px"
          >
            {cells.map((cell, idx) => {
              const ymd         = toYMD(cell.date)
              const dayEvents   = eventMap[ymd] ?? []
              const isToday     = ymd === today
              const isSelected  = selectedDate && toYMD(selectedDate) === ymd
              const hasEvents   = dayEvents.length > 0
              const visible     = dayEvents.slice(0, 3)
              const extra       = dayEvents.length - 3

              return (
                <motion.button
                  key={idx}
                  whileHover={cell.current ? { y: -2 } : {}}
                  transition={{ duration: 0.12 }}
                  onClick={() => cell.current && onDayClick?.(cell.date, dayEvents)}
                  className={[
                    'relative flex flex-col items-center justify-start gap-1 bg-[var(--surface)] py-3',
                    'transition-colors duration-150',
                    cell.current
                      ? 'cursor-pointer hover:bg-[var(--surface-2)]'
                      : 'cursor-default opacity-30',
                    isSelected && !isToday
                      ? 'ring-2 ring-inset ring-violet-400 dark:ring-violet-500'
                      : '',
                  ].join(' ')}
                >
                  {/* Número del día */}
                  <span className={[
                    'flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold leading-none transition-all',
                    isToday
                      ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                      : isSelected
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                        : 'text-[var(--text)]',
                  ].join(' ')}>
                    {cell.day}
                  </span>

                  {/* Puntos de eventos */}
                  {hasEvents && (
                    <div className="flex items-center gap-0.5">
                      {visible.map((ev, i) => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: ev.color ?? TYPE_COLORS[ev.type] ?? '#2563eb' }}
                        />
                      ))}
                      {extra > 0 && (
                        <span className="text-[8px] font-bold text-[var(--text-3)]">
                          +{extra}
                        </span>
                      )}
                    </div>
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Leyenda de tipos ── */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--border)] px-4 py-2.5">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: color }} />
            <span className="text-[10px] font-medium text-[var(--text-3)]">{type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
