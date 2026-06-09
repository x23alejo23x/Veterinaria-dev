import { useState } from 'react'
import {
  AlertTriangle, ArrowUpRight, Bell, ChevronRight, Maximize2, Minimize2,
  ClipboardList, HeartPulse, Pill, TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { billingData, followUps, novedades, userProfile } from '../../../constants'

/* ── Donut con etiquetas % afuera (estilo Chart Summary) ── */
function DonutChart({ servicios, size = 220 }) {
  const total  = servicios.reduce((s, d) => s + d.monto, 0)
  const cx     = size / 2
  const cy     = size / 2
  const R      = size * 0.29   // radio del aro
  const SW     = size * 0.10   // grosor del aro
  const circ   = 2 * Math.PI * R
  const GAP    = 2             // hueco entre segmentos

  // Calcular ángulos y posiciones
  let cumAngle = -90  // empezar arriba
  const segments = servicios.map((s) => {
    const frac     = s.monto / total
    const sweep    = frac * 360
    const midAngle = cumAngle + sweep / 2
    const startA   = cumAngle
    cumAngle      += sweep
    return { ...s, frac, sweep, startA, midAngle }
  })

  // Polar → cartesiano
  const polar = (angle, r) => ({
    x: cx + r * Math.cos((angle * Math.PI) / 180),
    y: cy + r * Math.sin((angle * Math.PI) / 180),
  })

  // Arco SVG path
  const arc = (startA, sweep, r) => {
    const s = polar(startA + 0.5, r)
    const e = polar(startA + sweep - 0.5, r)
    const lg = sweep > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${lg} 1 ${e.x} ${e.y}`
  }

  const labelR  = R + SW / 2 + 22
  const lineInR = R + SW / 2 + 4
  const lineOutR = R + SW / 2 + 16

  return (
    <svg width={size} height={size}>
      {/* Aro base */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--border)" strokeWidth={SW} />

      {/* Segmentos */}
      {segments.map((s, i) => (
        <path
          key={i}
          d={arc(s.startA, s.sweep, R)}
          fill="none"
          stroke={s.color}
          strokeWidth={SW}
          strokeLinecap="round"
        />
      ))}

      {/* Etiquetas con líneas */}
      {segments.map((s, i) => {
        const pctVal = Math.round(s.frac * 100)
        const pIn  = polar(s.midAngle, lineInR)
        const pOut = polar(s.midAngle, lineOutR)
        const pLbl = polar(s.midAngle, labelR)
        const right = pLbl.x > cx
        return (
          <g key={`lbl-${i}`}>
            <line x1={pIn.x} y1={pIn.y} x2={pOut.x} y2={pOut.y}
              stroke={s.color} strokeWidth={1.5} />
            <circle cx={pOut.x} cy={pOut.y} r={2.5} fill={s.color} />
            <text
              x={pLbl.x + (right ? 2 : -2)}
              y={pLbl.y}
              fill="var(--text)"
              fontSize={size * 0.058}
              fontWeight="700"
              textAnchor={right ? 'start' : 'end'}
              dominantBaseline="middle"
            >
              {pctVal > 0 ? `+${pctVal}%` : `${pctVal}%`}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
import { useAppStore } from '../../../store/appStore'

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
const pct = (a, b) => (b === 0 ? 0 : Math.round((a / b) * 100))

/* ── Tarjeta colorida ── */
function QuickCard({ icon: Icon, label, value, sub, gradient, to, pet }) {
  return (
    <Link
      to={to}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${gradient}`}
      style={{ minHeight: 110 }}
    >
      {/* Animal decorativo */}
      <div
        className="pointer-events-none absolute -bottom-1 right-1 select-none leading-none"
        style={{ fontSize: 62, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))', opacity: 0.92 }}
        aria-hidden="true"
      >
        {pet}
      </div>

      <div className="relative flex items-start justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/20">
          <Icon size={18} className="text-white" />
        </div>
        <ArrowUpRight size={15} className="text-white/50 transition group-hover:text-white/90" />
      </div>
      <div className="relative">
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm font-semibold text-white/80">{label}</p>
        {sub && <p className="mt-0.5 text-[11px] text-white/60">{sub}</p>}
      </div>
    </Link>
  )
}

