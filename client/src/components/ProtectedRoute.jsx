import { Navigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../auth';

// Wraps a page that requires login.
// If the user is not logged in, send them to the login page
// and remember where they were trying to go.
export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
