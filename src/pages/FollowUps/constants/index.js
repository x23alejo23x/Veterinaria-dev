import { Bug, ClipboardList, Microscope, Scissors, Stethoscope, Syringe } from 'lucide-react'

export const STATUS_CFG = {
  Pendiente:  {
    dot:   'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    ring:  'ring-amber-400/30',
  },
  Completado: {
    dot:   'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    ring:  'ring-emerald-400/30',
  },
  Cancelado: {
    dot:   'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400',
    ring:  'ring-slate-400/30',
  },
  Vencido: {
    dot:   'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
    ring:  'ring-rose-400/30',
  },
}

export const TYPE_CFG = {
  Control: {
    icon:     Stethoscope,
    color:    'text-blue-600 dark:text-blue-400',
    bg:       'bg-blue-50 dark:bg-blue-500/10',
    gradient: 'from-blue-500 to-blue-700',
  },
  Vacuna: {
    icon:     Syringe,
    color:    'text-emerald-600 dark:text-emerald-400',
    bg:       'bg-emerald-50 dark:bg-emerald-500/10',
    gradient: 'from-emerald-500 to-teal-600',
  },
  'Desparasitación': {
    icon:     Bug,
    color:    'text-amber-600 dark:text-amber-400',
    bg:       'bg-amber-50 dark:bg-amber-500/10',
    gradient: 'from-amber-400 to-orange-500',
  },
  'Cirugía': {
    icon:     Scissors,
    color:    'text-rose-600 dark:text-rose-400',
    bg:       'bg-rose-50 dark:bg-rose-500/10',
    gradient: 'from-rose-400 to-pink-600',
  },
  'Diagnóstico': {
    icon:     Microscope,
    color:    'text-violet-600 dark:text-violet-400',
    bg:       'bg-violet-50 dark:bg-violet-500/10',
    gradient: 'from-violet-500 to-purple-700',
  },
  Otro: {
    icon:     ClipboardList,
    color:    'text-sky-600 dark:text-sky-400',
    bg:       'bg-sky-50 dark:bg-sky-500/10',
    gradient: 'from-sky-400 to-cyan-600',
  },
}

export const FOLLOWUP_TYPES    = Object.keys(TYPE_CFG)
export const FOLLOWUP_STATUSES = Object.keys(STATUS_CFG)

const AVATAR_GRADS = [
  'from-blue-500 to-blue-700', 'from-violet-500 to-purple-700',
  'from-emerald-500 to-teal-600', 'from-rose-400 to-pink-600',
  'from-amber-400 to-orange-500', 'from-sky-400 to-cyan-600',
]
export const getPatientGrad = (name = '') =>
  AVATAR_GRADS[(name.charCodeAt(0) - 65 + 26) % AVATAR_GRADS.length]

/** Devuelve texto legible de la fecha de vencimiento relativa a hoy */
export const formatDueDate = (dueDateStr) => {
  if (!dueDateStr) return '—'
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const due   = new Date(dueDateStr + 'T00:00:00')
  const diff  = Math.round((due - today) / 86400000)

  if (diff === 0)  return 'Hoy'
  if (diff === 1)  return 'Mañana'
  if (diff === -1) return 'Ayer'
  if (diff > 1)    return `En ${diff} días`
  return `Hace ${Math.abs(diff)} días`
}

/** Devuelve true si la fecha ya venció y el status sigue Pendiente */
export const isOverdue = (dueDateStr, status) => {
  if (status !== 'Pendiente') return false
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return new Date(dueDateStr + 'T00:00:00') < today
}
