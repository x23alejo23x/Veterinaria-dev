import { useState } from 'react'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { motion } from 'framer-motion'

const Field = ({ id, label, icon: Icon, error, children }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)]">{label}</label>
    <div className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all ${error ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-500/5 ring-2 ring-rose-400/20' : 'border-[var(--border)] bg-[var(--surface-2)] focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-400/15'}`}>
      <Icon size={15} className="shrink-0 text-[var(--text-3)]" />
      {children}
    </div>
    {error && <p role="alert" aria-live="polite" className="text-xs font-medium text-rose-500">{error}</p>}
  </div>
)

/**
 * LoginForm — formulario de autenticación.
 * @param {Function} onSubmit  — callback({ user, password })
 * @param {boolean}  loading
 * @param {string}   error
 */
export function LoginForm({ onSubmit, loading, error }) {
  const [user,     setUser]     = useState('')
  const [pass,     setPass]     = useState('')
  const [showPass, setShowPass] = useState(false)
  const [touched,  setTouched]  = useState({ user: false, pass: false })

  const userErr = touched.user && !user.trim() ? 'Ingresa tu usuario' : ''
  const passErr = touched.pass && !pass.trim() ? 'Ingresa tu contraseña' : ''

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ user: true, pass: true })
    if (!user.trim() || !pass.trim()) return
    onSubmit({ user: user.trim(), password: pass })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field id="login-user" label="Usuario" icon={User} error={userErr}>
        <input
          id="login-user"
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-3)]"
          placeholder="tu.usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, user: true }))}
          autoComplete="username"
          aria-required="true"
        />
      </Field>

      <Field id="login-pass" label="Contraseña" icon={Lock} error={passErr}>
        <input
          id="login-pass"
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-3)]"
          type={showPass ? 'text' : 'password'}
          placeholder="••••••••"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, pass: true }))}
          autoComplete="current-password"
          aria-required="true"
        />
        <button
          type="button"
          onClick={() => setShowPass((s) => !s)}
          aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[var(--text-3)] transition hover:text-[var(--text)]"
        >
          {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </Field>

      {/* Error del servidor */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          role="alert" aria-live="assertive"
          className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 dark:border-rose-500/20 dark:bg-rose-500/10"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
          <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>
        </motion.div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
        style={{ minHeight: 44 }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Verificando…
          </span>
        ) : 'Iniciar sesión'}
      </button>
    </form>
  )
}
