---
applyTo: "**/*.{tsx,ts,css}"
---

# SafeDocs UI Development Instructions

You are an expert Next.js frontend developer and UI/UX designer specializing in Korean B2B SaaS products.

## YOUR ROLE
You build SafeDocs — a Korean construction site safety document automation SaaS.
Your job is to design and build the complete frontend UI.
Always output complete, runnable code. No placeholders. No TODOs.

---

## ABSOLUTE RULES (NEVER BREAK THESE)

1. ALL colors must use CSS variables — never hardcode hex/rgb values in components
2. ALL reusable UI patterns must be components in /components/ui/
3. NEVER copy-paste JSX — if you write same structure twice, make a component
4. Mobile-first always — start from 375px, scale up
5. Minimum touch target 48px height on all interactive elements
6. Minimum font size 16px on all inputs — prevents iOS auto-zoom
7. TypeScript strict mode — no 'any' types
8. Korean text throughout — all UI copy in Korean

---

## DESIGN SYSTEM

### CSS Variables (globals.css — single source of truth)
```css
:root {
  /* Brand Colors */
  --color-primary: #1E40AF;
  --color-primary-hover: #1D4ED8;
  --color-primary-light: #DBEAFE;
  --color-primary-dark: #1E3A8A;
  --color-accent: #F59E0B;
  --color-danger: #DC2626;
  --color-danger-light: #FEE2E2;
  --color-success: #16A34A;
  --color-success-light: #DCFCE7;
  --color-warning: #D97706;
  --color-warning-light: #FEF3C7;

  /* Neutral */
  --color-bg: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-surface-2: #F1F5F9;
  --color-border: #E2E8F0;
  --color-border-focus: #1E40AF;
  --color-text-primary: #0F172A;
  --color-text-secondary: #64748B;
  --color-text-muted: #94A3B8;
  --color-text-disabled: #CBD5E1;

  /* Typography */
  --font-xs: 12px;
  --font-sm: 14px;
  --font-base: 16px;
  --font-lg: 18px;
  --font-xl: 20px;
  --font-2xl: 24px;
  --font-3xl: 30px;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* Layout */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.10);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);

  /* Component-specific */
  --navbar-height: 60px;
  --bottomnav-height: 64px;
  --sidebar-width: 240px;
}
```

### Tailwind Config
Extend tailwind to reference CSS variables:
```js
colors: {
  primary: 'var(--color-primary)',
  'primary-hover': 'var(--color-primary-hover)',
  'primary-light': 'var(--color-primary-light)',
  accent: 'var(--color-accent)',
  danger: 'var(--color-danger)',
  'danger-light': 'var(--color-danger-light)',
  success: 'var(--color-success)',
  'success-light': 'var(--color-success-light)',
  warning: 'var(--color-warning)',
  bg: 'var(--color-bg)',
  surface: 'var(--color-surface)',
  'surface-2': 'var(--color-surface-2)',
  border: 'var(--color-border)',
  'text-primary': 'var(--color-text-primary)',
  'text-secondary': 'var(--color-text-secondary)',
  'text-muted': 'var(--color-text-muted)',
}
```

---

## COMPONENT LIBRARY

Location: /components/ui/
Export all from: /components/ui/index.ts

Every component must:
- Accept className prop for overrides
- Use CSS variables for all colors
- Be fully typed with TypeScript interfaces
- Have Korean default text where applicable

### Button
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}
```
- Min height: sm=36px, md=48px, lg=56px
- Loading: spinner replaces icon, text stays, disabled

### Card
```typescript
interface CardProps {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: boolean
  bordered?: boolean
  className?: string
  onClick?: () => void
}
```

### Input
```typescript
interface InputProps {
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  required?: boolean
  disabled?: boolean
  type?: string
  value: string
  onChange: (value: string) => void
  className?: string
}
```
- Label always above, never floating
- Error: red border + error text below
- Font size always 16px

### SearchableSelect
```typescript
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
- searchable: type to filter options in real-time
- allowCustomInput: if no match found, allow free text
- Shows clear (X) button when value selected
- Keyboard navigation support

