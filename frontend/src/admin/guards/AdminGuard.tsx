import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * AdminGuard — Chỉ cho phép user có role 'admin' truy cập.
 * Redirect về /login nếu chưa đăng nhập, về / nếu không phải admin.
 */
export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role?.toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
