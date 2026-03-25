# SafeDocs — 건설현장 안전서류 자동화 플랫폼

> 감독관이 나왔을 때 30초 안에 3년치 서류 꺼내세요.

---

## 📋 프로젝트 개요

SafeDocs는 전국 7.5만 개 소규모 전문건설 하도급 업체를 위한 안전서류 자동화 SaaS입니다.
중대재해처벌법 의무 서류(TBM 일지, 위험성평가서, 안전교육일지, 작업계획서)를 3분 안에 생성하고 클라우드에 보관합니다.

---

## 🏗️ 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript (strict) |
| 스타일링 | Tailwind CSS + CSS Variables |
| 백엔드/DB | Supabase (PostgreSQL + Storage) |
| 인증 | Supabase Auth (카카오 / 네이버 / 구글) |
| 결제 | 토스페이먼츠 정기결제 |
| 배포 | Vercel |

---

## 🗂️ 프로젝트 구조

```
safedocs/
├── app/
│   ├── (auth)/
│   │   ├── login/          # 소셜 로그인 (카카오/네이버/구글)
│   │   └── register/       # 회원가입 완료 (사업자 정보 입력)
│   ├── (dashboard)/
│   │   ├── layout.tsx      # 대시보드 쉘 (사이드바 + 하단 네비)
│   │   ├── dashboard/      # 홈 (오늘의 서류 + 최근 서류)
│   │   ├── documents/
│   │   │   ├── new/        # 새 서류 작성 (3단계 플로우)
│   │   │   └── [id]/       # 서류 상세 + 법정 양식 렌더링
│   │   ├── sites/
│   │   │   └── [id]/
│   │   │       └── settings/ # 현장 기본값 설정
│   │   ├── inspection/     # 감독 대응 모드
│   │   └── settings/       # 계정/구독 설정
│   ├── share/
│   │   └── [token]/        # 공유 뷰어 (비로그인 접근 가능)
│   └── auth/
│       └── callback/       # Supabase OAuth 콜백
├── components/
│   ├── ui/                 # 공통 컴포넌트 라이브러리
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── SearchableSelect.tsx  # 드롭다운 + 검색 + 직접입력
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── Tabs.tsx
│   │   ├── StepIndicator.tsx
│   │   ├── ChecklistItem.tsx
│   │   ├── PageHeader.tsx
│   │   ├── EmptyState.tsx
│   │   └── index.ts        # 전체 export
│   ├── layouts/
│   │   ├── DashboardShell.tsx
│   │   ├── Sidebar.tsx     # 데스크탑 전용
│   │   ├── Header.tsx      # 모바일 전용
│   │   └── BottomNav.tsx   # 모바일 전용
│   └── documents/
│       ├── TBMDocument.tsx       # TBM 일지 법정 양식 렌더러
│       ├── RiskDocument.tsx      # 위험성평가서 법정 양식 렌더러
│       ├── EducationDocument.tsx # 안전교육일지 법정 양식 렌더러
│       └── WorkplanDocument.tsx  # 작업계획서 법정 양식 렌더러
├── lib/
│   ├── constants/
│   │   ├── docTypes.ts     # 서류 종류 + 아이콘 + 색상 정의
│   │   ├── trades.ts       # 공종 30개 목록 + 라벨
│   │   └── riskData.ts     # 공종별 위험요인 DB (룰베이스)
│   ├── store/
│   │   └── documentStore.ts  # 서류 저장/조회 (로컬스토리지 → Supabase 전환 예정)
│   ├── utils/
│   │   ├── document.ts     # 서류 생성 로직 (룰베이스 → AI 전환 가능 구조)
│   │   ├── disasterType.ts # 재해유형 자동 분류 (키워드 룰베이스 + 고용노동부 코드)
│   │   └── format.ts       # 날짜/전화번호/사업자번호 포맷
│   └── supabase/
│       ├── client.ts       # 브라우저 클라이언트
│       └── server.ts       # 서버 클라이언트 (SSR)
├── types/
│   └── index.ts            # 전체 공유 타입 정의
└── middleware.ts            # 인증 보호 라우트 처리
```

