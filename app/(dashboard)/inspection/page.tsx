'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Download, 
  Calendar,
  FileText,
  AlertTriangle,
  GraduationCap,
  ClipboardList,
  CheckCircle2,
  Clock,
  Filter,
} from 'lucide-react';
import { 
  Button, 
  Card, 
  Tabs,
  ChecklistItem,
  Badge,
  PageHeader,
} from '@/components/ui';
import { DOC_TYPES } from '@/lib/constants/docTypes';
import type { DocType } from '@/types';

// 기간 필터 옵션
const PERIOD_OPTIONS = [
  { value: 'today', label: '오늘' },
  { value: 'week', label: '이번 주' },
  { value: 'month', label: '이번 달' },
  { value: 'quarter', label: '분기' },
];

// 자체점검 항목
const CHECKLIST_ITEMS = [
  { id: '1', label: '안전관리계획서 비치 여부', checked: true },
  { id: '2', label: '위험성평가 실시 여부', checked: true },
  { id: '3', label: 'TBM 일일 실시 기록', checked: true },
  { id: '4', label: '안전교육 실시대장', checked: false },
  { id: '5', label: '근로자 안전서약서', checked: true },
  { id: '6', label: '안전보호구 지급대장', checked: false },
  { id: '7', label: '안전점검 일지', checked: true },
  { id: '8', label: '작업허가서 (필요시)', checked: true },
];

// 임시 문서 데이터
const MOCK_DOCUMENTS = [
  {
    id: '1',
    type: 'tbm' as DocType,
    title: '철근공 TBM',
    date: '2024-01-15',
    trade: '철근공',
    status: 'completed' as const,
  },
  {
    id: '2',
    type: 'tbm' as DocType,
    title: '콘크리트공 TBM',
    date: '2024-01-15',
    trade: '콘크리트공',
    status: 'completed' as const,
  },
  {
    id: '3',
    type: 'risk' as DocType,
    title: '철근공 위험성평가',
    date: '2024-01-15',
    trade: '철근공',
    status: 'completed' as const,
  },
  {
    id: '4',
    type: 'risk' as DocType,
    title: '콘크리트공 위험성평가',
    date: '2024-01-14',
    trade: '콘크리트공',
    status: 'completed' as const,
  },
  {
    id: '5',
    type: 'education' as DocType,
    title: '신규자 안전교육',
    date: '2024-01-14',
    trade: '공통',
    status: 'draft' as const,
  },
];

export default function InspectionPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedDocType, setSelectedDocType] = useState<DocType | 'all'>('all');
  const [checklist, setChecklist] = useState(CHECKLIST_ITEMS);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const docTypeTabs = [
    { value: 'all', label: '전체' },
    ...Object.entries(DOC_TYPES).map(([key, doc]) => ({
      value: key,
      label: doc.label,
    })),
  ];

  const filteredDocs = MOCK_DOCUMENTS.filter((doc) => {
    if (selectedDocType === 'all') return true;
    return doc.type === selectedDocType;
  });

  const toggleDocSelection = (docId: string) => {
    setSelectedDocs((prev) => {
      if (prev.includes(docId)) {
        return prev.filter((id) => id !== docId);
      }
      return [...prev, docId];
    });
  };

  const selectAllDocs = () => {
    if (selectedDocs.length === filteredDocs.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(filteredDocs.map((doc) => doc.id));
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDownloadIndividual = async () => {
    if (selectedDocs.length === 0) return;
    setIsDownloading(true);
    
    // 선택된 문서를 하나씩 새 탭에서 열어 인쇄(PDF 저장)
    for (const docId of selectedDocs) {
      const doc = filteredDocs.find((d) => d.id === docId);
      if (doc) {
        window.open(`/documents/${doc.id}`, '_blank');
      }
      // 브라우저 과부하 방지
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    
    setIsDownloading(false);
  };

  const completedCount = checklist.filter((item) => item.checked).length;
  const completionRate = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-surface border-b border-border">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="ml-2 text-lg font-semibold text-text-primary">
            감독 대응 모드
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Self-Inspection Checklist */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text-primary">
              자체점검 체크리스트
            </h2>
            <Badge variant={completionRate === 100 ? 'success' : 'warning'}>
              {completionRate}% 완료
            </Badge>
          </div>
          <div className="space-y-2">
            {checklist.map((item) => (
              <ChecklistItem
                key={item.id}
                label={item.label}
                checked={item.checked}
                onChange={() => toggleChecklistItem(item.id)}
              />
            ))}
          </div>
        </Card>

        {/* Period Filter */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-semibold text-text-primary">
              기간 선택
            </h2>
          </div>
          <div className="flex gap-2">
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedPeriod(option.value)}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
                  ${selectedPeriod === option.value
                    ? 'bg-primary text-white'
                    : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Document Type Tabs */}
        <Tabs
          tabs={docTypeTabs}
          activeTab={selectedDocType}
          onChange={(value) => setSelectedDocType(value as DocType | 'all')}
        />

        {/* Document List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text-primary">
              문서 목록 ({filteredDocs.length}건)
            </h2>
            <button
              onClick={selectAllDocs}
              className="text-sm text-primary"
            >
              {selectedDocs.length === filteredDocs.length ? '전체 해제' : '전체 선택'}
            </button>
          </div>
          <div className="space-y-2">
            {filteredDocs.map((doc) => {
              const docType = DOC_TYPES[doc.type];
              const Icon = docType.icon;
              const isSelected = selectedDocs.includes(doc.id);
              
              return (
                <Card
                  key={doc.id}
                  className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => toggleDocSelection(doc.id)}
                >
                  <div className="relative">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `var(--color-${docType.color}-subtle)` }}
                    >
                      <Icon
                        className="h-4 w-4"
                        style={{ color: `var(--color-${docType.color})` }}
                      />
                    </div>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {doc.title}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {doc.date} · {doc.trade}
                    </p>
                  </div>
                  {doc.status === 'completed' ? (
                    <Badge variant="success" size="sm">완료</Badge>
                  ) : (
                    <Badge variant="warning" size="sm">임시저장</Badge>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 safe-area-bottom">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={handleDownloadIndividual}
            disabled={selectedDocs.length === 0 || isDownloading}
            className="w-full"
          >
            {isDownloading ? (
              '문서 열는 중...'
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                선택 문서 개별 열기 ({selectedDocs.length}건)
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
