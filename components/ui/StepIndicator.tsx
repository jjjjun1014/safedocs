'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

export interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="flex items-center justify-between mb-8 relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border -z-10" />
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isActive = currentStep === stepNumber;

        return (
          <div key={step} className="flex flex-col items-center gap-2 bg-bg px-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                isCompleted || isActive
                  ? 'bg-primary text-white'
                  : 'bg-surface-2 text-text-muted border border-border'
              )}
            >
              {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : stepNumber}
            </div>
            <span
              className={cn(
                'text-xs font-medium whitespace-nowrap',
                isCompleted || isActive ? 'text-primary' : 'text-text-muted'
              )}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};
