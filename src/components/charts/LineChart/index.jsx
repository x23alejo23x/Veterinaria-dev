import { useState } from 'react'
import {
  Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { ChartTooltip } from '@/components/charts/ChartTooltip'
import { ChartLegend } from '@/components/charts/ChartLegend'
import { axisProps, gridProps, lineCursor, seriesColor, useChartTheme } from '@/components/charts/theme'

/**
 * LineChart — líneas (o área para una sola serie) con crosshair + tooltip.
 *
 * @param {Array}   data      — [{ [xKey]: 'Ene', actual: 2.4, anterior: 2.1 }]
 * @param {string}  xKey
 * @param {Array}   series    — [{ key, label, dashed?, area? }]
 *                              dashed → línea punteada (ej. "año anterior" como contexto)
 *                              area   → rellena bajo la línea (solo recomendable con 1 serie)
 * @param {number}  [height=220]
 * @param {function}[formatter]     — valores en tooltip
 * @param {function}[tickFormatter] — valores del eje Y (default: formatter)
 * @param {boolean} [legend=true]
 */
export function LineChart({ data = [], xKey, series = [], height = 220, formatter, tickFormatter, legend = true, className = '' }) {
  const palette = useChartTheme()
  const [active, setActive] = useState(null)

  const items = series.map((s, i) => ({ ...s, color: s.color ?? seriesColor(palette, i) }))

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              {items.filter((s) => s.area).map((s) => (
                <linearGradient key={s.key} id={`area-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={s.color} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid {...gridProps(palette)} />
            <XAxis dataKey={xKey} {...axisProps(palette)} interval="preserveStartEnd" />
            <YAxis {...axisProps(palette)} tickFormatter={tickFormatter ?? formatter} width={56} />
            <Tooltip
              cursor={lineCursor(palette)}
              content={<ChartTooltip formatter={formatter} />}
              wrapperStyle={{ outline: 'none' }}
            />
            {items.map((s) => {
              const dim = active && active !== s.key
              const common = {
                dataKey: s.key, name: s.label, stroke: s.color,
                strokeWidth: 2, strokeOpacity: dim ? 0.3 : 1,
                strokeDasharray: s.dashed ? '5 4' : undefined,
                dot: false,
                activeDot: { r: 5, strokeWidth: 2, stroke: 'var(--surface)', fill: s.color },
                isAnimationActive: true, animationDuration: 600,
              }
              return s.area
                ? <Area key={s.key} {...common} type="monotone" fill={`url(#area-${s.key})`} fillOpacity={dim ? 0.3 : 1} />
                : <Line key={s.key} {...common} type="monotone" />
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {legend && <ChartLegend items={items} activeKey={active} onHover={setActive} />}
    </div>
  )
}
