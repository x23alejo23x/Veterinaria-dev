/**
 * InfoChip — chip de información clínica con icono, etiqueta y valor.
 * @param {Component} icon
 * @param {string}    label
 * @param {string}    value
 */
export function InfoChip({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-2)] px-3 py-2.5">
      <Icon size={14} className="shrink-0 text-[var(--text-3)]" />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)]">{label}</p>
        <p className="text-xs font-semibold text-[var(--text)]">{value || '—'}</p>
      </div>
    </div>
  )
}
