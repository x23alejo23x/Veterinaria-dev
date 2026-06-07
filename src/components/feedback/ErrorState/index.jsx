export function ErrorState({ message = 'No pudimos cargar la informacion.' }) {
  return <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-sm font-semibold text-rose-700">{message}</div>
}
