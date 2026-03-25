'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const router = useRouter();
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

  return (
    <div className="min-h-screen bg-bg print:bg-white print:min-h-0">
      {/* Desktop Sidebar */}
      <div className="print:hidden">
        <Sidebar
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Header */}
      <div className="print:hidden">
        <Header user={user} />
      </div>

      {/* Main Content */}
      <main className="md:ml-[240px] pb-[80px] md:pb-0 print:ml-0 print:pb-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full print:p-0 print:max-w-none">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="print:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

