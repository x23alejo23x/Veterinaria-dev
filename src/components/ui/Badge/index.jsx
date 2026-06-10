const tones = {
  blue:  'bg-violet-50  text-violet-700  dark:bg-violet-500/15 dark:text-violet-300',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  amber: 'bg-amber-50   text-amber-700   dark:bg-amber-500/15  dark:text-amber-300',
  rose:  'bg-rose-50    text-rose-700    dark:bg-rose-500/15   dark:text-rose-300',
}

export function Badge({ children, tone = 'blue', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone] ?? tones.blue} ${className}`}>
      {children}
    </span>
  )
}
