export function Button({ children, variant = 'default', className = '', type = 'button', ...props }) {
  const variants = {
    default: 'bg-white/75 text-slate-700 ring-1 ring-slate-200 hover:bg-white hover:shadow-lg',
    primary: 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30',
    ghost: 'bg-transparent text-slate-600 hover:bg-white/70',
    danger: 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/20',
  }

  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${variants[variant] ?? variants.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
