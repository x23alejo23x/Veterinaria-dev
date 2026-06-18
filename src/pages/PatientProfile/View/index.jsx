import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, Edit3, MapPin, Phone, Pill, Plus, Stethoscope, Tag, Trash2 } from 'lucide-react'
import { Select } from '@/components/ui/Select'
import { medicalTimeline } from '@/constants'
import { useAppStore } from '@/store/appStore'
import { useConfirm } from '@/hooks/useConfirm.jsx'
import { PRESCRIPTION_STATUS_CFG, TABS } from '@/pages/PatientProfile/constants'
import { ProfileHero } from '@/pages/PatientProfile/Components/ProfileHero'
import { ProfileSidebar } from '@/pages/PatientProfile/Components/ProfileSidebar'
import { NoteModal } from '@/pages/PatientProfile/Components/NoteModal'
import { PrescriptionModal } from '@/pages/PatientProfile/Components/PrescriptionModal'

export function PatientProfileView() {
  const { id }           = useParams()
  const [tab, setTab]       = useState(TABS[0])
  const [rxModal, setRxModal]   = useState(null) // null | { mode: 'create' } | { mode: 'edit', prescription }
  const [noteModal, setNoteModal] = useState(false)
  const { confirm, ConfirmDialog } = useConfirm()

  const patients            = useAppStore((s) => s.patients)
  const owners              = useAppStore((s) => s.owners)
  const prescriptions       = useAppStore((s) => s.prescriptions)
  const medications         = useAppStore((s) => s.medicationsCatalog)
  const clinicalNotes       = useAppStore((s) => s.clinicalNotes)
  const addPrescription     = useAppStore((s) => s.addPrescription)
  const updatePrescription  = useAppStore((s) => s.updatePrescription)
  const deletePrescription  = useAppStore((s) => s.deletePrescription)
  const addClinicalNote     = useAppStore((s) => s.addClinicalNote)

  const patient = patients.find((p) => p.id === id)
  if (!patient) return <div className="flex h-full items-center justify-center text-[var(--text-3)]">Paciente no encontrado</div>

  const owner   = owners.find((o) => o.id === patient.ownerId)
  const history = [
    ...medicalTimeline.filter((h) => h.patient === patient.name),
    ...clinicalNotes.filter((n) => n.patientId === patient.id),
  ]
  const rx      = prescriptions.filter((r) => r.patientId === patient.id)

  const handleSaveRx = (data, mode, rxId) => {
    if (mode === 'edit') updatePrescription(rxId, data)
    else addPrescription(data)
    setRxModal(null)
  }

  const handleDeleteRx = async (item, medName) => {
    const ok = await confirm({
      title: `Eliminar prescripción`,
      message: `¿Eliminar la prescripción de ${medName}? Esta acción no se puede deshacer.`,
      danger: true,
    })
    if (ok) deletePrescription(item.id)
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto">
      <ProfileHero patient={patient} onNewNote={() => setNoteModal(true)} />

      <div className="flex flex-1 min-h-0 gap-0">
        <ProfileSidebar patient={patient} owner={owner} />

        <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex shrink-0 items-end gap-1 border-b border-[var(--border)] bg-[var(--surface)] px-4 pt-3">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`rounded-t-xl px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'border-b-2 border-violet-600 text-violet-600 dark:text-blue-400' : 'text-[var(--text-3)] hover:text-[var(--text)]'}`}>
                {t}
                {t === 'Medicación' && rx.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                    {rx.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Panels */}
          <div className="flex-1 overflow-y-auto bg-[var(--surface)] p-5">
            {tab === 'Datos'       && <DatosTab patient={patient} />}
            {tab === 'Historial'   && <HistorialTab history={history} patient={patient} rx={rx} medications={medications} />}
            {tab === 'Medicación'  && (
              <MedicacionTab
                rx={rx}
                medications={medications}
                onAdd={() => setRxModal({ mode: 'create' })}
                onEdit={(prescription) => setRxModal({ mode: 'edit', prescription })}
                onDelete={handleDeleteRx}
                onStatusChange={(id, status) => updatePrescription(id, { status })}
              />
            )}
            {tab === 'Propietario' && owner && <PropietarioTab owner={owner} />}
          </div>
        </div>
      </div>

      {rxModal && (
        <PrescriptionModal
          prescription={rxModal.mode === 'edit' ? rxModal.prescription : undefined}
          patient={patient}
          medications={medications}
          onClose={() => setRxModal(null)}
          onSave={handleSaveRx}
        />
      )}
      {noteModal && (
        <NoteModal
          patient={patient}
          onClose={() => setNoteModal(false)}
          onSave={(data) => { addClinicalNote(data); setNoteModal(false) }}
        />
      )}
      <ConfirmDialog />
    </div>
  )
}

/* ── Tab panels ── */

function DatosTab({ patient }) {
  const fields = [
    { icon: Stethoscope, label: 'Estado clínico', value: patient.status },
    { icon: Tag,         label: 'Peso actual',    value: `${patient.weight} kg` },
    { icon: Tag,         label: 'Color / pelaje', value: patient.color || '—' },
    { icon: Calendar,    label: 'Próxima cita',   value: patient.nextVisit || '—' },
  ]
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-violet-600 dark:bg-blue-500/10 dark:text-blue-400"><Icon size={16} /></div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)]">{label}</p>
              <p className="text-sm font-semibold text-[var(--text)]">{value}</p>
            </div>
          </div>
        ))}
      </div>
      {patient.microchip && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)]">Microchip</p>
          <p className="font-mono text-sm font-semibold text-[var(--text)]">{patient.microchip}</p>
        </div>
      )}
    </div>
  )
}

