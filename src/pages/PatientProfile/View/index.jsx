import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Calendar, FileText, MapPin, Phone,
  Pill, Scale, Scissors, Stethoscope, Tag, UserRound,
} from 'lucide-react'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { medicalTimeline } from '../../../constants'
import { useAppStore } from '../../../store/appStore'
import { notify } from '../../../utils/notify'

const statusCfg = {
  Estable:     { cls: 'bg-emerald-500', label: 'Estable' },
  Tratamiento: { cls: 'bg-amber-500',   label: 'Tratamiento' },
  Observacion: { cls: 'bg-blue-500',    label: 'Observación' },
  Preventivo:  { cls: 'bg-sky-500',     label: 'Preventivo' },
  Alta:        { cls: 'bg-rose-500',    label: 'Alta' },
}

const avatarGrad = [
  'from-blue-500 to-blue-700', 'from-violet-500 to-purple-700',
  'from-emerald-500 to-teal-600', 'from-rose-400 to-pink-600',
  'from-amber-400 to-orange-500', 'from-sky-400 to-cyan-600',
]
const getGrad = (name) => avatarGrad[(name.charCodeAt(0) - 65) % avatarGrad.length]

const speciesEmoji = { Canino: '🐕', Felino: '🐱', Ave: '🦜', Reptil: '🦎', Otro: '🐾' }

const tabs = ['Datos', 'Historial', 'Medicación', 'Propietario']

/* ── Info chip ── */
function InfoChip({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-2)] px-3 py-2.5">
      <Icon size={14} className="shrink-0 text-[var(--text-3)]" />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)]">{label}</p>
        <p className="text-xs font-semibold text-[var(--text)]">{value || '—'}</p>
      </div>
    </div>
  )
}

