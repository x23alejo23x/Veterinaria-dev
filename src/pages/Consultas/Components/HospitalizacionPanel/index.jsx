import { useState } from 'react'
import { Hotel, Trash2, Lock } from 'lucide-react'
import { useConfirm } from '@/hooks/useConfirm.jsx'
import { useHospitalization, useUpsertHospitalization, useDeleteHospitalization } from '@/pages/Consultas/services'

const fmtCOP = (val) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val ?? 0)

export function HospitalizacionPanel({ consulta, refetch }) {
  const { confirm, ConfirmDialog } = useConfirm()
  const isClosed = consulta?.status === 'cerrada'

  const { data: hosp, refetch: refetchHosp } = useHospitalization(consulta?.id)
  const { upsert } = useUpsertHospitalization(consulta?.id, { onSuccess: () => { refetchHosp(); refetch?.() } })
  const { remove } = useDeleteHospitalization(consulta?.id, { onSuccess: () => { refetchHosp(); refetch?.() } })

  const [days, setDays] = useState('')
  const [pricePerDay, setPricePerDay] = useState('')
  const [notes, setNotes] = useState('')

  // Sync from backend when loaded
  const [syncedHosp, setSyncedHosp] = useState(null)
  if (hosp && hosp !== syncedHosp) {
    setSyncedHosp(hosp)
    setDays(String(hosp.days ?? ''))
    setPricePerDay(String(hosp.price_per_day ?? hosp.pricePerDay ?? ''))
    setNotes(hosp.notes ?? '')
  }

  const total = (Number(days) || 0) * (Number(pricePerDay) || 0)

  const handleDelete = async () => {
    const ok = await confirm({ title: 'Eliminar hospitalización', message: '¿Eliminar los datos de hospitalización?', danger: true })
    if (ok) remove()
  }

  return (
    <div className="flex flex-col gap-4">
      {isClosed && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
          <Lock size={14} /> Consulta cerrada — solo lectura
        </div>
      )}

      <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <Hotel size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--text)]">Hospitalización</p>
          <p className="text-xs text-[var(--text-3)]">
            {hosp ? `${hosp.days} día${hosp.days !== 1 ? 's' : ''} · ${fmtCOP(hosp.price_per_day ?? hosp.pricePerDay)}/día` : 'Sin hospitalización registrada'}
          </p>
        </div>
        {hosp && !isClosed && (
          <button onClick={handleDelete} className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {!isClosed && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-3)]">
            {hosp ? 'Actualizar hospitalización' : 'Registrar hospitalización'}
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs font-semibold text-[var(--text-3)]">Días *</label>
                <input
                  type="number"
                  min="1"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="1"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs font-semibold text-[var(--text-3)]">Precio por día *</label>
                <input
                  type="number"
                  min="0"
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
                />
              </div>
            </div>

            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas (opcional)"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
            />

            {(days || pricePerDay) && (
              <div className="flex items-center justify-between rounded-lg bg-[var(--surface-2)] px-4 py-2.5">
                <span className="text-xs font-semibold text-[var(--text-3)]">Total hospitalización</span>
                <span className="text-sm font-black text-violet-600 dark:text-violet-400">{fmtCOP(total)}</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                disabled={!days || !pricePerDay}
                onClick={() => upsert({ days: Number(days), pricePerDay: Number(pricePerDay), notes })}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95 disabled:opacity-40"
              >
                {hosp ? 'Actualizar' : 'Guardar'} hospitalización
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog />
    </div>
  )
}
