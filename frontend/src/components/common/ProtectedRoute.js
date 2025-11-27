import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, rolPermitido = null }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check for role-based access control
  if (rolPermitido) {
    // Handle array of allowed roles
    const rolesPermitidos = Array.isArray(rolPermitido) ? rolPermitido : [rolPermitido];
    const userRol = user.rol;
    
    // Check if user's role matches any of the allowed roles
    if (!rolesPermitidos.includes(userRol)) {
      // Redirect to appropriate dashboard based on user role
      return <Navigate to="/dashboard" />;
    }
  }

  // Legacy support for adminOnly prop
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
