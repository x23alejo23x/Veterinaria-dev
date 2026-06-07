import { create } from 'zustand'
import { medicationsSeed, ownersSeed, patientsSeed, prescriptionsSeed } from '../constants'
import { notify } from '../utils/notify.js'

const createId = (prefix) => `${prefix}-${globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Date.now()}`
const money = (value) => `$${(Number(value) || 0).toLocaleString('es-CO')}`

export const useAppStore = create((set) => ({
  patients: patientsSeed,
  owners: ownersSeed,
  medicationsCatalog: medicationsSeed,
  prescriptions: prescriptionsSeed,
  patientSearch: '',
  patientFilter: 'todos',
  ownerSearch: '',
  medicationSearch: '',
  setPatientSearch: (patientSearch) => set({ patientSearch }),
  setPatientFilter: (patientFilter) => set({ patientFilter }),
  setOwnerSearch: (ownerSearch) => set({ ownerSearch }),
  setMedicationSearch: (medicationSearch) => set({ medicationSearch }),
  addPatient: (patient) => set((state) => {
    const owner = state.owners.find((item) => item.id === patient.ownerId)
    notify.success('Paciente creado')
    return { patients: [{ ...patient, id: createId('p'), owner: owner?.name ?? patient.owner, status: patient.status || 'Estable' }, ...state.patients] }
  }),
  updatePatient: (id, updates) => set((state) => {
    const owner = state.owners.find((item) => item.id === updates.ownerId)
    notify.success('Paciente actualizado')
    return { patients: state.patients.map((item) => item.id === id ? { ...item, ...updates, owner: owner?.name ?? updates.owner ?? item.owner } : item) }
  }),
  deletePatient: (id) => set((state) => {
    notify.success('Paciente eliminado')
    return { patients: state.patients.filter((item) => item.id !== id), prescriptions: state.prescriptions.filter((item) => item.patientId !== id) }
  }),
  addOwner: (owner) => set((state) => {
    notify.success('Propietario creado')
    return { owners: [{ ...owner, id: owner.id || createId('o'), balance: Number(owner.balance) || 0, balanceStr: money(owner.balance) }, ...state.owners] }
  }),
  updateOwner: (id, updates) => set((state) => {
    notify.success('Propietario actualizado')
    return { owners: state.owners.map((item) => item.id === id ? { ...item, ...updates, balance: Number(updates.balance) || 0, balanceStr: money(updates.balance) } : item) }
  }),
  deleteOwner: (id) => set((state) => {
    notify.success('Propietario eliminado')
    return { owners: state.owners.filter((item) => item.id !== id), patients: state.patients.map((item) => item.ownerId === id ? { ...item, ownerId: '', owner: 'Sin propietario' } : item) }
  }),
  addMedication: (medication) => set((state) => {
    notify.success('Medicamento creado')
    return { medicationsCatalog: [{ ...medication, id: createId('med'), concentration: Number(medication.concentration) || 1 }, ...state.medicationsCatalog] }
  }),
  updateMedication: (id, updates) => set((state) => {
    notify.success('Medicamento actualizado')
    return { medicationsCatalog: state.medicationsCatalog.map((item) => item.id === id ? { ...item, ...updates, concentration: Number(updates.concentration) || 1 } : item) }
  }),
  deleteMedication: (id) => set((state) => {
    notify.success('Medicamento eliminado')
    return { medicationsCatalog: state.medicationsCatalog.filter((item) => item.id !== id), prescriptions: state.prescriptions.filter((item) => item.medicationId !== id) }
  }),
  addPrescription: (prescription) => set((state) => {
    notify.success('Prescripción guardada')
    return { prescriptions: [{ ...prescription, id: createId('rx'), status: 'Activa' }, ...state.prescriptions] }
  }),
}))
