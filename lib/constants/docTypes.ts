import type { DocType } from '@/types';

interface DocTypeInfo {
  label: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

export const DOC_TYPES: Record<DocType, DocTypeInfo> = {
  tbm: {
    label: 'TBM 일지',
    description: '작업 전 안전점검회의',
    icon: 'ClipboardList',
    color: 'var(--color-primary)',
    bgColor: 'var(--color-primary-light)',
  },
  risk: {
    label: '위험성평가서',
    description: '공종별 위험요인 분석',
    icon: 'AlertTriangle',
    color: 'var(--color-warning)',
    bgColor: 'var(--color-warning-light)',
  },
  education: {
    label: '안전교육일지',
    description: '법정 안전보건교육 기록',
    icon: 'BookOpen',
    color: 'var(--color-success)',
    bgColor: 'var(--color-success-light)',
  },
  workplan: {
    label: '작업계획서',
    description: '작업 순서 및 안전조치',
    icon: 'FileText',
    color: 'var(--color-danger)',
    bgColor: 'var(--color-danger-light)',
  },
};

export function getDocTypeInfo(docType: DocType): DocTypeInfo {
  return DOC_TYPES[docType];
}
