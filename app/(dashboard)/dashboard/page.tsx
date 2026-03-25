'use client';

import { useState, useEffect } from 'react';
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
  AlertCircle,
} from 'lucide-react';
import { Card, Button, Badge, PageHeader, EmptyState } from '@/components/ui';
import { DOC_TYPES } from '@/lib/constants/docTypes';
import { documentStore, type StoredDocument } from '@/lib/store/documentStore';

export default function DashboardPage() {
  const [recentDocs, setRecentDocs] = useState<StoredDocument[]>([]);
  const [todayDocs, setTodayDocs] = useState<StoredDocument[]>([]);
  const [weekDocs, setWeekDocs] = useState<StoredDocument[]>([]);

  useEffect(() => {
    const allDocs = documentStore.getAll();
    setRecentDocs(documentStore.getRecent(5));

    const todayStr = new Date().toISOString().split('T')[0];
    setTodayDocs(allDocs.filter((d) => d.workDate === todayStr));

    // 이번 주 문서
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    setWeekDocs(allDocs.filter((d) => new Date(d.createdAt) >= weekStart));
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const dailyDocTypes = ['tbm', 'education'] as const;
  const missingDailyDocs = dailyDocTypes.filter(
    (type) => !todayDocs.some((d) => d.docType === type)
  );

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const stats = [
    { label: '이번 주 작성', value: weekDocs.length, icon: FileText },
    { label: '오늘 작성', value: todayDocs.length, icon: Calendar },
    { label: '미작성', value: missingDailyDocs.length, icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="대시보드"
        subtitle={today}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-3 text-center">
            <stat.icon className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            <p className="text-xs text-text-secondary">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* 미작성 일일 문서 알림 */}
      {missingDailyDocs.length > 0 && (
        <Card className="p-4 border-warning border">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-text-primary mb-2">오늘 미작성 서류</h3>
              <div className="flex flex-wrap gap-2">
                {missingDailyDocs.map((type) => {
                  const docType = DOC_TYPES[type];
                  return (
                    <Link key={type} href={`/documents/new?type=${type}`}>
                      <Badge variant="warning" className="cursor-pointer hover:opacity-80">
                        {docType.label} 작성하기
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold text-text-primary mb-3">
          빠른 문서 작성
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(DOC_TYPES).map(([key, doc]) => {
            const Icon = doc.icon;
            const bgColorClass = {
              primary: 'bg-primary-light',
              warning: 'bg-warning-light',
              success: 'bg-success-light',
              danger: 'bg-danger-light',
            }[doc.color] || 'bg-primary-light';
            const textColorClass = {
              primary: 'text-primary',
              warning: 'text-warning',
              success: 'text-success',
              danger: 'text-danger',
            }[doc.color] || 'text-primary';
            
            return (
              <Link
                key={key}
                href={`/documents/new?type=${key}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-surface-2 transition-colors"
              >
                <div className={`p-2 rounded-lg ${bgColorClass}`}>
                  <Icon className={`h-5 w-5 ${textColorClass}`} />
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
        {recentDocs.length === 0 ? (
          <Card className="p-6">
            <EmptyState
              icon="file"
              title="아직 작성된 문서가 없습니다"
              description="위의 빠른 문서 작성 버튼으로 첫 문서를 만들어보세요."
            />
          </Card>
        ) : (
          <div className="space-y-2">
            {recentDocs.map((doc) => {
              const docType = DOC_TYPES[doc.docType];
              const Icon = docType.icon;
              const bgColorClass = {
                primary: 'bg-primary-light',
                warning: 'bg-warning-light',
                success: 'bg-success-light',
                danger: 'bg-danger-light',
              }[docType.color] || 'bg-primary-light';
              const textColorClass = {
                primary: 'text-primary',
                warning: 'text-warning',
                success: 'text-success',
                danger: 'text-danger',
              }[docType.color] || 'text-primary';
              
              return (
                <Link key={doc.id} href={`/documents/${doc.id}`}>
                  <Card className="p-3 flex items-center gap-3 hover:bg-surface-2 transition-colors">
                    <div className={`p-2 rounded-lg shrink-0 ${bgColorClass}`}>
                      <Icon className={`h-4 w-4 ${textColorClass}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {doc.tradeName} {docType.label}
                      </p>
                      <p className="text-xs text-text-secondary">{doc.workDate}</p>
                    </div>
                    {doc.status === 'complete' ? (
                      <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                    ) : (
                      <Clock className="h-5 w-5 text-warning shrink-0" />
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
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