/* ── Sección colapsable ── */
function Section({ title, badge, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-[var(--surface-2)]"
      >
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-3)]">{title}</p>
          {badge && (
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
              {badge}
            </span>
          )}
        </div>
        <ChevronRight
          size={14}
          className={`text-[var(--text-3)] transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

export function DashboardView() {
  const patients      = useAppStore((s) => s.patients)
  const prescriptions = useAppStore((s) => s.prescriptions)
  const medications   = useAppStore((s) => s.medicationsCatalog)
  const urgent        = Object.values(followUps).flat().filter((i) => i.priority === 'Alta')
  const followAll     = Object.values(followUps).flat()
  const { mesActual, tendencia, servicios, ingresosDiarios } = billingData
  const cobrado  = pct(mesActual.pagado, mesActual.total)
  const maxMonto = Math.max(...servicios.map((s) => s.monto))
  const [hovSvc,    setHovSvc]    = useState(null)
  const [expanded,  setExpanded]  = useState(false)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto px-5 py-5 space-y-4">

      {/* ── Banner de bienvenida ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 p-5 min-h-[120px]">
        {/* Círculos decorativos */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-8 right-20 h-36 w-36 rounded-full bg-white/10" />

        {/* Huellas decorativas */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none" aria-hidden="true">
          <div className="flex flex-col items-end gap-1" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))' }}>
            <span style={{ fontSize: 38, opacity: 0.5, transform: 'rotate(20deg)' }}>🐾</span>
            <span style={{ fontSize: 28, opacity: 0.35, transform: 'rotate(-10deg)', marginRight: 24 }}>🐾</span>
            <span style={{ fontSize: 22, opacity: 0.25, transform: 'rotate(15deg)', marginRight: 8 }}>🐾</span>
          </div>
        </div>

        <div className="relative pr-28">
          <div>
            <p className="text-sm font-semibold text-blue-100">{greeting} 👋</p>
            <h2 className="mt-0.5 text-2xl font-bold text-white">{userProfile.name}</h2>
            <p className="mt-1 text-sm text-blue-100">{userProfile.clinic} · {userProfile.role}</p>

            <div className="mt-3 flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-semibold text-white">
                <HeartPulse size={13} />
                {patients.length} pacientes activos
              </div>
              {urgent.length > 0 && (
                <div className="flex items-center gap-1.5 rounded-xl bg-rose-500/40 px-3 py-1.5 text-xs font-semibold text-white">
                  <AlertTriangle size={13} />
                  {urgent.length} alerta{urgent.length > 1 ? 's' : ''} urgente{urgent.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>

          {/* Botón "Nuevo paciente" removido del banner — disponible en la vista /pacientes */}
        </div>
      </div>

      {/* ── Quick cards ── */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <QuickCard icon={HeartPulse}    label="Pacientes"      value={patients.length}      sub="registros activos"  gradient="bg-gradient-to-br from-blue-500  to-blue-700"     to="/pacientes"    pet="🐕" />
        <QuickCard icon={Pill}          label="Medicamentos"   value={medications.length}   sub="en catálogo"        gradient="bg-gradient-to-br from-violet-500 to-purple-700"   to="/medicaciones" pet="🐱" />
        <QuickCard icon={ClipboardList} label="Prescripciones" value={prescriptions.length} sub="activas"            gradient="bg-gradient-to-br from-emerald-400 to-teal-600"    to="/medicaciones" pet="🐰" />
        <QuickCard icon={Bell}          label="Alertas"        value={urgent.length}        sub="requieren atención" gradient="bg-gradient-to-br from-rose-400   to-pink-600"     to="/seguimientos" pet="🦜" />
      </div>

      {/* ── Main: Actividad + Facturación | Panel lateral ── */}
      <div className="grid gap-4 xl:grid-cols-[1fr_250px]">

        {/* Dos tarjetas en columna izquierda */}
        <div className="relative grid gap-4 sm:grid-cols-2">

          {/* Actividad reciente */}
          <Section title="Actividad reciente">
            <div className="space-y-1.5 pt-1">
              {novedades.map((n, i) => {
                const dots = { blue: 'bg-blue-500', green: 'bg-emerald-500', rose: 'bg-rose-500' }
                const bgs  = { blue: 'bg-blue-50 dark:bg-blue-500/10', green: 'bg-emerald-50 dark:bg-emerald-500/10', rose: 'bg-rose-50 dark:bg-rose-500/10' }
                return (
                  <div key={i} className={`flex items-start gap-3 rounded-xl ${bgs[n.tono] ?? bgs.blue} px-3 py-2.5`}>
                    <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dots[n.tono] ?? dots.blue}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[var(--text)]">{n.texto}</p>
                      <p className="mt-0.5 text-[10px] text-[var(--text-3)]">{n.tiempo}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Section>

          {/* Facturación — con donut + expand */}
          <div
            className={`overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 ${
              expanded ? 'absolute inset-0 z-20 shadow-2xl' : ''
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-3)]">
                Facturación · {mesActual.label}
              </p>
              <button
                onClick={() => setExpanded((v) => !v)}
                className="grid h-7 w-7 place-items-center rounded-lg text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                title={expanded ? 'Contraer' : 'Expandir'}
              >
                {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            </div>

            <div className="p-4">
              {!expanded ? (
                /* ── Vista compacta: estilo Chart Summary ── */
                <div className="flex flex-col items-center gap-3">

                  {/* Donut con etiquetas % */}
                  <div className="relative">
                    <DonutChart servicios={servicios} size={220} />
                    {/* Centro del donut */}
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-base font-bold text-[var(--text)] leading-none">{fmt(mesActual.total)}</p>
                      <p className="text-[10px] text-[var(--text-3)]">total</p>
                    </div>
                  </div>

                  {/* Stats row — estilo imagen */}
                  <div className="w-full grid grid-cols-3 divide-x divide-[var(--border)] border-t border-[var(--border)] pt-3">
                    <div className="flex flex-col items-center gap-1 px-2">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: servicios[0]?.color }} />
                        <span className="text-[10px] text-[var(--text-3)] truncate">{servicios[0]?.concepto.split(' ')[0]}</span>
                      </div>
                      <p className="text-lg font-bold text-[var(--text)]">{servicios[0]?.cantidad}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1 px-2">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: servicios[1]?.color }} />
                        <span className="text-[10px] text-[var(--text-3)] truncate">{servicios[1]?.concepto.split(' ')[0]}</span>
                      </div>
                      <p className="text-lg font-bold text-[var(--text)]">{servicios[1]?.cantidad}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1 px-2">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] text-[var(--text-3)]">Cobrado</span>
                      </div>
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{cobrado}%</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* ── Vista expandida: 2 columnas balanceadas ── */
                <div className="grid grid-cols-2 gap-5 divide-x divide-[var(--border)]">

                  {/* Columna izquierda: donut + cobrado/pendiente */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <DonutChart servicios={servicios} size={220} />
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-base font-bold text-[var(--text)] leading-none">{fmt(mesActual.total)}</p>
                        <p className="text-[10px] text-[var(--text-3)]">facturado</p>
                        <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <TrendingUp size={11} /> +{tendencia}%
                        </div>
                      </div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2.5 text-center">
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{fmt(mesActual.pagado)}</p>
                        <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">cobrado · {cobrado}%</p>
                      </div>
                      <div className="rounded-xl bg-rose-50 dark:bg-rose-500/10 px-3 py-2.5 text-center">
                        <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{fmt(mesActual.pendiente)}</p>
                        <p className="text-[10px] text-rose-600/70 dark:text-rose-400/70">pendiente</p>
                      </div>
                    </div>
                  </div>

                  {/* Columna derecha: servicios + ingresos diarios */}
                  <div className="pl-5 flex flex-col gap-4">

                    {/* Servicios — tarjetas 2×2 con color */}
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)]">Servicios</p>
                      <div className="grid grid-cols-2 gap-2">
                        {servicios.map((s) => (
                          <div
                            key={s.concepto}
                            className="rounded-xl px-3 py-2.5"
                            style={{ background: `${s.color}18` }}
                          >
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
                              <span className="text-[10px] font-semibold truncate" style={{ color: s.color }}>{s.concepto}</span>
                            </div>
                            <p className="text-sm font-bold text-[var(--text)]">{fmt(s.monto)}</p>
                            <p className="text-[10px] text-[var(--text-3)]">{s.cantidad} servicios</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ingresos diarios — grid con degradado azul */}
                    <div className="border-t border-[var(--border)] pt-3">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)]">Ingresos diarios</p>
                      <div className="grid grid-cols-4 gap-1.5">
                        {ingresosDiarios.map((d, i) => {
                          const maxD = Math.max(...ingresosDiarios.map((x) => x.monto))
                          const intensity = 0.08 + (d.monto / maxD) * 0.22
                          return (
                            <div
                              key={d.dia}
                              className="rounded-xl px-2 py-2.5 text-center"
                              style={{ background: `rgba(37,99,235,${intensity})` }}
                            >
                              <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">{d.dia}</p>
                              <p className="mt-0.5 text-xs font-bold text-[var(--text)]">
                                {new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 0 }).format(d.monto)}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel lateral: urgente + seguimientos */}
        <div className="flex flex-col gap-3">
          <Section title="Urgente" badge={`${urgent.length}`}>
            <div className="space-y-2">
              {urgent.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-xl bg-rose-50 px-3 py-2.5 dark:bg-rose-500/10">
                  <AlertTriangle size={12} className="mt-0.5 shrink-0 text-rose-500" />
                  <div>
                    <p className="text-xs font-semibold text-[var(--text)]">{item.title}</p>
                    <p className="text-[10px] text-[var(--text-3)]">{item.patient} · {item.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Seguimientos">
            <div className="space-y-1.5">
              {followAll.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 transition hover:bg-[var(--surface-2)]">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-[var(--text)]">{item.title}</p>
                    <p className="text-[10px] text-[var(--text-3)]">{item.patient}</p>
                  </div>
                  <span className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                    item.priority === 'Alta'
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                      : 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                  }`}>
                    {item.due}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
