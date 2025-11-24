import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Navigate, Outlet } from 'react-router-dom';


export const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();


  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return <Outlet />;
};