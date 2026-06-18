import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight, LayoutGrid, List, Plus, X } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { CalendarUI } from '@/components/ui/Calendar'
import { useConfirm } from '@/hooks/useConfirm.jsx'
import { useAppStore } from '@/store/appStore'
import { TYPE_COLORS, WEEK_LABELS, fmtDate, gradient, toYMD } from '@/pages/Appointments/constants'
import { AppCard } from '@/pages/Appointments/Components/AppCard'
import { AppointmentDetail } from '@/pages/Appointments/Components/AppointmentDetail'
import { AppointmentModal } from '@/pages/Appointments/Components/AppointmentModal'

const VIEWS = [
  { key: 'month', label: 'Mes',    icon: CalendarDays },
  { key: 'week',  label: 'Semana', icon: LayoutGrid },
  { key: 'list',  label: 'Lista',  icon: List },
]

export function AppointmentsView() {
  const appointments      = useAppStore((s) => s.appointments)
  const patients          = useAppStore((s) => s.patients)
  const owners            = useAppStore((s) => s.owners)
  const addAppointment    = useAppStore((s) => s.addAppointment)
  const updateAppointment = useAppStore((s) => s.updateAppointment)
  const deleteAppointment = useAppStore((s) => s.deleteAppointment)

  const [view,         setView]         = useState('month')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [currentWeek,  setCurrentWeek]  = useState(() => { const d = new Date(); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return d })
  const [selectedDay,  setSelectedDay]  = useState(null)   // Date | null — día seleccionado en mes
  const [detailApt,    setDetailApt]    = useState(null)   // appointment | null — detalle activo
  const [modal,        setModal]        = useState(null)
  const { confirm, ConfirmDialog }      = useConfirm()

  // Reactivo: se recalcula automáticamente cada vez que appointments cambia
  const dayPanelEvents = useMemo(
    () => selectedDay
      ? appointments.filter((a) => a.date === toYMD(selectedDay)).sort((a, b) => a.time.localeCompare(b.time))
      : [],
    [selectedDay, appointments],
  )

  const calEvents = useMemo(
    () => appointments.map((a) => ({ date: a.date, title: a.patientName, type: a.type, color: TYPE_COLORS[a.type] ?? '#2563eb' })),
    [appointments],
  )

  const weekDays = useMemo(() => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeek); d.setDate(d.getDate() + i)
      const ymd = toYMD(d)
      days.push({ date: d, ymd, apts: appointments.filter((a) => a.date === ymd).sort((a, b) => a.time.localeCompare(b.time)) })
    }
    return days
  }, [currentWeek, appointments])

  const grouped = useMemo(() => {
    const map = {}
    ;[...appointments].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .forEach((a) => { if (!map[a.date]) map[a.date] = []; map[a.date].push(a) })
    return Object.entries(map)
  }, [appointments])

  const handleDelete = async (apt) => {
    const ok = await confirm({ title: 'Eliminar cita', message: `¿Eliminar la cita de ${apt.patientName}?`, danger: true })
    if (ok) { deleteAppointment(apt.id); setDetailApt(null) }
  }
  const openCreate = (date = '') => { setDetailApt(null); setModal({ mode: 'create', data: date ? { date } : {} }) }
  const openEdit   = (apt)       => { setDetailApt(null); setModal({ mode: 'edit', data: apt }) }
  const handleSave = (data, mode, id) => {
    mode === 'edit' && id ? updateAppointment(id, data) : addAppointment(data)
    setModal(null)
  }

  return (
    <PageContainer eyebrow="Agenda" title="Agenda de citas" scrollable={view === 'list'}
      actions={
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-1">
            {VIEWS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setView(key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${view === key ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm' : 'text-[var(--text-3)] hover:text-[var(--text)]'}`}>
                <Icon size={13} />{label}
              </button>
            ))}
          </div>
          <Button variant="primary" onClick={() => openCreate()}><Plus size={14} /> Nueva cita</Button>
        </div>
      }
    >
      <AnimatePresence mode="wait">
        {view === 'month' && (
          <MonthView key="month"
            calEvents={calEvents} dayPanelEvents={dayPanelEvents}
            selectedDay={selectedDay} setSelectedDay={setSelectedDay}
            detailApt={detailApt} setDetailApt={setDetailApt}
            currentMonth={currentMonth} setCurrentMonth={setCurrentMonth}
            onEdit={openEdit} onDelete={handleDelete} openCreate={openCreate}
          />
        )}
        {view === 'week' && (
          <WeekView key="week"
            weekDays={weekDays} currentWeek={currentWeek} setCurrentWeek={setCurrentWeek}
            detailApt={detailApt} setDetailApt={setDetailApt}
            onEdit={openEdit} onDelete={handleDelete}
          />
        )}
        {view === 'list' && (
          <ListView key="list"
            grouped={grouped}
            detailApt={detailApt} setDetailApt={setDetailApt}
            onEdit={openEdit} onDelete={handleDelete}
          />
        )}
      </AnimatePresence>

      {modal && (
        <AppointmentModal
          key={modal.data?.id ?? modal.mode}
          modal={modal} patients={patients} owners={owners}
          onClose={() => setModal(null)} onSave={handleSave}
        />
      )}
      <ConfirmDialog />
    </PageContainer>
  )
}

