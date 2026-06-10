export const TYPE_COLORS = {
  General:    '#2563eb',
  Urgencia:   '#e11d48',
  Control:    '#16a34a',
  Vacunación: '#7c3aed',
  Cirugía:    '#d97706',
}

export const typeClass = {
  General:    'bg-blue-50   text-blue-700   dark:bg-blue-500/10   dark:text-blue-300',
  Urgencia:   'bg-rose-50   text-rose-700   dark:bg-rose-500/10   dark:text-rose-300',
  Control:    'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  Vacunación: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
  Cirugía:    'bg-amber-50  text-amber-700  dark:bg-amber-500/10  dark:text-amber-300',
}

export const statusTone = { Pendiente: 'amber', Confirmada: 'green', Cancelada: 'rose', Completada: 'blue' }

export const VETS    = ['Dra. Valentina Rios', 'Dr. Mateo Silva', 'Dra. Laura Herrera']
export const TYPES   = ['General', 'Urgencia', 'Control', 'Vacunación', 'Cirugía']
export const STATUSES = ['Pendiente', 'Confirmada', 'Cancelada', 'Completada']

const GRADIENTS = [
  'from-blue-500 to-blue-700', 'from-violet-500 to-purple-700',
  'from-emerald-500 to-teal-600', 'from-rose-400 to-pink-600',
  'from-amber-400 to-orange-500', 'from-sky-400 to-cyan-600',
]
export const gradient = (name) => GRADIENTS[(name?.charCodeAt(0) ?? 0) % GRADIENTS.length]

export const toYMD = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

const DAYS_ES   = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
const MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
export const fmtDate = (ymd) => {
  const [y, m, d] = ymd.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return `${DAYS_ES[date.getDay()]} ${d} de ${MONTHS_ES[m - 1]}`
}

export const WEEK_LABELS = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']
