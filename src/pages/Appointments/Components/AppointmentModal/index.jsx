import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarCheck, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { appointmentSchema } from '@/utils/schemas'
import { STATUSES, TYPES, VETS } from '@/pages/Appointments/constants'

/**
 * AppointmentModal — formulario de cita con validación Zod.
 * @param {Object}   modal    — { mode: 'create'|'edit', data }
 * @param {Array}    patients — lista del store
 * @param {Array}    owners   — lista del store
 * @param {Function} onClose
 * @param {Function} onSave   — callback(appointmentData)
 */
export function AppointmentModal({ modal, patients, owners, onClose, onSave }) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { patientId: '', vet: VETS[0], date: '', time: '', type: 'General', status: 'Pendiente', notes: '', ...(modal.data ?? {}) },
  })

  const patient  = patients.find((p) => p.id === watch('patientId'))
  const ownerName = patient ? (owners.find((o) => o.id === patient.ownerId)?.name ?? patient.owner) : '—'

  const onSubmit = (data) => {
    const pt = patients.find((p) => p.id === data.patientId)
    // Pasar mode e id para que handleSave no necesite cerrar sobre `modal`
    onSave(
      { ...data, patientName: pt?.name ?? '', ownerId: pt?.ownerId ?? '', ownerName: pt ? (owners.find((o) => o.id === pt.ownerId)?.name ?? pt.owner) : '' },
      modal.mode,
      modal.data?.id ?? null,
    )
  }

  return (
    <Modal isOpen onClose={onClose}
      title={modal.mode === 'edit' ? 'Editar cita' : 'Nueva cita'}
      description={modal.mode === 'edit' ? 'Modifica los detalles de la cita médica' : 'Programa una nueva cita para un paciente'}
      icon={<CalendarCheck size={18} />} size="lg"
      footer={<><Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button><Button variant="primary" type="submit" form="appointment-form" disabled={isSubmitting}>Guardar cita</Button></>}
    >
      <form id="appointment-form" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <section>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-3)]">Paciente</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <FormField error={errors.patientId}>
              <Select options={patients.map((p) => ({ value: p.id, label: `${p.name} (${p.species})` }))}
                value={watch('patientId')} onChange={(e) => setValue('patientId', e.target.value, { shouldValidate: true })} placeholder="Buscar paciente…" searchable />
            </FormField>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2">
              <User size={14} className="shrink-0 text-[var(--text-3)]" />
              <span className="text-sm text-[var(--text-2)]">{ownerName}</span>
            </div>
          </div>
        </section>
        <section>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-3)]">Fecha y hora</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <FormField error={errors.date}><Input type="date" {...register('date')} /></FormField>
            <FormField error={errors.time}><Input type="time" {...register('time')} icon={<Clock size={14} className="text-[var(--text-3)]" />} /></FormField>
          </div>
        </section>
        <section>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-3)]">Detalle</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <FormField error={errors.vet}><Select options={VETS}    value={watch('vet')}    onChange={(e) => setValue('vet',    e.target.value, { shouldValidate: true })} placeholder="Veterinario *" /></FormField>
            <FormField error={errors.type}><Select options={TYPES}  value={watch('type')}   onChange={(e) => setValue('type',   e.target.value, { shouldValidate: true })} placeholder="Tipo *" /></FormField>
            <FormField error={errors.status}><Select options={STATUSES} value={watch('status')} onChange={(e) => setValue('status', e.target.value, { shouldValidate: true })} placeholder="Estado *" /></FormField>
          </div>
          <div className="mt-2">
            <textarea {...register('notes')} rows={2} placeholder="Notas (opcional)"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none resize-none placeholder:text-[var(--text-3)] focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15" />
          </div>
        </section>
      </form>
    </Modal>
  )
}
