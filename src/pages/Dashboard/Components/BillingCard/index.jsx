import { useState } from 'react'
import { Maximize2, Minimize2, TrendingUp } from 'lucide-react'
import { DonutChart } from '@/components/charts/DonutChart'
import { fmtCOP as fmt, fmtCompact } from '@/components/charts/theme'

/**
 * BillingCard — tarjeta de facturación con donut, modo compacto y expandido.
 * @param {Object} mesActual       — { label, total, pagado, pendiente }
 * @param {number} tendencia       — % vs mes anterior
 * @param {Array}  servicios       — [{ concepto, monto, cantidad, color }]
 * @param {Array}  ingresosDiarios — [{ dia, monto }]
 * @param {number} cobrado         — porcentaje cobrado (0-100)
 */
export function BillingCard({ mesActual, tendencia, servicios, ingresosDiarios, cobrado }) {
  const [expanded, setExpanded] = useState(false)
  // Forma que espera DonutChart: [{ label, value, color }]
  const donutData = servicios.map((s) => ({ label: s.concepto, value: s.monto, color: s.color }))

  return (
    <div className={`overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 ${expanded ? 'absolute inset-0 z-20 shadow-2xl' : ''}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-3)]">
          Facturación · {mesActual.label}
        </p>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="grid h-7 w-7 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          title={expanded ? 'Contraer' : 'Expandir'}
        >
          {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      <div className="p-4">
        {!expanded ? (
          <div className="flex flex-col items-center gap-3">
            <DonutChart
              data={donutData}
              size={180}
              legend={false}
              formatter={fmt}
              center={
                <>
                  <p className="text-base font-bold leading-none text-[var(--text)]">{fmt(mesActual.total)}</p>
                  <p className="text-[10px] text-[var(--text-3)]">total</p>
                </>
              }
            />
            <div className="w-full grid grid-cols-3 divide-x divide-[var(--border)] border-t border-[var(--border)] pt-3">
              {[servicios[0], servicios[1]].map((s) => s && (
                <div key={s.concepto} className="flex flex-col items-center gap-1 px-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-[10px] text-[var(--text-3)] truncate">{s.concepto.split(' ')[0]}</span>
                  </div>
                  <p className="text-lg font-bold text-[var(--text)]">{s.cantidad}</p>
                </div>
              ))}
              <div className="flex flex-col items-center gap-1 px-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-[var(--text-3)]">Cobrado</span>
                </div>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{cobrado}%</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 divide-x divide-[var(--border)]">
            <div className="flex flex-col items-center gap-4">
              <DonutChart
                data={donutData}
                size={200}
                legend={false}
                formatter={fmt}
                center={
                  <>
                    <p className="text-base font-bold leading-none text-[var(--text)]">{fmt(mesActual.total)}</p>
                    <p className="text-[10px] text-[var(--text-3)]">facturado</p>
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <TrendingUp size={11} /> +{tendencia}%
                    </div>
                  </>
                }
              />
              <div className="w-full grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2.5 text-center">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{fmt(mesActual.pagado)}</p>
                  <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">cobrado · {cobrado}%</p>
                </div>
                <div className="rounded-xl bg-rose-50 dark:bg-rose-500/10 px-3 py-2.5 text-center">
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{fmt(mesActual.pendiente)}</p>
                  <p className="text-[10px] text-rose-600/70 dark:text-rose-400/70">pendiente</p>
                </div>
              </div>
            </div>
            <div className="pl-5 flex flex-col gap-4">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)]">Servicios</p>
                <div className="grid grid-cols-2 gap-2">
                  {servicios.map((s) => (
                    <div key={s.concepto} className="rounded-xl px-3 py-2.5" style={{ background: `${s.color}18` }}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
                        <span className="text-[10px] font-semibold truncate" style={{ color: s.color }}>{s.concepto}</span>
                      </div>
                      <p className="text-sm font-bold text-[var(--text)]">{fmt(s.monto)}</p>
                      <p className="text-[10px] text-[var(--text-3)]">{s.cantidad} servicios</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-[var(--border)] pt-3">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)]">Ingresos diarios</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {ingresosDiarios.map((d) => {
                    const maxD = Math.max(...ingresosDiarios.map((x) => x.monto))
                    return (
                      <div key={d.dia} className="rounded-xl px-2 py-2.5 text-center"
                        style={{ background: `rgba(37,99,235,${0.08 + (d.monto / maxD) * 0.22})` }}>
                        <p className="text-[10px] font-semibold text-violet-600 dark:text-blue-400">{d.dia}</p>
                        <p className="mt-0.5 text-xs font-bold text-[var(--text)]">{fmtCompact(d.monto)}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
