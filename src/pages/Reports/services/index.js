/**
 * Reports Service — capa de datos de la vista Reportes.
 *
 * Los agregados los calcula el backend (GROUP BY en Postgres) y devuelve
 * series listas para pintar. El front NO suma registros en memoria.
 *
 * Contrato de cada endpoint (todos aceptan ?range=3m|6m|12m):
 *   GET /reports/revenue-trend        → { data: [{ mes, actual, anterior }] }
 *   GET /reports/appointments-by-type → { data: [{ mes, General, Control, Vacunación, Cirugía, Urgencia }] }
 *   GET /reports/retention            → { data: [{ mes, nuevos, inactivos }] }
 *   GET /reports/pending-balance      → { data: [{ label: ownerName, value: balance, ownerId }] }
 *   GET /reports/top-medications      → { data: [{ label: medicationName, value: count, medicationId }] }
 *   GET /reports/vet-workload         → { data: [{ vet, General, Control, ... }] }
 *   GET /reports/reminders-due        → { data: [{ id, patient, owner, phone, type, due, status }] }
 *
 * Mientras no hay backend, cada hook devuelve seed data con la misma forma
 * { data, loading, error, refetch }. Para conectar: descomentar el `useFetch`
 * y borrar la línea `useSeed`.
 */

import { useEffect, useState } from 'react'
// import { useFetch } from '@/hooks/useFetch'
// import { unwrap } from '@/utils/apiResponse'
import {
  appointmentsByTypeSeed, pendingBalanceSeed, remindersDueSeed, retentionSeed,
  revenueTrendSeed, sliceByRange, topMedicationsSeed, vetWorkloadSeed,
} from '../constants'

// const BASE = '/reports'

/** Simula la latencia y la forma de useFetch mientras no hay backend. */
function useSeed(compute, deps) {
  const key = JSON.stringify(deps)
  const [state, setState] = useState({ key: null, data: null })
  const loading = state.key !== key

  useEffect(() => {
    const t = setTimeout(() => setState({ key, data: compute() }), 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return {
    data:    loading ? null : state.data,
    loading,
    error:   null,
    refetch: () => setState({ key, data: compute() }),
  }
}

export function useRevenueTrend(range) {
  // return useFetch(`${BASE}/revenue-trend`, { params: { range }, transform: unwrap, fallback: [] })
  return useSeed(() => sliceByRange(revenueTrendSeed, range), [range])
}

export function useAppointmentsByType(range) {
  // return useFetch(`${BASE}/appointments-by-type`, { params: { range }, transform: unwrap, fallback: [] })
  return useSeed(() => sliceByRange(appointmentsByTypeSeed, range), [range])
}

export function useRetention(range) {
  // return useFetch(`${BASE}/retention`, { params: { range }, transform: unwrap, fallback: [] })
  return useSeed(() => sliceByRange(retentionSeed, range), [range])
}

export function usePendingBalance() {
  // return useFetch(`${BASE}/pending-balance`, { transform: unwrap, fallback: [] })
  return useSeed(() => pendingBalanceSeed, [])
}

export function useTopMedications(range) {
  // return useFetch(`${BASE}/top-medications`, { params: { range }, transform: unwrap, fallback: [] })
  return useSeed(() => topMedicationsSeed, [range])
}

export function useVetWorkload(range) {
  // return useFetch(`${BASE}/vet-workload`, { params: { range }, transform: unwrap, fallback: [] })
  return useSeed(() => vetWorkloadSeed, [range])
}

export function useRemindersDue() {
  // return useFetch(`${BASE}/reminders-due`, { transform: unwrap, fallback: [] })
  return useSeed(() => remindersDueSeed, [])
}
