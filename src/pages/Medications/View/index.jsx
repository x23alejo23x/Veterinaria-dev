import { useMemo, useState } from 'react'
import { Calculator, Clock, Edit3, FlaskConical, ListChecks, Pill, Plus, Search, Tag, Trash2 } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { useConfirm } from '@/hooks/useConfirm.jsx'
import { useAppStore } from '@/store/appStore'
import { emptyMed, getCat, fmt } from '@/pages/Medications/constants'
import { MedicationFormModal } from '@/pages/Medications/Components/MedicationFormModal'
import { DoseCalculatorModal } from '@/pages/Medications/Components/DoseCalculatorModal'

/* ── Helpers locales pequeños ── */
const StatCard = ({ label, value, icon: Icon, gradient }) => (
  <div className={`relative overflow-hidden rounded-2xl p-4 ${gradient}`}>
    <div className="pointer-events-none absolute -right-3 -top-3 h-20 w-20 rounded-full bg-white/10" />
    <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 mb-3"><Icon size={17} className="text-white" /></div>
    <p className="text-3xl font-bold text-white">{value}</p>
    <p className="text-xs font-semibold text-white/75 mt-0.5">{label}</p>
  </div>
)

export function MedicationsView() {
  // Store
  const patients      = useAppStore((s) => s.patients)
  const medications   = useAppStore((s) => s.medicationsCatalog)
  const prescriptions = useAppStore((s) => s.prescriptions)
  const search        = useAppStore((s) => s.medicationSearch)
  const setSearch     = useAppStore((s) => s.setMedicationSearch)
  const addMedication    = useAppStore((s) => s.addMedication)
  const updateMedication = useAppStore((s) => s.updateMedication)
  const deleteMedication = useAppStore((s) => s.deleteMedication)
  const addPrescription  = useAppStore((s) => s.addPrescription)
  const { confirm, ConfirmDialog } = useConfirm()

  // State
  const [activeTab, setActiveTab] = useState('catalog')
  const [medModal,  setMedModal]  = useState(null)
  const [calcOpen,  setCalcOpen]  = useState(false)
  const [medForm,   setMedForm]   = useState(emptyMed)
  const [doseForm,  setDoseForm]  = useState({
    patientId: patients[0]?.id ?? '', medicationId: medications[0]?.id ?? '',
    concentration: medications[0]?.concentration ?? 10, weight: patients[0]?.weight ?? 0,
    mgKg: 1, frequency: 12, duration: 5,
  })

  const filtered  = useMemo(() => medications.filter((m) => [m.name, m.category, m.unit].some((v) => v.toLowerCase().includes(search.toLowerCase()))), [medications, search])
  const rxRows    = useMemo(() => prescriptions.map((rx) => ({ ...rx, patient: patients.find((p) => p.id === rx.patientId)?.name ?? '—', medication: medications.find((m) => m.id === rx.medicationId)?.name ?? '—' })), [prescriptions, patients, medications])
  const categories = useMemo(() => [...new Set(medications.map((m) => m.category))].length, [medications])

  const openNew  = () => { setMedForm(emptyMed); setMedModal({ mode: 'create' }) }
  const openEdit = (row) => { setMedForm(row); setMedModal({ mode: 'edit', data: row }) }
  const closeMed = () => setMedModal(null)
  const handleDeleteMed = async (med) => {
    const rxCount = prescriptions.filter((rx) => rx.medicationId === med.id).length
    const ok = await confirm({
      title: `Eliminar ${med.name}`,
      message: rxCount > 0
        ? `Este medicamento tiene ${rxCount} prescripción(es) asociada(s). Se eliminarán también.`
        : 'Esta acción no se puede deshacer.',
      danger: true,
    })
    if (ok) deleteMedication(med.id)
  }

  return (
    <PageContainer eyebrow="Medicaciones" title="Medicamentos" description="Catálogo, calculadora de dosis y prescripciones activas."
      actions={<div className="flex gap-2">
        <Button variant="default" onClick={() => setCalcOpen(true)}><Calculator size={14} /> Calculadora</Button>
        <Button variant="primary" onClick={openNew}><Plus size={14} /> Nuevo medicamento</Button>
      </div>}>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <StatCard icon={Pill}       label="Medicamentos"      value={medications.length}   gradient="bg-gradient-to-br from-blue-500 to-blue-700" />
        <StatCard icon={Tag}        label="Categorías"         value={categories}            gradient="bg-gradient-to-br from-violet-500 to-purple-700" />
        <StatCard icon={ListChecks} label="Prescripciones"     value={prescriptions.length} gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
      </div>

      <div className="flex flex-1 min-h-0 flex-col">
        {/* Tabs */}
        <div className="mb-4 shrink-0 flex items-center gap-1 self-start rounded-xl bg-[var(--surface-2)] p-1 border border-[var(--border)]">
          {[{ id: 'catalog', label: 'Catálogo', count: filtered.length }, { id: 'prescriptions', label: 'Prescripciones', count: rxRows.length }].map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeTab === t.id ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm' : 'text-[var(--text-3)] hover:text-[var(--text)]'}`}>
              {t.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeTab === t.id ? 'bg-white/20 text-white' : 'bg-[var(--border)] text-[var(--text-3)]'}`}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Catálogo */}
        {activeTab === 'catalog' && <CatalogTab filtered={filtered} search={search} setSearch={setSearch} openEdit={openEdit} onDelete={handleDeleteMed} />}

        {/* Prescripciones */}
        {activeTab === 'prescriptions' && <PrescriptionsTab rxRows={rxRows} medications={medications} />}
      </div>

      <MedicationFormModal modal={medModal} medForm={medForm} setMedForm={setMedForm} onClose={closeMed}
        onSave={(data, mode, id) => { mode === 'edit' && id ? updateMedication(id, data) : addMedication(data); closeMed() }} />

      <DoseCalculatorModal isOpen={calcOpen} onClose={() => setCalcOpen(false)} doseForm={doseForm} setDoseForm={setDoseForm}
        patients={patients} medications={medications} onSave={addPrescription} />
      <ConfirmDialog />
    </PageContainer>
  )
}

/* ── Sub-componentes locales (específicos de esta vista) ── */

function CatalogTab({ filtered, search, setSearch, openEdit, onDelete }) {
  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <div className="my-3 shrink-0 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-400/15">
        <Search size={14} className="shrink-0 text-[var(--text-3)]" />
        <input className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-3)]" placeholder="Buscar por nombre, categoría…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--border)]">
        <div className="shrink-0 bg-[var(--surface-2)] border-b border-[var(--border)]">
          <table className="w-full border-collapse text-left" style={{ tableLayout: 'fixed' }}>
            <colgroup><col style={{ width:'35%' }}/><col style={{ width:'20%' }}/><col style={{ width:'25%' }}/><col style={{ width:'20%' }}/></colgroup>
            <thead><tr>{['Medicamento','Concentración','Categoría',''].map((h) => <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-3)]">{h}</th>)}</tr></thead>
          </table>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--surface)]">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <FlaskConical size={28} className="text-[var(--text-3)]" />
              <p className="text-sm text-[var(--text-3)]">Sin medicamentos registrados</p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left" style={{ tableLayout: 'fixed' }}>
              <colgroup><col style={{ width:'35%' }}/><col style={{ width:'20%' }}/><col style={{ width:'25%' }}/><col style={{ width:'20%' }}/></colgroup>
              <tbody>
                {filtered.map((med) => { const c = getCat(med.category); return (
                  <tr key={med.id} className="group border-b border-dashed border-[var(--border)] last:border-0 hover:bg-blue-50/40 dark:hover:bg-blue-500/5">
                    <td className="px-4 py-3.5"><div className="flex items-center gap-3"><div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${c.bg}`}><Pill size={16} className={c.icon} /></div><span className="font-semibold text-[var(--text)]">{med.name}</span></div></td>
                    <td className="px-4 py-3.5 text-sm"><span className="font-semibold text-[var(--text)]">{med.concentration}</span><span className="text-[var(--text-3)]"> {med.unit}</span></td>
                    <td className="px-4 py-3.5"><span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${c.badge}`}>{med.category}</span></td>
                    <td className="px-4 py-3.5"><div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(med)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"><Edit3 size={14} /></button>
                      <button onClick={() => onDelete(med)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"><Trash2 size={14} /></button>
                    </div></td>
                  </tr>
                )})}
              </tbody>
            </table>
          )}
        </div>
        <div className="shrink-0 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-2"><p className="text-xs text-[var(--text-3)]">{filtered.length} medicamento{filtered.length !== 1 ? 's' : ''}</p></div>
      </div>
    </div>
  )
}

function PrescriptionsTab({ rxRows, medications }) {
  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-y-auto pt-1">
      {rxRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16"><Pill size={32} className="text-[var(--text-3)]" /><p className="text-sm text-[var(--text-3)]">Sin prescripciones activas</p></div>
      ) : (
        <div className="space-y-2.5">
          {rxRows.map((rx) => { const c = getCat(medications.find((m) => m.id === rx.medicationId)?.category ?? ''); return (
            <div key={rx.id} className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:bg-[var(--surface-2)]">
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${c.bg}`}><Pill size={17} className={c.icon} /></div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[var(--text)]">{rx.medication}</p>
                <p className="text-xs text-[var(--text-3)]"><span className="font-medium text-[var(--text-2)]">{rx.patient}</span>{' · '}{rx.dose} · {rx.frequency}</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-[var(--text-3)]">
                <div className="flex items-center gap-1"><Clock size={12} />{rx.duration}</div>
                <span>{rx.date}</span>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">{rx.status}</span>
            </div>
          )})}
        </div>
      )}
    </div>
  )
}
