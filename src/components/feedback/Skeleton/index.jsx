export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-lg bg-[var(--surface-2)] ${className}`} />
  )
}

export function TableSkeleton({ rows = 6, cols = 5 }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]">
      {/* Header */}
      <div className="border-b border-dashed border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
        <div className="flex gap-6">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-2.5 flex-1" />
          ))}
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 border-b border-dashed border-[var(--border)] px-4 py-3.5 last:border-0">
          <Skeleton className="h-8 w-8 shrink-0 rounded-xl" />
          {Array.from({ length: cols - 1 }).map((_, c) => (
            <Skeleton key={c} className={`h-2.5 flex-1 ${c === 0 ? 'max-w-[140px]' : c === cols - 2 ? 'max-w-[64px]' : ''}`} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function PageSkeleton({ rows = 6, cols = 5 }) {
  return (
    <div className="mx-auto w-full max-w-[1360px] animate-pulse px-5 py-7">
      <div className="mb-6 flex items-start justify-between">
        <div className="space-y-2.5">
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-2.5 w-72" />
        </div>
        <Skeleton className="h-9 w-36 rounded-xl" />
      </div>
      <TableSkeleton rows={rows} cols={cols} />
    </div>
  )
}
