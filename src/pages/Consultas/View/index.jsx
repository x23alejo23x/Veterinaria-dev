import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { sessionService } from '@/services/auth'
import { useConsulta, useCloseConsulta, useReopenConsulta, useConsultaExams, useHospitalization } from '@/pages/Consultas/services'
import { usePatient } from '@/pages/Patients/services'
import { useOwner } from '@/pages/Owners/services'
import { usePrescriptions, useMedications } from '@/pages/Medications/services'
import { useMutation } from '@/hooks/useFetch'
import { CONSULTA_TABS } from '@/pages/Consultas/constants'
import { ConsultaHeader } from '@/pages/Consultas/Components/ConsultaHeader'
import { CobrosPanel } from '@/pages/Consultas/Components/CobrosPanel'
import { NotasPanel } from '@/pages/Consultas/Components/NotasPanel'
import { MedicamentosPanel } from '@/pages/Consultas/Components/MedicamentosPanel'
import { ExamenesPanel } from '@/pages/Consultas/Components/ExamenesPanel'
import { HospitalizacionPanel } from '@/pages/Consultas/Components/HospitalizacionPanel'
import { ConsultaPDF } from '@/pages/Consultas/Components/ConsultaPDF'

export function ConsultaView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState(CONSULTA_TABS[0])

  const session = sessionService.get()
  const userRole = session?.role ?? 'user'

  const { data: consulta, refetch: refetchConsulta } = useConsulta(id)
  const { data: patient } = usePatient(consulta?.patientId ?? null)
  const { data: owner } = useOwner(patient?.ownerId ?? patient?.owner_id ?? null)

  const { data: rxData, refetch: refetchRx } = usePrescriptions({ patient_id: id, consulta_id: id }, { immediate: !!id })
  const prescriptions = rxData?.items ?? []

  const { data: examsData, refetch: refetchExams } = useConsultaExams(id)
  const exams = examsData?.items ?? []

  const { data: hospitalization } = useHospitalization(id)
  const { data: medsData } = useMedications({ limit: 200 })
  const medications = medsData?.items ?? []

  const { close } = useCloseConsulta({ onSuccess: () => refetchConsulta() })
  const { reopen } = useReopenConsulta({ onSuccess: () => refetchConsulta() })

  const { mutate: updateConsulta } = useMutation('PUT', `/consultas/${id}`, {
    successMsg: 'Notas guardadas',
    onSuccess: () => refetchConsulta(),
  })

  if (!consulta) return (
    <div className="flex h-full items-center justify-center gap-3 text-[var(--text-3)]">
      <Loader2 size={22} className="animate-spin text-violet-500" /> Cargando consulta…
    </div>
  )

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ConsultaHeader
        consulta={consulta}
        patient={patient}
        userRole={userRole}
        onClose={() => close(id)}
        onReopen={() => reopen(id)}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* CobrosPanel sticky left */}
        <CobrosPanel
          consulta={consulta}
          prescriptions={prescriptions}
          exams={exams}
          hospitalization={hospitalization}
          onPrint={() => window.print()}
        />

        {/* Right side: tabs + panels */}
        <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex shrink-0 items-end gap-1 border-b border-[var(--border)] bg-[var(--surface)] px-4 pt-3">
            {CONSULTA_TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`rounded-t-xl px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'border-b-2 border-violet-600 text-violet-600 dark:text-blue-400' : 'text-[var(--text-3)] hover:text-[var(--text)]'}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Panel area */}
          <div className="flex-1 overflow-y-auto bg-[var(--surface)] p-5">
            {tab === 'Notas' && (
              <NotasPanel
                consulta={consulta}
                onSave={(data) => updateConsulta({ chief_complaint: data.chiefComplaint, diagnosis: data.diagnosis })}
              />
            )}
            {tab === 'Medicamentos' && (
              <MedicamentosPanel
                consulta={consulta}
                prescriptions={prescriptions}
                medications={medications}
                refetch={refetchRx}
              />
            )}
            {tab === 'Exámenes' && (
              <ExamenesPanel
                consulta={consulta}
                refetch={refetchExams}
              />
            )}
            {tab === 'Hospitalización' && (
              <HospitalizacionPanel
                consulta={consulta}
                refetch={refetchConsulta}
              />
            )}
          </div>
        </div>
      </div>

      {/* PDF hidden on screen, visible on print */}
      <ConsultaPDF
        consulta={consulta}
        patient={patient}
        owner={owner}
        prescriptions={prescriptions}
        medications={medications}
        exams={exams}
        hospitalization={hospitalization}
      />
    </div>
  )
}
