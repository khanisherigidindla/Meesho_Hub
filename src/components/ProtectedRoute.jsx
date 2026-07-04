import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const ProtectedRoute = ({ children }) => {
  const { auth } = useApp();
  if (!auth) return <Navigate to="/login" replace />;
  return children;
};

export const PublicRoute = ({ children }) => {
  const { auth } = useApp();
  if (auth) return <Navigate to="/dashboard" replace />;
  return children;
};
