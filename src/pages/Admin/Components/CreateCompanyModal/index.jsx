import { X } from 'lucide-react'

/**
 * CreateCompanyModal — formulario de nueva empresa.
 * @param {Object}   form      — estado del formulario
 * @param {Function} setForm   — actualizador
 * @param {Function} onClose
 * @param {Function} onSubmit  — callback(e) al enviar
 */
export function CreateCompanyModal({ form, setForm, onClose, onSubmit }) {
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const inputCls = 'rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-violet-400 placeholder:text-[var(--text-3)]'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-semibold text-[var(--text)]">Nueva empresa</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] hover:bg-[var(--surface-2)]"><X size={16} /></button>
        </div>
        <form className="p-5 space-y-3" onSubmit={onSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={`col-span-2 ${inputCls}`} placeholder="Nombre de la empresa *" value={form.name}  onChange={set('name')}  required />
            <input className={inputCls}                  placeholder="Propietario *"           value={form.owner} onChange={set('owner')} required />
            <input className={inputCls}                  placeholder="Ciudad"                  value={form.city}  onChange={set('city')} />
            <input type="email" className={`col-span-2 ${inputCls}`} placeholder="Email *"    value={form.email} onChange={set('email')} required />
            <select className={`${inputCls} dark:[color-scheme:dark]`} value={form.plan} onChange={set('plan')}>
              <option>Básico</option><option>Pro</option><option>Enterprise</option>
            </select>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)] pt-1">Límites iniciales</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-[var(--text-3)]">Máx. pacientes</label>
              <input type="number" min="1" className={`w-full ${inputCls}`} value={form.maxPatients} onChange={(e) => setForm((f) => ({ ...f, maxPatients: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-[var(--text-3)]">Máx. usuarios</label>
              <input type="number" min="1" className={`w-full ${inputCls}`} value={form.maxUsers} onChange={(e) => setForm((f) => ({ ...f, maxUsers: Number(e.target.value) }))} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-2)] hover:bg-[var(--surface-2)]">Cancelar</button>
            <button type="submit" className="rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white">Crear empresa</button>
          </div>
        </form>
      </div>
    </div>
  )
}
