import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute – redirects to /login if not authenticated
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullScreen />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access
  if (roles && roles.length > 0) {
    const hasAccess = roles.some(role => {
      if (role === 'freelancer') return user.role === 'freelancer' || user.role === 'both';
      if (role === 'client') return user.role === 'client' || user.role === 'both';
      return user.role === role;
    });
    if (!hasAccess) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