---

## ⚙️ 환경 변수

`.env.local` 파일을 루트에 생성하고 아래 변수를 설정하세요.

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 토스페이먼츠 (결제 연동 시)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxx
TOSS_SECRET_KEY=test_sk_xxxx

# 공공데이터포털 (재해유형 코드 API 연동 시)
PUBLIC_DATA_SERVICE_KEY=your_service_key
```

---

## 🗄️ Supabase 테이블 구조

```sql
-- 유저 프로필
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  name TEXT,
  phone TEXT,
  business_number TEXT,
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 현장
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  construction_name TEXT,
  client_name TEXT,
  start_date DATE,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 현장 기본값 프리셋
CREATE TABLE site_defaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id),
  favorite_trades TEXT[],
  default_author TEXT,
  default_subcontractor TEXT,
  safety_officer_phone TEXT
);

-- 서류
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES sites(id),
  user_id UUID REFERENCES users(id),
  doc_type TEXT CHECK (doc_type IN ('tbm', 'risk', 'education', 'workplan')),
  trade TEXT,
  work_date DATE,
  status TEXT DEFAULT 'complete',
  content JSONB,
  share_token UUID DEFAULT gen_random_uuid(),
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 재해유형 코드 (고용노동부 공공데이터 기반)
CREATE TABLE disaster_types (
  code TEXT PRIMARY KEY,        -- 예: '01', '0101'
  parent_code TEXT,             -- 대분류 코드 (null이면 대분류)
  name TEXT NOT NULL,           -- 예: '떨어짐'
  detail_name TEXT,             -- 예: '비계 등 가설구조물에서 떨어짐'
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 구독
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  plan TEXT CHECK (plan IN ('basic', 'standard', 'pro')),
  status TEXT DEFAULT 'trial',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
```

---

## 📄 서류 자동생성 구조

서류 생성은 AI 없이 룰베이스로 동작합니다.
나중에 AI로 교체 시 `lib/utils/document.ts`의 generate 함수만 수정하면 됩니다.

```
사용자 입력 (공종 선택 + 날짜 + 작성자)
        ↓
lib/constants/riskData.ts 에서 공종별 위험요인 조회
        ↓
generateDocument() 호출
        ↓
StoredDocument 객체 생성
        ↓
documentStore.save()
  현재: 로컬스토리지 저장
  예정: Supabase documents 테이블 저장
        ↓
documents/[id] 에서 법정 양식으로 렌더링
```

---

## 🚨 재해유형 코드 관리

재해유형은 고용노동부 공식 분류 기준을 사용합니다.

**데이터 출처:** 공공데이터포털 데이터셋 ID `15049607`
(고용노동부 산업재해 발생형태 코드 — 로그인 없이 CSV 다운로드 가능)
URL: `https://www.data.go.kr/data/15049607/fileData.do`

**현재 운영 방식:** CSV 파일 수동 다운로드 → Supabase `disaster_types` 테이블 삽입
**향후 계획:** 오픈 API 연동으로 주기적 자동 동기화

**커스텀 위험요인 입력 시 재해유형 분류 흐름:**
```
사용자가 위험요인 직접 입력
        ↓
lib/utils/disasterType.ts 키워드 룰베이스 자동 분류
  (추락/낙하/감전/화재/협착/붕괴 등 키워드 매칭)
        ↓
분류 성공 → 결과 표시 + 사용자가 수정 가능
분류 실패 → 재해유형 선택 모달 팝업 (강제 선택)

※ "기타"는 모달에서 직접 선택한 경우에만 허용
※ 자동으로 "기타"가 들어가는 케이스 금지
```

---

## 💳 요금제

| 플랜 | 금액 | 현장 수 | 서류 생성 | 보관 기간 |
|------|------|------|------|------|
| Basic | 29,000원/월 | 1개 | 월 30건 | 1년 |
| Standard | 59,000원/월 | 3개 | 월 100건 | 3년 |
| Pro | 99,000원/월 | 무제한 | 무제한 | 무제한 |

- 14일 무료 체험 (카드 등록 없이 시작)
- 토스페이먼츠 정기결제
- 세금계산서 자동 발행
- 통신판매업 등록 기반 운영

---

## 🗺️ 개발 로드맵

### ✅ MVP v1 (완료)
- [x] 랜딩페이지 (히어로 + 기능 소개 + 요금제)
- [x] 소셜 로그인 UI (구글/카카오/네이버)
- [x] 3단계 서류 작성 플로우
- [x] 룰베이스 위험요인 자동생성 (30개 공종)
- [x] 서류 법정 양식 렌더링 4종 (TBM/위험성평가/교육/작업계획)
- [x] 감독 대응 모드 (기간 필터 + 일괄 다운로드)
- [x] CSS 변수 기반 디자인 시스템
- [x] 모바일 퍼스트 레이아웃

### 🔄 v1.5 (진행 중)
- [ ] 카카오/네이버 Supabase Auth 연동
- [ ] Supabase DB 서류 저장 (로컬스토리지 대체)
- [ ] PDF 생성 + 다운로드 (Puppeteer)
- [ ] 카카오톡 공유 링크 (공유 뷰어 페이지)
- [ ] 현장 기본값 프리셋 (즐겨찾기 공종 등)
- [ ] 참석자 디지털 서명
- [ ] 고용노동부 재해유형 코드 Supabase 삽입
- [ ] StepIndicator 인덱스 버그 수정

### 📌 v2
- [ ] 토스페이먼츠 구독 결제 연동
- [ ] 3년치 서류 클라우드 보관
- [ ] AI 위험요인 자동 분류 (Claude API)
- [ ] 법령 개정 자동 반영 알림
- [ ] 공공데이터 오픈 API 자동 동기화

### 🔮 v3
- [ ] 원청사 Enterprise 대시보드
- [ ] 하도급 일괄 서류 관리
- [ ] 대한전문건설협회 채널 연동
- [ ] 중동 시장 진출 (사우디/이라크 건설현장)

---

## 📐 디자인 시스템 규칙

모든 색상은 `app/globals.css`의 CSS 변수로 중앙 관리합니다.

```css
/* 올바른 예 */
className="text-primary bg-primary-light"
style={{ color: 'var(--color-primary)' }}

/* 절대 금지 */
style={{ color: '#1E40AF' }}
```

색상 변경 시 `globals.css`의 `:root` 블록만 수정하면 전체 반영됩니다.

---

## 📁 법적 근거

| 서류 | 법적 근거 | 보관 의무 |
|------|------|------|
| TBM 일지 | 산업안전보건법 제29조 | 3년 |
| 위험성평가서 | 산업안전보건법 제36조 | 3년 |
| 안전교육일지 | 산업안전보건법 제29조 | 3년 |
| 작업계획서 | 산업안전보건기준에 관한 규칙 제38조 | 3년 |

미이행 시 제재: 과태료(최대 500만원) + 중대재해 발생 시 대표자 형사처벌

---

## ⚠️ 개발 주의사항

**1인 개발 유지보수 최소화 원칙**

1. 같은 JSX 패턴 2번 이상 반복 시 → `components/ui/`에 컴포넌트 추출 필수
2. 모든 컴포넌트 import → 반드시 `@/components/ui`에서
3. 색상 → CSS 변수만 사용, hex 하드코딩 금지
4. TypeScript → `any` 타입 사용 금지 (strict 모드)
5. 모바일 퍼스트 → 375px 기준으로 먼저 구현
6. 터치 타겟 → 모든 버튼/링크 최소 높이 48px
7. Input 폰트 → 항상 16px (iOS 자동 확대 방지)
8. 서류 생성 로직 → `lib/utils/document.ts`만 수정 (AI 전환 대비 격리)

---

## 🚀 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 린트
npm run lint
```

개발 서버: `http://localhost:3000`
