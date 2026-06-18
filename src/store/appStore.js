import { create } from 'zustand'
import { appointmentsSeed, medicationsSeed, ownersSeed, patientsSeed, prescriptionsSeed } from '@/constants'
import { notify } from '@/utils/notify.js'

const createId = (prefix) => `${prefix}-${globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Date.now()}`
const money    = (value)  => `$${(Number(value) || 0).toLocaleString('es-CO')}`

/**
 * Wrapper para actions del store — captura errores inesperados
 * y los muestra con notify.error.
 *
 * NOTE: Cuando el backend esté listo, los set() sincrónicos de aquí
 * se reemplazarán por llamadas async a la API usando useMutation/useFetch.
 * El contrato de cada función no cambia.
 */
const safeAction = (fn) => (...args) => {
  try {
    return fn(...args)
  } catch (err) {
    notify.error(err?.message ?? 'Error inesperado. Intenta de nuevo.')
    console.error('[store]', err)
  }
}

export const useAppStore = create((set) => ({
  patients:         patientsSeed,
  owners:           ownersSeed,
  medicationsCatalog: medicationsSeed,
  prescriptions:    prescriptionsSeed,
  appointments:     appointmentsSeed,
  clinicalNotes:    [],

  /* ── Search / filter state ── */
  patientSearch:   '',
  patientFilter:   'todos',
  ownerSearch:     '',
  medicationSearch: '',
  setPatientSearch:    (patientSearch)    => set({ patientSearch }),
  setPatientFilter:    (patientFilter)    => set({ patientFilter }),
  setOwnerSearch:      (ownerSearch)      => set({ ownerSearch }),
  setMedicationSearch: (medicationSearch) => set({ medicationSearch }),

  /* ── Pacientes ── */
  addPatient: safeAction((patient) => set((state) => {
    const owner = state.owners.find((o) => o.id === patient.ownerId)
    notify.success(`Paciente "${patient.name}" creado`)
    return {
      patients: [{
        ...patient,
        id:     createId('p'),
        owner:  owner?.name ?? patient.owner ?? '',
        status: patient.status || 'Estable',
      }, ...state.patients],
    }
  })),

  updatePatient: safeAction((id, updates) => set((state) => {
    if (!state.patients.find((p) => p.id === id)) {
      notify.error('Paciente no encontrado')
      return state
    }
    const owner = state.owners.find((o) => o.id === updates.ownerId)
    notify.success('Paciente actualizado')
    return {
      patients: state.patients.map((p) =>
        p.id === id ? { ...p, ...updates, owner: owner?.name ?? updates.owner ?? p.owner } : p
      ),
    }
  })),

  deletePatient: safeAction((id) => set((state) => {
    notify.success('Paciente eliminado')
    return {
      patients:      state.patients.filter((p) => p.id !== id),
      prescriptions: state.prescriptions.filter((rx) => rx.patientId !== id),
    }
  })),

  /* ── Propietarios ── */
  addOwner: safeAction((owner) => set((state) => {
    // Validar email único
    if (owner.email && state.owners.some((o) => o.email === owner.email)) {
      notify.warning('Ya existe un propietario con ese email')
      return state
    }
    notify.success(`Propietario "${owner.name}" creado`)
    return {
      owners: [{
        ...owner,
        id:         owner.id || createId('o'),
        balance:    Number(owner.balance)  || 0,
        balanceStr: money(owner.balance),
      }, ...state.owners],
    }
  })),

  updateOwner: safeAction((id, updates) => set((state) => {
    notify.success('Propietario actualizado')
    return {
      owners: state.owners.map((o) =>
        o.id === id ? { ...o, ...updates, balance: Number(updates.balance) || 0, balanceStr: money(updates.balance) } : o
      ),
    }
  })),

  deleteOwner: safeAction((id) => set((state) => {
    const patientsLinked = state.patients.filter((p) => p.ownerId === id).length
    if (patientsLinked > 0) {
      notify.warning(`Este propietario tiene ${patientsLinked} paciente(s) vinculados. Se desvincularon.`)
    } else {
      notify.success('Propietario eliminado')
    }
    return {
      owners:   state.owners.filter((o) => o.id !== id),
      patients: state.patients.map((p) =>
        p.ownerId === id ? { ...p, ownerId: '', owner: 'Sin propietario' } : p
      ),
    }
  })),

  /* ── Medicamentos ── */
  addMedication: safeAction((medication) => set((state) => {
    // Validar nombre único
    if (state.medicationsCatalog.some((m) => m.name.toLowerCase() === medication.name.toLowerCase())) {
      notify.warning(`Ya existe un medicamento llamado "${medication.name}"`)
      return state
    }
    notify.success(`Medicamento "${medication.name}" agregado`)
    return {
      medicationsCatalog: [{
        ...medication,
        id:            createId('med'),
        concentration: Number(medication.concentration) || 1,
      }, ...state.medicationsCatalog],
    }
  })),

  updateMedication: safeAction((id, updates) => set((state) => {
    notify.success('Medicamento actualizado')
    return {
      medicationsCatalog: state.medicationsCatalog.map((m) =>
        m.id === id ? { ...m, ...updates, concentration: Number(updates.concentration) || 1 } : m
      ),
    }
  })),

  deleteMedication: safeAction((id) => set((state) => {
    const rxCount = state.prescriptions.filter((rx) => rx.medicationId === id).length
    if (rxCount > 0) {
      notify.warning(`Se eliminaron ${rxCount} prescripción(es) asociadas`)
    } else {
      notify.success('Medicamento eliminado')
    }
    return {
      medicationsCatalog: state.medicationsCatalog.filter((m) => m.id !== id),
      prescriptions:      state.prescriptions.filter((rx) => rx.medicationId !== id),
    }
  })),

  /* ── Prescripciones ── */
  /* ── Citas ── */
  addAppointment: safeAction((apt) => set((state) => {
    notify.success('Cita agendada')
    return { appointments: [{ ...apt, id: createId('apt') }, ...state.appointments] }
  })),
  updateAppointment: safeAction((id, updates) => set((state) => {
    notify.success('Cita actualizada')
    return { appointments: state.appointments.map((a) => a.id === id ? { ...a, ...updates } : a) }
  })),
  deleteAppointment: safeAction((id) => set((state) => {
    notify.success('Cita eliminada')
    return { appointments: state.appointments.filter((a) => a.id !== id) }
  })),

  addPrescription: safeAction((prescription) => set((state) => {
    notify.success('Prescripción guardada')
    return {
      prescriptions: [{
        ...prescription,
        id:     createId('rx'),
        status: 'Activa',
      }, ...state.prescriptions],
    }
  })),

  updatePrescription: safeAction((id, updates) => set((state) => {
    notify.success('Prescripción actualizada')
    return { prescriptions: state.prescriptions.map((rx) => rx.id === id ? { ...rx, ...updates } : rx) }
  })),

  deletePrescription: safeAction((id) => set((state) => {
    notify.success('Prescripción eliminada')
    return { prescriptions: state.prescriptions.filter((rx) => rx.id !== id) }
  })),

  addClinicalNote: safeAction((note) => set((state) => {
    notify.success('Nota clínica guardada')
    return { clinicalNotes: [{ ...note, id: createId('note') }, ...state.clinicalNotes] }
  })),

  updateClinicalNote: safeAction((id, updates) => set((state) => {
    notify.success('Nota actualizada')
    return { clinicalNotes: state.clinicalNotes.map((n) => n.id === id ? { ...n, ...updates } : n) }
  })),

  deleteClinicalNote: safeAction((id) => set((state) => {
    notify.success('Nota eliminada')
    return { clinicalNotes: state.clinicalNotes.filter((n) => n.id !== id) }
  })),
}))
