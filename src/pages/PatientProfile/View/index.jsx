import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, MapPin, Phone, Pill, Stethoscope, Tag } from 'lucide-react'
import { medicalTimeline } from '@/constants'
import { useAppStore } from '@/store/appStore'
import { TABS } from '@/pages/PatientProfile/constants'
import { ProfileHero } from '@/pages/PatientProfile/Components/ProfileHero'
import { ProfileSidebar } from '@/pages/PatientProfile/Components/ProfileSidebar'

export function PatientProfileView() {
  const { id }       = useParams()
  const [tab, setTab] = useState(TABS[0])

  const patients      = useAppStore((s) => s.patients)
  const owners        = useAppStore((s) => s.owners)
  const prescriptions = useAppStore((s) => s.prescriptions)
  const medications   = useAppStore((s) => s.medicationsCatalog)

  const patient = patients.find((p) => p.id === id)
  if (!patient) return <div className="flex h-full items-center justify-center text-[var(--text-3)]">Paciente no encontrado</div>

  const owner   = owners.find((o) => o.id === patient.ownerId)
  const history = medicalTimeline.filter((h) => h.patient === patient.name)
  const rx      = prescriptions.filter((r) => r.patientId === patient.id)

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto">
      <ProfileHero patient={patient} />

      <div className="flex flex-1 min-h-0 gap-0">
        <ProfileSidebar patient={patient} owner={owner} />

        <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex shrink-0 gap-1 border-b border-[var(--border)] bg-[var(--surface)] px-4 pt-3">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`rounded-t-xl px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'border-b-2 border-violet-600 text-violet-600 dark:text-blue-400' : 'text-[var(--text-3)] hover:text-[var(--text)]'}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Panels */}
          <div className="flex-1 overflow-y-auto bg-[var(--surface)] p-5">
            {tab === 'Datos'      && <DatosTab patient={patient} />}
            {tab === 'Historial'  && <HistorialTab history={history} patient={patient} />}
            {tab === 'Medicación' && <MedicacionTab rx={rx} medications={medications} />}
            {tab === 'Propietario' && owner && <PropietarioTab owner={owner} />}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Tab panels locales ── */

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
            <div><p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)]">{label}</p><p className="text-sm font-semibold text-[var(--text)]">{value}</p></div>
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

function HistorialTab({ history, patient }) {
  if (!history.length) return <div className="flex flex-col items-center justify-center gap-3 py-12 text-center"><Stethoscope size={32} className="text-[var(--text-3)]" /><p className="text-sm text-[var(--text-3)]">Sin historial registrado para {patient.name}</p></div>
  return (
    <div className="relative space-y-4 pl-5">
      <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-[var(--border)]" />
      {history.map((item) => (
        <div key={item.date} className="relative">
          <div className="absolute -left-5 top-1.5 h-3 w-3 rounded-full border-2 border-violet-600 bg-[var(--surface)]" />
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-sm font-bold text-[var(--text)]">{item.diagnosis}</p>
              <span className="shrink-0 rounded-full bg-[var(--surface)] border border-[var(--border)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--text-3)]">{item.date}</span>
            </div>
            <p className="text-xs text-[var(--text-3)]">{item.procedure}</p>
            {item.notes && <p className="mt-2 text-xs italic text-[var(--text-3)]">{item.notes}</p>}
            <p className="mt-2 text-[10px] font-semibold text-violet-600 dark:text-blue-400">{item.vet}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function MedicacionTab({ rx, medications }) {
  if (!rx.length) return <div className="flex flex-col items-center justify-center gap-3 py-12 text-center"><Pill size={32} className="text-[var(--text-3)]" /><p className="text-sm text-[var(--text-3)]">Sin medicación activa</p></div>
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rx.map((item) => { const med = medications.find((m) => m.id === item.medicationId); return (
        <div key={item.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"><Pill size={16} /></div>
            <div><p className="text-sm font-bold text-[var(--text)]">{med?.name ?? '—'}</p><p className="text-xs text-[var(--text-3)]">{med?.category}</p></div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[['Dosis', item.dose], ['Frecuencia', item.frequency], ['Duración', item.duration]].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-[var(--surface)] p-2"><p className="text-[10px] text-[var(--text-3)]">{k}</p><p className="text-xs font-semibold text-[var(--text)]">{v}</p></div>
            ))}
          </div>
          <p className="mt-2 text-right text-[10px] text-[var(--text-3)]">Desde {item.date}</p>
        </div>
      )})}
    </div>
  )
}

function PropietarioTab({ owner }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-500 text-xl font-bold text-white">{owner.name[0]}</div>
        <div><p className="text-lg font-bold text-[var(--text)]">{owner.name}</p><p className="text-sm text-[var(--text-3)]">{owner.email}</p></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[{ icon: Phone, label: 'Teléfono', value: owner.phone }, { icon: MapPin, label: 'Dirección', value: owner.address }].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"><Icon size={15} /></div>
            <div><p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)]">{label}</p><p className="text-sm font-semibold text-[var(--text)]">{value || '—'}</p></div>
          </div>
        ))}
      </div>
    </div>
  )
}
