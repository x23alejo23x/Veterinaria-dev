/**
 * Reports — constantes y seed data de la vista Reportes.
 * Los agregados los calculará el backend (GROUP BY); aquí solo la forma
 * exacta que devolverá cada endpoint para que el View no cambie al conectar.
 */

/* ── Rango de fechas ─────────────────────────────────────────────────────── */
export const RANGES = [
  { value: '3m',  label: '3 meses'  },
  { value: '6m',  label: '6 meses'  },
  { value: '12m', label: '12 meses' },
]
export const DEFAULT_RANGE = '6m'
export const rangeMonths = (range) => Number.parseInt(range, 10) || 6

/* ── Series ──────────────────────────────────────────────────────────────── */
export const REVENUE_SERIES = [
  { key: 'actual',   label: '2025' },
  { key: 'anterior', label: '2024', dashed: true },
]

export const APPOINTMENT_TYPES = ['General', 'Control', 'Vacunación', 'Cirugía', 'Urgencia']
export const APPOINTMENT_SERIES = APPOINTMENT_TYPES.map((t) => ({ key: t, label: t }))

export const RETENTION_SERIES = [
  { key: 'nuevos',    label: 'Nuevos pacientes' },
  { key: 'inactivos', label: 'Inactivos (>12 meses)' },
]

/* ── Estado de recordatorios ─────────────────────────────────────────────── */
export const REMINDER_STATUS = {
  Vencido:  { tone: 'rose',  label: 'Vencido'  },
  Hoy:      { tone: 'amber', label: 'Hoy'      },
  Próximo:  { tone: 'blue',  label: 'Próximo'  },
}

/* ── Seed: 12 meses (Jul 2024 → Jun 2025) ────────────────────────────────── */
const MONTHS = ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']

export const revenueTrendSeed = [
  { mes: 'Jul', actual: 2_150_000, anterior: 1_820_000 },
  { mes: 'Ago', actual: 2_380_000, anterior: 1_950_000 },
  { mes: 'Sep', actual: 2_210_000, anterior: 2_010_000 },
  { mes: 'Oct', actual: 2_640_000, anterior: 2_120_000 },
  { mes: 'Nov', actual: 2_520_000, anterior: 2_300_000 },
  { mes: 'Dic', actual: 2_980_000, anterior: 2_450_000 },
  { mes: 'Ene', actual: 2_310_000, anterior: 2_050_000 },
  { mes: 'Feb', actual: 2_470_000, anterior: 2_180_000 },
  { mes: 'Mar', actual: 2_890_000, anterior: 2_390_000 },
  { mes: 'Abr', actual: 2_760_000, anterior: 2_410_000 },
  { mes: 'May', actual: 3_120_000, anterior: 2_560_000 },
  { mes: 'Jun', actual: 2_480_000, anterior: 2_620_000 },
]

export const appointmentsByTypeSeed = MONTHS.map((mes, i) => ({
  mes,
  General:    18 + ((i * 7) % 9),
  Control:    10 + ((i * 5) % 7),
  Vacunación:  8 + ((i * 3) % 6),
  Cirugía:     3 + (i % 3),
  Urgencia:    4 + ((i * 2) % 4),
}))

export const retentionSeed = MONTHS.map((mes, i) => ({
  mes,
  nuevos:    6 + ((i * 5) % 8),
  inactivos: 2 + ((i * 3) % 4),
}))

export const pendingBalanceSeed = [
  { label: 'Andres Gomez',   value: 86_000  },
  { label: 'Lucas Parra',    value: 42_000  },
  { label: 'Mariana Ruiz',   value: 128_000 },
  { label: 'Pedro Castaño',  value: 35_000  },
  { label: 'Laura Quintero', value: 64_500  },
  { label: 'Jorge Molina',   value: 19_000  },
]

export const topMedicationsSeed = [
  { label: 'Amoxicilina',   value: 42 },
  { label: 'Meloxicam',     value: 37 },
  { label: 'Omeprazol',     value: 29 },
  { label: 'Ivermectina',   value: 24 },
  { label: 'Prednisolona',  value: 18 },
  { label: 'Cefalexina',    value: 15 },
  { label: 'Tramadol',      value: 9  },
]

export const vetWorkloadSeed = [
  { vet: 'Dra. Valentina Rios', General: 48, Control: 31, Vacunación: 22, Cirugía: 9,  Urgencia: 12 },
  { vet: 'Dr. Mateo Silva',     General: 39, Control: 27, Vacunación: 18, Cirugía: 14, Urgencia: 8  },
  { vet: 'Dra. Paula Arango',   General: 22, Control: 15, Vacunación: 30, Cirugía: 2,  Urgencia: 3  },
]

export const remindersDueSeed = [
  { id: 'rem-1', patient: 'Luna',  owner: 'Camila Torres', phone: '+57 300 123 4567', type: 'Vacuna',          due: '2025-06-08', status: 'Vencido' },
  { id: 'rem-2', patient: 'Rocky', owner: 'Sofia Mejia',   phone: '+57 301 777 2211', type: 'Desparasitación', due: '2025-06-09', status: 'Vencido' },
  { id: 'rem-3', patient: 'Milo',  owner: 'Andres Gomez',  phone: '+57 310 555 8042', type: 'Control',         due: '2025-06-10', status: 'Hoy'     },
  { id: 'rem-4', patient: 'Nala',  owner: 'Lucas Parra',   phone: '+57 315 908 3321', type: 'Vacuna',          due: '2025-06-10', status: 'Hoy'     },
  { id: 'rem-5', patient: 'Bella', owner: 'Lucas Parra',   phone: '+57 315 908 3321', type: 'Control',         due: '2025-06-13', status: 'Próximo' },
  { id: 'rem-6', patient: 'Thor',  owner: 'Camila Torres', phone: '+57 300 123 4567', type: 'Desparasitación', due: '2025-06-15', status: 'Próximo' },
]

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/** Recorta una serie mensual a los últimos N meses del rango. */
export const sliceByRange = (rows, range) => rows.slice(-rangeMonths(range))

/** KPIs derivados de la tendencia de ingresos. */
export const revenueKpis = (rows) => {
  const total    = rows.reduce((s, r) => s + r.actual, 0)
  const anterior = rows.reduce((s, r) => s + r.anterior, 0)
  const delta    = anterior ? Math.round(((total - anterior) / anterior) * 100) : 0
  const promedio = rows.length ? Math.round(total / rows.length) : 0
  return { total, anterior, delta, promedio }
}

/** Formato de fecha corto para la tabla de recordatorios. */
export const fmtDate = (iso) =>
  new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short' }).format(new Date(`${iso}T00:00:00`))