/* ─────────────────────────────────────────────── */
/* Vista Mes                                        */
/* ─────────────────────────────────────────────── */
function MonthView({ calEvents, dayPanelEvents, selectedDay, setSelectedDay, detailApt, setDetailApt, currentMonth, setCurrentMonth, onEdit, onDelete, openCreate }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="flex flex-1 min-h-0 gap-4 overflow-hidden">

      {/* Calendario */}
      <div className={`flex flex-1 min-w-0 min-h-0 ${selectedDay ? '' : 'mx-auto max-w-5xl w-full'}`}>
        <CalendarUI month={currentMonth} onMonthChange={setCurrentMonth} events={calEvents} selectedDate={selectedDay}
          onDayClick={(date) => { setSelectedDay(date); setDetailApt(null) }}
        />
      </div>

      {/* Panel lateral del día */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div key="panel" initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-80 shrink-0 flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">

            {/* Header del panel */}
            <div className="flex items-center justify-between border-b border-[var(--border)] bg-gradient-to-r from-violet-600 to-sky-500 px-4 py-3 shrink-0">
              <div>
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Citas del día</p>
                <p className="text-sm font-bold text-white capitalize">{fmtDate(toYMD(selectedDay))}</p>
              </div>
              <button onClick={() => { setSelectedDay(null); setDetailApt(null) }}
                className="grid h-7 w-7 place-items-center rounded-lg bg-white/20 text-white hover:bg-white/30 transition">
                <X size={14} />
              </button>
            </div>

            {/* Contenido: lista ↔ detalle */}
            <div className="flex-1 min-h-0 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {detailApt ? (
                  <motion.div key="detail" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }}
                    transition={{ duration: 0.2 }} className="absolute inset-0 overflow-y-auto">
                    <AppointmentDetail
                      apt={detailApt}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onBack={() => setDetailApt(null)}
                    />
                  </motion.div>
                ) : (
                  <motion.div key="list" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.2 }} className="absolute inset-0 overflow-y-auto p-3 space-y-2">
                    {dayPanelEvents.length === 0
                      ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                          <CalendarDays size={28} className="text-[var(--text-3)]" />
                          <p className="text-sm text-[var(--text-3)]">Sin citas este día</p>
                          <p className="text-xs text-[var(--text-3)]">Agrega una con el botón de abajo</p>
                        </div>
                      )
                      : dayPanelEvents.map((apt) => (
                        <AppCard key={apt.id} apt={apt} compact
                          onDetail={() => setDetailApt(apt)}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      ))
                    }
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--border)] p-3 shrink-0">
              <Button variant="primary" className="w-full" onClick={() => openCreate(toYMD(selectedDay))}>
                <Plus size={13} /> Nueva cita para este día
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────── */
/* Vista Semana                                     */
/* ─────────────────────────────────────────────── */
function WeekView({ weekDays, currentWeek, setCurrentWeek, detailApt, setDetailApt, onEdit, onDelete }) {
  const prevWeek = () => setCurrentWeek((w) => { const d = new Date(w); d.setDate(d.getDate() - 7); return d })
  const nextWeek = () => setCurrentWeek((w) => { const d = new Date(w); d.setDate(d.getDate() + 7); return d })

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="flex flex-1 min-h-0 gap-4 overflow-hidden">

      {/* Grid semanal */}
      <div className="flex flex-1 min-w-0 min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] bg-gradient-to-r from-violet-600 to-sky-500 px-4 py-3 shrink-0">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={prevWeek}
            className="grid h-8 w-8 place-items-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition">
            <ChevronLeft size={16} />
          </motion.button>
          <p className="text-sm font-bold text-white">
            {currentWeek.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })} —{' '}
            {new Date(currentWeek.getTime() + 6 * 86400000).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={nextWeek}
            className="grid h-8 w-8 place-items-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition">
            <ChevronRight size={16} />
          </motion.button>
        </div>
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {weekDays.map(({ date, ymd, apts }, idx) => {
            const isToday = toYMD(new Date()) === ymd
            return (
              <div key={ymd} className="flex flex-1 min-w-0 flex-col border-r border-[var(--border)] last:border-0">
                <div className={`border-b border-[var(--border)] px-2 py-2 text-center shrink-0 ${isToday ? 'bg-blue-50 dark:bg-blue-500/10' : 'bg-[var(--surface-2)]'}`}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)]">{WEEK_LABELS[idx]}</p>
                  <p className={`text-sm font-bold ${isToday ? 'text-violet-600 dark:text-blue-400' : 'text-[var(--text)]'}`}>{date.getDate()}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
                  {apts.length === 0
                    ? <div className="h-full min-h-16 rounded-xl border-2 border-dashed border-[var(--border)]" />
                    : apts.map((apt) => (
                      <button key={apt.id} onClick={() => setDetailApt(detailApt?.id === apt.id ? null : apt)}
                        className="w-full rounded-xl px-2 py-1.5 text-left transition hover:opacity-80 ring-offset-[var(--surface)]"
                        style={{
                          background: `${TYPE_COLORS[apt.type] ?? '#2563eb'}18`,
                          color: TYPE_COLORS[apt.type] ?? '#2563eb',
                          outline: detailApt?.id === apt.id ? `2px solid ${TYPE_COLORS[apt.type] ?? '#2563eb'}` : 'none',
                        }}>
                        <p className="text-[10px] font-bold">{apt.time}</p>
                        <p className="truncate text-[10px] font-semibold">{apt.patientName}</p>
                      </button>
                    ))
                  }
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Panel de detalle lateral */}
      <AnimatePresence>
        {detailApt && (
          <motion.div key="week-detail" initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-72 shrink-0 flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] bg-gradient-to-r from-violet-600 to-sky-500 px-4 py-3 shrink-0">
              <p className="text-sm font-bold text-white">Detalle de cita</p>
              <button onClick={() => setDetailApt(null)}
                className="grid h-7 w-7 place-items-center rounded-lg bg-white/20 text-white hover:bg-white/30 transition">
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <AppointmentDetail apt={detailApt} onEdit={onEdit} onDelete={onDelete} onClose={() => setDetailApt(null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────── */
/* Vista Lista                                      */
/* ─────────────────────────────────────────────── */
function ListView({ grouped, detailApt, setDetailApt, onEdit, onDelete }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="flex flex-1 min-h-0 gap-4 overflow-hidden">

      {/* Lista de citas agrupadas */}
      <div className="flex-1 min-w-0 overflow-y-auto space-y-6 pr-1">
        {grouped.length === 0
          ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <CalendarDays size={40} className="text-[var(--text-3)]" />
              <p className="text-sm text-[var(--text-3)]">Sin citas registradas</p>
            </div>
          )
          : grouped.map(([date, apts]) => (
            <div key={date}>
              {/* Separador de fecha */}
              <div className="mb-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--border)]" />
                <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">
                  <span className="text-xs font-semibold capitalize text-[var(--text-2)]">{fmtDate(date)}</span>
                  <span className="rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{apts.length}</span>
                </div>
                <div className="h-px flex-1 bg-[var(--border)]" />
              </div>
              <div className="space-y-2">
                {apts.map((apt) => (
                  <AppCard key={apt.id} apt={apt}
                    active={detailApt?.id === apt.id}
                    onDetail={() => setDetailApt(detailApt?.id === apt.id ? null : apt)}
                    onEdit={() => onEdit(apt)}
                    onDelete={() => onDelete(apt)}
                  />
                ))}
              </div>
            </div>
          ))
        }
      </div>

      {/* Panel de detalle lateral */}
      <AnimatePresence>
        {detailApt && (
          <motion.div key="list-detail" initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-72 shrink-0 flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] bg-gradient-to-r from-violet-600 to-sky-500 px-4 py-3 shrink-0">
              <p className="text-sm font-bold text-white">Detalle de cita</p>
              <button onClick={() => setDetailApt(null)}
                className="grid h-7 w-7 place-items-center rounded-lg bg-white/20 text-white hover:bg-white/30 transition">
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <AppointmentDetail apt={detailApt} onEdit={onEdit} onDelete={onDelete} onClose={() => setDetailApt(null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
