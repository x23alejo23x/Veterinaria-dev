/**
 * UsageBar — barra de uso con color de advertencia al 90%.
 * @param {number} used
 * @param {number} max
 * @param {string} color — clase Tailwind del color activo (ej. "bg-blue-500")
 */
export function UsageBar({ used, max, color }) {
  const pct  = max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 0
  const warn = pct >= 90
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
        <div className={`h-full rounded-full transition-all ${warn ? 'bg-rose-500' : color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`shrink-0 text-[10px] font-semibold ${warn ? 'text-rose-500' : 'text-[var(--text-3)]'}`}>{used}/{max}</span>
    </div>
  )
}
