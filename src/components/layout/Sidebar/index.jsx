"use no memo";
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { Moon, PawPrint, Sun } from 'lucide-react'
import { navItems, userProfile } from '../../../constants'
import { useTheme } from '../../../contexts/ThemeContext'

export function Sidebar() {
  const { isDark, toggle } = useTheme()
  const navigate     = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen]       = useState(false)
  const [tooltip, setTooltip] = useState(null)
  const asideRef  = useRef(null)
  const lockTimer = useRef(null)

  const handleLeave = () => {
    setOpen(false)
    setTooltip(null)
  }

  const onIconEnter = (e, label) => {
    if (open) return
    const r = e.currentTarget.getBoundingClientRect()
    setTooltip({ label, x: r.right + 10, y: r.top + r.height / 2 })
  }

  const onNavClick = (path) => {
    const aside = asideRef.current
    if (aside) aside.removeEventListener('mouseleave', handleLeave)
    setOpen(true)
    setTooltip(null)
    navigate(path)
    clearTimeout(lockTimer.current)
    lockTimer.current = setTimeout(() => {
      if (aside) aside.addEventListener('mouseleave', handleLeave)
    }, 400)
  }

  return (
    <>
      <aside
        ref={asideRef}
        onMouseLeave={handleLeave}
        className={`fixed left-0 top-0 z-30 hidden h-svh flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--surface)] shadow-sm transition-[width] duration-200 ease-in-out lg:flex ${open ? 'w-[220px]' : 'w-14'}`}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center gap-3 overflow-hidden border-b border-[var(--border)] px-3.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">
            <PawPrint size={16} />
          </div>
          {open && (
            <div className="min-w-0">
              <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-blue-600">VetCare</p>
              <p className="truncate text-sm font-semibold text-[var(--text)]">{userProfile.clinic}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3">
          {open && (
            <p className="mb-1 px-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)]">Menú</p>
          )}
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon     = item.icon
              const isActive = pathname.startsWith(item.path)
              return (
                <li key={item.path}>
                  <button
                    onClick={() => onNavClick(item.path)}
                    onMouseEnter={(e) => onIconEnter(e, item.label)}
                    onMouseLeave={() => !open && setTooltip(null)}
                    className={`flex h-9 w-full items-center gap-3 rounded-xl px-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--primary-10)] text-blue-600 dark:text-blue-400'
                        : 'text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                    }`}
                  >
                    <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-[var(--text-3)]'}`} />
                    {open && <span className="whitespace-nowrap">{item.label}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-[var(--border)] p-2 space-y-0.5">
          <button
            onClick={toggle}
            onMouseEnter={(e) => onIconEnter(e, isDark ? 'Modo claro' : 'Modo oscuro')}
            onMouseLeave={() => !open && setTooltip(null)}
            className="flex h-9 w-full items-center gap-3 rounded-xl px-2.5 text-sm font-medium text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            {isDark
              ? <Sun size={17} className="shrink-0 text-amber-400" />
              : <Moon size={17} className="shrink-0 text-[var(--text-3)]" />}
            {open && <span className="whitespace-nowrap">{isDark ? 'Modo claro' : 'Modo oscuro'}</span>}
          </button>

          <div className="flex h-10 items-center gap-3 rounded-xl px-2.5">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blue-600 text-xs font-bold text-white">
              {userProfile.initials}
            </div>
            {open && (
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[var(--text)]">{userProfile.name}</p>
                <p className="truncate text-[10px] text-[var(--text-3)]">{userProfile.role}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Tooltip portal */}
      {tooltip && !open && createPortal(
        <div
          className="pointer-events-none fixed z-[9999] -translate-y-1/2 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg dark:bg-slate-700"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.label}
          <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-700" />
        </div>,
        document.body,
      )}
    </>
  )
}
