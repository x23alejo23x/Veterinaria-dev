import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

const iconTone = {
  blue:  'bg-blue-50  text-violet-600  dark:bg-blue-500/10  dark:text-blue-400',
  green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  rose:  'bg-rose-50  text-rose-600  dark:bg-rose-500/10  dark:text-rose-400',
}

export function StatsCard({ icon: Icon, label, value, subtitle, trend, tone = 'blue' }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className={`grid h-9 w-9 place-items-center rounded-xl ${iconTone[tone] ?? iconTone.blue}`}>
          <Icon size={17} />
        </div>
        {trend && <Badge tone={tone}>{trend}</Badge>}
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-[var(--text)]">{value}</p>
      <p className="text-sm font-semibold text-[var(--text-2)]">{label}</p>
      {subtitle && <p className="mt-0.5 text-xs text-[var(--text-3)]">{subtitle}</p>}
    </Card>
  )
}
