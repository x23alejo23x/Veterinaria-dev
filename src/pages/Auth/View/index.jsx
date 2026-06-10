import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Eye, EyeOff, Lock, PawPrint, User } from 'lucide-react'
import { notify } from '@/utils/notify'
import { loginService, sessionService } from '@/services/auth'
import { PricingPanel } from '@/pages/Auth/Components/PricingPanel'
import { PLANS } from '@/pages/Auth/constants'

/* ── Input Island-style ── */
function AuthInput({ id, label, icon: Icon, type = 'text', placeholder, value, onChange, onBlur, error, right }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-violet-800">
        {label}
      </label>
      <div
        className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 transition-all bg-white/80 backdrop-blur-sm ${
          error
            ? 'border-rose-400 ring-2 ring-rose-300/40'
            : 'border-violet-300/60 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-400/25 hover:border-violet-400/70'
        }`}
        style={{ minHeight: 48 }}
      >
        <Icon size={15} className="shrink-0 text-violet-400" />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={id}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-violet-900 outline-none placeholder:font-normal placeholder:text-violet-400/70"
          aria-required="true"
          aria-describedby={error ? `${id}-err` : undefined}
        />
        {right}
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className="text-[11px] font-medium text-rose-500">
          {error}
        </p>
      )}
    </div>
  )
}

export function AuthView() {
  const navigate = useNavigate()
  const location = useLocation()
  const from           = location.state?.from?.pathname ?? '/dashboard'
  const prefersReduced = useReducedMotion()

  const [user,     setUser]     = useState('')
  const [pass,     setPass]     = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [touched,  setTouched]  = useState({ user: false, pass: false })

  const userErr = touched.user && !user.trim() ? 'Ingresa tu usuario' : ''
  const passErr = touched.pass && !pass.trim() ? 'Ingresa tu contraseña' : ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ user: true, pass: true })
    if (!user.trim() || !pass.trim()) return
    setError(''); setLoading(true)
    try {
      const session = await loginService({ user: user.trim(), password: pass })
      sessionService.save(session)
      notify.success(`Bienvenido, ${session.name}`)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message ?? 'Credenciales incorrectas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const spring = prefersReduced
    ? { type: 'tween', duration: 0 }
    : { type: 'spring', stiffness: 280, damping: 28, delay: 0.1 }

  return (
    <main
      className="flex min-h-svh"
      style={{ background: 'linear-gradient(160deg, #f2eeff 0%, #ede8ff 50%, #e8e2ff 100%)' }}
    >
      {/* ── Panel izquierdo: planes ── */}
      <div className="hidden lg:block lg:w-[54%] xl:w-[56%]">
        <PricingPanel />
      </div>

      {/* ── Divisor ── */}
      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-violet-300/40 to-transparent" />

      {/* ── Panel derecho: formulario Island-style ── */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-8 py-12 lg:px-14 xl:px-20">

        {/* Logo mobile */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
            <PawPrint size={15} className="text-white" />
          </div>
          <span className="text-sm font-black text-violet-900">Nura VetCare</span>
        </div>

        <motion.div
          className="w-full max-w-[360px]"
          initial={prefersReduced ? {} : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={spring}
        >
          {/* Header */}
          <div className="mb-8">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-500/70">
              Bienvenido de nuevo
            </p>
            <h1 className="text-[2.3rem] font-black leading-none tracking-tight text-violet-950">
              Iniciar<br />sesión
            </h1>
            <p className="mt-2.5 text-[13px] leading-snug text-violet-700/65">
              Accede a tu panel de gestión clínica
            </p>
          </div>

          {/* Formulario sin card — Island style */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <AuthInput
              id="username"
              label="Usuario"
              icon={User}
              placeholder="tu.usuario"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, user: true }))}
              error={userErr}
            />

            <AuthInput
              id="current-password"
              label="Contraseña"
              icon={Lock}
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, pass: true }))}
              error={passErr}
              right={
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-violet-400 transition hover:text-violet-600 hover:bg-violet-100/50"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                aria-live="assertive"
                className="rounded-xl bg-rose-50 px-3 py-2.5 text-[12px] font-medium text-rose-600 ring-1 ring-rose-200"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition hover:shadow-violet-600/45 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
              style={{ minHeight: 50 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Verificando…
                </span>
              ) : (
                'Ingresar →'
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-violet-300/30" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-400/60">
              ¿Nueva clínica?
            </span>
            <div className="h-px flex-1 bg-violet-300/30" />
          </div>

          <p className="text-center text-[12px] text-violet-500/75">
            Escríbenos a{' '}
            <a
              href="mailto:hola@nuravetcare.com"
              className="font-semibold text-violet-600 underline-offset-2 hover:underline"
            >
              hola@nuravetcare.com
            </a>
          </p>

          {/* Planes mini — solo mobile */}
          <div className="mt-8 lg:hidden grid grid-cols-3 gap-2">
            {PLANS.map((p) => (
              <div
                key={p.id}
                className={`rounded-xl p-2.5 text-center ring-1 ${
                  p.highlighted
                    ? 'bg-violet-600 ring-violet-500 text-white'
                    : 'bg-white/65 ring-violet-200/60 text-violet-900'
                }`}
              >
                <p className="text-[11px] font-black">{p.name}</p>
                {p.currency && (
                  <p className={`text-[10px] ${p.highlighted ? 'text-white/70' : 'text-violet-500'}`}>
                    ${p.price}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}
