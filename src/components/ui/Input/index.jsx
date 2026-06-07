export function Input({ icon, className = '', ...props }) {
  return (
    <label className={`flex min-h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white/75 px-3 text-slate-500 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 ${className}`}>
      {icon}
      <input className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" {...props} />
    </label>
  )
}
