/**
 * ChartTooltip — tooltip unificado para todos los gráficos.
 * Recharts lo invoca con { active, payload, label }.
 *
 * @param {function} [formatter]  — (value, key, entry) => string
 * @param {function} [labelFormatter] — (label) => string
 * @param {boolean}  [showTotal]  — muestra la suma de las series (útil en apilados)
 */
export function ChartTooltip({ active, payload, label, formatter, labelFormatter, showTotal = false }) {
  if (!active || !payload?.length) return null

  const rows  = payload.filter((p) => p.value !== undefined && p.value !== null)
  const total = rows.reduce((s, p) => s + (Number(p.value) || 0), 0)
  const fmt   = formatter ?? ((v) => v)

  return (
    <div className="pointer-events-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 shadow-[var(--shadow-lg)]">
      {label !== undefined && (
        <p className="mb-1.5 text-[11px] font-semibold text-[var(--text)]">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}
      <div className="space-y-1">
        {rows.map((p) => (
          <div key={p.dataKey ?? p.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-sm" style={{ background: p.color ?? p.payload?.fill }} />
              <span className="text-[11px] text-[var(--text-2)]">{p.name}</span>
            </div>
            <span className="text-[11px] font-semibold tabular-nums text-[var(--text)]">
              {fmt(p.value, p.dataKey, p)}
            </span>
          </div>
        ))}
        {showTotal && rows.length > 1 && (
          <div className="mt-1 flex items-center justify-between gap-4 border-t border-[var(--border)] pt-1">
            <span className="text-[11px] text-[var(--text-3)]">Total</span>
            <span className="text-[11px] font-bold tabular-nums text-[var(--text)]">{fmt(total, 'total')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
