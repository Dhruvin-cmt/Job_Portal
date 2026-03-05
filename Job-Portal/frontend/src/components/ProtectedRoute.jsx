import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, role } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to={role === 'Employer' ? '/employer/dashboard' : '/employee/dashboard'} replace />;
  }

  return children;
}
