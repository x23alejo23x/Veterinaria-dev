/**
 * Servicios de Seguimientos — listos para conectar al backend.
 *
 * HOW TO SWAP:
 *   1. Descomentar las URLs de los hooks de useFetch / useMutation
 *   2. En FollowUpsView cambiar useAppStore por useFollowUps()
 *   3. El backend debe implementar GET/POST/PUT/DELETE /follow-ups
 */

// import { useFetch, useMutation } from '@/hooks/useFetch'
// import { paginated, single }     from '@/utils/apiResponse'

/* ── GET /follow-ups ── */
// export const useFollowUps = (params) =>
//   useFetch('/follow-ups', { transform: paginated, params })

/* ── GET /follow-ups/:id ── */
// export const useFollowUp = (id) =>
//   useFetch(id ? `/follow-ups/${id}` : null, { transform: single })

/* ── POST /follow-ups ── */
// export const useCreateFollowUp = (opts) =>
//   useMutation('POST', '/follow-ups', { successMsg: 'Seguimiento creado', ...opts })

/* ── PUT /follow-ups/:id ── */
// export const useUpdateFollowUp = (id, opts) =>
//   useMutation('PUT', `/follow-ups/${id}`, { successMsg: 'Seguimiento actualizado', ...opts })

/* ── DELETE /follow-ups/:id ── */
// export const useDeleteFollowUp = (id, opts) =>
//   useMutation('DELETE', `/follow-ups/${id}`, { successMsg: 'Seguimiento eliminado', ...opts })
