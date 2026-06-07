import { useMemo, useState } from 'react'
import { Calculator, Clock, Droplet, Edit3, Pill, Plus, Save, Trash2 } from 'lucide-react'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { SearchInput } from '../../../components/ui/SearchInput'
import { Select } from '../../../components/ui/Select'
import { Table } from '../../../components/ui/Table'
import { useAppStore } from '../../../store/appStore'
import { calculateDose } from '../../../utils/doseCalculator'

const emptyMedication = { name: '', concentration: '', unit: 'mg/ml', category: '' }

export function MedicationsView() {
  const patients = useAppStore((s) => s.patients)
  const medications = useAppStore((s) => s.medicationsCatalog)
  const prescriptions = useAppStore((s) => s.prescriptions)
  const search = useAppStore((s) => s.medicationSearch)
  const setSearch = useAppStore((s) => s.setMedicationSearch)
  const addMedication = useAppStore((s) => s.addMedication)
  const updateMedication = useAppStore((s) => s.updateMedication)
  const deleteMedication = useAppStore((s) => s.deleteMedication)
  const addPrescription = useAppStore((s) => s.addPrescription)
  const [editing, setEditing] = useState(null)
  const [medForm, setMedForm] = useState(emptyMedication)
  const [doseForm, setDoseForm] = useState({ patientId: patients[0]?.id ?? '', medicationId: medications[0]?.id ?? '', concentration: medications[0]?.concentration ?? 10, weight: patients[0]?.weight ?? 0, mgKg: 1, frequency: 12, duration: 5 })
  const result = useMemo(() => calculateDose(doseForm), [doseForm])
  const filtered = medications.filter((medication) => [medication.name, medication.category, medication.unit].some((value) => value.toLowerCase().includes(search.toLowerCase())))

  const updateDose = (key) => (event) => setDoseForm((current) => {
    const value = event.target.value
    if (key === 'patientId') return { ...current, patientId: value, weight: patients.find((patient) => patient.id === value)?.weight ?? current.weight }
    if (key === 'medicationId') return { ...current, medicationId: value, concentration: medications.find((medication) => medication.id === value)?.concentration ?? current.concentration }
    return { ...current, [key]: value }
  })

  const medColumns = [
    { key: 'name', label: 'Medicamento', render: (row) => <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><Pill size={17} /></div><div><p className="font-extrabold text-slate-900">{row.name}</p><p className="text-xs text-slate-500">{row.category}</p></div></div> },
    { key: 'concentration', label: 'Concentracion', render: (row) => `${row.concentration} ${row.unit}` },
    { key: 'actions', label: 'Acciones', render: (row) => <div className="flex items-center gap-2"><Button className="h-10 w-10 min-w-10 px-0" aria-label="Editar" onClick={() => { setEditing(row); setMedForm(row) }}><Edit3 size={17} /></Button><Button className="h-10 w-10 min-w-10 px-0" aria-label="Eliminar" onClick={() => deleteMedication(row.id)}><Trash2 size={17} /></Button></div> },
  ]
  const rxRows = prescriptions.map((rx) => ({ ...rx, patient: patients.find((patient) => patient.id === rx.patientId)?.name, medication: medications.find((medication) => medication.id === rx.medicationId)?.name }))
  const rxColumns = [{ key: 'patient', label: 'Paciente' }, { key: 'medication', label: 'Medicamento' }, { key: 'dose', label: 'Dosis' }, { key: 'frequency', label: 'Frecuencia' }, { key: 'status', label: 'Estado', render: (row) => <Badge tone="green">{row.status}</Badge> }]

  return (
    <PageContainer eyebrow="Medicaciones" title="Gestion de medicamentos" description="Catalogo, calculo sugerido de dosis y prescripciones por paciente.">
      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="p-5" hover={false}>
          <h2 className="text-lg font-extrabold text-slate-950">{editing ? 'Editar medicamento' : 'Nuevo medicamento'}</h2>
          <form className="mt-4 grid gap-3" onSubmit={(event) => { event.preventDefault(); editing ? updateMedication(editing.id, medForm) : addMedication(medForm); setEditing(null); setMedForm(emptyMedication) }}>
            <Input placeholder="Nombre" value={medForm.name} onChange={(event) => setMedForm({ ...medForm, name: event.target.value })} required />
            <Input type="number" step="0.1" placeholder="Concentracion" value={medForm.concentration} onChange={(event) => setMedForm({ ...medForm, concentration: event.target.value })} required />
            <Select value={medForm.unit} onChange={(event) => setMedForm({ ...medForm, unit: event.target.value })}><option>mg/ml</option><option>mg/tableta</option><option>capsula</option></Select>
            <Input placeholder="Categoria" value={medForm.category} onChange={(event) => setMedForm({ ...medForm, category: event.target.value })} required />
            <Button variant="primary" type="submit"><Plus size={17} /> Guardar medicamento</Button>
          </form>
        </Card>
        <Card className="p-5" hover={false}>
          <div className="flex items-start justify-between"><h2 className="text-lg font-extrabold text-slate-950">Calculadora</h2><Badge tone="green">Tiempo real</Badge></div>
          <div className="mt-4 grid gap-3">
            <Select icon={<Calculator size={17} />} value={doseForm.patientId} onChange={updateDose('patientId')}>{patients.map((patient) => <option value={patient.id} key={patient.id}>{patient.name} · {patient.weight} kg</option>)}</Select>
            <Select icon={<Pill size={17} />} value={doseForm.medicationId} onChange={updateDose('medicationId')}>{medications.map((medication) => <option value={medication.id} key={medication.id}>{medication.name}</option>)}</Select>
            <div className="grid gap-3 sm:grid-cols-2"><Input icon={<Droplet size={17} />} type="number" value={doseForm.concentration} onChange={updateDose('concentration')} /><Input icon={<Calculator size={17} />} type="number" value={doseForm.weight} onChange={updateDose('weight')} /><Input type="number" value={doseForm.mgKg} onChange={updateDose('mgKg')} placeholder="mg/kg" /><Input icon={<Clock size={17} />} type="number" value={doseForm.frequency} onChange={updateDose('frequency')} /></div>
          </div>
        </Card>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4"><p className="text-3xl font-black text-slate-950">{result.doseMg}</p><p className="text-sm font-bold text-slate-500">mg dosis</p></Card>
        <Card className="p-4"><p className="text-3xl font-black text-slate-950">{result.amountMl}</p><p className="text-sm font-bold text-slate-500">ml por toma</p></Card>
        <Card className="p-4"><p className="text-3xl font-black text-slate-950">{result.dailyTakes}</p><p className="text-sm font-bold text-slate-500">tomas/dia</p></Card>
        <Card className="p-4"><p className="text-3xl font-black text-slate-950">{result.totalMl}</p><p className="text-sm font-bold text-slate-500">ml total</p></Card>
      </div>
      <div className="mt-4 flex justify-end"><Button variant="primary" onClick={() => addPrescription({ patientId: doseForm.patientId, medicationId: doseForm.medicationId, dose: `${result.amountMl} ml`, frequency: `cada ${doseForm.frequency} horas`, duration: `${doseForm.duration} dias`, date: new Date().toLocaleDateString('es-CO') })}><Save size={17} /> Guardar prescripcion</Button></div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <div><div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><SearchInput placeholder="Buscar medicamento" value={search} onChange={(event) => setSearch(event.target.value)} /><p className="text-sm font-semibold text-slate-500">{filtered.length} medicamentos</p></div><Table columns={medColumns} rows={filtered} /></div>
        <div><div className="mb-4 flex items-center justify-between"><p className="text-lg font-extrabold text-slate-950">Prescripciones</p><p className="text-sm font-semibold text-slate-500">{rxRows.length} registros</p></div><Table columns={rxColumns} rows={rxRows} /></div>
      </div>
    </PageContainer>
  )
}