### Badge
```typescript
interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  size?: 'sm' | 'md'
  children: ReactNode
}
```

### Modal
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'fullscreen'
  footer?: ReactNode
}
```
- Backdrop click closes modal
- ESC key closes modal
- Scroll lock on body when open
- fullscreen option for mobile forms

### BottomSheet
```typescript
interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  snapPoints?: number[]
}
```
- Slides up from bottom
- Swipe down to dismiss
- Used for mobile forms and filters

### PageHeader
```typescript
interface PageHeaderProps {
  title: string
  subtitle?: string
  backHref?: string
  actions?: ReactNode
}
```

### EmptyState
```typescript
interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}
```

### LoadingSpinner
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  fullPage?: boolean
  text?: string
}
```

### Tabs
```typescript
interface TabsProps {
  tabs: Array<{ value: string; label: string; count?: number }>
  activeTab: string
  onChange: (value: string) => void
  variant?: 'line' | 'pill'
}
```

### DocumentCard
```typescript
interface DocumentCardProps {
  id: string
  docType: 'tbm' | 'risk' | 'education' | 'workplan'
  tradeName: string
  workDate: string
  status: 'draft' | 'complete'
  siteName?: string
  onView: () => void
  onShare: () => void
  onDelete: () => void
}
```
- Left: doc type icon (color-coded)
- Center: trade name + date + site
- Right: status badge
- Bottom: 보기/공유/삭제 action buttons
- Compact, list-optimized

### StepIndicator
```typescript
interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}
```
- Used in multi-step forms

### SiteSelector
```typescript
interface SiteSelectorProps {
  sites: Array<{ id: string; name: string }>
  selectedSiteId: string
  onSelect: (siteId: string) => void
  onAddSite: () => void
}
```

### ChecklistItem
```typescript
interface ChecklistItemProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
  required?: boolean
}
```

---

## FOLDER STRUCTURE

```
src/
  app/
    globals.css
    layout.tsx
    page.tsx                          랜딩페이지
    (auth)/
      login/page.tsx                  소셜 로그인
      register/page.tsx               사업자 정보 입력
    (dashboard)/
      layout.tsx                      대시보드 쉘
      dashboard/page.tsx              홈
      sites/
        page.tsx                      현장 목록
        [id]/
          page.tsx                    현장 상세
          settings/page.tsx           현장 기본값 설정
      documents/
        new/page.tsx                  새 서류 작성 (3단계)
        [id]/page.tsx                 서류 상세
      inspection/page.tsx             감독 대응 모드
      settings/page.tsx               계정/구독 설정
    share/
      [token]/page.tsx                공유 뷰어 (비로그인)
  components/
    ui/                               위 컴포넌트 전체
      index.ts                        전체 export
    layouts/
      DashboardShell.tsx              사이드바 + 헤더 통합
      Sidebar.tsx                     데스크탑 사이드바
      Header.tsx                      상단 헤더
      BottomNav.tsx                   모바일 하단 네비
    forms/
      TBMForm.tsx
      RiskAssessForm.tsx
      EducationForm.tsx
      WorkPlanForm.tsx
    documents/
      DocumentList.tsx
      DocumentPreview.tsx
      ShareModal.tsx
      InspectionPanel.tsx
  lib/
    constants/
      trades.ts                       공종 30개
      docTypes.ts                     서류종류 + 아이콘 + 색상
      riskData.ts                     공종별 위험요인 DB
    utils/
      document.ts                     서류 생성 로직 (룰베이스)
      format.ts                       날짜/숫자 포맷
      share.ts                        공유링크 유틸
  hooks/
    useDocuments.ts
    useSites.ts
    useSubscription.ts
  types/
    index.ts                          전체 타입 정의
```

---

## NAVIGATION STRUCTURE

### Mobile (하단 네비바 고정)
- 홈 (집 아이콘)
- 서류작성 (+ 아이콘, 강조색)
- 현장 (빌딩 아이콘)
- 설정 (기어 아이콘)

### Desktop (좌측 사이드바)
- SafeDocs 로고
- SiteSelector 드롭다운
- 메뉴: 대시보드 / 서류 작성 / 서류 목록 / 감독 대응 / 설정
- 하단: 플랜 정보 + 업그레이드 버튼

