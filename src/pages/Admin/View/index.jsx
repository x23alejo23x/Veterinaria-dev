import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Crown, Edit2, LogIn, Plus, Search, Shield, Users } from 'lucide-react'
import { companiesSeed } from '@/constants'
import { notify } from '@/utils/notify'
import { emptyCompany, getGrad, planColor, statusColor } from '@/pages/Admin/constants'
import { UsageBar } from '@/pages/Admin/Components/UsageBar'
import { CreateCompanyModal } from '@/pages/Admin/Components/CreateCompanyModal'
import { EditLimitsModal } from '@/pages/Admin/Components/EditLimitsModal'

const Stat = ({ icon: Icon, label, value, gradient }) => (
  <div className={`relative overflow-hidden rounded-2xl p-4 ${gradient}`}>
    <div className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full bg-white/10" />
    <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 mb-3"><Icon size={17} className="text-white" /></div>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-xs font-medium text-white/70 mt-0.5">{label}</p>
  </div>
)

export function AdminView() {
  const navigate     = useNavigate()
  const [companies,  setCompanies]  = useState(companiesSeed)
  const [search,     setSearch]     = useState('')
  const [modal,      setModal]      = useState(null)
  const [form,       setForm]       = useState(emptyCompany)
  const [limitsForm, setLimitsForm] = useState({ maxPatients: 0, maxUsers: 0 })
  const [entering,   setEntering]   = useState(null)

  const filtered = companies.filter((c) => [c.name, c.owner, c.email, c.city, c.plan, c.status].some((v) => v.toLowerCase().includes(search.toLowerCase())))
  const stats = { total: companies.length, activas: companies.filter((c) => c.status === 'Activa').length, trial: companies.filter((c) => c.status === 'Trial').length, patients: companies.reduce((s, c) => s + c.patients, 0) }

  const handleCreate = (e) => {
    e.preventDefault()
    setCompanies((prev) => [{ ...form, id: form.name.toLowerCase().replace(/\s+/g, '-'), status: 'Trial', patients: 0, users: 1, created: new Date().toISOString().slice(0, 10) }, ...prev])
    notify.success(`Empresa "${form.name}" creada`); setModal(null); setForm(emptyCompany)
  }
  const openLimits   = (c) => { setLimitsForm({ maxPatients: c.maxPatients, maxUsers: c.maxUsers }); setModal({ type: 'limits', company: c }) }
  const handleLimits = (e) => { e.preventDefault(); setCompanies((prev) => prev.map((c) => c.id === modal.company.id ? { ...c, maxPatients: Number(limitsForm.maxPatients), maxUsers: Number(limitsForm.maxUsers) } : c)); notify.success('Límites actualizados'); setModal(null) }
  const handleEnter  = (c) => { setEntering(c.id); setTimeout(() => { setEntering(null); notify.success(`Entrando a ${c.name}…`); navigate('/dashboard') }, 800) }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto px-6 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600">Admin SaaS</p>
          <h1 className="text-2xl font-bold text-[var(--text)]">Panel de empresas</h1>
          <p className="mt-0.5 text-sm text-[var(--text-3)]">Gestiona las clínicas registradas en la plataforma</p>
        </div>
        <button onClick={() => setModal('create')} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:opacity-90">
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
      <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-400/15">
        <Search size={15} className="shrink-0 text-[var(--text-3)]" />
        <input className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-3)]" placeholder="Buscar empresa, propietario, ciudad…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <span className="text-xs text-[var(--text-3)]">{filtered.length} empresa{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
        <div className="border-b border-[var(--border)] bg-[var(--surface-2)]">
          <table className="w-full border-collapse text-left" style={{ tableLayout:'fixed' }}>
            <colgroup><col style={{width:'22%'}}/><col style={{width:'15%'}}/><col style={{width:'9%'}}/><col style={{width:'9%'}}/><col style={{width:'16%'}}/><col style={{width:'16%'}}/><col style={{width:'13%'}}/></colgroup>
            <thead><tr>{['Empresa','Propietario','Plan','Estado','Pacientes','Usuarios',''].map((h) => <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-3)]">{h}</th>)}</tr></thead>
          </table>
        </div>
        <div className="bg-[var(--surface)]">
          <table className="w-full border-collapse text-left" style={{ tableLayout:'fixed' }}>
            <colgroup><col style={{width:'22%'}}/><col style={{width:'15%'}}/><col style={{width:'9%'}}/><col style={{width:'9%'}}/><col style={{width:'16%'}}/><col style={{width:'16%'}}/><col style={{width:'13%'}}/></colgroup>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="group border-b border-dashed border-[var(--border)] last:border-0 hover:bg-blue-50/40 dark:hover:bg-blue-500/5">
                  <td className="px-4 py-3.5"><div className="flex items-center gap-3"><div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${getGrad(c.name)} text-sm font-bold text-white`}>{c.name[0]}</div><div className="min-w-0"><p className="truncate font-semibold text-[var(--text)]">{c.name}</p><p className="truncate text-[10px] text-[var(--text-3)]">{c.city}</p></div></div></td>
                  <td className="px-4 py-3.5 text-sm text-[var(--text-2)]">{c.owner}</td>
                  <td className="px-4 py-3.5"><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${planColor[c.plan] ?? planColor.Básico}`}>{c.plan}</span></td>
                  <td className="px-4 py-3.5"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColor[c.status] ?? statusColor.Activa}`}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />{c.status}</span></td>
                  <td className="px-4 py-3.5"><UsageBar used={c.patients} max={c.maxPatients} color="bg-blue-500" /></td>
                  <td className="px-4 py-3.5"><UsageBar used={c.users} max={c.maxUsers} color="bg-violet-500" /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openLimits(c)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]" title="Editar límites"><Edit2 size={13} /></button>
                      <button onClick={() => handleEnter(c)} disabled={entering === c.id}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${entering === c.id ? 'bg-blue-100 text-blue-400 dark:bg-blue-500/10' : 'bg-blue-50 text-blue-700 hover:bg-gradient-to-br from-violet-600 to-indigo-600 hover:text-white dark:bg-blue-500/10 dark:text-blue-400'}`}>
                        {entering === c.id ? <><span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" /> Entrando…</> : <><LogIn size={12} /> Entrar</>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal === 'create' && <CreateCompanyModal form={form} setForm={setForm} onClose={() => setModal(null)} onSubmit={handleCreate} />}
      {modal?.type === 'limits' && <EditLimitsModal modal={modal} limitsForm={limitsForm} setLimitsForm={setLimitsForm} onClose={() => setModal(null)} onSubmit={handleLimits} />}
    </div>
  )
}
