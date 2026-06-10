import { NavLink } from 'react-router-dom'
import { navItems } from '@/constants'

export function Navbar() {
  return (
    <nav
      aria-label="Navegacion movil"
      className="flex gap-1 overflow-x-auto border-b border-[var(--border)] bg-[var(--surface)]/90 px-2 py-1.5 backdrop-blur-xl lg:hidden"
    >
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `inline-flex h-11 min-w-[44px] shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--primary-10)] text-violet-600 dark:text-violet-400'
                  : 'text-[var(--text-2)] hover:bg-[var(--surface-2)]'
              }`
            }
          >
            <Icon size={16} />
            <span className="whitespace-nowrap">{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
