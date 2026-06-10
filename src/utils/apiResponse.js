/**
 * apiResponse — utilidad global para normalizar respuestas de API.
 *
 * Todos los servicios por página retornan un objeto con esta forma:
 *   { data, loading, error, empty, refetch, reset }
 *
 * Helpers de extracción (adaptar según contrato del backend):
 *   - unwrap(res)     → extrae res.data.items ?? res.data ?? res
 *   - paginated(res)  → { items, total, page, pageSize }
 *   - single(res)     → primer elemento o el objeto directo
 *
 * Helpers de estado de UI:
 *   - isEmpty(data)   → true si null, [], {} con 0 keys
 *   - isReady(state)  → true si !loading y !error y data !== null
 *
 * @example
 *   import { unwrap, isEmpty } from '@/utils/apiResponse'
 *
 *   const { data, loading, error } = useFetch('/patients', {
 *     transform: unwrap,
 *   })
 *   if (isEmpty(data)) return <EmptyState />
 */

/** Extrae el array / objeto real de la respuesta envuelta del backend. */
export const unwrap = (res) => res?.data?.items ?? res?.data ?? res ?? []

/** Normaliza una respuesta paginada. */
export const paginated = (res) => ({
  items:    res?.data?.items   ?? res?.data ?? [],
  total:    res?.data?.total   ?? res?.total   ?? 0,
  page:     res?.data?.page    ?? res?.page    ?? 1,
  pageSize: res?.data?.pageSize ?? res?.pageSize ?? 20,
})

/** Extrae un solo objeto (POST/PUT response). */
export const single = (res) => res?.data ?? res ?? null

/** True si data es null, undefined, array vacío u objeto sin keys. */
export const isEmpty = (data) => {
  if (data === null || data === undefined) return true
  if (Array.isArray(data)) return data.length === 0
  if (typeof data === 'object') return Object.keys(data).length === 0
  return false
}

/** True cuando la petición terminó sin errores y tiene datos. */
export const isReady = ({ loading, error, data }) => !loading && !error && data !== null

/**
 * Formatea mensajes de error de axios/fetch para mostrar al usuario.
 * Prioriza: backend message → status text → mensaje genérico.
 */
export const errorMessage = (err) =>
  err?.response?.data?.message ??
  err?.response?.data?.error   ??
  err?.message                 ??
  'Error inesperado. Intenta de nuevo.'
