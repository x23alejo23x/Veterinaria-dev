import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2, Crown, Edit2, LogIn, Plus,
  Search, Shield, Users, X,
} from 'lucide-react'
import { companiesSeed } from '../../../constants'
import { notify } from '../../../utils/notify'

/* ── Helpers ── */
const planColor = {
  Básico:     'bg-slate-100  text-slate-700  dark:bg-slate-500/15  dark:text-slate-300',
  Pro:        'bg-blue-100   text-blue-700   dark:bg-blue-500/15   dark:text-blue-300',
  Enterprise: 'bg-amber-100  text-amber-700  dark:bg-amber-500/15  dark:text-amber-300',
}
const statusColor = {
  Activa:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  Trial:    'bg-violet-100  text-violet-700  dark:bg-violet-500/15  dark:text-violet-300',
  Inactiva: 'bg-rose-100    text-rose-700    dark:bg-rose-500/15    dark:text-rose-300',
}
const gradients = [
  'from-blue-500 to-blue-700', 'from-violet-500 to-purple-700',
  'from-emerald-500 to-teal-600', 'from-rose-400 to-pink-600',
  'from-amber-400 to-orange-500', 'from-sky-400 to-cyan-600',
]
const getGrad = (name) => gradients[(name.charCodeAt(0) - 65) % gradients.length]

/* ── Mini barra de uso ── */
function UsageBar({ used, max, color }) {
  const pct = max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 0
  const warn = pct >= 90
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
        <div
          className={`h-full rounded-full transition-all ${warn ? 'bg-rose-500' : color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`shrink-0 text-[10px] font-semibold ${warn ? 'text-rose-500' : 'text-[var(--text-3)]'}`}>
        {used}/{max}
      </span>
    </div>
  )
}

/* ── Stat card ── */
function Stat({ icon: Icon, label, value, gradient }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 ${gradient}`}>
      <div className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/10" />
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 mb-3">
        <Icon size={17} className="text-white" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs font-medium text-white/70 mt-0.5">{label}</p>
    </div>
  )
}

const emptyCompany = { name: '', owner: '', email: '', city: '', plan: 'Básico', maxPatients: 20, maxUsers: 3 }

