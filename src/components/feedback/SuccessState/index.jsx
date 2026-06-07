export function SuccessState({ message = 'Operacion completada.' }) {
  return <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm font-semibold text-emerald-700">{message}</div>
}
