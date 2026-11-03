import { useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { visitChart } from '@/constants'
import { BarChart } from '@/components/charts/BarChart'
import { fmtInt } from '@/components/charts/theme'

const SERIES = [
  { key: 'citas', label: 'Citas atendidas' },
  { key: 'altas', label: 'Altas médicas' },
]

/**
 * ActivityChart — citas vs. altas por día de la semana.
 * @param {Array} [data=visitChart] — [{ day, citas, altas }]
 */
export function ActivityChart({ data = visitChart }) {
  const [expanded, setExpanded] = useState(false)

  const total      = data.reduce((s, d) => s + d.citas, 0)
  const totalAltas = data.reduce((s, d) => s + d.altas, 0)
  const avgCitas   = data.length ? Math.round(total / data.length) : 0
  const avgAltas   = data.length ? Math.round(totalAltas / data.length) : 0
  const tasaAlta   = total ? Math.round((totalAltas / total) * 100) : 0

  const pills = [
    { label: 'Total citas',        value: total,      color: 'text-violet-600 dark:text-violet-400',   bg: 'bg-violet-50 dark:bg-violet-500/10' },
    { label: 'Total altas',        value: totalAltas, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Prom. diario citas', value: avgCitas,   color: 'text-violet-600 dark:text-violet-400',   bg: 'bg-violet-50 dark:bg-violet-500/10' },
    { label: 'Prom. diario altas', value: avgAltas,   color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  ]

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--text)]">Actividad semanal</p>
          <p className="mt-0.5 text-xs text-[var(--text-3)]">Lun — Sáb · semana actual</p>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs text-[var(--text-2)] transition-colors hover:bg-[var(--border)]"
        >
          {expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          {expanded ? 'Contraer' : 'Expandir'}
        </button>
      </div>

      {/* Stat pills */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {pills.map((s) => (
          <div key={s.label} className={`rounded-xl ${s.bg} px-3 py-2.5`}>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-0.5 text-[10px] leading-tight text-[var(--text-3)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <BarChart
        data={data}
        xKey="day"
        series={SERIES}
        height={expanded ? 240 : 160}
        formatter={fmtInt}
        showLabels={expanded}
      />

      {expanded && (
        <>
          <p className="mt-3 border-t border-[var(--border)] pt-3 text-right text-[10px] text-[var(--text-3)]">
            Tasa de alta:{' '}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{tasaAlta}%</span>
          </p>

          {/* Vista tabla — misma información, accesible */}
          <div className="mt-3 overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[var(--surface-2)]">
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-3)]">Día</th>
                  <th className="px-4 py-2.5 text-right font-semibold text-[var(--text-3)]">Citas</th>
                  <th className="px-4 py-2.5 text-right font-semibold text-[var(--text-3)]">Altas</th>
                  <th className="px-4 py-2.5 text-right font-semibold text-[var(--text-3)]">Tasa alta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {data.map((d) => (
                  <tr key={d.day} className="transition-colors hover:bg-[var(--surface-2)]">
                    <td className="px-4 py-2.5 font-medium text-[var(--text)]">{d.day}</td>
                    <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-[var(--text)]">{d.citas}</td>
                    <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-[var(--text)]">{d.altas}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-[var(--text-2)]">
                      {d.citas ? Math.round((d.altas / d.citas) * 100) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
