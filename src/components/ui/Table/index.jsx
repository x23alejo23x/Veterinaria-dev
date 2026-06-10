import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react'
import { TableSkeleton } from '@/components/feedback/Skeleton'

export function Table({ columns, rows, pageSize = 10, loading = false }) {
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ col: null, dir: 'asc' })

  if (loading) return <TableSkeleton rows={pageSize} cols={columns.length} />

  /* ── Sort ── */
  const sorted = sort.col
    ? [...rows].sort((a, b) => {
        const v1 = String(a[sort.col] ?? '')
        const v2 = String(b[sort.col] ?? '')
        return sort.dir === 'asc' ? v1.localeCompare(v2) : v2.localeCompare(v1)
      })
    : rows

  /* ── Paginate ── */
  const total     = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage  = Math.min(page, total)
  const slice     = sorted.slice((safePage - 1) * pageSize, safePage * pageSize)
  const padRows   = Math.max(0, pageSize - slice.length)

  const toggleSort = (key) => {
    if (!key) return
    setSort((s) => s.col === key ? { col: key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col: key, dir: 'asc' })
  }

  const pageNums = Array.from({ length: total }, (_, i) => i + 1)
    .filter((n) => n === 1 || n === total || Math.abs(n - safePage) <= 1)
    .reduce((acc, n, i, arr) => { if (i > 0 && n - arr[i-1] > 1) acc.push('…'); acc.push(n); return acc }, [])

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--border)]">
      {/* Header sticky */}
      <div className="shrink-0 bg-[var(--surface-2)]">
        <table className="w-full border-collapse text-left" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            {columns.map((col) => (
              <col key={col.key} style={{ width: col.width ?? 'auto' }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-[var(--border)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && toggleSort(col.key)}
                  className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-3)] ${col.sortable ? 'cursor-pointer select-none hover:text-[var(--text)]' : ''} ${col.align === 'right' ? 'text-right' : ''}`}
                >
                  <div className={`flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : ''}`}>
                    {col.label}
                    {col.sortable && <ChevronsUpDown size={12} className="opacity-40" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* Body scrollable — overflow-x en mobile */}
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto bg-[var(--surface)]">
        <table className="w-full border-collapse text-left" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            {columns.map((col) => (
              <col key={col.key} style={{ width: col.width ?? 'auto' }} />
            ))}
          </colgroup>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-sm text-[var(--text-3)]">
                  Sin registros
                </td>
              </tr>
            ) : (
              <>
                {slice.map((row, i) => (
                  <tr
                    key={row.id ?? row.name ?? i}
                    className="group border-b border-dashed border-[var(--border)] transition-colors last:border-0 hover:bg-blue-50/40 dark:hover:bg-blue-500/5"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-sm text-[var(--text-2)] ${col.align === 'right' ? 'text-right' : ''}`}
                      >
                        {col.render ? col.render(row) : (row[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Filas vacías */}
                {slice.length > 0 && Array.from({ length: padRows }).map((_, i) => (
                  <tr key={`pad-${i}`} className="border-b border-dashed border-[var(--border)] last:border-0">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-sm">&nbsp;</td>
                    ))}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="shrink-0 flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface)] px-4 py-2">
        <p className="text-xs text-[var(--text-3)]">
          {sorted.length === 0 ? 'Sin registros' : `${(safePage-1)*pageSize+1}–${Math.min(safePage*pageSize, sorted.length)} de ${sorted.length}`}
        </p>
        {total > 1 && (
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1,p-1))} disabled={safePage===1}
              className="grid h-7 w-7 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] disabled:opacity-30">
              <ChevronLeft size={14} />
            </button>
            {pageNums.map((n,i) => n==='…'
              ? <span key={`e${i}`} className="px-1 text-xs text-[var(--text-3)]">…</span>
              : <button key={n} onClick={() => setPage(n)}
                  className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-semibold transition ${n===safePage ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white' : 'text-[var(--text-2)] hover:bg-[var(--surface-2)]'}`}>
                  {n}
                </button>
            )}
            <button onClick={() => setPage((p) => Math.min(total,p+1))} disabled={safePage===total}
              className="grid h-7 w-7 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] disabled:opacity-30">
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
