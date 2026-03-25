'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Download,
  ShieldAlert,
  Calendar,
  User,
  Building2,
  Cloud,
  ClipboardList,
  AlertTriangle,
  BookOpen,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Button, Card, Badge, EmptyState } from '@/components/ui';
import { formatKoreanDate } from '@/lib/utils/format';
import { getDocumentByShareToken } from '@/lib/utils/document';
import type { Document, DocType, RiskItem } from '@/types';

const DOC_TYPE_INFO: Record<DocType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  tbm: { label: 'TBM 일지', icon: ClipboardList, color: 'primary' },
  risk: { label: '위험성평가서', icon: AlertTriangle, color: 'warning' },
  education: { label: '안전교육일지', icon: BookOpen, color: 'success' },
  workplan: { label: '작업계획서', icon: FileText, color: 'danger' },
};

export default function ShareViewerPage() {
  const params = useParams();
  const token = params.token as string;
  
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // 공유 토큰으로 서류 조회
    const doc = getDocumentByShareToken(token);
    
    if (doc) {
      setDocument(doc);
    } else {
      setNotFound(true);
    }
    
    setLoading(false);
  }, [token]);

  const handleDownloadPDF = () => {
    // TODO: PDF 생성 및 다운로드 구현
    alert('PDF 다운로드 기능은 준비 중입니다');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (notFound || !document) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        {/* 헤더 */}
        <header className="bg-surface border-b border-border py-4 px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg text-white">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-primary">SafeDocs</span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <EmptyState
            icon="file"
            title="링크가 만료되었거나 존재하지 않습니다"
            description="공유 링크가 유효하지 않습니다. 서류 작성자에게 새 링크를 요청해주세요."
            action={
              <Link href="/">
                <Button variant="primary">SafeDocs 홈으로</Button>
              </Link>
            }
          />
        </main>
      </div>
    );
  }

  const docInfo = DOC_TYPE_INFO[document.docType];
  const Icon = docInfo.icon;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* 헤더 */}
      <header className="bg-surface border-b border-border py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg text-white">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-primary">SafeDocs</span>
          </Link>
          
          <Badge variant={docInfo.color as any}>{docInfo.label}</Badge>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* 서류 제목 */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-lg bg-${docInfo.color}-light`}>
              <Icon className={`h-6 w-6 text-${docInfo.color}`} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                {document.tradeName}
              </h1>
              <p className="text-sm text-text-muted">
                {formatKoreanDate(document.workDate)}
              </p>
            </div>
          </div>

          {/* 서류 정보 */}
          <Card padding="md" className="mb-4">
            <h2 className="text-sm font-medium text-text-secondary mb-3">서류 정보</h2>
            
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-text-muted" />
                <span className="text-text-secondary">작업일:</span>
                <span className="text-text-primary">{formatKoreanDate(document.workDate)}</span>
              </div>
              
              {document.author && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-text-muted" />
                  <span className="text-text-secondary">작성자:</span>
                  <span className="text-text-primary">{document.author}</span>
                </div>
              )}
              
              {document.subcontractor && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-text-muted" />
                  <span className="text-text-secondary">협력업체:</span>
                  <span className="text-text-primary">{document.subcontractor}</span>
                </div>
              )}
              
              {document.weather && (
                <div className="flex items-center gap-2 text-sm">
                  <Cloud className="h-4 w-4 text-text-muted" />
                  <span className="text-text-secondary">날씨:</span>
                  <span className="text-text-primary">{document.weather}</span>
                </div>
              )}
            </div>
          </Card>

          {/* 서류 내용 */}
          <Card padding="md" className="mb-6">
            <h2 className="text-sm font-medium text-text-secondary mb-3">서류 내용</h2>
            
            {document.content?.risks && document.content.risks.length > 0 && (
              <div className="space-y-3">
                {document.content.risks.map((risk: RiskItem, index: number) => (
                  <div
                    key={index}
                    className="p-3 bg-surface-2 rounded-lg border border-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-text-primary">
                        {risk.hazard}
                      </p>
                      <Badge variant="warning" size="sm">
                        {risk.riskType}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-text-muted mb-2">
                      <span>가능성: {risk.likelihood}</span>
                      <span>중대성: {risk.severity}</span>
                      <span>위험도: {risk.likelihood * risk.severity}</span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      <span className="text-success font-medium">안전대책:</span> {risk.measure}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {document.content?.notice && (
              <div className="mt-4 p-3 bg-primary-light rounded-lg">
                <p className="text-sm text-primary">{document.content.notice}</p>
              </div>
            )}
          </Card>

          {/* PDF 다운로드 버튼 */}
          <Button
            variant="primary"
            fullWidth
            icon={<Download className="h-4 w-4" />}
            onClick={handleDownloadPDF}
            className="mb-8"
          >
            PDF 다운로드
          </Button>

          {/* 바이럴 푸터 */}
          <div className="text-center py-8 border-t border-border">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
            >
              <ShieldAlert className="h-4 w-4" />
              SafeDocs로 만들었습니다
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
