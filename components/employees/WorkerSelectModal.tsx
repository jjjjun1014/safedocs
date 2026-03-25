'use client';

import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Users } from 'lucide-react';
import { Modal, Input, Button, EmptyState } from '@/components/ui';
import { EmployeeCard } from './EmployeeCard';
import { workerStore, Worker } from '@/lib/store/workerStore';

interface WorkerSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (worker: Worker) => void;
  siteId: string;
  title?: string;
  subtitle?: string;
  selectedWorkerIds?: string[];
}

export const WorkerSelectModal: React.FC<WorkerSelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  siteId,
  title = '직원 선택',
  subtitle = '등록된 직원을 선택하세요',
  selectedWorkerIds = [],
}) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 직원 목록 로드
  useEffect(() => {
    if (isOpen) {
      const data = workerStore.getWorkers(siteId);
      setWorkers(data);
      setSearchQuery('');
    }
  }, [isOpen, siteId]);

  // 검색 필터링
  const filteredWorkers = workers.filter((worker) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      worker.name.toLowerCase().includes(query) ||
      worker.phone?.toLowerCase().includes(query) ||
      worker.company?.toLowerCase().includes(query) ||
      worker.trade?.toLowerCase().includes(query) ||
      worker.role?.toLowerCase().includes(query)
    );
  });

  const handleSelectWorker = (worker: Worker) => {
    onSelect(worker);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
    >
      <div className="space-y-4">
        {/* 설명 */}
        <p className="text-sm text-text-muted">{subtitle}</p>

        {/* 검색 바 */}
        {workers.length > 0 && (
          <Input
            placeholder="이름, 연락처, 업체로 검색..."
            value={searchQuery}
            onChange={setSearchQuery}
            icon={<Search className="w-4 h-4" />}
          />
        )}

        {/* 직원 목록 */}
        <div className="max-h-[400px] overflow-y-auto">
          {filteredWorkers.length > 0 ? (
            <div className="space-y-2">
              {filteredWorkers.map((worker) => (
                <EmployeeCard
                  key={worker.id}
                  worker={worker}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onClick={handleSelectWorker}
                  selectable
                  selected={selectedWorkerIds.includes(worker.id)}
                />
              ))}
            </div>
          ) : workers.length > 0 ? (
            // 검색 결과 없음
            <div className="text-center py-8 text-text-muted">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">검색 결과가 없습니다</p>
            </div>
          ) : (
            // 등록된 직원 없음
            <EmptyState
              icon={<Users className="w-10 h-10" />}
              title="등록된 직원이 없습니다"
              description="직원 관리에서 직원을 먼저 등록하세요"
            />
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end pt-2 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </Modal>
  );
};
