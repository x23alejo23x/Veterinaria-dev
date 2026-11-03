const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

function getToken() {
  try {
    const session = JSON.parse(localStorage.getItem('vet-session') ?? 'null')
    return session?.token ?? null
  } catch {
    return null
  }
}

async function request(path, { method = 'GET', body, params, signal } = {}) {
  const url = new URL(`${BASE_URL}${path}`)

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
    })
  }

  const token = getToken()
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const error = new Error(data?.message ?? `HTTP ${res.status}`)
    error.status = res.status
    error.data = data
    throw error
  }

  return data
}

export const api = {
  get:    (path, params, signal) => request(path, { params, signal }),
  post:   (path, body)           => request(path, { method: 'POST', body }),
  put:    (path, body)           => request(path, { method: 'PUT', body }),
  patch:  (path, body)           => request(path, { method: 'PATCH', body }),
  delete: (path)                 => request(path, { method: 'DELETE' }),
}

export default api
