import { X, RefreshCw, Stethoscope } from 'lucide-react'
import { STATUS_CFG } from '@/pages/Consultas/constants'

export function ConsultaHeader({ consulta, patient, onClose, onReopen, userRole }) {
  if (!consulta) return null

  const cfg = STATUS_CFG[consulta.status] ?? STATUS_CFG.abierta
  const isClosed = consulta.status === 'cerrada'

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4 shrink-0">
      <div className="flex items-center gap-4 min-w-0">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
          <Stethoscope size={20} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-bold text-[var(--text)] truncate">
              {patient?.name ?? 'Cargando…'}
            </h1>
            {patient?.species && (
              <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[11px] font-semibold text-[var(--text-3)]">
                {patient.species}
              </span>
            )}
            <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-[var(--text-3)]">
            Dr/a. {consulta.vet}
            {consulta.openedAt && (
              <> · Abierta {new Date(consulta.openedAt).toLocaleString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {!isClosed && (
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95"
          >
            <X size={14} /> Cerrar consulta
          </button>
        )}
        {isClosed && userRole === 'admin' && (
          <button
            onClick={onReopen}
            className="flex items-center gap-1.5 rounded-xl border border-amber-400 px-4 py-2 text-sm font-semibold text-amber-600 transition hover:bg-amber-50 dark:border-amber-500/40 dark:text-amber-400 dark:hover:bg-amber-500/10"
          >
            <RefreshCw size={14} /> Reabrir
          </button>
        )}
      </div>
    </div>
  )
}
