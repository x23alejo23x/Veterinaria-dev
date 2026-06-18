import { Clock, Edit3, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { gradient, statusTone, typeClass } from '@/pages/Appointments/constants'

/**
 * AppCard — tarjeta de cita.
 * @param {Object}   apt      — objeto de cita
 * @param {Function} onDetail — abre el panel de detalle (click en card body)
 * @param {Function} onEdit   — abre modal de edición (botón edit)
 * @param {Function} onDelete — elimina con confirmación (botón delete)
 * @param {boolean}  compact  — variante compacta (panel lateral del día)
 * @param {boolean}  active   — resalta la tarjeta (detalle abierto)
 */
export function AppCard({ apt, onDetail, onEdit, onDelete, compact = false, active = false }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onDetail}
      onKeyDown={(e) => e.key === 'Enter' && onDetail?.()}
      className={[
        'flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]',
        'transition cursor-pointer select-none',
        compact ? 'px-3 py-2.5' : 'p-4',
        active
          ? 'ring-2 ring-violet-400 bg-violet-50 dark:bg-violet-500/10'
          : 'hover:bg-[var(--surface-2)]',
      ].join(' ')}
    >
      {/* Avatar */}
      <div className={`grid shrink-0 place-items-center rounded-xl bg-gradient-to-br ${gradient(apt.patientName)} font-bold text-white ${compact ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm'}`}>
        {apt.patientName?.[0]}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`font-semibold text-[var(--text)] ${compact ? 'text-xs' : 'text-sm'}`}>{apt.patientName}</p>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold ${compact ? 'text-[10px]' : 'text-[11px]'} ${typeClass[apt.type] ?? typeClass.General}`}>
            {apt.type}
          </span>
          <Badge tone={statusTone[apt.status] ?? 'amber'} className={compact ? 'text-[10px]' : ''}>
            {apt.status}
          </Badge>
        </div>
        {!compact && (
          <p className="mt-0.5 text-xs text-[var(--text-3)]">{apt.ownerName} · {apt.vet}</p>
        )}
        <div className="flex items-center gap-1 text-[var(--text-3)]">
          <Clock size={11} />
          <span className="text-[10px] font-medium">{apt.time}</span>
          {compact && <span className="text-[10px]">· {apt.vet?.split(' ')[1]}</span>}
        </div>
      </div>

      {/* Acciones (solo en modo completo) */}
      {!compact && (
        <div
          className="flex shrink-0 items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit?.(apt)}
            className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            <Edit3 size={13} />
          </button>
          <button
            onClick={() => onDelete?.(apt)}
            className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  )
}
