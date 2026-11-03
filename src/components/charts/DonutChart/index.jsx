import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartTooltip } from '@/components/charts/ChartTooltip'
import { seriesColor, useChartTheme } from '@/components/charts/theme'

/**
 * DonutChart — parte-del-todo con centro libre y leyenda con valores.
 * Máximo 5 segmentos: el resto se agrupa automáticamente en "Otros".
 *
 * @param {Array}    data        — [{ label, value, color? }]
 * @param {number}   [size=200]  — diámetro en px
 * @param {function} [formatter] — formatea el valor (tooltip y leyenda)
 * @param {ReactNode}[center]    — contenido del centro (total, %, etc.)
 * @param {boolean}  [legend=true]
 * @param {'right'|'bottom'} [legendPosition='right']
 */
export function DonutChart({ data = [], size = 200, formatter, center, legend = true, legendPosition = 'right', className = '' }) {
  const palette = useChartTheme()
  const [active, setActive] = useState(null)

  const fmt   = formatter ?? ((v) => v)
  const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0)

  // Cap a 5 segmentos → "Otros"
  const sorted = [...data].sort((a, b) => b.value - a.value)
  const head   = sorted.slice(0, 5)
  const tail   = sorted.slice(5)
  const items  = (tail.length
    ? [...head, { label: 'Otros', value: tail.reduce((s, d) => s + d.value, 0) }]
    : head
  ).map((d, i) => ({ ...d, color: d.color ?? (d.label === 'Otros' ? palette.muted : seriesColor(palette, i)) }))

  const isBottom = legendPosition === 'bottom'
  const pctOf    = (v) => (total ? Math.round((v / total) * 100) : 0)

  return (
    <div className={`flex ${isBottom ? 'flex-col items-center' : 'items-center'} gap-4 ${className}`}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={<ChartTooltip formatter={(v) => `${fmt(v)} · ${pctOf(v)}%`} />}
              wrapperStyle={{ outline: 'none' }}
            />
            <Pie
              data={items}
              dataKey="value"
              nameKey="label"
              cx="50%" cy="50%"
              innerRadius="68%" outerRadius="100%"
              paddingAngle={2}
              cornerRadius={4}
              stroke="var(--surface)"
              strokeWidth={2}
              startAngle={90} endAngle={-270}
              isAnimationActive
              animationDuration={600}
              onMouseEnter={(_, i) => setActive(items[i]?.label)}
              onMouseLeave={() => setActive(null)}
            >
              {items.map((d) => (
                <Cell key={d.label} fill={d.color} fillOpacity={active && active !== d.label ? 0.3 : 1} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {center && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {center}
          </div>
        )}
      </div>

      {legend && (
        <ul className={`min-w-0 ${isBottom ? 'grid w-full grid-cols-2 gap-x-4 gap-y-1.5' : 'flex-1 space-y-1.5'}`}>
          {items.map((d) => {
            const dim = active && active !== d.label
            return (
              <li
                key={d.label}
                onMouseEnter={() => setActive(d.label)}
                onMouseLeave={() => setActive(null)}
                className={`flex items-center justify-between gap-3 text-[11px] transition-opacity ${dim ? 'opacity-40' : ''}`}
              >
                <span className="flex min-w-0 items-center gap-1.5 text-[var(--text-2)]">
                  <span className="inline-block h-2 w-2 shrink-0 rounded-sm" style={{ background: d.color }} />
                  <span className="truncate">{d.label}</span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-[var(--text)]">
                  {fmt(d.value)}
                  <span className="ml-1 font-normal text-[var(--text-3)]">{pctOf(d.value)}%</span>
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
