'use client';

import React from 'react';
import { User, Phone, Building2, Wrench, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Worker } from '@/lib/store/workerStore';

interface EmployeeCardProps {
  worker: Worker;
  onEdit: (worker: Worker) => void;
  onDelete: (worker: Worker) => void;
  onClick?: (worker: Worker) => void;
  selectable?: boolean;
  selected?: boolean;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  worker,
  onEdit,
  onDelete,
  onClick,
  selectable = false,
  selected = false,
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(worker);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(worker);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`'${worker.name}' 직원을 삭제하시겠습니까?`)) {
      onDelete(worker);
    }
  };

  // 첫 번째 사진 또는 서명을 프로필로 사용
  const profileImage = worker.photos?.[0] || worker.signature;

  return (
    <div
      className={cn(
        'relative bg-surface rounded-xl border border-border p-4 transition-all',
        selectable && 'cursor-pointer hover:border-primary',
        selected && 'border-primary ring-2 ring-primary/20',
        onClick && 'cursor-pointer hover:shadow-md'
      )}
      onClick={handleCardClick}
    >
      {/* 선택 표시 */}
      {selectable && selected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      <div className="flex gap-4">
        {/* 프로필 이미지/아바타 */}
        <div className="flex-shrink-0">
          {profileImage ? (
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border">
              <img
                src={profileImage}
                alt={worker.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center">
              <User className="w-8 h-8 text-text-muted" />
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-text-primary">
                {worker.name}
              </h3>
              {worker.role && (
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {worker.role}
                </span>
              )}
            </div>
            
            {/* 액션 버튼 (선택 모드가 아닐 때만 표시) */}
            {!selectable && (
              <div className="flex gap-1">
                <button
                  onClick={handleEdit}
                  className="p-1.5 text-text-muted hover:text-primary rounded-lg hover:bg-surface-2 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-text-muted hover:text-danger rounded-lg hover:bg-surface-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-2 space-y-1 text-sm text-text-secondary">
            {worker.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-text-muted" />
                <span>{worker.phone}</span>
              </div>
            )}
            {worker.company && (
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-text-muted" />
                <span>{worker.company}</span>
              </div>
            )}
            {worker.trade && (
              <div className="flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-text-muted" />
                <span>{worker.trade}</span>
              </div>
            )}
          </div>

          {/* 사진 썸네일 (여러장일 때) */}
          {worker.photos && worker.photos.length > 1 && (
            <div className="flex gap-1 mt-2">
              {worker.photos.slice(1, 4).map((photo, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded overflow-hidden border border-border"
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              {worker.photos.length > 4 && (
                <div className="w-8 h-8 rounded bg-surface-2 flex items-center justify-center text-xs text-text-muted">
                  +{worker.photos.length - 4}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
