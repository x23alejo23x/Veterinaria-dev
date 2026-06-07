import { Activity, AlertTriangle, CalendarCheck, HeartPulse, Pill, Plus, Stethoscope, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { StatsCard } from '../../../components/ui/StatsCard'
import { followUps, medicalTimeline } from '../../../constants'
import { useAppStore } from '../../../store/appStore'
import { ActivityChart } from '../Components/ActivityChart'

export function DashboardView() {
  const patients = useAppStore((s) => s.patients)
  const owners = useAppStore((s) => s.owners)
  const prescriptions = useAppStore((s) => s.prescriptions)
  const medications = useAppStore((s) => s.medicationsCatalog)
  const urgent = Object.values(followUps).flat().filter((item) => item.priority === 'Alta')

  const kpis = [
    { label: 'Pacientes activos', value: patients.length, trend: `${owners.length} owners`, tone: 'blue', icon: HeartPulse, subtitle: 'registros reales' },
    { label: 'Propietarios', value: owners.length, trend: 'vinculados', tone: 'green', icon: TrendingUp, subtitle: 'contactos activos' },
    { label: 'Medicamentos', value: medications.length, trend: 'catalogo', tone: 'amber', icon: Pill, subtitle: 'farmacos registrados' },
    { label: 'Prescripciones', value: prescriptions.length, trend: 'activas', tone: 'green', icon: CalendarCheck, subtitle: 'asociadas a pacientes' },
    { label: 'Alertas medicas', value: urgent.length, trend: 'alta', tone: 'rose', icon: AlertTriangle, subtitle: 'seguimiento mock' },
    { label: 'Seguimientos', value: Object.values(followUps).flat().length, trend: 'futuro', tone: 'blue', icon: Activity, subtitle: 'modulo proximo' },
  ]

  return (
    <PageContainer
      eyebrow="Dashboard"
      title="Operacion clinica en tiempo real"
      description="Resumen profesional de pacientes, propietarios, medicamentos y actividad reciente."
      actions={<Button variant="primary"><Plus size={18} /> Nuevo paciente</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {kpis.map((kpi) => <StatsCard key={kpi.label} {...kpi} />)}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <ActivityChart />
        <Card className="p-5" hover={false}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-950">Alertas medicas</h2>
              <p className="mt-1 text-sm text-slate-500">Seguimientos de prioridad alta</p>
            </div>
            <Badge tone="rose">{urgent.length} urgentes</Badge>
          </div>
          <div className="mt-4 grid gap-3">
            {urgent.map((item) => (
              <div key={`${item.patient}-${item.title}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-600"><AlertTriangle size={17} /></div>
                <div>
                  <p className="font-extrabold text-slate-800">{item.title} - {item.patient}</p>
                  <p className="text-xs text-slate-500">Prioridad {item.priority} · {item.due}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card className="p-5" hover={false}>
          <h2 className="text-lg font-extrabold text-slate-950">Pacientes recientes</h2>
          <div className="mt-4 grid gap-3">
            {patients.slice(0, 4).map((patient) => (
              <Link key={patient.id} to={`/pacientes/${patient.id}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-3 transition hover:bg-blue-50">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 font-black text-white">{patient.name[0]}</div>
                <div><p className="font-extrabold text-slate-800">{patient.name}</p><p className="text-xs text-slate-500">{patient.owner}</p></div>
              </Link>
            ))}
          </div>
        </Card>
        <Card className="p-5" hover={false}>
          <h2 className="text-lg font-extrabold text-slate-950">Medicaciones activas</h2>
          <div className="mt-4 grid gap-3">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="rounded-2xl border border-slate-200 bg-white/70 p-3">
                <p className="font-extrabold text-slate-800">{medications.find((m) => m.id === rx.medicationId)?.name}</p>
                <p className="text-xs text-slate-500">{patients.find((p) => p.id === rx.patientId)?.name} · {rx.dose}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5" hover={false}>
          <h2 className="text-lg font-extrabold text-slate-950">Historial reciente</h2>
          <div className="mt-4 grid gap-3">
            {medicalTimeline.map((item) => (
              <div key={`${item.date}-${item.patient}`} className="flex gap-3 rounded-2xl border border-slate-200 bg-white/70 p-3">
                <Stethoscope className="mt-0.5 h-5 w-5 text-blue-600" />
                <div><p className="font-extrabold text-slate-800">{item.diagnosis}</p><p className="text-xs text-slate-500">{item.patient} · {item.date}</p></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
