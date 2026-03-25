'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backHref,
  actions,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-1 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {backHref && (
            <button
              onClick={() => router.push(backHref)}
              className="p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-surface-2 rounded-full transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            {title}
          </h1>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      {subtitle && (
        <p className="text-text-secondary text-base mt-1 ml-1">{subtitle}</p>
      )}
    </div>
  );
};
