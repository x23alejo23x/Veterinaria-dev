import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  ClipboardList,
  HeartPulse,
  Pill,
} from "lucide-react";
import {
  billingData,
  followUps,
  novedades,
  userProfile,
} from "@/constants";
import { useAppStore } from "@/store/appStore";

import { ActivityChart } from "@/pages/Dashboard/Components/ActivityChart";
import { BillingCard } from "@/pages/Dashboard/Components/BillingCard";
import { QuickCard } from "@/pages/Dashboard/Components/QuickCard";
import { Section } from "@/pages/Dashboard/Components/Section";

const pct = (a, b) => (b === 0 ? 0 : Math.round((a / b) * 100));

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

const CARDS = [
  {
    icon: HeartPulse,
    label: "Pacientes",
    sub: "registros activos",
    gradient: "bg-gradient-to-br from-violet-600 to-indigo-700",
    to: "/pacientes",
    pet: "🐕",
  },
  {
    icon: Pill,
    label: "Medicamentos",
    sub: "en catálogo",
    gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
    to: "/medicaciones",
    pet: "🐱",
  },
  {
    icon: ClipboardList,
    label: "Prescripciones",
    sub: "activas",
    gradient: "bg-gradient-to-br from-sky-500 to-blue-600",
    to: "/medicaciones",
    pet: "🐰",
  },
  {
    icon: Bell,
    label: "Alertas",
    sub: "requieren atención",
    gradient: "bg-gradient-to-br from-rose-500 to-pink-600",
    to: "/seguimientos",
    pet: "🦜",
  },
];

export function DashboardView() {
  const patients = useAppStore((s) => s.patients);
  const prescriptions = useAppStore((s) => s.prescriptions);
  const medications = useAppStore((s) => s.medicationsCatalog);
  const urgent = Object.values(followUps)
    .flat()
    .filter((i) => i.priority === "Alta");
  const followAll = Object.values(followUps).flat();
  const { mesActual, tendencia, servicios, ingresosDiarios } = billingData;
  const cobrado = pct(mesActual.pagado, mesActual.total);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  // Valores dinámicos para las cards
  const cardValues = [
    patients.length,
    medications.length,
    prescriptions.length,
    urgent.length,
  ];

  return (
    <motion.div
      className="flex h-full min-h-0 flex-col overflow-y-auto px-5 py-5 space-y-4"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Banner de bienvenida — inline (solo 3 líneas de datos, no justifica componente propio) */}
      <WelcomeBanner
        greeting={greeting}
        patientCount={patients.length}
        urgentCount={urgent.length}
      />

      {/* Quick cards */}
      <motion.div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
        variants={stagger}
      >
        {CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            variants={scaleIn}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <QuickCard {...card} value={cardValues[i]} />
          </motion.div>
        ))}
      </motion.div>

      {/* Sección principal */}
      <motion.div
        className="grid gap-4 lg:grid-cols-[1fr_250px]"
        variants={fadeUp}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative grid gap-4 sm:grid-cols-2">
          <ActivityFeed novedades={novedades} />
          <BillingCard
            mesActual={mesActual}
            tendencia={tendencia}
            servicios={servicios}
            ingresosDiarios={ingresosDiarios}
            cobrado={cobrado}
          />
        </div>
        <AlertsPanel urgent={urgent} followAll={followAll} />
      </motion.div>
    </motion.div>
  );
}

/* ─── Sub-componentes locales simples (< 30 líneas → no merecen archivo propio) ─── */

function WelcomeBanner({ greeting, patientCount, urgentCount }) {
  const { name, clinic, role } = userProfile;
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-indigo-600 to-purple-600 p-5 min-h-[110px] shadow-[0_8px_32px_rgba(124,58,237,0.35)]"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
      <div
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none"
        aria-hidden="true"
      >
        <div className="flex flex-col items-end gap-1">
          <span
            style={{ fontSize: 38, opacity: 0.5, transform: "rotate(20deg)" }}
          >
            🐾
          </span>
          <span
            style={{
              fontSize: 28,
              opacity: 0.35,
              transform: "rotate(-10deg)",
              marginRight: 24,
            }}
          >
            🐾
          </span>
        </div>
      </div>
      <div className="relative pr-24">
        <p className="text-sm font-semibold text-white/80">{greeting} 👋</p>
        <h2 className="mt-0.5 text-xl font-bold text-white">{name}</h2>
        <p className="mt-0.5 text-sm text-white/70">
          {clinic} · {role}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-semibold text-white">
            <HeartPulse size={12} /> {patientCount} pacientes
          </span>
          {urgentCount > 0 && (
            <span className="flex items-center gap-1.5 rounded-xl bg-rose-500/40 px-3 py-1.5 text-xs font-semibold text-white">
              <AlertTriangle size={12} /> {urgentCount} alerta
              {urgentCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ActivityFeed({ novedades }) {
  const dots = {
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    rose: "bg-rose-500",
  };
  const bgs = {
    blue: "bg-blue-50 dark:bg-blue-500/10",
    green: "bg-emerald-50 dark:bg-emerald-500/10",
    rose: "bg-rose-50 dark:bg-rose-500/10",
  };
  return (
    <Section title="Actividad reciente">
      <div className="space-y-1.5 pt-1">
        {novedades.map((n, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-xl ${bgs[n.tono] ?? bgs.blue} px-3 py-2.5`}
          >
            <div
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dots[n.tono] ?? dots.blue}`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--text)]">{n.texto}</p>
              <p className="mt-0.5 text-[10px] text-[var(--text-3)]">
                {n.tiempo}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function AlertsPanel({ urgent, followAll }) {
  return (
    <div className="flex flex-col gap-3">
      <Section title="Urgente" badge={`${urgent.length}`}>
        <div className="space-y-2">
          {urgent.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 rounded-xl bg-rose-50 px-3 py-2.5 dark:bg-rose-500/10"
            >
              <AlertTriangle
                size={12}
                className="mt-0.5 shrink-0 text-rose-500"
              />
              <div>
                <p className="text-xs font-semibold text-[var(--text)]">
                  {item.title}
                </p>
                <p className="text-[10px] text-[var(--text-3)]">
                  {item.patient} · {item.due}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Seguimientos">
        <div className="space-y-1.5">
          {followAll.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 transition hover:bg-[var(--surface-2)]"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-[var(--text)]">
                  {item.title}
                </p>
                <p className="text-[10px] text-[var(--text-3)]">
                  {item.patient}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold ${item.priority === "Alta" ? "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400" : "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"}`}
              >
                {item.due}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
