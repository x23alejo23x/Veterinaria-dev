import { useMemo, useState } from 'react'
import { Edit3, Plus, Trash2 } from 'lucide-react'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Modal } from '../../../components/ui/Modal'
import { SearchInput } from '../../../components/ui/SearchInput'
import { Table } from '../../../components/ui/Table'
import { useAppStore } from '../../../store/appStore'

const emptyOwner = { name: '', phone: '', email: '', address: '', balance: 0 }

export function OwnersView() {
  const [modal, setModal] = useState(null)
  const ownersAll = useAppStore((s) => s.owners)
  const patients = useAppStore((s) => s.patients)
  const search = useAppStore((s) => s.ownerSearch)
  const setSearch = useAppStore((s) => s.setOwnerSearch)
  const addOwner = useAppStore((s) => s.addOwner)
  const updateOwner = useAppStore((s) => s.updateOwner)
  const deleteOwner = useAppStore((s) => s.deleteOwner)
  const owners = useMemo(() => ownersAll.filter((owner) => {
    const pets = patients.filter((patient) => patient.ownerId === owner.id).map((patient) => patient.name).join(', ')
    const q = search.toLowerCase()
    return [owner.name, owner.phone, owner.email, pets].some((value) => value?.toLowerCase().includes(q))
  }), [ownersAll, patients, search])
  const columns = [
    { key: 'name', label: 'Propietario', render: (row) => <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 font-black text-white">{row.name[0]}</div><div><p className="font-extrabold text-slate-900">{row.name}</p><p className="text-xs text-slate-500">{row.email}</p></div></div> },
    { key: 'pets', label: 'Pacientes', render: (row) => patients.filter((patient) => patient.ownerId === row.id).map((patient) => patient.name).join(', ') || 'Sin pacientes' },
    { key: 'phone', label: 'Telefono' },
    { key: 'balance', label: 'Saldo', render: (row) => <Badge tone={row.balance > 0 ? 'rose' : 'green'}>{row.balanceStr}</Badge> },
    { key: 'actions', label: 'Acciones', render: (row) => <div className="flex items-center gap-2"><Button className="h-10 w-10 min-w-10 px-0" aria-label="Editar" onClick={() => setModal({ mode: 'edit', data: row })}><Edit3 size={17} /></Button><Button className="h-10 w-10 min-w-10 px-0" aria-label="Eliminar" onClick={() => deleteOwner(row.id)}><Trash2 size={17} /></Button></div> },
  ]
  return (
    <PageContainer eyebrow="Propietarios" title="Relacion propietario-paciente" description="Contactos, pacientes asociados y saldos." actions={<Button variant="primary" onClick={() => setModal({ mode: 'create', data: emptyOwner })}><Plus size={18} /> Nuevo propietario</Button>}>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><SearchInput placeholder="Buscar propietario" value={search} onChange={(event) => setSearch(event.target.value)} /><p className="text-sm font-semibold text-slate-500">{owners.length} propietarios</p></div>
      <Table columns={columns} rows={owners} />
      {modal ? <OwnerModal key={modal.data?.id ?? modal.mode} modal={modal} onClose={() => setModal(null)} onSave={(data) => { modal.mode === 'edit' && modal.data?.id ? updateOwner(modal.data.id, data) : addOwner(data); setModal(null) }} /> : null}
    </PageContainer>
  )
}

function OwnerModal({ modal, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ ...emptyOwner, ...modal.data }))
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  return (
    <Modal isOpen={!!modal} onClose={onClose} title={modal.mode === 'edit' ? 'Editar propietario' : 'Nuevo propietario'}>
      <form className="grid gap-3" onSubmit={(event) => { event.preventDefault(); onSave(form) }}>
        <Input placeholder="Nombre completo" value={form.name} onChange={update('name')} required />
        <div className="grid gap-3 sm:grid-cols-2"><Input placeholder="Telefono" value={form.phone} onChange={update('phone')} required /><Input placeholder="Email" value={form.email} onChange={update('email')} /></div>
        <Input placeholder="Direccion" value={form.address} onChange={update('address')} />
        <Input type="number" placeholder="Saldo" value={form.balance} onChange={update('balance')} />
        <div className="flex justify-end gap-2 pt-2"><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button variant="primary" type="submit">Guardar</Button></div>
      </form>
    </Modal>
  )
}