export function PatientProfileView() {
  const { id } = useParams()
  const [tab, setTab] = useState(tabs[0])
  const patients     = useAppStore((s) => s.patients)
  const owners       = useAppStore((s) => s.owners)
  const prescriptions = useAppStore((s) => s.prescriptions)
  const medications  = useAppStore((s) => s.medicationsCatalog)

  const patient = patients.find((p) => p.id === id)
  if (!patient) {
    return (
      <div className="flex h-full items-center justify-center text-[var(--text-3)]">
        Paciente no encontrado
      </div>
    )
  }

  const owner   = owners.find((o) => o.id === patient.ownerId)
  const history = medicalTimeline.filter((h) => h.patient === patient.name)
  const rx      = prescriptions.filter((r) => r.patientId === patient.id)
  const status  = statusCfg[patient.status] ?? statusCfg.Estable

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto">

      {/* ── Banner hero ── */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${getGrad(patient.name)} px-6 py-5`}>
        {/* Decoración */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-6 right-24 h-28 w-28 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute bottom-3 right-6 select-none text-5xl opacity-40" aria-hidden="true">
          {speciesEmoji[patient.species] ?? '🐾'}
        </div>

        <div className="relative flex items-start justify-between gap-4 pr-20">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/20 text-3xl font-black text-white shadow-lg backdrop-blur-sm">
              {patient.name[0]}
            </div>
            {/* Info */}
            <div>
              <h1 className="text-2xl font-bold text-white">{patient.name}</h1>
              <p className="text-sm text-white/80">{patient.species} · {patient.breed} · {patient.age}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full ${status.cls} px-2.5 py-0.5 text-xs font-bold text-white`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-white/70" /> {status.label}
                </span>
                {patient.microchip && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
                    <Tag size={11} /> Microchip
                  </span>
                )}
                {patient.nextVisit && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
                    <Calendar size={11} /> {patient.nextVisit}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex shrink-0 gap-2">
            <Link
              to="/pacientes"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
            >
              <ArrowLeft size={14} /> Volver
            </Link>
            <button
              onClick={() => notify.success('Nota clínica preparada')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-bold text-[var(--text)] shadow-lg transition hover:bg-white/90"
            >
              <FileText size={14} /> Nueva nota
            </button>
          </div>
        </div>
      </div>

      {/* ── Cuerpo: sidebar + contenido ── */}
      <div className="flex flex-1 min-h-0 gap-0">

        {/* Sidebar izquierdo */}
        <div className="w-64 shrink-0 overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)] p-4 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)]">Información clínica</p>

          <div className="grid gap-2">
            <InfoChip icon={Scale}     label="Peso"          value={`${patient.weight} kg`} />
            <InfoChip icon={Scissors}  label="Sexo"          value={patient.sex} />
            <InfoChip icon={Tag}       label="Color"         value={patient.color} />
            <InfoChip icon={Calendar}  label="Última visita" value={patient.lastVisit} />
            <InfoChip icon={Tag}       label="Microchip"     value={patient.microchip || 'No registrado'} />
            <InfoChip icon={Tag}       label="Esterilizado"  value={patient.sterilized ? 'Sí' : 'No'} />
          </div>

          {owner && (
            <>
              <p className="pt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)]">Propietario</p>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-500 text-sm font-bold text-white">
                    {owner.name[0]}
                  </div>
                  <p className="text-sm font-semibold text-[var(--text)]">{owner.name}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-3)]">
                    <Phone size={11} /> {owner.phone}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-3)]">
                    <MapPin size={11} /> {owner.address || '—'}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Contenido tabbed */}
        <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex shrink-0 gap-1 border-b border-[var(--border)] bg-[var(--surface)] px-4 pt-3">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-t-xl px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-[var(--text-3)] hover:text-[var(--text)]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <div className="flex-1 overflow-y-auto bg-[var(--surface)] p-5">

            {/* Datos */}
            {tab === 'Datos' && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: Stethoscope, label: 'Estado clínico', value: patient.status },
                    { icon: Scale,       label: 'Peso actual',    value: `${patient.weight} kg` },
                    { icon: Tag,         label: 'Color / pelaje', value: patient.color || '—' },
                    { icon: Calendar,    label: 'Próxima cita',   value: patient.nextVisit || '—' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        <Icon size={16} />
                      </div>
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
            )}

            {/* Historial */}
            {tab === 'Historial' && (
              <div>
                {history.length ? (
                  <div className="relative space-y-4 pl-5">
                    <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-[var(--border)]" />
                    {history.map((item) => (
                      <div key={item.date} className="relative">
                        <div className="absolute -left-5 top-1.5 h-3 w-3 rounded-full border-2 border-blue-600 bg-[var(--surface)]" />
                        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-sm font-bold text-[var(--text)]">{item.diagnosis}</p>
                            <span className="shrink-0 rounded-full bg-[var(--surface)] border border-[var(--border)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--text-3)]">
                              {item.date}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-3)]">{item.procedure}</p>
                          {item.notes && <p className="mt-2 text-xs italic text-[var(--text-3)]">{item.notes}</p>}
                          <p className="mt-2 text-[10px] font-semibold text-blue-600 dark:text-blue-400">{item.vet}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                    <Stethoscope size={32} className="text-[var(--text-3)]" />
                    <p className="text-sm text-[var(--text-3)]">Sin historial registrado para {patient.name}</p>
                  </div>
                )}
              </div>
            )}

            {/* Medicación */}
            {tab === 'Medicación' && (
              <div>
                {rx.length ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {rx.map((item) => {
                      const med = medications.find((m) => m.id === item.medicationId)
                      return (
                        <div key={item.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                              <Pill size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[var(--text)]">{med?.name ?? '—'}</p>
                              <p className="text-xs text-[var(--text-3)]">{med?.category}</p>
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
                          <p className="mt-2 text-right text-[10px] text-[var(--text-3)]">Desde {item.date}</p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                    <Pill size={32} className="text-[var(--text-3)]" />
                    <p className="text-sm text-[var(--text-3)]">Sin medicación activa</p>
                  </div>
                )}
              </div>
            )}

            {/* Propietario */}
            {tab === 'Propietario' && owner && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-500 text-xl font-bold text-white">
                    {owner.name[0]}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[var(--text)]">{owner.name}</p>
                    <p className="text-sm text-[var(--text-3)]">{owner.email}</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: Phone,  label: 'Teléfono',  value: owner.phone },
                    { icon: MapPin, label: 'Dirección', value: owner.address },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3.5">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                        <Icon size={15} />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)]">{label}</p>
                        <p className="text-sm font-semibold text-[var(--text)]">{value || '—'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
