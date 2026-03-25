코드 전체 파악했음. 빠진 것들 정확히 보임.

---

## VSCode (Claude) 프롬프트 — 전체 구현 지시서

```
# SafeDocs 전체 구현 지시서

## 현재 상태 파악
이미 구현된 것:
- app/globals.css (CSS 변수 완성)
- tailwind.config.ts (CSS 변수 연동 완성)
- app/layout.tsx (루트 레이아웃)
- app/page.tsx (랜딩페이지 완성)
- app/(auth)/login/page.tsx (소셜 로그인 UI)
- app/(dashboard)/layout.tsx (대시보드 쉘 연결)
- app/(dashboard)/dashboard/page.tsx (홈 - 임시데이터)
- app/(dashboard)/documents/new/page.tsx (3단계 서류작성)
- app/(dashboard)/documents/page.tsx (서류목록)
- app/(dashboard)/inspection/page.tsx (감독대응모드)
- app/(dashboard)/sites/[id]/settings/page.tsx (현장설정)
- app/auth/callback/route.ts (Supabase 콜백)
- package.json, package-lock.json

## 아직 없는 것 (전부 만들어야 함)

---

## 1. 컴포넌트 라이브러리 전체 생성
### 경로: components/ui/

#### components/ui/Button.tsx
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}
```
- variant primary: bg-primary text-white hover:bg-primary-hover
- variant secondary: bg-surface-2 text-text-primary hover:bg-border
- variant ghost: transparent hover:bg-surface-2
- variant danger: bg-danger text-white
- variant outline: border border-border bg-transparent
- size sm: h-9 px-3 text-sm, md: h-12 px-4 text-base, lg: h-14 px-6 text-lg
- loading: 스피너 표시 + disabled 처리
- fullWidth: w-full
- 모든 색상 CSS 변수 사용

#### components/ui/Card.tsx
```tsx
interface CardProps {
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: boolean
  bordered?: boolean
  className?: string
  onClick?: () => void
}
```
- 기본: bg-surface border border-border rounded-lg
- padding none=p-0, sm=p-3, md=p-4, lg=p-6
- shadow: shadow-md 추가
- onClick 있으면 cursor-pointer hover:bg-surface-2

#### components/ui/Input.tsx
```tsx
interface InputProps {
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  required?: boolean
  disabled?: boolean
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  className?: string
}
```
- label 항상 위에 고정 (floating label 절대 금지)
- 기본 border border-border rounded-md focus:border-border-focus
- error: border-danger + 아래 빨간 에러 텍스트
- font-size 항상 16px (iOS 줌 방지)
- icon left/right 포지션 처리

#### components/ui/Select.tsx
```tsx
interface SelectProps {
  label?: string
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  error?: string
  required?: boolean
  className?: string
}
```
- 기본 select 스타일링 (border, rounded, focus ring)
- 화살표 아이콘 커스텀

#### components/ui/SearchableSelect.tsx
```tsx
interface SearchableSelectProps {
  label?: string
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchable?: boolean
  allowCustomInput?: boolean
  error?: string
  required?: boolean
  className?: string
}
```
- 클릭하면 드롭다운 열림
- searchable=true: 입력하면 실시간 필터링
- allowCustomInput=true: 매칭 없으면 자유입력 허용
- 선택 시 X 버튼으로 초기화
- 키보드 네비게이션 (화살표, Enter, Escape)
- 외부 클릭 시 닫힘

#### components/ui/Badge.tsx
```tsx
interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'outline'
  size?: 'sm' | 'md'
  children: React.ReactNode
  className?: string
  onClick?: () => void
}
```
- success: bg-success-light text-success
- warning: bg-warning-light text-warning
- danger: bg-danger-light text-danger
- info: bg-primary-light text-primary
- neutral: bg-surface-2 text-text-secondary
- outline: border border-border text-text-secondary

#### components/ui/Modal.tsx
```tsx
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'fullscreen'
  footer?: React.ReactNode
}
```
- backdrop blur + 클릭시 닫힘
- ESC 키 닫힘
- body scroll lock
- size sm=max-w-sm, md=max-w-md, lg=max-w-lg, fullscreen=w-full h-full
- animate-fade-in 애니메이션

#### components/ui/BottomSheet.tsx
```tsx
interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}
```
- 하단에서 슬라이드업
- 상단 드래그 핸들 표시
- 스와이프 다운으로 닫기
- backdrop 클릭으로 닫기
- animate-slide-up 사용

#### components/ui/PageHeader.tsx
```tsx
interface PageHeaderProps {
  title: string
  description?: string
  backHref?: string
  action?: React.ReactNode
}
```
- title: text-2xl font-bold text-text-primary
- description: text-sm text-text-secondary mt-1
- backHref: 좌측 ArrowLeft 버튼
- action: 우측 정렬

#### components/ui/EmptyState.tsx
```tsx
interface EmptyStateProps {
  icon?: string  // 'file' | 'search' | 'inbox'
  title: string
  description?: string
  action?: React.ReactNode
}
```
- 중앙 정렬
- 아이콘 lucide-react 사용
- title text-lg font-medium
- description text-sm text-text-secondary

#### components/ui/LoadingSpinner.tsx
```tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  fullPage?: boolean
  text?: string
}
```
- 원형 스피너 (animate-spin)
- fullPage: 화면 전체 중앙

#### components/ui/Tabs.tsx
```tsx
interface TabsProps {
  tabs: Array<{ value: string; label: string; count?: number }>
  activeTab: string
  onChange: (value: string) => void
  variant?: 'line' | 'pill'
}
```
- line: 하단 border-b indicator
- pill: 배경색 변경
- 수평 스크롤 가능 (모바일)
- count 뱃지 표시

#### components/ui/StepIndicator.tsx
```tsx
interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}
```
- 원형 숫자 + 라벨
- 완료된 스텝: bg-primary text-white
- 현재 스텝: border-2 border-primary text-primary
- 미완료: bg-surface-2 text-text-muted
- 스텝 사이 연결선

#### components/ui/ChecklistItem.tsx
```tsx
interface ChecklistItemProps {
  checked: boolean
  onChange: (checked: boolean) => void
  children: React.ReactNode
  disabled?: boolean
}
```
- 커스텀 체크박스 (체크 시 bg-primary)
- children 옆에 렌더링
- 최소 높이 48px (터치 타겟)

#### components/ui/index.ts
위 모든 컴포넌트 export

---

## 2. 레이아웃 컴포넌트 생성
### 경로: components/layouts/

#### components/layouts/DashboardShell.tsx
```
역할: 대시보드 전체 레이아웃 컨테이너
- 모바일: 상단 Header + 하단 BottomNav + 콘텐츠 영역
- 데스크탑(md 이상): 좌측 Sidebar + 콘텐츠 영역
- 콘텐츠 영역: 모바일은 pb-[--bottomnav-height] 패딩, 데스크탑은 pl-[--sidebar-width]
- 최대 콘텐츠 너비: max-w-2xl mx-auto px-4
```

#### components/layouts/Header.tsx
```
모바일 전용 상단 헤더:
- 높이: var(--navbar-height) = 60px
- 좌측: SafeDocs 로고 (ShieldAlert 아이콘 + 텍스트)
- 우측: 알림 버튼 (Bell 아이콘) + 프로필 아바타
- border-b border-border
- bg-surface sticky top-0 z-40
```

#### components/layouts/Sidebar.tsx
```
데스크탑 전용 좌측 사이드바:
- 너비: var(--sidebar-width) = 240px
- fixed left-0 top-0 h-screen
- bg-surface border-r border-border
- 상단: SafeDocs 로고
- SiteSelector 드롭다운 (현장 변경)
- 네비게이션 메뉴:
  - 대시보드 (LayoutDashboard 아이콘) → /dashboard
  - 서류 작성 (FilePlus 아이콘) → /documents/new
  - 서류 목록 (FileText 아이콘) → /documents
  - 감독 대응 (Shield 아이콘) → /inspection
  - 현장 관리 (Building2 아이콘) → /sites
  - 설정 (Settings 아이콘) → /settings
```
- 활성 메뉴: bg-primary-light text-primary font-medium
- 비활성: text-text-secondary hover:bg-surface-2
- 하단: 현재 플랜 표시 + 업그레이드 버튼

#### components/layouts/BottomNav.tsx
```
모바일 전용 하단 네비게이션:
- 높이: var(--bottomnav-height) = 64px
- fixed bottom-0 left-0 right-0 z-40
- bg-surface border-t border-border
- safe-area-bottom 패딩 추가
- 4개 탭:
  - 홈 (LayoutDashboard) → /dashboard
  - 서류작성 (FilePlus, 강조색 bg-primary rounded-full) → /documents/new
  - 서류목록 (FileText) → /documents
  - 설정 (Settings) → /settings
- 활성: text-primary, 비활성: text-text-muted
- 아이콘 + 라벨 텍스트 (10px)
```

---

## 3. 누락된 페이지 전체 생성

#### app/(auth)/register/page.tsx
```
회원가입 완료 페이지 (소셜 로그인 후 사업자 정보 입력):
- Supabase session 확인 후 미완성 프로필이면 이 페이지로 리다이렉트
- 입력 필드:
  - 이름 (Input)
  - 사업자등록번호 (Input, 형식: 000-00-00000)
  - 연락처 (Input, type=tel)
  - 회사명 (Input)
- 완료 버튼 → Supabase users 테이블 업데이트 → /dashboard 이동
- globals.css CSS 변수 사용, Button/Input/Card 컴포넌트 사용
```

#### app/(dashboard)/sites/page.tsx
```
현장 목록 페이지:
- PageHeader: "현장 관리" + 우측 "현장 추가" Button
- 현장이 없을 때: EmptyState 컴포넌트
- 현장 목록: Card 리스트
  - 현장명 (font-semibold)
  - 공사명 (text-sm text-text-secondary)
  - 서류 수 Badge
  - 우측: 설정 아이콘 → /sites/[id]/settings
- 현장 추가 Modal:
  - 현장명 Input (필수)
  - 공사명 Input
  - 발주처 Input
  - 착공일 Input type=date
  - 현장주소 Input
  - 저장 Button
- 임시 mock 데이터로 구현 (Supabase 연동은 나중에)
```

#### app/(dashboard)/sites/[id]/page.tsx
```
현장 상세 페이지:
- PageHeader: 현장명 + backHref="/sites" + 설정 버튼
- 현장 요약 Card:
  - 공사명, 발주처, 착공일, 주소
- 서류 현황 탭 (Tabs 컴포넌트):
  - 전체 / TBM / 위험성평가 / 교육 / 작업계획
- 서류 목록 (DocumentCard 형식):
  - 서류 유형 아이콘 + 색상
  - 서류명 + 날짜
  - 상태 Badge (완료/임시저장)
  - 보기/공유/삭제 버튼
- "새 서류 작성" FAB 버튼 (모바일)
- 임시 mock 데이터 사용
```

