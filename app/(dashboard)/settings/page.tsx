'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Building2,
  Phone,
  Bell,
  CreditCard,
  LogOut,
  ChevronRight,
  Shield,
} from 'lucide-react';
import {
  PageHeader,
  Button,
  Card,
  Badge,
  Modal,
  Input,
} from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  
  // 알림 설정 상태
  const [notifications, setNotifications] = useState({
    expireAlert: true,
    inspectionReminder: true,
  });
  
  // 프로필 수정 폼
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    companyName: '',
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // 로컬 스토리지에서 프로필 정보 가져오기
        const storedProfile = localStorage.getItem('safedocs_profile');
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          setProfileForm({
            name: profile.name || user.user_metadata?.full_name || '',
            phone: profile.phone || '',
            companyName: profile.companyName || '',
          });
        } else {
          setProfileForm(prev => ({
            ...prev,
            name: user.user_metadata?.full_name || '',
          }));
        }
      }
      
      setLoading(false);
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleSaveProfile = () => {
    // 프로필 저장 (로컬 스토리지)
    const currentProfile = localStorage.getItem('safedocs_profile');
    const profile = currentProfile ? JSON.parse(currentProfile) : {};
    
    localStorage.setItem('safedocs_profile', JSON.stringify({
      ...profile,
      ...profileForm,
    }));
    
    setProfileModalOpen(false);
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="설정" />

      {/* 프로필 카드 */}
      <Card padding="md" className="mb-4">
        <div className="flex items-center gap-4 mb-4">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="프로필"
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {(profileForm.name || user?.email || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-text-primary">
              {profileForm.name || '이름 없음'}
            </h2>
            <p className="text-sm text-text-secondary">{user?.email}</p>
            {profileForm.companyName && (
              <p className="text-sm text-text-muted">{profileForm.companyName}</p>
            )}
          </div>
        </div>
        
        <Button
          variant="secondary"
          fullWidth
          onClick={() => setProfileModalOpen(true)}
        >
          프로필 수정
        </Button>
      </Card>

      {/* 구독 카드 */}
      <Card padding="md" className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-light">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-primary">구독 플랜</h3>
              <p className="text-xs text-text-muted">현재 플랜 정보</p>
            </div>
          </div>
          <Badge variant="info">Pro</Badge>
        </div>
        
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-text-secondary">만료일</span>
            <span className="text-text-primary">2025년 3월 25일</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">등록 현장</span>
            <span className="text-text-primary">2 / 무제한</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">생성 서류</span>
            <span className="text-text-primary">24 / 무제한</span>
          </div>
        </div>
        
        <Button variant="outline" fullWidth>
          플랜 변경
        </Button>
      </Card>

      {/* 알림 설정 */}
      <Card padding="md" className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-warning-light">
            <Bell className="h-5 w-5 text-warning" />
          </div>
          <h3 className="text-sm font-medium text-text-primary">알림 설정</h3>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-text-secondary">보관 만료 알림</span>
            <button
              type="button"
              onClick={() => handleToggleNotification('expireAlert')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.expireAlert ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notifications.expireAlert ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </label>
          
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-text-secondary">점검 리마인더</span>
            <button
              type="button"
              onClick={() => handleToggleNotification('inspectionReminder')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.inspectionReminder ? 'bg-primary' : 'bg-border'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notifications.inspectionReminder ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </label>
        </div>
      </Card>

      {/* 로그아웃 */}
      <Button
        variant="danger"
        fullWidth
        icon={<LogOut className="h-4 w-4" />}
        onClick={() => setLogoutModalOpen(true)}
        className="mb-4"
      >
        로그아웃
      </Button>

      {/* 회원탈퇴 */}
      <div className="text-center">
        <button className="text-sm text-danger hover:underline">
          회원탈퇴
        </button>
      </div>

      {/* 프로필 수정 모달 */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="프로필 수정"
        size="md"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setProfileModalOpen(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={handleSaveProfile}>
              저장
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="이름"
            value={profileForm.name}
            onChange={(value) => setProfileForm(prev => ({ ...prev, name: value }))}
          />
          <Input
            label="연락처"
            type="tel"
            value={profileForm.phone}
            onChange={(value) => setProfileForm(prev => ({ ...prev, phone: value }))}
          />
          <Input
            label="회사명"
            value={profileForm.companyName}
            onChange={(value) => setProfileForm(prev => ({ ...prev, companyName: value }))}
          />
        </div>
      </Modal>

      {/* 로그아웃 확인 모달 */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="로그아웃"
        size="sm"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setLogoutModalOpen(false)}>
              취소
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        }
      >
        <p className="text-text-secondary">
          정말 로그아웃 하시겠습니까?
        </p>
      </Modal>
    </div>
  );
}
