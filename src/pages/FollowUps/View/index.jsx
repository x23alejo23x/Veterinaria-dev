import { useMemo, useState } from 'react'
import { Activity, CalendarClock, CheckCircle2, Clock, Edit3, Plus, Trash2, TriangleAlert, User } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button }        from '@/components/ui/Button'
import { SearchInput }   from '@/components/ui/SearchInput'
import { useConfirm }    from '@/hooks/useConfirm.jsx'
import { useDebounce }   from '@/hooks/useDebounce'
import { useAppStore }   from '@/store/appStore'
import {
  FOLLOWUP_STATUSES, FOLLOWUP_TYPES,
  STATUS_CFG, TYPE_CFG,
  formatDueDate, getPatientGrad, isOverdue,
} from '@/pages/FollowUps/constants'
import { FollowUpModal } from '@/pages/FollowUps/Components/FollowUpModal'

export function FollowUpsView() {
  const followUps       = useAppStore((s) => s.followUps)
  const patients        = useAppStore((s) => s.patients)
  const addFollowUp     = useAppStore((s) => s.addFollowUp)
  const updateFollowUp  = useAppStore((s) => s.updateFollowUp)
  const deleteFollowUp  = useAppStore((s) => s.deleteFollowUp)
  const { confirm, ConfirmDialog } = useConfirm()

  const [search,      setSearch]      = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [typeFilter,  setTypeFilter]  = useState('todos')
  const [modal,       setModal]       = useState(null)

  const debouncedSearch = useDebounce(search, 280)

  /* Normaliza vencidos automáticamente para mostrar */
  const enriched = useMemo(() => followUps.map((f) => ({
    ...f,
    _overdue: isOverdue(f.dueDate, f.status),
    _displayStatus: isOverdue(f.dueDate, f.status) ? 'Vencido' : f.status,
  })), [followUps])

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase()
    return enriched.filter((f) => {
      const matchSearch = !q || [f.patientName, f.vet, f.type, f.notes].some((v) => v?.toLowerCase().includes(q))
      const matchStatus = statusFilter === 'todos' || f._displayStatus === statusFilter
      const matchType   = typeFilter === 'todos'   || f.type === typeFilter
      return matchSearch && matchStatus && matchType
    })
  }, [enriched, debouncedSearch, statusFilter, typeFilter])

  /* Stats */
  const stats = useMemo(() => ({
    total:      enriched.length,
    pendientes: enriched.filter((f) => f._displayStatus === 'Pendiente').length,
    vencidos:   enriched.filter((f) => f._displayStatus === 'Vencido').length,
    completados: enriched.filter((f) => f.status === 'Completado').length,
  }), [enriched])

  const handleSave = (data, mode, id) => {
    mode === 'edit' && id ? updateFollowUp(id, data) : addFollowUp(data)
    setModal(null)
  }

  const handleDelete = async (fu) => {
    const ok = await confirm({
      title:   `Eliminar seguimiento`,
      message: `¿Eliminar el seguimiento de ${fu.type} para ${fu.patientName}? Esta acción no se puede deshacer.`,
      danger:  true,
    })
    if (ok) deleteFollowUp(fu.id)
  }

  return (
    <PageContainer
      eyebrow="Seguimientos"
      title="Seguimientos médicos"
      description="Programa y controla revisiones, vacunas y procedimientos futuros."
      actions={
        <Button variant="primary" onClick={() => setModal({ mode: 'create' })}>
          <Plus size={15} /> Nuevo seguimiento
        </Button>
      }
    >
      {/* ── Stats ── */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatChip icon={Activity}      label="Total"       value={stats.total}       gradient="from-violet-500 to-indigo-600" />
        <StatChip icon={Clock}         label="Pendientes"  value={stats.pendientes}  gradient="from-amber-400 to-orange-500" />
        <StatChip icon={TriangleAlert} label="Vencidos"    value={stats.vencidos}    gradient="from-rose-500 to-pink-600" />
        <StatChip icon={CheckCircle2}  label="Completados" value={stats.completados} gradient="from-emerald-500 to-teal-600" />
      </div>

      {/* ── Filtros ── */}
      <div className="mb-4 shrink-0 flex flex-wrap items-center gap-2">
        <SearchInput
          placeholder="Buscar paciente, veterinario, tipo…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* Filtro estado */}
        <div className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-1">
          {['todos', ...FOLLOWUP_STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all capitalize ${
                statusFilter === s
                  ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm'
                  : 'text-[var(--text-3)] hover:text-[var(--text)]'
              }`}
            >
              {s === 'todos' ? 'Todos' : s}
            </button>
          ))}
        </div>
        {/* Filtro tipo */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs font-semibold text-[var(--text-2)] outline-none cursor-pointer focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
        >
          <option value="todos">Todos los tipos</option>
          {FOLLOWUP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <span className="ml-auto text-xs text-[var(--text-3)]">{filtered.length} seguimiento{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* ── Lista ── */}
      <div className="flex flex-1 min-h-0 flex-col overflow-y-auto">
        {filtered.length === 0 ? (
          <EmptyState
            hasFilters={search || statusFilter !== 'todos' || typeFilter !== 'todos'}
            onNew={() => setModal({ mode: 'create' })}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered
              .sort((a, b) => {
                // Vencidos primero, luego por fecha ascendente
                if (a._overdue !== b._overdue) return a._overdue ? -1 : 1
                return (a.dueDate ?? '').localeCompare(b.dueDate ?? '')
              })
              .map((fu) => (
                <FollowUpCard
                  key={fu.id}
                  fu={fu}
                  onEdit={() => setModal({ mode: 'edit', data: fu })}
                  onDelete={() => handleDelete(fu)}
                />
              ))
            }
          </div>
        )}
      </div>

      {modal && (
        <FollowUpModal
          key={modal.data?.id ?? modal.mode}
          modal={modal}
          patients={patients}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      <ConfirmDialog />
    </PageContainer>
  )
}

/* ── Subcomponentes locales ── */

function StatChip({ icon: Icon, label, value, gradient }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-4`}>
      <div className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/10" />
      <div className="mb-2 grid h-8 w-8 place-items-center rounded-xl bg-white/20">
        <Icon size={15} className="text-white" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-[11px] font-semibold text-white/75">{label}</p>
    </div>
  )
}

function FollowUpCard({ fu, onEdit, onDelete }) {
  const typeCfg   = TYPE_CFG[fu.type]   ?? TYPE_CFG.Otro
  const statusCfg = STATUS_CFG[fu._displayStatus] ?? STATUS_CFG.Pendiente
  const TypeIcon  = typeCfg.icon
  const dueTxt    = formatDueDate(fu.dueDate)
  const isLate    = fu._overdue

  return (
    <div className={`flex flex-col rounded-2xl border bg-[var(--surface)] p-4 transition-shadow hover:shadow-md ${isLate ? 'border-rose-300 dark:border-rose-500/40' : 'border-[var(--border)]'}`}>
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Avatar paciente */}
          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${getPatientGrad(fu.patientName)} text-sm font-bold text-white shadow-sm`}>
            {fu.patientName?.[0] ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[var(--text)]">{fu.patientName}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeCfg.bg} ${typeCfg.color}`}>
                <TypeIcon size={10} />
                {fu.type}
              </span>
            </div>
          </div>
        </div>
        {/* Acciones */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={onEdit}
            title="Editar"
            className="grid h-7 w-7 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-500/10"
          >
            <Edit3 size={13} />
          </button>
          <button
            onClick={onDelete}
            title="Eliminar"
            className="grid h-7 w-7 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Fecha */}
      <div className={`mb-3 flex items-center gap-2 rounded-xl px-3 py-2 ${isLate ? 'bg-rose-50 dark:bg-rose-500/10' : 'bg-[var(--surface-2)]'}`}>
        <CalendarClock size={14} className={isLate ? 'text-rose-500' : 'text-[var(--text-3)]'} />
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-bold ${isLate ? 'text-rose-600 dark:text-rose-400' : 'text-[var(--text)]'}`}>
            {dueTxt}
            {isLate && ' · Vencido'}
          </p>
          <p className="text-[10px] text-[var(--text-3)]">{fu.dueDate}</p>
        </div>
        {/* Badge estado */}
        <span className={`shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusCfg.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
          {fu._displayStatus}
        </span>
      </div>

      {/* Veterinario */}
      {fu.vet && (
        <div className="flex items-center gap-1.5 mb-2">
          <User size={12} className="shrink-0 text-[var(--text-3)]" />
          <p className="truncate text-xs text-[var(--text-3)]">{fu.vet}</p>
        </div>
      )}

      {/* Notas */}
      {fu.notes && (
        <p className="mt-auto pt-2 text-xs italic text-[var(--text-3)] line-clamp-2 border-t border-[var(--border)]">
          {fu.notes}
        </p>
      )}
    </div>
  )
}

function EmptyState({ hasFilters, onNew }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-500/10 dark:to-indigo-500/10">
        <Activity size={28} className="text-violet-500" />
      </div>
      <div>
        <p className="font-semibold text-[var(--text)]">
          {hasFilters ? 'Sin resultados' : 'Sin seguimientos registrados'}
        </p>
        <p className="mt-1 text-sm text-[var(--text-3)]">
          {hasFilters
            ? 'Prueba con otros filtros o busca por nombre de paciente'
            : 'Crea el primer seguimiento médico para un paciente'}
        </p>
      </div>
      {!hasFilters && (
        <Button variant="primary" onClick={onNew}>
          <Plus size={14} /> Nuevo seguimiento
        </Button>
      )}
    </div>
  )
}
