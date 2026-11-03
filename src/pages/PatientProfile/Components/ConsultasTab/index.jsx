import { Stethoscope, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { STATUS_CFG } from '@/pages/Consultas/constants'

export function ConsultasTab({ patientId, consultas = [], onCreate }) {
  const navigate = useNavigate()

  const sorted = [...consultas].sort((a, b) => {
    const da = new Date(a.openedAt ?? 0)
    const db = new Date(b.openedAt ?? 0)
    return db - da
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--text-3)]">
          {sorted.length} consulta{sorted.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={onCreate}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Plus size={13} /> Nueva consulta
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <Stethoscope size={32} className="text-[var(--text-3)]" />
          <p className="text-sm text-[var(--text-3)]">Sin consultas registradas</p>
          <button
            onClick={onCreate}
            className="flex items-center gap-1.5 rounded-xl border border-violet-300 px-3 py-1.5 text-xs font-semibold text-violet-600 transition hover:bg-violet-50 dark:border-violet-500/30 dark:text-violet-400 dark:hover:bg-violet-500/10"
          >
            <Plus size={13} /> Crear primera consulta
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {sorted.map((c) => {
            const cfg = STATUS_CFG[c.status] ?? STATUS_CFG.abierta
            return (
              <div
                key={c.id}
                className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 transition hover:bg-[var(--surface)] cursor-pointer"
                onClick={() => navigate(`/consultas/${c.id}`)}
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                  <Stethoscope size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--text)]">
                    {c.chiefComplaint ? (c.chiefComplaint.length > 60 ? c.chiefComplaint.slice(0, 60) + '…' : c.chiefComplaint) : 'Sin motivo registrado'}
                  </p>
                  <p className="text-xs text-[var(--text-3)] mt-0.5">
                    {c.vet}
                    {c.openedAt && ` · ${new Date(c.openedAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}`}
                  </p>
                </div>
                <span className={`shrink-0 flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
