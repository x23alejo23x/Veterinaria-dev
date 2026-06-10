import { Clock, Edit3, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { gradient, statusTone, typeClass } from '@/pages/Appointments/constants'

/**
 * AppCard — tarjeta de cita reutilizable en vista Lista y panel lateral del día.
 * @param {Object}   apt       — objeto de cita
 * @param {Function} onEdit    — callback al editar
 * @param {Function} onDelete  — callback al eliminar
 * @param {boolean}  compact   — variante compacta (panel lateral)
 */
export function AppCard({ apt, onEdit, onDelete, compact = false }) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition hover:bg-[var(--surface-2)] ${compact ? 'px-3 py-2.5' : 'p-4'}`}>
      <div className={`grid shrink-0 place-items-center rounded-xl bg-gradient-to-br ${gradient(apt.patientName)} font-bold text-white ${compact ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm'}`}>
        {apt.patientName?.[0]}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`font-semibold text-[var(--text)] ${compact ? 'text-xs' : 'text-sm'}`}>{apt.patientName}</p>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold ${compact ? 'text-[10px]' : 'text-[11px]'} ${typeClass[apt.type] ?? typeClass.General}`}>{apt.type}</span>
          <Badge tone={statusTone[apt.status] ?? 'amber'} className={compact ? 'text-[10px]' : ''}>{apt.status}</Badge>
        </div>
        {!compact && <p className="mt-0.5 text-xs text-[var(--text-3)]">{apt.ownerName} · {apt.vet}</p>}
        <div className="flex items-center gap-1 text-[var(--text-3)]">
          <Clock size={11} />
          <span className="text-[10px] font-medium">{apt.time}</span>
          {compact && <span className="text-[10px]">· {apt.vet?.split(' ')[1]}</span>}
        </div>
      </div>
      {!compact && (
        <div className="flex shrink-0 items-center gap-1">
          <button onClick={() => onEdit(apt)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"><Edit3 size={13} /></button>
          <button onClick={() => onDelete(apt)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"><Trash2 size={13} /></button>
        </div>
      )}
    </div>
  )
}
