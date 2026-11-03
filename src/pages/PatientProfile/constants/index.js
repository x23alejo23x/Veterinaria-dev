export const statusCfg = {
  // Valores del backend
  activo:   { cls: 'bg-emerald-500', label: 'Activo'    },
  inactivo: { cls: 'bg-slate-500',   label: 'Inactivo'  },
  critico:  { cls: 'bg-rose-500',    label: 'Crítico'   },
  // Valores legacy del store (seed data)
  Estable:     { cls: 'bg-emerald-500', label: 'Estable' },
  Tratamiento: { cls: 'bg-amber-500',   label: 'Tratamiento' },
  Observacion: { cls: 'bg-blue-500',    label: 'Observación' },
  Preventivo:  { cls: 'bg-sky-500',     label: 'Preventivo' },
  Alta:        { cls: 'bg-rose-500',    label: 'Alta' },
}

const GRADIENTS = [
  'from-blue-500 to-blue-700', 'from-violet-500 to-purple-700',
  'from-emerald-500 to-teal-600', 'from-rose-400 to-pink-600',
  'from-amber-400 to-orange-500', 'from-sky-400 to-cyan-600',
]
export const getGrad = (name) => GRADIENTS[(name.charCodeAt(0) - 65) % GRADIENTS.length]

export const speciesEmoji = { Canino: '🐕', Felino: '🐱', Ave: '🦜', Reptil: '🦎', Otro: '🐾' }

export const TABS = ['Datos', 'Historial', 'Medicación', 'Propietario']

/* ── Estado de prescripción — punto de color por valor ── */
export const PRESCRIPTION_STATUS_CFG = {
  Activa:     { dot: 'bg-emerald-500' },
  Finalizada: { dot: 'bg-slate-400'   },
  Suspendida: { dot: 'bg-rose-500'    },
}

/* ── Lista provisional de veterinarios ──
   Cuando haya backend: reemplazar con llamada a GET /users?role=vet
   La lista incluye el nombre tal como aparece en la sesión (sessionService.get().name)
   para que el pre-seleccionado coincida exactamente. ── */
export const VETS_SEED = [
  'Dra. Valentina Rios',
  'Dr. Mateo Silva',
  'Dra. Ana Gutierrez',
  'Dr. Carlos Mendez',
]
