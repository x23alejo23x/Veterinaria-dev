export function Input({ icon, className = '', ...props }) {
  return (
    <div className={`group relative flex items-center gap-2 rounded-xl border border-default-300 bg-default-50 px-3 py-2 transition-all dark:border-default-600 dark:bg-default-100 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 ${className}`}>
      {icon && <span className="shrink-0 text-default-400">{icon}</span>}
      <input
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-default-400"
        {...props}
      />
    </div>
  )
}
