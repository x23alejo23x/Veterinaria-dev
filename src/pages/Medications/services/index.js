/**
 * Medications Service — capa de datos de la vista Medicamentos.
 * Hereda de useFetch / useMutation (src/hooks/useFetch.js).
 * Conectar endpoints cuando haya backend real.
 */

import { useFetch, useMutation } from '@/hooks/useFetch'
import { paginated, single } from '@/utils/apiResponse'

const BASE_MEDS = '/medications'
const BASE_RX   = '/prescriptions'

export function useMedications(params = {}) {
  return useFetch(BASE_MEDS, { params, transform: paginated, fallback: { items: [], total: 0 } })
}

export function useCreateMedication(options = {}) {
  const m = useMutation('POST', BASE_MEDS, { successMsg: 'Medicamento agregado', ...options })
  return { create: m.mutate, loading: m.loading, error: m.error }
}

export function useUpdateMedication(id, options = {}) {
  const m = useMutation('PUT', `${BASE_MEDS}/${id}`, { successMsg: 'Medicamento actualizado', ...options })
  return { update: m.mutate, loading: m.loading }
}

export function useDeleteMedication(options = {}) {
  const m = useMutation('DELETE', BASE_MEDS, { successMsg: 'Medicamento eliminado', ...options })
  return { remove: (id) => m.mutate(null, `${BASE_MEDS}/${id}`), loading: m.loading }
}

export function usePrescriptions(params = {}) {
  return useFetch(BASE_RX, { params, transform: paginated, fallback: { items: [], total: 0 } })
}

export function useCreatePrescription(options = {}) {
  const m = useMutation('POST', BASE_RX, { successMsg: 'Prescripción guardada', ...options })
  return { create: m.mutate, loading: m.loading, error: m.error }
}