#### app/(dashboard)/documents/[id]/page.tsx
```
서류 상세 페이지:
- PageHeader: 서류명 + backHref="/documents"
- 액션 버튼 (상단 우측):
  - PDF 다운로드 (Download 아이콘)
  - 카카오톡 공유 (Share2 아이콘)
- 서류 정보 Card:
  - 서류 유형 Badge
  - 현장명, 공종, 작성일, 작성자
- 서류 내용 Card (docType별 다르게 렌더링):
  - tbm: 작업내용 테이블 + 위험요인 테이블 + 서명란
  - risk: 위험성평가 결과 테이블 (위험요인/가능성/중대성/크기/대책)
  - education: 교육항목 테이블 + 참석자 명단
  - workplan: 작업순서 테이블 + 안전조치 + 보호구
- 하단: "수정하기" + "삭제하기" 버튼
- mock 데이터 사용
```

#### app/(dashboard)/settings/page.tsx
```
계정/구독 설정 페이지:
- PageHeader: "설정"
- 프로필 Card:
  - 아바타 (이니셜 원형)
  - 이름, 이메일, 회사명
  - "프로필 수정" 버튼 → Modal
- 구독 Card:
  - 현재 플랜 Badge
  - 만료일
  - 사용량 (현장 수 / 서류 수)
  - "플랜 변경" 버튼
- 알림 설정 Card:
  - 보관 만료 알림 토글
  - 점검 리마인더 토글
- 로그아웃 Button (variant=danger)
- 회원탈퇴 링크 (text-danger text-sm)
```

#### app/share/[token]/page.tsx
```
공유 뷰어 페이지 (비로그인):
- 로그인 불필요 (public 페이지)
- 상단: SafeDocs 로고 + 서류 제목
- 서류 내용 카드 형식으로 표시:
  - 서류 유형에 따라 다른 레이아웃 (documents/[id]/page.tsx 참조)
- "PDF 다운로드" Button (primary)
- 최하단: "SafeDocs로 만들었습니다 →" 링크 (/ 로 이동)
  - 바이럴 유도용 워터마크
- 토큰 유효하지 않으면: EmptyState "링크가 만료되었거나 존재하지 않습니다"
- mock 데이터로 구현
```

---

## 4. 상수/유틸 파일 생성

#### lib/constants/docTypes.ts
```typescript
import { ClipboardList, AlertTriangle, BookOpen, FileText } from 'lucide-react'

export type DocType = 'tbm' | 'risk' | 'education' | 'workplan'

export const DOC_TYPES = {
  tbm: {
    label: 'TBM 일지',
    description: '작업 전 안전점검회의',
    icon: ClipboardList,
    color: 'primary',
  },
  risk: {
    label: '위험성평가서',
    description: '공종별 위험요인 분석',
    icon: AlertTriangle,
    color: 'warning',
  },
  education: {
    label: '안전교육일지',
    description: '법정 안전보건교육 기록',
    icon: BookOpen,
    color: 'success',
  },
  workplan: {
    label: '작업계획서',
    description: '작업 순서 및 안전조치',
    icon: FileText,
    color: 'danger',
  },
} as const
```

#### lib/constants/trades.ts
```typescript
export const TRADES = [
  'scaffold',        // 비계 설치/해체
  'rebar_concrete',  // 철근·콘크리트
  'excavation',      // 굴착 작업
  'high_place',      // 고소 작업 (2m 이상)
  'heavy_equipment', // 중장비 작업
  'welding',         // 용접·절단
  'electrical',      // 전기 작업
  'waterproof',      // 방수 작업
  'painting',        // 도장 작업
  'demolition',      // 구조물 해체
  'interior',        // 실내건축
  'window',          // 창호 설치
  'drainage',        // 상하수도 설비
  'road',            // 포장 공사
  'soil',            // 토공사
  'foundation',      // 기초 공사
  'steel_structure', // 철골 구조물
  'crane',           // 크레인 작업
  'confined_space',  // 밀폐공간 작업
  'fire_work',       // 화재위험 작업
  'plumbing',        // 배관 설비
  'hvac',            // 냉난방 설비
  'fire_protection', // 소방 설비
  'landscaping',     // 조경 작업
  'masonry',         // 조적 공사
  'glass',           // 유리 공사
  'insulation',      // 단열 공사
  'signage',         // 간판·사인 설치
  'elevator',        // 승강기 설치
  'other',           // 기타
] as const

export type Trade = typeof TRADES[number]

const TRADE_LABELS: Record<Trade, string> = {
  scaffold: '비계 설치/해체',
  rebar_concrete: '철근·콘크리트',
  excavation: '굴착 작업',
  high_place: '고소 작업 (2m 이상)',
  heavy_equipment: '중장비 작업',
  welding: '용접·절단',
  electrical: '전기 작업',
  waterproof: '방수 작업',
  painting: '도장 작업',
  demolition: '구조물 해체',
  interior: '실내건축',
  window: '창호 설치',
  drainage: '상하수도 설비',
  road: '포장 공사',
  soil: '토공사',
  foundation: '기초 공사',
  steel_structure: '철골 구조물',
  crane: '크레인 작업',
  confined_space: '밀폐공간 작업',
  fire_work: '화재위험 작업',
  plumbing: '배관 설비',
  hvac: '냉난방 설비',
  fire_protection: '소방 설비',
  landscaping: '조경 작업',
  masonry: '조적 공사',
  glass: '유리 공사',
  insulation: '단열 공사',
  signage: '간판·사인 설치',
  elevator: '승강기 설치',
  other: '기타 (직접 입력)',
}

export function getTradeLabel(trade: string): string {
  return TRADE_LABELS[trade as Trade] || trade
}
```

#### lib/constants/riskData.ts
```typescript
export interface RiskItem {
  id: string
  risk: string        // 위험요인
  riskType: string    // 재해유형
  likelihood: 1|2|3|4
  severity: 1|2|3|4
  measure: string     // 안전대책
}

// 30개 공종 전체 위험요인 DB
// 각 공종당 최소 5개 RiskItem
export const RISK_DATA: Record<string, RiskItem[]> = {
  scaffold: [
    { id: 'sc-1', risk: '비계 작업 중 추락', riskType: '추락', likelihood: 3, severity: 4, measure: '안전대 착용 의무화, 추락방지망 설치, 작업발판 고정 확인' },
    { id: 'sc-2', risk: '자재 낙하로 하부 작업자 부상', riskType: '낙하·비래', likelihood: 3, severity: 3, measure: '하부 출입금지 구역 설정, 낙하물 방지망 설치, 안전모 착용' },
    { id: 'sc-3', risk: '비계 구조물 붕괴', riskType: '붕괴', likelihood: 2, severity: 4, measure: '비계 조립 기준 준수, 정기 점검 실시, 과하중 금지' },
    { id: 'sc-4', risk: '공구 및 자재 낙하', riskType: '낙하·비래', likelihood: 3, severity: 3, measure: '공구 안전끈 사용, 작업 전 정리정돈, 낙하물 방지망' },
    { id: 'sc-5', risk: '강풍 시 작업 중 추락', riskType: '추락', likelihood: 2, severity: 4, measure: '풍속 10m/s 이상 시 작업 중지, 기상 확인 의무화' },
  ],
  excavation: [
    { id: 'ex-1', risk: '굴착면 붕괴로 매몰', riskType: '붕괴', likelihood: 2, severity: 4, measure: '흙막이 설치, 굴착면 기울기 기준 준수, 매일 점검' },
    { id: 'ex-2', risk: '굴착기 후진 시 근로자 충돌', riskType: '충돌', likelihood: 3, severity: 4, measure: '유도자 배치, 후방 경보장치 확인, 작업구역 접근 금지' },
    { id: 'ex-3', risk: '지하 매설물 파손', riskType: '폭발·화재', likelihood: 2, severity: 4, measure: '사전 도면 확인, 탐지기 사용, 수작업 병행' },
    { id: 'ex-4', risk: '굴착 주변 근로자 추락', riskType: '추락', likelihood: 3, severity: 3, measure: '안전난간 또는 덮개 설치, 경고 테이프 설치' },
    { id: 'ex-5', risk: '토사 유출로 인한 침수', riskType: '기타', likelihood: 2, severity: 3, measure: '배수로 설치, 강우 시 작업 중지 기준 수립' },
  ],
  high_place: [
    { id: 'hp-1', risk: '고소작업 중 추락', riskType: '추락', likelihood: 3, severity: 4, measure: '안전대 착용, 추락방지망 설치, 작업발판 안전 확인' },
    { id: 'hp-2', risk: '공구 낙하로 하부 작업자 부상', riskType: '낙하·비래', likelihood: 3, severity: 3, measure: '공구 안전끈 사용, 하부 출입금지 구역 설정' },
    { id: 'hp-3', risk: '사다리 전도로 추락', riskType: '추락', likelihood: 3, severity: 3, measure: '사다리 고정, 최상단 3단 이상 사용 금지, 전용 사다리 사용' },
    { id: 'hp-4', risk: '강풍 시 균형 상실', riskType: '추락', likelihood: 2, severity: 4, measure: '기상 조건 확인, 풍속 기준 초과 시 작업 중지' },
    { id: 'hp-5', risk: '고소작업차 전도', riskType: '전도', likelihood: 2, severity: 4, measure: '아웃트리거 설치, 지반 상태 확인, 과부하 금지' },
  ],
  heavy_equipment: [
    { id: 'he-1', risk: '중장비 선회 반경 내 근로자 충돌', riskType: '충돌', likelihood: 3, severity: 4, measure: '유도자 배치, 작업반경 내 출입 금지, 경고 표지 설치' },
    { id: 'he-2', risk: '중장비 전도', riskType: '전도', likelihood: 2, severity: 4, measure: '지반 다짐 확인, 경사면 작업 금지, 과하중 금지' },
    { id: 'he-3', risk: '붐대 또는 버킷 낙하', riskType: '낙하·비래', likelihood: 2, severity: 4, measure: '하부 대기 금지, 안전장치 작동 확인' },
    { id: 'he-4', risk: '후진 시 근로자 충돌', riskType: '충돌', likelihood: 3, severity: 4, measure: '후방 카메라 또는 경보장치, 유도자 배치' },
    { id: 'he-5', risk: '유압 호스 파열로 인한 화상', riskType: '화상', likelihood: 2, severity: 3, measure: '정기 점검, 고압 호스 접근 금지' },
  ],
  welding: [
    { id: 'we-1', risk: '용접 불꽃으로 인한 화재', riskType: '폭발·화재', likelihood: 3, severity: 4, measure: '불꽃 차단막 설치, 소화기 비치, 가연성 물질 제거' },
    { id: 'we-2', risk: '용접 흄 흡입', riskType: '직업병', likelihood: 3, severity: 3, measure: '방진마스크 착용, 환기 실시, 작업 시간 제한' },
    { id: 'we-3', risk: '아크 광선에 의한 눈 손상', riskType: '화상', likelihood: 3, severity: 3, measure: '용접 차광 마스크 착용, 차광막 설치' },
    { id: 'we-4', risk: '감전', riskType: '감전', likelihood: 2, severity: 4, measure: '절연 장갑 착용, 접지 확인, 우천 시 작업 금지' },
    { id: 'we-5', risk: '고압가스 폭발', riskType: '폭발·화재', likelihood: 2, severity: 4, measure: '가스 용기 직립 보관, 화기 이격, 누출 점검' },
  ],
  // 나머지 25개 공종도 동일 구조로 최소 5개씩 작성
  // electrical, waterproof, painting, demolition, interior,
  // window, drainage, road, soil, foundation,
  // steel_structure, crane, confined_space, fire_work, plumbing,
  // hvac, fire_protection, landscaping, masonry, glass,
  // insulation, signage, elevator, other
}
```

