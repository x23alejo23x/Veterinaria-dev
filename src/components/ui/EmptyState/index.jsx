import { SearchX } from 'lucide-react'
import { Card } from '../Card'

export function EmptyState({ title = 'Sin resultados', description = 'Ajusta los filtros para ver mas informacion.' }) {
  return (
    <Card className="grid min-h-52 place-items-center p-8 text-center" hover={false}>
      <div>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
          <SearchX size={22} />
        </div>
        <h2 className="mt-4 text-lg font-extrabold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>
    </Card>
  )
}
