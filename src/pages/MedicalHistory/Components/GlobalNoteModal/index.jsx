import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText } from 'lucide-react'
import { Button }    from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input }     from '@/components/ui/Input'
import { Modal }     from '@/components/ui/Modal'
import { Select }    from '@/components/ui/Select'
import { sessionService } from '@/services/auth'
import { VETS_SEED } from '@/pages/PatientProfile/constants'
import { noteSchema } from '@/utils/schemas'

/**
 * GlobalNoteModal — agrega nota clínica desde la vista global de Historial.
 *
 * @param {Array}    patients         — lista completa de pacientes
 * @param {string}   defaultPatientId — pre-selecciona paciente si viene del filtro
 * @param {Function} onClose
 * @param {Function} onSave(data)
 */
export function GlobalNoteModal({ patients = [], defaultPatientId = '', onClose, onSave }) {
  const session    = sessionService.get()
  const loggedVet  = session?.name ?? ''
  const vetOptions = loggedVet && !VETS_SEED.includes(loggedVet) ? [loggedVet, ...VETS_SEED] : VETS_SEED

  const [patientId,      setPatientId]      = useState(defaultPatientId)
  const [patientError,   setPatientError]   = useState('')

  const patientOptions = patients.map((p) => ({ value: p.id, label: `${p.name} — ${p.species}` }))

  const today = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: { diagnosis: '', procedure: '', vet: loggedVet, notes: '' },
  })

  const onSubmit = (data) => {
    if (!patientId) { setPatientError('Selecciona un paciente'); return }
    const patient = patients.find((p) => p.id === patientId)
    onSave({ ...data, patientId: patient.id, patient: patient.name, date: today })
  }

  return (
    <Modal
      isOpen onClose={onClose}
      title="Nueva nota clínica"
      description="Registra un evento clínico en el historial del paciente"
      icon={<FileText size={18} />}
      size="lg"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="global-note-form" disabled={isSubmitting}>
            Guardar nota
          </Button>
        </>
      }
    >
      <form id="global-note-form" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

        <FormField label="Paciente" required error={patientError ? { message: patientError } : undefined}>
          <Select
            options={patientOptions}
            value={patientId}
            onChange={(e) => { setPatientId(e.target.value); setPatientError('') }}
            placeholder="Seleccionar paciente…"
            searchable
          />
        </FormField>

        <FormField label="Diagnóstico / motivo" required error={errors.diagnosis}>
          <Input {...register('diagnosis')} placeholder="Ej: Gastritis leve, vacunación anual…" />
        </FormField>

        <FormField label="Procedimiento realizado" required error={errors.procedure}>
          <Input {...register('procedure')} placeholder="Ej: Ecografía abdominal y control de hidratación" />
        </FormField>

        <FormField label="Veterinario responsable" error={errors.vet}>
          <Select
            options={vetOptions}
            value={watch('vet')}
            onChange={(e) => setValue('vet', e.target.value, { shouldValidate: true })}
            placeholder="Seleccionar veterinario…"
          />
        </FormField>

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
          {errors.notes && <p className="mt-1 text-xs text-rose-500">{errors.notes.message}</p>}
        </div>

      </form>
    </Modal>
  )
}
