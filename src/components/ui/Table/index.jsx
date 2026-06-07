export function Table({ columns, rows }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/75 shadow-[0_10px_36px_rgba(20,51,80,0.08)] backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-slate-50/90">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="border-b border-slate-200 px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id ?? row.name} className="transition hover:bg-blue-50/40">
                {columns.map((column) => (
                  <td key={column.key} className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
