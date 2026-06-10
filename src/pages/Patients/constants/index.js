/** Opciones de filtro por especie */
export const SPECIES_OPTIONS = [
  { value: '',       label: '🐾 Todos'   },
  { value: 'Canino', label: '🐕 Canino'  },
  { value: 'Felino', label: '🐱 Felino'  },
  { value: 'Ave',    label: '🦜 Ave'     },
  { value: 'Reptil', label: '🦎 Reptil'  },
]

const GRADIENTS = [
  'from-blue-500 to-blue-700', 'from-violet-500 to-purple-700',
  'from-emerald-500 to-teal-600', 'from-rose-400 to-pink-600',
  'from-amber-400 to-orange-500', 'from-sky-400 to-cyan-600',
]
export const getGrad = (name) => GRADIENTS[(name?.charCodeAt(0) ?? 0) % GRADIENTS.length]

export const speciesEmoji = { Canino: '🐕', Felino: '🐱', Ave: '🦜', Reptil: '🦎', Otro: '🐾' }

export const STATUS_TONE = {
  Estable:     'green',
  Tratamiento: 'amber',
  Observacion: 'blue',
  Preventivo:  'blue',
  Alta:        'rose',
}
