'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Settings,
  Building2,
  MapPin,
  Calendar,
  User,
  Plus,
  FileText,
  AlertTriangle,
  BookOpen,
  ClipboardList,
} from 'lucide-react';
import {
  PageHeader,
  Button,
  Card,
  Badge,
  Tabs,
  EmptyState,
} from '@/components/ui';
import { formatKoreanDate } from '@/lib/utils/format';
import type { Site, Document, DocType } from '@/types';

// Mock 데이터
const MOCK_SITE: Site = {
  id: '1',
  name: '강남역 오피스텔 신축공사',
  constructionName: '강남역 3번 출구 오피스텔 신축공사',
  clientName: '강남개발(주)',
  startDate: '2024-01-15',
  address: '서울특별시 강남구 역삼동 123-45',
};

const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc1',
    siteId: '1',
    userId: 'user1',
    docType: 'tbm',
    tradeName: '비계 설치/해체',
    tradeValue: 'scaffold',
    workDate: '2024-03-25',
    status: 'complete',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'doc2',
    siteId: '1',
    userId: 'user1',
    docType: 'risk',
    tradeName: '철근·콘크리트',
    tradeValue: 'rebar_concrete',
    workDate: '2024-03-24',
    status: 'complete',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'doc3',
    siteId: '1',
    userId: 'user1',
    docType: 'education',
    tradeName: '고소작업',
    tradeValue: 'high_place',
    workDate: '2024-03-23',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DOC_TYPE_INFO: Record<DocType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  tbm: { label: 'TBM 일지', icon: ClipboardList, color: 'primary' },
  risk: { label: '위험성평가서', icon: AlertTriangle, color: 'warning' },
  education: { label: '안전교육일지', icon: BookOpen, color: 'success' },
  workplan: { label: '작업계획서', icon: FileText, color: 'danger' },
};

const TABS = [
  { value: 'all', label: '전체', count: 12 },
  { value: 'tbm', label: 'TBM', count: 5 },
  { value: 'risk', label: '위험성평가', count: 3 },
  { value: 'education', label: '교육', count: 2 },
  { value: 'workplan', label: '작업계획', count: 2 },
];

export default function SiteDetailPage() {
  const params = useParams();
  const siteId = params.id as string;
  
  const [site, setSite] = useState<Site | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Supabase에서 현장 데이터 가져오기
    setSite(MOCK_SITE);
    setDocuments(MOCK_DOCUMENTS);
    setLoading(false);
  }, [siteId]);

  const filteredDocuments = activeTab === 'all'
    ? documents
    : documents.filter(doc => doc.docType === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!site) {
    return (
      <EmptyState
        icon="search"
        title="현장을 찾을 수 없습니다"
        description="요청하신 현장 정보를 찾을 수 없습니다"
        action={
          <Link href="/sites">
            <Button variant="primary">현장 목록으로</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={site.name}
        backHref="/sites"
        actions={
          <Link href={`/sites/${siteId}/settings`}>
            <Button variant="secondary" icon={<Settings className="h-4 w-4" />}>
              설정
            </Button>
          </Link>
        }
      />

      {/* 현장 정보 카드 */}
      <Card padding="md" className="mb-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {site.constructionName && (
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-text-muted flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-text-muted mb-0.5">공사명</p>
                <p className="text-sm text-text-primary">{site.constructionName}</p>
              </div>
            </div>
          )}
          
          {site.clientName && (
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-text-muted flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-text-muted mb-0.5">발주처</p>
                <p className="text-sm text-text-primary">{site.clientName}</p>
              </div>
            </div>
          )}
          
          {site.startDate && (
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-text-muted flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-text-muted mb-0.5">착공일</p>
                <p className="text-sm text-text-primary">{formatKoreanDate(site.startDate)}</p>
              </div>
            </div>
          )}
          
          {site.address && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-text-muted flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-text-muted mb-0.5">현장주소</p>
                <p className="text-sm text-text-primary">{site.address}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 서류 현황 */}
      <div className="mb-4">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* 서류 목록 */}
      {filteredDocuments.length === 0 ? (
        <EmptyState
          icon="file"
          title="서류가 없습니다"
          description="새 서류를 작성하여 시작하세요"
          action={
            <Link href="/documents/new">
              <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
                서류 작성
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredDocuments.map((doc) => {
            const docInfo = DOC_TYPE_INFO[doc.docType];
            const Icon = docInfo.icon;
            
            return (
              <Link key={doc.id} href={`/documents/${doc.id}`}>
                <Card
                  padding="md"
                  className="hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-${docInfo.color}-light`}>
                      <Icon className={`h-5 w-5 text-${docInfo.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={docInfo.color as any}
                          size="sm"
                        >
                          {docInfo.label}
                        </Badge>
                        {doc.status === 'draft' && (
                          <Badge variant="neutral" size="sm">임시저장</Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-text-primary truncate">
                        {doc.tradeName}
                      </p>
                      <p className="text-xs text-text-muted">
                        {formatKoreanDate(doc.workDate)}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* 모바일 FAB */}
      <Link
        href="/documents/new"
        className="md:hidden fixed right-4 bottom-20 z-30"
      >
        <Button
          variant="primary"
          className="w-14 h-14 rounded-full shadow-lg"
          icon={<Plus className="h-6 w-6" />}
        />
      </Link>
    </div>
  );
}
