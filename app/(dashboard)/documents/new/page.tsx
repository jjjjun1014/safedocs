'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check,
  ChevronDown,
  Plus,
  Trash2,
} from 'lucide-react';
import { 
  Button, 
  Card, 
  Input, 
  Select, 
  StepIndicator, 
  ChecklistItem,
  PageHeader,
} from '@/components/ui';
import { DOC_TYPES, DocType } from '@/lib/constants/docTypes';
import { TRADES, getTradeLabel } from '@/lib/constants/trades';
import { RISK_DATA } from '@/lib/constants/riskData';
import type { RiskItem } from '@/types';

const STEPS = ['기본 정보', '위험요인 선택', '확인 및 완료'];

function NewDocumentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') as DocType) || 'tbm';

  const [currentStep, setCurrentStep] = useState(0);
  const [docType, setDocType] = useState<DocType>(initialType);
  const [trade, setTrade] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [author, setAuthor] = useState('');
  const [selectedRisks, setSelectedRisks] = useState<RiskItem[]>([]);
  const [customRisks, setCustomRisks] = useState<string[]>([]);
  const [newCustomRisk, setNewCustomRisk] = useState('');

  // 공종 변경 시 위험요인 초기화
  useEffect(() => {
    setSelectedRisks([]);
  }, [trade]);

  const availableRisks = trade ? (RISK_DATA[trade] || []) : [];

  const toggleRisk = (risk: RiskItem) => {
    setSelectedRisks((prev) => {
      const exists = prev.some((r) => r.id === risk.id);
      if (exists) {
        return prev.filter((r) => r.id !== risk.id);
      }
      return [...prev, risk];
    });
  };

  const addCustomRisk = () => {
    if (newCustomRisk.trim()) {
      setCustomRisks((prev) => [...prev, newCustomRisk.trim()]);
      setNewCustomRisk('');
    }
  };

  const removeCustomRisk = (index: number) => {
    setCustomRisks((prev) => prev.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return docType && trade && date && author;
      case 1:
        return selectedRisks.length > 0 || customRisks.length > 0;
      case 2:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // 완료 처리
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = () => {
    // TODO: API 호출
    console.log({
      docType,
      trade,
      date,
      author,
      selectedRisks,
      customRisks,
    });
    router.push('/documents?success=true');
  };

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-surface border-b border-border">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="ml-2 text-lg font-semibold text-text-primary">
            새 문서 작성
          </h1>
        </div>
        <div className="px-4 pb-4">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Step 1: 기본 정보 */}
        {currentStep === 0 && (
          <>
            <Card className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  문서 유형
                </label>
                <Select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocType)}
                  options={Object.entries(DOC_TYPES).map(([key, doc]) => ({
                    value: key,
                    label: doc.label,
                  }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  공종
                </label>
                <Select
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  options={[
                    { value: '', label: '공종을 선택하세요' },
                    ...TRADES.map((t) => ({
                      value: t,
                      label: getTradeLabel(t),
                    })),
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  작성일
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  작성자
                </label>
                <Input
                  placeholder="작성자 이름"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </Card>
          </>
        )}

        {/* Step 2: 위험요인 선택 */}
        {currentStep === 1 && (
          <>
            {/* 기본 위험요인 */}
            <Card className="p-4">
              <h2 className="text-sm font-semibold text-text-primary mb-3">
                {getTradeLabel(trade)} 위험요인
              </h2>
              <div className="space-y-2">
                {availableRisks.map((risk) => (
                  <ChecklistItem
                    key={risk.id}
                    checked={selectedRisks.some((r) => r.id === risk.id)}
                    onChange={() => toggleRisk(risk)}
                  >
                    <div>
                      <p className="text-sm text-text-primary">{risk.risk}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        대책: {risk.measure}
                      </p>
                    </div>
                  </ChecklistItem>
                ))}
              </div>
            </Card>

            {/* 직접 추가 */}
            <Card className="p-4">
              <h2 className="text-sm font-semibold text-text-primary mb-3">
                직접 추가
              </h2>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="위험요인 직접 입력"
                  value={newCustomRisk}
                  onChange={(e) => setNewCustomRisk(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomRisk();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={addCustomRisk}
                  disabled={!newCustomRisk.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {customRisks.length > 0 && (
                <div className="space-y-2">
                  {customRisks.map((risk, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-surface-2 rounded-lg"
                    >
                      <span className="text-sm text-text-primary">{risk}</span>
                      <button
                        onClick={() => removeCustomRisk(index)}
                        className="p-1 text-text-muted hover:text-error"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}

        {/* Step 3: 확인 및 완료 */}
        {currentStep === 2 && (
          <>
            <Card className="p-4">
              <h2 className="text-sm font-semibold text-text-primary mb-4">
                문서 정보 확인
              </h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-text-secondary">문서 유형</dt>
                  <dd className="text-sm font-medium text-text-primary">
                    {DOC_TYPES[docType].label}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-text-secondary">공종</dt>
                  <dd className="text-sm font-medium text-text-primary">
                    {getTradeLabel(trade)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-text-secondary">작성일</dt>
                  <dd className="text-sm font-medium text-text-primary">{date}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-text-secondary">작성자</dt>
                  <dd className="text-sm font-medium text-text-primary">{author}</dd>
                </div>
              </dl>
            </Card>

            <Card className="p-4">
              <h2 className="text-sm font-semibold text-text-primary mb-3">
                선택된 위험요인 ({selectedRisks.length + customRisks.length}건)
              </h2>
              <ul className="space-y-2">
                {selectedRisks.map((risk) => (
                  <li key={risk.id} className="text-sm text-text-primary flex items-start gap-2">
                    <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    {risk.risk}
                  </li>
                ))}
                {customRisks.map((risk, index) => (
                  <li key={`custom-${index}`} className="text-sm text-text-primary flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {risk}
                    <span className="text-xs text-text-muted">(직접 추가)</span>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 safe-area-bottom">
        <div className="max-w-lg mx-auto flex gap-3">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              이전
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1"
          >
            {currentStep === STEPS.length - 1 ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                완료
              </>
            ) : (
              <>
                다음
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function NewDocumentPage() {
  return (
    <Suspense fallback={<div className="p-4">로딩 중...</div>}>
      <NewDocumentContent />
    </Suspense>
  );
}
