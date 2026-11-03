import { Bar, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart as RBarChart } from 'recharts'
import { ChartTooltip } from '@/components/charts/ChartTooltip'
import { barCursor, useChartTheme } from '@/components/charts/theme'

/**
 * HBarChart — ranking horizontal de una sola medida (top N).
 * Un solo tono (la magnitud ya la da la longitud). Opción `emphasis` para
 * resaltar un elemento y atenuar el resto.
 *
 * @param {Array}    data        — [{ label, value }] (se ordena desc automáticamente)
 * @param {number}   [max=8]     — cuántos mostrar
 * @param {function} [formatter]
 * @param {string}   [emphasis]  — label a resaltar
 * @param {string}   [tone='primary'] — 'primary' | 'good' | 'warning' | 'serious'
 * @param {number}   [rowHeight=30]
 * @param {function} [onBarClick]
 */
export function HBarChart({ data = [], max = 8, formatter, emphasis, tone = 'primary', rowHeight = 30, onBarClick, className = '' }) {
  const palette = useChartTheme()
  const rows  = [...data].sort((a, b) => b.value - a.value).slice(0, max)
  const color = tone === 'primary' ? palette.categorical[0] : (palette.status[tone] ?? palette.categorical[0])
  const fmt   = formatter ?? ((v) => v)

  return (
    <div className={className} style={{ height: rows.length * rowHeight + 8 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart data={rows} layout="vertical" margin={{ top: 0, right: 64, left: 0, bottom: 0 }} barCategoryGap="30%">
          <XAxis type="number" hide />
          <YAxis
            type="category" dataKey="label" width={130}
            axisLine={false} tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--text-2)' }}
            interval={0}
          />
          <Tooltip cursor={barCursor} content={<ChartTooltip formatter={fmt} />} wrapperStyle={{ outline: 'none' }} />
          <Bar
            dataKey="value" name="Valor" radius={[0, 4, 4, 0]} maxBarSize={18}
            isAnimationActive animationDuration={500}
            onClick={onBarClick ? (e) => onBarClick(e?.payload ?? e) : undefined}
            cursor={onBarClick ? 'pointer' : undefined}
          >
            {rows.map((r) => (
              <Cell key={r.label} fill={emphasis && emphasis !== r.label ? palette.muted : color} />
            ))}
            <LabelList dataKey="value" position="right" formatter={fmt}
              style={{ fontSize: 11, fill: 'var(--text-2)', fontWeight: 600 }} />
          </Bar>
        </RBarChart>
      </ResponsiveContainer>
    </div>
  )
}
