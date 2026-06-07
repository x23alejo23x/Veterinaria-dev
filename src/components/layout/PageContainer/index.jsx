import { motion } from 'framer-motion'

export function PageContainer({ eyebrow, title, description, actions, children }) {
  return (
    <motion.section
      className="mx-auto w-full max-w-[1420px] px-4 py-6 sm:px-6 lg:px-7"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28 }}
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          {eyebrow ? <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-blue-600">{eyebrow}</p> : null}
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{title}</h1>
          {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </motion.section>
  )
}
