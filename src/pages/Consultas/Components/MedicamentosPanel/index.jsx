import { useState } from 'react'
import { Pill, Plus, Trash2, Edit3, Lock } from 'lucide-react'
import { useConfirm } from '@/hooks/useConfirm.jsx'
import { useMutation } from '@/hooks/useFetch'
import { toPrescriptionPayload } from '@/pages/Medications/services'
import { PrescriptionModal } from '@/pages/PatientProfile/Components/PrescriptionModal'

export function MedicamentosPanel({ consulta, prescriptions = [], medications = [], refetch }) {
  const [rxModal, setRxModal] = useState(null)
  const { confirm, ConfirmDialog } = useConfirm()
  const isClosed = consulta?.status === 'cerrada'

  const { mutate: _createRx }  = useMutation('POST', '/prescriptions', { successMsg: 'Prescripción guardada', onSuccess: () => refetch() })
  const { mutate: _updateRx }  = useMutation('PUT', '/prescriptions',  { successMsg: 'Prescripción actualizada', onSuccess: () => refetch() })
  const { mutate: _deleteRx }  = useMutation('DELETE', '/prescriptions', { successMsg: 'Prescripción eliminada', onSuccess: () => refetch() })

  const handleSave = (data, mode, rxId) => {
    const payload = toPrescriptionPayload({ ...data, patientId: consulta.patientId, consultaId: consulta.id })
    if (mode === 'edit' && rxId) _updateRx({ ...payload, consulta_id: consulta.id }, `/prescriptions/${rxId}`)
    else _createRx({ ...payload, consulta_id: consulta.id })
    setRxModal(null)
  }

  const handleDelete = async (item, medName) => {
    const ok = await confirm({ title: 'Eliminar prescripción', message: `¿Eliminar la prescripción de ${medName}?`, danger: true })
    if (ok) _deleteRx(null, `/prescriptions/${item.id}`)
  }

  return (
    <div className="flex flex-col gap-4">
      {isClosed && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
          <Lock size={14} /> Consulta cerrada — solo lectura
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--text-3)]">
          {prescriptions.length} prescripción{prescriptions.length !== 1 ? 'es' : ''} en esta consulta
        </p>
        {!isClosed && (
          <button
            onClick={() => setRxModal({ mode: 'create' })}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <Plus size={13} /> Nueva prescripción
          </button>
        )}
      </div>

      {prescriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <Pill size={28} className="text-[var(--text-3)]" />
          <p className="text-sm text-[var(--text-3)]">Sin prescripciones en esta consulta</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {prescriptions.map((item) => {
            const med = medications.find((m) => m.id === (item.medicationId ?? item.medication_id))
            return (
              <div key={item.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10">
                    <Pill size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[var(--text)] truncate">{med?.name ?? '—'}</p>
                    <p className="text-xs text-[var(--text-3)]">{item.dose} · {item.frequency}</p>
                  </div>
                  {!isClosed && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => setRxModal({ mode: 'edit', prescription: item })} className="grid h-7 w-7 place-items-center rounded-lg text-[var(--text-3)] hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition">
                        <Edit3 size={13} />
                      </button>
                      <button onClick={() => handleDelete(item, med?.name ?? '—')} className="grid h-7 w-7 place-items-center rounded-lg text-[var(--text-3)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
                {item.notes && <p className="text-xs italic text-[var(--text-3)]">{item.notes}</p>}
              </div>
            )
          })}
        </div>
      )}

      {rxModal && (
        <PrescriptionModal
          prescription={rxModal.mode === 'edit' ? rxModal.prescription : undefined}
          patient={{ id: consulta.patientId, name: '' }}
          medications={medications}
          onClose={() => setRxModal(null)}
          onSave={handleSave}
        />
      )}
      <ConfirmDialog />
    </div>
  )
}
