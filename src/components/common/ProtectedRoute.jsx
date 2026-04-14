import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { userRole } = useAuth();

  // If the user is a guest, send them to the login page immediately
  if (userRole === 'guest') {
    return <Navigate to="/login" replace />;
  }

  // If the route requires a specific role and the user doesn't match, you can redirect them
  // For now, if allowedRoles is provided, we check it. 
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />; // Redirect to home if they don't have permission
  }

  // Render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
