'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setIsLoading('google');
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleKakaoLogin = async () => {
    setIsLoading('kakao');
    // TODO: Supabase에서 Kakao provider 설정 필요
    alert('카카오 로그인은 준비 중입니다.');
    setIsLoading(null);
  };

  const handleNaverLogin = async () => {
    setIsLoading('naver');
    // TODO: Supabase에서 Naver provider 설정 필요
    alert('네이버 로그인은 준비 중입니다.');
    setIsLoading(null);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-primary p-3 rounded-xl text-white mb-4">
            <ShieldAlert className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold text-primary">SafeDocs</h1>
          <p className="text-text-secondary mt-2">건설현장 안전서류 자동화</p>
        </div>

        {/* Social Login Buttons */}
        <div className="flex flex-col gap-3">
          {/* Kakao Login */}
          <button
            type="button"
            onClick={handleKakaoLogin}
            disabled={isLoading !== null}
            className="w-full h-14 flex items-center justify-center gap-3 rounded-lg font-medium text-base transition-colors disabled:opacity-50"
            style={{
              backgroundColor: 'var(--color-kakao)',
              color: 'var(--color-kakao-text)',
            }}
          >
            {isLoading === 'kakao' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3C6.477 3 2 6.463 2 10.731c0 2.746 1.834 5.157 4.591 6.521-.142.466-.917 3.002-.947 3.195 0 0-.019.156.082.215.101.06.22.013.22.013.29-.039 3.352-2.19 3.886-2.568.699.099 1.422.152 2.168.152 5.523 0 10-3.463 10-7.731S17.523 3 12 3" />
              </svg>
            )}
            카카오로 시작하기
          </button>

          {/* Naver Login */}
          <button
            type="button"
            onClick={handleNaverLogin}
            disabled={isLoading !== null}
            className="w-full h-14 flex items-center justify-center gap-3 rounded-lg font-medium text-base text-white transition-colors hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-naver)' }}
          >
            {isLoading === 'naver' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z" />
              </svg>
            )}
            네이버로 시작하기
          </button>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading !== null}
            className="w-full h-14 flex items-center justify-center gap-3 rounded-lg font-medium text-base border border-border bg-surface text-text-primary transition-colors hover:bg-surface-2 disabled:opacity-50"
          >
            {isLoading === 'google' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            구글로 시작하기
          </button>
        </div>

        {/* Terms & Privacy */}
        <p className="text-center text-sm text-text-muted mt-8">
          로그인 시{' '}
          <Link href="/terms" className="text-primary hover:underline">
            서비스 이용약관
          </Link>
          {' 및 '}
          <Link href="/privacy" className="text-primary hover:underline">
            개인정보처리방침
          </Link>
          에 동의하게 됩니다.
        </p>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
