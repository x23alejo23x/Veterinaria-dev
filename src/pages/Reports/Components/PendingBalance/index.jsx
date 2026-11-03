import { useNavigate } from 'react-router-dom'
import { HBarChart } from '@/components/charts/HBarChart'
import { fmtCOP, fmtCompact } from '@/components/charts/theme'
import { ReportCard } from '../ReportCard'

/**
 * PendingBalance — cartera pendiente por propietario (top).
 * Responde: ¿quién me debe y cuánto? Click en la barra → ficha del propietario.
 *
 * @param {Array}   data — [{ label: ownerName, value: balance, ownerId? }]
 * @param {boolean} loading
 * @param {string}  [error]
 */
export function PendingBalance({ data = [], loading, error }) {
  const navigate = useNavigate()
  const total = data.reduce((s, r) => s + r.value, 0)

  return (
    <ReportCard
      title="Cartera pendiente"
      subtitle="Saldo por cobrar por propietario"
      loading={loading}
      error={error}
      empty={!data?.length}
      actions={
        <span className="text-sm font-bold tabular-nums text-rose-600 dark:text-rose-400">{fmtCOP(total)}</span>
      }
    >
      <HBarChart
        data={data}
        max={6}
        tone="serious"
        formatter={fmtCompact}
        onBarClick={() => navigate('/propietarios')}
      />
    </ReportCard>
  )
}
