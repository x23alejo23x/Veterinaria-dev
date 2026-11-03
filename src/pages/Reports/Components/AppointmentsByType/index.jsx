import { BarChart } from '@/components/charts/BarChart'
import { fmtInt } from '@/components/charts/theme'
import { ReportCard } from '../ReportCard'
import { APPOINTMENT_SERIES } from '../../constants'

/**
 * AppointmentsByType — citas por tipo y mes (barras apiladas).
 * Responde: ¿qué servicios crecen? ¿cuánta carga hay por mes?
 *
 * @param {Array}   data — [{ mes, General, Control, Vacunación, Cirugía, Urgencia }]
 * @param {boolean} loading
 * @param {string}  [error]
 */
export function AppointmentsByType({ data = [], loading, error }) {
  return (
    <ReportCard
      title="Citas por tipo"
      subtitle="Volumen mensual desglosado por tipo de consulta"
      loading={loading}
      error={error}
      empty={!data?.length}
    >
      <BarChart
        data={data}
        xKey="mes"
        series={APPOINTMENT_SERIES}
        stacked
        height={220}
        formatter={fmtInt}
      />
    </ReportCard>
  )
}
