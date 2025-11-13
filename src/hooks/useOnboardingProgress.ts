import { useContext } from 'react';
import { OnboardingProgressContext } from '@/contexts/OnboardingProgressContext';

export function useOnboardingProgress() {
  const context = useContext(OnboardingProgressContext);

  if (!context) {
    throw new Error('useOnboardingProgress must be used within an OnboardingProgressProvider');
  }

  return context;
}
