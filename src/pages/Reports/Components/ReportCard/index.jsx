import { Skeleton } from '@/components/feedback/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

/**
 * ReportCard — contenedor común de cada reporte: título, subtítulo,
 * acciones opcionales y estados loading / vacío / error.
 *
 * @param {string}    title
 * @param {string}    [subtitle]
 * @param {ReactNode} [actions]
 * @param {boolean}   [loading]
 * @param {string}    [error]
 * @param {boolean}   [empty]
 * @param {number}    [skeletonHeight=220]
 */
export function ReportCard({ title, subtitle, actions, loading, error, empty, skeletonHeight = 220, children, className = '' }) {
  return (
    <section className={`flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] ${className}`}>
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[var(--text)]">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-[var(--text-3)]">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </header>

      {loading ? (
        <div style={{ height: skeletonHeight }}><Skeleton className="h-full w-full" /></div>
      ) : error ? (
        <EmptyState title="No se pudo cargar" description={error} />
      ) : empty ? (
        <EmptyState title="Sin datos en este rango" description="Amplía el rango de fechas para ver información." />
      ) : (
        children
      )}
    </section>
  )
}
