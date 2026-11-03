/**
 * Medications Service — capa de datos de la vista Medicamentos.
 * Hereda de useFetch / useMutation (src/hooks/useFetch.js).
 * Conectar endpoints cuando haya backend real.
 */

import { useFetch, useMutation } from '@/hooks/useFetch'
import { paginated, single } from '@/utils/apiResponse'

const BASE_MEDS = '/medications'
const BASE_RX   = '/prescriptions'

// Convierte datos del formulario (camelCase) al contrato del backend (snake_case)
export function toPrescriptionPayload(data) {
  return {
    patient_id:    Number(data.patientId    ?? data.patient_id),
    medication_id: Number(data.medicationId ?? data.medication_id),
    dose:          data.dose,
    frequency:     data.frequency,
    duration:      data.duration,
    notes:         data.notes     || null,
    status:        data.status    || 'Activa',
    vet:           data.vet       || null,
    date:          data.date      || null,
  }
}

export function useMedications(params = {}, options = {}) {
  return useFetch(BASE_MEDS, { params, transform: paginated, fallback: { items: [], total: 0 }, ...options })
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

function normalizePrescription(rx) {
  return {
    ...rx,
    medicationId: rx.medication_id ?? rx.medicationId,
    patientId:    rx.patient_id   ?? rx.patientId,
  }
}

function normalizedPaginated(res) {
  const result = paginated(res)
  return { ...result, items: (result.items ?? []).map(normalizePrescription) }
}

export function usePrescriptions(params = {}, options = {}) {
  return useFetch(BASE_RX, { params, transform: normalizedPaginated, fallback: { items: [], total: 0 }, ...options })
}

export function useCreatePrescription(options = {}) {
  const m = useMutation('POST', BASE_RX, { successMsg: 'Prescripción guardada', ...options })
  return { create: (data) => m.mutate(toPrescriptionPayload(data)), loading: m.loading, error: m.error }
}

export function useUpdatePrescription(id, options = {}) {
  const m = useMutation('PUT', `${BASE_RX}/${id}`, { successMsg: 'Prescripción actualizada', ...options })
  return { update: (data) => m.mutate(toPrescriptionPayload(data)), loading: m.loading }
}

export function useDeletePrescription(options = {}) {
  const m = useMutation('DELETE', BASE_RX, { successMsg: 'Prescripción eliminada', ...options })
  return { remove: (id) => m.mutate(null, `${BASE_RX}/${id}`), loading: m.loading }
}

/* ── Catálogo de exámenes ── */

const BASE_EXAM_CATALOG = '/exam-catalog'

export function useExamCatalogList(params = {}, options = {}) {
  return useFetch(BASE_EXAM_CATALOG, { params, transform: paginated, fallback: { items: [], total: 0 }, ...options })
}

export function useCreateExamCatalogItem(options = {}) {
  const m = useMutation('POST', BASE_EXAM_CATALOG, { successMsg: 'Examen agregado al catálogo', ...options })
  return { create: m.mutate, loading: m.loading, error: m.error }
}

export function useUpdateExamCatalogItem(id, options = {}) {
  const m = useMutation('PUT', `${BASE_EXAM_CATALOG}/${id}`, { successMsg: 'Examen actualizado', ...options })
  return { update: m.mutate, loading: m.loading }
}

export function useDeleteExamCatalogItem(options = {}) {
  const m = useMutation('DELETE', BASE_EXAM_CATALOG, { successMsg: 'Examen eliminado', ...options })
  return { remove: (id) => m.mutate(null, `${BASE_EXAM_CATALOG}/${id}`), loading: m.loading }
}
