import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/router/ProtectedRoute'
import { AuthView } from '@/pages/Auth/View'
import { DashboardView } from '@/pages/Dashboard/View'
import { PatientsView } from '@/pages/Patients/View'
import { PatientProfileView } from '@/pages/PatientProfile/View'
import { MedicationsView } from '@/pages/Medications/View'
import { OwnersView } from '@/pages/Owners/View'
import { AppointmentsView } from '@/pages/Appointments/View'
import { MedicalHistoryView } from '@/pages/MedicalHistory/View'
import { FollowUpsView } from '@/pages/FollowUps/View'
import { ReportsView } from '@/pages/Reports/View'
import { SettingsView } from '@/pages/Settings/View'
import { AdminView } from '@/pages/Admin/View'
import { RegisterView } from '@/pages/Register/View'
import { ConsultasListView } from '@/pages/Consultas/ListView'
import { ConsultaView } from '@/pages/Consultas/View'

export default function App() {
  // AnimatePresence se removió del nivel de Routes porque key={pathname}
  // desmontaba AppShell/Sidebar en cada navegación, reseteando el estado del sidebar.
  // La animación de página se maneja en PageContainer con framer-motion.
  return (
    <Routes>
      <Route path="/login" element={<AuthView />} />
      <Route path="/registro" element={<RegisterView />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"    element={<DashboardView />} />
        <Route path="pacientes"    element={<PatientsView />} />
        <Route path="pacientes/:id" element={<PatientProfileView />} />
        <Route path="medicaciones" element={<MedicationsView />} />
        <Route path="propietarios" element={<OwnersView />} />
        <Route path="agenda" element={<AppointmentsView />} />
        <Route path="historial"    element={<MedicalHistoryView />} />
        <Route path="seguimientos" element={<FollowUpsView />} />
        <Route path="reportes"     element={<ReportsView />} />
        <Route path="consultas"    element={<ConsultasListView />} />
        <Route path="consultas/:id" element={<ConsultaView />} />
        <Route path="configuracion" element={<SettingsView />} />
        <Route path="admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminView />
            </ProtectedRoute>
          } />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
