import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, X } from 'lucide-react'

/**
 * Dialog de confirmación reutilizable — evita el `window.confirm` nativo.
 *
 * @example
 *   const { confirm, ConfirmDialog } = useConfirm()
 *
 *   const handleDelete = async () => {
 *     const ok = await confirm({
 *       title: 'Eliminar paciente',
 *       message: '¿Seguro que deseas eliminar a Luna? Esta acción no se puede deshacer.',
 *       danger: true,
 *     })
 *     if (ok) deletePatient(id)
 *   }
 *
 *   return (
 *     <>
 *       <button onClick={handleDelete}>Eliminar</button>
 *       <ConfirmDialog />  ← renderizar una vez en el componente
 *     </>
 *   )
 */
export function useConfirm() {
  const [state, setState] = useState(null) // { title, message, danger, resolve }

  const confirm = useCallback(({ title = '¿Confirmar?', message = '', danger = false } = {}) => {
    return new Promise((resolve) => {
      setState({ title, message, danger, resolve })
    })
  }, [])

  const handleClose = (result) => {
    state?.resolve(result)
    setState(null)
  }

  const ConfirmDialog = useCallback(() => {
    if (!state) return null
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className={`grid h-8 w-8 place-items-center rounded-lg ${state.danger ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-blue-50 text-violet-600 dark:bg-blue-500/10 dark:text-blue-400'}`}>
                <AlertTriangle size={15} />
              </div>
              <p className="font-semibold text-[var(--text)]">{state.title}</p>
            </div>
            <button onClick={() => handleClose(false)} className="grid h-7 w-7 place-items-center rounded-lg text-[var(--text-3)] hover:bg-[var(--surface-2)]">
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          {state.message && (
            <div className="px-5 py-4">
              <p className="text-sm text-[var(--text-2)]">{state.message}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t border-[var(--border)] px-5 py-3">
            <button
              onClick={() => handleClose(false)}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-2)] hover:bg-[var(--surface-2)]"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleClose(true)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${state.danger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-gradient-to-br from-violet-600 to-indigo-600 hover:bg-blue-700'}`}
            >
              {state.danger ? 'Sí, eliminar' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>,
      document.body
    )
  }, [state])

  return { confirm, ConfirmDialog }
}
