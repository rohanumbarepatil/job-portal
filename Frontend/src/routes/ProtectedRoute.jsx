import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser, dbUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!dbUser) {
    // DB User not loaded yet or orphaned.
    return <div>Loading profile...</div>;
  }

  if (!dbUser.profileCompleted) {
    return <div>Please complete your profile to continue.</div>;
  }

  if (allowedRoles && !allowedRoles.includes(dbUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
