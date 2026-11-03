import { FileText, Pill, Stethoscope } from 'lucide-react'

export const EVENT_CFG = {
  nota: {
    icon:  FileText,
    color: 'text-violet-600 dark:text-violet-400',
    bg:    'bg-violet-50 dark:bg-violet-500/10',
    dot:   'border-violet-600 dark:border-violet-400',
    label: 'Nota clínica',
  },
  prescripcion: {
    icon:  Pill,
    color: 'text-blue-600 dark:text-blue-400',
    bg:    'bg-blue-50 dark:bg-blue-500/10',
    dot:   'border-blue-500 dark:border-blue-400',
    label: 'Prescripción',
  },
  historial: {
    icon:  Stethoscope,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg:    'bg-emerald-50 dark:bg-emerald-500/10',
    dot:   'border-emerald-600 dark:border-emerald-400',
    label: 'Evento clínico',
  },
}

export const EVENT_TYPES = ['todos', 'nota', 'historial', 'prescripcion']

const AVATAR_GRADS = [
  'from-blue-500 to-blue-700', 'from-violet-500 to-purple-700',
  'from-emerald-500 to-teal-600', 'from-rose-400 to-pink-600',
  'from-amber-400 to-orange-500', 'from-sky-400 to-cyan-600',
]
export const getPatientGrad = (name = '') =>
  AVATAR_GRADS[(name.charCodeAt(0) - 65 + 26) % AVATAR_GRADS.length]

/** Intenta parsear fechas de varios formatos a un Date para ordenar */
export const parseDate = (dateStr = '') => {
  if (!dateStr) return new Date(0)
  // ISO: "2025-06-07"
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return new Date(dateStr)
  // "07 jun. 2025" o "07 Jun 2025"
  const d = new Date(dateStr.replace(/\./g, '').replace(/(\d+)\s+(\w+)\s+(\d{4})/, '$2 $1 $3'))
  if (!isNaN(d)) return d
  // "07 Jun" sin año → asume año actual
  const d2 = new Date(dateStr.replace(/(\d+)\s+(\w+)/, '$2 $1 2025'))
  return isNaN(d2) ? new Date(0) : d2
}
