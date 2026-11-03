import { ClipboardList } from 'lucide-react'
import { STATUS_CFG } from '@/pages/Consultas/constants'

export function ConsultasList({ consultas = [], onOpen }) {
  if (consultas.length === 0) return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <ClipboardList size={32} className="text-[var(--text-3)]" />
      <p className="text-sm text-[var(--text-3)]">Sin consultas registradas</p>
    </div>
  )

  return (
    <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
      <table className="w-full border-collapse text-left" style={{ tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '22%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '23%' }} />
        </colgroup>
        <thead>
          <tr className="bg-[var(--surface-2)] border-b border-[var(--border)]">
            {['Paciente', 'Veterinario', 'Estado', 'Fecha apertura', ''].map((h) => (
              <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-3)]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[var(--surface)]">
          {consultas.map((c) => {
            const cfg = STATUS_CFG[c.status] ?? STATUS_CFG.abierta
            return (
              <tr
                key={c.id}
                onClick={() => onOpen(c.id)}
                className="border-b border-dashed border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] cursor-pointer transition-colors"
              >
                <td className="px-4 py-3.5 text-sm font-semibold text-[var(--text)] truncate">
                  {c.patientName ?? `Paciente #${c.patientId}`}
                </td>
                <td className="px-4 py-3.5 text-sm text-[var(--text-3)] truncate">{c.vet}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm text-[var(--text-3)]">
                  {c.openedAt ? new Date(c.openedAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </td>
                <td className="px-4 py-3.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpen(c.id) }}
                    className="rounded-xl border border-violet-300 px-3 py-1.5 text-xs font-semibold text-violet-600 transition hover:bg-violet-50 dark:border-violet-500/30 dark:text-violet-400 dark:hover:bg-violet-500/10"
                  >
                    Abrir
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
