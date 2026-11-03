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

const BASE = '/patients'

// Convierte los datos del formulario (camelCase) al contrato del backend (snake_case)
export function toApiPayload(data) {
  return {
    name:         data.name,
    species:      data.species,
    breed:        data.breed,
    age:          Number(data.age),
    weight:       Number(data.weight),
    owner_id:     Number(data.ownerId ?? data.owner_id),
    status:       data.status || null,
    avatar_color: data.avatar_color || null,
    next_visit:   data.next_visit || null,
  }
}

/**
 * usePatients — lista paginada de pacientes.
 * @param {{ page?, limit?, species?, search? }} params
 */
export function usePatients(params = {}, options = {}) {
  return useFetch(BASE, {
    params,
    transform: paginated,
    fallback: { items: [], total: 0, page: 1, pageSize: 20 },
    ...options,
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
  return { create: (data) => mutation.mutate(toApiPayload(data)), loading: mutation.loading, error: mutation.error }
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
  return { update: (data) => mutation.mutate(toApiPayload(data)), loading: mutation.loading, error: mutation.error }
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
