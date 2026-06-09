const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20',
  default: 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-2)]',
  ghost:   'text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]',
  danger:  'bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-500/20',
}

export function Button({ children, variant = 'default', className = '', type = 'button', onClick, ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:opacity-50 ${variants[variant] ?? variants.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