#### lib/utils/document.ts
```typescript
// 서류 생성 유틸 - 나중에 AI로 교체 시 이 파일만 수정
import { RISK_DATA, RiskItem } from '@/lib/constants/riskData'
import { DocType } from '@/lib/constants/docTypes'

export interface DocumentInput {
  docType: DocType
  trade: string
  date: string
  author: string
  siteName?: string
  subcontractor?: string
  selectedRisks: RiskItem[]
  customRisks: string[]
  weather?: string
  workers?: number
}

export interface GeneratedDocument {
  id: string
  docType: DocType
  trade: string
  date: string
  author: string
  content: TBMContent | RiskContent | EducationContent | WorkplanContent
  createdAt: string
}

export function generateDocument(input: DocumentInput): GeneratedDocument {
  const id = crypto.randomUUID()
  const content = (() => {
    switch (input.docType) {
      case 'tbm': return generateTBM(input)
      case 'risk': return generateRisk(input)
      case 'education': return generateEducation(input)
      case 'workplan': return generateWorkplan(input)
    }
  })()
  return { id, docType: input.docType, trade: input.trade, date: input.date, author: input.author, content, createdAt: new Date().toISOString() }
}

function generateTBM(input: DocumentInput): TBMContent { /* 구현 */ }
function generateRisk(input: DocumentInput): RiskContent { /* 구현 */ }
function generateEducation(input: DocumentInput): EducationContent { /* 구현 */ }
function generateWorkplan(input: DocumentInput): WorkplanContent { /* 구현 */ }
```

#### lib/utils/format.ts
```typescript
// 날짜, 숫자 포맷 유틸
export function formatDate(date: string | Date): string
export function formatKoreanDate(date: string | Date): string // 2024년 1월 15일
export function formatPhoneNumber(phone: string): string // 010-1234-5678
export function formatBusinessNumber(num: string): string // 000-00-00000
```

#### types/index.ts
```typescript
// 모든 공유 타입 정의
export interface User {
  id: string
  email: string
  name: string
  phone: string
  businessNumber: string
  companyName: string
  createdAt: string
}

export interface Site {
  id: string
  userId: string
  name: string
  constructionName: string
  clientName: string
  startDate: string
  address: string
  defaults?: SiteDefaults
  createdAt: string
}

export interface SiteDefaults {
  favoriteTrades: string[]
  defaultAuthor: string
  defaultSubcontractor: string
  safetyOfficerPhone: string
}

export interface Document {
  id: string
  siteId: string
  userId: string
  docType: 'tbm' | 'risk' | 'education' | 'workplan'
  trade: string
  workDate: string
  status: 'draft' | 'complete'
  content: Record<string, unknown>
  shareToken?: string
  pdfUrl?: string
  createdAt: string
}

export interface Subscription {
  id: string
  userId: string
  plan: 'basic' | 'standard' | 'pro'
  status: 'active' | 'cancelled' | 'expired'
  startedAt: string
  expiresAt: string
}

export type { RiskItem } from '@/lib/constants/riskData'
```

#### lib/supabase/client.ts
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

#### lib/supabase/server.ts
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

#### middleware.ts (루트)
```typescript
// Supabase 세션 갱신 + 보호된 라우트 처리
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // /dashboard/* 접근 시 로그인 확인
  // 미로그인이면 /login 리다이렉트
  // /login 접근 시 로그인 상태면 /dashboard 리다이렉트
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

#### .env.local.example
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 5. 기존 페이지 수정 필요 사항

### app/(dashboard)/documents/new/page.tsx 수정
```
현재 문제:
1. Select 컴포넌트가 onChange 타입 불일치
2. Input 컴포넌트 onChange 타입 불일치
3. SearchableSelect 미사용 (공종 선택에 써야 함)
4. 서류 생성 후 실제 저장 로직 없음

수정:
- 공종 선택 → Select → SearchableSelect로 교체 (searchable=true, allowCustomInput=true)
- Input onChange: (e) => setAuthor(e.target.value) → (value) => setAuthor(value) 방식 통일
- handleSubmit → generateDocument() 호출 후 로컬스토리지 임시 저장
```

### app/(dashboard)/dashboard/page.tsx 수정
```
현재 문제:
1. DOC_TYPES의 color 참조 방식 오류 (var(--color-${doc.color}-subtle) 존재하지 않음)
2. quickStats mock 데이터 하드코딩
3. SiteSelector 없음

수정:
- 아이콘 색상: style={{ color: `var(--color-${docType.color})` }} 방식
  → docType.color가 'primary'면 text-primary 클래스 직접 사용으로 변경
- 각 docType별 색상 클래스 매핑 추가:
  primary → text-primary bg-primary-light
  warning → text-warning bg-warning-light
  success → text-success bg-success-light
  danger → text-danger bg-danger-light
```

---

## 6. 구현 순서 (이 순서대로 진행할 것)

```
1단계: 타입 + 상수 먼저
  - types/index.ts
  - lib/constants/docTypes.ts
  - lib/constants/trades.ts
  - lib/constants/riskData.ts (30개 공종 전체)
  - lib/utils/format.ts
  - lib/utils/document.ts

2단계: Supabase 클라이언트
  - lib/supabase/client.ts
  - lib/supabase/server.ts
  - middleware.ts
  - .env.local.example

3단계: UI 컴포넌트 라이브러리
  - components/ui/Button.tsx
  - components/ui/Card.tsx
  - components/ui/Input.tsx
  - components/ui/Select.tsx
  - components/ui/SearchableSelect.tsx
  - components/ui/Badge.tsx
  - components/ui/Modal.tsx
  - components/ui/BottomSheet.tsx
  - components/ui/PageHeader.tsx
  - components/ui/EmptyState.tsx
  - components/ui/LoadingSpinner.tsx
  - components/ui/Tabs.tsx
  - components/ui/StepIndicator.tsx
  - components/ui/ChecklistItem.tsx
  - components/ui/index.ts

4단계: 레이아웃 컴포넌트
  - components/layouts/Header.tsx
  - components/layouts/Sidebar.tsx
  - components/layouts/BottomNav.tsx
  - components/layouts/DashboardShell.tsx

5단계: 누락 페이지 생성
  - app/(auth)/register/page.tsx
  - app/(dashboard)/sites/page.tsx
  - app/(dashboard)/sites/[id]/page.tsx
  - app/(dashboard)/documents/[id]/page.tsx
  - app/(dashboard)/settings/page.tsx
  - app/share/[token]/page.tsx

6단계: 기존 페이지 수정
  - dashboard/page.tsx 색상 참조 수정
  - documents/new/page.tsx SearchableSelect 교체 + 타입 수정

---

## 절대 규칙
- 모든 색상은 CSS 변수 또는 tailwind 커스텀 색상 사용 (하드코딩 금지)
- 모든 컴포넌트는 /components/ui/ 에서 import
- 같은 JSX 패턴 2번 이상 반복되면 컴포넌트로 추출
- 모바일 375px 기준으로 먼저 구현
- 터치 타겟 최소 48px
- Input font-size 항상 16px
- TypeScript strict 모드 (any 타입 금지)
- 한국어 UI 텍스트
```

# ver2

## 현재 상태 진단

**잘 된 것:**
- 3단계 플로우 자체는 작동
- 위험요인 선택 DB 연동됨
- 확인 페이지 요약 표시됨

**문제 2가지:**
1. **StepIndicator 버그** — 2단계 화면인데 1번이 활성화, 3단계 화면인데 2번이 활성화 → 인덱스 오프셋 오류
2. **서류 상세 페이지** — 완전히 비어있음. 생성된 서류를 실제 법정 양식처럼 렌더링하는 컴포넌트가 없음

---

## VSCode Claude Opus 학습용 프롬프트

```
# SafeDocs 프로젝트 컨텍스트 및 구현 지시서

## 프로젝트 개요
SafeDocs는 건설현장 안전서류 자동화 SaaS.
Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase 스택.
1인 개발, 유지보수 최소화가 최우선.

## 현재 구현 완료된 것
- app/globals.css → CSS 변수 전체 정의됨 (--color-primary 등)
- tailwind.config.ts → CSS 변수 연동 완료
- app/page.tsx → 랜딩페이지
- app/(auth)/login/page.tsx → 카카오/네이버/구글 소셜 로그인 UI
- app/(dashboard)/dashboard/page.tsx → 대시보드 홈 (mock 데이터)
- app/(dashboard)/documents/new/page.tsx → 3단계 서류작성 플로우
- app/(dashboard)/documents/page.tsx → 서류 목록
- app/(dashboard)/inspection/page.tsx → 감독 대응 모드
- app/(dashboard)/sites/[id]/settings/page.tsx → 현장 기본값 설정
- app/auth/callback/route.ts → Supabase OAuth 콜백

## 현재 확인된 버그

### 버그 1: StepIndicator 인덱스 오프셋
파일: app/(dashboard)/documents/new/page.tsx
증상: 
- 2단계(위험요인 선택) 화면에서 1번 스텝이 활성화됨
- 3단계(확인) 화면에서 2번 스텝이 활성화됨
원인: currentStep이 0-based인데 StepIndicator가 1-based로 처리
수정: StepIndicator 컴포넌트에서 currentStep 비교 로직 확인 후 수정

