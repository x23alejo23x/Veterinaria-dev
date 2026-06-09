import toast from 'react-hot-toast'

/**
 * Sistema de notificaciones con niveles.
 * Wrappea react-hot-toast con defaults consistentes.
 *
 * Uso:
 *   notify.success('Paciente creado')
 *   notify.error('No se pudo guardar')
 *   notify.warning('Límite de pacientes al 90%')
 *   notify.promise(apiCall(), { loading: '...', success: 'OK', error: 'Error' })
 */
export const notify = {
  success: (msg) => toast.success(msg, { duration: 3000 }),
  error:   (msg) => toast.error(msg,   { duration: 5000 }),
  warning: (msg) => toast(msg, {
    duration: 4000,
    icon: '⚠️',
    style: {
      background: 'var(--surface)',
      color: '#92400e',
      border: '1px solid #f59e0b',
    },
  }),
  info: (msg) => toast(msg, {
    duration: 3500,
    icon: 'ℹ️',
    style: {
      background: 'var(--surface)',
      color: '#1e40af',
      border: '1px solid #3b82f6',
    },
  }),
  /** Promesa con loading/success/error automático */
  promise: (promise, msgs) => toast.promise(promise, msgs),
}
