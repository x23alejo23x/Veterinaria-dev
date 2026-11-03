import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Activity } from 'lucide-react'
import { Button }    from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input }     from '@/components/ui/Input'
import { Modal }     from '@/components/ui/Modal'
import { Select }    from '@/components/ui/Select'
import { sessionService } from '@/services/auth'
import { FOLLOWUP_TYPES, FOLLOWUP_STATUSES } from '@/pages/FollowUps/constants'
import { followUpSchema } from '@/utils/schemas'

/**
 * FollowUpModal — crear o editar un seguimiento médico.
 *
 * @param {Object}   modal     — { mode: 'create'|'edit', data?: followUp }
 * @param {Array}    patients  — lista de pacientes para el selector
 * @param {Function} onClose
 * @param {Function} onSave(data, mode, id)
 */
export function FollowUpModal({ modal, patients = [], onClose, onSave }) {
  const isEdit = modal?.mode === 'edit'
  const fu     = modal?.data
  const session = sessionService.get()

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      patientId: fu?.patientId ?? '',
      type:      fu?.type      ?? 'Control',
      dueDate:   fu?.dueDate   ?? '',
      status:    fu?.status    ?? 'Pendiente',
      vet:       fu?.vet       ?? session?.name ?? '',
      notes:     fu?.notes     ?? '',
    },
  })

  useEffect(() => {
    if (fu) {
      reset({
        patientId: fu.patientId ?? '',
        type:      fu.type      ?? 'Control',
        dueDate:   fu.dueDate   ?? '',
        status:    fu.status    ?? 'Pendiente',
        vet:       fu.vet       ?? session?.name ?? '',
        notes:     fu.notes     ?? '',
      })
    }
  }, [fu?.id])

  const onSubmit = (data) => {
    const patient = patients.find((p) => p.id === data.patientId)
    onSave({ ...data, patientName: patient?.name ?? '' }, modal.mode, fu?.id ?? null)
  }

  const patientOptions = patients.map((p) => ({ value: p.id, label: `${p.name} — ${p.species}` }))

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEdit ? 'Editar seguimiento' : 'Nuevo seguimiento'}
      description={isEdit ? 'Modifica los datos del seguimiento médico' : 'Programa un seguimiento médico para un paciente'}
      icon={<Activity size={18} />}
      size="lg"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="followup-form" disabled={isSubmitting}>
            {isEdit ? 'Guardar cambios' : 'Crear seguimiento'}
          </Button>
        </>
      }
    >
      <form id="followup-form" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

        {/* Paciente */}
        <FormField label="Paciente" required error={errors.patientId}>
          <Select
            options={patientOptions}
            value={watch('patientId')}
            onChange={(e) => setValue('patientId', e.target.value, { shouldValidate: true })}
            placeholder="Seleccionar paciente…"
            searchable
          />
        </FormField>

        {/* Tipo + Fecha */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Tipo de seguimiento" required error={errors.type}>
            <Select
              options={FOLLOWUP_TYPES}
              value={watch('type')}
              onChange={(e) => setValue('type', e.target.value, { shouldValidate: true })}
            />
          </FormField>
          <FormField label="Fecha programada" required error={errors.dueDate}>
            <Input type="date" {...register('dueDate')} />
          </FormField>
        </div>

        {/* Estado (solo en edit) + Veterinario */}
        <div className="grid grid-cols-2 gap-3">
          {isEdit && (
            <FormField label="Estado" error={errors.status}>
              <Select
                options={FOLLOWUP_STATUSES}
                value={watch('status')}
                onChange={(e) => setValue('status', e.target.value, { shouldValidate: true })}
              />
            </FormField>
          )}
          <FormField label="Veterinario responsable" required error={errors.vet} className={isEdit ? '' : 'col-span-2'}>
            <Input {...register('vet')} placeholder="Nombre del veterinario" />
          </FormField>
        </div>

        {/* Notas */}
        <div>
          <p className="mb-1.5 text-xs font-semibold text-[var(--text-2)]">
            Notas <span className="font-normal text-[var(--text-3)]">(opcional)</span>
          </p>
          <textarea
            {...register('notes')}
            rows={3}
            placeholder="Indicaciones, observaciones, recordatorios…"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none resize-none placeholder:text-[var(--text-3)] focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
          />
          {errors.notes && <p className="mt-1 text-xs text-rose-500">{errors.notes.message}</p>}
        </div>

      </form>
    </Modal>
  )
}
