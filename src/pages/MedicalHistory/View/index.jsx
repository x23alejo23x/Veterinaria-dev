import { useMemo, useState } from 'react'
import {
  ClipboardList, FileText, Filter, Pill, Plus, Stethoscope, User,
} from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button }        from '@/components/ui/Button'
import { SearchInput }   from '@/components/ui/SearchInput'
import { useAppStore }   from '@/store/appStore'
import { medicalTimeline } from '@/constants'
import { EVENT_CFG, EVENT_TYPES, getPatientGrad, parseDate } from '@/pages/MedicalHistory/constants'
import { GlobalNoteModal } from '@/pages/MedicalHistory/Components/GlobalNoteModal'

export function MedicalHistoryView() {
  const patients      = useAppStore((s) => s.patients)
  const medications   = useAppStore((s) => s.medicationsCatalog)
  const clinicalNotes = useAppStore((s) => s.clinicalNotes)
  const prescriptions = useAppStore((s) => s.prescriptions)
  const addClinicalNote = useAppStore((s) => s.addClinicalNote)

  const [search,        setSearch]        = useState('')
  const [patientFilter, setPatientFilter] = useState('todos')
  const [typeFilter,    setTypeFilter]    = useState('todos')
  const [showModal,     setShowModal]     = useState(false)

  /* ── Consolidar timeline ── */
  const allEvents = useMemo(() => {
    const seedEvents = medicalTimeline.map((e, i) => ({
      id:         `seed-${i}`,
      type:       'historial',
      date:       e.date,
      patient:    e.patient,
      patientId:  patients.find((p) => p.name === e.patient)?.id ?? null,
      diagnosis:  e.diagnosis,
      procedure:  e.procedure,
      vet:        e.vet,
      notes:      e.notes,
    }))

    const noteEvents = clinicalNotes.map((n) => ({
      id:        n.id,
      type:      'nota',
      date:      n.date,
      patient:   n.patient,
      patientId: n.patientId,
      diagnosis: n.diagnosis,
      procedure: n.procedure,
      vet:       n.vet,
      notes:     n.notes,
    }))

    const rxEvents = prescriptions.map((rx) => {
      const med = medications.find((m) => m.id === rx.medicationId)
      const pat = patients.find((p) => p.id === rx.patientId)
      return {
        id:        rx.id,
        type:      'prescripcion',
        date:      rx.date,
        patient:   pat?.name ?? 'Paciente desconocido',
        patientId: rx.patientId,
        diagnosis: `${med?.name ?? 'Medicamento'} — ${rx.dose}`,
        procedure: `${rx.frequency} · ${rx.duration}`,
        vet:       null,
        notes:     rx.status ? `Estado: ${rx.status}` : null,
      }
    })

    return [...seedEvents, ...noteEvents, ...rxEvents].sort(
      (a, b) => parseDate(b.date) - parseDate(a.date),
    )
  }, [clinicalNotes, prescriptions, medications, patients])

  /* ── Filtros ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return allEvents.filter((e) => {
      const matchType    = typeFilter === 'todos' || e.type === typeFilter
      const matchPatient = patientFilter === 'todos' || e.patientId === patientFilter
      const matchSearch  = !q || [e.patient, e.diagnosis, e.procedure, e.vet, e.notes]
        .some((v) => v?.toLowerCase().includes(q))
      return matchType && matchPatient && matchSearch
    })
  }, [allEvents, typeFilter, patientFilter, search])

  /* ── Stats ── */
  const stats = useMemo(() => ({
    total:   allEvents.length,
    notas:   allEvents.filter((e) => e.type === 'nota').length,
    eventos: allEvents.filter((e) => e.type === 'historial').length,
    rx:      allEvents.filter((e) => e.type === 'prescripcion').length,
  }), [allEvents])

  const handleSaveNote = (data) => {
    addClinicalNote(data)
    setShowModal(false)
  }

  const patientOptions = [
    { value: 'todos', label: 'Todos los pacientes' },
    ...patients.map((p) => ({ value: p.id, label: `${p.name} — ${p.species}` })),
  ]

  return (
    <PageContainer
      eyebrow="Registros"
      title="Historial clínico"
      description="Línea de tiempo consolidada de notas, eventos y prescripciones de todos los pacientes."
      actions={
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Nueva nota
        </Button>
      }
    >
      {/* ── Stats ── */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatChip icon={ClipboardList} label="Total registros"  value={stats.total}   gradient="from-violet-500 to-indigo-600" />
        <StatChip icon={FileText}      label="Notas clínicas"   value={stats.notas}   gradient="from-violet-400 to-purple-600" />
        <StatChip icon={Stethoscope}   label="Eventos clínicos" value={stats.eventos} gradient="from-emerald-500 to-teal-600" />
        <StatChip icon={Pill}          label="Prescripciones"   value={stats.rx}      gradient="from-blue-500 to-blue-700" />
      </div>

      {/* ── Filtros ── */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchInput
          placeholder="Buscar paciente, diagnóstico, procedimiento…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* Filtro paciente */}
        <select
          value={patientFilter}
          onChange={(e) => setPatientFilter(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs font-semibold text-[var(--text-2)] outline-none cursor-pointer focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
        >
          {patientOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {/* Filtro tipo — pills */}
        <div className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-1">
          {EVENT_TYPES.map((t) => {
            const cfg = EVENT_CFG[t]
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all capitalize ${
                  typeFilter === t
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm'
                    : 'text-[var(--text-3)] hover:text-[var(--text)]'
                }`}
              >
                {cfg && <cfg.icon size={11} />}
                {t === 'todos' ? 'Todos' : cfg?.label ?? t}
              </button>
            )
          })}
        </div>
        <span className="ml-auto text-xs text-[var(--text-3)]">{filtered.length} registro{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* ── Timeline ── */}
      <div className="flex flex-1 min-h-0 flex-col overflow-y-auto">
        {filtered.length === 0 ? (
          <EmptyState hasFilters={search || typeFilter !== 'todos' || patientFilter !== 'todos'} onNew={() => setShowModal(true)} />
        ) : (
          <div className="relative space-y-0 pl-6 before:absolute before:left-2.5 before:top-0 before:h-full before:w-px before:bg-[var(--border)]">
            {filtered.map((event) => (
              <TimelineEvent key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <GlobalNoteModal
          patients={patients}
          defaultPatientId={patientFilter !== 'todos' ? patientFilter : ''}
          onClose={() => setShowModal(false)}
          onSave={handleSaveNote}
        />
      )}
    </PageContainer>
  )
}

/* ── Subcomponentes locales ── */

function StatChip({ icon: Icon, label, value, gradient }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-4`}>
      <div className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/10" />
      <div className="mb-2 grid h-8 w-8 place-items-center rounded-xl bg-white/20">
        <Icon size={15} className="text-white" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-[11px] font-semibold text-white/75">{label}</p>
    </div>
  )
}

function TimelineEvent({ event }) {
  const cfg    = EVENT_CFG[event.type] ?? EVENT_CFG.historial
  const TypeIcon = cfg.icon

  return (
    <div className="relative mb-4 pl-4">
      {/* Dot */}
      <span className={`absolute -left-[9px] top-3 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-[var(--surface)] ${cfg.dot}`}>
        <TypeIcon size={8} className={cfg.color} />
      </span>

      {/* Card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-shadow hover:shadow-sm">
        {/* Header */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {/* Avatar */}
            <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${getPatientGrad(event.patient)} text-xs font-bold text-white`}>
              {event.patient?.[0] ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--text)]">{event.patient}</p>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.color}`}>
                <TypeIcon size={9} />
                {cfg.label}
              </span>
            </div>
          </div>
          <span className="shrink-0 text-[11px] text-[var(--text-3)] font-medium">{event.date}</span>
        </div>

        {/* Contenido */}
        <div className="space-y-1">
          {event.diagnosis && (
            <p className="text-sm font-semibold text-[var(--text)]">{event.diagnosis}</p>
          )}
          {event.procedure && (
            <p className="text-xs text-[var(--text-2)]">{event.procedure}</p>
          )}
          {event.vet && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <User size={11} className="shrink-0 text-[var(--text-3)]" />
              <p className="text-xs text-[var(--text-3)]">{event.vet}</p>
            </div>
          )}
          {event.notes && (
            <p className={`text-xs italic text-[var(--text-3)] pt-1.5 border-t border-[var(--border)] mt-1.5`}>
              {event.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ hasFilters, onNew }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-500/10 dark:to-indigo-500/10">
        <ClipboardList size={28} className="text-violet-500" />
      </div>
      <div>
        <p className="font-semibold text-[var(--text)]">
          {hasFilters ? 'Sin resultados' : 'Sin registros en el historial'}
        </p>
        <p className="mt-1 text-sm text-[var(--text-3)]">
          {hasFilters
            ? 'Prueba con otros filtros o busca por nombre de paciente'
            : 'Agrega la primera nota clínica para comenzar el historial'}
        </p>
      </div>
      {!hasFilters && (
        <Button variant="primary" onClick={onNew}>
          <Plus size={14} /> Nueva nota
        </Button>
      )}
    </div>
  )
}
