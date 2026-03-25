'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, ShieldAlert, User } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface HeaderProps {
  user?: SupabaseUser | null;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="md:hidden sticky top-0 z-40 h-[60px] bg-surface border-b border-border">
      <div className="flex items-center justify-between h-full px-4">
        {/* 로고 */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-primary tracking-tight">
            SafeDocs
          </span>
        </Link>

        {/* 우측 액션 */}
        <div className="flex items-center gap-2">
          {/* 알림 버튼 */}
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-surface-2 transition-colors relative"
          >
            <Bell className="h-5 w-5 text-text-secondary" />
            {/* 알림 뱃지 */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
          </button>

          {/* 프로필 아이콘 */}
          <Link
            href="/settings"
            className="p-1 rounded-full hover:bg-surface-2 transition-colors"
          >
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="프로필"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
