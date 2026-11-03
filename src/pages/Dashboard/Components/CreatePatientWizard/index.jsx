import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2, PawPrint, UserPlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { patientSchema, ownerSchema } from '@/utils/schemas'
import { useOwners, useCreateOwner } from '@/pages/Owners/services'
import { useCreatePatient } from '@/pages/Patients/services'

const patientSchemaNoOwner = patientSchema.omit({ ownerId: true })

const slideIn = {
  enter: (dir) => ({ x: dir > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir) => ({ x: dir > 0 ? -56 : 56, opacity: 0 }),
}

/**
 * CreatePatientWizard — modal de 2 pasos para crear propietario + paciente juntos.
 * Paso 1: nuevo propietario o seleccionar uno existente.
 * Paso 2: datos del paciente.
 */
export function CreatePatientWizard({ isOpen, onClose, onDone }) {
  const [step,            setStep]            = useState(1)
  const [dir,             setDir]             = useState(1)
  const [ownerMode,       setOwnerMode]       = useState('nuevo')
  const [selectedOwnerId, setSelectedOwnerId] = useState('')
  const [saving,          setSaving]          = useState(false)

  // Carga lazy: solo pide owners cuando el modal se abre por primera vez
  const { data: oData, loading: ownersLoading, refetch: loadOwners } = useOwners({ limit: 200 }, { immediate: false })
  const owners = oData?.items ?? []
  useEffect(() => { if (isOpen) loadOwners() }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const { create: createOwner  } = useCreateOwner()
  const { create: createPatient } = useCreatePatient()

  const ownerForm = useForm({
    resolver: zodResolver(ownerSchema),
    defaultValues: { name: '', phone: '', email: '', city: '' },
  })
  const patientForm = useForm({
    resolver: zodResolver(patientSchemaNoOwner),
    defaultValues: { name: '', species: 'Canino', breed: '', age: 0, weight: '', status: 'activo' },
  })

  const goNext = () => { setDir(1); setStep(2) }
  const goBack = () => { setDir(-1); setStep(1) }

  const handleStep1 = ownerForm.handleSubmit(() => goNext())
  const handleStep1Existing = () => { if (selectedOwnerId) goNext() }

  const handleFinish = patientForm.handleSubmit(async (patientData) => {
    setSaving(true)
    try {
      let ownerId = selectedOwnerId
      if (ownerMode === 'nuevo') {
        const res = await createOwner(ownerForm.getValues())
        ownerId = res?.id ?? res?.data?.id ?? res
      }
      // ownerId se convierte a número en el toApiPayload del servicio
      await createPatient({ ...patientData, ownerId: String(ownerId) })
      onDone?.()
      handleClose()
    } finally {
      setSaving(false)
    }
  })

  const handleClose = () => {
    setStep(1); setDir(1); setOwnerMode('nuevo'); setSelectedOwnerId('')
    ownerForm.reset(); patientForm.reset()
    onClose()
  }

  const STEPS = [{ label: 'Propietario' }, { label: 'Paciente' }]

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 1 ? 'Propietario' : 'Datos del paciente'}
      description={step === 1 ? 'Crea o selecciona el propietario' : 'Completa los datos del paciente'}
      icon={step === 1 ? <Users size={18} /> : <PawPrint size={18} />}
      size="lg"
      loading={saving}
      footer={
        <div className="flex w-full items-center justify-between">
          {step === 2
            ? <Button variant="ghost" type="button" onClick={goBack}>← Atrás</Button>
            : <div />}
          {step === 1
            ? <Button variant="primary" onClick={ownerMode === 'nuevo' ? handleStep1 : handleStep1Existing}>
                Continuar →
              </Button>
            : <Button variant="primary" onClick={handleFinish} disabled={saving}>
                {saving ? 'Guardando…' : 'Crear paciente'}
              </Button>}
        </div>
      }
    >
      {/* Indicador de pasos */}
      <div className="mb-5 flex items-center gap-3">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && <div className={`h-px w-10 transition-colors ${step > i ? 'bg-violet-500' : 'bg-[var(--border)]'}`} />}
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${step === i + 1 ? 'bg-violet-600 text-white ring-2 ring-violet-600/30' : step > i + 1 ? 'bg-emerald-500 text-white' : 'bg-[var(--surface-2)] text-[var(--text-3)]'}`}>
              {step > i + 1 ? <Check size={10} /> : i + 1}
            </div>
            <span className={`text-xs font-semibold transition-colors ${step === i + 1 ? 'text-[var(--text)]' : 'text-[var(--text-3)]'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" custom={dir}>
        {step === 1 ? (
          <motion.div key="step1" custom={dir} variants={slideIn} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.18, ease: 'easeInOut' }}>
            {/* Toggle nuevo / existente */}
            <div className="mb-4 flex gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-1">
              {[
                { id: 'nuevo',     icon: UserPlus, label: 'Nuevo propietario'    },
                { id: 'existente', icon: Users,    label: 'Seleccionar existente' },
              ].map((opt) => (
                <button key={opt.id} type="button" onClick={() => setOwnerMode(opt.id)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${ownerMode === opt.id ? 'bg-violet-600 text-white shadow-sm' : 'text-[var(--text-3)] hover:text-[var(--text)]'}`}>
                  <opt.icon size={13} />{opt.label}
                </button>
              ))}
            </div>

            {ownerMode === 'nuevo' ? (
              <div className="space-y-3">
                <FormField error={ownerForm.formState.errors.name}>
                  <Input placeholder="Nombre completo *" {...ownerForm.register('name')} />
                </FormField>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField error={ownerForm.formState.errors.phone}>
                    <Input placeholder="Teléfono *" {...ownerForm.register('phone')} />
                  </FormField>
                  <FormField error={ownerForm.formState.errors.email}>
                    <Input placeholder="Email *" type="email" {...ownerForm.register('email')} />
                  </FormField>
                </div>
                <FormField error={ownerForm.formState.errors.city}>
                  <Input placeholder="Ciudad *" {...ownerForm.register('city')} />
                </FormField>
              </div>
            ) : ownersLoading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-[var(--text-3)]">
                <Loader2 size={16} className="animate-spin" /> Cargando propietarios…
              </div>
            ) : (
              <Select
                options={owners.map((o) => ({ value: String(o.id), label: o.name }))}
                value={selectedOwnerId}
                onChange={(e) => setSelectedOwnerId(e.target.value)}
                placeholder="Buscar propietario…"
                searchable
              />
            )}
          </motion.div>
        ) : (
          <motion.div key="step2" custom={dir} variants={slideIn} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.18, ease: 'easeInOut' }}>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField error={patientForm.formState.errors.name}>
                <Input placeholder="Nombre del paciente *" {...patientForm.register('name')} />
              </FormField>
              <FormField error={patientForm.formState.errors.species}>
                <Select options={['Canino','Felino','Ave','Reptil','Otro']}
                  value={patientForm.watch('species')}
                  onChange={(e) => patientForm.setValue('species', e.target.value, { shouldValidate: true })}
                  placeholder="Especie *" searchable />
              </FormField>
              <FormField error={patientForm.formState.errors.breed}>
                <Input placeholder="Raza *" {...patientForm.register('breed')} />
              </FormField>

              <FormField error={patientForm.formState.errors.age}><Input type="number" min="0" step="1" placeholder="Edad (años) *" {...patientForm.register('age')} /></FormField>
              <FormField error={patientForm.formState.errors.weight}>
                <Input type="number" step="0.1" min="0" placeholder="Peso (kg)" {...patientForm.register('weight')} />
              </FormField>

              <FormField error={patientForm.formState.errors.status}>
                <Select
                  options={[
                    { value: 'activo',   label: 'Activo'   },
                    { value: 'inactivo', label: 'Inactivo' },
                    { value: 'critico',  label: 'Crítico'  },
                  ]}
                  value={patientForm.watch('status')}
                  onChange={(e) => patientForm.setValue('status', e.target.value, { shouldValidate: true })}
                  placeholder="Estado *" />
              </FormField>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  )
}
