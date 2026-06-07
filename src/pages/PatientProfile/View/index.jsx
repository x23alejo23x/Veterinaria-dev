import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FileText, Syringe, UserRound } from 'lucide-react'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { medicalTimeline } from '../../../constants'
import { useAppStore } from '../../../store/appStore'
import { notify } from '../../../utils/notify'

const tabs = ['Datos generales', 'Propietario', 'Historial', 'Medicacion', 'Archivos']

export function PatientProfileView() {
  const { id } = useParams()
  const [tab, setTab] = useState(tabs[0])
  const patients = useAppStore((s) => s.patients)
  const owners = useAppStore((s) => s.owners)
  const prescriptions = useAppStore((s) => s.prescriptions)
  const medications = useAppStore((s) => s.medicationsCatalog)
  const patient = patients.find((item) => item.id === id)
  if (!patient) return <PageContainer eyebrow="Perfil CRM" title="Paciente no encontrado" description="La URL no coincide con un registro." />
  const owner = owners.find((item) => item.id === patient.ownerId)
  const history = medicalTimeline.filter((item) => item.patient === patient.name)
  const rx = prescriptions.filter((item) => item.patientId === patient.id)

  return (
    <PageContainer eyebrow="Perfil CRM" title={`${patient.name}, ${patient.breed}`} description="Ficha premium con datos vinculados por paciente." actions={<><Link className="inline-flex min-h-10 items-center rounded-xl bg-white px-4 text-sm font-semibold text-slate-700 ring-1 ring-slate-200" to="/pacientes">Volver</Link><Button variant="primary" onClick={() => notify.success('Nota clinica preparada')}><FileText size={18} /> Nueva nota</Button></>}>
      <Card className="p-5" hover={false}>
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-blue-600 to-emerald-500 text-3xl font-black text-white">{patient.name[0]}</div>
          <div><h2 className="text-xl font-black text-slate-950">{patient.name}</h2><p className="text-sm text-slate-500">{patient.species} · {patient.age} · {patient.weight} kg</p><div className="mt-3 flex flex-wrap gap-2"><Badge tone="green">{patient.status}</Badge><Badge>{patient.microchip ? 'Microchip activo' : 'Sin microchip'}</Badge><Badge tone="amber">{patient.nextVisit}</Badge></div></div>
        </div>
      </Card>
      <div className="mt-5 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/60 p-1.5">
        {tabs.map((item) => <button key={item} className={`rounded-xl px-3 py-2 text-sm font-bold ${tab === item ? 'bg-white text-blue-700 shadow' : 'text-slate-500'}`} onClick={() => setTab(item)}>{item}</button>)}
      </div>
      <div className="mt-5">
        {tab === 'Datos generales' && <div className="grid gap-5 lg:grid-cols-3"><Card className="p-5"><h2 className="font-extrabold text-slate-950">Identificacion</h2><p className="mt-2 text-sm text-slate-500">{patient.sex} · {patient.sterilized ? 'Esterilizado/a' : 'Sin esterilizar'}</p></Card><Card className="p-5"><h2 className="font-extrabold text-slate-950">Medidas</h2><p className="mt-2 text-sm text-slate-500">{patient.weight} kg · {patient.color}</p></Card><Card className="p-5"><h2 className="font-extrabold text-slate-950">Ultima visita</h2><p className="mt-2 text-sm text-slate-500">{patient.lastVisit}</p></Card></div>}
        {tab === 'Propietario' && <Card className="p-5"><div className="flex gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600"><UserRound size={18} /></div><div><h2 className="font-extrabold text-slate-950">{owner?.name ?? patient.owner}</h2><p className="text-sm text-slate-500">{owner?.phone} · {owner?.email}</p><p className="text-sm text-slate-500">{owner?.address}</p></div></div></Card>}
        {tab === 'Historial' && <Card className="p-5"><h2 className="font-extrabold text-slate-950">Historial reciente</h2>{history.map((item) => <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-[92px_1fr]" key={item.date}><span className="text-sm font-bold text-slate-500">{item.date}</span><div><strong>{item.diagnosis}</strong><p className="text-sm text-slate-500">{item.procedure}</p></div></div>)}</Card>}
        {tab === 'Medicacion' && <Card className="p-5"><h2 className="font-extrabold text-slate-950">Medicacion activa</h2>{rx.map((item) => <div className="mt-4 flex gap-3" key={item.id}><div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Syringe size={18} /></div><div><p className="font-extrabold text-slate-800">{medications.find((med) => med.id === item.medicationId)?.name}</p><p className="text-sm text-slate-500">{item.dose} {item.frequency} por {item.duration}</p></div></div>)}</Card>}
        {tab === 'Archivos' && <Card className="p-5"><h2 className="font-extrabold text-slate-950">Archivos</h2><p className="mt-2 text-sm text-slate-500">Preparado para adjuntos clinicos.</p></Card>}
      </div>
    </PageContainer>
  )
}
