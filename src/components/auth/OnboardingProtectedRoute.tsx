import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/app-logo/logo.png';

interface OnboardingProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * OnboardingProtectedRoute
 *
 * Protects onboarding routes (subscription, brand setup, etc.) from being accessed
 * when onboarding is already complete.
 *
 * Rules:
 * - If not authenticated: redirect to login
 * - If authenticated but onboarding complete: redirect to welcome chat
 * - If authenticated and onboarding incomplete: allow access
 */
export function OnboardingProtectedRoute({ children }: OnboardingProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
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

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Authenticated but onboarding already complete - redirect to welcome chat
  if (user?.isOnboardingComplete) {
    return <Navigate to="/welcome/chat" replace />;
  }

  // Authenticated and onboarding not complete - allow access
  return <>{children}</>;
}
