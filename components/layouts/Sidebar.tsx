'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FilePlus,
  FileText,
  Building2,
  Settings,
  ShieldAlert,
  FileSearch,
  LogOut,
  User,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface SidebarProps {
  user?: SupabaseUser | null;
  onLogout?: () => void;
}

const navItems = [
  { href: '/dashboard', icon: Home, label: '대시보드' },
  { href: '/documents/new', icon: FilePlus, label: '서류 작성' },
  { href: '/documents', icon: FileText, label: '서류 목록' },
  { href: '/employees', icon: Users, label: '직원 관리' },
  { href: '/inspection', icon: FileSearch, label: '감독 대응' },
  { href: '/sites', icon: Building2, label: '현장 관리' },
  { href: '/settings', icon: Settings, label: '설정' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  onLogout,
}) => {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[240px] bg-surface border-r border-border h-screen fixed left-0 top-0">
      {/* 로고 */}
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2 mb-8">
          <div className="bg-primary p-2 rounded-lg text-white">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-primary tracking-tight">
            SafeDocs
          </span>
        </Link>

        {/* 네비게이션 메뉴 */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' &&
                item.href !== '/documents' &&
                pathname?.startsWith(item.href)) ||
              (item.href === '/documents' &&
                pathname?.startsWith('/documents') &&
                !pathname?.startsWith('/documents/new'));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-light text-primary'
                    : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 하단 영역 */}
      <div className="mt-auto p-6 border-t border-border">
        {/* 사용자 정보 */}
        {user && (
          <div className="flex items-center gap-3 mb-4">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="프로필"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-text-muted truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* 플랜 정보 */}
        <div className="bg-surface-2 p-4 rounded-lg mb-3">
          <p className="text-sm font-medium text-text-primary mb-1">Pro 플랜</p>
          <p className="text-xs text-text-secondary mb-3">서류 생성 무제한</p>
          <Link
            href="/settings"
            className="text-xs text-primary hover:underline"
          >
            플랜 관리 →
          </Link>
        </div>

        {/* 로그아웃 */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:text-danger hover:bg-danger-light rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        )}
      </div>
    </aside>
  );
};
