import { motion } from 'framer-motion'

export function PageContainer({ eyebrow, title, description, actions, children, scrollable = false }) {
  return (
    <motion.section
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18 }}
    >
      {/* Encabezado fijo — compacto */}
      <div className="shrink-0 px-5 pb-3 pt-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {eyebrow && (
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">{eyebrow}</p>
            )}
            <h1 className="text-xl font-bold tracking-tight text-[var(--text)] sm:text-2xl">{title}</h1>
            {description && (
              <p className="mt-0.5 text-xs text-[var(--text-3)]">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </div>
      </div>

      {/* Área de contenido */}
      <div className={`flex min-h-0 flex-1 flex-col px-5 pb-4 ${scrollable ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        {children}
      </div>
    </motion.section>
  )
}