### 버그 2: 서류 상세 페이지 미구현
파일: app/(dashboard)/documents/[id]/page.tsx
증상: "서류를 찾을 수 없습니다" EmptyState만 표시됨
원인: 
1. 생성된 서류 데이터를 저장/조회하는 로직 없음
2. 서류 내용을 법정 양식 형태로 렌더링하는 컴포넌트 없음

## 지금 당장 만들어야 하는 것

---

### 1. 서류 임시저장 시스템 (Supabase 연동 전 로컬스토리지)

파일: lib/store/documentStore.ts

```typescript
// 생성된 서류를 로컬스토리지에 저장/조회/삭제
// Supabase 연동 시 이 파일만 교체하면 됨

export interface StoredDocument {
  id: string
  docType: 'tbm' | 'risk' | 'education' | 'workplan'
  trade: string
  workDate: string
  author: string
  siteName?: string
  subcontractor?: string
  status: 'draft' | 'complete'
  risks: Array<{
    id: string
    risk: string
    riskType: string
    likelihood: number
    severity: number
    measure: string
  }>
  customRisks: string[]
  weather?: string
  workers?: number
  createdAt: string
}

export const documentStore = {
  getAll(): StoredDocument[]
  getById(id: string): StoredDocument | null
  save(doc: StoredDocument): void
  delete(id: string): void
  generateId(): string
}
```

---

### 2. 서류 작성 완료 후 저장 연동

파일: app/(dashboard)/documents/new/page.tsx 수정

handleSubmit 함수 수정:
```
현재: console.log + router.push('/documents?success=true')
수정:
1. generateDocument(inputs) 호출해서 서류 객체 생성
2. documentStore.save(document) 로 저장
3. router.push(`/documents/${document.id}`) 로 상세 페이지 이동
```

---

### 3. 서류 상세 페이지 완전 구현

파일: app/(dashboard)/documents/[id]/page.tsx

```
전체 구조:
- documentStore.getById(params.id) 로 서류 조회
- 없으면 EmptyState "서류를 찾을 수 없습니다" + "서류 목록으로" 버튼
- 있으면 법정 양식 형태로 렌더링

상단 액션바:
- 뒤로가기 (ArrowLeft)
- 서류 제목
- 우측: PDF 버튼 (Download 아이콘) + 공유 버튼 (Share2 아이콘)

서류 렌더링 컴포넌트:
docType별로 다른 컴포넌트 사용
- tbm → TBMDocument 컴포넌트
- risk → RiskDocument 컴포넌트
- education → EducationDocument 컴포넌트
- workplan → WorkplanDocument 컴포넌트
```

---

### 4. 서류 렌더링 컴포넌트 4종

경로: components/documents/

#### components/documents/TBMDocument.tsx
```
TBM 일지를 실제 법정 양식처럼 렌더링:

┌─────────────────────────────────┐
│     작업 전 안전점검회의(TBM) 일지      │
│  산업안전보건법 제29조              │
├──────────┬──────────┬────────────┤
│ 현장명   │          │ 작성일      │
│ 공사명   │          │ 날씨       │
│ 하도급사  │          │ 참석인원    │
├──────────┴──────────┴────────────┤
│ ① 오늘의 작업 내용                  │
├──┬────────┬──────────┬────────────┤
│No│ 작업공종 │  작업장소  │  투입인원  │
│ 1│ [trade] │          │           │
├──┴────────┴──────────┴────────────┤
│ ② 오늘의 위험요인 및 안전대책          │
├──┬────────────┬────────┬───────────┤
│No│  위험요인   │재해유형 │ 안전대책   │
│ 1│ [risk1]    │[type1] │[measure1] │
│ 2│ [risk2]    │[type2] │[measure2] │
│ ...                               │
├──────────────────────────────────┤
│ ③ 특별 전달사항                    │
│ [빈칸]                            │
├──────────────────────────────────┤
│ ④ 참석자 서명 (15명 서명란)          │
│ [서명란 그리드]                    │
└──────────────────────────────────┘

구현 방식:
- 실제 서류처럼 테이블 형태
- 테이블: border border-border 스타일
- 헤더셀: bg-surface-2 font-semibold
- 데이터셀: bg-surface
- 서명란: 빈 높이 40px 셀 15개 (3열 5행 그리드)
- 하단: "이 서류는 3년간 보관하여야 합니다" 안내문
```

#### components/documents/RiskDocument.tsx
```
위험성평가서를 법정 양식으로 렌더링:

┌─────────────────────────────────┐
│           위험성평가서              │
│  산업안전보건법 제36조              │
├──────────┬──────────┬────────────┤
│ 현장명   │          │ 평가일      │
│ 공사명   │          │ 평가자      │
│ 평가대상  │ [trade]  │ 승인자      │
├──────────┴──────────┴────────────┤
│ 위험성평가 결과                    │
├──┬──────┬──────┬──────┬──┬──┬──┬──────┬───┬──┤
│No│작업명 │위험요인│재해유형│가│중│크│안전대책│가│중│
│  │      │      │      │능│대│기│      │능│대│
│ 1│[공종] │[risk]│[type]│3 │4 │12│[measure]│  │  │
│ 2│      │      │      │  │  │  │      │  │  │
├──┴──────┴──────┴──────┴──┴──┴──┴──────┴───┴──┤
│ 위험성 판단 기준                   │
│ 4=높음/3=중간/2=낮음/1=매우낮음    │
│ 위험크기 = 가능성 × 중대성          │
│ 12이상: 허용불가 / 5~11: 개선필요   │
├──────────────────────────────────┤
│ 평가 참여자 확인 │ 소장: (서명)    │
└──────────────────────────────────┘

위험크기 = likelihood × severity
12이상: text-danger
5~11: text-warning  
4이하: text-success
```

#### components/documents/EducationDocument.tsx
```
안전교육일지 법정 양식:

┌─────────────────────────────────┐
│       안전보건교육 실시 일지          │
│  산업안전보건법 제29조              │
├──────────┬──────────┬────────────┤
│ 현장명   │          │ 교육일시    │
│ 하도급사  │          │ 교육장소    │
├──────────────────────────────────┤
│ 교육종류: □정기 □채용시 □작업변경 □특별 │
├──────────────────────────────────┤
│ 교육내용                          │
├──┬────────────────┬──┬────────────┤
│No│   교육 항목     │시간│  주요내용  │
│ 1│위험성평가 이해  │30분│           │
│ 2│공종별 위험요인  │30분│           │
├──────────────────────────────────┤
│ 참석자 명단 (20명 서명란)           │
├──┬────┬──┬────┬──┬────┬──┬────┬──┤
│No│성명│서│No│성명│서│No│성명│서│
│ 1│    │  │11│    │  │  │    │  │
├──────────────────────────────────┤
│ 교육실시자: (서명) │ 확인자: (서명) │
└──────────────────────────────────┘
```

#### components/documents/WorkplanDocument.tsx
```
작업계획서 법정 양식:

┌─────────────────────────────────┐
│           작업계획서               │
│ 산업안전보건기준규칙 제38조          │
├──────────┬──────────┬────────────┤
│ 현장명   │          │ 작성일      │
│ 하도급사  │          │ 작업일시    │
│ 작업종류  │ [trade]  │ 작업책임자  │
├──────────────────────────────────┤
│ 작업종류: □굴착 □고소 □중장비 □비계..│
├──────────────────────────────────┤
│ ① 작업개요                        │
├──────────┬───────────────────────┤
│ 작업장소  │                      │
│ 작업내용  │                      │
│ 투입인원  │                      │
│ 사용장비  │                      │
├──────────────────────────────────┤
│ ② 작업순서 및 방법                  │
├──┬────────────┬───────────────────┤
│순서│  작업단계  │    세부작업방법    │
│ 1 │            │                  │
│ 2 │            │                  │
├──────────────────────────────────┤
│ ③ 안전조치사항                     │
├──┬────────────┬───────────────────┤
│No│   위험요인  │    안전조치내용    │
│ 1│[risk]      │[measure]         │
├──────────────────────────────────┤
│ ④ 개인보호구: ☑안전모 ☑안전대 ☑안전화│
├──────────────────────────────────┤
│ 비상연락망: 소장: │119: │병원:     │
├──────────────────────────────────┤
│ 작성자(서명):     │ 승인자(서명):   │
└──────────────────────────────────┘
```

---

### 5. 서류 목록 페이지 연동

파일: app/(dashboard)/documents/page.tsx 수정

```
현재: MOCK_DOCUMENTS 하드코딩
수정: documentStore.getAll() 로 실제 저장된 서류 불러오기
- 빈 배열이면 EmptyState 표시
- 있으면 리스트 표시
- 각 항목 클릭 → /documents/[id]
```

---

### 6. 대시보드 최근 서류 연동

파일: app/(dashboard)/dashboard/page.tsx 수정

```
현재: recentDocs mock 배열 하드코딩
수정: documentStore.getAll().slice(-5) 로 최근 5개 불러오기
```

---

## 파일별 의존성 순서 (이 순서대로 만들 것)

```
1. lib/store/documentStore.ts
   (의존성 없음, 가장 먼저)

2. components/documents/TBMDocument.tsx
   components/documents/RiskDocument.tsx
   components/documents/EducationDocument.tsx
   components/documents/WorkplanDocument.tsx
   (documentStore 타입 참조)

3. app/(dashboard)/documents/[id]/page.tsx
   (위 4개 컴포넌트 사용)

4. app/(dashboard)/documents/new/page.tsx 수정
   (documentStore.save + 라우팅 수정 + StepIndicator 버그 수정)

5. app/(dashboard)/documents/page.tsx 수정
   (documentStore.getAll 연동)

6. app/(dashboard)/dashboard/page.tsx 수정
   (documentStore 연동)
```

---

## 절대 규칙

1. 모든 색상 CSS 변수 사용 (하드코딩 금지)
   - 올바른 예: className="text-primary" 또는 style={{color: 'var(--color-primary)'}}
   - 틀린 예: style={{color: '#1E40AF'}}

2. 서류 렌더링은 실제 출력 가능한 양식처럼
   - 테이블 구조 사용
   - 실제 법정 서식과 유사하게
   - border border-border 스타일로 셀 구분
   - 인쇄 시 깔끔하게 나와야 함

3. StoredDocument 타입 엄격히 준수
   - any 타입 사용 금지

4. 서류 4종 모두 동일한 구조로:
   - 상단 제목 + 법적 근거
   - 기본 정보 테이블 (현장명, 날짜, 작성자 등)
   - 핵심 내용 테이블 (서류별 다름)
   - 서명란
   - 보관 기간 안내 (3년)

---

## 현재 bugs 수정 방법

