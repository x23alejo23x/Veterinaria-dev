import { LogOut, Moon, Search, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../contexts/ThemeContext'
import { userProfile } from '../../../constants'
import { sessionService } from '../../../services/auth'

export function Header() {
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionService.clear()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)]/95 px-5 backdrop-blur-xl">

      {/* Search — compacto */}
      <div className="flex w-56 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/15">
        <Search size={13} className="shrink-0 text-[var(--text-3)]" />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-3)]"
          placeholder="Buscar…"
        />
      </div>

      <div className="flex-1" />

      {/* Acciones */}
      <div className="flex items-center gap-1">
        {/* Toggle tema */}
        <button
          onClick={toggle}
          className="grid h-9 w-9 place-items-center rounded-xl text-[var(--text-2)] transition hover:bg-[var(--surface-2)]"
          aria-label="Cambiar tema"
        >
          {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
        </button>

        {/* Cerrar sesión */}
        <button
          onClick={handleLogout}
          className="grid h-9 w-9 place-items-center rounded-xl text-[var(--text-2)] transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut size={17} />
        </button>
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-[var(--border)]" />

      {/* Perfil */}
      <button className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-[var(--surface-2)]">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white shadow-sm">
          {userProfile.initials}
        </div>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-semibold text-[var(--text)] leading-tight">{userProfile.name}</p>
          <p className="text-[10px] text-[var(--text-3)]">{userProfile.role}</p>
        </div>
        <svg className="hidden sm:block h-3.5 w-3.5 shrink-0 text-[var(--text-3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </header>
  )
}
