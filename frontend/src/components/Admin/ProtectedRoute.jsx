import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Check if token exists in local storage
    const token = localStorage.getItem('adminToken');

    // If no token, redirect to login page
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    // If token exists, render the child routes (Dashboard, etc.)
    return <Outlet />;
};

export default ProtectedRoute;