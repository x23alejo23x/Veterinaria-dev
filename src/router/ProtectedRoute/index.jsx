import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ children }) {
  const isAuthenticated = true
  return isAuthenticated ? children : <Navigate to="/login" replace />
}
