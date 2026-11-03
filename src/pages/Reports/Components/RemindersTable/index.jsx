import { MessageCircle, Phone } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ReportCard } from '../ReportCard'
import { REMINDER_STATUS, fmtDate } from '../../constants'

/**
 * RemindersTable — vacunas / desparasitaciones / controles vencidos o próximos.
 * No es un gráfico: es una lista de acción (llamar / WhatsApp al propietario).
 *
 * @param {Array}   data — [{ id, patient, owner, phone, type, due, status }]
 * @param {boolean} loading
 * @param {string}  [error]
 */
export function RemindersTable({ data = [], loading, error }) {
  const vencidos = data.filter((r) => r.status === 'Vencido').length

  return (
    <ReportCard
      title="Recordatorios pendientes"
      subtitle="Vacunas, desparasitaciones y controles por contactar"
      loading={loading}
      error={error}
      empty={!data?.length}
      actions={vencidos > 0 && <Badge tone="rose">{vencidos} vencido{vencidos > 1 ? 's' : ''}</Badge>}
    >
      <div className="overflow-hidden rounded-xl border border-[var(--border)]">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[var(--surface-2)]">
              <th className="px-3 py-2.5 text-left font-semibold text-[var(--text-3)]">Paciente</th>
              <th className="px-3 py-2.5 text-left font-semibold text-[var(--text-3)]">Tipo</th>
              <th className="px-3 py-2.5 text-left font-semibold text-[var(--text-3)]">Fecha</th>
              <th className="px-3 py-2.5 text-left font-semibold text-[var(--text-3)]">Estado</th>
              <th className="px-3 py-2.5 text-right font-semibold text-[var(--text-3)]">Contacto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {data.map((r) => {
              const st = REMINDER_STATUS[r.status] ?? REMINDER_STATUS['Próximo']
              const wa = `https://wa.me/${r.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${r.owner.split(' ')[0]}, te recordamos la ${r.type.toLowerCase()} de ${r.patient}.`)}`
              return (
                <tr key={r.id} className="transition-colors hover:bg-[var(--surface-2)]">
                  <td className="px-3 py-2.5">
                    <p className="font-semibold text-[var(--text)]">{r.patient}</p>
                    <p className="text-[10px] text-[var(--text-3)]">{r.owner}</p>
                  </td>
                  <td className="px-3 py-2.5 text-[var(--text-2)]">{r.type}</td>
                  <td className="px-3 py-2.5 tabular-nums text-[var(--text-2)]">{fmtDate(r.due)}</td>
                  <td className="px-3 py-2.5"><Badge tone={st.tone}>{st.label}</Badge></td>
                  <td className="px-3 py-2.5">
                    <div className="flex justify-end gap-1">
                      <a href={`tel:${r.phone}`} title="Llamar"
                        className="grid h-7 w-7 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]">
                        <Phone size={13} />
                      </a>
                      <a href={wa} target="_blank" rel="noreferrer" title="WhatsApp"
                        className="grid h-7 w-7 place-items-center rounded-lg text-emerald-600 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10">
                        <MessageCircle size={13} />
                      </a>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </ReportCard>
  )
}
