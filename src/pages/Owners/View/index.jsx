import { useMemo, useState } from 'react'
import { Edit3, Plus, Trash2 } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { Table } from '@/components/ui/Table'
import { useConfirm } from '@/hooks/useConfirm.jsx'
import { useAppStore } from '@/store/appStore'
import { emptyOwner, OwnerModal } from '@/pages/Owners/Components/OwnerModal'

export function OwnersView() {
  const [modal, setModal] = useState(null)
  const { confirm, ConfirmDialog } = useConfirm()

  const ownersAll   = useAppStore((s) => s.owners)
  const patients    = useAppStore((s) => s.patients)
  const search      = useAppStore((s) => s.ownerSearch)
  const setSearch   = useAppStore((s) => s.setOwnerSearch)
  const addOwner    = useAppStore((s) => s.addOwner)
  const updateOwner = useAppStore((s) => s.updateOwner)
  const deleteOwner = useAppStore((s) => s.deleteOwner)

  const owners = useMemo(() => ownersAll.filter((owner) => {
    const pets = patients.filter((p) => p.ownerId === owner.id).map((p) => p.name).join(', ')
    const q = search.toLowerCase()
    return [owner.name, owner.phone, owner.email, pets].some((v) => v?.toLowerCase().includes(q))
  }), [ownersAll, patients, search])

  const columns = [
    {
      key: 'name', label: 'Propietario',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-amber-500 text-sm font-bold text-white">{row.name[0]}</div>
          <div>
            <p className="font-semibold text-[var(--text)]">{row.name}</p>
            <p className="text-xs text-[var(--text-3)]">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'pets', label: 'Pacientes', render: (row) => <span className="text-sm text-[var(--text-2)]">{patients.filter((p) => p.ownerId === row.id).map((p) => p.name).join(', ') || 'Sin pacientes'}</span> },
    { key: 'phone', label: 'Teléfono' },
    { key: 'balance', label: 'Saldo', render: (row) => <Badge tone={row.balance > 0 ? 'rose' : 'green'}>{row.balanceStr}</Badge> },
    {
      key: 'actions', label: '',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button onClick={() => setModal({ mode: 'edit', data: row })} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]" aria-label="Editar"><Edit3 size={15} /></button>
          <button
            onClick={async () => { if (await confirm({ title: `Eliminar ${row.name}`, message: 'Sus pacientes quedarán sin propietario.', danger: true })) deleteOwner(row.id) }}
            className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10" aria-label="Eliminar"
          ><Trash2 size={15} /></button>
        </div>
      ),
    },
  ]

  return (
    <PageContainer eyebrow="Propietarios" title="Relación propietario-paciente" description="Contactos, pacientes asociados y saldos."
      actions={<Button variant="primary" onClick={() => setModal({ mode: 'create', data: emptyOwner })}><Plus size={15} /> Nuevo propietario</Button>}>
      <div className="mb-3 shrink-0 flex flex-wrap items-center gap-3">
        <SearchInput placeholder="Buscar propietario…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <span className="ml-auto text-xs text-[var(--text-3)]">{owners.length} registros</span>
      </div>
      <div className="flex flex-1 min-h-0 flex-col">
        <Table columns={columns} rows={owners} pageSize={10} />
      </div>
      {modal && (
        <OwnerModal key={modal.data?.id ?? modal.mode} modal={modal} onClose={() => setModal(null)}
          onSave={(data, mode, id) => { mode === 'edit' && id ? updateOwner(id, data) : addOwner(data); setModal(null) }}
        />
      )}
      <ConfirmDialog />
    </PageContainer>
  )
}
