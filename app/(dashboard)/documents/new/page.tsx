'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Users,
  UserPlus,
  X,
  Save,
} from 'lucide-react';
import {
  Button,
  Card,
  Input,
  Select,
  SearchableSelect,
  StepIndicator,
  ChecklistItem,
} from '@/components/ui';
import { DOC_TYPES } from '@/lib/constants/docTypes';
import type { DocType } from '@/types';
import { TRADES, getTradeLabel } from '@/lib/constants/trades';
import { getRiskData } from '@/lib/constants/riskData';
import { documentStore, type StoredDocument, type Participant } from '@/lib/store/documentStore';
import { workerStore, type Worker } from '@/lib/store/workerStore';
import { siteDefaultStore } from '@/lib/store/siteDefaultStore';
import type { RiskItem } from '@/types';

const STEPS = ['기본 정보', '위험요인 선택', '확인 및 저장'];

// 임시 현장 목록
const SITES = [
  { id: '1', name: '강남역 오피스텔 신축공사' },
  { id: '2', name: '판교 데이터센터 건립공사' },
];

function NewDocumentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const initialType = (searchParams.get('type') as DocType) || 'tbm';
  const initialSiteId = searchParams.get('siteId') || '1';

  const [currentStep, setCurrentStep] = useState(0);
  const [siteId, setSiteId] = useState<string>(initialSiteId);
  const [docType, setDocType] = useState<DocType>(initialType);
  const [trade, setTrade] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [author, setAuthor] = useState('');
  const [selectedRisks, setSelectedRisks] = useState<RiskItem[]>([]);
  const [customRisks, setCustomRisks] = useState<string[]>([]);
  const [newCustomRisk, setNewCustomRisk] = useState('');

  // 문서 유형별 추가 필드
  const [weather, setWeather] = useState('');
  const [subcontractor, setSubcontractor] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [evaluator, setEvaluator] = useState('');
  const [siteManager, setSiteManager] = useState('');
  const [educationType, setEducationType] = useState('정기교육');
  const [location, setLocation] = useState('');
  const [equipment, setEquipment] = useState('');

  // 참석자/작업자 관련 상태
  const [siteWorkers, setSiteWorkers] = useState<Worker[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const [showParticipantSelector, setShowParticipantSelector] = useState(false);
  const [manualParticipantName, setManualParticipantName] = useState('');
  const [manualParticipantRole, setManualParticipantRole] = useState('');
  const [participantFilter, setParticipantFilter] = useState<string>('all');

  // 수정모드 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDoc, setEditingDoc] = useState<StoredDocument | null>(null);

  // 수정 모드 시 기존 문서 데이터 로드
  useEffect(() => {
    if (editId) {
      const doc = documentStore.getById(editId);
      if (doc) {
        setIsEditMode(true);
        setEditingDoc(doc);
        setDocType(doc.docType);
        setTrade(doc.trade);
        setDate(doc.workDate);
        setAuthor(doc.author);
        setSiteId(doc.siteId || '1');
        setSelectedRisks(doc.risks as RiskItem[]);
        setCustomRisks(doc.customRisks);
        setWeather(doc.weather || '');
        setSubcontractor(doc.subcontractor || '');
        setSpecialNotes(doc.specialNotes || '');
        setEvaluator(doc.evaluator || '');
        setSiteManager(doc.siteManager || '');
        setEducationType(doc.educationType || '정기교육');
        setLocation(doc.location || '');
        setEquipment(doc.equipment || '');
        if (doc.participants) {
          setSelectedParticipants(doc.participants);
        }
      }
    }
  }, [editId]);

  // 현장 기본값 로드
  useEffect(() => {
    if (!isEditMode) {
      const defaults = siteDefaultStore.get(siteId);
      if (defaults) {
        if (!author && defaults.defaultWriter) setAuthor(defaults.defaultWriter);
        if (!subcontractor && defaults.defaultSubcontractor) setSubcontractor(defaults.defaultSubcontractor);
        if (!trade && defaults.defaultTrade) setTrade(defaults.defaultTrade);
      }
    }
  }, [siteId, isEditMode]);

  // 현장 변경 시 작업자 목록 로드
  useEffect(() => {
    const workers = workerStore.getWorkers(siteId);
    setSiteWorkers(workers);
    if (!isEditMode) {
      setSelectedParticipants([]);
    }
  }, [siteId, isEditMode]);

  // 공종 변경 시 위험요인 초기화 (수정 모드가 아닐 때만)
  useEffect(() => {
    if (!isEditMode) {
      setSelectedRisks([]);
    }
  }, [trade, isEditMode]);

  const availableRisks = trade ? getRiskData(trade) : [];

  const toggleRisk = (risk: RiskItem) => {
    setSelectedRisks((prev) => {
      const exists = prev.some((r) => r.hazard === risk.hazard);
      if (exists) {
        return prev.filter((r) => r.hazard !== risk.hazard);
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

  // 참석자 필터링
  const filteredWorkers =
    participantFilter === 'all'
      ? siteWorkers
      : siteWorkers.filter((w) => w.trade === participantFilter);

  const workerTrades = Array.from(new Set(siteWorkers.map((w) => w.trade).filter(Boolean))) as string[];

  const toggleWorkerSelection = (worker: Worker) => {
    setSelectedParticipants((prev) => {
      const exists = prev.some((p) => p.id === worker.id);
      if (exists) {
        return prev.filter((p) => p.id !== worker.id);
      }
      return [...prev, { id: worker.id, name: worker.name, role: worker.role, trade: worker.trade }];
    });
  };

  const selectAllWorkers = () => {
    const currentlyAll = filteredWorkers.every((w) =>
      selectedParticipants.some((p) => p.id === w.id)
    );
    if (currentlyAll) {
      const filteredIds = new Set(filteredWorkers.map((w) => w.id));
      setSelectedParticipants((prev) => prev.filter((p) => !filteredIds.has(p.id)));
    } else {
      setSelectedParticipants((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newOnes = filteredWorkers
          .filter((w) => !existingIds.has(w.id))
          .map((w) => ({ id: w.id, name: w.name, role: w.role, trade: w.trade }));
        return [...prev, ...newOnes];
      });
    }
  };

  const addManualParticipant = () => {
    if (manualParticipantName.trim()) {
      const newParticipant: Participant = {
        id: `manual_${Date.now()}`,
        name: manualParticipantName.trim(),
        role: manualParticipantRole.trim() || undefined,
      };
      setSelectedParticipants((prev) => [...prev, newParticipant]);
      setManualParticipantName('');
      setManualParticipantRole('');
    }
  };

  const removeParticipant = (participantId: string) => {
    setSelectedParticipants((prev) => prev.filter((p) => p.id !== participantId));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: {
        const base = docType && trade && date;
        if (docType === 'risk') return base && evaluator;
        return base && author;
      }
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
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const handleSave = () => {
    const site = SITES.find((s) => s.id === siteId);
    const now = new Date().toISOString();

    const doc: StoredDocument = {
      id: isEditMode && editingDoc ? editingDoc.id : documentStore.generateId(),
      siteId,
      siteName: site?.name,
      docType,
      trade,
      tradeName: getTradeLabel(trade),
      workDate: date,
      author: docType === 'risk' ? evaluator : author,
      status: 'complete',
      risks: selectedRisks,
      customRisks,
      participants: selectedParticipants.length > 0 ? selectedParticipants : undefined,
      weather: docType === 'tbm' ? weather : undefined,
      subcontractor,
      specialNotes,
      evaluator: docType === 'risk' ? evaluator : undefined,
      siteManager: docType === 'risk' ? siteManager : undefined,
      educationType: docType === 'education' ? educationType : undefined,
      location,
      equipment: docType === 'workplan' ? equipment : undefined,
      lastModifiedAt: isEditMode ? now : undefined,
      isLocked: false,
      createdAt: isEditMode && editingDoc ? editingDoc.createdAt : now,
      updatedAt: now,
      ...(isEditMode && editingDoc
        ? { authorSignature: editingDoc.authorSignature, authorSignedAt: editingDoc.authorSignedAt }
        : {}),
    };

    documentStore.save(doc);
    router.push(`/documents/${doc.id}`);
  };

  const renderTypeSpecificFields = () => {
    switch (docType) {
      case 'tbm':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">작성자</label>
              <Input placeholder="작성자 이름" value={author} onChange={(value) => setAuthor(value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">날씨</label>
              <Input placeholder="맑음, 흐림, 비, 눈 등" value={weather} onChange={(value) => setWeather(value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">하도급사</label>
              <Input placeholder="하도급사명" value={subcontractor} onChange={(value) => setSubcontractor(value)} />
            </div>
          </>
        );
      case 'risk':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">평가자</label>
              <Input placeholder="평가자 이름" value={evaluator} onChange={(value) => setEvaluator(value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">소장</label>
              <Input placeholder="소장 이름" value={siteManager} onChange={(value) => setSiteManager(value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">하도급사</label>
              <Input placeholder="하도급사명" value={subcontractor} onChange={(value) => setSubcontractor(value)} />
            </div>
          </>
        );
      case 'education':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">교육실시자(강사)</label>
              <Input placeholder="강사 이름" value={author} onChange={(value) => setAuthor(value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">교육 종류</label>
              <Select
                value={educationType}
                onChange={(value) => setEducationType(value)}
                options={[
                  { value: '정기교육', label: '정기교육' },
                  { value: '채용시 교육', label: '채용시 교육' },
                  { value: '작업내용 변경시', label: '작업내용 변경시' },
                  { value: '특별교육', label: '특별교육' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">하도급사</label>
              <Input placeholder="하도급사명" value={subcontractor} onChange={(value) => setSubcontractor(value)} />
            </div>
          </>
        );
      case 'workplan':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">작업책임자</label>
              <Input placeholder="작업책임자 이름" value={author} onChange={(value) => setAuthor(value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">작업장소</label>
              <Input placeholder="작업장소" value={location} onChange={(value) => setLocation(value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">투입장비</label>
              <Input placeholder="사용 장비 목록" value={equipment} onChange={(value) => setEquipment(value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">하도급사</label>
              <Input placeholder="하도급사명" value={subcontractor} onChange={(value) => setSubcontractor(value)} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-surface border-b border-border">
        <div className="flex items-center h-14 px-4">
          <button onClick={handleBack} className="p-2 -ml-2 text-text-secondary hover:text-text-primary">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="ml-2 text-lg font-semibold text-text-primary">
            {isEditMode ? '문서 수정' : '새 문서 작성'}
          </h1>
        </div>
        <div className="px-4 pb-4">
          <StepIndicator steps={STEPS} currentStep={currentStep + 1} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Step 1: 기본 정보 */}
        {currentStep === 0 && (
          <>
            <Card className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">현장 선택</label>
                <Select
                  value={siteId}
                  onChange={(value) => setSiteId(value)}
                  options={SITES.map((site) => ({ value: site.id, label: site.name }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">문서 유형</label>
                <Select
                  value={docType}
                  onChange={(value) => setDocType(value as DocType)}
                  options={Object.entries(DOC_TYPES).map(([key, doc]) => ({ value: key, label: doc.label }))}
                />
              </div>

              <div>
                <SearchableSelect
                  label="공종"
                  value={trade}
                  onChange={(value) => setTrade(value)}
                  options={TRADES}
                  placeholder="공종을 선택하세요"
                  searchable
                  allowCustomInput
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">작성일</label>
                <Input type="date" value={date} onChange={(value) => setDate(value)} />
              </div>

              {/* 문서 유형별 추가 입력 필드 */}
              {renderTypeSpecificFields()}
            </Card>

            {/* 참석자/작업자 선택 */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-text-secondary" />
                  <h2 className="text-sm font-semibold text-text-primary">
                    참석자 ({selectedParticipants.length}명)
                  </h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowParticipantSelector(!showParticipantSelector)}>
                  <UserPlus className="h-4 w-4 mr-1" />
                  추가
                </Button>
              </div>

              {/* 선택된 참석자 목록 */}
              {selectedParticipants.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedParticipants.map((p) => (
                    <div key={p.id} className="flex items-center gap-1 px-2 py-1 bg-primary-light text-primary rounded-full text-sm">
                      <span>{p.name}</span>
                      {p.role && <span className="text-xs opacity-70">({p.role})</span>}
                      <button onClick={() => removeParticipant(p.id)} className="ml-1 hover:text-error">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 참석자 선택 패널 */}
              {showParticipantSelector && (
                <div className="border border-border rounded-lg p-3 space-y-3">
                  {siteWorkers.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-text-secondary">등록된 작업자</p>
                          {workerTrades.length > 0 && (
                            <select
                              value={participantFilter}
                              onChange={(e) => setParticipantFilter(e.target.value)}
                              className="text-xs border border-border rounded px-2 py-1 bg-surface"
                            >
                              <option value="all">전체 공종</option>
                              {workerTrades.map((t) => (
                                <option key={t} value={t}>{getTradeLabel(t)}</option>
                              ))}
                            </select>
                          )}
                        </div>
                        <button onClick={selectAllWorkers} className="text-xs text-primary hover:underline">
                          {filteredWorkers.every((w) => selectedParticipants.some((p) => p.id === w.id))
                            ? '전체 해제'
                            : '전체 선택'}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {filteredWorkers.map((worker) => {
                          const isSelected = selectedParticipants.some((p) => p.id === worker.id);
                          return (
                            <button
                              key={worker.id}
                              onClick={() => toggleWorkerSelection(worker)}
                              className={`flex items-center gap-2 p-2 rounded-lg border text-left text-sm transition-colors ${
                                isSelected ? 'border-primary bg-primary-light text-primary' : 'border-border hover:bg-surface-2'
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{worker.name}</div>
                                {worker.role && <div className="text-xs text-text-muted truncate">{worker.role}</div>}
                              </div>
                              {isSelected && <Check className="h-4 w-4 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {siteWorkers.length === 0 && (
                    <p className="text-sm text-text-muted text-center py-2">
                      등록된 작업자가 없습니다.<br />
                      <span className="text-xs">직원 관리에서 작업자를 추가하세요.</span>
                    </p>
                  )}

                  {/* 직접 입력 */}
                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-text-secondary mb-2">직접 추가</p>
                    <div className="flex gap-2">
                      <Input placeholder="이름" value={manualParticipantName} onChange={(value) => setManualParticipantName(value)} className="flex-1" />
                      <Input placeholder="직책 (선택)" value={manualParticipantRole} onChange={(value) => setManualParticipantRole(value)} className="flex-1" />
                      <Button variant="outline" onClick={addManualParticipant} disabled={!manualParticipantName.trim()}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {selectedParticipants.length === 0 && !showParticipantSelector && (
                <p className="text-sm text-text-muted text-center py-2">아직 선택된 참석자가 없습니다.</p>
              )}
            </Card>
          </>
        )}

        {/* Step 2: 위험요인 선택 */}
        {currentStep === 1 && (
          <>
            <Card className="p-4">
              <h2 className="text-sm font-semibold text-text-primary mb-3">{getTradeLabel(trade)} 위험요인</h2>
              <div className="space-y-2">
                {availableRisks.map((risk, index) => (
                  <ChecklistItem
                    key={`${risk.hazard}-${index}`}
                    label={`${risk.hazard} (대책: ${risk.measure})`}
                    checked={selectedRisks.some((r) => r.hazard === risk.hazard)}
                    onChange={() => toggleRisk(risk)}
                  />
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h2 className="text-sm font-semibold text-text-primary mb-3">직접 추가</h2>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="위험요인 직접 입력"
                  value={newCustomRisk}
                  onChange={(value) => setNewCustomRisk(value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomRisk(); } }}
                />
                <Button variant="outline" onClick={addCustomRisk} disabled={!newCustomRisk.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {customRisks.length > 0 && (
                <div className="space-y-2">
                  {customRisks.map((risk, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-surface-2 rounded-lg">
                      <span className="text-sm text-text-primary">{risk}</span>
                      <button onClick={() => removeCustomRisk(index)} className="p-1 text-text-muted hover:text-error">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {(docType === 'risk' || docType === 'tbm') && (
              <Card className="p-4">
                <h2 className="text-sm font-semibold text-text-primary mb-3">
                  {docType === 'risk' ? '특이사항' : '특별 전달사항'}
                </h2>
                <textarea
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder={docType === 'risk' ? '특이사항을 입력하세요' : '특별 전달사항을 입력하세요'}
                  className="w-full h-24 p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </Card>
            )}
          </>
        )}

        {/* Step 3: 확인 및 저장 */}
        {currentStep === 2 && (
          <>
            <Card className="p-4">
              <h2 className="text-sm font-semibold text-text-primary mb-4">문서 정보 확인</h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-text-secondary">현장</dt>
                  <dd className="text-sm font-medium text-text-primary">{SITES.find((s) => s.id === siteId)?.name || '-'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-text-secondary">문서 유형</dt>
                  <dd className="text-sm font-medium text-text-primary">{DOC_TYPES[docType].label}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-text-secondary">공종</dt>
                  <dd className="text-sm font-medium text-text-primary">{getTradeLabel(trade)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-text-secondary">작성일</dt>
                  <dd className="text-sm font-medium text-text-primary">{date}</dd>
                </div>
                {docType === 'tbm' && (
                  <>
                    <div className="flex justify-between">
                      <dt className="text-sm text-text-secondary">작성자</dt>
                      <dd className="text-sm font-medium text-text-primary">{author || '-'}</dd>
                    </div>
                    {weather && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-text-secondary">날씨</dt>
                        <dd className="text-sm font-medium text-text-primary">{weather}</dd>
                      </div>
                    )}
                  </>
                )}
                {docType === 'risk' && (
                  <>
                    <div className="flex justify-between">
                      <dt className="text-sm text-text-secondary">평가자</dt>
                      <dd className="text-sm font-medium text-text-primary">{evaluator || '-'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-text-secondary">소장</dt>
                      <dd className="text-sm font-medium text-text-primary">{siteManager || '-'}</dd>
                    </div>
                  </>
                )}
                {docType === 'education' && (
                  <>
                    <div className="flex justify-between">
                      <dt className="text-sm text-text-secondary">교육실시자</dt>
                      <dd className="text-sm font-medium text-text-primary">{author || '-'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-text-secondary">교육 종류</dt>
                      <dd className="text-sm font-medium text-text-primary">{educationType}</dd>
                    </div>
                  </>
                )}
                {docType === 'workplan' && (
                  <>
                    <div className="flex justify-between">
                      <dt className="text-sm text-text-secondary">작업책임자</dt>
                      <dd className="text-sm font-medium text-text-primary">{author || '-'}</dd>
                    </div>
                    {location && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-text-secondary">작업장소</dt>
                        <dd className="text-sm font-medium text-text-primary">{location}</dd>
                      </div>
                    )}
                    {equipment && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-text-secondary">투입장비</dt>
                        <dd className="text-sm font-medium text-text-primary">{equipment}</dd>
                      </div>
                    )}
                  </>
                )}
                {subcontractor && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-text-secondary">하도급사</dt>
                    <dd className="text-sm font-medium text-text-primary">{subcontractor}</dd>
                  </div>
                )}
                {selectedParticipants.length > 0 && (
                  <div>
                    <dt className="text-sm text-text-secondary mb-2">참석자 ({selectedParticipants.length}명)</dt>
                    <dd className="flex flex-wrap gap-1">
                      {selectedParticipants.map((p) => (
                        <span key={p.id} className="inline-flex items-center px-2 py-0.5 bg-surface-2 rounded text-xs text-text-primary">
                          {p.name}{p.role && <span className="text-text-muted ml-1">({p.role})</span>}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </Card>

            <Card className="p-4">
              <h2 className="text-sm font-semibold text-text-primary mb-3">
                선택된 위험요인 ({selectedRisks.length + customRisks.length}건)
              </h2>
              <ul className="space-y-2">
                {selectedRisks.map((risk, index) => (
                  <li key={`risk-${index}`} className="text-sm text-text-primary flex items-start gap-2">
                    <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    {risk.hazard}
                  </li>
                ))}
                {customRisks.map((risk, index) => (
                  <li key={`custom-${index}`} className="text-sm text-text-primary flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {risk}<span className="text-xs text-text-muted">(직접 추가)</span>
                  </li>
                ))}
              </ul>
            </Card>

            {specialNotes && (
              <Card className="p-4">
                <h2 className="text-sm font-semibold text-text-primary mb-2">
                  {docType === 'risk' ? '특이사항' : '특별 전달사항'}
                </h2>
                <p className="text-sm text-text-secondary whitespace-pre-wrap">{specialNotes}</p>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 safe-area-bottom">
        <div className="max-w-lg mx-auto flex gap-3">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">이전</Button>
          )}
          {currentStep === STEPS.length - 1 ? (
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isEditMode ? '수정 저장' : '저장'}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed()} className="flex-1">
              다음<ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
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
