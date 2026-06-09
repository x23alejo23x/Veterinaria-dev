import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, PawPrint, User } from 'lucide-react'
import { notify } from '../../../utils/notify'
import { loginService, sessionService } from '../../../services/auth'

export function AuthView() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname ?? '/dashboard'

  const [user,    setUser]    = useState('')
  const [pass,    setPass]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!user || !pass) { setError('Completa todos los campos'); return }

    setError('')
    setLoading(true)

    try {
      const session = await loginService({ user, password: pass })
      sessionService.save(session)
      notify.success(`Bienvenido, ${session.name}`)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message ?? 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-[var(--bg)] p-6">
      <motion.div
        className="absolute inset-[-20%] bg-[radial-gradient(circle_at_22%_28%,rgba(21,111,247,.18),transparent_22rem),radial-gradient(circle_at_78%_18%,rgba(32,180,134,.18),transparent_24rem)] blur-xl"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 14, repeat: Infinity }}
      />
      <motion.section
        className="relative z-10 w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-white">
          <PawPrint size={22} />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-[var(--text)]">Bienvenido</h1>
        <p className="mt-1 text-sm text-[var(--text-3)]">Ingresa tus credenciales para continuar</p>

        <form className="mt-6 space-y-3" onSubmit={handleLogin}>
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/15">
            <User size={15} className="shrink-0 text-[var(--text-3)]" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-3)]"
              placeholder="Usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/15">
            <Lock size={15} className="shrink-0 text-[var(--text-3)]" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-3)]"
              type="password"
              placeholder="Contraseña"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Verificando…' : 'Ingresar'}
          </button>
        </form>
      </motion.section>
    </main>
  )
}
