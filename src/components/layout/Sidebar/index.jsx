import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { navItems, userProfile } from "../../../constants";
import { useState } from "react";

export function Sidebar() {
  const [tooltip, setTooltip] = useState({
    visible: false,
    label: "",
    x: 0,
    y: 0,
  });

  const showTooltip = (e, label) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      label,
      x: rect.right + 10,
      y: rect.top + rect.height / 2,
    });
  };

  const hideTooltip = () =>
    setTooltip({ visible: false, label: "", x: 0, y: 0 });

  return (
    <>
      <aside className="sticky top-0 z-20 hidden h-svh w-[88px] flex-col border-r border-slate-200/80 bg-white/75 px-3.5 py-5 shadow-sm backdrop-blur-xl lg:flex">
        {/* Logo */}
        <div className="mb-5 flex min-h-14 w-full items-center justify-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-lg shadow-blue-600/20">
            <PawPrint size={24} />
          </div>
        </div>

        {/* Nav */}
        <nav className="grid gap-2" aria-label="Navegacion principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onMouseEnter={(e) => showTooltip(e, item.label)}
                onMouseLeave={hideTooltip}
                className={({ isActive }) =>
                  `flex h-12 w-full items-center justify-center rounded-2xl text-slate-600 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-emerald-50 text-blue-700 ring-1 ring-blue-100"
                      : ""
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {tooltip.visible &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[9999] -translate-y-1/2 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xl"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {tooltip.label}
            <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
          </div>,
          document.body,
        )}
    </>
  );
}
