/**
 * Capa de autenticación — lista para conectar con backend real.
 *
 * HOW TO SWAP TO REAL API:
 *   1. Reemplaza `mockLogin` con un llamado a `api.post('/auth/login', credentials)`
 *   2. Guarda el JWT en `session.token` y adjúntalo en `api.js` interceptor
 *   3. El resto del sistema (ProtectedRoute, RBAC) no cambia
 */

import api from '@/services/api'

const SESSION_KEY = 'vet-session'

// ── Tipos de sesión esperados del backend ──────────────────
// { userId, userNt, rolId, correo, token, name, role }

export const sessionService = {

  /** Guardar sesión después del login */
  save(data) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data))
  },

  /** Leer sesión actual */
  get() {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  /** ¿Está autenticado? */
  isAuthenticated() {
    return !!this.get()
  },

  /** Limpiar sesión (logout) */
  clear() {
    localStorage.removeItem(SESSION_KEY)
  },

  /** Rol del usuario */
  getRole() {
    return this.get()?.role ?? 'user'
  },
}

// ── Login —————————————————————————————————————————————────
/**
 * Mock login — valida contra variables de entorno.
 * SWAP TO REAL: return api.post('/auth/login', { correo, password })
 */
export async function loginService({ user, password }) {
  const VALID_USER = import.meta.env.VITE_LOGIN_USER
  const VALID_PASS = import.meta.env.VITE_LOGIN_PASS
  const VALID_ROLE = import.meta.env.VITE_LOGIN_ROLE ?? 'admin'

  // Simular latencia de red
  await new Promise((r) => setTimeout(r, 500))

  if (user !== VALID_USER || password !== VALID_PASS) {
    throw new Error('Usuario o contraseña incorrectos')
  }

  return {
    userId:  1,
    userNt:  user,
    role:    VALID_ROLE,
    name:    'Dra. Valentina Rios',
    correo:  'admin@nuravet.com',
    token:   'mock-jwt-token',   // ← reemplazar con JWT real
  }
}
