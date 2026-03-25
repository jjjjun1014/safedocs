'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  FilePlus,
  Building2,
  Settings,
  ShieldAlert,
  FileSearch,
  LogOut,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SiteSelector } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import type { Site } from '@/types';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const MOCK_SITES: Site[] = [
  { id: '1', name: '강남역 오피스텔 신축공사' },
  { id: '2', name: '판교 데이터센터 건립공사' },
];

interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedSiteId, setSelectedSiteId] = useState('1');
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', icon: Home, label: '대시보드' },
    { href: '/documents/new', icon: FilePlus, label: '새 서류 작성' },
    { href: '/sites', icon: Building2, label: '현장 관리' },
    { href: '/inspection', icon: FileSearch, label: '감독 대응 모드' },
    { href: '/settings', icon: Settings, label: '설정' },
  ];

  const mobileNavItems = [
    { href: '/dashboard', icon: Home, label: '홈' },
    { href: '/documents/new', icon: FilePlus, label: '작성', highlight: true },
    { href: '/sites', icon: Building2, label: '현장' },
    { href: '/settings', icon: Settings, label: '설정' },
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] bg-surface border-r border-border h-screen sticky top-0">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 mb-8">
            <div className="bg-primary p-2 rounded-lg text-white">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">
              SafeDocs
            </span>
          </Link>

          <div className="mb-6">
            <SiteSelector
              sites={MOCK_SITES}
              selectedSiteId={selectedSiteId}
              onSelect={setSelectedSiteId}
            />
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
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

        <div className="mt-auto p-6 border-t border-border">
          {/* User Info */}
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
                <p className="text-xs text-text-muted truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <div className="bg-surface-2 p-4 rounded-lg mb-3">
            <p className="text-sm font-medium text-text-primary mb-1">
              Pro 플랜
            </p>
            <p className="text-xs text-text-secondary mb-3">서류 생성 무제한</p>
            <Link
              href="/settings"
              className="text-xs font-semibold text-primary hover:underline"
            >
              플랜 관리
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:text-error hover:bg-surface-2 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen pb-[64px] md:pb-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-surface border-b border-border h-[60px] flex items-center justify-between px-4 sticky top-0 z-30">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-md text-white">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-primary tracking-tight">
              SafeDocs
            </span>
          </Link>
          <SiteSelector
            sites={MOCK_SITES}
            selectedSiteId={selectedSiteId}
            onSelect={setSelectedSiteId}
          />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-surface border-t border-border flex items-center justify-around px-2 z-40 pb-safe">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-text-muted hover:text-text-secondary',
                item.highlight && 'text-primary'
              )}
            >
              {item.highlight ? (
                <div className="bg-primary text-white p-2 rounded-full -mt-6 shadow-md border-4 border-bg">
                  <item.icon className="h-6 w-6" />
                </div>
              ) : (
                <item.icon className="h-6 w-6" />
              )}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
