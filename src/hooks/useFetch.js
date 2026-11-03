import { useCallback, useEffect, useRef, useState } from 'react'
import api from '@/services/api'

/**
 * useFetch — hook genérico para peticiones GET con cache por clave.
 *
 * @param {string|null} url     — endpoint relativo (/patients) o null para no ejecutar
 * @param {object}      options
 *   @prop {boolean}  immediate   — ejecutar automáticamente al montar (default: true)
 *   @prop {*}        fallback    — valor inicial mientras carga (default: null)
 *   @prop {function} transform   — transformar la respuesta antes de guardarla
 *   @prop {object}   params      — query params { page: 1, limit: 20 }
 *
 * @returns {{ data, loading, error, refetch, reset }}
 *
 * @example
 *   // GET automático
 *   const { data: patients, loading, error, refetch } = useFetch('/patients')
 *
 *   // Con transformación
 *   const { data } = useFetch('/patients', {
 *     transform: (res) => res.data.items,
 *   })
 *
 *   // Lazy (no ejecuta hasta llamar refetch)
 *   const { data, refetch: load } = useFetch('/report', { immediate: false })
 *   <button onClick={load}>Generar reporte</button>
 *
 * NOTE: Mientras no haya backend, los datos siguen viniendo del store Zustand.
 * Para conectar: reemplaza el mock en el servicio correspondiente con api.get(url).
 */
export function useFetch(url, options = {}) {
  const {
    immediate  = true,
    fallback   = null,
    transform  = null,
    params     = null,
  } = options

  const [data,    setData]    = useState(fallback)
  const [loading, setLoading] = useState(immediate && !!url)
  const [error,   setError]   = useState(null)

  // Evitar actualizaciones de state después de desmontar
  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  // Referencia estable de las opciones para el callback
  const transformRef = useRef(transform)
  transformRef.current = transform

  // JSON.stringify evita re-ejecuciones por identidad de objeto en cada render
  const paramsKey = JSON.stringify(params) // eslint-disable-line react-hooks/exhaustive-deps

  const execute = useCallback(async (overrideUrl, signal) => {
    const target = overrideUrl ?? url
    if (!target) return

    if (mountedRef.current) { setLoading(true); setError(null) }

    try {
      const res = await api.get(target, params ?? undefined, signal)
      const value = transformRef.current ? transformRef.current(res) : res
      if (mountedRef.current) setData(value)
      return value
    } catch (err) {
      if (err?.name === 'AbortError') return null  // StrictMode cleanup — no actualizar estado
      if (mountedRef.current) setError(err.message ?? 'Error al cargar datos')
      return null
    } finally {
      if (signal?.aborted) return
      if (mountedRef.current) setLoading(false)
    }
  }, [url, paramsKey]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!immediate || !url) return
    const controller = new AbortController()
    execute(undefined, controller.signal)
    return () => controller.abort()  // cancela la primera petición si StrictMode desmonta
  }, [url, immediate, execute])

  const reset = useCallback(() => {
    setData(fallback)
    setError(null)
    setLoading(false)
  }, [fallback])

  return { data, loading, error, refetch: execute, reset }
}


/**
 * useMutation — hook para POST / PUT / PATCH / DELETE.
 *
 * @param {'POST'|'PUT'|'PATCH'|'DELETE'} method
 * @param {string} url
 * @param {object} options
 *   @prop {function} onSuccess — callback(data) al completar
 *   @prop {function} onError   — callback(error) al fallar
 *   @prop {string}   successMsg — mensaje notify.success automático
 *
 * @returns {{ mutate, loading, error, data, reset }}
 *
 * @example
 *   const { mutate: createPatient, loading } = useMutation('POST', '/patients', {
 *     successMsg: 'Paciente creado',
 *     onSuccess: (data) => setPatients(prev => [...prev, data]),
 *   })
 *
 *   <button onClick={() => createPatient({ name: 'Luna', species: 'Canino' })}>
 *     Guardar
 *   </button>
 */
export function useMutation(method, url, options = {}) {
  const { onSuccess, onError, successMsg } = options

  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const mutate = useCallback(async (payload, overrideUrl) => {
    const target = overrideUrl ?? url
    if (mountedRef.current) { setLoading(true); setError(null) }

    try {
      const m   = method.toLowerCase()
      const res = m === 'delete'
        ? await api.delete(target)
        : await api[m](target, payload)

      if (mountedRef.current) setData(res)

      if (successMsg) {
        const { notify } = await import('../utils/notify')
        notify.success(successMsg)
      }

      onSuccess?.(res)
      return res
    } catch (err) {
      const msg = err.message ?? 'Error al guardar'
      if (mountedRef.current) setError(msg)

      const { notify } = await import('../utils/notify')
      notify.error(msg)

      onError?.(err)
      return null
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [method, url, onSuccess, onError, successMsg])

  const reset = useCallback(() => {
    setData(null); setError(null); setLoading(false)
  }, [])

  return { mutate, loading, error, data, reset }
}
