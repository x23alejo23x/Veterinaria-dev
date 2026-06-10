import { X } from 'lucide-react'
import { UsageBar } from '@/pages/Admin/Components/UsageBar'

/**
 * EditLimitsModal — modal para editar límites de pacientes/usuarios de una empresa.
 * @param {Object}   modal      — { type: 'limits', company }
 * @param {Object}   limitsForm — { maxPatients, maxUsers }
 * @param {Function} setLimitsForm
 * @param {Function} onClose
 * @param {Function} onSubmit   — callback(e) al guardar
 */
export function EditLimitsModal({ modal, limitsForm, setLimitsForm, onClose, onSubmit }) {
  const inputCls = 'w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-violet-400'
  const c = modal.company

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 className="font-semibold text-[var(--text)]">Límites — {c.name}</h2>
            <p className="text-xs text-[var(--text-3)]">{c.plan}</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] hover:bg-[var(--surface-2)]"><X size={16} /></button>
        </div>
        <form className="p-5 space-y-4" onSubmit={onSubmit}>
          {/* Pacientes */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-[var(--text)]">Pacientes</label>
              <span className="text-xs text-[var(--text-3)]">{c.patients} usados</span>
            </div>
            <input type="number" min={c.patients || 1} className={inputCls} value={limitsForm.maxPatients}
              onChange={(e) => setLimitsForm((f) => ({ ...f, maxPatients: e.target.value }))} />
            <div className="mt-2"><UsageBar used={c.patients} max={Number(limitsForm.maxPatients) || 1} color="bg-blue-500" /></div>
            <div className="mt-2 flex gap-1.5">
              {[10, 20, 50, 100, 200].map((n) => (
                <button key={n} type="button" onClick={() => setLimitsForm((f) => ({ ...f, maxPatients: n }))}
                  className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition ${Number(limitsForm.maxPatients) === n ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white' : 'bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--border)]'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Usuarios */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-[var(--text)]">Usuarios</label>
              <span className="text-xs text-[var(--text-3)]">{c.users} usados</span>
            </div>
            <input type="number" min={c.users || 1} className={inputCls} value={limitsForm.maxUsers}
              onChange={(e) => setLimitsForm((f) => ({ ...f, maxUsers: e.target.value }))} />
            <div className="mt-2"><UsageBar used={c.users} max={Number(limitsForm.maxUsers) || 1} color="bg-violet-500" /></div>
            <div className="mt-2 flex gap-1.5">
              {[2, 3, 5, 10, 25].map((n) => (
                <button key={n} type="button" onClick={() => setLimitsForm((f) => ({ ...f, maxUsers: n }))}
                  className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition ${Number(limitsForm.maxUsers) === n ? 'bg-violet-600 text-white' : 'bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--border)]'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-2)] hover:bg-[var(--surface-2)]">Cancelar</button>
            <button type="submit" className="rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white">Guardar límites</button>
          </div>
        </form>
      </div>
    </div>
  )
}
