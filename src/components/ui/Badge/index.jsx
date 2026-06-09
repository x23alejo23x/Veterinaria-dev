const tones = {
  blue:  'bg-blue-50   text-blue-700   dark:bg-blue-500/10  dark:text-blue-400',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  amber: 'bg-amber-50  text-amber-700  dark:bg-amber-500/10  dark:text-amber-400',
  rose:  'bg-rose-50   text-rose-700   dark:bg-rose-500/10   dark:text-rose-400',
}

export function Badge({ children, tone = 'blue', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone] ?? tones.blue} ${className}`}>
      {children}
    </span>
  )
}
