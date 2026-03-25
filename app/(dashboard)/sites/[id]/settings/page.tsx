'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Star, 
  User, 
  Building2, 
  Phone,
  Save,
  Check,
  Users,
  Plus,
  Trash2,
  Edit2,
  X,
} from 'lucide-react';
import { 
  Button, 
  Card, 
  Input, 
  PageHeader,
  Badge,
  Modal,
  Select,
} from '@/components/ui';
import { TRADES, getTradeLabel } from '@/lib/constants/trades';
import { workerStore, type Worker } from '@/lib/store/workerStore';

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
  const siteId = params.id as string;
  
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

  // 작업자 관리 상태
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [workerForm, setWorkerForm] = useState({
    name: '',
    role: '',
    trade: '',
    phone: '',
    company: '',
  });
  const [quickAddNames, setQuickAddNames] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // 작업자 목록 로드
  useEffect(() => {
    setWorkers(workerStore.getWorkers(siteId));
  }, [siteId]);

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

  // 작업자 추가/수정
  const handleSaveWorker = () => {
    if (!workerForm.name.trim()) return;

    if (editingWorker) {
      workerStore.updateWorker(siteId, editingWorker.id, workerForm);
    } else {
      workerStore.addWorker(siteId, workerForm);
    }
    
    setWorkers(workerStore.getWorkers(siteId));
    handleCloseWorkerModal();
  };

  const handleCloseWorkerModal = () => {
    setShowWorkerModal(false);
    setEditingWorker(null);
    setWorkerForm({ name: '', role: '', trade: '', phone: '', company: '' });
  };

  const handleEditWorker = (worker: Worker) => {
    setEditingWorker(worker);
    setWorkerForm({
      name: worker.name,
      role: worker.role || '',
      trade: worker.trade || '',
      phone: worker.phone || '',
      company: worker.company || '',
    });
    setShowWorkerModal(true);
  };

  const handleDeleteWorker = (workerId: string) => {
    if (confirm('이 작업자를 삭제하시겠습니까?')) {
      workerStore.deleteWorker(siteId, workerId);
      setWorkers(workerStore.getWorkers(siteId));
    }
  };

  // 빠른 추가 (이름만)
  const handleQuickAdd = () => {
    const names = quickAddNames.split('\n').map((n) => n.trim()).filter(Boolean);
    if (names.length > 0) {
      workerStore.addWorkersQuick(siteId, names);
      setWorkers(workerStore.getWorkers(siteId));
      setQuickAddNames('');
      setShowQuickAdd(false);
    }
  };

  const roleOptions = [
    { value: '', label: '직책 선택' },
    { value: '반장', label: '반장' },
    { value: '기공', label: '기공' },
    { value: '조공', label: '조공' },
    { value: '기사', label: '기사' },
    { value: '안전관리자', label: '안전관리자' },
    { value: '기타', label: '기타' },
  ];

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

        {/* Workers Management */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-sm font-semibold text-text-primary">
                작업자 관리
              </h2>
              <Badge variant="info">{workers.length}명</Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowQuickAdd(true)}
              >
                빠른 추가
              </Button>
              <Button
                size="sm"
                onClick={() => setShowWorkerModal(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-text-secondary mb-3">
            현장 작업자를 등록하면 서류 작성 시 참석자를 빠르게 선택할 수 있습니다.
          </p>
          
          {workers.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">등록된 작업자가 없습니다</p>
              <p className="text-xs mt-1">상단 버튼으로 작업자를 추가하세요</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {workers.map((worker) => (
                <div
                  key={worker.id}
                  className="flex items-center justify-between p-3 bg-surface-2 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary">
                        {worker.name}
                      </span>
                      {worker.role && (
                        <Badge variant="neutral" size="sm">{worker.role}</Badge>
                      )}
                    </div>
                    {(worker.trade || worker.company) && (
                      <p className="text-xs text-text-muted mt-0.5">
                        {worker.trade && getTradeLabel(worker.trade)}
                        {worker.trade && worker.company && ' · '}
                        {worker.company}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditWorker(worker)}
                      className="p-2 text-text-muted hover:text-primary rounded-lg hover:bg-surface-3"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteWorker(worker.id)}
                      className="p-2 text-text-muted hover:text-danger rounded-lg hover:bg-surface-3"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
              const isSelected = favoriteTrades.includes(trade.value);
              return (
                <button
                  key={trade.value}
                  onClick={() => toggleFavoriteTrade(trade.value)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isSelected 
                      ? 'bg-primary text-white' 
                      : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
                    }
                  `}
                >
                  {isSelected && <Check className="h-3 w-3 inline mr-1" />}
                  {trade.label}
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
            onChange={(value) => setDefaultAuthor(value)}
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
            onChange={(value) => setDefaultSubcontractor(value)}
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
            onChange={(value) => setSafetyOfficerPhone(value)}
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

      {/* Worker Add/Edit Modal */}
      <Modal
        isOpen={showWorkerModal}
        onClose={handleCloseWorkerModal}
        title={editingWorker ? '작업자 수정' : '작업자 추가'}
        size="md"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={handleCloseWorkerModal}>
              취소
            </Button>
            <Button onClick={handleSaveWorker} disabled={!workerForm.name.trim()}>
              {editingWorker ? '수정' : '추가'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="이름 *"
            placeholder="작업자 이름"
            value={workerForm.name}
            onChange={(value) => setWorkerForm((prev) => ({ ...prev, name: value }))}
          />
          <Select
            label="직책"
            value={workerForm.role}
            onChange={(value) => setWorkerForm((prev) => ({ ...prev, role: value }))}
            options={roleOptions}
          />
          <Select
            label="공종"
            value={workerForm.trade}
            onChange={(value) => setWorkerForm((prev) => ({ ...prev, trade: value }))}
            options={[
              { value: '', label: '공종 선택' },
              ...TRADES,
            ]}
          />
          <Input
            label="연락처"
            type="tel"
            placeholder="010-0000-0000"
            value={workerForm.phone}
            onChange={(value) => setWorkerForm((prev) => ({ ...prev, phone: value }))}
          />
          <Input
            label="소속 업체"
            placeholder="업체명"
            value={workerForm.company}
            onChange={(value) => setWorkerForm((prev) => ({ ...prev, company: value }))}
          />
        </div>
      </Modal>

      {/* Quick Add Modal */}
      <Modal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        title="작업자 빠른 추가"
        size="md"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowQuickAdd(false)}>
              취소
            </Button>
            <Button onClick={handleQuickAdd} disabled={!quickAddNames.trim()}>
              추가
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-text-secondary">
            이름만 빠르게 등록합니다. 줄바꿈으로 여러 명을 한 번에 추가하세요.
          </p>
          <textarea
            className="w-full h-40 px-3 py-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text-primary placeholder:text-text-muted"
            placeholder="홍길동&#10;김철수&#10;이영희&#10;..."
            value={quickAddNames}
            onChange={(e) => setQuickAddNames(e.target.value)}
          />
          <p className="text-xs text-text-muted">
            총 {quickAddNames.split('\n').filter((n) => n.trim()).length}명
          </p>
        </div>
      </Modal>
    </div>
  );
}
