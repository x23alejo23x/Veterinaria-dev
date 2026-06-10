import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, PawPrint } from 'lucide-react'
import { notify } from '@/utils/notify'
import { PLANS } from '@/pages/Auth/constants'
import { registerSchema } from '@/pages/Register/constants'

/* ── Field local ── */
function Field({ label, error, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-violet-800">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-[11px] font-medium text-rose-500">{error}</p>
      )}
    </div>
  )
}

function inputCls(hasError) {
  return [
    'w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-violet-900',
    'bg-white/80 backdrop-blur-sm outline-none transition-all',
    'placeholder:font-normal placeholder:text-violet-400/60',
    hasError
      ? 'border-rose-400 ring-2 ring-rose-300/40'
      : 'border-violet-300/60 hover:border-violet-400/70 focus:border-violet-500 focus:ring-2 focus:ring-violet-400/25',
  ].join(' ')
}

export function RegisterView() {
  const navigate     = useNavigate()
  const [params]     = useSearchParams()
  const planId       = params.get('plan') ?? 'basico'
  const plan         = PLANS.find((p) => p.id === planId) ?? PLANS[0]
  const Icon         = plan.icon
  const hl           = plan.highlighted

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { empresa: '', nit: '', email: '', telefono: '', ciudad: '' },
  })

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 900))
    notify.success(`¡Listo! Pronto nos comunicaremos a ${data.email}.`)
    navigate('/login')
  }

  return (
    <main
      className="min-h-svh"
      style={{ background: 'linear-gradient(160deg, #f2eeff 0%, #ede8ff 50%, #e8e2ff 100%)' }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-violet-600/25">
            <PawPrint size={14} className="text-white" />
          </div>
          <span className="text-sm font-black tracking-tight text-violet-950">Nura VetCare</span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-violet-600 transition hover:text-violet-800"
        >
          <ArrowLeft size={14} />
          Volver a los planes
        </button>
      </header>

      {/* Layout */}
      <div className="mx-auto max-w-5xl px-6 py-6 lg:px-12 lg:py-10">
        <div className="flex flex-col-reverse gap-8 lg:flex-row lg:items-start lg:gap-12">

          {/* ── Formulario ── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="flex-[1.1]"
          >
            <div className="mb-7">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-500/70">
                Paso 1 de 2
              </p>
              <h1 className="text-[1.9rem] font-black leading-none tracking-tight text-violet-950">
                Registra tu clínica
              </h1>
              <p className="mt-2 text-[13px] leading-snug text-violet-700/60">
                Completa los datos para activar el plan{' '}
                <span className="font-bold text-violet-800">{plan.name}</span>.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {/* Fila 1 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Nombre de la clínica" error={errors.empresa?.message} required>
                  <input
                    {...register('empresa')}
                    placeholder="Clínica Veterinaria XYZ"
                    className={inputCls(errors.empresa)}
                    style={{ minHeight: 44 }}
                  />
                </Field>
                <Field label="NIT / RUC" error={errors.nit?.message} required>
                  <input
                    {...register('nit')}
                    placeholder="900.123.456-7"
                    className={inputCls(errors.nit)}
                    style={{ minHeight: 44 }}
                  />
                </Field>
              </div>

              {/* Fila 2 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Email de contacto" error={errors.email?.message} required>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="admin@miclínica.com"
                    autoComplete="email"
                    className={inputCls(errors.email)}
                    style={{ minHeight: 44 }}
                  />
                </Field>
                <Field label="Teléfono" error={errors.telefono?.message} required>
                  <input
                    {...register('telefono')}
                    type="tel"
                    placeholder="+57 300 000 0000"
                    autoComplete="tel"
                    className={inputCls(errors.telefono)}
                    style={{ minHeight: 44 }}
                  />
                </Field>
              </div>

              {/* Fila 3 */}
              <Field label="Ciudad" error={errors.ciudad?.message} required>
                <input
                  {...register('ciudad')}
                  placeholder="Bogotá"
                  className={inputCls(errors.ciudad)}
                  style={{ minHeight: 44 }}
                />
              </Field>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
                style={{ minHeight: 50 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Procesando…
                  </span>
                ) : (
                  `Activar plan ${plan.name} →`
                )}
              </button>

              <p className="text-center text-[11px] text-violet-400/80">
                Al registrarte aceptas nuestros{' '}
                <a href="#" className="underline-offset-2 hover:underline">Términos de servicio</a>
                {' '}y{' '}
                <a href="#" className="underline-offset-2 hover:underline">Política de privacidad</a>.
              </p>
            </form>
          </motion.div>

          {/* ── Resumen del plan ── */}
          <motion.aside
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.08 }}
            className="lg:w-[300px] lg:shrink-0"
          >
            {/* Card del plan */}
            <div
              className={`rounded-2xl p-6 ${
                hl
                  ? 'bg-gradient-to-br from-violet-600 to-indigo-700 shadow-2xl shadow-violet-700/30'
                  : 'bg-white/82 shadow-lg ring-1 ring-violet-200/60'
              }`}
            >
              {hl && (
                <span className="mb-4 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-[3px] text-[9px] font-black uppercase tracking-wide text-amber-900">
                  ★ Más popular
                </span>
              )}

              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`grid h-11 w-11 place-items-center rounded-xl ${
                    hl ? 'bg-white/25 ring-1 ring-white/25' : `bg-gradient-to-br ${plan.gradient} shadow-md`
                  }`}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <p className={`text-base font-black ${hl ? 'text-white' : 'text-violet-950'}`}>
                    Plan {plan.name}
                  </p>
                  <p className={`text-[11px] ${hl ? 'text-white/60' : 'text-violet-500'}`}>
                    {plan.description}
                  </p>
                </div>
              </div>

              {/* Precio focal */}
              <div className={`rounded-xl p-4 mb-5 ${hl ? 'bg-white/15' : 'bg-violet-50/80'}`}>
                {plan.currency ? (
                  <>
                    <p className={`text-[2.2rem] font-black leading-none tracking-tight ${hl ? 'text-white' : 'text-violet-900'}`}>
                      ${plan.price}
                    </p>
                    <p className={`mt-1 text-[11px] ${hl ? 'text-white/55' : 'text-violet-400'}`}>
                      {plan.currency} / {plan.period}
                    </p>
                  </>
                ) : (
                  <p className={`text-[1.8rem] font-black leading-none tracking-tight ${hl ? 'text-white' : 'text-violet-700'}`}>
                    {plan.price}
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="flex flex-col gap-2">
                {plan.features.map((f) => (
                  <div
                    key={f}
                    className={`flex items-center gap-2 text-[12px] font-medium ${
                      hl ? 'text-white/80' : 'text-violet-700'
                    }`}
                  >
                    <span
                      className={`grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                        hl ? 'bg-white/20' : `bg-gradient-to-br ${plan.gradient}`
                      }`}
                    >
                      <Check size={9} strokeWidth={3} className="text-white" />
                    </span>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Contacto */}
            <div className="mt-3 rounded-xl bg-white/50 px-4 py-3 ring-1 ring-violet-200/40">
              <p className="text-[11px] font-semibold text-violet-800 mb-0.5">¿Tienes dudas?</p>
              <p className="text-[11px] text-violet-600/70">
                Escríbenos a{' '}
                <a href="mailto:hola@nuravetcare.com" className="font-bold text-violet-600 hover:underline underline-offset-2">
                  hola@nuravetcare.com
                </a>{' '}
                — respondemos en menos de 24 h.
              </p>
            </div>
          </motion.aside>

        </div>
      </div>
    </main>
  )
}
