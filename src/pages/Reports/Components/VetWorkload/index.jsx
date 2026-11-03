import { BarChart } from '@/components/charts/BarChart'
import { fmtInt } from '@/components/charts/theme'
import { ReportCard } from '../ReportCard'
import { APPOINTMENT_SERIES, APPOINTMENT_TYPES } from '../../constants'

/**
 * VetWorkload — citas atendidas por veterinario, apiladas por tipo.
 * Responde: ¿cómo se reparte la carga del equipo?
 *
 * @param {Array}   data — [{ vet, General, Control, Vacunación, Cirugía, Urgencia }]
 * @param {boolean} loading
 * @param {string}  [error]
 */
export function VetWorkload({ data = [], loading, error }) {
  // Nombre corto para el eje X: "Dra. Valentina Rios" → "Dra. Rios"
  const rows = data.map((r) => {
    const parts = r.vet.split(' ')
    const short = parts.length > 2 ? `${parts[0]} ${parts[parts.length - 1]}` : r.vet
    const total = APPOINTMENT_TYPES.reduce((s, t) => s + (r[t] ?? 0), 0)
    return { ...r, short, total }
  })

  return (
    <ReportCard
      title="Carga por veterinario"
      subtitle="Citas atendidas en el rango, por tipo"
      loading={loading}
      error={error}
      empty={!data?.length}
    >
      <BarChart
        data={rows}
        xKey="short"
        series={APPOINTMENT_SERIES}
        stacked
        height={200}
        formatter={fmtInt}
      />
    </ReportCard>
  )
}