---

## PAGE SPECS

### 랜딩페이지 (/)
섹션 순서:
1. Hero: "감독관이 나왔을 때 30초 안에 3년치 서류 꺼내세요" + CTA 버튼
2. Problem: 현장소장 고통 3가지 (카드 형식)
3. Solution: SafeDocs 작동 방식 (3단계 플로우)
4. Features: 주요 기능 4개 (아이콘 + 설명)
5. Pricing: 3개 플랜 카드
6. CTA: "14일 무료로 시작하기"
- 모바일 최적화
- 한국어 카피

### 로그인 (/login)
- 로고 중앙
- "카카오로 시작하기" (노란 버튼, 가장 크게)
- "네이버로 시작하기" (초록 버튼)
- "구글로 시작하기" (흰 버튼)
- 하단: 서비스 이용약관 + 개인정보처리방침 링크

### 대시보드 (/dashboard)
상단:
- "안녕하세요 [이름]님 👋"
- SiteSelector

오늘의 서류 (빠른 생성):
- 4개 큰 버튼 카드
- TBM 일지 / 위험성평가서 / 안전교육일지 / 작업계획서
- 각 카드에 아이콘 + 색상 구분

최근 서류:
- DocumentCard 리스트 5개
- "전체 보기" 링크

### 새 서류 작성 (/documents/new)
StepIndicator (3단계):

Step 1 — 서류 종류 선택
- 4개 카드 (크게, 아이콘, 설명 포함)
- 선택 시 강조 테두리

Step 2 — 정보 입력
- 현장 기본값 자동 로드
- 공종: SearchableSelect (searchable + allowCustomInput)
- 작업일: DatePicker (기본값 오늘)
- 날씨: Select (맑음/흐림/비/눈)
- 작성자명: Input (기본값 프리셋에서 로드)
- 하도급사명: Input (기본값 프리셋에서 로드)
- 수정 가능한 모든 필드

Step 3 — 확인 + 저장
- 생성된 서류 미리보기 (카드 형식 요약)
- "PDF 저장" 버튼
- "카카오톡으로 공유" 버튼
- "다시 작성" 버튼

### 현장 기본값 설정 (/sites/[id]/settings)
- 현장명/공사명/발주처 (수정 가능)
- 자주 쓰는 공종 즐겨찾기 (SearchableSelect, 복수 선택)
- 기본 작성자명
- 기본 하도급사명
- 기본 안전담당자 연락처
- 저장 시 이후 서류 작성에 자동 반영

### 감독 대응 모드 (/inspection)
- 현장 선택
- 기간 필터 탭 (1개월/3개월/1년/전체)
- 서류종류 탭 (전체/TBM/위험성평가/교육/작업계획)
- DocumentCard 리스트
- "전체 다운로드 (ZIP)" 버튼 (상단 고정)
- 자가점검 체크리스트 (ChecklistItem 리스트, 접기/펼치기)

### 공유 뷰어 (/share/[token])
- 로그인 불필요
- 상단: SafeDocs 로고 + 서류 제목
- 중앙: 서류 내용 (카드 형식으로 정렬)
- 하단: "PDF 다운로드" 버튼
- 최하단: "SafeDocs로 만들었습니다 →" 워터마크 (클릭 시 랜딩페이지)

---

## CONSTANTS

### /lib/constants/docTypes.ts
```typescript
export const DOC_TYPES = {
  tbm: {
    label: 'TBM 일지',
    description: '작업 전 안전점검회의',
    icon: 'ClipboardList',
    color: 'var(--color-primary)',
    bgColor: 'var(--color-primary-light)',
  },
  risk: {
    label: '위험성평가서',
    description: '공종별 위험요인 분석',
    icon: 'AlertTriangle',
    color: 'var(--color-warning)',
    bgColor: 'var(--color-warning-light)',
  },
  education: {
    label: '안전교육일지',
    description: '법정 안전보건교육 기록',
    icon: 'BookOpen',
    color: 'var(--color-success)',
    bgColor: 'var(--color-success-light)',
  },
  workplan: {
    label: '작업계획서',
    description: '작업 순서 및 안전조치',
    icon: 'FileText',
    color: 'var(--color-danger)',
    bgColor: 'var(--color-danger-light)',
  },
}
```

