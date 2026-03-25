'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, X, Search } from 'lucide-react';
import type { SelectOption } from '@/types';

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  allowCustomInput?: boolean;
  error?: string;
  required?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = '선택해주세요',
  searchable = false,
  allowCustomInput = false,
  error,
  required,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption
    ? selectedOption.label
    : allowCustomInput && value
    ? value
    : '';

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

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  const handleCustomInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && allowCustomInput && searchTerm) {
      onChange(searchTerm);
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5" ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          className={cn(
            'flex h-12 w-full items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-base cursor-pointer transition-colors',
            isOpen && 'ring-2 ring-primary border-primary',
            error && 'border-danger ring-danger',
            !value && 'text-text-muted',
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate">{displayValue || placeholder}</span>
          <div className="flex items-center gap-2">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-text-muted hover:text-text-primary focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronDown
              className={cn(
                'h-4 w-4 text-text-muted transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-surface border border-border rounded-md shadow-md max-h-60 overflow-auto animate-slide-down">
            {searchable && (
              <div className="sticky top-0 bg-surface p-2 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="text"
                    className="w-full h-9 pl-8 pr-3 text-base rounded-md border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleCustomInputSubmit}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                </div>
              </div>
            )}

            <div className="p-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.value}
                    className={cn(
                      'px-3 py-2 text-base rounded-sm cursor-pointer hover:bg-surface-2',
                      value === opt.value &&
                        'bg-primary-light text-primary font-medium'
                    )}
                    onClick={() => handleSelect(opt.value)}
                  >
                    {opt.label}
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-sm text-text-muted">
                  {allowCustomInput && searchTerm ? (
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => handleSelect(searchTerm)}
                    >
                      &quot;{searchTerm}&quot; 직접 입력하기
                    </button>
                  ) : (
                    '검색 결과가 없습니다.'
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
};