function HistorialTab({ history, patient, rx, medications }) {
  /* Combina entradas clínicas + prescripciones en una sola línea de tiempo */
  const timelineItems = [
    ...history.map((h) => ({ ...h, _type: 'clinical' })),
    ...rx.map((r) => {
      const med = medications.find((m) => m.id === r.medicationId)
      return { _type: 'rx', date: r.date, diagnosis: `Prescripción: ${med?.name ?? '—'}`, procedure: `${r.dose} · ${r.frequency} · ${r.duration}`, notes: r.notes, vet: '' }
    }),
  ].sort((a, b) => {
    // Ordenar por fecha descendente (formato 'DD MMM YYYY' o 'DD MMM')
    const parse = (s = '') => new Date(s.split(' ').reverse().join(' '))
    return parse(b.date) - parse(a.date)
  })

  if (!timelineItems.length) return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <Stethoscope size={32} className="text-[var(--text-3)]" />
      <p className="text-sm text-[var(--text-3)]">Sin historial registrado para {patient.name}</p>
    </div>
  )

  return (
    <div className="relative space-y-4 pl-5">
      <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-[var(--border)]" />
      {timelineItems.map((item, i) => (
        <div key={i} className="relative">
          <div className={`absolute -left-5 top-1.5 h-3 w-3 rounded-full border-2 bg-[var(--surface)] ${item._type === 'rx' ? 'border-violet-400' : 'border-violet-600'}`} />
          <div className={`rounded-xl border border-[var(--border)] p-4 ${item._type === 'rx' ? 'bg-violet-50/50 dark:bg-violet-500/5' : 'bg-[var(--surface-2)]'}`}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {item._type === 'rx' && <Pill size={13} className="shrink-0 text-violet-500" />}
                <p className="text-sm font-bold text-[var(--text)]">{item.diagnosis}</p>
              </div>
              <span className="shrink-0 rounded-full bg-[var(--surface)] border border-[var(--border)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--text-3)]">{item.date}</span>
            </div>
            <p className="text-xs text-[var(--text-3)]">{item.procedure}</p>
            {item.notes && <p className="mt-2 text-xs italic text-[var(--text-3)]">{item.notes}</p>}
            {item.vet && <p className="mt-2 text-[10px] font-semibold text-violet-600 dark:text-blue-400">{item.vet}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

const RX_STATUSES = Object.keys(PRESCRIPTION_STATUS_CFG)

function MedicacionTab({ rx, medications, onAdd, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="space-y-4">
      {/* Header con botón */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--text-2)]">
          {rx.length} prescripción{rx.length !== 1 ? 'es' : ''} registrada{rx.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Plus size={13} /> Nueva prescripción
        </button>
      </div>

      {/* Lista */}
      {rx.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <Pill size={32} className="text-[var(--text-3)]" />
          <p className="text-sm text-[var(--text-3)]">Sin prescripciones activas</p>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 rounded-xl border border-violet-300 px-3 py-1.5 text-xs font-semibold text-violet-600 transition hover:bg-violet-50 dark:border-violet-500/30 dark:text-violet-400 dark:hover:bg-violet-500/10"
          >
            <Plus size={13} /> Agregar primera prescripción
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rx.map((item) => {
            const med = medications.find((m) => m.id === item.medicationId)
            return (
              <div key={item.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                    <Pill size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[var(--text)] truncate">{med?.name ?? '—'}</p>
                    <p className="text-xs text-[var(--text-3)]">{med?.category}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${(PRESCRIPTION_STATUS_CFG[item.status] ?? PRESCRIPTION_STATUS_CFG.Activa).dot}`} />
                    <Select
                      compact
                      options={RX_STATUSES}
                      value={item.status}
                      onChange={(e) => onStatusChange(item.id, e.target.value)}
                    />
                    <button
                      title="Editar prescripción"
                      onClick={() => onEdit(item)}
                      className="grid h-7 w-7 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-500/10"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      title="Eliminar prescripción"
                      onClick={() => onDelete(item, med?.name ?? '—')}
                      className="grid h-7 w-7 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[['Dosis', item.dose], ['Frecuencia', item.frequency], ['Duración', item.duration]].map(([k, v]) => (
                    <div key={k} className="rounded-lg bg-[var(--surface)] p-2">
                      <p className="text-[10px] text-[var(--text-3)]">{k}</p>
                      <p className="text-xs font-semibold text-[var(--text)]">{v}</p>
                    </div>
                  ))}
                </div>
                {item.notes && <p className="mt-2 text-xs italic text-[var(--text-3)]">{item.notes}</p>}
                <p className="mt-2 text-right text-[10px] text-[var(--text-3)]">Desde {item.date}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PropietarioTab({ owner }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-500 text-xl font-bold text-white">{owner.name[0]}</div>
        <div>
          <p className="text-lg font-bold text-[var(--text)]">{owner.name}</p>
          <p className="text-sm text-[var(--text-3)]">{owner.email}</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[{ icon: Phone, label: 'Teléfono', value: owner.phone }, { icon: MapPin, label: 'Dirección', value: owner.address }].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"><Icon size={15} /></div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)]">{label}</p>
              <p className="text-sm font-semibold text-[var(--text)]">{value || '—'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
