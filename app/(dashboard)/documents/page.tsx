'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  X,
  Edit,
} from 'lucide-react';
import { 
  Card, 
  Button, 
  Input,
  Tabs,
  Badge,
  EmptyState,
  PageHeader,
  BottomSheet,
  Select,
} from '@/components/ui';
import { DOC_TYPES } from '@/lib/constants/docTypes';
import type { DocType } from '@/types';
import { TRADES, getTradeLabel } from '@/lib/constants/trades';
import { documentStore, type StoredDocument } from '@/lib/store/documentStore';

function DocumentsContent() {
  const searchParams = useSearchParams();
  const showSuccess = searchParams.get('success') === 'true';

  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocType, setSelectedDocType] = useState<DocType | 'all'>('all');
  const [selectedTrade, setSelectedTrade] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // 문서 목록 로드
  useEffect(() => {
    setDocuments(documentStore.getAll());
  }, []);

  const docTypeTabs = [
    { value: 'all', label: '전체' },
    ...Object.entries(DOC_TYPES).map(([key, doc]) => ({
      value: key,
      label: doc.label,
    })),
  ];

  const filteredDocs = documents.filter((doc) => {
    // 문서 유형 필터
    if (selectedDocType !== 'all' && doc.docType !== selectedDocType) {
      return false;
    }
    // 공종 필터
    if (selectedTrade !== 'all' && doc.trade !== selectedTrade) {
      return false;
    }
    // 검색어 필터
    if (searchQuery && !doc.tradeName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const hasActiveFilters = selectedTrade !== 'all';

  return (
    <div className="space-y-4">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-success text-white p-4 rounded-lg shadow-lg flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">문서가 성공적으로 저장되었습니다.</span>
        </div>
      )}

      <PageHeader
        title="문서 목록"
        subtitle="작성된 안전서류를 확인하세요"
        actions={
          <Link href="/documents/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              새 문서
            </Button>
          </Link>
        }
      />

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="문서 검색..."
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowFilters(true)}
          className="relative"
        >
          <Filter className="h-4 w-4" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          )}
        </Button>
      </div>

      {/* Document Type Tabs */}
      <Tabs
        tabs={docTypeTabs}
        activeTab={selectedDocType}
        onChange={(value) => setSelectedDocType(value as DocType | 'all')}
      />

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">필터:</span>
          {selectedTrade !== 'all' && (
            <Badge
              variant="neutral"
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setSelectedTrade('all')}
            >
              {getTradeLabel(selectedTrade)}
              <X className="h-3 w-3" />
            </Badge>
          )}
        </div>
      )}

      {/* Document List */}
      {filteredDocs.length === 0 ? (
        <EmptyState
          icon="file"
          title="문서가 없습니다"
          description={
            searchQuery || hasActiveFilters
              ? "검색 조건에 맞는 문서가 없습니다."
              : "새 문서를 작성해보세요."
          }
          action={
            !searchQuery && !hasActiveFilters && (
              <Link href="/documents/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  새 문서 작성
                </Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="space-y-2">
          {filteredDocs.map((doc) => {
            const docType = DOC_TYPES[doc.docType];
            const Icon = docType.icon;
            
            return (
              <Link key={doc.id} href={`/documents/${doc.id}`}>
                <Card className="p-3 flex items-center gap-3 hover:bg-surface-2 transition-colors">
                  <div
                    className="p-2 rounded-lg shrink-0"
                    style={{ backgroundColor: `var(--color-${docType.color}-subtle)` }}
                  >
                    <Icon
                      className="h-4 w-4"
                      style={{ color: `var(--color-${docType.color})` }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {doc.tradeName} {docType.label}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {doc.workDate} · {getTradeLabel(doc.trade)}
                    </p>
                  </div>
                  {doc.status === 'complete' ? (
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  ) : (
                    <Clock className="h-5 w-5 text-warning shrink-0" />
                  )}
                  <Link
                    href={`/documents/new?edit=${doc.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted hover:text-text-primary transition-colors shrink-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Filter Bottom Sheet */}
      <BottomSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="필터"
      >
        <div className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              공종
            </label>
            <Select
              value={selectedTrade}
              onChange={(value) => setSelectedTrade(value)}
              options={[
                { value: 'all', label: '전체 공종' },
                ...TRADES,
              ]}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setSelectedTrade('all');
                setShowFilters(false);
              }}
            >
              초기화
            </Button>
            <Button
              className="flex-1"
              onClick={() => setShowFilters(false)}
            >
              적용
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Floating Action Button (Mobile) */}
      <Link
        href="/documents/new"
        className="fixed bottom-[calc(var(--nav-height)+1rem)] right-4 z-40 flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover transition-colors md:hidden"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}

export default function DocumentListPage() {
  return (
    <Suspense fallback={<div className="p-4">로딩 중...</div>}>
      <DocumentsContent />
    </Suspense>
  );
}
