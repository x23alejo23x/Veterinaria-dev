import { FileText } from 'lucide-react'

const fmtCOP = (val) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val ?? 0)

export function CobrosPanel({ consulta, prescriptions = [], exams = [], hospitalization = null, onPrint }) {
  const totalMeds = prescriptions.reduce((sum, rx) => sum + Number(rx.unitPrice ?? rx.unit_price ?? 0), 0)
  const totalExams = exams.reduce((sum, ex) => sum + Number(ex.unitPrice ?? ex.unit_price ?? 0), 0)
  const totalHosp = Number(hospitalization?.total ?? 0)
  const total = Number(consulta?.baseFee ?? 0) + totalMeds + totalExams + totalHosp

  const rows = [
    { label: 'Consulta base', value: consulta?.baseFee ?? 0 },
    { label: `Medicamentos (${prescriptions.length})`, value: totalMeds },
    { label: `Exámenes (${exams.length})`, value: totalExams },
    { label: 'Hospitalización', value: totalHosp },
  ]

  const isClosed = consulta?.status === 'cerrada'

  return (
    <div className="flex flex-col gap-0 border-r border-[var(--border)] bg-[var(--surface-2)] w-64 shrink-0">
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-3)]">Resumen de cobros</p>
      </div>

      <div className="flex flex-col gap-0 flex-1 overflow-y-auto">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] last:border-0">
            <span className="text-xs text-[var(--text-3)]">{label}</span>
            <span className="text-xs font-semibold text-[var(--text)]">{fmtCOP(value)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--border)] px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-[var(--text)]">Total</span>
          <span className="text-sm font-black text-violet-600 dark:text-violet-400">{fmtCOP(total)}</span>
        </div>
        <button
          onClick={onPrint}
          disabled={!isClosed}
          title={!isClosed ? 'Disponible cuando la consulta esté cerrada' : 'Descargar PDF'}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FileText size={13} /> Descargar PDF
        </button>
      </div>
    </div>
  )
}
