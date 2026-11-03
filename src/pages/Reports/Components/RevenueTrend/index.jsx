import { TrendingDown, TrendingUp } from 'lucide-react'
import { LineChart } from '@/components/charts/LineChart'
import { fmtCOP, fmtCompact } from '@/components/charts/theme'
import { ReportCard } from '../ReportCard'
import { REVENUE_SERIES, revenueKpis } from '../../constants'

/**
 * RevenueTrend — ingresos mensuales vs. mismo periodo del año anterior.
 * KPI row (total, promedio, variación) + línea actual (sólida) y anterior (punteada, contexto).
 *
 * @param {Array}   data    — [{ mes, actual, anterior }]
 * @param {boolean} loading
 * @param {string}  [error]
 */
export function RevenueTrend({ data = [], loading, error, className = '' }) {
  const { total, promedio, delta } = revenueKpis(data ?? [])
  const up = delta >= 0

  return (
    <ReportCard
      title="Ingresos mensuales"
      subtitle="Facturado por mes · comparado con el mismo periodo del año anterior"
      loading={loading}
      error={error}
      empty={!data?.length}
      skeletonHeight={300}
      className={className}
    >
      {/* KPI row */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Kpi label="Total periodo" value={fmtCOP(total)} />
        <Kpi label="Promedio mensual" value={fmtCOP(promedio)} />
        <Kpi
          label="vs. año anterior"
          value={`${up ? '+' : ''}${delta}%`}
          tone={up ? 'good' : 'serious'}
          icon={up ? TrendingUp : TrendingDown}
        />
      </div>

      <LineChart
        data={data}
        xKey="mes"
        series={REVENUE_SERIES}
        height={220}
        formatter={fmtCOP}
        tickFormatter={fmtCompact}
      />
    </ReportCard>
  )
}

function Kpi({ label, value, tone, icon: Icon }) {
  const toneCls = tone === 'good'
    ? 'text-emerald-600 dark:text-emerald-400'
    : tone === 'serious'
      ? 'text-rose-600 dark:text-rose-400'
      : 'text-[var(--text)]'
  return (
    <div className="rounded-xl bg-[var(--surface-2)] px-3 py-2.5">
      <p className={`flex items-center gap-1.5 text-lg font-bold tabular-nums ${toneCls}`}>
        {Icon && <Icon size={15} />}
        {value}
      </p>
      <p className="mt-0.5 text-[10px] leading-tight text-[var(--text-3)]">{label}</p>
    </div>
  )
}
