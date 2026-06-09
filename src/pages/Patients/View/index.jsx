import { useMemo, useRef, useState } from 'react'
import { ChevronDown, Edit3, Eye, Plus, Trash2 } from 'lucide-react'
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

const emptyPatient = {
  name: '', species: 'Canino', breed: '', age: '', weight: '',
  sex: 'Macho', status: 'Estable', ownerId: '', color: '',
  microchip: '', sterilized: false,
}

const speciesOptions = [
  { value: 'todos',  label: 'Todos',   emoji: '🐾' },
  { value: 'Canino', label: 'Canino',  emoji: '🐕' },
  { value: 'Felino', label: 'Felino',  emoji: '🐱' },
  { value: 'Ave',    label: 'Ave',     emoji: '🦜' },
  { value: 'Reptil', label: 'Reptil',  emoji: '🦎' },
]
const statusTone = { Estable: 'green', Tratamiento: 'amber', Observacion: 'amber', Preventivo: 'blue', Alta: 'rose' }

export function PatientsView() {
  const [modal,       setModal]       = useState(null)
  const [dropOpen,    setDropOpen]    = useState(false)
  const dropRef = useRef(null)
  const patientsAll = useAppStore((s) => s.patients)
  const owners = useAppStore((s) => s.owners)
  const search = useAppStore((s) => s.patientSearch)
  const filter = useAppStore((s) => s.patientFilter)
  const setSearch = useAppStore((s) => s.setPatientSearch)
  const setFilter = useAppStore((s) => s.setPatientFilter)
  const addPatient = useAppStore((s) => s.addPatient)
  const updatePatient = useAppStore((s) => s.updatePatient)
  const deletePatient = useAppStore((s) => s.deletePatient)

  const patients = useMemo(() => patientsAll.filter((p) => {
    const owner = owners.find((o) => o.id === p.ownerId)?.name ?? p.owner
    const q = search.toLowerCase()
    return (filter === 'todos' || p.species === filter) &&
      [p.name, p.species, p.breed, p.status, owner].some((v) => v?.toLowerCase().includes(q))
  }), [patientsAll, owners, search, filter])

  // Colores por inicial para avatares más vivos
  const avatarGrad = ['from-blue-500 to-blue-700','from-violet-500 to-purple-700','from-emerald-500 to-teal-600','from-rose-400 to-pink-600','from-amber-400 to-orange-500','from-sky-400 to-cyan-600']
  const getGrad = (name) => avatarGrad[(name.charCodeAt(0) - 65) % avatarGrad.length]

  const speciesIcon = { Canino: '🐕', Felino: '🐱', Ave: '🦜', Reptil: '🦎', Otro: '🐾' }

  const columns = [
    {
      key: 'name', label: 'Paciente', width: '220px',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${getGrad(row.name)} text-sm font-bold text-white shadow-sm`}>
            {row.name[0]}
          </div>
          <div>
            <p className="font-semibold text-[var(--text)]">{row.name}</p>
            <p className="text-xs text-[var(--text-3)]">{owners.find((o) => o.id === row.ownerId)?.name ?? row.owner}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'species', label: 'Especie', width: '120px',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-sm text-[var(--text-2)]">
          <span>{speciesIcon[row.species] ?? '🐾'}</span>
          {row.species}
        </span>
      ),
    },
    { key: 'breed', label: 'Raza', width: '160px' },
    { key: 'age',   label: 'Edad', width: '90px' },
    { key: 'weight', label: 'Peso', width: '90px', align: 'right', render: (row) => (
      <span className="font-semibold text-[var(--text)]">{row.weight} <span className="font-normal text-[var(--text-3)]">kg</span></span>
    )},
    { key: 'sex', label: 'Sexo', width: '90px' },
    {
      key: 'status', label: 'Estado', width: '130px',
      render: (row) => {
        const cfg = {
          Estable:     'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
          Tratamiento: 'bg-amber-50   text-amber-700   dark:bg-amber-500/10   dark:text-amber-400',
          Observacion: 'bg-blue-50    text-blue-700    dark:bg-blue-500/10    dark:text-blue-400',
          Preventivo:  'bg-sky-50     text-sky-700     dark:bg-sky-500/10     dark:text-sky-400',
          Alta:        'bg-rose-50    text-rose-700    dark:bg-rose-500/10    dark:text-rose-400',
        }
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cfg[row.status] ?? cfg.Estable}`}>
            {row.status}
          </span>
        )
      },
    },
    {
      key: 'actions', label: '', width: '100px', align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Link to={`/pacientes/${row.id}`} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]" aria-label="Ver">
            <Eye size={14} />
          </Link>
          <button onClick={() => setModal({ mode: 'edit', data: row })} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]">
            <Edit3 size={14} />
          </button>
          <button onClick={() => deletePatient(row.id)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <PageContainer
      eyebrow="Pacientes"
      title="Gestión de pacientes"
      description="Crea, edita y consulta pacientes con su propietario vinculado."
      actions={
        <Button variant="primary" onClick={() => setModal({ mode: 'create', data: emptyPatient })}>
          <Plus size={15} /> Nuevo paciente
        </Button>
      }
    >
      <div className="mb-3 shrink-0 flex flex-wrap items-center gap-2">
        <SearchInput placeholder="Buscar paciente…" value={search} onChange={(e) => setSearch(e.target.value)} />

        {/* Dropdown de especie */}
        <div ref={dropRef} className="relative">
          {(() => {
            const active = speciesOptions.find((o) => o.value === filter) ?? speciesOptions[0]
            return (
              <button
                onClick={() => setDropOpen((v) => !v)}
                onBlur={(e) => { if (!dropRef.current?.contains(e.relatedTarget)) setDropOpen(false) }}
                className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-colors ${
                  filter !== 'todos'
                    ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-2)] hover:bg-[var(--surface-2)]'
                }`}
              >
                <span className="text-base leading-none">{active.emoji}</span>
                <span>{active.label}</span>
                <ChevronDown size={13} className={`transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
              </button>
            )
          })()}

          {/* Dropdown panel */}
          {dropOpen && (
            <div className="absolute left-0 top-full z-50 mt-1.5 min-w-[160px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl">
              {speciesOptions.map((opt) => (
                <button
                  key={opt.value}
                  onMouseDown={() => { setFilter(opt.value); setDropOpen(false) }}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--surface-2)] ${
                    filter === opt.value ? 'text-blue-600 dark:text-blue-400' : 'text-[var(--text-2)]'
                  }`}
                >
                  <span className="text-base">{opt.emoji}</span>
                  {opt.label}
                  {filter === opt.value && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="ml-auto text-xs text-[var(--text-3)]">{patients.length} registros</span>
      </div>

      <div className="flex flex-1 min-h-0 flex-col">
        {patients.length
          ? <Table columns={columns} rows={patients} pageSize={10} />
          : <EmptyState title="Sin pacientes" description="No hay registros con los filtros actuales." />
        }
      </div>

      {modal && (
        <PatientModal
          key={modal.data?.id ?? modal.mode}
          modal={modal}
          owners={owners}
          onClose={() => setModal(null)}
          onSave={(data) => {
            modal.mode === 'edit' && modal.data?.id
              ? updatePatient(modal.data.id, data)
              : addPatient(data)
            setModal(null)
          }}
        />
      )}
    </PageContainer>
  )
}

function PatientModal({ modal, owners, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ ...emptyPatient, ...modal.data }))
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const setCheck = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.checked }))

  return (
    <Modal isOpen={!!modal} onClose={onClose} title={modal.mode === 'edit' ? 'Editar paciente' : 'Nuevo paciente'}>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSave({ ...form, weight: Number(form.weight) || 0 }) }}>

        <section>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-3)]">Datos básicos</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Input placeholder="Nombre *" value={form.name} onChange={set('name')} required />
            <Select
              options={['Canino', 'Felino', 'Ave', 'Reptil', 'Otro']}
              value={form.species} onChange={set('species')} placeholder="Especie"
            />
            <Input placeholder="Raza *" value={form.breed} onChange={set('breed')} required />
            <Input placeholder="Color / pelaje" value={form.color} onChange={set('color')} />
            <Input placeholder="Edad (ej: 3 años)" value={form.age} onChange={set('age')} />
            <Input type="number" step="0.1" min="0" placeholder="Peso (kg)" value={form.weight} onChange={set('weight')} />
            <Select options={['Macho', 'Hembra']} value={form.sex} onChange={set('sex')} placeholder="Sexo" />
            <Select
              options={['Estable', 'Tratamiento', 'Observacion', 'Preventivo', 'Alta']}
              value={form.status} onChange={set('status')} placeholder="Estado"
            />
          </div>
        </section>

        <section>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-3)]">Información clínica</p>
          <div className="space-y-2">
            <Select
              options={owners.map((o) => ({ value: o.id, label: o.name }))}
              value={form.ownerId} onChange={set('ownerId')}
              placeholder="Seleccionar propietario *" required
            />
            <Input placeholder="Número de microchip" value={form.microchip} onChange={set('microchip')} />
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--border)]">
              <input type="checkbox" checked={form.sterilized} onChange={setCheck('sterilized')} className="h-4 w-4 accent-blue-600" />
              Esterilizado / a
            </label>
          </div>
        </section>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit">Guardar</Button>
        </div>
      </form>
    </Modal>
  )
}
