import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, FileText, Tag } from 'lucide-react'
import { getGrad, speciesEmoji, statusCfg } from '@/pages/PatientProfile/constants'

/**
 * ProfileHero — banner de cabecera del perfil del paciente.
 * @param {Object}   patient    — datos del paciente del store
 * @param {Function} onNewNote  — abre el modal de nueva nota clínica
 */
export function ProfileHero({ patient, onNewNote }) {
  const status = statusCfg[patient.status] ?? statusCfg.Estable
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${getGrad(patient.name)} px-6 py-5`}>
      {/* Decoración */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-6 right-24 h-28 w-28 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute bottom-3 right-6 select-none text-5xl opacity-40" aria-hidden="true">
        {speciesEmoji[patient.species] ?? '🐾'}
      </div>

      <div className="relative flex items-start justify-between gap-4 pr-20">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/20 text-3xl font-black text-white shadow-lg backdrop-blur-sm">
            {patient.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{patient.name}</h1>
            <p className="text-sm text-white/80">{patient.species} · {patient.breed} · {patient.age}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full ${status.cls} px-2.5 py-0.5 text-xs font-bold text-white`}>
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" /> {status.label}
              </span>
              {patient.microchip && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
                  <Tag size={11} /> Microchip
                </span>
              )}
              {patient.nextVisit && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
                  <Calendar size={11} /> {patient.nextVisit}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Link to="/pacientes" className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30">
            <ArrowLeft size={14} /> Volver
          </Link>
          <button onClick={onNewNote}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-bold text-[var(--text)] shadow-lg transition hover:bg-white/90">
            <FileText size={14} /> Nueva nota
          </button>
        </div>
      </div>
    </div>
  )
}
