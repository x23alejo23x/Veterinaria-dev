import { useState } from 'react'
import { Save, Lock } from 'lucide-react'

export function NotasPanel({ consulta, onSave }) {
  const isClosed = consulta?.status === 'cerrada'

  const [chiefComplaint, setChiefComplaint] = useState(consulta?.chiefComplaint ?? '')
  const [diagnosis, setDiagnosis] = useState(consulta?.diagnosis ?? '')

  // Sync when consulta data loads after initial render
  const [syncedId, setSyncedId] = useState(null)
  if (consulta?.id && consulta.id !== syncedId) {
    setSyncedId(consulta.id)
    setChiefComplaint(consulta.chiefComplaint ?? '')
    setDiagnosis(consulta.diagnosis ?? '')
  }

  return (
    <div className="flex flex-col gap-5">
      {isClosed && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
          <Lock size={14} /> Consulta cerrada — solo lectura
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-3)]">
          Motivo de consulta
        </label>
        <textarea
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
          disabled={isClosed}
          rows={3}
          placeholder="Describir el motivo principal de la consulta…"
          className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-3)] outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-3)]">
          Diagnóstico
        </label>
        <textarea
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          disabled={isClosed}
          rows={5}
          placeholder="Diagnóstico clínico y observaciones…"
          className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-3)] outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {!isClosed && (
        <div className="flex justify-end">
          <button
            onClick={() => onSave({ chiefComplaint, diagnosis })}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95"
          >
            <Save size={14} /> Guardar notas
          </button>
        </div>
      )}
    </div>
  )
}