### StepIndicator 버그
app/(dashboard)/documents/new/page.tsx 에서:
currentStep은 0-based index (0, 1, 2)
StepIndicator에 넘길 때: currentStep={currentStep}
StepIndicator 내부에서 i === currentStep 으로 비교해야 함
i <= currentStep 이면 완료 표시

스크린샷 분석:
- 2단계 내용(위험요인)인데 step 1이 파란색 → currentStep=1인데 인디케이터가 0-based/1-based 혼용 중
- 수정: StepIndicator 컴포넌트에서 steps.map((step, i) => i === currentStep) 방식으로 통일

### 서류 상세 페이지
현재 documents/[id]/page.tsx 가 없거나 mock 데이터 없음
수정: documentStore.getById(params.id) 로 조회
없으면 EmptyState, 있으면 해당 DocType 컴포넌트 렌더링
```

---

## 사용 방법

VSCode에서 Claude에게 이렇게 시작해:

```
위 컨텍스트를 읽었어. 
1번부터 시작: lib/store/documentStore.ts 만들어줘.
```

그 다음:
```
2번: TBMDocument.tsx 만들어줘. 
실제 법정 양식처럼 테이블 구조로.
```

---

# ver3 - 서명 기능 구현

## 현재 상태 진단

**ver2 완료 항목:**
- ✅ documentStore.ts 생성 및 로컬스토리지 연동
- ✅ 4종 서류 렌더링 컴포넌트 (TBM, 위험성평가, 안전교육, 작업계획)
- ✅ documents/[id] 상세 페이지 동작
- ✅ documents/new 저장 + StepIndicator 버그 수정
- ✅ workerStore.ts 생성 (현장별 작업자 관리)
- ✅ 참석자 선택 기능 (documents/new에서)
- ✅ 현장 설정 페이지 작업자 관리 UI

**ver3 목표:**
법적 효력 있는 서명 기능 구현 (각 참석자 본인이 직접 서명)

---

## 1. 오픈소스 라이브러리 선정

### signature_pad (추천)
- **GitHub**: https://github.com/szimek/signature_pad
- **npm**: https://www.npmjs.com/package/signature_pad
- **License**: MIT (상업용 사용 가능)
- **Stars**: 11.9k
- **주간 다운로드**: 164만+
- **번들 크기**: ~10KB
- **외부 의존성**: 없음
- **특징**: 
  - HTML5 Canvas 기반
  - Bezier curve 보간으로 부드러운 서명
  - 터치/마우스 지원
  - PNG/JPEG/SVG 출력
  - High DPI 스크린 지원

### react-signature-canvas (대안)
- **GitHub**: https://github.com/agilgur5/react-signature-canvas
- **License**: Apache (상업용 사용 가능)
- **Stars**: 647
- **특징**: signature_pad의 React 래퍼

**결정**: `signature_pad` 직접 사용 (React 래퍼 없이 useRef로 Canvas 제어)

---

## 2. 설치

```bash
npm install signature_pad
# 또는
pnpm add signature_pad
```

---

## 3. 타입 확장

### lib/store/documentStore.ts 수정
```typescript
export interface Participant {
  id: string;
  name: string;
  role?: string;       // 직책 (반장, 기공, 조공 등)
  trade?: string;      // 공종
  signature?: string;  // base64 서명 이미지
  signedAt?: string;   // 서명 시각 (ISO 8601)
}
```

### lib/store/workerStore.ts 수정
```typescript
export interface Worker {
  id: string;
  name: string;
  role?: string;
  trade?: string;
  phone?: string;
  company?: string;
  signature?: string;       // 저장된 서명 (재사용 가능)
  signatureUpdatedAt?: string;
}
```

---

## 4. 컴포넌트 구현

### components/ui/SignaturePad.tsx
```typescript
'use client';

import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import SignaturePadLib from 'signature_pad';

interface SignaturePadProps {
  width?: number;
  height?: number;
  penColor?: string;
  backgroundColor?: string;
  onBegin?: () => void;
  onEnd?: () => void;
}

export interface SignaturePadRef {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: (type?: string, quality?: number) => string;
  fromDataURL: (dataUrl: string) => void;
}

export const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  ({ width = 400, height = 200, penColor = 'black', backgroundColor = 'white', onBegin, onEnd }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const signaturePadRef = useRef<SignaturePadLib | null>(null);

    useEffect(() => {
      if (canvasRef.current) {
        signaturePadRef.current = new SignaturePadLib(canvasRef.current, {
          penColor,
          backgroundColor,
        });

        // High DPI 지원
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvasRef.current.width = width * ratio;
        canvasRef.current.height = height * ratio;
        canvasRef.current.getContext('2d')?.scale(ratio, ratio);

        if (onBegin) signaturePadRef.current.addEventListener('beginStroke', onBegin);
        if (onEnd) signaturePadRef.current.addEventListener('endStroke', onEnd);
      }

      return () => {
        signaturePadRef.current?.off();
      };
    }, [width, height, penColor, backgroundColor, onBegin, onEnd]);

    useImperativeHandle(ref, () => ({
      clear: () => signaturePadRef.current?.clear(),
      isEmpty: () => signaturePadRef.current?.isEmpty() ?? true,
      toDataURL: (type = 'image/png', quality = 1) => 
        signaturePadRef.current?.toDataURL(type, quality) ?? '',
      fromDataURL: (dataUrl: string) => signaturePadRef.current?.fromDataURL(dataUrl),
    }));

    return (
      <canvas
        ref={canvasRef}
        style={{ width, height, touchAction: 'none' }}
        className="border border-border rounded-lg"
      />
    );
  }
);

SignaturePad.displayName = 'SignaturePad';
```

### components/ui/SignatureModal.tsx
```typescript
'use client';

