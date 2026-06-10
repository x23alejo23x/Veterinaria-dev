import { useState } from 'react'
import { Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

export const emptyOwner = { name: '', phone: '', email: '', address: '', balance: 0 }

/**
 * OwnerModal — formulario de creación/edición de propietario.
 * @param {Object}   modal   — { mode, data }
 * @param {Function} onClose
 * @param {Function} onSave  — callback(formData)
 */
export function OwnerModal({ modal, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ ...emptyOwner, ...modal.data }))
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <Modal
      isOpen={!!modal}
      onClose={onClose}
      title={modal.mode === 'edit' ? 'Editar propietario' : 'Nuevo propietario'}
      description="Datos de contacto y saldo del propietario"
      icon={<Users size={18} />}
      size="md"
      footer={
        <>
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="owner-form">Guardar</Button>
        </>
      }
    >
      <form id="owner-form" className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSave(form, modal.mode, modal.data?.id) }}>
        <Input placeholder="Nombre completo *" value={form.name} onChange={set('name')} required />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Teléfono *" value={form.phone} onChange={set('phone')} required />
          <Input placeholder="Email" type="email" value={form.email} onChange={set('email')} />
        </div>
        <Input placeholder="Dirección" value={form.address} onChange={set('address')} />
        <Input type="number" placeholder="Saldo ($)" value={form.balance} onChange={set('balance')} />
      </form>
    </Modal>
  )
}
