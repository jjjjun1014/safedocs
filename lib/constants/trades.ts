import type { SelectOption } from '@/types';

export const TRADES: SelectOption[] = [
  { value: 'scaffold', label: '비계 설치/해체' },
  { value: 'rebar_concrete', label: '철근·콘크리트' },
  { value: 'excavation', label: '굴착 작업' },
  { value: 'high_place', label: '고소 작업 (2m 이상)' },
  { value: 'heavy_equipment', label: '중장비 작업' },
  { value: 'welding', label: '용접·절단' },
  { value: 'electrical', label: '전기 작업' },
  { value: 'waterproof', label: '방수 작업' },
  { value: 'painting', label: '도장 작업' },
  { value: 'demolition', label: '구조물 해체' },
  { value: 'interior', label: '실내건축' },
  { value: 'window', label: '창호 설치' },
  { value: 'drainage', label: '상하수도 설비' },
  { value: 'road', label: '포장 공사' },
  { value: 'soil', label: '토공사' },
  { value: 'foundation', label: '기초 공사' },
  { value: 'steel_structure', label: '철골 구조물' },
  { value: 'crane', label: '크레인 작업' },
  { value: 'confined_space', label: '밀폐공간 작업' },
  { value: 'fire', label: '화재위험 작업' },
  { value: 'plumbing', label: '배관 설비' },
  { value: 'hvac', label: '냉난방 설비' },
  { value: 'fire_protection', label: '소방 설비' },
  { value: 'landscaping', label: '조경 작업' },
  { value: 'masonry', label: '조적 공사' },
  { value: 'glass', label: '유리 공사' },
  { value: 'insulation', label: '단열 공사' },
  { value: 'signage', label: '간판·사인 설치' },
  { value: 'elevator', label: '승강기 설치' },
  { value: 'other', label: '기타 (직접 입력)' },
];

export function getTradeLabel(value: string): string {
  const trade = TRADES.find(t => t.value === value);
  return trade?.label || value;
}
