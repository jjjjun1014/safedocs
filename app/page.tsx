import Link from 'next/link';
import {
  ShieldAlert,
  Clock,
  FileText,
  CheckCircle2,
  Zap,
  Shield,
  Download,
  Share2,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="h-[60px] bg-surface border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-md text-white">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-primary tracking-tight">
            SafeDocs
          </span>
        </div>
        <Link
          href="/login"
          className="h-9 px-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-surface-2 text-text-primary"
        >
          로그인
        </Link>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center rounded-full bg-primary-light px-3 py-1 text-sm font-medium text-primary mb-6">
            건설현장 안전서류 자동화 솔루션
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight leading-tight mb-6">
            감독관이 나왔을 때
            <br />
            <span className="text-primary">30초 안에 3년치 서류</span> 꺼내세요
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
            TBM 일지, 위험성평가서, 안전교육일지. 매일 쓰는 똑같은 서류, 이제
            스마트폰으로 3번 클릭만에 완성하고 PDF로 저장하세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="h-14 px-8 w-full sm:w-auto inline-flex items-center justify-center rounded-md text-lg font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              14일 무료로 시작하기
            </Link>
            <a
              href="#features"
              className="h-14 px-8 w-full sm:w-auto inline-flex items-center justify-center rounded-md text-lg font-medium border border-border bg-transparent hover:bg-surface-2 text-text-primary transition-colors"
            >
              기능 둘러보기
            </a>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 bg-surface px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
              현장소장님들의 고통, 이제 끝내세요
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-bg p-6 rounded-lg">
                <div className="w-12 h-12 bg-danger-light text-danger rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">매일 뺏기는 2시간</h3>
                <p className="text-text-secondary">
                  퇴근도 못하고 엑셀과 씨름하며 똑같은 내용을 복사 붙여넣기 하고
                  계신가요?
                </p>
              </div>
              <div className="bg-bg p-6 rounded-lg">
                <div className="w-12 h-12 bg-warning-light text-warning rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">갑작스러운 점검</h3>
                <p className="text-text-secondary">
                  노동부 점검이 나왔을 때 서류가 어디 있는지 몰라 당황하신 적
                  있으신가요?
                </p>
              </div>
              <div className="bg-bg p-6 rounded-lg">
                <div className="w-12 h-12 bg-primary-light text-primary rounded-full flex items-center justify-center mb-4">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">복잡한 법적 양식</h3>
                <p className="text-text-secondary">
                  매번 바뀌는 중대재해처벌법 양식, 제대로 맞게 쓰고 있는지
                  불안하신가요?
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
              SafeDocs는 이렇게 작동합니다
            </h2>
            <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
              3단계만에 법적 요건을 충족하는 안전서류가 자동으로 완성됩니다
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">공종 선택</h3>
                <p className="text-text-secondary">
                  30개 공종 중 오늘 작업할 공종을 선택하세요. 검색으로 빠르게
                  찾거나 직접 입력할 수 있습니다.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">자동 완성</h3>
                <p className="text-text-secondary">
                  위험요인, 안전대책, 교육내용이 자동으로 채워집니다. 현장에 맞게
                  수정만 하면 됩니다.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">저장 & 공유</h3>
                <p className="text-text-secondary">
                  PDF로 저장하고 카카오톡으로 바로 공유하세요. 3년치 서류가 클라우드에 자동 보관됩니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-surface px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
              주요 기능
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-bg p-6 rounded-lg flex gap-4">
                <div className="w-12 h-12 bg-primary-light text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">3분 서류 작성</h3>
                  <p className="text-text-secondary">
                    TBM 일지, 위험성평가서, 안전교육일지, 작업계획서를 3분 안에
                    완성합니다.
                  </p>
                </div>
              </div>
              <div className="bg-bg p-6 rounded-lg flex gap-4">
                <div className="w-12 h-12 bg-success-light text-success rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">법적 요건 충족</h3>
                  <p className="text-text-secondary">
                    산업안전보건법, 중대재해처벌법 기준에 맞는 양식을 제공합니다.
                  </p>
                </div>
              </div>
              <div className="bg-bg p-6 rounded-lg flex gap-4">
                <div className="w-12 h-12 bg-warning-light text-warning rounded-lg flex items-center justify-center flex-shrink-0">
                  <Download className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">감독 대응 모드</h3>
                  <p className="text-text-secondary">
                    점검 시 3년치 서류를 한 페이지에서 조회하고 일괄 다운로드할 수
                    있습니다.
                  </p>
                </div>
              </div>
              <div className="bg-bg p-6 rounded-lg flex gap-4">
                <div className="w-12 h-12 bg-danger-light text-danger rounded-lg flex items-center justify-center flex-shrink-0">
                  <Share2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">카카오톡 공유</h3>
                  <p className="text-text-secondary">
                    서류 작성 후 바로 카카오톡으로 공유하세요. 링크 하나로 누구나
                    열람 가능합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
              합리적인 요금제
            </h2>
            <p className="text-text-secondary text-center mb-12">
              14일 무료 체험 후 결정하세요. 언제든 취소 가능합니다.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Basic Plan */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Basic</h3>
                <p className="text-text-secondary text-sm mb-4">소규모 현장용</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-text-primary">
                    29,000
                  </span>
                  <span className="text-text-secondary">원/월</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    현장 1개
                  </li>
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    월 30건 서류 생성
                  </li>
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    1년 보관
                  </li>
                </ul>
                <Link
                  href="/login"
                  className="w-full h-12 inline-flex items-center justify-center rounded-md text-base font-medium border border-border bg-transparent hover:bg-surface-2 text-text-primary transition-colors"
                >
                  시작하기
                </Link>
              </div>

              {/* Standard Plan */}
              <div className="bg-primary text-white rounded-xl p-6 relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                  추천
                </span>
                <h3 className="text-lg font-semibold mb-2">Standard</h3>
                <p className="text-white/80 text-sm mb-4">중규모 현장용</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold">59,000</span>
                  <span className="text-white/80">원/월</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle2 className="h-4 w-4" />
                    현장 3개
                  </li>
                  <li className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle2 className="h-4 w-4" />
                    월 100건 서류 생성
                  </li>
                  <li className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle2 className="h-4 w-4" />
                    3년 보관
                  </li>
                  <li className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle2 className="h-4 w-4" />
                    감독 대응 모드
                  </li>
                </ul>
                <Link
                  href="/login"
                  className="w-full h-12 inline-flex items-center justify-center rounded-md text-base font-medium bg-white text-primary hover:bg-white/90 transition-colors"
                >
                  시작하기
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Pro</h3>
                <p className="text-text-secondary text-sm mb-4">대규모 현장용</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-text-primary">
                    99,000
                  </span>
                  <span className="text-text-secondary">원/월</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    현장 무제한
                  </li>
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    서류 생성 무제한
                  </li>
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    무제한 보관
                  </li>
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    우선 고객지원
                  </li>
                </ul>
                <Link
                  href="/login"
                  className="w-full h-12 inline-flex items-center justify-center rounded-md text-base font-medium border border-border bg-transparent hover:bg-surface-2 text-text-primary transition-colors"
                >
                  시작하기
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-white/80 mb-8">
              14일 무료 체험 기간 동안 모든 기능을 사용해보세요. 카드 등록 없이
              시작할 수 있습니다.
            </p>
            <Link
              href="/login"
              className="h-14 px-8 inline-flex items-center justify-center rounded-md text-lg font-medium bg-white text-primary hover:bg-white/90 transition-colors"
            >
              14일 무료로 시작하기
              <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-md text-white">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-text-primary">
                SafeDocs
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-text-secondary">
              <Link href="/terms" className="hover:text-text-primary">
                이용약관
              </Link>
              <Link href="/privacy" className="hover:text-text-primary">
                개인정보처리방침
              </Link>
            </div>
            <p className="text-sm text-text-muted">
              © 2024 SafeDocs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
