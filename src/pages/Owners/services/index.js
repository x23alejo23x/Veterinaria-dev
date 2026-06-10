/**
 * Owners Service — capa de datos de la vista Propietarios.
 * Hereda de useFetch / useMutation (src/hooks/useFetch.js).
 */

import { useFetch, useMutation } from '@/hooks/useFetch'
import { paginated, single } from '@/utils/apiResponse'

const BASE = '/owners'

export function useOwners(params = {}) {
  return useFetch(BASE, { params, transform: paginated, fallback: { items: [], total: 0 } })
}

export function useOwner(id) {
  return useFetch(id ? `${BASE}/${id}` : null, { transform: single, fallback: null })
}

export function useCreateOwner(options = {}) {
  const m = useMutation('POST', BASE, { successMsg: 'Propietario creado', ...options })
  return { create: m.mutate, loading: m.loading, error: m.error }
}

export function useUpdateOwner(id, options = {}) {
  const m = useMutation('PUT', `${BASE}/${id}`, { successMsg: 'Propietario actualizado', ...options })
  return { update: m.mutate, loading: m.loading }
}

export function useDeleteOwner(options = {}) {
  const m = useMutation('DELETE', BASE, { successMsg: 'Propietario eliminado', ...options })
  return { remove: (id) => m.mutate(null, `${BASE}/${id}`), loading: m.loading }
}
