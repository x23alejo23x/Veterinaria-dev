import { LineChart } from '@/components/charts/LineChart'
import { fmtInt } from '@/components/charts/theme'
import { ReportCard } from '../ReportCard'
import { RETENTION_SERIES } from '../../constants'

/**
 * Retention — nuevos pacientes vs. pacientes que pasan a inactivos por mes.
 * Responde: ¿retengo clientes o solo capto?
 *
 * @param {Array}   data — [{ mes, nuevos, inactivos }]
 * @param {boolean} loading
 * @param {string}  [error]
 */
export function Retention({ data = [], loading, error }) {
  const nuevos    = data.reduce((s, r) => s + r.nuevos, 0)
  const inactivos = data.reduce((s, r) => s + r.inactivos, 0)
  const neto      = nuevos - inactivos

  return (
    <ReportCard
      title="Captación y retención"
      subtitle="Pacientes nuevos vs. inactivos (sin visita en 12 meses)"
      loading={loading}
      error={error}
      empty={!data?.length}
      actions={
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${neto >= 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300'}`}>
          Neto {neto >= 0 ? '+' : ''}{neto}
        </span>
      }
    >
      <LineChart
        data={data}
        xKey="mes"
        series={RETENTION_SERIES}
        height={220}
        formatter={fmtInt}
      />
    </ReportCard>
  )
}
