'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, X, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  label?: string;
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  allowCustomInput?: boolean;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  searchable = true,
  allowCustomInput = false,
  error,
  required = false,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // 선택된 옵션 라벨 찾기
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || (allowCustomInput ? value : '');

  // 필터링된 옵션
  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 하이라이트된 옵션으로 스크롤
  useEffect(() => {
    if (listRef.current && highlightedIndex >= 0) {
      const items = listRef.current.querySelectorAll('li');
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  // 키보드 네비게이션
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          if (isOpen) {
            if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
              onChange(filteredOptions[highlightedIndex].value);
              setIsOpen(false);
              setSearchTerm('');
            } else if (allowCustomInput && searchTerm) {
              onChange(searchTerm);
              setIsOpen(false);
              setSearchTerm('');
            }
          } else {
            setIsOpen(true);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : prev
            );
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Escape':
          setIsOpen(false);
          setSearchTerm('');
          break;
        case 'Tab':
          setIsOpen(false);
          setSearchTerm('');
          break;
      }
    },
    [isOpen, highlightedIndex, filteredOptions, onChange, allowCustomInput, searchTerm, disabled]
  );

  // 옵션 선택
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  // 선택 초기화
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
    inputRef.current?.focus();
  };

  // 드롭다운 열기
  const handleOpen = () => {
    if (!disabled) {
      setIsOpen(true);
      setHighlightedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      {/* 트리거 버튼 */}
      <div
        onClick={handleOpen}
        className={cn(
          'flex items-center justify-between w-full h-12 px-4 rounded-md border bg-surface transition-colors cursor-pointer',
          isOpen && 'border-border-focus ring-2 ring-primary/20',
          error && 'border-danger',
          disabled && 'opacity-50 cursor-not-allowed bg-surface-2',
          !isOpen && !error && 'border-border hover:border-border-focus'
        )}
      >
        {isOpen && searchable ? (
          <div className="flex items-center flex-1 gap-2">
            <Search className="h-4 w-4 text-text-muted flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-none text-base text-text-primary placeholder:text-text-muted"
              style={{ fontSize: '16px' }}
            />
          </div>
        ) : (
          <span
            className={cn(
              'text-base truncate',
              displayValue ? 'text-text-primary' : 'text-text-muted'
            )}
          >
            {displayValue || placeholder}
          </span>
        )}

        <div className="flex items-center gap-1 ml-2">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-surface-2 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-text-muted" />
            </button>
          )}
          <ChevronDown
            className={cn(
              'h-5 w-5 text-text-muted transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </div>

      {/* 드롭다운 목록 */}
      {isOpen && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-surface border border-border rounded-md shadow-lg"
          onKeyDown={handleKeyDown}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  'flex items-center justify-between px-4 py-3 cursor-pointer transition-colors min-h-[48px]',
                  highlightedIndex === index && 'bg-surface-2',
                  option.value === value && 'bg-primary-light'
                )}
              >
                <span
                  className={cn(
                    'text-sm',
                    option.value === value
                      ? 'text-primary font-medium'
                      : 'text-text-primary'
                  )}
                >
                  {option.label}
                </span>
                {option.value === value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-text-muted">
              {allowCustomInput && searchTerm ? (
                <button
                  type="button"
                  onClick={() => handleSelect(searchTerm)}
                  className="w-full text-left text-primary hover:underline"
                >
                  &quot;{searchTerm}&quot; 직접 입력
                </button>
              ) : (
                '검색 결과가 없습니다'
              )}
            </li>
          )}
        </ul>
      )}

      {/* 에러 메시지 */}
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  );
};
