import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { useConsultas, useCreateConsulta } from '@/pages/Consultas/services'
import { usePatients } from '@/pages/Patients/services'
import { ConsultasList } from '@/pages/Consultas/Components/ConsultasList'
import { VETS_SEED } from '@/pages/PatientProfile/constants'

function NewConsultaModal({ patients, onClose, onCreate }) {
  const [patientId, setPatientId] = useState('')
  const [vet, setVet] = useState(VETS_SEED[0])
  const [baseFee, setBaseFee] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[var(--text)]">Nueva consulta</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-3)] hover:bg-[var(--surface-2)] transition"><X size={16} /></button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-3)]">Paciente *</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
            >
              <option value="">Seleccionar paciente…</option>
              {patients.map((p) => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-3)]">Veterinario *</label>
            <select
              value={vet}
              onChange={(e) => setVet(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
            >
              {VETS_SEED.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-3)]">Tarifa base (COP)</label>
            <input
              type="number"
              min="0"
              value={baseFee}
              onChange={(e) => setBaseFee(e.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/15"
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button onClick={onClose} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-3)] hover:bg-[var(--surface-2)] transition">
              Cancelar
            </button>
            <button
              disabled={!patientId || !vet}
              onClick={() => onCreate({ patientId: Number(patientId), vet, baseFee: Number(baseFee) || 0 })}
              className="rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-40"
            >
              Crear consulta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ConsultasListView() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')

  const { data: consultasData, loading } = useConsultas(statusFilter ? { status: statusFilter } : {})
  const consultas = consultasData?.items ?? []

  const { data: pData } = usePatients({ limit: 200 })
  const patients = pData?.items ?? []

  const { create } = useCreateConsulta({
    onSuccess: (res) => {
      const newId = res?.data?.id ?? res?.id
      if (newId) navigate(`/consultas/${newId}`)
      else setShowModal(false)
    },
  })

  const handleOpen = (id) => navigate(`/consultas/${id}`)

  const consultasWithNames = consultas.map((c) => ({
    ...c,
    patientName: patients.find((p) => p.id === c.patientId)?.name,
  }))

  return (
    <PageContainer
      eyebrow="Clínica"
      title="Consultas"
      description="Gestión de consultas clínicas activas y cerradas."
      actions={
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-violet-400"
          >
            <option value="">Todos los estados</option>
            <option value="abierta">Abiertas</option>
            <option value="en_progreso">En progreso</option>
            <option value="cerrada">Cerradas</option>
          </select>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Nueva consulta
          </Button>
        </div>
      }
    >
      {loading ? (
        <div className="py-16 text-center text-sm text-[var(--text-3)]">Cargando consultas…</div>
      ) : (
        <ConsultasList consultas={consultasWithNames} onOpen={handleOpen} />
      )}

      {showModal && (
        <NewConsultaModal
          patients={patients}
          onClose={() => setShowModal(false)}
          onCreate={(data) => { create(data); setShowModal(false) }}
        />
      )}
    </PageContainer>
  )
}
