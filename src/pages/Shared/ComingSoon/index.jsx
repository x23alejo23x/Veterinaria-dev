import { Sparkles } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Badge } from '@/components/ui/Badge'

export function ComingSoon({ eyebrow, title, icon: Icon }) {
  return (
    <PageContainer eyebrow={eyebrow} title={title} description="Esta funcionalidad estará disponible en futuras versiones.">
      <div className="mx-auto flex min-h-[380px] max-w-2xl flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[var(--surface-2)] text-[var(--text-3)]">
          <Icon size={28} />
        </div>
        <div className="mt-4">
          <Badge tone="amber">Próximamente</Badge>
        </div>
        <h2 className="mt-3 text-xl font-bold text-[var(--text)]">Módulo en desarrollo</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--text-3)]">
          Lo dejamos visible para comunicar alcance sin simular datos operativos.
          Mantendrá la misma experiencia visual del sistema.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm font-medium text-[var(--text-2)]">
          <Sparkles size={14} /> Listo para la siguiente fase
        </div>
      </div>
    </PageContainer>
  )
}
