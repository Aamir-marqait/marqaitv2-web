/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, type ReactNode } from 'react';

export interface OnboardingProgressContextType {
  completedSteps: Set<number>;
  markStepAsCompleted: (step: number) => void;
  markStepAsIncomplete: (step: number) => void;
  isStepCompleted: (step: number) => boolean;
  resetProgress: () => void;
}

export const OnboardingProgressContext = createContext<OnboardingProgressContextType | undefined>(undefined);

interface OnboardingProgressProviderProps {
  children: ReactNode;
}

export function OnboardingProgressProvider({ children }: OnboardingProgressProviderProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const markStepAsCompleted = useCallback((step: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      newSet.add(step);
      return newSet;
    });
  }, []);

  const markStepAsIncomplete = useCallback((step: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      newSet.delete(step);
      return newSet;
    });
  }, []);

  const isStepCompleted = useCallback((step: number) => {
    return completedSteps.has(step);
  }, [completedSteps]);

  const resetProgress = useCallback(() => {
    setCompletedSteps(new Set());
  }, []);

  const value: OnboardingProgressContextType = {
    completedSteps,
    markStepAsCompleted,
    markStepAsIncomplete,
    isStepCompleted,
    resetProgress,
  };

  return (
    <OnboardingProgressContext.Provider value={value}>
      {children}
    </OnboardingProgressContext.Provider>
  );
}
