import { useState, useEffect } from 'react'
import { Edit3, Eye, Pill, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { SearchInput } from '@/components/ui/SearchInput'
import { Table } from '@/components/ui/Table'
import { useDebounce } from '@/hooks/useDebounce'
import { useConfirm } from '@/hooks/useConfirm.jsx'
import { useMutation } from '@/hooks/useFetch'
import { usePatients, useCreatePatient, useDeletePatient, toApiPayload } from '@/pages/Patients/services'
import { useOwners } from '@/pages/Owners/services'
import { useMedications, useCreatePrescription } from '@/pages/Medications/services'
import { emptyPatient, PatientModal } from '@/pages/Patients/Components/PatientModal'
import { SpeciesFilter } from '@/pages/Patients/Components/SpeciesFilter'
import { PrescriptionModal } from '@/pages/PatientProfile/Components/PrescriptionModal'

const AVATAR_GRADS = ['from-blue-500 to-blue-700','from-violet-500 to-purple-700','from-emerald-500 to-teal-600','from-rose-400 to-pink-600','from-amber-400 to-orange-500','from-sky-400 to-cyan-600']
const getGrad = (name) => AVATAR_GRADS[(name.charCodeAt(0) - 65) % AVATAR_GRADS.length]
const SPECIES_ICON = { Canino: '🐕', Felino: '🐱', Ave: '🦜', Reptil: '🦎', Otro: '🐾' }
const STATUS_CLS = {
  activo:   'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  inactivo: 'bg-slate-100  text-slate-600   dark:bg-slate-500/10   dark:text-slate-400',
  critico:  'bg-rose-50    text-rose-700    dark:bg-rose-500/10    dark:text-rose-400',
}
const STATUS_LABEL = { activo: 'Activo', inactivo: 'Inactivo', critico: 'Crítico' }

export function PatientsView() {
  const [modal,   setModal]   = useState(null)
  const [rxModal, setRxModal] = useState(null)
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState('todos')
  const { confirm, ConfirmDialog } = useConfirm()
  const debouncedSearch = useDebounce(search, 280)

  // Datos del backend
  const { data: pData, loading, refetch } = usePatients({
    search:  debouncedSearch || undefined,
    species: filter !== 'todos' ? filter : undefined,
  })
  const patients = pData?.items ?? []

  const { data: oData } = useOwners({ limit: 200 })
  const owners = oData?.items ?? []

  // Lazy: solo carga medicamentos cuando se abre el modal de prescripción
  const { data: mData, refetch: loadMeds } = useMedications({ limit: 200 }, { immediate: false })
  const medications = mData?.items ?? []
  useEffect(() => { if (rxModal) loadMeds() }, [rxModal]) // eslint-disable-line react-hooks/exhaustive-deps

  // Mutaciones
  const { create: createPatient }    = useCreatePatient({ onSuccess: () => refetch() })
  const { remove: removePatient }    = useDeletePatient({ onSuccess: () => refetch() })
  const { mutate: _doUpdate }        = useMutation('PUT', '/patients', { successMsg: 'Paciente actualizado', onSuccess: () => refetch() })
  const { create: addPrescription }  = useCreatePrescription()

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
    { key: 'breed',  label: 'Raza',  width: '160px' },
    { key: 'age',    label: 'Edad',  width: '90px' },
    { key: 'weight', label: 'Peso',  width: '90px', align: 'right', render: (row) => <span className="font-semibold text-[var(--text)]">{row.weight} <span className="font-normal text-[var(--text-3)]">kg</span></span> },
    { key: 'sex',    label: 'Sexo',  width: '90px' },
    { key: 'status', label: 'Estado', width: '130px', render: (row) => <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLS[row.status] ?? STATUS_CLS.activo}`}>{STATUS_LABEL[row.status] ?? row.status}</span> },
    {
      key: 'actions', label: '', width: '120px', align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Link to={`/pacientes/${row.id}`} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]" aria-label="Ver perfil"><Eye size={14} /></Link>
          <button title="Nueva prescripción" onClick={() => setRxModal(row)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-500/10"><Pill size={14} /></button>
          <button onClick={() => setModal({ mode: 'edit', data: row })} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"><Edit3 size={14} /></button>
          <button
            onClick={async () => { if (await confirm({ title: `Eliminar ${row.name}`, message: 'Esta acción no se puede deshacer.', danger: true })) removePatient(row.id) }}
            className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
          ><Trash2 size={14} /></button>
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
        <span className="ml-auto text-xs text-[var(--text-3)]">{loading ? '…' : `${patients.length} registros`}</span>
      </div>
      <div className="flex flex-1 min-h-0 flex-col">
        {loading
          ? <Table columns={columns} rows={[]} pageSize={10} loading />
          : patients.length
            ? <Table columns={columns} rows={patients} pageSize={10} />
            : <EmptyState title="Sin pacientes" description="No hay registros con los filtros actuales." />}
      </div>
      {modal && (
        <PatientModal key={modal.data?.id ?? modal.mode} modal={modal} owners={owners}
          onClose={() => setModal(null)}
          onSave={(data, mode, id) => {
            if (mode === 'edit' && id) _doUpdate(toApiPayload(data), `/patients/${id}`)
            else createPatient(data)
            setModal(null)
          }}
        />
      )}
      {rxModal && (
        <PrescriptionModal
          patient={rxModal}
          medications={medications}
          onClose={() => setRxModal(null)}
          onSave={(data, mode) => { if (mode !== 'edit') addPrescription(data); setRxModal(null) }}
        />
      )}
      <ConfirmDialog />
    </PageContainer>
  )
}
