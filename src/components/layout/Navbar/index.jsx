import { NavLink } from 'react-router-dom'
import { navItems } from '../../../constants'

export function Navbar() {
  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white/70 px-4 py-3 backdrop-blur-xl lg:hidden" aria-label="Navegacion movil">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-bold ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
              }`
            }
          >
            <Icon size={17} />
            {item.label}
          </NavLink>
        )
      })}
    </nav>
  )
}
