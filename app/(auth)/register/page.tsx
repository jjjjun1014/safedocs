'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import { formatBusinessNumber, formatPhoneNumber } from '@/lib/utils/format';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessNumber: '',
    phone: '',
    companyName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // 이미 프로필이 완성된 경우 대시보드로 이동
      // TODO: 실제 프로필 체크 로직 추가
      
      // 구글 로그인에서 가져온 이름으로 초기화
      if (session.user.user_metadata?.full_name) {
        setFormData(prev => ({
          ...prev,
          name: session.user.user_metadata?.full_name || '',
        }));
      }
      
      setLoading(false);
    };

    checkSession();
  }, [router, supabase]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!formData.businessNumber.replace(/\D/g, '').match(/^\d{10}$/)) {
      newErrors.businessNumber = '올바른 사업자등록번호를 입력해주세요 (10자리)';
    }

    if (!formData.phone.replace(/\D/g, '').match(/^\d{10,11}$/)) {
      newErrors.phone = '올바른 연락처를 입력해주세요';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = '회사명을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      // TODO: Supabase users 테이블 업데이트
      // 현재는 localStorage에 임시 저장
      localStorage.setItem('safedocs_profile', JSON.stringify(formData));
      
      router.push('/dashboard');
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      setErrors({ submit: '프로필 저장에 실패했습니다. 다시 시도해주세요.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string) => (value: string) => {
    let formattedValue = value;

    // 자동 포맷팅
    if (field === 'businessNumber') {
      formattedValue = formatBusinessNumber(value);
    } else if (field === 'phone') {
      formattedValue = formatPhoneNumber(value);
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // 에러 초기화
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* 헤더 */}
      <header className="bg-surface border-b border-border py-4 px-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg text-white">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-primary">SafeDocs</span>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md" padding="lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              회원정보 입력
            </h1>
            <p className="text-sm text-text-secondary">
              서비스 이용을 위해 사업자 정보를 입력해주세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="이름"
              placeholder="홍길동"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={errors.name}
              required
            />

            <Input
              label="사업자등록번호"
              placeholder="000-00-00000"
              value={formData.businessNumber}
              onChange={handleInputChange('businessNumber')}
              error={errors.businessNumber}
              required
            />

            <Input
              label="연락처"
              type="tel"
              placeholder="010-0000-0000"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              error={errors.phone}
              required
            />

            <Input
              label="회사명"
              placeholder="(주)건설회사"
              value={formData.companyName}
              onChange={handleInputChange('companyName')}
              error={errors.companyName}
              required
            />

            {errors.submit && (
              <p className="text-sm text-danger text-center">{errors.submit}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={submitting}
              className="mt-6"
            >
              시작하기
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
