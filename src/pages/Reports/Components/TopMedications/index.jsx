import { HBarChart } from '@/components/charts/HBarChart'
import { fmtInt } from '@/components/charts/theme'
import { ReportCard } from '../ReportCard'

/**
 * TopMedications — medicamentos más prescritos en el rango.
 * Responde: ¿qué debo tener en inventario?
 *
 * @param {Array}   data — [{ label: medicationName, value: count }]
 * @param {boolean} loading
 * @param {string}  [error]
 */
export function TopMedications({ data = [], loading, error }) {
  return (
    <ReportCard
      title="Medicamentos más prescritos"
      subtitle="Número de prescripciones emitidas"
      loading={loading}
      error={error}
      empty={!data?.length}
    >
      <HBarChart data={data} max={7} formatter={fmtInt} />
    </ReportCard>
  )
}
