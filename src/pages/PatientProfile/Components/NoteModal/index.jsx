import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { sessionService } from '@/services/auth'
import { VETS_SEED } from '@/pages/PatientProfile/constants'
import { noteSchema } from '@/utils/schemas'

/**
 * NoteModal — crear una nota clínica para un paciente.
 * El veterinario se pre-selecciona con el usuario logueado.
 *
 * @param {Object}   patient  — paciente al que pertenece la nota
 * @param {Function} onClose
 * @param {Function} onSave(data)
 */
export function NoteModal({ patient, onClose, onSave }) {
  const session    = sessionService.get()
  const loggedVet  = session?.name ?? ''

  // Si el vet logueado no está en la lista lo añadimos al inicio
  const vetOptions = loggedVet && !VETS_SEED.includes(loggedVet)
    ? [loggedVet, ...VETS_SEED]
    : VETS_SEED

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      diagnosis: '',
      procedure: '',
      vet:       loggedVet,   // pre-seleccionado con el logueado
      notes:     '',
    },
  })

  const today = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })

  const onSubmit = (data) => {
    onSave({ ...data, patientId: patient.id, patient: patient.name, date: today })
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Nueva nota clínica"
      description={`Registra un evento clínico en el historial de ${patient.name}`}
      icon={<FileText size={18} />}
      size="lg"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="note-form" disabled={isSubmitting}>
            Guardar nota
          </Button>
        </>
      }
    >
      <form id="note-form" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

        {/* Paciente (solo lectura) */}
        <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 text-sm font-bold text-white">
            {patient.name[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">{patient.name}</p>
            <p className="text-xs text-[var(--text-3)]">{patient.species} · {patient.weight} kg · {today}</p>
          </div>
        </div>

        {/* Diagnóstico */}
        <FormField label="Diagnóstico / motivo" error={errors.diagnosis}>
          <Input {...register('diagnosis')} placeholder="Ej: Gastritis leve, vacunación anual…" />
        </FormField>

        {/* Procedimiento */}
        <FormField label="Procedimiento realizado" error={errors.procedure}>
          <Input {...register('procedure')} placeholder="Ej: Ecografía abdominal y control de hidratación" />
        </FormField>

        {/* Veterinario — selector con el logueado pre-seleccionado */}
        <FormField label="Veterinario responsable" error={errors.vet}>
          <Select
            options={vetOptions}
            value={watch('vet')}
            onChange={(e) => setValue('vet', e.target.value, { shouldValidate: true })}
            placeholder="Seleccionar veterinario…"
          />
        </FormField>

        {/* Observaciones */}
        <div>
          <p className="mb-1.5 text-xs font-semibold text-[var(--text-2)]">
            Observaciones <span className="font-normal text-[var(--text-3)]">(opcional)</span>
          </p>
          <textarea
            {...register('notes')}
            rows={3}
            placeholder="Notas clínicas adicionales, indicaciones para el propietario…"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none resize-none placeholder:text-[var(--text-3)] focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
          />
          {errors.notes && <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>}
        </div>
      </form>
    </Modal>
  )
}
