'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, ImageUploader } from '@/components/ui';
import { Save } from 'lucide-react';
import type { Worker } from '@/lib/store/workerStore';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (worker: Omit<Worker, 'id' | 'createdAt' | 'updatedAt'>) => void;
  existingWorker?: Worker | null;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingWorker,
}) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    role: '',
    trade: '',
    company: '',
    photos: [] as string[],
  });

  // 기존 직원 정보로 폼 초기화
  useEffect(() => {
    if (isOpen && existingWorker) {
      setForm({
        name: existingWorker.name || '',
        phone: existingWorker.phone || '',
        role: existingWorker.role || '',
        trade: existingWorker.trade || '',
        company: existingWorker.company || '',
        photos: existingWorker.photos || [],
      });
    } else if (isOpen) {
      // 새 직원 등록 시 폼 초기화
      setForm({
        name: '',
        phone: '',
        role: '',
        trade: '',
        company: '',
        photos: [],
      });
    }
  }, [isOpen, existingWorker]);

  const handleSubmit = () => {
    if (!form.name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    onSave({
      name: form.name.trim(),
      phone: form.phone.trim(),
      role: form.role.trim(),
      trade: form.trade.trim(),
      company: form.company.trim(),
      photos: form.photos,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingWorker ? '직원 정보 수정' : '직원 등록'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSubmit} icon={<Save className="w-4 h-4" />}>
            {existingWorker ? '수정' : '등록'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* 기본 정보 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="이름"
            value={form.name}
            onChange={(value) => setForm(prev => ({ ...prev, name: value }))}
            placeholder="홍길동"
            required
          />
          <Input
            label="연락처"
            value={form.phone}
            onChange={(value) => setForm(prev => ({ ...prev, phone: value }))}
            placeholder="010-1234-5678"
            type="tel"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="직책"
            value={form.role}
            onChange={(value) => setForm(prev => ({ ...prev, role: value }))}
            placeholder="반장, 기공, 조공 등"
          />
          <Input
            label="공종"
            value={form.trade}
            onChange={(value) => setForm(prev => ({ ...prev, trade: value }))}
            placeholder="전기, 배관, 용접 등"
          />
          <Input
            label="소속 업체"
            value={form.company}
            onChange={(value) => setForm(prev => ({ ...prev, company: value }))}
            placeholder="OO건설"
          />
        </div>

        {/* 사진 첨부 */}
        <ImageUploader
          images={form.photos}
          onChange={(photos) => setForm(prev => ({ ...prev, photos }))}
          maxImages={5}
          maxSizeKB={500}
        />
      </div>
    </Modal>
  );
};
