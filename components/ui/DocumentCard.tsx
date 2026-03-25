'use client';

import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { DOC_TYPES } from '@/lib/constants/docTypes';
import {
  Eye,
  Share2,
  Trash2,
  FileText,
  AlertTriangle,
  ClipboardList,
  BookOpen,
} from 'lucide-react';
import type { DocType, DocStatus } from '@/types';

export interface DocumentCardProps {
  id: string;
  docType: DocType;
  tradeName: string;
  workDate: string;
  status: DocStatus;
  siteName?: string;
  onView: () => void;
  onShare: () => void;
  onDelete: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  docType,
  tradeName,
  workDate,
  status,
  siteName,
  onView,
  onShare,
  onDelete,
}) => {
  const typeInfo = DOC_TYPES[docType];

  const getIcon = () => {
    const iconStyle = { color: typeInfo.color };
    switch (docType) {
      case 'tbm':
        return <ClipboardList className="h-5 w-5" style={iconStyle} />;
      case 'risk':
        return <AlertTriangle className="h-5 w-5" style={iconStyle} />;
      case 'education':
        return <BookOpen className="h-5 w-5" style={iconStyle} />;
      case 'workplan':
        return <FileText className="h-5 w-5" style={iconStyle} />;
    }
  };

  return (
    <Card
      padding="md"
      className="flex flex-col gap-4 hover:border-primary transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className="p-2.5 rounded-lg flex-shrink-0 mt-0.5"
            style={{ backgroundColor: typeInfo.bgColor }}
          >
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-text-secondary">
                {typeInfo.label}
              </span>
              {siteName && (
                <>
                  <span className="text-border">•</span>
                  <span className="text-xs text-text-secondary">{siteName}</span>
                </>
              )}
            </div>
            <h3 className="text-base font-semibold text-text-primary line-clamp-1">
              {tradeName}
            </h3>
            <p className="text-sm text-text-muted mt-0.5">{workDate}</p>
          </div>
        </div>
        <Badge variant={status === 'complete' ? 'success' : 'warning'}>
          {status === 'complete' ? '작성완료' : '임시저장'}
        </Badge>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={onView}
          icon={<Eye className="h-4 w-4" />}
        >
          보기
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={onShare}
          icon={<Share2 className="h-4 w-4" />}
        >
          공유
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="px-3 text-text-muted hover:text-danger hover:bg-danger-light"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
