import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, PawPrint } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { notify } from '../../../utils/notify'

export function AuthView() {
  const navigate = useNavigate()

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden p-6">
      <motion.div
        className="absolute inset-[-20%] bg-[radial-gradient(circle_at_22%_28%,rgba(21,111,247,.22),transparent_22rem),radial-gradient(circle_at_78%_18%,rgba(32,180,134,.22),transparent_24rem)] blur-md"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/60 bg-white/65 p-7 shadow-2xl backdrop-blur-2xl">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-lg shadow-blue-600/20">
          <PawPrint size={24} />
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950">Bienvenido a Nura VetCare</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Gestion clinica veterinaria premium, segura y centrada en el paciente.</p>
        <div className="mt-6 grid gap-3">
          <Input icon={<Mail size={17} />} placeholder="correo@clinica.com" type="email" />
          <Input icon={<Lock size={17} />} placeholder="Contrasena" type="password" />
          <Button variant="primary" onClick={() => { notify.success('Sesion iniciada'); navigate('/dashboard') }}>
            Ingresar al panel
          </Button>
        </div>
      </section>
    </main>
  )
}
