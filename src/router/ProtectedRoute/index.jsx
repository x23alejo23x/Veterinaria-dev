import { Navigate, useLocation } from 'react-router-dom'
import { sessionService } from '../../services/auth'

/**
 * ProtectedRoute — guarda de rutas con soporte RBAC.
 *
 * Props:
 *   requiredRole?: string  — si se pasa, el usuario debe tener ese rol exacto
 *
 * HOW TO SWAP TO REAL AUTH:
 *   - Reemplaza sessionService.get() con tu hook de sesión (useAuth, useUser, etc.)
 *   - El resto no cambia
 */
export function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation()
  const session  = sessionService.get()

  // No autenticado → redirige al login guardando la ruta de retorno
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // RBAC: rol insuficiente → redirige al dashboard
  if (requiredRole && session.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
