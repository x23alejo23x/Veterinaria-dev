/**
 * PatientProfile Service — capa de datos del perfil de paciente.
 * Hereda de useFetch (src/hooks/useFetch.js).
 */

import { useFetch } from '@/hooks/useFetch'
import { single } from '@/utils/apiResponse'

const BASE = '/patients'

/**
 * usePatientProfile — paciente + historial + prescripciones en paralelo.
 * @param {string} id — id del paciente (de useParams)
 */
export function usePatientProfile(id) {
  const patient = useFetch(id ? `${BASE}/${id}` : null, {
    transform: single, fallback: null,
  })
  const history = useFetch(id ? `${BASE}/${id}/history` : null, {
    fallback: [],
  })
  const prescriptions = useFetch(id ? `${BASE}/${id}/prescriptions` : null, {
    fallback: [],
  })
  return { patient, history, prescriptions }
}
