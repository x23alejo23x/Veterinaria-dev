/**
 * Patients Service — capa de datos de la vista Pacientes.
 *
 * Cada servicio de página:
 *   1. Importa los hooks globales useFetch / useMutation de src/hooks/useFetch.js
 *   2. Importa helpers de src/utils/apiResponse.js
 *   3. Expone hooks específicos de la entidad (usePatients, useCreatePatient, etc.)
 *   4. NO accede al store directamente — eso es responsabilidad de View/index.jsx
 *
 * Para conectar con el backend: reemplazar las URLs comentadas.
 * Mientras no hay backend, el store Zustand es la fuente de verdad.
 *
 * @example — en View/index.jsx (cuando haya backend):
 *   const { patients, loading, error, refetch } = usePatients()
 *   const { create, loading: creating } = useCreatePatient({ onSuccess: refetch })
 */

import { useFetch, useMutation } from '@/hooks/useFetch'
import { paginated, single } from '@/utils/apiResponse'

// ── Endpoints (conectar cuando haya backend) ──────────────────────────────────
const BASE = '/patients'

/**
 * usePatients — lista paginada de pacientes.
 * @param {{ page?, limit?, species?, search? }} params
 */
export function usePatients(params = {}) {
  return useFetch(BASE, {
    params,
    transform: paginated,
    fallback: { items: [], total: 0, page: 1, pageSize: 20 },
  })
}

/**
 * usePatient — perfil de un paciente por ID.
 * @param {string|null} id
 */
export function usePatient(id) {
  return useFetch(id ? `${BASE}/${id}` : null, {
    transform: single,
    fallback: null,
  })
}

/**
 * useCreatePatient — POST /patients
 * @param {{ onSuccess?: Function }} options
 */
export function useCreatePatient(options = {}) {
  const mutation = useMutation('POST', BASE, {
    successMsg: 'Paciente creado correctamente',
    ...options,
  })
  return { create: mutation.mutate, loading: mutation.loading, error: mutation.error }
}

/**
 * useUpdatePatient — PUT /patients/:id
 * @param {string} id
 * @param {{ onSuccess?: Function }} options
 */
export function useUpdatePatient(id, options = {}) {
  const mutation = useMutation('PUT', `${BASE}/${id}`, {
    successMsg: 'Paciente actualizado',
    ...options,
  })
  return { update: mutation.mutate, loading: mutation.loading, error: mutation.error }
}

/**
 * useDeletePatient — DELETE /patients/:id
 * @param {{ onSuccess?: Function }} options
 */
export function useDeletePatient(options = {}) {
  const mutation = useMutation('DELETE', BASE, {
    successMsg: 'Paciente eliminado',
    ...options,
  })
  return {
    remove: (id) => mutation.mutate(null, `${BASE}/${id}`),
    loading: mutation.loading,
  }
}
