'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Circle } from 'lucide-react';

export interface ChecklistItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  required?: boolean;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  label,
  checked,
  onChange,
  description,
  required,
}) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'w-full flex items-start gap-3 p-4 rounded-lg border transition-colors text-left min-h-[48px]',
        checked
          ? 'bg-success-light border-success'
          : 'bg-surface border-border hover:border-primary'
      )}
    >
      <div
        className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors',
          checked ? 'bg-success text-white' : 'bg-surface-2 text-text-muted'
        )}
      >
        {checked ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-base font-medium',
              checked ? 'text-success' : 'text-text-primary'
            )}
          >
            {label}
          </span>
          {required && <span className="text-danger text-sm">*</span>}
        </div>
        {description && (
          <p className="text-sm text-text-secondary mt-1">{description}</p>
        )}
      </div>
    </button>
  );
};
