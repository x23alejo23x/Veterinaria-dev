/**
 * Owners Service — capa de datos de la vista Propietarios.
 * Hereda de useFetch / useMutation (src/hooks/useFetch.js).
 */

import { useFetch, useMutation } from '@/hooks/useFetch'
import { paginated, single } from '@/utils/apiResponse'

const BASE = '/owners'

// Solo envía los campos que el backend acepta
export function toApiPayload(data) {
  return { name: data.name, email: data.email, phone: data.phone, city: data.city }
}

export function useOwners(params = {}, options = {}) {
  return useFetch(BASE, { params, transform: paginated, fallback: { items: [], total: 0 }, ...options })
}

export function useOwner(id) {
  return useFetch(id ? `${BASE}/${id}` : null, { transform: single, fallback: null })
}

export function useCreateOwner(options = {}) {
  const m = useMutation('POST', BASE, { successMsg: 'Propietario creado', ...options })
  return { create: (data) => m.mutate(toApiPayload(data)), loading: m.loading, error: m.error }
}

export function useUpdateOwner(id, options = {}) {
  const m = useMutation('PUT', `${BASE}/${id}`, { successMsg: 'Propietario actualizado', ...options })
  return { update: (data) => m.mutate(toApiPayload(data)), loading: m.loading }
}

export function useDeleteOwner(options = {}) {
  const m = useMutation('DELETE', BASE, { successMsg: 'Propietario eliminado', ...options })
  return { remove: (id) => m.mutate(null, `${BASE}/${id}`), loading: m.loading }
}
