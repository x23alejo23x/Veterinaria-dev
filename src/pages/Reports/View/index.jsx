import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { DEFAULT_RANGE, RANGES } from '../constants'
import {
  useAppointmentsByType, usePendingBalance, useRemindersDue, useRetention,
  useRevenueTrend, useTopMedications, useVetWorkload,
} from '../services'
import { RevenueTrend }       from '../Components/RevenueTrend'
import { AppointmentsByType } from '../Components/AppointmentsByType'
import { Retention }          from '../Components/Retention'
import { PendingBalance }     from '../Components/PendingBalance'
import { TopMedications }     from '../Components/TopMedications'
import { VetWorkload }        from '../Components/VetWorkload'
import { RemindersTable }     from '../Components/RemindersTable'

export function ReportsView() {
  const [range, setRange] = useState(DEFAULT_RANGE)

  const revenue      = useRevenueTrend(range)
  const appointments = useAppointmentsByType(range)
  const retention    = useRetention(range)
  const balance      = usePendingBalance()
  const medications  = useTopMedications(range)
  const workload     = useVetWorkload(range)
  const reminders    = useRemindersDue()

  return (
    <PageContainer
      eyebrow="Reportes"
      title="Reportes clínicos"
      description="Ingresos, actividad y retención de la clínica"
      actions={<RangeFilter value={range} onChange={setRange} />}
      scrollable
    >
      <div className="grid gap-4 pb-2 xl:grid-cols-3">
        <RevenueTrend       className="xl:col-span-2" {...pick(revenue)} />
        <RemindersTable     {...pick(reminders)} />
        <AppointmentsByType {...pick(appointments)} />
        <Retention          {...pick(retention)} />
        <VetWorkload        {...pick(workload)} />
        <PendingBalance     {...pick(balance)} />
        <TopMedications     {...pick(medications)} />
      </div>
    </PageContainer>
  )
}

/* ─── Helpers y sub-componentes locales ─── */

const pick = ({ data, loading, error }) => ({ data: data ?? [], loading, error })

function RangeFilter({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Rango de fechas" className="flex rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-1">
      {RANGES.map((r) => {
        const on = r.value === value
        return (
          <button
            key={r.value}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(r.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${on ? 'bg-[var(--surface)] text-[var(--primary)] shadow-[var(--shadow-sm)]' : 'text-[var(--text-3)] hover:text-[var(--text)]'}`}
          >
            {r.label}
          </button>
        )
      })}
    </div>
  )
}
