export const planColor = {
  Básico:     'bg-slate-100  text-slate-700  dark:bg-slate-500/15  dark:text-slate-300',
  Pro:        'bg-blue-100   text-blue-700   dark:bg-blue-500/15   dark:text-blue-300',
  Enterprise: 'bg-amber-100  text-amber-700  dark:bg-amber-500/15  dark:text-amber-300',
}

export const statusColor = {
  Activa:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  Trial:    'bg-violet-100  text-violet-700  dark:bg-violet-500/15  dark:text-violet-300',
  Inactiva: 'bg-rose-100    text-rose-700    dark:bg-rose-500/15    dark:text-rose-300',
}

const gradients = [
  'from-blue-500 to-blue-700', 'from-violet-500 to-purple-700',
  'from-emerald-500 to-teal-600', 'from-rose-400 to-pink-600',
  'from-amber-400 to-orange-500', 'from-sky-400 to-cyan-600',
]
export const getGrad = (name) => gradients[(name.charCodeAt(0) - 65) % gradients.length]

export const emptyCompany = { name: '', owner: '', email: '', city: '', plan: 'Básico', maxPatients: 20, maxUsers: 3 }
