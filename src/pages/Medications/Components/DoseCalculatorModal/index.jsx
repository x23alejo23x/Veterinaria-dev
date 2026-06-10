import { useMemo } from 'react'
import { Calculator, Clock, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { calculateDose } from '@/utils/doseCalculator'

/**
 * DoseCalculatorModal — calculadora de dosis con selects de paciente y medicamento.
 * @param {boolean}  isOpen
 * @param {Function} onClose
 * @param {Object}   doseForm     — estado del formulario de dosis
 * @param {Function} setDoseForm  — actualizador
 * @param {Array}    patients     — lista de pacientes del store
 * @param {Array}    medications  — lista de medicamentos del store
 * @param {Function} onSave       — callback(prescriptionData) al guardar
 */
export function DoseCalculatorModal({ isOpen, onClose, doseForm, setDoseForm, patients, medications, onSave }) {
  const result = useMemo(() => calculateDose(doseForm), [doseForm])

  const update = (key) => (e) => {
    const val = e.target.value
    setDoseForm((prev) => {
      if (key === 'patientId')    return { ...prev, patientId: val,    weight:        patients.find((p) => p.id === val)?.weight        ?? prev.weight }
      if (key === 'medicationId') return { ...prev, medicationId: val, concentration: medications.find((m) => m.id === val)?.concentration ?? prev.concentration }
      return { ...prev, [key]: val }
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}
      title="Calculadora de dosis"
      description="Calcula la dosis exacta según peso y concentración"
      icon={<Calculator size={18} />}
      size="md">
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Select options={patients.map((p) => ({ value: p.id, label: `${p.name} · ${p.weight}kg` }))} value={doseForm.patientId} onChange={update('patientId')} placeholder="Buscar paciente…" searchable />
          <Select options={medications.map((m) => ({ value: m.id, label: m.name }))} value={doseForm.medicationId} onChange={update('medicationId')} placeholder="Buscar medicamento…" searchable />
          <Input type="number" placeholder="Concentración (mg/ml)" value={doseForm.concentration} onChange={update('concentration')} />
          <Input type="number" placeholder="Peso (kg)"             value={doseForm.weight}        onChange={update('weight')} />
          <Input type="number" placeholder="Dosis (mg/kg)"         value={doseForm.mgKg}          onChange={update('mgKg')} />
          <Input icon={<Clock size={13} className="text-[var(--text-3)]" />} type="number" placeholder="Frecuencia (h)" value={doseForm.frequency} onChange={update('frequency')} />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[['mg/dosis', result.doseMg], ['ml/toma', result.amountMl], ['tomas/día', result.dailyTakes], ['ml total', result.totalMl]].map(([l, v]) => (
            <div key={l} className="rounded-xl bg-[var(--surface-2)] p-3 text-center">
              <p className="text-lg font-bold text-[var(--text)]">{v}</p>
              <p className="text-[10px] text-[var(--text-3)]">{l}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
          <Button variant="primary" onClick={() => {
            onSave({ patientId: doseForm.patientId, medicationId: doseForm.medicationId, dose: `${result.amountMl} ml`, frequency: `cada ${doseForm.frequency} h`, duration: `${doseForm.duration} días`, date: new Date().toLocaleDateString('es-CO') })
            onClose()
          }}>
            <Save size={14} /> Guardar prescripción
          </Button>
        </div>
      </div>
    </Modal>
  )
}
