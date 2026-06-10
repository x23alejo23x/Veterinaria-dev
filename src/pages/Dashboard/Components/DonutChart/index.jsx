/**
 * DonutChart — gráfico de dona SVG con etiquetas % fuera del arco.
 * @param {Array}  servicios — [{monto, color, concepto}]
 * @param {number} size      — tamaño en px (default 220)
 */
export function DonutChart({ servicios, size = 220 }) {
  const total = servicios.reduce((s, d) => s + d.monto, 0)
  const cx = size / 2, cy = size / 2
  const R = size * 0.29, SW = size * 0.10
  const circ = 2 * Math.PI * R

  let cumAngle = -90
  const segments = servicios.map((s) => {
    const frac = s.monto / total
    const sweep = frac * 360
    const midAngle = cumAngle + sweep / 2
    const startA = cumAngle
    cumAngle += sweep
    return { ...s, frac, sweep, startA, midAngle }
  })

  const polar = (angle, r) => ({
    x: cx + r * Math.cos((angle * Math.PI) / 180),
    y: cy + r * Math.sin((angle * Math.PI) / 180),
  })

  const arc = (startA, sweep, r) => {
    const s = polar(startA + 0.5, r)
    const e = polar(startA + sweep - 0.5, r)
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${sweep > 180 ? 1 : 0} 1 ${e.x} ${e.y}`
  }

  const labelR = R + SW / 2 + 22
  const lineInR = R + SW / 2 + 4
  const lineOutR = R + SW / 2 + 16

  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--border)" strokeWidth={SW} />
      {segments.map((s, i) => (
        <path key={i} d={arc(s.startA, s.sweep, R)} fill="none"
          stroke={s.color} strokeWidth={SW} strokeLinecap="round" />
      ))}
      {segments.map((s, i) => {
        const pctVal = Math.round(s.frac * 100)
        const pIn = polar(s.midAngle, lineInR)
        const pOut = polar(s.midAngle, lineOutR)
        const pLbl = polar(s.midAngle, labelR)
        const right = pLbl.x > cx
        return (
          <g key={`lbl-${i}`}>
            <line x1={pIn.x} y1={pIn.y} x2={pOut.x} y2={pOut.y} stroke={s.color} strokeWidth={1.5} />
            <circle cx={pOut.x} cy={pOut.y} r={2.5} fill={s.color} />
            <text x={pLbl.x + (right ? 2 : -2)} y={pLbl.y} fill="var(--text)"
              fontSize={size * 0.058} fontWeight="700"
              textAnchor={right ? 'start' : 'end'} dominantBaseline="middle">
              {pctVal > 0 ? `+${pctVal}%` : `${pctVal}%`}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
