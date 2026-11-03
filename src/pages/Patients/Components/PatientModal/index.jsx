import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PawPrint } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { patientSchema } from '@/utils/schemas'

export const emptyPatient = {
  name: '', species: 'Canino', breed: '', age: 0, weight: '',
  sex: 'Macho', status: 'activo', ownerId: '', color: '',
  microchip: '', sterilized: false,
}

/**
 * PatientModal — formulario de creación/edición de paciente.
 * @param {Object}   modal   — { mode: 'create'|'edit', data: patient|null }
 * @param {Array}    owners  — lista de propietarios para el select
 * @param {Function} onClose — cierra el modal
 * @param {Function} onSave  — callback con los datos validados
 */
export function PatientModal({ modal, owners, onClose, onSave }) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: { ...emptyPatient, ...modal.data },
  })

  return (
    <Modal
      isOpen={!!modal}
      onClose={onClose}
      title={modal.mode === 'edit' ? 'Editar paciente' : 'Nuevo paciente'}
      description={modal.mode === 'edit' ? 'Actualiza los datos del paciente y su propietario' : 'Completa los datos para registrar un nuevo paciente'}
      icon={<PawPrint size={18} />}
      size="lg"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="patient-form" disabled={isSubmitting}>
            Guardar paciente
          </Button>
        </>
      }
    >
      <form id="patient-form" className="space-y-4" onSubmit={handleSubmit((data) => onSave(data, modal.mode, modal.data?.id))}>
        <section>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-3)]">Datos básicos</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <FormField error={errors.name}><Input placeholder="Nombre *" {...register('name')} /></FormField>
            <FormField error={errors.species}>
              <Select options={['Canino','Felino','Ave','Reptil','Otro']}
                value={watch('species')} onChange={(e) => setValue('species', e.target.value, { shouldValidate: true })}
                placeholder="Especie *" searchable />
            </FormField>
            <FormField error={errors.breed}><Input placeholder="Raza *" {...register('breed')} /></FormField>
            <Input placeholder="Color / pelaje" {...register('color')} />
            <FormField error={errors.age}><Input type="number" min="0" step="1" placeholder="Edad (años) *" {...register('age')} /></FormField>
            <FormField error={errors.weight}><Input type="number" step="0.1" min="0" placeholder="Peso (kg)" {...register('weight')} /></FormField>
            <FormField error={errors.sex}>
              <Select options={['Macho','Hembra']} value={watch('sex')}
                onChange={(e) => setValue('sex', e.target.value, { shouldValidate: true })} placeholder="Sexo *" />
            </FormField>
            <FormField error={errors.status}>
              <Select
                options={[
                  { value: 'activo',   label: 'Activo'   },
                  { value: 'inactivo', label: 'Inactivo' },
                  { value: 'critico',  label: 'Crítico'  },
                ]}
                value={watch('status')} onChange={(e) => setValue('status', e.target.value, { shouldValidate: true })}
                placeholder="Estado *" />
            </FormField>
          </div>
        </section>
        <section>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-3)]">Información clínica</p>
          <div className="space-y-2">
            <FormField error={errors.ownerId}>
              <Select options={owners.map((o) => ({ value: o.id, label: o.name }))}
                value={watch('ownerId')} onChange={(e) => setValue('ownerId', e.target.value, { shouldValidate: true })}
                placeholder="Buscar propietario…" searchable />
            </FormField>
            <Input placeholder="Número de microchip" {...register('microchip')} />
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--border)]">
              <input type="checkbox" {...register('sterilized')} className="h-4 w-4 accent-violet-600" />
              Esterilizado / a
            </label>
          </div>
        </section>
      </form>
    </Modal>
  )
}