import React, { useRef, useState } from 'react';
import { X, RotateCcw, Check, Save } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import { SignaturePad, SignaturePadRef } from './SignaturePad';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  participantName: string;
  participantRole?: string;
  onComplete: (signatureData: string, saveToWorker: boolean) => void;
  existingSignature?: string;  // 저장된 서명이 있으면 미리 로드
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  participantName,
  participantRole,
  onComplete,
  existingSignature,
}) => {
  const signaturePadRef = useRef<SignaturePadRef>(null);
  const [saveToWorker, setSaveToWorker] = useState(false);
  const [useExisting, setUseExisting] = useState(!!existingSignature);

  const handleClear = () => {
    signaturePadRef.current?.clear();
    setUseExisting(false);
  };

  const handleComplete = () => {
    if (useExisting && existingSignature) {
      onComplete(existingSignature, false);
    } else if (!signaturePadRef.current?.isEmpty()) {
      const signatureData = signaturePadRef.current.toDataURL();
      onComplete(signatureData, saveToWorker);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="서명" size="md">
      <div className="space-y-4">
        {/* 참석자 정보 */}
        <div className="text-center pb-2 border-b border-border">
          <p className="text-lg font-semibold text-text-primary">{participantName}</p>
          {participantRole && (
            <p className="text-sm text-text-secondary">{participantRole}</p>
          )}
        </div>

        {/* 저장된 서명 선택 옵션 */}
        {existingSignature && (
          <div className="flex items-center gap-3 p-3 bg-surface-2 rounded-lg">
            <input
              type="radio"
              id="use-existing"
              checked={useExisting}
              onChange={() => setUseExisting(true)}
              className="w-4 h-4 text-primary"
            />
            <label htmlFor="use-existing" className="flex-1">
              <span className="text-sm font-medium">저장된 서명 사용</span>
              <img 
                src={existingSignature} 
                alt="저장된 서명" 
                className="mt-2 h-12 bg-white rounded border border-border"
              />
            </label>
          </div>
        )}

        {existingSignature && (
          <div className="flex items-center gap-3 p-3 bg-surface-2 rounded-lg">
            <input
              type="radio"
              id="new-signature"
              checked={!useExisting}
              onChange={() => setUseExisting(false)}
              className="w-4 h-4 text-primary"
            />
            <label htmlFor="new-signature" className="text-sm font-medium">
              새로 서명하기
            </label>
          </div>
        )}

        {/* 서명 패드 */}
        {!useExisting && (
          <>
            <div className="flex justify-center">
              <SignaturePad
                ref={signaturePadRef}
                width={320}
                height={160}
                penColor="black"
                backgroundColor="white"
              />
            </div>

            {/* 내 서명으로 저장 */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={saveToWorker}
                onChange={(e) => setSaveToWorker(e.target.checked)}
                className="w-4 h-4 text-primary rounded"
              />
              <span className="text-sm text-text-secondary">
                내 서명으로 저장 (다음에 자동 불러오기)
              </span>
            </label>
          </>
        )}

        {/* 버튼 */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={handleClear} className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" />
            지우기
          </Button>
          <Button onClick={handleComplete} className="flex-1">
            <Check className="w-4 h-4 mr-2" />
            완료
          </Button>
        </div>
      </div>
    </Modal>
  );
};
```

---

## 5. 서류 렌더링 컴포넌트 수정

### components/documents/TBMDocument.tsx 수정

서명란을 인터랙티브하게 변경:

```typescript
// 기존 정적 서명란을 다음과 같이 변경:

{/* 참석자 서명 - 인터랙티브 모드 */}
<div className="mb-4">
  <div className="bg-gray-100 border border-gray-400 px-3 py-2 font-semibold flex justify-between items-center">
    <span>④ 참석자 서명</span>
    <span className="text-sm font-normal text-gray-600">
      {signedCount}/{document.participants?.length || 0}명 완료
    </span>
  </div>
  <table className="w-full border-collapse">
    <tbody>
      {[0, 1, 2, 3, 4].map((row) => (
        <tr key={row}>
          {[0, 1, 2].map((col) => {
            const num = row * 3 + col + 1;
            const participant = document.participants?.[num - 1];
            const hasSigned = !!participant?.signature;
            return (
              <React.Fragment key={col}>
                <td className="border border-gray-400 px-2 py-1 w-8 text-center text-xs bg-gray-50">
                  {num}
                </td>
                <td className="border border-gray-400 px-2 py-1 w-20 text-center text-xs">
                  {participant?.name || ''}
                  {participant?.role && (
                    <span className="text-[10px] text-gray-500 block">
                      ({participant.role})
                    </span>
                  )}
                </td>
                <td 
                  className={cn(
                    "border border-gray-400 px-2 py-1 w-16 h-10 cursor-pointer",
                    "hover:bg-gray-50 transition-colors",
                    hasSigned && "bg-green-50"
                  )}
                  onClick={() => participant && !hasSigned && onSignatureClick?.(participant)}
                >
                  {hasSigned ? (
                    <img 
                      src={participant!.signature} 
                      alt="서명" 
                      className="h-8 w-full object-contain"
                    />
                  ) : participant ? (
                    <span className="text-xs text-primary font-medium">서명</span>
                  ) : null}
                </td>
              </React.Fragment>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

## 6. 서류 상세 페이지 서명 통합

### app/(dashboard)/documents/[id]/page.tsx 수정

```typescript
// 서명 모달 상태 추가
const [signatureModalOpen, setSignatureModalOpen] = useState(false);
const [signingParticipant, setSigningParticipant] = useState<Participant | null>(null);

// 서명 클릭 핸들러
const handleSignatureClick = (participant: Participant) => {
  setSigningParticipant(participant);
  setSignatureModalOpen(true);
};

// 서명 완료 핸들러
const handleSignatureComplete = (signatureData: string, saveToWorker: boolean) => {
  if (!signingParticipant || !document) return;

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

  // workerStore에 서명 저장 (선택 시)
  if (saveToWorker && document.siteId) {
    const workers = workerStore.getWorkers(document.siteId);
    const worker = workers.find((w) => w.name === signingParticipant.name);
    if (worker) {
      workerStore.updateWorker(document.siteId, worker.id, {
        ...worker,
        signature: signatureData,
        signatureUpdatedAt: new Date().toISOString(),
      });
    }
  }

  setSigningParticipant(null);
};

// 렌더링에 SignatureModal 추가
<SignatureModal
  isOpen={signatureModalOpen}
  onClose={() => {
    setSignatureModalOpen(false);
    setSigningParticipant(null);
  }}
  participantName={signingParticipant?.name || ''}
  participantRole={signingParticipant?.role}
  onComplete={handleSignatureComplete}
  existingSignature={
    signingParticipant
      ? workerStore.getWorkers(document?.siteId || '').find(
          (w) => w.name === signingParticipant.name
        )?.signature
      : undefined
  }
/>
```

---

## 7. workerStore 확장

### lib/store/workerStore.ts 수정

```typescript
// Worker 인터페이스에 추가
export interface Worker {
  id: string;
  name: string;
  role?: string;
  trade?: string;
  phone?: string;
  company?: string;
  signature?: string;              // base64 서명 이미지
  signatureUpdatedAt?: string;     // 서명 저장 시각
}

// 서명 관련 메서드 추가
export const workerStore = {
  // 기존 메서드들...

  /**
   * 작업자 서명 업데이트
   */
  updateWorkerSignature(siteId: string, workerId: string, signature: string): void {
    const workers = this.getWorkers(siteId);
    const index = workers.findIndex((w) => w.id === workerId);
    if (index !== -1) {
      workers[index] = {
        ...workers[index],
        signature,
        signatureUpdatedAt: new Date().toISOString(),
      };
      this.setWorkersForSite(siteId, workers);
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
```

---

## 8. 구현 순서

```
1단계: signature_pad 설치
   pnpm add signature_pad
   pnpm add -D @types/signature_pad (있으면)

2단계: SignaturePad 컴포넌트 생성
   - components/ui/SignaturePad.tsx
   - useRef + useImperativeHandle로 API 노출

3단계: SignatureModal 컴포넌트 생성
   - components/ui/SignatureModal.tsx
   - 서명 패드 + 저장 옵션

4단계: workerStore 확장
   - Worker 타입에 signature 추가
   - 서명 관련 메서드 추가

5단계: 문서 컴포넌트 수정
   - TBMDocument, EducationDocument 등
   - 서명란 클릭 시 콜백 호출

6단계: documents/[id] 페이지 수정
   - SignatureModal 연동
   - 서명 저장 로직

7단계: UI 인덱스 수정
   - components/ui/index.ts에 export 추가
```

---

## 9. 서명 UX 플로우

### 태블릿 순차 서명 (MVP)
```
문서 상세 화면:
┌─────────────────────────────┐
│ ④ 참석자 서명 (3/8명 완료)   │
├──┬────────┬────────────────┤
│ 1│ 김철수  │ ✓ (서명 이미지) │ ← 완료
├──┼────────┼────────────────┤
│ 2│ 이영수  │ [서명하기 ▶]    │ ← 터치하면 서명 모달
├──┼────────┼────────────────┤
│ 3│ 박민수  │ [서명하기 ▶]    │
└──┴────────┴────────────────┘
```

### 서명 모달
```
┌─────────────────────────────┐
│           서명              │ [X]
├─────────────────────────────┤
│        이영수 (기공)          │
├─────────────────────────────┤
│ ○ 저장된 서명 사용            │
│   [기존 서명 미리보기]         │
│                             │
│ ● 새로 서명하기              │
│ ┌───────────────────────┐   │
│ │                       │   │
│ │    (서명 영역)          │   │
│ │                       │   │
│ └───────────────────────┘   │
│                             │
│ ☐ 내 서명으로 저장           │
├─────────────────────────────┤
│   [지우기]      [완료]        │
└─────────────────────────────┘
```

---

## 10. 절대 규칙

1. **법적 요건 준수**
   - 각 참석자 본인이 직접 서명해야 함
   - 서명 시각 기록 필수 (signedAt)
   - 대리 서명 방지를 위한 감사 로그 고려

2. **서명 데이터 형식**
   - base64 PNG 형식 (`data:image/png;base64,...`)
   - 배경은 흰색 (bg-white) - PDF 출력 시 투명 배경 문제 방지
   - 최대 크기 제한 고려 (localStorage 5MB 한도)

3. **UX 원칙**
   - 터치 타겟 최소 48px
   - 서명 영역은 충분히 크게 (최소 300x150)
   - 저장된 서명 재사용 옵션 제공
   - 지우기 + 다시 서명 쉽게

4. **성능**
   - signature_pad를 동적 import로 코드 분할
   - base64 이미지 크기 최적화 (JPEG 품질 조절)

---

## 11. 다음 버전 고려사항 (ver4+)

### QR 코드 개별 서명 (확장)
- 작성자가 QR 생성 → 각 작업자 본인 휴대폰으로 서명
- 실시간 서명 상태 업데이트 (Supabase Realtime)
- 위변조 방지 + 분산 처리

### PDF 출력 최적화
- 서명 이미지를 PDF에 임베드
- react-pdf 또는 jsPDF 활용
- 인쇄 시 깔끔한 레이아웃

---

# ver4 - 서명 매번 직접 입력 방식으로 변경

## 변경 배경

**법적 리스크 최소화:**
- 서명 저장/재사용 기능은 법적으로 문제될 소지 있음
- 매번 직접 서명하는 방식이 법적으로 더 안전
- 본인 서명 의사 명확히 표현

---

## 변경 사항

### 1. SignatureModal.tsx 수정
- `existingSignature` prop 제거
- `saveToWorker` 체크박스 제거
- "저장된 서명 사용" 옵션 제거
- 매번 새로 서명하는 방식으로 단순화

### 2. documents/[id]/page.tsx 수정
- `existingSignature` prop 전달 제거
- `saveToWorker` 처리 로직 제거
- `handleSignatureComplete` 함수 단순화

### 3. 유지되는 기능
- workerStore의 signature 필드는 유지 (직원 관리 페이지에서 사용 가능)
- 단, 문서 서명 시에는 workerStore 서명을 불러오지 않음

---

## 수정된 SignatureModal 인터페이스

```typescript
interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  participantName: string;
  participantRole?: string;
  onComplete: (signatureData: string) => void;  // saveToWorker 파라미터 제거
}
```

---

## UX 변경

### Before (ver3)
```
┌─────────────────────────────┐
│           서명              │ [X]
├─────────────────────────────┤
│ ○ 저장된 서명 사용            │  ← 제거
│   [기존 서명 미리보기]         │  ← 제거
│                             │
│ ● 새로 서명하기              │
│ ┌───────────────────────┐   │
│ │    (서명 영역)          │   │
│ └───────────────────────┘   │
│                             │
│ ☐ 내 서명으로 저장           │  ← 제거
├─────────────────────────────┤
│   [지우기]      [완료]        │
└─────────────────────────────┘
```

### After (ver4)
```
┌─────────────────────────────┐
│           서명              │ [X]
├─────────────────────────────┤
│        이영수 (기공)          │
├─────────────────────────────┤
│   아래 영역에 서명해 주세요     │
│ ┌───────────────────────┐   │
│ │                       │   │
│ │    (서명 영역)          │   │
│ │                       │   │
│ └───────────────────────┘   │
├─────────────────────────────┤
│   [지우기]      [완료]        │
└─────────────────────────────┘
```

---

## 구현 순서

1. SignatureModal.tsx 수정
   - existingSignature, saveToWorker 관련 코드 제거
   - onComplete 콜백 시그니처 변경

2. documents/[id]/page.tsx 수정
   - existingSignature prop 제거
   - handleSignatureComplete 함수 단순화

3. 타입스크립트 컴파일 확인

---

## 핵심 원칙

> **매 서명마다 본인이 직접 서명해야 함**
> - 저장된 서명 불러오기 ❌
> - 서명 저장 옵션 ❌
> - 항상 새로 서명 ✅

---

# ver5 - 직원 관리 페이지 구현

## 개요

직원(작업자) 정보를 체계적으로 관리하고, 서류 작성 시 빠르게 불러올 수 있는 기능 구현.

---

## Phase 1: 직원 스토어 확장

### Worker 타입 확장 (lib/store/workerStore.ts)
```typescript
export interface Worker {
  id: string;
  name: string;
  role?: string;        // 직책 (반장, 기공, 조공 등)
  trade?: string;       // 공종
  phone?: string;       // 연락처 ← 추가
  company?: string;     // 소속 업체
  photos?: string[];    // base64 사진 배열 ← 추가
  signature?: string;   // base64 서명 이미지
  signatureUpdatedAt?: string; // 서명 저장 시각
  createdAt?: string;   // 등록일
  updatedAt?: string;   // 수정일
}
```

### workerStore 메서드 확장
- `addWorker(siteId, worker)` - 이미 있음
- `updateWorker(siteId, workerId, updates)` - 이미 있음
- `deleteWorker(siteId, workerId)` - 이미 있음
- `getWorkerById(siteId, workerId)` - 이미 있음
- `getWorkerByName(siteId, name)` - 이미 있음

### 사진 저장 방식
- **Base64**: localStorage 5MB 한도 고려, 이미지 압축 필수
- **browser-image-compression** 사용하여 이미지 리사이즈/압축

---

## Phase 2: 직원 관리 페이지 UI

### 라우트 구조
```
app/(dashboard)/employees/page.tsx       ← 직원 목록
```

### 컴포넌트 구조
```
components/employees/
  EmployeeList.tsx        ← 직원 카드 그리드
  EmployeeCard.tsx        ← 개별 직원 카드
  EmployeeFormModal.tsx   ← 직원 등록/수정 폼 모달
  WorkerSelectModal.tsx   ← 서류 작성 시 직원 선택 모달
```

### EmployeeFormModal 필드
```
┌─────────────────────────────┐
│       직원 등록/수정          │ [X]
├─────────────────────────────┤
│ 이름 *          [          ]│
│ 연락처          [          ]│
│ 직책            [          ]│
│ 공종            [드롭다운   ]│
│ 소속 업체       [          ]│
├─────────────────────────────┤
│ 사진 첨부 (최대 5장)         │
│ [+] [사진1] [사진2] [X삭제] │
├─────────────────────────────┤
│ 서명                         │
│ [서명 영역] 또는 [서명하기]   │
│ 마지막 서명: 2024-01-15      │
├─────────────────────────────┤
│   [취소]          [저장]     │
└─────────────────────────────┘
```

---

## Phase 3: 사진 첨부 기능

### ImageUploader 컴포넌트 (components/ui/ImageUploader.tsx)
```typescript
interface ImageUploaderProps {
  images: string[];              // base64 배열
  onChange: (images: string[]) => void;
  maxImages?: number;            // 기본 5
  maxSizeKB?: number;            // 압축 후 최대 크기 (기본 500KB)
}
```

### 기기별 동작
- **데스크톱**: `<input type="file" accept="image/*" multiple>`
- **모바일**: `accept="image/*" capture="environment"` → 카메라/갤러리 자동 선택

### 이미지 압축
```bash
pnpm add browser-image-compression
```

```typescript
import imageCompression from 'browser-image-compression';

const options = {
  maxSizeMB: 0.5,           // 500KB
  maxWidthOrHeight: 1024,   // 최대 1024px
  useWebWorker: true,
};
const compressedFile = await imageCompression(file, options);
```

### UI 구성
- 썸네일 그리드 표시
- 각 이미지에 X 버튼 (삭제)
- + 버튼으로 추가
- 드래그앤드롭 지원 (선택)

---

## Phase 4: 서명 기능 연동

### 직원 관리 페이지에서 서명
- EmployeeFormModal에 서명 영역 포함
- SignaturePad 컴포넌트 재사용
- 저장 시 `signature` + `signatureUpdatedAt` 업데이트

### 서명 표시
- 저장된 서명 이미지 미리보기
- 마지막 서명 날짜 표시
- "다시 서명" 버튼

---

## Phase 5: 서류 서명 시 직원 불러오기

### WorkerSelectModal (components/employees/WorkerSelectModal.tsx)
```typescript
interface WorkerSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteId: string;
  onSelect: (worker: Worker) => void;
}
```

### UI 플로우
```
TBM/교육 서류 상세 화면
    ↓
[참석자 추가] 버튼 클릭
    ↓
WorkerSelectModal 열림
    ↓
등록된 직원 목록 표시 (검색 가능)
    ↓
직원 선택
    ↓
참석자 목록에 이름 자동 추가
    ↓
서명란 클릭 → SignatureModal (매번 직접 서명)
```

### 서명 날짜 표시
- 참석자 서명 완료 시 `signedAt` 기록
- TBMDocument/EducationDocument에서 서명 옆에 날짜 표시
```
이름: 김철수
서명: [서명이미지]
서명일: 2024-01-15 14:30
```

---

## Phase 6: 네비게이션 및 마무리

### DashboardShell 메뉴 추가
- Sidebar: "직원 관리" (Users 아이콘) → /employees
- BottomNav: 필요시 추가 또는 설정 하위로

### 직원 검색/필터
- 이름 검색
- 공종별 필터
- 업체별 필터

### 반응형 UI
- 모바일: 1열 카드
- 태블릿: 2열 그리드
- 데스크톱: 3-4열 그리드

---

## 의존성 설치

```bash
pnpm add browser-image-compression
```

---

## 파일 구조 (최종)

```
app/(dashboard)/employees/page.tsx

components/employees/
  EmployeeList.tsx
  EmployeeCard.tsx
  EmployeeFormModal.tsx
  WorkerSelectModal.tsx

components/ui/
  ImageUploader.tsx    ← 새로 추가
```

---

## 구현 순서

1. browser-image-compression 설치
2. ImageUploader 컴포넌트 생성
3. Worker 타입 확장 (photos 필드)
4. EmployeeFormModal 컴포넌트 생성
5. EmployeeCard 컴포넌트 생성
6. EmployeeList 컴포넌트 생성
7. /employees 페이지 생성
8. DashboardShell 메뉴 추가
9. WorkerSelectModal 컴포넌트 생성
10. TBM/교육 문서에 직원 선택 연동
11. 서명 날짜 표시 추가


# ver6
### 260326 에 작업해야할 내용
1. 서명 입력 시 서명한 날짜 시간 입력되게 수정
2. 네비바에 현재 현장 없애
3. 서류 작성 탭 누르면 서류 목록도 같이 선택 됨.(기능적 문제는 없으나 같이 선택됐다는 버그 있음)
4. https://www.data.go.kr/data/15049607/fileData.do 에서 매주 산업재해 ㅂ코드 업데이트 체크해서 입력시 법적 이슈 없게끔 수정
5. gemini나 gpt api 불러와서 수기로 작업내용 입력할때, 내부 데이터 조회해서 알맞는 재해종류 제안해주는 로직 추가
6. 회원가입을 해야하지 않음? 사업자 입력정보도 다 받아야할텐데?
7. 모든 버튼과 기능들이 데이터 플로우가 맞는지 점검 해야함 (ex. 기본 하도급사 입력이 되어있으나 불러와지지 않음). 또 입력 받아야할 내용들이 엄청 많은데, 전부 입력이 안되기 때문에, 문서 유형별로 모든 입력칸을 입력할 수 있게 해야함 (8번 참조)
8. 모든 문서는 (http://localhost:3000/documents) 다시 수정할 수 있어야함. 
9. [제출] 버튼을 만들어서 저장 하는 방식으로 가는게 좋을것 같음
10. 오프라인 작업이 가능하게 끔 하는게 좋을 것 같음
11. 리얼타임 적용해서, 오늘 작성 해야하는 문서를 대시보드에 띄워주면 좀 더 편리할듯? 
12. 관리자가 입력 요청을 보낼 수 있게 해야함. -> 회원 가입시 라벨링 작업을 통해서, 관리자, 소장 이런식으로 분류. 관리자가 입력 요청을 소장한테 보내면, 소장은 작성해야하는 문서 입력하게끔 하고, 매일매일 보내야하는건 요청 보내지 않아도 입력해야하는 사람 화면에 뜨는거로
13. 관리자 대시보드도 필요함


#### http://localhost:3000/documents/new

1. 참석자에 필터 걸수 있는 드롭다운 박스 만들어서 작업자 카테고리에 맞게 필터링 작업되는 기능 추가
2. 위험 평가서 선택하면 작성자가 아닌 평가자, 소장 이름을 입력할 수 있게 해야함
3. 공종또한 https://www.data.go.kr/data/15049607/fileData.do 에서 올바르게 가져올것
4. 문서 유형을 먼저 선택해서, 입력 받아야할 내용을 다 다르게 가져가는 거로. 통일하니까 문제가 좀 있음
5. 참석자 전체 선택할 수 있는것도 추가

#### 위험평가서

1. 현재 위험성 체크할 수 있는 숫자들 터치하면 체크표시나 동그라미 표시 되게 해서 체크한 것으로 만들 것
2. 위험 평가서를 작
3. 특이사항 입력란 만들어서 작성할 내용 작성하게끔.
4. 한번 작성하면 수정할 수 없게 변경. 평가서가 수정되면 어쩌냐

#### 작업 전 안전점검회의(TBM) 일지
1. 날씨 수기 입력 가능하게
2. 하도급사 수기 입력될 수 있게 수정
3. 수정하면 작성자 텍스트 아래 최종 수정일 기록 남게 추가


#### http://localhost:3000/inspection
1. 선택문서 다운이 안됨. zip로 받지 말고 하나씩 따로따로 받는거로 ㄱㄱ

---

# ver6-1 — 구현 작업 목록 (API/AI 제외)

> 260326 기준. 아래 번호 순서대로 하나씩 처리할 것.

---

## 🐛 버그 수정

### B-1. 서류 작성 탭 + 서류 목록 동시 선택 버그
- **파일**: `components/layouts/Sidebar.tsx`, `components/layouts/BottomNav.tsx`
- **현상**: `/documents/new` 접속 시 사이드바에서 "서류 작성"과 "서류 목록" 둘 다 active 상태
- **원인**: isActive 조건에서 `/documents/new`가 `/documents`의 startsWith에 걸림
- **수정**: `/documents` 항목의 isActive 조건에 `pathname !== '/documents/new'` 예외 추가
- **상태**: ⬜ 미완료

### B-2. inspection 페이지 선택 문서 다운로드 안되는 버그
- **파일**: `app/(dashboard)/inspection/page.tsx`
- **현상**: 선택된 문서 다운로드 버튼 클릭 시 zip으로 묶어서 내려받으려 하는데 동작 안 함
- **수정**: zip 방식 제거 → 선택된 문서 각각 개별 PDF로 print/다운로드
- **방식**: `window.print()` 또는 각 문서별 `<a>` 링크로 처리
- **상태**: ⬜ 미완료

---

## 🧭 네비게이션 수정

### N-1. 사이드바/헤더에서 현재 현장 선택 UI 제거
- **파일**: `components/layouts/Sidebar.tsx`, `components/layouts/DashboardShell.tsx`
- **현상**: 사이드바 상단에 현장 선택 드롭다운(SiteSelector) 표시됨
- **수정**: SiteSelector 컴포넌트를 사이드바에서 제거
- **참고**: 현장 정보는 추후 Supabase 연동 시 세션으로 관리 예정. 지금은 하드코딩 SITE_ID 사용
- **상태**: ⬜ 미완료

---

## 📝 서명 수정

### S-1. 서명 날짜/시간 모두 표시
- **파일**: `components/documents/TBMDocument.tsx`, `components/documents/EducationDocument.tsx`
- **현상**: 서명 옆에 날짜만 표시 (월/일), 시간 없음
- **수정**: `signedAt` 기준으로 날짜 + 시간(HH:MM) 같이 표시
- **예시**: `1/15 14:30`
- **상태**: ⬜ 미완료

---

## 📄 문서 수정 기능

### D-1. 저장된 문서 수정 가능하게 변경
- **파일**: `app/(dashboard)/documents/[id]/page.tsx`, `app/(dashboard)/documents/new/page.tsx`
- **현상**: 문서 상세 페이지에 수정 버튼이 있으나 실제 수정 플로우 없음
- **수정 방향**:
  - 문서 상세 페이지 수정 버튼 클릭 → `/documents/new?edit={id}` 로 이동
  - `documents/new/page.tsx`에서 `edit` 파라미터 감지 시 기존 데이터 로드 후 편집 모드
  - 완료 시 새로 저장(create)이 아닌 업데이트(update)
- **상태**: ⬜ 미완료

### D-2. 문서 유형별 입력 필드 완전 분리
- **파일**: `app/(dashboard)/documents/new/page.tsx`
- **현상**: 모든 문서 유형이 동일한 입력 폼을 공유 → TBM에 불필요한 필드, 위험성평가에 누락 필드 등
- **수정**: 문서 유형 선택 후 유형별로 완전히 다른 입력 단계 렌더링
  - **TBM**: 날짜, 작성자, 공종, 날씨(수기), 하도급사(수기), 참석자, 위험요인, 특별전달사항
  - **위험성평가서**: 날짜, 평가자, 소장명, 공종, 위험요인+위험성등급, 특이사항
  - **안전교육일지**: 날짜, 강사명, 교육종류, 공종, 교육내용, 참석자
  - **작업계획서**: 날짜, 작성자, 공종, 작업내용, 투입장비, 안전조치
- **상태**: ⬜ 미완료

### D-3. [저장] 버튼 방식으로 변경
- **파일**: `app/(dashboard)/documents/new/page.tsx`
- **현상**: 마지막 단계에서 자동 저장 후 상세 페이지로 이동
- **수정**: 마지막 단계에 명시적 [저장] 버튼 배치, 클릭 시 저장 + 이동
- **추가**: 저장 전 임시저장 상태 표시 (선택)
- **상태**: ⬜ 미완료

### D-4. 작성된 문서 목록에서 수정 버튼 연결
- **파일**: `app/(dashboard)/documents/page.tsx`
- **현상**: 서류 목록에서 문서 카드 클릭 시 상세 페이지로만 이동
- **수정**: 카드에 수정 아이콘 버튼 추가 → `/documents/new?edit={id}` 이동
- **상태**: ⬜ 미완료

---

## 📋 TBM 일지 수정

### T-1. 날씨 수기 입력
- **파일**: `app/(dashboard)/documents/new/page.tsx` (D-2와 연계)
- **현상**: 날씨 필드 없음
- **수정**: 날씨 텍스트 입력 필드 추가 (맑음, 흐림, 비, 눈 등)
- **상태**: ⬜ 미완료

### T-2. 하도급사 수기 입력
- **파일**: `app/(dashboard)/documents/new/page.tsx`
- **현상**: 하도급사 필드가 사이트 기본값에서 가져오지 못함
- **수정**: 자유 텍스트 입력 필드로 변경, 현장 기본값에서 초기값 로드
- **상태**: ⬜ 미완료

### T-3. 최종 수정일 기록 표시
- **파일**: `components/documents/TBMDocument.tsx`
- **현상**: 수정 이력 표시 없음
- **수정**: 문서 하단 작성자 아래에 `최초 작성: YYYY-MM-DD / 최종 수정: YYYY-MM-DD HH:MM` 표시
- **상태**: ⬜ 미완료

---

## ⚠️ 위험성평가서 수정

### R-1. 위험성 등급 숫자 체크 가능하게
- **파일**: `components/documents/RiskDocument.tsx`
- **현상**: 위험성 빈도/강도 숫자가 정적 텍스트
- **수정**: 숫자 셀 터치/클릭 시 선택(체크) 표시, 선택된 값이 문서에 반영
- **상태**: ⬜ 미완료

### R-2. 평가자/소장 이름 입력란 분리
- **파일**: `app/(dashboard)/documents/new/page.tsx` (D-2와 연계)
- **현상**: 작성자 1개 필드만 있음
- **수정**: 위험성평가서 선택 시 "평가자", "소장" 2개 필드로 분리
- **상태**: ⬜ 미완료

### R-3. 특이사항 입력란 추가
- **파일**: `components/documents/RiskDocument.tsx`, `app/(dashboard)/documents/new/page.tsx`
- **현상**: 특이사항 입력 없음
- **수정**: 특이사항 텍스트에리어 입력 → 문서 하단 렌더링
- **상태**: ⬜ 미완료

### R-4. 저장 후 수정 잠금
- **파일**: `app/(dashboard)/documents/[id]/page.tsx`
- **현상**: 위험성평가서도 일반 문서와 같이 수정 가능
- **수정**: 문서 `docType === 'risk'`인 경우 수정 버튼 비활성화 + 안내 문구 표시
- **예시**: "위험성평가서는 제출 후 수정할 수 없습니다"
- **상태**: ⬜ 미완료

---

## 👥 참석자 선택 개선

### P-1. 참석자 필터 드롭다운 추가
- **파일**: `app/(dashboard)/documents/new/page.tsx`
- **현상**: 참석자 선택 시 전체 직원 목록만 표시
- **수정**: 공종별/업체별 필터 드롭다운 추가 → 필터링된 직원 목록 표시
- **상태**: ⬜ 미완료

### P-2. 참석자 전체 선택 버튼
- **파일**: `app/(dashboard)/documents/new/page.tsx`
- **현상**: 참석자 하나씩만 선택 가능
- **수정**: "전체 선택" / "전체 해제" 버튼 추가
- **상태**: ⬜ 미완료

---

## 🔌 데이터 플로우 점검 및 수정

### F-1. 현장 기본값 실제 반영
- **파일**: `app/(dashboard)/documents/new/page.tsx`, `app/(dashboard)/sites/[id]/settings/page.tsx`
- **현상**: 현장 설정에서 하도급사/작성자 기본값 저장하지만 서류 작성 시 불러오지 않음
- **수정**: `siteDefaultStore` (또는 localStorage) 에서 기본값 로드해 폼 초기값으로 사용
- **확인 필요 항목**: 기본 공종, 기본 작성자, 기본 하도급사, 안전관리자 연락처
- **상태**: ⬜ 미완료

### F-2. 모든 입력 필드 StoredDocument 타입에 반영
- **파일**: `lib/store/documentStore.ts`, `types/index.ts`
- **현상**: 날씨, 특이사항, 평가자, 소장 등 필드가 타입에 없거나 저장 안 됨
- **수정**: `StoredDocument` 타입에 필요한 모든 필드 추가
  ```typescript
  weather?: string;           // 날씨
  specialNotes?: string;      // 특별전달사항/특이사항
  evaluator?: string;         // 평가자 (위험성평가서)
  siteManager?: string;       // 소장명 (위험성평가서)
  lastModifiedAt?: string;    // 최종 수정일
  isLocked?: boolean;         // 수정 잠금 여부 (위험성평가서)
  ```
- **상태**: ⬜ 미완료

---

## 🔐 회원가입 + 역할 분리

### A-1. 회원가입 페이지 구현
- **파일**: `app/(auth)/register/page.tsx`
- **현상**: 회원가입 UI는 있으나 실제 입력 필드 미완성
- **수정**: Supabase Auth 회원가입 + 프로필 입력 플로우
  - 소셜 로그인 후 추가 정보 입력 단계
  - 필수 입력: 이름, 연락처, 사업자등록번호, 업체명
  - 선택 입력: 역할(관리자/소장), 현장 수
- **상태**: ⬜ 미완료

### A-2. 역할(role) 분리: 관리자 / 소장
- **파일**: `types/index.ts`, `lib/store/` (또는 Supabase users 테이블)
- **현상**: 모든 사용자가 동일한 권한으로 접근
- **수정**:
  - `role: 'admin' | 'foreman'` 필드 추가
  - 관리자: 전체 현장 서류 조회 + 작성 요청 발송
  - 소장: 담당 현장 서류 작성 + 요청 수신
- **상태**: ⬜ 미완료

### A-3. 관리자 → 소장 문서 작성 요청 기능
- **파일**: 신규 `app/(dashboard)/requests/` 또는 대시보드 통합
- **현상**: 없음
- **수정**:
  - 관리자가 특정 소장에게 "오늘 TBM 작성해주세요" 요청 발송
  - 소장 대시보드에 미완료 요청 뱃지 표시
  - 매일 자동 반복 문서(TBM 등)는 요청 없어도 소장 화면에 자동 표시
- **상태**: ⬜ 미완료

### A-4. 관리자 대시보드 페이지
- **파일**: 신규 `app/(dashboard)/admin/page.tsx`
- **현상**: 없음
- **수정**:
  - 담당 현장 전체 목록
  - 현장별 오늘 서류 작성 현황 (완료/미완료)
  - 미작성 현장 강조 표시
  - 특정 현장 서류 일괄 조회
- **상태**: ⬜ 미완료

---

## 📡 오프라인 + 실시간

### O-1. PWA 오프라인 지원
- **파일**: `next.config.js`, `public/manifest.json`, `public/sw.js`
- **현상**: 오프라인 시 동작 불가
- **수정**:
  - `next-pwa` 패키지 설치
  - Service Worker 등록
  - 서류 작성/조회 핵심 기능 오프라인 캐싱
  - 온라인 복귀 시 자동 동기화 (Supabase 연동 후)
- **설치**: `pnpm add next-pwa`
- **상태**: ⬜ 미완료

### O-2. 대시보드 오늘 작성 문서 실시간 표시
- **파일**: `app/(dashboard)/dashboard/page.tsx`
- **현상**: 대시보드에 오늘의 서류 현황이 정적으로 표시
- **수정**:
  - documentStore에서 오늘 날짜 기준 작성 문서 로드
  - 미작성 문서 유형 강조 표시 (TBM, 교육 등 일상 문서)
  - Supabase Realtime 연동 후 실시간 업데이트 예정
- **상태**: ⬜ 미완료

---

## 🗂️ 구현 우선순위

```
1순위 (빠른 버그 수정):
  B-1 탭 동시 선택 버그
  B-2 inspection 다운로드
  N-1 네비바 현장 제거
  S-1 서명 날짜+시간

2순위 (문서 핵심 기능):
  F-2 StoredDocument 타입 확장
  F-1 현장 기본값 반영
  D-2 문서 유형별 입력 분리
  D-1 + D-3 문서 수정 + [저장] 버튼

3순위 (문서 세부 수정):
  T-1, T-2, T-3 TBM 수정
  R-1, R-2, R-3, R-4 위험성평가서
  P-1, P-2 참석자 개선

4순위 (회원/권한):
  A-1 회원가입
  A-2 역할 분리
  A-3 작성 요청
  A-4 관리자 대시보드

5순위 (인프라):
  O-1 PWA
  O-2 대시보드 실시간
```