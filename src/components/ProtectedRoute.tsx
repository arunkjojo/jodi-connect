import React from 'react';
import { Navigate } from 'react-router-dom';
import { useEnhancedAuth } from '../contexts/EnhancedAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { firebaseUser, loading } = useEnhancedAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return firebaseUser ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;