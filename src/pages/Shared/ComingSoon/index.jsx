import { Sparkles } from 'lucide-react'
import { PageContainer } from '../../../components/layout/PageContainer'
import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'

export function ComingSoon({ eyebrow, title, icon: Icon }) {
  return (
    <PageContainer eyebrow={eyebrow} title={title} description="Esta funcionalidad estara disponible en futuras versiones.">
      <Card className="mx-auto grid min-h-[420px] max-w-3xl place-items-center p-10 text-center" hover={false}>
        <div>
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-blue-50 to-emerald-50 text-blue-600">
            <Icon size={34} />
          </div>
          <div className="mt-5"><Badge tone="amber">Proximamente</Badge></div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Modulo en desarrollo</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">Lo dejamos visible para comunicar alcance sin simular datos operativos. Mantendra la misma experiencia visual del sistema.</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-bold text-slate-700"><Sparkles size={16} /> Listo para la siguiente fase</div>
        </div>
      </Card>
    </PageContainer>
  )
}
