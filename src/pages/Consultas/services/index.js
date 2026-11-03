import { useFetch, useMutation } from '@/hooks/useFetch'
import { paginated, single } from '@/utils/apiResponse'

const BASE = '/consultas'
const BASE_EXAM_CATALOG = '/exam-catalog'

// ── Transformaciones snake_case → camelCase ──────────────────────────────────

function normalizeConsulta(raw) {
  if (!raw) return null
  return {
    ...raw,
    patientId:      raw.patient_id      ?? raw.patientId,
    appointmentId:  raw.appointment_id  ?? raw.appointmentId,
    chiefComplaint: raw.chief_complaint ?? raw.chiefComplaint,
    baseFee:        raw.base_fee        ?? raw.baseFee ?? 0,
    openedAt:       raw.opened_at       ?? raw.openedAt,
    closedAt:       raw.closed_at       ?? raw.closedAt,
  }
}

function normalizedPaginated(res) {
  const result = paginated(res)
  return { ...result, items: (result.items ?? []).map(normalizeConsulta) }
}

function normalizedSingle(res) {
  return normalizeConsulta(single(res))
}

// ── Payload builders (camelCase → snake_case) ────────────────────────────────

export function toConsultaPayload(data) {
  return {
    patient_id:      Number(data.patientId ?? data.patient_id),
    appointment_id:  data.appointmentId ?? data.appointment_id ?? null,
    vet:             data.vet,
    chief_complaint: data.chiefComplaint ?? data.chief_complaint ?? null,
    diagnosis:       data.diagnosis ?? null,
    base_fee:        Number(data.baseFee ?? data.base_fee ?? 0),
  }
}

export function toExamPayload(data) {
  return {
    name:       data.name,
    category:   data.category ?? null,
    unit_price: Number(data.unitPrice ?? data.unit_price),
    notes:      data.notes ?? null,
  }
}

export function toHospitalizationPayload(data) {
  return {
    days:          Number(data.days),
    price_per_day: Number(data.pricePerDay ?? data.price_per_day),
    notes:         data.notes ?? null,
  }
}

// ── Consulta CRUD ─────────────────────────────────────────────────────────────

export function useConsultas(params = {}, options = {}) {
  return useFetch(BASE, { params, transform: normalizedPaginated, fallback: { items: [], total: 0 }, ...options })
}

export function useConsulta(id) {
  return useFetch(id ? `${BASE}/${id}` : null, { transform: normalizedSingle, fallback: null })
}

export function useCreateConsulta(options = {}) {
  const m = useMutation('POST', BASE, { successMsg: 'Consulta creada', ...options })
  return { create: (data) => m.mutate(toConsultaPayload(data)), loading: m.loading, error: m.error }
}

export function useUpdateConsulta(id, options = {}) {
  const m = useMutation('PUT', `${BASE}/${id}`, { successMsg: 'Consulta actualizada', ...options })
  return { update: (data) => m.mutate(toConsultaPayload(data)), loading: m.loading, error: m.error }
}

export function useCloseConsulta(options = {}) {
  const m = useMutation('POST', BASE, { successMsg: 'Consulta cerrada', ...options })
  return { close: (id) => m.mutate(null, `${BASE}/${id}/close`), loading: m.loading }
}

export function useReopenConsulta(options = {}) {
  const m = useMutation('POST', BASE, { successMsg: 'Consulta reabierta', ...options })
  return { reopen: (id) => m.mutate(null, `${BASE}/${id}/reopen`), loading: m.loading }
}

export function useDeleteConsulta(options = {}) {
  const m = useMutation('DELETE', BASE, { successMsg: 'Consulta eliminada', ...options })
  return { remove: (id) => m.mutate(null, `${BASE}/${id}`), loading: m.loading }
}

// ── Exámenes de consulta ──────────────────────────────────────────────────────

export function useConsultaExams(consultaId) {
  return useFetch(consultaId ? `${BASE}/${consultaId}/exams` : null, {
    transform: paginated,
    fallback: { items: [] },
  })
}

export function useAddExam(consultaId, options = {}) {
  const m = useMutation('POST', `${BASE}/${consultaId}/exams`, { successMsg: 'Examen agregado', ...options })
  return { add: (data) => m.mutate(toExamPayload(data)), loading: m.loading }
}

export function useUpdateExam(consultaId, options = {}) {
  const m = useMutation('PUT', `${BASE}/${consultaId}/exams`, { successMsg: 'Examen actualizado', ...options })
  return { update: (examId, data) => m.mutate(toExamPayload(data), `${BASE}/${consultaId}/exams/${examId}`), loading: m.loading }
}

export function useDeleteExam(consultaId, options = {}) {
  const m = useMutation('DELETE', `${BASE}/${consultaId}/exams`, { successMsg: 'Examen eliminado', ...options })
  return { remove: (examId) => m.mutate(null, `${BASE}/${consultaId}/exams/${examId}`), loading: m.loading }
}

// ── Hospitalización ───────────────────────────────────────────────────────────

export function useHospitalization(consultaId) {
  return useFetch(consultaId ? `${BASE}/${consultaId}/hospitalization` : null, {
    transform: (res) => single(res),
    fallback: null,
  })
}

export function useUpsertHospitalization(consultaId, options = {}) {
  const m = useMutation('POST', `${BASE}/${consultaId}/hospitalization`, { successMsg: 'Hospitalización guardada', ...options })
  return { upsert: (data) => m.mutate(toHospitalizationPayload(data)), loading: m.loading }
}

export function useDeleteHospitalization(consultaId, options = {}) {
  const m = useMutation('DELETE', `${BASE}/${consultaId}/hospitalization`, { successMsg: 'Hospitalización eliminada', ...options })
  return { remove: () => m.mutate(null), loading: m.loading }
}

// ── Catálogo de exámenes ──────────────────────────────────────────────────────

export function useExamCatalog(options = {}) {
  return useFetch(BASE_EXAM_CATALOG, { transform: paginated, fallback: { items: [] }, ...options })
}
