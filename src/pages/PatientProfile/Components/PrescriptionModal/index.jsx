import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pill } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { prescriptionSchema } from '@/utils/schemas'

const FREQUENCIES = [
  'cada 8 horas', 'cada 12 horas', 'cada 24 horas',
  'cada 48 horas', 'cada 72 horas', 'semanal', 'según necesidad',
]
const DURATIONS = [
  '3 días', '5 días', '7 días', '10 días',
  '14 días', '21 días', '30 días', 'indefinido',
]

/**
 * PrescriptionModal — crear o editar una prescripción.
 *
 * @param {Object|null} prescription — si viene → modo edición (pre-rellena el form)
 * @param {Object}      patient      — paciente fijo (pre-seleccionado)
 * @param {Array}       patients     — lista completa (cuando patient es null)
 * @param {Array}       medications  — catálogo del store
 * @param {Function}    onClose
 * @param {Function}    onSave(data, mode, id)
 */
export function PrescriptionModal({ prescription, patient, patients = [], medications = [], onClose, onSave }) {
  const isEdit = Boolean(prescription)
  const today  = new Date().toISOString().split('T')[0]

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId:    String(patient?.id ?? prescription?.patientId ?? ''),
      medicationId: String(prescription?.medicationId ?? ''),
      dose:         prescription?.dose         ?? '',
      frequency:    prescription?.frequency    ?? '',
      duration:     prescription?.duration     ?? '',
      notes:        prescription?.notes        ?? '',
    },
  })

  const selectedMed = medications.find((m) => String(m.id) === watch('medicationId'))

  const onSubmit = (data) => {
    onSave(
      { ...data, date: isEdit ? (prescription.date ?? today) : today },
      isEdit ? 'edit' : 'create',
      prescription?.id ?? null,
    )
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEdit ? 'Editar prescripción' : 'Nueva prescripción'}
      description={isEdit ? 'Modifica los datos de la prescripción' : 'Registra un medicamento para el historial clínico del paciente'}
      icon={<Pill size={18} />}
      size="lg"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="rx-form" disabled={isSubmitting}>
            {isEdit ? 'Guardar cambios' : 'Guardar prescripción'}
          </Button>
        </>
      }
    >
      <form id="rx-form" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

        {/* Paciente */}
        <section>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-3)]">Paciente</p>
          {patient ? (
            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 text-sm font-bold text-white">
                {patient.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">{patient.name}</p>
                <p className="text-xs text-[var(--text-3)]">{patient.species} · {patient.weight} kg</p>
              </div>
            </div>
          ) : (
            <FormField error={errors.patientId}>
              <Select
                options={patients.map((p) => ({ value: p.id, label: `${p.name} (${p.species})` }))}
                value={watch('patientId')}
                onChange={(e) => setValue('patientId', e.target.value, { shouldValidate: true })}
                placeholder="Seleccionar paciente…"
                searchable
              />
            </FormField>
          )}
        </section>

        {/* Medicamento */}
        <section>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-3)]">Medicamento</p>
          <FormField error={errors.medicationId}>
            <Select
              options={medications.map((m) => ({ value: String(m.id), label: `${m.name} — ${m.concentration}${m.unit ? ' ' + m.unit : ''}` }))}
              value={watch('medicationId')}
              onChange={(e) => setValue('medicationId', e.target.value, { shouldValidate: true })}
              placeholder="Buscar medicamento…"
              searchable
            />
          </FormField>
          {selectedMed && (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 dark:border-violet-500/20 dark:bg-violet-500/10">
              <Pill size={12} className="shrink-0 text-violet-600 dark:text-violet-400" />
              <span className="text-xs text-violet-700 dark:text-violet-300">
                {selectedMed.name} · {selectedMed.concentration} {selectedMed.unit} · {selectedMed.category}
              </span>
            </div>
          )}
        </section>

        {/* Posología */}
        <section>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-3)]">Posología</p>
          <div className="grid gap-2 sm:grid-cols-3">
            <FormField error={errors.dose}>
              <Input {...register('dose')} placeholder="Dosis (ej: 1.8 ml)" />
            </FormField>
            <FormField error={errors.frequency}>
              <Select options={FREQUENCIES} value={watch('frequency')}
                onChange={(e) => setValue('frequency', e.target.value, { shouldValidate: true })}
                placeholder="Frecuencia *" />
            </FormField>
            <FormField error={errors.duration}>
              <Select options={DURATIONS} value={watch('duration')}
                onChange={(e) => setValue('duration', e.target.value, { shouldValidate: true })}
                placeholder="Duración *" />
            </FormField>
          </div>
        </section>

        {/* Notas */}
        <textarea
          {...register('notes')}
          rows={2}
          placeholder="Observaciones clínicas (opcional)"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none resize-none placeholder:text-[var(--text-3)] focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
        />
      </form>
    </Modal>
  )
}
