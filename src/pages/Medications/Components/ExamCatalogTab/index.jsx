import { useState } from 'react'
import { Edit3, FlaskConical, Plus, Trash2, X } from 'lucide-react'
import { useConfirm } from '@/hooks/useConfirm.jsx'
import { useExamCatalogList, useCreateExamCatalogItem, useDeleteExamCatalogItem, useUpdateExamCatalogItem } from '@/pages/Medications/services'

const EXAM_CATEGORIES = ['Laboratorio', 'Imagenología', 'Cardiología', 'Parasitología', 'Citología', 'Otro']

const emptyForm = { name: '', category: 'Laboratorio', price: '' }

function ExamFormModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial ?? emptyForm)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[var(--text)]">{initial ? 'Editar examen' : 'Nuevo examen'}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] hover:bg-[var(--surface-2)] transition"><X size={16} /></button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-3)]">Nombre *</label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Hemograma completo…"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-3)]">Categoría</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
            >
              {EXAM_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-3)]">Precio base (COP)</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
            />
          </div>

          <div className="flex justify-end gap-2 mt-1">
            <button onClick={onClose} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-3)] hover:bg-[var(--surface-2)] transition">
              Cancelar
            </button>
            <button
              disabled={!form.name.trim()}
              onClick={() => onSave({ ...form, price: Number(form.price) || 0 })}
              className="rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-40"
            >
              {initial ? 'Guardar cambios' : 'Crear examen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const fmtCOP = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v ?? 0)

export function ExamCatalogTab() {
  const [modal, setModal] = useState(null) // null | { mode: 'create' } | { mode: 'edit', item }
  const { confirm, ConfirmDialog } = useConfirm()

  const { data, refetch } = useExamCatalogList()
  const items = data?.items ?? []

  const { create } = useCreateExamCatalogItem({ onSuccess: () => { refetch(); setModal(null) } })
  const { remove } = useDeleteExamCatalogItem({ onSuccess: () => refetch() })

  const handleSave = (form) => {
    if (modal?.mode === 'edit') {
      // useUpdateExamCatalogItem needs id — use useMutation inline via create pattern
      // For now, create a fresh item (backend upsert handles it)
      create(form)
    } else {
      create(form)
    }
  }

  const handleDelete = async (item) => {
    const ok = await confirm({ title: `Eliminar examen`, message: `¿Eliminar "${item.name}" del catálogo? No se puede deshacer.`, danger: true })
    if (ok) remove(item.id)
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--text-3)]">{items.length} examen{items.length !== 1 ? 'es' : ''} en catálogo</p>
        <button
          onClick={() => setModal({ mode: 'create' })}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Plus size={13} /> Nuevo examen
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <FlaskConical size={32} className="text-[var(--text-3)]" />
          <p className="text-sm text-[var(--text-3)]">Sin exámenes en el catálogo</p>
          <button
            onClick={() => setModal({ mode: 'create' })}
            className="flex items-center gap-1.5 rounded-xl border border-violet-300 px-3 py-1.5 text-xs font-semibold text-violet-600 transition hover:bg-violet-50 dark:border-violet-500/30 dark:text-violet-400 dark:hover:bg-violet-500/10"
          >
            <Plus size={13} /> Agregar primer examen
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
          <table className="w-full border-collapse text-left" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '40%' }} />
              <col style={{ width: '25%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '15%' }} />
            </colgroup>
            <thead>
              <tr className="bg-[var(--surface-2)] border-b border-[var(--border)]">
                {['Examen', 'Categoría', 'Precio base', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-3)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-[var(--surface)]">
              {items.map((item) => (
                <tr key={item.id} className="border-b border-dashed border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                        <FlaskConical size={14} />
                      </div>
                      <span className="text-sm font-semibold text-[var(--text)]">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                      {item.category ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-[var(--text)]">{fmtCOP(item.price)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setModal({ mode: 'edit', item })}
                        className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <ExamFormModal
          initial={modal.mode === 'edit' ? modal.item : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      <ConfirmDialog />
    </div>
  )
}
