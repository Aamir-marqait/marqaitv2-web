import { useEffect, useState } from "react";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";

interface LinearProgressProps {
  step?: number;
  totalSteps?: number;
}

export default function LinearProgress({
  step = 1,
  totalSteps = 3,
}: LinearProgressProps) {
  const displayStep = step === 0 ? 1 : step;
  const completedSteps = step === 0 ? 0 : step;
  const { markStepAsCompleted, isStepCompleted } = useOnboardingProgress();
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  useEffect(() => {
    if (completedSteps === 0) {
      setVisibleSteps([]);
      return;
    }

    const currentStepIndex = completedSteps - 1;
    const allPreviousSteps: number[] = [];

    // Build array of all steps up to current
    for (let i = 0; i < currentStepIndex; i++) {
      allPreviousSteps.push(i);
    }

    // Mark all previous steps as completed in context immediately
    allPreviousSteps.forEach(stepIndex => {
      if (!isStepCompleted(stepIndex)) {
        markStepAsCompleted(stepIndex);
      }
    });

    // Show all previous steps instantly (no animation)
    setVisibleSteps(allPreviousSteps);

    // Check if current step is already marked as completed in context
    if (isStepCompleted(currentStepIndex)) {
      // Current step already completed - show it instantly too
      setVisibleSteps([...allPreviousSteps, currentStepIndex]);
    } else {
      // Current step is NEW - animate it
      const timeout = setTimeout(() => {
        setVisibleSteps([...allPreviousSteps, currentStepIndex]);
        markStepAsCompleted(currentStepIndex);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [completedSteps, markStepAsCompleted, isStepCompleted]);

  return (
    <div className="w-full flex flex-col items-start mb-8">
      <span className="font-inter text-xs font-normal leading-4 tracking-normal text-gray-500 mb-3">
        Step <span className="text-[#8F00FF]">{displayStep}</span> of{" "}
        {totalSteps}
      </span>
      <div className="w-full flex items-center space-x-2">
        {[...Array(totalSteps)].map((_, i) => {
          const isCompleted = visibleSteps.includes(i);

          return (
            <div
              key={i}
              className="h-1.5 rounded-[50px] bg-[#DED7E5] flex-1 mx-1 relative overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 h-full bg-[#8F00FF] rounded-[50px] transition-all duration-700 ease-out ${
                  isCompleted ? "w-full" : "w-0"
                }`}
                style={{
                  transformOrigin: "left",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
