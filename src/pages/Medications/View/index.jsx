import { useMemo, useState } from 'react'
import { Calculator, Clock, Edit3, FlaskConical, ListChecks, Pill, Plus, Save, Search, Tag, Trash2 } from 'lucide-react'
import { useState as useTabState } from 'react'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Modal } from '../../../components/ui/Modal'
import { Select } from '../../../components/ui/Select'
import { useAppStore } from '../../../store/appStore'
import { calculateDose } from '../../../utils/doseCalculator'

const emptyMed = { name: '', concentration: '', unit: 'mg/ml', category: '' }

const fmt = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

/* Colores por categoría */
const catColor = {
  Gastroprotector:  { bg: 'bg-orange-50 dark:bg-orange-500/10',  icon: 'text-orange-600 dark:text-orange-400',  badge: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' },
  Antibiotico:      { bg: 'bg-blue-50   dark:bg-blue-500/10',    icon: 'text-blue-600   dark:text-blue-400',    badge: 'bg-blue-100   text-blue-700   dark:bg-blue-500/20   dark:text-blue-400'   },
  Antiinflamatorio: { bg: 'bg-rose-50   dark:bg-rose-500/10',    icon: 'text-rose-600   dark:text-rose-400',    badge: 'bg-rose-100   text-rose-700   dark:bg-rose-500/20   dark:text-rose-400'   },
  Anestésico:       { bg: 'bg-violet-50 dark:bg-violet-500/10',  icon: 'text-violet-600 dark:text-violet-400',  badge: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400' },
  Vitamina:         { bg: 'bg-emerald-50 dark:bg-emerald-500/10',icon: 'text-emerald-600 dark:text-emerald-400',badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' },
}
const getCat = (cat) => catColor[cat] ?? { bg: 'bg-slate-50 dark:bg-slate-500/10', icon: 'text-slate-600 dark:text-slate-400', badge: 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400' }

function CountBadge({ children }) {
  return <span className="ml-1 rounded-full bg-[var(--surface-2)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--text-3)]">{children}</span>
}

function StatCard({ label, value, icon: Icon, gradient, iconColor }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg ${gradient}`}>
      <div className="pointer-events-none absolute -right-3 -top-3 h-20 w-20 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-4 right-8 h-16 w-16 rounded-full bg-white/10" />
      <div className="relative flex items-start justify-between mb-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/20">
          <Icon size={17} className="text-white" />
        </div>
      </div>
      <p className="relative text-3xl font-bold text-white">{value}</p>
      <p className="relative text-xs font-semibold text-white/75 mt-0.5">{label}</p>
    </div>
  )
}

export function MedicationsView() {
  const patients      = useAppStore((s) => s.patients)
  const medications   = useAppStore((s) => s.medicationsCatalog)
  const prescriptions = useAppStore((s) => s.prescriptions)
  const search        = useAppStore((s) => s.medicationSearch)
  const setSearch     = useAppStore((s) => s.setMedicationSearch)
  const addMedication    = useAppStore((s) => s.addMedication)
  const updateMedication = useAppStore((s) => s.updateMedication)
  const deleteMedication = useAppStore((s) => s.deleteMedication)
  const addPrescription  = useAppStore((s) => s.addPrescription)

  const [activeTab, setActiveTab] = useTabState('catalog')
  const [medModal, setMedModal]   = useState(null)
  const [calcOpen, setCalcOpen]   = useState(false)
  const [medForm,  setMedForm]    = useState(emptyMed)
  const [doseForm, setDoseForm]   = useState({
    patientId:     patients[0]?.id ?? '',
    medicationId:  medications[0]?.id ?? '',
    concentration: medications[0]?.concentration ?? 10,
    weight:        patients[0]?.weight ?? 0,
    mgKg: 1, frequency: 12, duration: 5,
  })

  const result   = useMemo(() => calculateDose(doseForm), [doseForm])
  const filtered = medications.filter((m) =>
    [m.name, m.category, m.unit].some((v) => v.toLowerCase().includes(search.toLowerCase()))
  )
  const rxRows = prescriptions.map((rx) => ({
    ...rx,
    patient:    patients.find((p) => p.id === rx.patientId)?.name       ?? '—',
    medication: medications.find((m) => m.id === rx.medicationId)?.name ?? '—',
    patientObj: patients.find((p) => p.id === rx.patientId),
  }))

  const categories = [...new Set(medications.map((m) => m.category))].length

  const openNew  = () => { setMedForm(emptyMed);  setMedModal({ mode: 'create' }) }
  const openEdit = (row) => { setMedForm(row);     setMedModal({ mode: 'edit', data: row }) }
  const closeMed = () => setMedModal(null)

  const updateDose = (key) => (e) => {
    const val = e.target.value
    setDoseForm((prev) => {
      if (key === 'patientId')    return { ...prev, patientId: val,    weight:        patients.find((p) => p.id === val)?.weight        ?? prev.weight }
      if (key === 'medicationId') return { ...prev, medicationId: val, concentration: medications.find((m) => m.id === val)?.concentration ?? prev.concentration }
      return { ...prev, [key]: val }
    })
  }

  return (
    <PageContainer
      eyebrow="Medicaciones"
      title="Medicamentos"
      description="Catálogo, calculadora de dosis y prescripciones activas."
      actions={
        <div className="flex gap-2">
          <Button variant="default" onClick={() => setCalcOpen(true)}>
            <Calculator size={14} /> Calculadora
          </Button>
          <Button variant="primary" onClick={openNew}>
            <Plus size={14} /> Nuevo medicamento
          </Button>
        </div>
      }
    >
      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <StatCard icon={Pill}         label="Medicamentos en catálogo" value={medications.length}   gradient="bg-gradient-to-br from-blue-500 to-blue-700" />
        <StatCard icon={Tag}          label="Categorías registradas"   value={categories}            gradient="bg-gradient-to-br from-violet-500 to-purple-700" />
        <StatCard icon={ListChecks}   label="Prescripciones activas"   value={prescriptions.length} gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
      </div>

      <div className="flex flex-1 min-h-0 flex-col">
        {/* Segmented control */}
        <div className="mb-4 shrink-0 flex items-center gap-1 self-start rounded-xl bg-[var(--surface-2)] p-1 border border-[var(--border)]">
          {[
            { id: 'catalog',       label: 'Catálogo',       count: filtered.length },
            { id: 'prescriptions', label: 'Prescripciones', count: rxRows.length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-[var(--text-3)] hover:text-[var(--text)]'
              }`}
            >
              {t.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                activeTab === t.id ? 'bg-white/20 text-white' : 'bg-[var(--border)] text-[var(--text-3)]'
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

          {/* ── Catálogo ── */}
          {activeTab === 'catalog' && <div className="flex flex-1 min-h-0 flex-col">
            <div className="my-3 shrink-0 flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/15">
                <Search size={14} className="shrink-0 text-[var(--text-3)]" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-3)]"
                  placeholder="Buscar por nombre, categoría…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Tabla de medicamentos */}
            <div className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--border)]">
              {/* Header */}
              <div className="shrink-0 bg-[var(--surface-2)] border-b border-[var(--border)]">
                <table className="w-full border-collapse text-left" style={{ tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: '35%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '25%' }} />
                    <col style={{ width: '20%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      {['Medicamento', 'Concentración', 'Categoría', ''].map((h) => (
                        <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-3)]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                </table>
              </div>

              {/* Body */}
              <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--surface)]">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <FlaskConical size={28} className="text-[var(--text-3)]" />
                    <p className="text-sm text-[var(--text-3)]">Sin medicamentos registrados</p>
                  </div>
                ) : (
                  <table className="w-full border-collapse text-left" style={{ tableLayout: 'fixed' }}>
                    <colgroup>
                      <col style={{ width: '35%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '25%' }} />
                      <col style={{ width: '20%' }} />
                    </colgroup>
                    <tbody>
                      {filtered.map((med, i) => {
                        const c = getCat(med.category)
                        return (
                          <tr key={med.id} className="group border-b border-dashed border-[var(--border)] transition-colors last:border-0 hover:bg-blue-50/40 dark:hover:bg-blue-500/5">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${c.bg}`}>
                                  <Pill size={16} className={c.icon} />
                                </div>
                                <span className="font-semibold text-[var(--text)]">{med.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-sm text-[var(--text-2)]">
                              <span className="font-semibold text-[var(--text)]">{med.concentration}</span>
                              <span className="text-[var(--text-3)]"> {med.unit}</span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${c.badge}`}>
                                {med.category}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => openEdit(med)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]">
                                  <Edit3 size={14} />
                                </button>
                                <button onClick={() => deleteMedication(med.id)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Footer count */}
              <div className="shrink-0 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-2">
                <p className="text-xs text-[var(--text-3)]">{filtered.length} medicamento{filtered.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>}

          {/* ── Prescripciones ── */}
          {activeTab === 'prescriptions' && <div className="flex flex-1 min-h-0 flex-col">
            <div className="flex-1 overflow-y-auto pt-1">
              {rxRows.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <Pill size={32} className="text-[var(--text-3)]" />
                  <p className="text-sm text-[var(--text-3)]">Sin prescripciones activas</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {rxRows.map((rx) => {
                    const med = medications.find((m) => m.id === rx.medicationId)
                    const c   = getCat(med?.category ?? '')
                    return (
                      <div key={rx.id} className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:bg-[var(--surface-2)]">
                        {/* Med icon */}
                        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${c.bg}`}>
                          <Pill size={17} className={c.icon} />
                        </div>

                        {/* Medicamento + paciente */}
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[var(--text)]">{rx.medication}</p>
                          <p className="text-xs text-[var(--text-3)]">
                            <span className="font-medium text-[var(--text-2)]">{rx.patient}</span>
                            {' · '}{rx.dose} · {rx.frequency}
                          </p>
                        </div>

                        {/* Detalles */}
                        <div className="hidden sm:flex items-center gap-4 text-xs text-[var(--text-3)]">
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            {rx.duration}
                          </div>
                          <span className="text-[var(--text-3)]">{rx.date}</span>
                        </div>

                        {/* Status */}
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                          {rx.status}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>}
      </div>

      {/* Modal: nuevo/editar medicamento */}
      {medModal && (
        <Modal isOpen onClose={closeMed} title={medModal.mode === 'edit' ? 'Editar medicamento' : 'Nuevo medicamento'} maxWidth="max-w-md">
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); medModal.mode === 'edit' ? updateMedication(medModal.data.id, medForm) : addMedication(medForm); closeMed() }}>
            <Input placeholder="Nombre *"      value={medForm.name}          onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}          required />
            <Input placeholder="Categoría *"   value={medForm.category}      onChange={(e) => setMedForm({ ...medForm, category: e.target.value })}      required />
            <Input type="number" step="0.01" placeholder="Concentración *"   value={medForm.concentration} onChange={(e) => setMedForm({ ...medForm, concentration: e.target.value })} required />
            <Select options={['mg/ml', 'mg/tableta', 'capsula', 'UI/ml']} value={medForm.unit} onChange={(e) => setMedForm({ ...medForm, unit: e.target.value })} placeholder="Unidad" />
            <div className="flex justify-end gap-2 sm:col-span-2">
              <Button variant="ghost" type="button" onClick={closeMed}>Cancelar</Button>
              <Button variant="primary" type="submit">{medModal.mode === 'edit' ? 'Actualizar' : 'Agregar'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: calculadora */}
      <Modal isOpen={calcOpen} onClose={() => setCalcOpen(false)} title="Calculadora de dosis" maxWidth="max-w-lg">
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Select options={patients.map((p) => ({ value: p.id, label: `${p.name} · ${p.weight}kg` }))} value={doseForm.patientId} onChange={updateDose('patientId')} placeholder="Paciente" />
            <Select options={medications.map((m) => ({ value: m.id, label: m.name }))} value={doseForm.medicationId} onChange={updateDose('medicationId')} placeholder="Medicamento" />
            <Input type="number" placeholder="Concentración (mg/ml)" value={doseForm.concentration} onChange={updateDose('concentration')} />
            <Input type="number" placeholder="Peso (kg)"             value={doseForm.weight}        onChange={updateDose('weight')} />
            <Input type="number" placeholder="Dosis (mg/kg)"         value={doseForm.mgKg}          onChange={updateDose('mgKg')} />
            <Input icon={<Clock size={13} className="text-[var(--text-3)]" />} type="number" placeholder="Frecuencia (h)" value={doseForm.frequency} onChange={updateDose('frequency')} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[['mg/dosis', result.doseMg], ['ml/toma', result.amountMl], ['tomas/día', result.dailyTakes], ['ml total', result.totalMl]].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-[var(--surface-2)] p-3 text-center">
                <p className="text-lg font-bold text-[var(--text)]">{v}</p>
                <p className="text-[10px] text-[var(--text-3)]">{l}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCalcOpen(false)}>Cerrar</Button>
            <Button variant="primary" onClick={() => { addPrescription({ patientId: doseForm.patientId, medicationId: doseForm.medicationId, dose: `${result.amountMl} ml`, frequency: `cada ${doseForm.frequency} h`, duration: `${doseForm.duration} días`, date: new Date().toLocaleDateString('es-CO') }); setCalcOpen(false) }}>
              <Save size={14} /> Guardar prescripción
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  )
}
