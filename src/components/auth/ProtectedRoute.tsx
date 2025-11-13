import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/app-logo/logo.png';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [minLoadingTime, setMinLoadingTime] = useState(true);

  useEffect(() => {
    // Set minimum loading time to 2 seconds
    const timer = setTimeout(() => {
      setMinLoadingTime(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || minLoadingTime) {
    return (
      <div className="flex h-screen items-center justify-center">
        <img src={logo} alt="Loading" className="w-16 h-16 animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
