'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Site } from '@/types';

export interface SiteSelectorProps {
  sites: Site[];
  selectedSiteId: string;
  onSelect: (siteId: string) => void;
  onAddSite?: () => void;
}

export const SiteSelector: React.FC<SiteSelectorProps> = ({
  sites,
  selectedSiteId,
  onSelect,
  onAddSite,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedSite = sites.find((s) => s.id === selectedSiteId) || sites[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-2 transition-colors max-w-[200px] sm:max-w-[240px]"
      >
        <div className="bg-primary-light p-1.5 rounded-md text-primary shrink-0">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="flex flex-col items-start truncate">
          <span className="text-xs text-text-secondary font-medium">현재 현장</span>
          <span className="text-sm font-semibold text-text-primary truncate w-full text-left">
            {selectedSite?.name || '현장 선택'}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-text-muted shrink-0 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-surface border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-slide-down">
          <div className="max-h-60 overflow-y-auto p-1">
            {sites.map((site) => (
              <button
                key={site.id}
                onClick={() => {
                  onSelect(site.id);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-center justify-between',
                  site.id === selectedSiteId
                    ? 'bg-primary-light text-primary font-medium'
                    : 'text-text-primary hover:bg-surface-2'
                )}
              >
                <span className="truncate">{site.name}</span>
                {site.id === selectedSiteId && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                )}
              </button>
            ))}
          </div>

          {onAddSite && (
            <div className="p-1 border-t border-border bg-surface-2/50">
              <button
                onClick={() => {
                  onAddSite();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-sm text-primary hover:bg-primary-light transition-colors font-medium"
              >
                <Plus className="h-4 w-4" />
                새 현장 추가
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
