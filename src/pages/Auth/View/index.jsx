import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, PawPrint, User } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { notify } from '../../../utils/notify'

const VALID_USER = import.meta.env.VITE_LOGIN_USER
const VALID_PASS = import.meta.env.VITE_LOGIN_PASS

export function AuthView() {
  const navigate  = useNavigate()
  const [user,    setUser]    = useState('')
  const [pass,    setPass]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    if (!user || !pass) {
      setError('Completa todos los campos')
      return
    }

    setLoading(true)
    setTimeout(() => {
      if (user === VALID_USER && pass === VALID_PASS) {
        notify.success('Sesión iniciada')
        navigate('/dashboard')
      } else {
        setError('Usuario o contraseña incorrectos')
        setLoading(false)
      }
    }, 600)
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
        {/* Logo */}
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-white">
          <PawPrint size={22} />
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-[var(--text)]">Bienvenido</h1>
        <p className="mt-1 text-sm text-[var(--text-3)]">Ingresa tus credenciales para continuar</p>

        <form className="mt-6 space-y-3" onSubmit={handleLogin}>
          <Input
            icon={<User size={15} className="text-[var(--text-3)]" />}
            placeholder="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            autoComplete="username"
          />
          <Input
            icon={<Lock size={15} className="text-[var(--text-3)]" />}
            placeholder="Contraseña"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="current-password"
          />

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              {error}
            </p>
          )}

          <Button variant="primary" type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verificando…' : 'Ingresar'}
          </Button>
        </form>
      </motion.section>
    </main>
  )
}
