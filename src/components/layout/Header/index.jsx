import { LogOut, Moon, Search, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { userProfile } from '@/constants'
import { sessionService } from '@/services/auth'

export function Header() {
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionService.clear()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-[var(--border)] bg-[var(--surface)]/90 px-3 sm:h-16 sm:gap-3 sm:px-5 backdrop-blur-xl shadow-[var(--shadow-sm)]">

      {/* Search — oculto en mobile, visible en sm+ */}
      <div className="hidden sm:flex w-48 md:w-56 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 transition focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/15">
        <Search size={13} className="shrink-0 text-[var(--text-3)]" />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-3)]"
          placeholder="Buscar…"
        />
      </div>

      {/* Logo / nombre en mobile cuando no hay search */}
      <p className="sm:hidden text-sm font-bold text-[var(--text)] truncate">{userProfile.clinic}</p>

      <div className="flex-1" />

      <div className="flex items-center gap-0.5 sm:gap-1">
        {/* Search icon en mobile */}
        <button
          className="grid h-10 w-10 place-items-center rounded-xl text-[var(--text-2)] transition hover:bg-[var(--surface-2)] sm:hidden"
          aria-label="Buscar"
        >
          <Search size={17} />
        </button>

        <button
          onClick={toggle}
          className="grid h-10 w-10 place-items-center rounded-xl text-[var(--text-2)] transition hover:bg-[var(--surface-2)]"
          aria-label="Cambiar tema"
        >
          {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
        </button>

        <button
          onClick={handleLogout}
          className="grid h-10 w-10 place-items-center rounded-xl text-[var(--text-2)] transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut size={17} />
        </button>
      </div>

      <div className="h-5 w-px bg-[var(--border)] sm:h-6" />

      {/* Perfil */}
      <button className="flex items-center gap-2 rounded-xl px-1.5 py-1 sm:px-2 sm:py-1.5 transition hover:bg-[var(--surface-2)]">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-bold text-white shadow-[0_2px_8px_rgba(124,58,237,0.4)]">
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
