/**
 * ChartLegend — leyenda HTML (fuera del SVG) para que herede tipografía y CSS vars.
 * Siempre presente cuando hay ≥ 2 series; para 1 serie el título del gráfico la nombra.
 *
 * @param {Array}  items — [{ key, label, color }]
 * @param {string} [activeKey] — serie resaltada (las demás se atenúan)
 * @param {function} [onHover] — (key|null) => void
 */
export function ChartLegend({ items = [], activeKey = null, onHover, className = '' }) {
  if (items.length < 2) return null
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 ${className}`}>
      {items.map((it) => {
        const dim = activeKey && activeKey !== it.key
        return (
          <button
            key={it.key}
            type="button"
            onMouseEnter={() => onHover?.(it.key)}
            onMouseLeave={() => onHover?.(null)}
            className={`flex items-center gap-1.5 text-[11px] text-[var(--text-3)] transition-opacity ${dim ? 'opacity-40' : ''}`}
          >
            <span className="inline-block h-2 w-3 rounded-sm" style={{ background: it.color }} />
            {it.label}
          </button>
        )
      })}
    </div>
  )
}
