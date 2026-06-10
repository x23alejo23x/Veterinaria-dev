import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Pill } from 'lucide-react'

/**
 * MedicationFormModal — formulario de creación/edición de medicamento.
 * @param {Object}   modal       — { mode, data } | null
 * @param {Object}   medForm     — valores del formulario
 * @param {Function} setMedForm  — actualizador del formulario
 * @param {Function} onClose
 * @param {Function} onSave      — callback(medForm) al guardar
 */
export function MedicationFormModal({ modal, medForm, setMedForm, onClose, onSave }) {
  if (!modal) return null
  const set = (key) => (e) => setMedForm({ ...medForm, [key]: e.target.value })

  return (
    <Modal
      isOpen onClose={onClose}
      title={modal.mode === 'edit' ? 'Editar medicamento' : 'Nuevo medicamento'}
      description="Nombre, categoría, concentración y unidad del medicamento"
      icon={<Pill size={18} />}
      size="md"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="med-form">
            {modal.mode === 'edit' ? 'Actualizar' : 'Agregar'}
          </Button>
        </>
      }
    >
      <form id="med-form" className="grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); onSave(medForm, modal.mode, modal.data?.id) }}>
        <Input placeholder="Nombre *"      value={medForm.name}          onChange={set('name')}          required />
        <Input placeholder="Categoría *"   value={medForm.category}      onChange={set('category')}      required />
        <Input type="number" step="0.01" placeholder="Concentración *"   value={medForm.concentration}   onChange={set('concentration')} required />
        <Select options={['mg/ml', 'mg/tableta', 'capsula', 'UI/ml']} value={medForm.unit} onChange={set('unit')} placeholder="Unidad" />
      </form>
    </Modal>
  )
}