### /lib/constants/trades.ts
30개 공종 전체 정의:
```typescript
export const TRADES = [
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
]
```

---

## DOCUMENT GENERATION — 룰베이스

Location: /lib/utils/document.ts
Location: /lib/constants/riskData.ts

Structure for riskData:
```typescript
interface RiskItem {
  hazard: string         // 위험요인
  riskType: string       // 재해유형 (추락/낙하/끼임/충돌/감전 등)
  likelihood: 1|2|3|4    // 가능성
  severity: 1|2|3|4      // 중대성
  measure: string        // 안전대책
}

export const RISK_DATA: Record<string, RiskItem[]> = {
  scaffold: [
    { hazard: '비계 작업 중 추락', riskType: '추락', likelihood: 3, severity: 4, measure: '안전대 착용 의무화, 추락방지망 설치, 작업발판 고정 확인' },
    { hazard: '자재 낙하로 하부 작업자 부상', riskType: '낙하·비래', likelihood: 3, severity: 3, measure: '하부 출입금지 구역 설정, 낙하물 방지망 설치' },
    { hazard: '비계 구조물 붕괴', riskType: '붕괴', likelihood: 2, severity: 4, measure: '비계 조립 기준 준수, 정기 점검 실시' },
    { hazard: '공구 및 자재 낙하', riskType: '낙하·비래', likelihood: 3, severity: 3, measure: '공구 안전끈 사용, 작업 전 정리정돈' },
    { hazard: '강풍 시 작업 중 추락', riskType: '추락', likelihood: 2, severity: 4, measure: '풍속 10m/s 이상 시 작업 중지' },
  ],
  excavation: [
    { hazard: '굴착면 붕괴로 매몰', riskType: '붕괴', likelihood: 2, severity: 4, measure: '흙막이 설치, 굴착면 기울기 기준 준수, 매일 점검' },
    { hazard: '굴착기 후진 시 근로자 충돌', riskType: '충돌', likelihood: 3, severity: 4, measure: '유도자 배치, 후방 경보장치 확인' },
    { hazard: '지하 매설물 파손', riskType: '폭발·화재', likelihood: 2, severity: 4, measure: '사전 도면 확인, 탐지기 사용, 수작업 병행' },
    { hazard: '굴착 주변 근로자 추락', riskType: '추락', likelihood: 3, severity: 3, measure: '안전난간 또는 덮개 설치' },
  ],
  // 나머지 28개 공종도 동일 구조로 작성
}
```

Generation function pattern:
```typescript
function generateTBM(inputs, riskItems): TBMDocument {
  return {
    header: { ...inputs },
    works: inputs.selectedTrades.map(trade => ({ trade, location: inputs.location, workers: inputs.workers })),
    risks: riskItems.slice(0, 5).map(r => ({ hazard: r.hazard, riskType: r.riskType, measure: r.measure })),
    notice: inputs.specialNotice || '',
    signatures: Array(15).fill({ name: '', signature: '' }),
  }
}
// 나중에 AI로 교체 시 이 함수만 교체하면 됨
```

---

## BUILD PRIORITY (순서대로)

1. globals.css + tailwind.config.ts
2. /types/index.ts — 모든 타입
3. /lib/constants/ — docTypes, trades, riskData
4. /components/ui/ — 전체 컴포넌트 라이브러리
5. /components/layouts/ — DashboardShell, Sidebar, BottomNav
6. 랜딩페이지 (/)
7. 로그인 페이지 (/login)
8. 대시보드 (/dashboard)
9. 새 서류 작성 (/documents/new) — 3단계
10. 현장 설정 (/sites/[id]/settings)

DO NOT BUILD YET: 결제, PDF 실제 생성, Supabase 연동, 공유링크 백엔드
FOCUS ON: UI 완성도 + 컴포넌트 재사용성 + 모바일 경험

Output complete runnable TypeScript/TSX code for each file.
No placeholders. No comments saying "implement later".
