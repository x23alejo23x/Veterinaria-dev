import { SearchX } from 'lucide-react'

export function EmptyState({ title = 'Sin resultados', description = 'Ajusta los filtros para ver más información.' }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--border)] p-8 text-center">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--surface-2)] text-[var(--text-3)]">
        <SearchX size={18} />
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
        <p className="mt-1 text-xs text-[var(--text-3)]">{description}</p>
      </div>
    </div>
  )
}
