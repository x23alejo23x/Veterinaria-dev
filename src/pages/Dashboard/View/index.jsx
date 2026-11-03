import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Bell,
  ClipboardList,
  HeartPulse,
  Pill,
  Plus,
  Shield,
  Wifi,
} from "lucide-react";
import {
  appointmentsSeed,
  followUps,
  userProfile,
} from "@/constants";
import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/Button";

import { QuickCard } from "@/pages/Dashboard/Components/QuickCard";
import { UpcomingAppointments } from "@/pages/Dashboard/Components/UpcomingAppointments";
import { CreatePatientWizard } from "@/pages/Dashboard/Components/CreatePatientWizard";

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

/* ─── Helpers (definidos antes del componente principal para evitar problemas de hoisting con React Refresh) ─── */

function StatItem({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={11} className={color} />
      <span className="text-[10px] font-bold tabular-nums text-[var(--text)]">{value}</span>
      <span className="text-[9px] text-[var(--text-3)]">{label}</span>
    </div>
  );
}

function DashboardFooter({ patientCount, medicationCount, prescriptionCount, urgentCount }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <motion.div
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      className="shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Branding */}
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
            <HeartPulse size={11} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[var(--text)]">Nura VetCare</p>
            <p className="text-[9px] text-[var(--text-3)]">v1.0.0 · Demo</p>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="flex flex-wrap items-center gap-4">
          <StatItem icon={HeartPulse}    label="Pacientes"       value={patientCount}       color="text-violet-400" />
          <StatItem icon={Pill}          label="Medicamentos"    value={medicationCount}    color="text-emerald-400" />
          <StatItem icon={ClipboardList} label="Prescripciones"  value={prescriptionCount}  color="text-sky-400" />
          {urgentCount > 0 && (
            <StatItem icon={AlertTriangle} label="Alertas urgentes" value={urgentCount} color="text-rose-400" />
          )}
        </div>

        {/* Iconos de estado + hora grande */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity size={13} className="text-emerald-400" />
            <Wifi size={13} className="text-sky-400" />
            <Shield size={13} className="text-violet-400" />
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-base font-bold tabular-nums text-[var(--text)] leading-tight">{timeStr}</p>
            <p className="text-[9px] capitalize text-[var(--text-3)]">{dateStr}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function WelcomeBanner({ greeting, patientCount, urgentCount, onCreatePatient }) {
  const { name, clinic, role } = userProfile;
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-indigo-600 to-purple-600 p-5 shadow-[0_8px_32px_rgba(124,58,237,0.35)]"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white/80">{greeting} 👋</p>
          <h2 className="mt-0.5 text-xl font-bold text-white">{name}</h2>
          <p className="mt-0.5 text-xs text-white/60">{clinic} · {role}</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-1 text-xs font-semibold text-white">
              <HeartPulse size={12} /> {patientCount} pacientes
            </span>
            {urgentCount > 0 && (
              <span className="flex items-center gap-1.5 rounded-xl bg-rose-500/40 px-3 py-1 text-xs font-semibold text-white">
                <AlertTriangle size={12} /> {urgentCount} alerta{urgentCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onCreatePatient}
          className="shrink-0 flex items-center gap-2 rounded-2xl bg-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/30 active:scale-95"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Crear paciente</span>
        </button>
      </div>
    </motion.div>
  );
}

function AlertsPanel({ urgent, followAll }) {
  return (
    <div className="flex h-full flex-col gap-3">
      {/* Urgente */}
      <div className="shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="mb-3 flex items-center gap-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)]">Urgente</p>
          <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400">
            {urgent.length}
          </span>
        </div>
        <div className="space-y-2">
          {urgent.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 rounded-xl bg-rose-500/10 px-3 py-2.5">
              <AlertTriangle size={12} className="mt-0.5 shrink-0 text-rose-500" />
              <div>
                <p className="text-xs font-semibold text-[var(--text)]">{item.title}</p>
                <p className="text-[10px] text-[var(--text-3)]">{item.patient} · {item.due}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seguimientos — flex-1 para llenar el espacio restante */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border)] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)]">Seguimientos</p>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <div className="space-y-1">
            {followAll.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-2 rounded-xl px-2 py-2 transition hover:bg-[var(--surface-2)]">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-[var(--text)]">{item.title}</p>
                  <p className="text-[10px] text-[var(--text-3)]">{item.patient}</p>
                </div>
                <span className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                  item.priority === "Alta"
                    ? "bg-rose-500/20 text-rose-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}>
                  {item.due}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Vista principal ─── */

export function DashboardView() {
  const [wizardOpen, setWizardOpen] = useState(false);

  const patients      = useAppStore((s) => s.patients);
  const prescriptions = useAppStore((s) => s.prescriptions);
  const medications   = useAppStore((s) => s.medicationsCatalog);
  const urgent   = Object.values(followUps).flat().filter((i) => i.priority === "Alta");
  const followAll = Object.values(followUps).flat();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  const cardValues = [
    patients.length,
    medications.length,
    prescriptions.length,
    urgent.length,
  ];

  return (
    /* Layout sin scroll externo: flex-col h-full, cada sección tiene su rol */
    <motion.div
      className="flex h-full min-h-0 flex-col gap-4 overflow-hidden px-5 py-5"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Banner — shrink-0 */}
      <WelcomeBanner
        greeting={greeting}
        patientCount={patients.length}
        urgentCount={urgent.length}
        onCreatePatient={() => setWizardOpen(true)}
      />

      {/* QuickCards — shrink-0 */}
      <motion.div
        className="grid shrink-0 grid-cols-2 gap-3 xl:grid-cols-4"
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

      {/* Panel central — flex-1, se estira para llenar el espacio disponible */}
      <motion.div
        className="grid min-h-0 flex-1 items-stretch gap-4 lg:grid-cols-2"
        variants={fadeUp}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <AlertsPanel urgent={urgent} followAll={followAll} />
        <UpcomingAppointments appointments={appointmentsSeed} />
      </motion.div>

      {/* Footer — shrink-0, siempre visible sin scroll */}
      <DashboardFooter
        patientCount={patients.length}
        medicationCount={medications.length}
        prescriptionCount={prescriptions.length}
        urgentCount={urgent.length}
      />

      <CreatePatientWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </motion.div>
  );
}
