// =====================
// Site Types
// =====================
export interface Site {
  id: string;
  name: string;
  constructionName?: string;
  clientName?: string;
  startDate?: string;
  address?: string;
}

export interface SiteDefaults {
  id: string;
  siteId: string;
  commonTrades: string[];
  defaultWriter: string;
  defaultCompany: string;
  defaultSafetyContact: string;
}

// =====================
// User Types
// =====================
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  businessNumber?: string;
}

// =====================
// Document Types
// =====================
export type DocType = 'tbm' | 'risk' | 'education' | 'workplan';
export type DocStatus = 'draft' | 'complete';

export interface Document {
  id: string;
  siteId: string;
  userId: string;
  docType: DocType;
  tradeName: string;
  tradeValue: string;
  workDate: string;
  weather?: string;
  author?: string;
  subcontractor?: string;
  status: DocStatus;
  content?: DocumentContent;
  pdfUrl?: string;
  shareToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentContent {
  header: Record<string, string>;
  works: WorkItem[];
  risks: RiskItem[];
  notice?: string;
  signatures: SignatureItem[];
}

export interface WorkItem {
  trade: string;
  location: string;
  workers: number;
}

export interface SignatureItem {
  name: string;
  signature?: string;
}

// =====================
// Risk Assessment Types
// =====================
export interface RiskItem {
  hazard: string;
  riskType: string;
  likelihood: 1 | 2 | 3 | 4;
  severity: 1 | 2 | 3 | 4;
  measure: string;
}

// =====================
// Subscription Types
// =====================
export type PlanType = 'basic' | 'standard' | 'pro';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial';

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt: string;
}

// =====================
// Form Input Types
// =====================
export interface DocumentFormInputs {
  docType: DocType;
  trade: string;
  workDate: string;
  weather: string;
  author: string;
  subcontractor: string;
  location?: string;
  workers?: number;
  specialNotice?: string;
}

// =====================
// Option Types
// =====================
export interface SelectOption {
  value: string;
  label: string;
}

export interface TabItem {
  value: string;
  label: string;
  count?: number;
}
