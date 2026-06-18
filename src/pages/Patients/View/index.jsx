import { useMemo, useState } from 'react'
import { Edit3, Eye, Pill, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { SearchInput } from '@/components/ui/SearchInput'
import { Table } from '@/components/ui/Table'
import { useDebounce } from '@/hooks/useDebounce'
import { useConfirm } from '@/hooks/useConfirm.jsx'
import { useAppStore } from '@/store/appStore'
import { emptyPatient, PatientModal } from '@/pages/Patients/Components/PatientModal'
import { SpeciesFilter } from '@/pages/Patients/Components/SpeciesFilter'
import { PrescriptionModal } from '@/pages/PatientProfile/Components/PrescriptionModal'

/* ── Helpers locales (< 5 líneas cada uno → no merecen archivo propio) ── */
const AVATAR_GRADS = ['from-blue-500 to-blue-700','from-violet-500 to-purple-700','from-emerald-500 to-teal-600','from-rose-400 to-pink-600','from-amber-400 to-orange-500','from-sky-400 to-cyan-600']
const getGrad = (name) => AVATAR_GRADS[(name.charCodeAt(0) - 65) % AVATAR_GRADS.length]
const SPECIES_ICON = { Canino: '🐕', Felino: '🐱', Ave: '🦜', Reptil: '🦎', Otro: '🐾' }
const STATUS_CLS = {
  Estable:     'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Tratamiento: 'bg-amber-50   text-amber-700   dark:bg-amber-500/10   dark:text-amber-400',
  Observacion: 'bg-blue-50    text-blue-700    dark:bg-blue-500/10    dark:text-blue-400',
  Preventivo:  'bg-sky-50     text-sky-700     dark:bg-sky-500/10     dark:text-sky-400',
  Alta:        'bg-rose-50    text-rose-700    dark:bg-rose-500/10    dark:text-rose-400',
}

export function PatientsView() {
  const [modal,   setModal]   = useState(null)
  const [rxModal, setRxModal] = useState(null) // patient object | null
  const { confirm, ConfirmDialog } = useConfirm()

  // Store
  const patientsAll      = useAppStore((s) => s.patients)
  const owners           = useAppStore((s) => s.owners)
  const medications      = useAppStore((s) => s.medicationsCatalog)
  const search           = useAppStore((s) => s.patientSearch)
  const filter           = useAppStore((s) => s.patientFilter)
  const setSearch        = useAppStore((s) => s.setPatientSearch)
  const setFilter        = useAppStore((s) => s.setPatientFilter)
  const addPatient       = useAppStore((s) => s.addPatient)
  const updatePatient    = useAppStore((s) => s.updatePatient)
  const deletePatient    = useAppStore((s) => s.deletePatient)
  const addPrescription  = useAppStore((s) => s.addPrescription)

  const debouncedSearch = useDebounce(search, 280)
  const patients = useMemo(() => patientsAll.filter((p) => {
    const owner = owners.find((o) => o.id === p.ownerId)?.name ?? p.owner
    const q = debouncedSearch.toLowerCase()
    return (filter === 'todos' || p.species === filter) &&
      [p.name, p.species, p.breed, p.status, owner].some((v) => v?.toLowerCase().includes(q))
  }), [patientsAll, owners, debouncedSearch, filter])

  const columns = [
    {
      key: 'name', label: 'Paciente', width: '220px',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${getGrad(row.name)} text-sm font-bold text-white shadow-sm`}>{row.name[0]}</div>
          <div>
            <p className="font-semibold text-[var(--text)]">{row.name}</p>
            <p className="text-xs text-[var(--text-3)]">{owners.find((o) => o.id === row.ownerId)?.name ?? row.owner}</p>
          </div>
        </div>
      ),
    },
    { key: 'species', label: 'Especie', width: '120px', render: (row) => <span className="inline-flex items-center gap-1.5 text-sm text-[var(--text-2)]"><span>{SPECIES_ICON[row.species] ?? '🐾'}</span>{row.species}</span> },
    { key: 'breed', label: 'Raza', width: '160px' },
    { key: 'age',   label: 'Edad', width: '90px' },
    { key: 'weight', label: 'Peso', width: '90px', align: 'right', render: (row) => <span className="font-semibold text-[var(--text)]">{row.weight} <span className="font-normal text-[var(--text-3)]">kg</span></span> },
    { key: 'sex', label: 'Sexo', width: '90px' },
    { key: 'status', label: 'Estado', width: '130px', render: (row) => <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLS[row.status] ?? STATUS_CLS.Estable}`}>{row.status}</span> },
    {
      key: 'actions', label: '', width: '120px', align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Link to={`/pacientes/${row.id}`} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]" aria-label="Ver perfil"><Eye size={14} /></Link>
          <button title="Nueva prescripción" onClick={() => setRxModal(row)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-500/10"><Pill size={14} /></button>
          <button onClick={() => setModal({ mode: 'edit', data: row })} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"><Edit3 size={14} /></button>
          <button onClick={async () => { if (await confirm({ title: `Eliminar ${row.name}`, message: 'Esta acción no se puede deshacer.', danger: true })) deletePatient(row.id) }} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ]

  return (
    <PageContainer eyebrow="Pacientes" title="Gestión de pacientes" description="Crea, edita y consulta pacientes con su propietario vinculado."
      actions={<Button variant="primary" onClick={() => setModal({ mode: 'create', data: emptyPatient })}><Plus size={15} /> Nuevo paciente</Button>}>
      <div className="mb-3 shrink-0 flex flex-wrap items-center gap-2">
        <SearchInput placeholder="Buscar paciente…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <SpeciesFilter value={filter} onChange={setFilter} />
        <span className="ml-auto text-xs text-[var(--text-3)]">{patients.length} registros</span>
      </div>
      <div className="flex flex-1 min-h-0 flex-col">
        {patients.length ? <Table columns={columns} rows={patients} pageSize={10} /> : <EmptyState title="Sin pacientes" description="No hay registros con los filtros actuales." />}
      </div>
      {modal && (
        <PatientModal key={modal.data?.id ?? modal.mode} modal={modal} owners={owners}
          onClose={() => setModal(null)}
          onSave={(data, mode, id) => { mode === 'edit' && id ? updatePatient(id, data) : addPatient(data); setModal(null) }}
        />
      )}
      {rxModal && (
        <PrescriptionModal
          patient={rxModal}
          medications={medications}
          onClose={() => setRxModal(null)}
          onSave={(data, mode, rxId) => { mode === 'edit' ? null : addPrescription(data); setRxModal(null) }}
        />
      )}
      <ConfirmDialog />
    </PageContainer>
  )
}
