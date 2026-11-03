import { useState } from 'react'
import {
  Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  BarChart as RBarChart, LabelList,
} from 'recharts'
import { ChartTooltip } from '@/components/charts/ChartTooltip'
import { ChartLegend } from '@/components/charts/ChartLegend'
import { axisProps, barCursor, gridProps, seriesColor, useChartTheme } from '@/components/charts/theme'

/**
 * BarChart — barras verticales agrupadas o apiladas.
 *
 * @param {Array}   data       — [{ [xKey]: 'Lun', citas: 12, altas: 9 }]
 * @param {string}  xKey       — clave de la categoría (eje X)
 * @param {Array}   series     — [{ key: 'citas', label: 'Citas' }] (orden fijo → color fijo)
 * @param {boolean} [stacked]  — apila las series
 * @param {number}  [height=220]
 * @param {function}[formatter]     — formatea valores (tooltip, labels)
 * @param {function}[tickFormatter] — eje Y (default: formatter)
 * @param {boolean} [showLabels] — etiquetas directas sobre las barras (solo ≤ 2 series)
 * @param {boolean} [legend=true]
 * @param {function}[onBarClick] — (entry) => void
 *
 * @example
 *   <BarChart data={visitChart} xKey="day"
 *     series={[{ key: 'citas', label: 'Citas' }, { key: 'altas', label: 'Altas' }]} />
 */
export function BarChart({
  data = [], xKey, series = [], stacked = false, height = 220,
  formatter, tickFormatter, showLabels = false, legend = true, onBarClick, className = '',
}) {
  const palette = useChartTheme()
  const [active, setActive] = useState(null)

  const items = series.map((s, i) => ({ ...s, color: s.color ?? seriesColor(palette, i) }))
  const last  = items[items.length - 1]?.key

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RBarChart data={data} barGap={2} barCategoryGap="28%" margin={{ top: showLabels ? 16 : 6, right: 4, left: -18, bottom: 0 }}>
            <CartesianGrid {...gridProps(palette)} />
            <XAxis dataKey={xKey} {...axisProps(palette)} interval={0} />
            <YAxis {...axisProps(palette)} tickFormatter={tickFormatter ?? formatter} width={56} allowDecimals={false} />
            <Tooltip
              cursor={barCursor}
              content={<ChartTooltip formatter={formatter} showTotal={stacked} />}
              wrapperStyle={{ outline: 'none' }}
            />
            {items.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={s.color}
                fillOpacity={active && active !== s.key ? 0.3 : 1}
                stackId={stacked ? 'stack' : undefined}
                stroke={stacked ? 'var(--surface)' : undefined}
                strokeWidth={stacked ? 2 : 0}
                radius={!stacked || s.key === last ? [4, 4, 0, 0] : 0}
                maxBarSize={40}
                isAnimationActive
                animationDuration={500}
                onClick={onBarClick ? (e) => onBarClick(e?.payload ?? e) : undefined}
                cursor={onBarClick ? 'pointer' : undefined}
              >
                {showLabels && items.length <= 2 && !stacked && (
                  <LabelList dataKey={s.key} position="top" formatter={formatter}
                    style={{ fontSize: 10, fill: 'var(--text-2)', fontWeight: 600 }} />
                )}
              </Bar>
            ))}
          </RBarChart>
        </ResponsiveContainer>
      </div>
      {legend && <ChartLegend items={items} activeKey={active} onHover={setActive} />}
    </div>
  )
}
