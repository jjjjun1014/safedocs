'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FilePlus, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: Home, label: '홈' },
  { href: '/documents/new', icon: FilePlus, label: '작성', highlight: true },
  { href: '/documents', icon: FileText, label: '서류' },
  { href: '/settings', icon: Settings, label: '설정' },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[64px] bg-surface border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' &&
              item.href !== '/documents' &&
              pathname?.startsWith(item.href)) ||
            (item.href === '/documents' &&
              pathname?.startsWith('/documents') &&
              !pathname?.startsWith('/documents/new'));

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-0.5 -mt-4"
              >
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-[10px] font-medium text-primary">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 min-w-[60px] min-h-[48px]',
                isActive ? 'text-primary' : 'text-text-muted'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
