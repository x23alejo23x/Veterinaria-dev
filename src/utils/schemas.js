import { z } from 'zod'

/**
 * Esquemas de validación — listos para el backend.
 * Usados en formularios con react-hook-form + zodResolver.
 * Cuando llegue el backend, los mismos esquemas validan la respuesta de la API.
 */

/* ── Paciente ── */
export const patientSchema = z.object({
  name:       z.string().min(2, 'Mínimo 2 caracteres').max(60, 'Máximo 60 caracteres'),
  species:    z.string().min(1, 'Selecciona una especie'),
  breed:      z.string().min(1, 'Ingresa la raza'),
  age:        z.string().optional(),
  weight:     z.coerce.number({ invalid_type_error: 'Debe ser un número' })
               .min(0.1, 'Peso mínimo 0.1 kg').max(200, 'Peso máximo 200 kg')
               .optional().or(z.literal('')),
  sex:        z.string().min(1, 'Selecciona el sexo'),
  status:     z.string().min(1, 'Selecciona el estado'),
  ownerId:    z.string().min(1, 'Selecciona un propietario'),
  color:      z.string().optional(),
  microchip:  z.string().optional(),
  sterilized: z.boolean().optional(),
})

/* ── Propietario ── */
export const ownerSchema = z.object({
  name:    z.string().min(2, 'Mínimo 2 caracteres').max(80),
  phone:   z.string()
            .min(7, 'Teléfono inválido')
            .regex(/^[\d\s\+\-\(\)]+$/, 'Solo números y caracteres +, -, ()'),
  email:   z.string().email('Email inválido').optional().or(z.literal('')),
  address: z.string().optional(),
  balance: z.coerce.number({ invalid_type_error: 'Debe ser un número' })
            .min(0, 'No puede ser negativo').optional().or(z.literal('')),
})

/* ── Medicamento ── */
export const medicationSchema = z.object({
  name:          z.string().min(2, 'Mínimo 2 caracteres').max(80),
  concentration: z.coerce.number({ invalid_type_error: 'Debe ser un número' })
                  .positive('Debe ser mayor a 0'),
  unit:          z.string().min(1, 'Selecciona una unidad'),
  category:      z.string().min(2, 'Mínimo 2 caracteres').max(60),
})

/* ── Login ── */
export const loginSchema = z.object({
  user:     z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

/* ── Cita ── */
export const appointmentSchema = z.object({
  patientId:   z.string().min(1, 'Selecciona un paciente'),
  vet:         z.string().min(2, 'Ingresa el nombre del veterinario'),
  date:        z.string().min(1, 'Selecciona una fecha'),
  time:        z.string().min(1, 'Selecciona una hora'),
  type:        z.enum(['General','Urgencia','Control','Vacunación','Cirugía'], { errorMap: () => ({ message: 'Tipo inválido' }) }),
  status:      z.enum(['Pendiente','Confirmada','Cancelada','Completada'], { errorMap: () => ({ message: 'Estado inválido' }) }),
  notes:       z.string().max(300, 'Máximo 300 caracteres').optional(),
})

/* ── Prescripción ── */
export const prescriptionSchema = z.object({
  patientId:    z.string().min(1, 'Selecciona un paciente'),
  medicationId: z.string().min(1, 'Selecciona un medicamento'),
  dose:         z.string().min(1, 'Ingresa la dosis'),
  frequency:    z.string().min(1, 'Selecciona la frecuencia'),
  duration:     z.string().min(1, 'Ingresa la duración'),
  notes:        z.string().max(300).optional(),
})

/* ── Nota clínica ── */
export const noteSchema = z.object({
  diagnosis:  z.string().min(2, 'Mínimo 2 caracteres').max(120, 'Máximo 120 caracteres'),
  procedure:  z.string().min(2, 'Describe el procedimiento').max(200),
  vet:        z.string().min(2, 'Ingresa el nombre del veterinario').max(80),
  notes:      z.string().max(500, 'Máximo 500 caracteres').optional(),
})

/* ── Empresa (Admin SaaS) ── */
export const companySchema = z.object({
  name:        z.string().min(2, 'Mínimo 2 caracteres').max(80),
  owner:       z.string().min(2, 'Mínimo 2 caracteres'),
  email:       z.string().email('Email inválido'),
  city:        z.string().optional(),
  plan:        z.enum(['Básico', 'Pro', 'Enterprise']),
  maxPatients: z.coerce.number().int().positive('Debe ser mayor a 0'),
  maxUsers:    z.coerce.number().int().positive('Debe ser mayor a 0'),
})
