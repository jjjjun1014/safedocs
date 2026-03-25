/**
 * Document Storage System
 * 로컬스토리지 기반 서류 저장/조회/삭제
 * Supabase 연동 시 이 파일만 교체하면 됨
 */

export interface Participant {
  id: string;          // 참석자 ID (필수)
  name: string;
  role?: string;       // 직책 (반장, 기공 등)
  trade?: string;      // 공종
  signature?: string;  // base64 서명 이미지
  signedAt?: string;   // 서명 시각 (ISO 8601)
}

export interface StoredDocument {
  id: string;
  docType: 'tbm' | 'risk' | 'education' | 'workplan';
  trade: string;
  tradeName: string;
  workDate: string;
  author: string;
  authorSignature?: string;  // 작성자 서명
  authorSignedAt?: string;   // 작성자 서명 시각
  siteName?: string;
  siteId?: string;
  subcontractor?: string;
  status: 'draft' | 'complete';
  risks: Array<{
    hazard: string;
    riskType: string;
    likelihood: number;
    severity: number;
    measure: string;
  }>;
  customRisks: string[];
  specialNotes?: string;     // 특별 전달사항/특이사항
  weather?: string;          // 날씨
  workerCount?: number;
  participants?: Participant[];  // 참석자 목록

  // ver6-1 추가 필드
  evaluator?: string;         // 평가자 (위험성평가서)
  siteManager?: string;       // 소장명 (위험성평가서)
  lastModifiedAt?: string;    // 최종 수정일
  isLocked?: boolean;         // 수정 잠금 여부 (위험성평가서)
  educationType?: string;     // 교육 종류 (안전교육일지)
  location?: string;          // 작업장소
  equipment?: string;         // 투입장비

  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'safedocs_documents';

function getStoredDocuments(): StoredDocument[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function setStoredDocuments(documents: StoredDocument[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
}

export const documentStore = {
  /**
   * 모든 서류 조회 (최신순 정렬)
   */
  getAll(): StoredDocument[] {
    return getStoredDocuments().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  /**
   * ID로 서류 조회
   */
  getById(id: string): StoredDocument | null {
    const documents = getStoredDocuments();
    return documents.find((doc) => doc.id === id) || null;
  },

  /**
   * 서류 저장 (생성 또는 업데이트)
   */
  save(doc: StoredDocument): void {
    const documents = getStoredDocuments();
    const existingIndex = documents.findIndex((d) => d.id === doc.id);
    
    const now = new Date().toISOString();
    const docWithTimestamp = {
      ...doc,
      updatedAt: now,
      createdAt: doc.createdAt || now,
    };
    
    if (existingIndex >= 0) {
      documents[existingIndex] = docWithTimestamp;
    } else {
      documents.push(docWithTimestamp);
    }
    
    setStoredDocuments(documents);
  },

  /**
   * 서류 삭제
   */
  delete(id: string): void {
    const documents = getStoredDocuments();
    const filtered = documents.filter((doc) => doc.id !== id);
    setStoredDocuments(filtered);
  },

  /**
   * 고유 ID 생성
   */
  generateId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  },

  /**
   * 현장별 서류 조회
   */
  getBySiteId(siteId: string): StoredDocument[] {
    return getStoredDocuments()
      .filter((doc) => doc.siteId === siteId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /**
   * 서류 유형별 조회
   */
  getByDocType(docType: StoredDocument['docType']): StoredDocument[] {
    return getStoredDocuments()
      .filter((doc) => doc.docType === docType)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /**
   * 최근 서류 조회
   */
  getRecent(limit: number = 5): StoredDocument[] {
    return this.getAll().slice(0, limit);
  },

  /**
   * 서류 상태 변경
   */
  updateStatus(id: string, status: 'draft' | 'complete'): void {
    const doc = this.getById(id);
    if (doc) {
      this.save({ ...doc, status });
    }
  },
};

export type { StoredDocument as Document };
