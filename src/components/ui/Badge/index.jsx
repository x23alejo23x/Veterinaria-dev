const tones = {
  blue: 'bg-blue-50 text-blue-700 ring-blue-100',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  rose: 'bg-rose-50 text-rose-700 ring-rose-100',
}

export function Badge({ children, tone = 'blue', className = '' }) {
  return (
    <span className={`inline-flex min-h-6 items-center rounded-full px-2.5 text-xs font-bold ring-1 ${tones[tone] ?? tones.blue} ${className}`}>
      {children}
    </span>
  )
}
