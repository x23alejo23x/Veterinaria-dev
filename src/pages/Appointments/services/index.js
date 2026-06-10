/**
 * Appointments Service — capa de datos de la vista Agenda.
 * Hereda de useFetch / useMutation (src/hooks/useFetch.js).
 */

import { useFetch, useMutation } from '@/hooks/useFetch'
import { paginated } from '@/utils/apiResponse'

const BASE = '/appointments'

export function useAppointments(params = {}) {
  return useFetch(BASE, { params, transform: paginated, fallback: { items: [], total: 0 } })
}

export function useCreateAppointment(options = {}) {
  const m = useMutation('POST', BASE, { successMsg: 'Cita programada', ...options })
  return { create: m.mutate, loading: m.loading, error: m.error }
}

export function useUpdateAppointment(id, options = {}) {
  const m = useMutation('PUT', `${BASE}/${id}`, { successMsg: 'Cita actualizada', ...options })
  return { update: m.mutate, loading: m.loading }
}

export function useDeleteAppointment(options = {}) {
  const m = useMutation('DELETE', BASE, { successMsg: 'Cita eliminada', ...options })
  return { remove: (id) => m.mutate(null, `${BASE}/${id}`), loading: m.loading }
}
