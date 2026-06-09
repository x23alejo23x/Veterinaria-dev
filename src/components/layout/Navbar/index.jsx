import { NavLink } from 'react-router-dom'
import { navItems } from '../../../constants'

export function Navbar() {
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-[var(--border)] bg-[var(--surface)]/90 px-3 py-2 backdrop-blur-xl lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `inline-flex h-9 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--primary-10)] text-blue-600 dark:text-blue-400'
                  : 'text-[var(--text-2)] hover:bg-[var(--surface-2)]'
              }`
            }
          >
            <Icon size={15} />
            {item.label}
          </NavLink>
        )
      })}
    </nav>
  )
}
