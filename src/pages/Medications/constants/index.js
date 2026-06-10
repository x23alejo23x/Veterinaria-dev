/** Colores visuales por categoría de medicamento */
export const catColor = {
  Gastroprotector:  { bg: 'bg-orange-50 dark:bg-orange-500/10',   icon: 'text-orange-600 dark:text-orange-400',   badge: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' },
  Antibiotico:      { bg: 'bg-blue-50   dark:bg-blue-500/10',     icon: 'text-violet-600  dark:text-blue-400',     badge: 'bg-blue-100   text-blue-700   dark:bg-blue-500/20   dark:text-blue-400'   },
  Antiinflamatorio: { bg: 'bg-rose-50   dark:bg-rose-500/10',     icon: 'text-rose-600   dark:text-rose-400',     badge: 'bg-rose-100   text-rose-700   dark:bg-rose-500/20   dark:text-rose-400'   },
  Anestésico:       { bg: 'bg-violet-50 dark:bg-violet-500/10',   icon: 'text-violet-600 dark:text-violet-400',   badge: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400' },
  Vitamina:         { bg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' },
}

export const getCat = (cat) =>
  catColor[cat] ?? { bg: 'bg-slate-50 dark:bg-slate-500/10', icon: 'text-slate-600 dark:text-slate-400', badge: 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400' }

export const emptyMed = { name: '', concentration: '', unit: 'mg/ml', category: '' }

export const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
