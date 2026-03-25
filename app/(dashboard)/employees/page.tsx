'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { PageHeader, Button, Input, EmptyState } from '@/components/ui';
import { EmployeeCard, EmployeeFormModal } from '@/components/employees';
import { workerStore, Worker } from '@/lib/store/workerStore';

// 임시 현장 ID (추후 context 또는 URL 파라미터로 대체)
const SITE_ID = '1';

export default function EmployeesPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 직원 목록 로드
  const loadWorkers = () => {
    const data = workerStore.getWorkers(SITE_ID);
    setWorkers(data);
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  // 직원 저장 (추가/수정)
  const handleSaveWorker = (workerData: Omit<Worker, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingWorker) {
      // 수정
      workerStore.updateWorker(SITE_ID, editingWorker.id, workerData);
    } else {
      // 추가
      workerStore.addWorker(SITE_ID, workerData);
    }
    loadWorkers();
    setEditingWorker(null);
  };

  // 직원 삭제
  const handleDeleteWorker = (worker: Worker) => {
    workerStore.deleteWorker(SITE_ID, worker.id);
    loadWorkers();
  };

  // 직원 수정 모달 열기
  const handleEditWorker = (worker: Worker) => {
    setEditingWorker(worker);
    setIsModalOpen(true);
  };

  // 새 직원 추가 모달 열기
  const handleAddNew = () => {
    setEditingWorker(null);
    setIsModalOpen(true);
  };

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

  return (
    <>
      <PageHeader
        title="직원 관리"
        subtitle="현장 작업자 정보를 등록하고 관리합니다"
        actions={
          <Button onClick={handleAddNew} icon={<Plus className="w-4 h-4" />}>
            직원 등록
          </Button>
        }
      />

      {/* 검색 바 */}
      {workers.length > 0 && (
        <div className="mb-6">
          <Input
            placeholder="이름, 연락처, 업체, 공종으로 검색..."
            value={searchQuery}
            onChange={setSearchQuery}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      )}

      {/* 직원 목록 */}
      {filteredWorkers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkers.map((worker) => (
            <EmployeeCard
              key={worker.id}
              worker={worker}
              onEdit={handleEditWorker}
              onDelete={handleDeleteWorker}
            />
          ))}
        </div>
      ) : workers.length > 0 ? (
        // 검색 결과 없음
        <div className="text-center py-12 text-text-muted">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>검색 결과가 없습니다</p>
        </div>
      ) : (
        // 등록된 직원 없음
        <EmptyState
          icon={<Users className="w-12 h-12" />}
          title="등록된 직원이 없습니다"
          description="직원을 등록하여 서류 작성 시 빠르게 선택할 수 있습니다"
          action={
            <Button onClick={handleAddNew} icon={<Plus className="w-4 h-4" />}>
              첫 직원 등록하기
            </Button>
          }
        />
      )}

      {/* 직원 등록/수정 모달 */}
      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingWorker(null);
        }}
        onSave={handleSaveWorker}
        existingWorker={editingWorker}
      />
    </>
  );
}