export function AdminView() {
  const navigate   = useNavigate()
  const [companies, setCompanies] = useState(companiesSeed)
  const [search,    setSearch]    = useState('')
  const [modal,     setModal]     = useState(null)   // null | 'create' | { type:'limits', company }
  const [form,      setForm]      = useState(emptyCompany)
  const [limitsForm, setLimitsForm] = useState({ maxPatients: 0, maxUsers: 0 })
  const [entering,  setEntering]  = useState(null)

  const filtered = companies.filter((c) =>
    [c.name, c.owner, c.email, c.city, c.plan, c.status].some((v) =>
      v.toLowerCase().includes(search.toLowerCase())
    )
  )

  const stats = {
    total:    companies.length,
    activas:  companies.filter((c) => c.status === 'Activa').length,
    trial:    companies.filter((c) => c.status === 'Trial').length,
    patients: companies.reduce((s, c) => s + c.patients, 0),
  }

  const handleCreate = (e) => {
    e.preventDefault()
    setCompanies((prev) => [{
      ...form,
      id:      form.name.toLowerCase().replace(/\s+/g, '-'),
      status:  'Trial',
      patients: 0,
      users:   1,
      created: new Date().toISOString().slice(0, 10),
    }, ...prev])
    notify.success(`Empresa "${form.name}" creada`)
    setModal(null)
    setForm(emptyCompany)
  }

  const openLimits = (c) => {
    setLimitsForm({ maxPatients: c.maxPatients, maxUsers: c.maxUsers })
    setModal({ type: 'limits', company: c })
  }

  const handleSaveLimits = (e) => {
    e.preventDefault()
    setCompanies((prev) => prev.map((c) =>
      c.id === modal.company.id
        ? { ...c, maxPatients: Number(limitsForm.maxPatients), maxUsers: Number(limitsForm.maxUsers) }
        : c
    ))
    notify.success('Límites actualizados')
    setModal(null)
  }

  const handleEnter = (company) => {
    setEntering(company.id)
    setTimeout(() => {
      setEntering(null)
      notify.success(`Entrando a ${company.name}…`)
      navigate('/dashboard')
    }, 800)
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto px-6 py-6 space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">Admin SaaS</p>
          <h1 className="text-2xl font-bold text-[var(--text)]">Panel de empresas</h1>
          <p className="mt-0.5 text-sm text-[var(--text-3)]">Gestiona las clínicas registradas en la plataforma</p>
        </div>
        <button onClick={() => setModal('create')}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
          <Plus size={15} /> Nueva empresa
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Stat icon={Building2} label="Empresas totales" value={stats.total}    gradient="bg-gradient-to-br from-blue-500 to-blue-700" />
        <Stat icon={Shield}    label="Activas"           value={stats.activas}  gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
        <Stat icon={Crown}     label="En trial"          value={stats.trial}    gradient="bg-gradient-to-br from-violet-500 to-purple-700" />
        <Stat icon={Users}     label="Pacientes totales" value={stats.patients} gradient="bg-gradient-to-br from-rose-400 to-pink-600" />
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/15">
        <Search size={15} className="shrink-0 text-[var(--text-3)]" />
        <input className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-3)]"
          placeholder="Buscar empresa, propietario, ciudad…"
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <span className="text-xs text-[var(--text-3)]">{filtered.length} empresa{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
        <div className="border-b border-[var(--border)] bg-[var(--surface-2)]">
          <table className="w-full border-collapse text-left" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '22%' }} /><col style={{ width: '15%' }} />
              <col style={{ width: '9%'  }} /><col style={{ width: '9%'  }} />
              <col style={{ width: '16%' }} /><col style={{ width: '16%' }} />
              <col style={{ width: '13%' }} />
            </colgroup>
            <thead>
              <tr>
                {['Empresa','Propietario','Plan','Estado','Pacientes','Usuarios',''].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-3)]">{h}</th>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        <div className="bg-[var(--surface)]">
          <table className="w-full border-collapse text-left" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '22%' }} /><col style={{ width: '15%' }} />
              <col style={{ width: '9%'  }} /><col style={{ width: '9%'  }} />
              <col style={{ width: '16%' }} /><col style={{ width: '16%' }} />
              <col style={{ width: '13%' }} />
            </colgroup>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="group border-b border-dashed border-[var(--border)] transition last:border-0 hover:bg-blue-50/40 dark:hover:bg-blue-500/5">

                  {/* Empresa */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${getGrad(c.name)} text-sm font-bold text-white`}>
                        {c.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[var(--text)]">{c.name}</p>
                        <p className="truncate text-[10px] text-[var(--text-3)]">{c.city}</p>
                      </div>
                    </div>
                  </td>

                  {/* Propietario */}
                  <td className="px-4 py-3.5 text-sm text-[var(--text-2)]">{c.owner}</td>

                  {/* Plan */}
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${planColor[c.plan] ?? planColor.Básico}`}>
                      {c.plan}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[c.status] ?? statusColor.Activa}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                      {c.status}
                    </span>
                  </td>

                  {/* Pacientes con barra */}
                  <td className="px-4 py-3.5">
                    <UsageBar used={c.patients} max={c.maxPatients} color="bg-blue-500" />
                  </td>

                  {/* Usuarios con barra */}
                  <td className="px-4 py-3.5">
                    <UsageBar used={c.users} max={c.maxUsers} color="bg-violet-500" />
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openLimits(c)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                        title="Editar límites">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => handleEnter(c)} disabled={entering === c.id}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                          entering === c.id
                            ? 'bg-blue-100 text-blue-400 dark:bg-blue-500/10'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white'
                        }`}>
                        {entering === c.id
                          ? <><span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" /> Entrando…</>
                          : <><LogIn size={12} /> Entrar</>
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: nueva empresa */}
      {modal === 'create' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <h2 className="font-semibold text-[var(--text)]">Nueva empresa</h2>
              <button onClick={() => setModal(null)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] hover:bg-[var(--surface-2)]"><X size={16} /></button>
            </div>
            <form className="p-5 space-y-3" onSubmit={handleCreate}>
              <div className="grid gap-3 sm:grid-cols-2">
                <input className="col-span-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-blue-400 placeholder:text-[var(--text-3)]" placeholder="Nombre de la empresa *" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
                <input className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-blue-400 placeholder:text-[var(--text-3)]" placeholder="Propietario *" value={form.owner} onChange={(e) => setForm({...form, owner: e.target.value})} required />
                <input className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-blue-400 placeholder:text-[var(--text-3)]" placeholder="Ciudad" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} />
                <input type="email" className="col-span-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-blue-400 placeholder:text-[var(--text-3)]" placeholder="Email *" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
                <select className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none dark:[color-scheme:dark]" value={form.plan} onChange={(e) => setForm({...form, plan: e.target.value})}>
                  <option>Básico</option><option>Pro</option><option>Enterprise</option>
                </select>
              </div>

              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)] pt-1">Límites iniciales</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-[var(--text-3)]">Máx. pacientes</label>
                  <input type="number" min="1" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-blue-400" value={form.maxPatients} onChange={(e) => setForm({...form, maxPatients: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-[var(--text-3)]">Máx. usuarios</label>
                  <input type="number" min="1" className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-blue-400" value={form.maxUsers} onChange={(e) => setForm({...form, maxUsers: Number(e.target.value)})} />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setModal(null)} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-2)] hover:bg-[var(--surface-2)]">Cancelar</button>
                <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Crear empresa</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: editar límites */}
      {modal?.type === 'limits' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <div>
                <h2 className="font-semibold text-[var(--text)]">Límites — {modal.company.name}</h2>
                <p className="text-xs text-[var(--text-3)]">{modal.company.plan}</p>
              </div>
              <button onClick={() => setModal(null)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] hover:bg-[var(--surface-2)]"><X size={16} /></button>
            </div>
            <form className="p-5 space-y-4" onSubmit={handleSaveLimits}>
              {/* Pacientes */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-[var(--text)]">Pacientes</label>
                  <span className="text-xs text-[var(--text-3)]">{modal.company.patients} usados</span>
                </div>
                <input type="number" min={modal.company.patients || 1}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-blue-400"
                  value={limitsForm.maxPatients}
                  onChange={(e) => setLimitsForm({...limitsForm, maxPatients: e.target.value})} />
                <div className="mt-2">
                  <UsageBar used={modal.company.patients} max={Number(limitsForm.maxPatients) || 1} color="bg-blue-500" />
                </div>
                {/* Quick presets */}
                <div className="mt-2 flex gap-1.5">
                  {[10, 20, 50, 100, 200].map((n) => (
                    <button key={n} type="button" onClick={() => setLimitsForm({...limitsForm, maxPatients: n})}
                      className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition ${Number(limitsForm.maxPatients) === n ? 'bg-blue-600 text-white' : 'bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--border)]'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Usuarios */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-[var(--text)]">Usuarios</label>
                  <span className="text-xs text-[var(--text-3)]">{modal.company.users} usados</span>
                </div>
                <input type="number" min={modal.company.users || 1}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-blue-400"
                  value={limitsForm.maxUsers}
                  onChange={(e) => setLimitsForm({...limitsForm, maxUsers: e.target.value})} />
                <div className="mt-2">
                  <UsageBar used={modal.company.users} max={Number(limitsForm.maxUsers) || 1} color="bg-violet-500" />
                </div>
                {/* Quick presets */}
                <div className="mt-2 flex gap-1.5">
                  {[2, 3, 5, 10, 25].map((n) => (
                    <button key={n} type="button" onClick={() => setLimitsForm({...limitsForm, maxUsers: n})}
                      className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition ${Number(limitsForm.maxUsers) === n ? 'bg-violet-600 text-white' : 'bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--border)]'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setModal(null)} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-2)] hover:bg-[var(--surface-2)]">Cancelar</button>
                <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Guardar límites</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
