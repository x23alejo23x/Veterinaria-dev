export function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)]
        shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)]
        dark:shadow-[0_1px_4px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.25)]
        ${hover ? 'transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]' : ''}
        ${className}`}
    >
      {children}
    </div>
  )
}
