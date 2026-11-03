/**
 * Chart theme — paleta y formatters compartidos por todos los gráficos.
 *
 * Paleta categórica validada (scripts/validate_palette.js del skill dataviz):
 *   - Light sobre #ffffff: PASS en banda de luminosidad, croma, contraste ≥ 3:1
 *   - Dark  sobre #110f28: PASS en banda de luminosidad, croma, contraste ≥ 3:1
 *   - Par adyacente más débil (ámbar ↔ esmeralda) ΔE CVD 7.9 → válido solo con
 *     codificación secundaria: gap de 2px entre barras + leyenda + etiquetas directas.
 *
 * REGLAS:
 *   - Los colores se asignan en orden fijo por entidad, nunca se ciclan.
 *   - Máximo 5 series categóricas; a partir de ahí agrupar en "Otros".
 *   - Estado (bueno/aviso/crítico) usa STATUS, nunca CATEGORICAL.
 *   - El texto (ejes, tooltips, leyendas) siempre usa var(--text*), nunca el color de serie.
 */

import { useTheme } from '@/contexts/ThemeContext'

const LIGHT = {
  categorical: ['#7c3aed', '#059669', '#d97706', '#0284c7', '#e11d48'],
  sequential:  ['#ede9fe', '#c4b5fd', '#a78bfa', '#7c3aed', '#5b21b6'],
  muted:       '#c7c3ea',
  grid:        '#e6e3ff',
  axis:        '#9896c0',
  status: { good: '#059669', warning: '#d97706', serious: '#e11d48' },
}

const DARK = {
  categorical: ['#8b5cf6', '#059669', '#d97706', '#0284c7', '#f43f5e'],
  sequential:  ['#2e1f5e', '#4c2f9a', '#6d3fd1', '#8b5cf6', '#b69bff'],
  muted:       '#3a3670',
  grid:        '#2c2857',
  axis:        '#6660a0',
  status: { good: '#10b981', warning: '#f59e0b', serious: '#fb7185' },
}

/** Devuelve la paleta activa según el tema (light/dark). */
export function useChartTheme() {
  const theme = useTheme()
  return theme?.isDark ? DARK : LIGHT
}

/** Color de la serie `i` en orden fijo. */
export const seriesColor = (palette, i) => palette.categorical[i % palette.categorical.length]

/* ── Formatters ─────────────────────────────────────────────────────────── */

export const fmtCOP = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n ?? 0)

export const fmtCompact = (n) =>
  new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 1 }).format(n ?? 0)

export const fmtInt = (n) => new Intl.NumberFormat('es-CO').format(n ?? 0)

export const fmtPct = (n) => `${Math.round(n ?? 0)}%`

/* ── Props comunes de Recharts ──────────────────────────────────────────── */

export const AXIS_TICK = { fontSize: 11, fill: 'var(--text-3)' }

export const axisProps = (palette) => ({
  axisLine: false,
  tickLine: false,
  tick: AXIS_TICK,
  stroke: palette.axis,
})

export const gridProps = (palette) => ({
  strokeDasharray: '3 3',
  stroke: palette.grid,
  vertical: false,
})

/** Cursor de hover para BarChart: relleno sutil, no una barra sólida. */
export const barCursor = { fill: 'var(--primary-10)', radius: 6 }

/** Cursor de hover para LineChart: crosshair vertical. */
export const lineCursor = (palette) => ({ stroke: palette.axis, strokeDasharray: '4 3', strokeWidth: 1 })
