import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Generic auth guard.
 *
 * Props:
 *   role        — 'admin' | 'patient' | undefined (any logged-in user)
 *   redirectTo  — path to send the user to when they fail the guard
 */
export default function ProtectedRoute({ children, role, redirectTo }) {
  const { user, ready } = useAuth()
  const location = useLocation()

  if (!ready) return null

  // Not logged in at all
  if (!user) {
    const dest = redirectTo || (role === 'admin' ? '/login' : '/account/login')
    return <Navigate to={dest} state={{ from: location }} replace />
  }

  // Wrong role — kick them to their correct space
  if (role && user.role !== role) {
    const dest = user.role === 'admin' ? '/admin' : '/account'
    return <Navigate to={dest} replace />
  }

  return children
}
