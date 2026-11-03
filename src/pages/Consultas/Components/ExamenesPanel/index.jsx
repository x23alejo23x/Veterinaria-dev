import { useState } from 'react'
import { FlaskConical, Plus, Trash2, Edit3, Check, X, Lock } from 'lucide-react'
import { useConfirm } from '@/hooks/useConfirm.jsx'
import { useConsultaExams, useAddExam, useUpdateExam, useDeleteExam, useExamCatalog } from '@/pages/Consultas/services'

const fmtCOP = (val) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val ?? 0)

function ExamForm({ catalogo = [], onConfirm, onCancel, initial = null }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [unitPrice, setUnitPrice] = useState(initial?.unitPrice ?? initial?.unit_price ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [useCatalog, setUseCatalog] = useState(false)

  const applyFromCatalog = (item) => {
    setName(item.name)
    setCategory(item.category ?? '')
    setUnitPrice(item.base_price ?? item.basePrice ?? '')
    setUseCatalog(false)
  }

  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4 dark:border-violet-500/20 dark:bg-violet-500/5">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del examen *"
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
          />
          <button
            type="button"
            onClick={() => setUseCatalog((v) => !v)}
            className="rounded-lg border border-violet-300 px-3 py-2 text-xs font-semibold text-violet-600 hover:bg-violet-100 dark:border-violet-500/30 dark:text-violet-400 dark:hover:bg-violet-500/10 transition"
          >
            Catálogo
          </button>
        </div>

        {useCatalog && catalogo.length > 0 && (
          <div className="max-h-36 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--surface)]">
            {catalogo.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => applyFromCatalog(item)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-[var(--surface-2)] transition"
              >
                <span className="font-medium text-[var(--text)]">{item.name}</span>
                <span className="text-xs text-[var(--text-3)]">{fmtCOP(item.base_price ?? item.basePrice)}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Categoría (opcional)"
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
          />
          <input
            type="number"
            min="0"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            placeholder="Precio *"
            className="w-32 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
          />
        </div>

        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas (opcional)"
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] hover:bg-[var(--surface-2)] transition"><X size={14} /></button>
          <button
            type="button"
            disabled={!name || !unitPrice}
            onClick={() => onConfirm({ name, category, unitPrice: Number(unitPrice), notes })}
            className="grid h-8 w-8 place-items-center rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition disabled:opacity-40"
          >
            <Check size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function ExamenesPanel({ consulta, refetch }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const { confirm, ConfirmDialog } = useConfirm()
  const isClosed = consulta?.status === 'cerrada'

  const { data: examsData, refetch: refetchExams } = useConsultaExams(consulta?.id)
  const exams = examsData?.items ?? []

  const { data: catalogData } = useExamCatalog()
  const catalogo = catalogData?.items ?? []

  const { add } = useAddExam(consulta?.id, { onSuccess: () => { refetchExams(); refetch?.() } })
  const { update } = useUpdateExam(consulta?.id, { onSuccess: () => { refetchExams(); refetch?.() } })
  const { remove } = useDeleteExam(consulta?.id, { onSuccess: () => { refetchExams(); refetch?.() } })

  const handleDelete = async (exam) => {
    const ok = await confirm({ title: 'Eliminar examen', message: `¿Eliminar "${exam.name}"?`, danger: true })
    if (ok) remove(exam.id)
  }

  return (
    <div className="flex flex-col gap-4">
      {isClosed && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
          <Lock size={14} /> Consulta cerrada — solo lectura
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--text-3)]">{exams.length} examen{exams.length !== 1 ? 'es' : ''}</p>
        {!isClosed && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <Plus size={13} /> Agregar examen
          </button>
        )}
      </div>

      {showForm && (
        <ExamForm
          catalogo={catalogo}
          onConfirm={(data) => { add(data); setShowForm(false) }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {exams.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <FlaskConical size={28} className="text-[var(--text-3)]" />
          <p className="text-sm text-[var(--text-3)]">Sin exámenes registrados</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {exams.map((exam) => (
            <div key={exam.id}>
              {editingId === exam.id ? (
                <ExamForm
                  catalogo={catalogo}
                  initial={exam}
                  onConfirm={(data) => { update(exam.id, data); setEditingId(null) }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                    <FlaskConical size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--text)]">{exam.name}</p>
                    {exam.category && <p className="text-xs text-[var(--text-3)]">{exam.category}</p>}
                  </div>
                  <span className="shrink-0 text-sm font-bold text-[var(--text)]">{fmtCOP(exam.unitPrice ?? exam.unit_price)}</span>
                  {!isClosed && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditingId(exam.id)} className="grid h-7 w-7 place-items-center rounded-lg text-[var(--text-3)] hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition"><Edit3 size={13} /></button>
                      <button onClick={() => handleDelete(exam)} className="grid h-7 w-7 place-items-center rounded-lg text-[var(--text-3)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 size={13} /></button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog />
    </div>
  )
}
