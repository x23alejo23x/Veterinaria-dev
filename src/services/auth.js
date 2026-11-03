import api from '@/services/api'

const SESSION_KEY = 'vet-session'

export const sessionService = {
  save(data) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data))
  },

  get() {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  isAuthenticated() {
    return !!this.get()
  },

  clear() {
    localStorage.removeItem(SESSION_KEY)
  },

  getRole() {
    return this.get()?.role ?? 'user'
  },
}

// ── Login — conectado al backend Laravel ─────────────────
export async function loginService({ user, password }) {
  const { data } = await api.post('/auth/login', { email: user, password })

  return {
    userId: data.user.id,
    userNt: data.user.email,
    role:   data.user.role,
    name:   data.user.name,
    correo: data.user.email,
    token:  data.token,
  }
}
