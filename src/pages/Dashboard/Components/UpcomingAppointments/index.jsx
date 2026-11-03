import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAY_LABELS = ['Lu','Ma','Mi','Ju','Vi','Sá','Do']

const STATUS_STYLE = {
  Confirmada: 'bg-emerald-500/15 text-emerald-400',
  Pendiente:  'bg-amber-500/15  text-amber-400',
  Completada: 'bg-sky-500/15    text-sky-400',
  Cancelada:  'bg-rose-500/15   text-rose-400',
}

const TYPE_COLOR = {
  Control:    'bg-indigo-500/20 text-indigo-400',
  General:    'bg-slate-400/20  text-[var(--text-3)]',
  Urgencia:   'bg-rose-500/20   text-rose-400',
  Vacunación: 'bg-emerald-500/20 text-emerald-400',
  Cirugía:    'bg-violet-500/20 text-violet-400',
}

function isoDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

/**
 * UpcomingAppointments — calendario numérico mensual + lista de recordatorios del día seleccionado.
 * @param {Array}  appointments — array de citas (appointmentsSeed)
 */
export function UpcomingAppointments({ appointments = [] }) {
  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState(isoDate(today.getFullYear(), today.getMonth(), today.getDate()))

  const active = appointments.filter(a => a.status !== 'Cancelada' && a.status !== 'Completada')

  // días del mes actual con citas
  const daysWithAppts = new Set(
    active.filter(a => {
      const [ay, am] = a.date.split('-').map(Number)
      return ay === year && am === month + 1
    }).map(a => Number(a.date.split('-')[2]))
  )

  // citas del día seleccionado
  const dayAppts = [...appointments]
    .filter(a => a.date === selected)
    .sort((a, b) => a.time.localeCompare(b.time))

  // construcción de la grilla
  const firstDay = new Date(year, month, 1).getDay() // 0=Dom
  const startOffset = firstDay === 0 ? 6 : firstDay - 1 // lunes = 0
  const daysInMonth  = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const todayStr = isoDate(today.getFullYear(), today.getMonth(), today.getDate())

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  return (
    <div className="flex h-full flex-col gap-3">
      {/* ── Calendario numérico ── */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        {/* Header mes */}
        <div className="mb-3 flex items-center justify-between">
          <button onClick={prevMonth} className="rounded-lg p-1 transition hover:bg-[var(--surface-2)]">
            <ChevronLeft size={14} className="text-[var(--text-3)]" />
          </button>
          <p className="text-xs font-bold text-[var(--text)]">
            {MONTHS[month]} {year}
          </p>
          <button onClick={nextMonth} className="rounded-lg p-1 transition hover:bg-[var(--surface-2)]">
            <ChevronRight size={14} className="text-[var(--text-3)]" />
          </button>
        </div>

        {/* Etiquetas días */}
        <div className="mb-1 grid grid-cols-7 gap-0.5">
          {DAY_LABELS.map(d => (
            <div key={d} className="text-center text-[9px] font-bold uppercase tracking-wider text-[var(--text-3)]">
              {d}
            </div>
          ))}
        </div>

        {/* Grilla días */}
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} />
            const iso     = isoDate(year, month, day)
            const isToday = iso === todayStr
            const isSel   = iso === selected
            const hasAppt = daysWithAppts.has(day)
            return (
              <button
                key={day}
                onClick={() => setSelected(iso)}
                className={[
                  'relative flex h-7 w-full flex-col items-center justify-center rounded-lg text-[11px] font-semibold transition-all duration-150',
                  isSel
                    ? 'bg-violet-600 text-white shadow-[0_2px_8px_rgba(124,58,237,0.45)]'
                    : isToday
                    ? 'bg-violet-500/15 text-violet-400'
                    : 'text-[var(--text)] hover:bg-[var(--surface-2)]',
                ].join(' ')}
              >
                {day}
                {hasAppt && !isSel && (
                  <span className={`absolute bottom-0.5 h-1 w-1 rounded-full ${isToday ? 'bg-violet-400' : 'bg-violet-500'}`} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Recordatorios del día ── */}
      <div className="flex-1 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)]">
            Citas · {selected === todayStr ? 'Hoy' : selected}
          </p>
          {dayAppts.length > 0 && (
            <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-400">
              {dayAppts.length}
            </span>
          )}
        </div>

        <div className="px-3 py-2">
          {dayAppts.length === 0 ? (
            <p className="py-4 text-center text-xs text-[var(--text-3)]">Sin citas este día</p>
          ) : (
            <div className="space-y-1">
              {dayAppts.map(apt => (
                <div key={apt.id} className="flex items-center gap-2.5 rounded-xl px-2 py-2 transition hover:bg-[var(--surface-2)]">
                  <div className="flex items-center gap-1 rounded-lg bg-[var(--surface-2)] px-2 py-1 text-[10px] font-bold text-[var(--text)] tabular-nums">
                    <Clock size={9} className="text-[var(--text-3)]" />
                    {apt.time}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[var(--text)]">{apt.patientName}</p>
                    <p className="truncate text-[10px] text-[var(--text-3)]">{apt.ownerName}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${TYPE_COLOR[apt.type] ?? TYPE_COLOR.General}`}>
                      {apt.type}
                    </span>
                    <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${STATUS_STYLE[apt.status]}`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
