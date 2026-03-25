'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  GraduationCap,
  ClipboardList,
  ChevronRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Card, Button, Badge, PageHeader } from '@/components/ui';
import { DOC_TYPES } from '@/lib/constants/docTypes';

// 임시 데이터
const recentDocs = [
  {
    id: '1',
    type: 'tbm' as const,
    title: '철근공 TBM',
    date: '2024-01-15',
    status: 'completed' as const,
  },
  {
    id: '2',
    type: 'risk' as const,
    title: '콘크리트공 위험성평가',
    date: '2024-01-15',
    status: 'completed' as const,
  },
  {
    id: '3',
    type: 'education' as const,
    title: '신규자 안전교육',
    date: '2024-01-14',
    status: 'draft' as const,
  },
];

const quickStats = [
  { label: '이번 주 작성', value: 12, icon: FileText },
  { label: '오늘 작성', value: 3, icon: Calendar },
  { label: '대기 중', value: 2, icon: Clock },
];

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="대시보드"
        description={today}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="p-3 text-center">
            <stat.icon className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            <p className="text-xs text-text-secondary">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold text-text-primary mb-3">
          빠른 문서 작성
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(DOC_TYPES).map(([key, doc]) => {
            const Icon = doc.icon;
            return (
              <Link
                key={key}
                href={`/documents/new?type=${key}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-surface-2 transition-colors"
              >
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `var(--color-${doc.color}-subtle)` }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: `var(--color-${doc.color})` }}
                  />
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {doc.label}
                </span>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Recent Documents */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary">
            최근 작성 문서
          </h2>
          <Link
            href="/documents"
            className="text-sm text-primary flex items-center gap-1"
          >
            전체 보기
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-2">
          {recentDocs.map((doc) => {
            const docType = DOC_TYPES[doc.type];
            const Icon = docType.icon;
            return (
              <Card
                key={doc.id}
                className="p-3 flex items-center gap-3"
              >
                <div
                  className="p-2 rounded-lg shrink-0"
                  style={{ backgroundColor: `var(--color-${docType.color}-subtle)` }}
                >
                  <Icon
                    className="h-4 w-4"
                    style={{ color: `var(--color-${docType.color})` }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {doc.title}
                  </p>
                  <p className="text-xs text-text-secondary">{doc.date}</p>
                </div>
                {doc.status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                ) : (
                  <Clock className="h-5 w-5 text-warning shrink-0" />
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Floating Action Button */}
      <Link
        href="/documents/new"
        className="fixed bottom-[calc(var(--nav-height)+1rem)] right-4 z-40 flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover transition-colors md:hidden"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}
