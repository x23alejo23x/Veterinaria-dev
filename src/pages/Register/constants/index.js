import { z } from 'zod'

export const registerSchema = z.object({
  empresa:  z.string().min(2, 'Mínimo 2 caracteres').max(80, 'Máximo 80 caracteres'),
  nit:      z.string().min(5, 'NIT/RUC inválido').max(30, 'Máximo 30 caracteres'),
  email:    z.string().email('Email inválido'),
  telefono: z.string()
              .min(7, 'Teléfono inválido')
              .regex(/^[\d\s\+\-\(\)]+$/, 'Solo números y +, -, ()'),
  ciudad:   z.string().min(2, 'Mínimo 2 caracteres').max(60),
})
