'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Star, 
  User, 
  Building2, 
  Phone,
  Save,
  Check,
} from 'lucide-react';
import { 
  Button, 
  Card, 
  Input, 
  PageHeader,
  Badge,
} from '@/components/ui';
import { TRADES, getTradeLabel } from '@/lib/constants/trades';

// 임시 현장 데이터
const siteData = {
  id: '1',
  name: '강남 오피스텔 신축현장',
  defaults: {
    favoriteTrades: ['rebar', 'concrete', 'formwork', 'safety_net'],
    defaultAuthor: '홍길동',
    defaultSubcontractor: '(주)대한건설',
    safetyOfficerPhone: '010-1234-5678',
  },
};

export default function SiteSettingsPage() {
  const router = useRouter();
  const params = useParams();
  
  const [favoriteTrades, setFavoriteTrades] = useState<string[]>(
    siteData.defaults.favoriteTrades
  );
  const [defaultAuthor, setDefaultAuthor] = useState(siteData.defaults.defaultAuthor);
  const [defaultSubcontractor, setDefaultSubcontractor] = useState(
    siteData.defaults.defaultSubcontractor
  );
  const [safetyOfficerPhone, setSafetyOfficerPhone] = useState(
    siteData.defaults.safetyOfficerPhone
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleFavoriteTrade = (trade: string) => {
    setFavoriteTrades((prev) => {
      if (prev.includes(trade)) {
        return prev.filter((t) => t !== trade);
      }
      return [...prev, trade];
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: API 호출
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-surface border-b border-border">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="ml-2 text-lg font-semibold text-text-primary">
            현장 설정
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Site Name */}
        <Card className="p-4">
          <h2 className="text-base font-semibold text-text-primary mb-1">
            {siteData.name}
          </h2>
          <p className="text-sm text-text-secondary">현장 기본값을 설정하세요</p>
        </Card>

        {/* Favorite Trades */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-5 w-5 text-warning" />
            <h2 className="text-sm font-semibold text-text-primary">
              즐겨찾기 공종
            </h2>
          </div>
          <p className="text-xs text-text-secondary mb-3">
            자주 사용하는 공종을 선택하면 문서 작성 시 빠르게 선택할 수 있습니다.
          </p>
          <div className="flex flex-wrap gap-2">
            {TRADES.map((trade) => {
              const isSelected = favoriteTrades.includes(trade);
              return (
                <button
                  key={trade}
                  onClick={() => toggleFavoriteTrade(trade)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isSelected 
                      ? 'bg-primary text-white' 
                      : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
                    }
                  `}
                >
                  {isSelected && <Check className="h-3 w-3 inline mr-1" />}
                  {getTradeLabel(trade)}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-text-muted mt-3">
            선택됨: {favoriteTrades.length}개
          </p>
        </Card>

        {/* Default Author */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-semibold text-text-primary">
              기본 작성자
            </h2>
          </div>
          <Input
            placeholder="기본 작성자 이름"
            value={defaultAuthor}
            onChange={(e) => setDefaultAuthor(e.target.value)}
          />
        </Card>

        {/* Default Subcontractor */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-semibold text-text-primary">
              기본 하도급사
            </h2>
          </div>
          <Input
            placeholder="기본 하도급사"
            value={defaultSubcontractor}
            onChange={(e) => setDefaultSubcontractor(e.target.value)}
          />
        </Card>

        {/* Safety Officer Phone */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-semibold text-text-primary">
              안전담당자 연락처
            </h2>
          </div>
          <Input
            type="tel"
            placeholder="010-0000-0000"
            value={safetyOfficerPhone}
            onChange={(e) => setSafetyOfficerPhone(e.target.value)}
          />
        </Card>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 safe-area-bottom">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? (
              '저장 중...'
            ) : showSuccess ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                저장 완료
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                설정 저장
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
