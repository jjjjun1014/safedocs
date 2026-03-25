import type { DocType, RiskItem, Document, DocumentContent, WorkItem, SignatureItem } from '@/types';
import { getRiskData } from '@/lib/constants/riskData';
import { getTradeLabel } from '@/lib/constants/trades';
import { formatKoreanDate } from './format';

export interface DocumentInput {
  docType: DocType;
  trade: string;
  date: string;
  author: string;
  siteName?: string;
  subcontractor?: string;
  selectedRisks: RiskItem[];
  customRisks?: string[];
  weather?: string;
  workers?: number;
  location?: string;
}

export interface TBMContent extends DocumentContent {
  tbmTime: string;
  workDescription: string;
  safetyTalk: string;
}

export interface RiskContent extends DocumentContent {
  evaluationDate: string;
  evaluator: string;
  riskLevel: '상' | '중' | '하';
}

export interface EducationContent extends DocumentContent {
  educationType: string;
  educationTime: number;
  instructor: string;
  attendees: string[];
}

export interface WorkplanContent extends DocumentContent {
  workSequence: string[];
  safetyMeasures: string[];
  equipment: string[];
  ppe: string[];
}

/**
 * 서류 ID 생성
 */
function generateDocId(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 공유 토큰 생성
 */
function generateShareToken(): string {
  return `share_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * TBM 서류 생성
 */
function generateTBM(input: DocumentInput): TBMContent {
  const tradeLabel = getTradeLabel(input.trade);
  const risks = input.selectedRisks.length > 0 
    ? input.selectedRisks 
    : getRiskData(input.trade).slice(0, 3);

  return {
    header: {
      date: formatKoreanDate(input.date),
      site: input.siteName || '',
      trade: tradeLabel,
      weather: input.weather || '맑음',
      author: input.author,
      subcontractor: input.subcontractor || '',
    },
    works: [
      {
        trade: tradeLabel,
        location: input.location || '현장 전역',
        workers: input.workers || 5,
      },
    ],
    risks,
    tbmTime: '08:00',
    workDescription: `${tradeLabel} 작업 수행`,
    safetyTalk: risks.map(r => `- ${r.hazard}: ${r.measure}`).join('\n'),
    notice: '안전수칙을 준수하고 보호구를 착용합시다.',
    signatures: [],
  };
}

/**
 * 위험성평가서 생성
 */
function generateRisk(input: DocumentInput): RiskContent {
  const tradeLabel = getTradeLabel(input.trade);
  const risks = input.selectedRisks.length > 0 
    ? input.selectedRisks 
    : getRiskData(input.trade);

  // Calculate average risk level
  const avgRisk = risks.reduce((sum, r) => sum + (r.likelihood * r.severity), 0) / risks.length;
  const riskLevel: '상' | '중' | '하' = avgRisk >= 9 ? '상' : avgRisk >= 4 ? '중' : '하';

  return {
    header: {
      date: formatKoreanDate(input.date),
      site: input.siteName || '',
      trade: tradeLabel,
      author: input.author,
    },
    works: [
      {
        trade: tradeLabel,
        location: input.location || '현장 전역',
        workers: input.workers || 5,
      },
    ],
    risks,
    evaluationDate: formatKoreanDate(input.date),
    evaluator: input.author,
    riskLevel,
    signatures: [],
  };
}

/**
 * 안전교육일지 생성
 */
function generateEducation(input: DocumentInput): EducationContent {
  const tradeLabel = getTradeLabel(input.trade);
  const risks = input.selectedRisks.length > 0 
    ? input.selectedRisks 
    : getRiskData(input.trade).slice(0, 5);

  return {
    header: {
      date: formatKoreanDate(input.date),
      site: input.siteName || '',
      trade: tradeLabel,
      author: input.author,
    },
    works: [
      {
        trade: tradeLabel,
        location: input.location || '현장 전역',
        workers: input.workers || 10,
      },
    ],
    risks,
    educationType: '특별안전보건교육',
    educationTime: 2,
    instructor: input.author,
    attendees: [],
    notice: risks.map(r => `• ${r.hazard}에 대한 안전대책: ${r.measure}`).join('\n'),
    signatures: [],
  };
}

/**
 * 작업계획서 생성
 */
function generateWorkplan(input: DocumentInput): WorkplanContent {
  const tradeLabel = getTradeLabel(input.trade);
  const risks = input.selectedRisks.length > 0 
    ? input.selectedRisks 
    : getRiskData(input.trade);

  const safetyMeasures = risks.map(r => r.measure);
  const uniqueMeasures = [...new Set(safetyMeasures)];

  return {
    header: {
      date: formatKoreanDate(input.date),
      site: input.siteName || '',
      trade: tradeLabel,
      author: input.author,
      subcontractor: input.subcontractor || '',
    },
    works: [
      {
        trade: tradeLabel,
        location: input.location || '현장 전역',
        workers: input.workers || 5,
      },
    ],
    risks,
    workSequence: [
      '1. 작업 전 안전점검 실시',
      '2. 보호구 착용 상태 확인',
      '3. 작업 구역 안전시설 점검',
      `4. ${tradeLabel} 작업 수행`,
      '5. 작업 완료 후 정리정돈',
    ],
    safetyMeasures: uniqueMeasures.slice(0, 5),
    equipment: ['작업 도구', '안전장비'],
    ppe: ['안전모', '안전화', '안전대', '보안경', '보호장갑'],
    signatures: [],
  };
}

/**
 * 서류 생성 함수
 */
export function generateDocument(input: DocumentInput): Document {
  const id = generateDocId();
  const now = new Date().toISOString();
  
  let content: DocumentContent;
  
  switch (input.docType) {
    case 'tbm':
      content = generateTBM(input);
      break;
    case 'risk':
      content = generateRisk(input);
      break;
    case 'education':
      content = generateEducation(input);
      break;
    case 'workplan':
      content = generateWorkplan(input);
      break;
    default:
      throw new Error(`Unknown document type: ${input.docType}`);
  }

  return {
    id,
    siteId: '',
    userId: '',
    docType: input.docType,
    tradeName: getTradeLabel(input.trade),
    tradeValue: input.trade,
    workDate: input.date,
    weather: input.weather,
    author: input.author,
    subcontractor: input.subcontractor,
    status: 'complete',
    content,
    shareToken: generateShareToken(),
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * 로컬 스토리지에 서류 저장
 */
export function saveDocumentToStorage(document: Document): void {
  const documents = getDocumentsFromStorage();
  documents.unshift(document);
  localStorage.setItem('safedocs_documents', JSON.stringify(documents));
}

/**
 * 로컬 스토리지에서 서류 목록 가져오기
 */
export function getDocumentsFromStorage(): Document[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('safedocs_documents');
  return stored ? JSON.parse(stored) : [];
}

/**
 * 로컬 스토리지에서 특정 서류 가져오기
 */
export function getDocumentById(id: string): Document | null {
  const documents = getDocumentsFromStorage();
  return documents.find(d => d.id === id) || null;
}

/**
 * 로컬 스토리지에서 공유 토큰으로 서류 가져오기
 */
export function getDocumentByShareToken(token: string): Document | null {
  const documents = getDocumentsFromStorage();
  return documents.find(d => d.shareToken === token) || null;
}

/**
 * 로컬 스토리지에서 서류 삭제
 */
export function deleteDocumentFromStorage(id: string): void {
  const documents = getDocumentsFromStorage();
  const filtered = documents.filter(d => d.id !== id);
  localStorage.setItem('safedocs_documents', JSON.stringify(filtered));
}
