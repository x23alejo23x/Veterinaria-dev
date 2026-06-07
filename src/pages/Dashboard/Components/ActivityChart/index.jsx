import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { visitChart } from '../../../../constants'
import { Card } from '../../../../components/ui/Card'

export function ActivityChart() {
  return (
    <Card className="p-5" hover={false}>
      <h2 className="text-lg font-extrabold text-slate-950">Actividad clinica semanal</h2>
      <p className="mt-1 text-sm text-slate-500">Citas atendidas y altas medicas</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={visitChart}>
            <CartesianGrid stroke="#e5edf3" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="citas" stroke="#156ff7" strokeWidth={3} fill="#eaf3ff" />
            <Area type="monotone" dataKey="altas" stroke="#20b486" strokeWidth={3} fill="transparent" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
