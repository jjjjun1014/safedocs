'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Settings, Building2, FileText } from 'lucide-react';
import {
  PageHeader,
  Button,
  Card,
  Badge,
  Modal,
  Input,
  EmptyState,
} from '@/components/ui';
import type { Site } from '@/types';

// Mock 데이터
const MOCK_SITES: Site[] = [
  {
    id: '1',
    name: '강남역 오피스텔 신축공사',
    constructionName: '강남역 3번 출구 오피스텔 신축공사',
    clientName: '강남개발(주)',
    startDate: '2024-01-15',
    address: '서울특별시 강남구 역삼동 123-45',
  },
  {
    id: '2',
    name: '판교 데이터센터 건립공사',
    constructionName: '판교테크노밸리 데이터센터 건립공사',
    clientName: '테크노밸리(주)',
    startDate: '2024-03-01',
    address: '경기도 성남시 분당구 판교동 456-78',
  },
];

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>(MOCK_SITES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSite, setNewSite] = useState({
    name: '',
    constructionName: '',
    clientName: '',
    startDate: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string) => (value: string) => {
    setNewSite(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newSite.name.trim()) {
      newErrors.name = '현장명을 입력해주세요';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const site: Site = {
      id: `site_${Date.now()}`,
      ...newSite,
    };

    setSites(prev => [site, ...prev]);
    setIsModalOpen(false);
    setNewSite({
      name: '',
      constructionName: '',
      clientName: '',
      startDate: '',
      address: '',
    });
  };

  return (
    <div>
      <PageHeader
        title="현장 관리"
        subtitle="등록된 현장 목록을 관리합니다"
        actions={
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            현장 추가
          </Button>
        }
      />

      {sites.length === 0 ? (
        <EmptyState
          icon="building"
          title="등록된 현장이 없습니다"
          description="새 현장을 추가하여 서류 관리를 시작하세요"
          action={
            <Button
              variant="primary"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              첫 현장 추가하기
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {sites.map((site) => (
            <Card key={site.id} padding="md" className="hover:bg-surface-2 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <Link
                      href={`/sites/${site.id}`}
                      className="text-lg font-semibold text-text-primary hover:text-primary truncate"
                    >
                      {site.name}
                    </Link>
                  </div>
                  
                  {site.constructionName && (
                    <p className="text-sm text-text-secondary mb-2 truncate">
                      {site.constructionName}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    {site.clientName && <span>발주처: {site.clientName}</span>}
                    {site.startDate && <span>착공일: {site.startDate}</span>}
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="info" size="sm">
                      <FileText className="h-3 w-3 mr-1" />
                      서류 12건
                    </Badge>
                  </div>
                </div>

                <Link
                  href={`/sites/${site.id}/settings`}
                  className="p-2 rounded-md hover:bg-surface-2 transition-colors"
                >
                  <Settings className="h-5 w-5 text-text-muted" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 현장 추가 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="새 현장 추가"
        size="md"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              추가
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="현장명"
            placeholder="강남역 오피스텔 신축공사"
            value={newSite.name}
            onChange={handleInputChange('name')}
            error={errors.name}
            required
          />
          
          <Input
            label="공사명"
            placeholder="강남역 3번 출구 오피스텔 신축공사"
            value={newSite.constructionName}
            onChange={handleInputChange('constructionName')}
          />
          
          <Input
            label="발주처"
            placeholder="(주)건설회사"
            value={newSite.clientName}
            onChange={handleInputChange('clientName')}
          />
          
          <Input
            label="착공일"
            type="date"
            value={newSite.startDate}
            onChange={handleInputChange('startDate')}
          />
          
          <Input
            label="현장주소"
            placeholder="서울특별시 강남구 역삼동 123-45"
            value={newSite.address}
            onChange={handleInputChange('address')}
          />
        </form>
      </Modal>
    </div>
  );
}
