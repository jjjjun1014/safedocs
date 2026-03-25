'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Download,
  Share2,
  Edit,
  Trash2,
  ClipboardList,
  AlertTriangle,
  BookOpen,
  FileText,
} from 'lucide-react';
import {
  PageHeader,
  Button,
  Card,
  Badge,
  Modal,
  EmptyState,
  SignatureModal,
  Input,
} from '@/components/ui';
import {
  TBMDocument,
  RiskDocument,
  EducationDocument,
  WorkplanDocument,
} from '@/components/documents';
import { documentStore, type StoredDocument, type Participant } from '@/lib/store/documentStore';
import type { DocType } from '@/types';

const DOC_TYPE_INFO: Record<DocType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  tbm: { label: 'TBM 일지', icon: ClipboardList, color: 'primary' },
  risk: { label: '위험성평가서', icon: AlertTriangle, color: 'warning' },
  education: { label: '안전교육일지', icon: BookOpen, color: 'success' },
  workplan: { label: '작업계획서', icon: FileText, color: 'danger' },
};

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;
  
  const [document, setDocument] = useState<StoredDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [signingParticipant, setSigningParticipant] = useState<Participant | null>(null);
  const [isAuthorSigning, setIsAuthorSigning] = useState(false);
  const [specialNotesModalOpen, setSpecialNotesModalOpen] = useState(false);
  const [specialNotesInput, setSpecialNotesInput] = useState('');

  useEffect(() => {
    // 로컬 스토리지에서 서류 가져오기
    const doc = documentStore.getById(documentId);
    setDocument(doc);
    setLoading(false);
  }, [documentId]);

  const handleDelete = () => {
    if (document) {
      documentStore.delete(document.id);
      router.push('/documents');
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/share/${document?.id}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${DOC_TYPE_INFO[document!.docType].label} - ${document!.tradeName}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('링크가 복사되었습니다');
      }
    } catch (error) {
      console.error('공유 실패:', error);
    }
    
    setShareModalOpen(false);
  };

  const handleSignatureClick = (participant: Participant) => {
    setSigningParticipant(participant);
    setIsAuthorSigning(false);
    setSignatureModalOpen(true);
  };

  const handleAuthorSignatureClick = () => {
    setSigningParticipant(null);
    setIsAuthorSigning(true);
    setSignatureModalOpen(true);
  };

  const handleSignatureComplete = (signatureData: string) => {
    if (!document) return;

    // 작성자 서명
    if (isAuthorSigning) {
      const updatedDoc = {
        ...document,
        authorSignature: signatureData,
        authorSignedAt: new Date().toISOString(),
      };
      documentStore.save(updatedDoc);
      setDocument(updatedDoc);
      setIsAuthorSigning(false);
      return;
    }

    // 참석자 서명
    if (!signingParticipant) return;

    // 문서 참석자에 서명 추가
    const updatedParticipants = document.participants?.map((p) =>
      p.id === signingParticipant.id
        ? { ...p, signature: signatureData, signedAt: new Date().toISOString() }
        : p
    );

    // 문서 업데이트
    const updatedDoc = { ...document, participants: updatedParticipants };
    documentStore.save(updatedDoc);
    setDocument(updatedDoc);

    setSigningParticipant(null);
  };

  const handleSpecialNotesClick = () => {
    setSpecialNotesInput(document?.specialNotes || '');
    setSpecialNotesModalOpen(true);
  };

  const handleSpecialNotesSave = () => {
    if (!document) return;
    const updatedDoc = { ...document, specialNotes: specialNotesInput };
    documentStore.save(updatedDoc);
    setDocument(updatedDoc);
    setSpecialNotesModalOpen(false);
  };

  const handleDownloadPDF = () => {
    // TODO: PDF 생성 및 다운로드 구현
    window.print();
  };

  const renderDocument = () => {
    if (!document) return null;
    
    switch (document.docType) {
      case 'tbm':
        return (
          <TBMDocument
            document={document}
            interactive
            onSignatureClick={handleSignatureClick}
            onAuthorSignatureClick={handleAuthorSignatureClick}
            onSpecialNotesClick={handleSpecialNotesClick}
          />
        );
      case 'risk':
        return <RiskDocument document={document} interactive />;
      case 'education':
        return (
          <EducationDocument
            document={document}
            interactive
            onSignatureClick={handleSignatureClick}
            onAuthorSignatureClick={handleAuthorSignatureClick}
          />
        );
      case 'workplan':
        return <WorkplanDocument document={document} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!document) {
    return (
      <EmptyState
        icon="search"
        title="서류를 찾을 수 없습니다"
        description="요청하신 서류를 찾을 수 없습니다"
        action={
          <Link href="/documents">
            <Button variant="primary">서류 목록으로</Button>
          </Link>
        }
      />
    );
  }

  const docInfo = DOC_TYPE_INFO[document.docType];
  const Icon = docInfo.icon;

  return (
    <div className="pb-20">
      <div className="print:hidden">
        <PageHeader
          title={document.tradeName}
          backHref="/documents"
          actions={
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<Download className="h-4 w-4" />}
                onClick={handleDownloadPDF}
              >
                <span className="hidden sm:inline">PDF</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={<Share2 className="h-4 w-4" />}
                onClick={() => setShareModalOpen(true)}
              >
                <span className="hidden sm:inline">공유</span>
              </Button>
            </div>
          }
        />
      </div>

      {/* 서류 정보 헤더 */}
      <Card padding="md" className="mb-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-${docInfo.color}-light`}>
            <Icon className={`h-5 w-5 text-${docInfo.color}`} />
          </div>
          <Badge variant={docInfo.color as 'success' | 'warning' | 'danger' | 'info' | 'neutral'}>{docInfo.label}</Badge>
          {document.status === 'draft' && (
            <Badge variant="neutral">임시저장</Badge>
          )}
          <span className="text-sm text-text-muted ml-auto">
            {document.workDate}
          </span>
        </div>
      </Card>

      {/* 서류 렌더링 */}
      <Card padding="none" className="mb-4 overflow-hidden print-content">
        {renderDocument()}
      </Card>

      {/* 액션 버튼 */}
      <div className="flex gap-3 print:hidden">
        {document.docType === 'risk' ? (
          <div className="flex-1 text-center py-3 px-4 bg-surface-2 rounded-lg text-sm text-text-muted">
            위험성평가서는 제출 후 수정할 수 없습니다
          </div>
        ) : (
          <Button
            variant="secondary"
            fullWidth
            icon={<Edit className="h-4 w-4" />}
            onClick={() => router.push(`/documents/new?edit=${document.id}`)}
          >
            수정하기
          </Button>
        )}
        <Button
          variant="danger"
          fullWidth
          icon={<Trash2 className="h-4 w-4" />}
          onClick={() => setDeleteModalOpen(true)}
        >
          삭제하기
        </Button>
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="서류 삭제"
        size="sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              취소
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              삭제
            </Button>
          </div>
        }
      >
        <p className="text-text-secondary">
          이 서류를 삭제하시겠습니까? 삭제된 서류는 복구할 수 없습니다.
        </p>
      </Modal>

      {/* 공유 모달 */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="서류 공유"
        size="sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShareModalOpen(false)}>
              닫기
            </Button>
            <Button variant="primary" onClick={handleShare}>
              링크 복사
            </Button>
          </div>
        }
      >
        <p className="text-text-secondary mb-4">
          공유 링크를 통해 이 서류를 다른 사람과 공유할 수 있습니다.
          링크를 받은 사람은 로그인 없이 서류를 확인할 수 있습니다.
        </p>
        <div className="p-3 bg-surface-2 rounded-lg text-sm text-text-muted break-all">
          {typeof window !== 'undefined' && `${window.location.origin}/share/${document.id}`}
        </div>
      </Modal>

      {/* 서명 모달 */}
      <SignatureModal
        isOpen={signatureModalOpen}
        onClose={() => {
          setSignatureModalOpen(false);
          setSigningParticipant(null);
          setIsAuthorSigning(false);
        }}
        participantName={isAuthorSigning ? document.author : (signingParticipant?.name || '')}
        participantRole={isAuthorSigning ? '작성자' : signingParticipant?.role}
        onComplete={handleSignatureComplete}
      />

      {/* 특별 전달사항 모달 */}
      <Modal
        isOpen={specialNotesModalOpen}
        onClose={() => setSpecialNotesModalOpen(false)}
        title="특별 전달사항"
        size="md"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setSpecialNotesModalOpen(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={handleSpecialNotesSave}>
              저장
            </Button>
          </div>
        }
      >
        <textarea
          value={specialNotesInput}
          onChange={(e) => setSpecialNotesInput(e.target.value)}
          placeholder="특별 전달사항을 입력하세요"
          className="w-full h-32 p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </Modal>
    </div>
  );
}
