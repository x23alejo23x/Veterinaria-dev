import { useMemo, useState } from 'react'
import { Cat, Dog, Edit3, Eye, Filter, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/ui/EmptyState'
import { Input } from '../../../components/ui/Input'
import { Modal } from '../../../components/ui/Modal'
import { SearchInput } from '../../../components/ui/SearchInput'
import { Select } from '../../../components/ui/Select'
import { Table } from '../../../components/ui/Table'
import { useAppStore } from '../../../store/appStore'

const emptyPatient = { name: '', species: 'Canino', breed: '', age: '', weight: '', sex: 'Macho', status: 'Estable', ownerId: '', color: '', microchip: '', sterilized: false }
const filters = ['todos', 'Canino', 'Felino']

export function PatientsView() {
  const [modal, setModal] = useState(null)
  const patientsAll = useAppStore((s) => s.patients)
  const owners = useAppStore((s) => s.owners)
  const search = useAppStore((s) => s.patientSearch)
  const filter = useAppStore((s) => s.patientFilter)
  const setSearch = useAppStore((s) => s.setPatientSearch)
  const setFilter = useAppStore((s) => s.setPatientFilter)
  const addPatient = useAppStore((s) => s.addPatient)
  const updatePatient = useAppStore((s) => s.updatePatient)
  const deletePatient = useAppStore((s) => s.deletePatient)

  const patients = useMemo(() => patientsAll.filter((patient) => {
    const owner = owners.find((item) => item.id === patient.ownerId)?.name ?? patient.owner
    const q = search.toLowerCase()
    return (filter === 'todos' || patient.species === filter) && [patient.name, patient.species, patient.breed, patient.status, owner].some((value) => value?.toLowerCase().includes(q))
  }), [patientsAll, owners, search, filter])

  const columns = [
    { key: 'name', label: 'Paciente', render: (row) => <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 font-black text-white">{row.name[0]}</div><div><p className="font-extrabold text-slate-900">{row.name}</p><p className="text-xs text-slate-500">{owners.find((item) => item.id === row.ownerId)?.name ?? row.owner}</p></div></div> },
    { key: 'species', label: 'Especie' },
    { key: 'breed', label: 'Raza' },
    { key: 'age', label: 'Edad' },
    { key: 'weight', label: 'Peso', render: (row) => `${row.weight} kg` },
    { key: 'status', label: 'Estado', render: (row) => <Badge tone={row.status === 'Tratamiento' ? 'amber' : 'green'}>{row.status}</Badge> },
    { key: 'actions', label: 'Acciones', render: (row) => <div className="flex items-center gap-2"><Link className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-blue-50" to={`/pacientes/${row.id}`} aria-label="Ver"><Eye size={17} /></Link><Button className="h-10 w-10 min-w-10 px-0" aria-label="Editar" onClick={() => setModal({ mode: 'edit', data: row })}><Edit3 size={17} /></Button><Button className="h-10 w-10 min-w-10 px-0" aria-label="Eliminar" onClick={() => deletePatient(row.id)}><Trash2 size={17} /></Button></div> },
  ]

  return (
    <PageContainer eyebrow="Pacientes" title="Gestion de pacientes" description="Crear, editar, consultar, buscar y filtrar pacientes con propietario vinculado." actions={<Button variant="primary" onClick={() => setModal({ mode: 'create', data: emptyPatient })}><Plus size={18} /> Crear paciente</Button>}>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput placeholder="Buscar paciente" value={search} onChange={(event) => setSearch(event.target.value)} />
          {filters.map((item) => <button key={item} className={`inline-flex min-h-9 items-center gap-1 rounded-full border px-3 text-sm font-bold ${filter === item ? 'border-blue-100 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-500'}`} onClick={() => setFilter(item)}>{item === 'Canino' ? <Dog size={14} /> : item === 'Felino' ? <Cat size={14} /> : <Filter size={14} />}{item}</button>)}
        </div>
        <p className="text-sm font-semibold text-slate-500">{patients.length} pacientes</p>
      </div>
      {patients.length ? <Table columns={columns} rows={patients} /> : <EmptyState title="Sin pacientes" description="No hay registros con los filtros actuales." />}
      {modal ? <PatientModal key={modal.data?.id ?? modal.mode} modal={modal} owners={owners} onClose={() => setModal(null)} onSave={(data) => { modal.mode === 'edit' && modal.data?.id ? updatePatient(modal.data.id, data) : addPatient(data); setModal(null) }} /> : null}
    </PageContainer>
  )
}

function PatientModal({ modal, owners, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ ...emptyPatient, ...modal.data }))
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  return (
    <Modal isOpen={!!modal} onClose={onClose} title={modal.mode === 'edit' ? 'Editar paciente' : 'Nuevo paciente'}>
      <form className="grid gap-3" onSubmit={(event) => { event.preventDefault(); onSave({ ...form, weight: Number(form.weight) || 0 }) }}>
        <div className="grid gap-3 sm:grid-cols-2"><Input placeholder="Nombre" value={form.name} onChange={update('name')} required /><Select value={form.species} onChange={update('species')}><option>Canino</option><option>Felino</option><option>Ave</option><option>Otro</option></Select></div>
        <div className="grid gap-3 sm:grid-cols-2"><Input placeholder="Raza" value={form.breed} onChange={update('breed')} required /><Input placeholder="Edad" value={form.age} onChange={update('age')} /></div>
        <div className="grid gap-3 sm:grid-cols-2"><Input type="number" step="0.1" placeholder="Peso kg" value={form.weight} onChange={update('weight')} /><Select value={form.ownerId} onChange={update('ownerId')} required><option value="">Seleccionar propietario</option>{owners.map((owner) => <option value={owner.id} key={owner.id}>{owner.name}</option>)}</Select></div>
        <div className="flex justify-end gap-2 pt-2"><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button variant="primary" type="submit">Guardar</Button></div>
      </form>
    </Modal>
  )
}
