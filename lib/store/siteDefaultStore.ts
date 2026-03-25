/**
 * Site Default Storage System
 * 현장별 기본값 저장/조회
 */

export interface SiteDefault {
  siteId: string;
  defaultWriter: string;
  defaultSubcontractor: string;
  defaultTrade: string;
  safetyContact: string;
  siteName: string;
  updatedAt: string;
}

const STORAGE_KEY = 'safedocs_site_defaults';

function getStoredDefaults(): SiteDefault[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function setStoredDefaults(data: SiteDefault[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const siteDefaultStore = {
  get(siteId: string): SiteDefault | null {
    return getStoredDefaults().find((d) => d.siteId === siteId) || null;
  },

  save(defaults: SiteDefault): void {
    const all = getStoredDefaults();
    const idx = all.findIndex((d) => d.siteId === defaults.siteId);
    const entry = { ...defaults, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      all[idx] = entry;
    } else {
      all.push(entry);
    }
    setStoredDefaults(all);
  },

  getAll(): SiteDefault[] {
    return getStoredDefaults();
  },
};
