import { Calendar, MapPin, Phone, Scissors, Scale, Tag } from 'lucide-react'
import { InfoChip } from '@/pages/PatientProfile/Components/InfoChip'

/**
 * ProfileSidebar — barra lateral izquierda con info clínica y propietario.
 * @param {Object} patient
 * @param {Object|undefined} owner
 */
export function ProfileSidebar({ patient, owner }) {
  return (
    <div className="w-64 shrink-0 overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)] p-4 space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)]">Información clínica</p>
      <div className="grid gap-2">
        <InfoChip icon={Scale}    label="Peso"          value={`${patient.weight} kg`} />
        <InfoChip icon={Scissors} label="Sexo"          value={patient.sex} />
        <InfoChip icon={Tag}      label="Color"         value={patient.color} />
        <InfoChip icon={Calendar} label="Última visita" value={patient.lastVisit} />
        <InfoChip icon={Tag}      label="Microchip"     value={patient.microchip || 'No registrado'} />
        <InfoChip icon={Tag}      label="Esterilizado"  value={patient.sterilized ? 'Sí' : 'No'} />
      </div>

      {owner && (
        <>
          <p className="pt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)]">Propietario</p>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-500 text-sm font-bold text-white">{owner.name[0]}</div>
              <p className="text-sm font-semibold text-[var(--text)]">{owner.name}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-[var(--text-3)]"><Phone size={11} /> {owner.phone}</div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-3)]"><MapPin size={11} /> {owner.address || '—'}</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
