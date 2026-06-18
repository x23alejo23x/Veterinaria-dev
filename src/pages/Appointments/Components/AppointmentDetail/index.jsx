import { Calendar, ChevronLeft, Clock, Edit3, FileText, Stethoscope, Trash2, User } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { fmtDate, gradient, statusTone, typeClass } from '@/pages/Appointments/constants'

/**
 * AppointmentDetail — panel de detalle de una cita.
 * @param {Object}    apt      — objeto de cita
 * @param {Function}  onEdit   — abre modal de edición
 * @param {Function}  onDelete — elimina con confirmación
 * @param {Function}  onBack   — vuelve al listado (panel mes)
 * @param {Function}  onClose  — cierra el panel lateral (semana/lista)
 */
export function AppointmentDetail({ apt, onEdit, onDelete, onBack, onClose }) {
  return (
    <div className="flex flex-col h-full">
      {/* Sub-header (solo en panel mes, cuando viene de lista) */}
      {onBack && (
        <div className="px-4 pt-3 pb-1">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold text-[var(--text-3)] hover:text-[var(--text)] transition"
          >
            <ChevronLeft size={13} /> Volver a citas del día
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4 p-4 flex-1 overflow-y-auto">
        {/* Avatar + nombre + badges */}
        <div className="flex items-start gap-3">
          <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${gradient(apt.patientName)} text-lg font-bold text-white shadow-md`}>
            {apt.patientName?.[0]}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[var(--text)] text-base leading-tight">{apt.patientName}</p>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${typeClass[apt.type] ?? typeClass.General}`}>
                {apt.type}
              </span>
              <Badge tone={statusTone[apt.status] ?? 'amber'}>{apt.status}</Badge>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[var(--text-3)] hover:bg-[var(--surface-2)] transition"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filas de detalle */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] divide-y divide-[var(--border)] overflow-hidden">
          <Row icon={<Calendar size={13} />} label="Fecha"       value={fmtDate(apt.date)} />
          <Row icon={<Clock size={13} />}    label="Hora"        value={apt.time} />
          <Row icon={<User size={13} />}     label="Propietario" value={apt.ownerName || '—'} />
          <Row icon={<Stethoscope size={13} />} label="Veterinario" value={apt.vet} />
          {apt.notes && <Row icon={<FileText size={13} />} label="Notas" value={apt.notes} multiline />}
        </div>
      </div>

      {/* Acciones */}
      <div className="border-t border-[var(--border)] p-3 flex gap-2 shrink-0">
        <Button variant="primary" className="flex-1" onClick={() => onEdit(apt)}>
          <Edit3 size={13} /> Editar
        </Button>
        <Button variant="danger" onClick={() => onDelete(apt)}>
          <Trash2 size={13} />
        </Button>
      </div>
    </div>
  )
}

function Row({ icon, label, value, multiline }) {
  return (
    <div className={`flex gap-3 px-3 py-2.5 ${multiline ? 'items-start' : 'items-center'}`}>
      <span className="text-[var(--text-3)] shrink-0 mt-0.5">{icon}</span>
      <span className="text-[11px] font-semibold text-[var(--text-3)] w-20 shrink-0">{label}</span>
      <span className={`text-xs text-[var(--text)] flex-1 ${multiline ? 'leading-relaxed' : ''}`}>{value}</span>
    </div>
  )
}
