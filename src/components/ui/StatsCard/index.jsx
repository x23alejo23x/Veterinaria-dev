import { Card } from '../Card'
import { Badge } from '../Badge'

export function StatsCard({ icon: Icon, label, value, subtitle, trend, tone = 'blue' }) {
  const iconTone = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${iconTone[tone] ?? iconTone.blue}`}>
          <Icon size={18} />
        </div>
        {trend ? <Badge tone={tone}>{trend}</Badge> : null}
      </div>
      <p className="mt-4 text-3xl font-black tracking-tight text-slate-900">{value}</p>
      <p className="font-bold text-slate-700">{label}</p>
      {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
    </Card>
  )
}
