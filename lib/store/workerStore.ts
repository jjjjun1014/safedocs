/**
 * Worker Storage System
 * 현장별 작업자 등록/관리
 */

export interface Worker {
  id: string;
  name: string;
  role?: string;        // 직책 (반장, 기공, 조공 등)
  trade?: string;       // 공종
  phone?: string;       // 연락처
  company?: string;     // 소속 업체
  photos?: string[];    // base64 사진 배열
  signature?: string;   // base64 서명 이미지
  signatureUpdatedAt?: string; // 서명 저장 시각
  createdAt?: string;   // 등록일
  updatedAt?: string;   // 수정일
}

export interface SiteWorkers {
  siteId: string;
  workers: Worker[];
  updatedAt: string;
}

const STORAGE_KEY = 'safedocs_site_workers';

function getStoredSiteWorkers(): SiteWorkers[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function setStoredSiteWorkers(data: SiteWorkers[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const workerStore = {
  /**
   * 현장의 작업자 목록 조회
   */
  getWorkers(siteId: string): Worker[] {
    const allData = getStoredSiteWorkers();
    const siteData = allData.find((s) => s.siteId === siteId);
    return siteData?.workers || [];
  },

  /**
   * 작업자 추가
   */
  addWorker(siteId: string, worker: Omit<Worker, 'id'>): Worker {
    const allData = getStoredSiteWorkers();
    const siteIndex = allData.findIndex((s) => s.siteId === siteId);
    
    const now = new Date().toISOString();
    const newWorker: Worker = {
      ...worker,
      id: `worker_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };
    
    if (siteIndex >= 0) {
      allData[siteIndex].workers.push(newWorker);
      allData[siteIndex].updatedAt = new Date().toISOString();
    } else {
      allData.push({
        siteId,
        workers: [newWorker],
        updatedAt: new Date().toISOString(),
      });
    }
    
    setStoredSiteWorkers(allData);
    return newWorker;
  },

  /**
   * 작업자 수정
   */
  updateWorker(siteId: string, workerId: string, updates: Partial<Omit<Worker, 'id'>>): void {
    const allData = getStoredSiteWorkers();
    const siteIndex = allData.findIndex((s) => s.siteId === siteId);
    
    if (siteIndex >= 0) {
      const workerIndex = allData[siteIndex].workers.findIndex((w) => w.id === workerId);
      if (workerIndex >= 0) {
        allData[siteIndex].workers[workerIndex] = {
          ...allData[siteIndex].workers[workerIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        allData[siteIndex].updatedAt = new Date().toISOString();
        setStoredSiteWorkers(allData);
      }
    }
  },

  /**
   * 작업자 삭제
   */
  deleteWorker(siteId: string, workerId: string): void {
    const allData = getStoredSiteWorkers();
    const siteIndex = allData.findIndex((s) => s.siteId === siteId);
    
    if (siteIndex >= 0) {
      allData[siteIndex].workers = allData[siteIndex].workers.filter(
        (w) => w.id !== workerId
      );
      allData[siteIndex].updatedAt = new Date().toISOString();
      setStoredSiteWorkers(allData);
    }
  },

  /**
   * 공종별 작업자 필터링
   */
  getWorkersByTrade(siteId: string, trade: string): Worker[] {
    const workers = this.getWorkers(siteId);
    if (!trade) return workers;
    return workers.filter((w) => w.trade === trade || !w.trade);
  },

  /**
   * 작업자 일괄 추가 (이름만)
   */
  addWorkersQuick(siteId: string, names: string[]): Worker[] {
    const newWorkers: Worker[] = [];
    
    names.forEach((name) => {
      if (name.trim()) {
        const worker = this.addWorker(siteId, { name: name.trim() });
        newWorkers.push(worker);
      }
    });
    
    return newWorkers;
  },

  /**
   * 작업자 ID로 조회
   */
  getWorkerById(siteId: string, workerId: string): Worker | null {
    const workers = this.getWorkers(siteId);
    return workers.find((w) => w.id === workerId) || null;
  },

  /**
   * 고유 ID 생성
   */
  generateId(): string {
    return `worker_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  },

  /**
   * 작업자 서명 업데이트
   */
  updateWorkerSignature(siteId: string, workerId: string, signature: string): void {
    const allData = getStoredSiteWorkers();
    const siteIndex = allData.findIndex((s) => s.siteId === siteId);
    
    if (siteIndex >= 0) {
      const workerIndex = allData[siteIndex].workers.findIndex((w) => w.id === workerId);
      if (workerIndex >= 0) {
        allData[siteIndex].workers[workerIndex] = {
          ...allData[siteIndex].workers[workerIndex],
          signature,
          signatureUpdatedAt: new Date().toISOString(),
        };
        allData[siteIndex].updatedAt = new Date().toISOString();
        setStoredSiteWorkers(allData);
      }
    }
  },

  /**
   * 이름으로 작업자 조회 (서명 불러오기용)
   */
  getWorkerByName(siteId: string, name: string): Worker | undefined {
    const workers = this.getWorkers(siteId);
    return workers.find((w) => w.name === name);
  },
};
