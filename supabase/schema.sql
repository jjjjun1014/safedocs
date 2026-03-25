-- SafeDocs Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/rajuurdisncgtmuxwwfh/sql

-- ============================================================
-- 1. PROFILES (확장 유저 정보 - auth.users와 연동)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  business_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 새 유저 가입 시 profiles 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. SITES (현장)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. SITE_MEMBERS (현장 멤버 - 다대다 관계)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, user_id)
);

-- ============================================================
-- 4. SITE_DEFAULTS (현장 기본 설정)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_defaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL UNIQUE,
  favorite_trades TEXT[] DEFAULT '{}',
  default_author TEXT,
  default_subcontractor TEXT,
  safety_officer_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. DOCUMENTS (문서)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('tbm', 'risk', 'education', 'workplan')),
  title TEXT NOT NULL,
  trade TEXT NOT NULL,
  author TEXT,
  date DATE DEFAULT CURRENT_DATE,
  content JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed')),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. SUBSCRIPTIONS (구독 플랜)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'standard', 'pro')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'expired')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS (Row Level Security) 정책
-- ============================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_defaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: 본인만 조회/수정 가능
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Sites: 멤버만 조회 가능, 소유자만 수정/삭제 가능
CREATE POLICY "Site members can view sites"
  ON public.sites FOR SELECT
  USING (
    id IN (
      SELECT site_id FROM public.site_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Site owners can insert sites"
  ON public.sites FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Site owners can update sites"
  ON public.sites FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Site owners can delete sites"
  ON public.sites FOR DELETE
  USING (owner_id = auth.uid());

-- Site Members: 본인이 속한 현장의 멤버만 조회 가능
CREATE POLICY "Users can view site members for their sites"
  ON public.site_members FOR SELECT
  USING (
    site_id IN (
      SELECT site_id FROM public.site_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Site admins can manage members"
  ON public.site_members FOR ALL
  USING (
    site_id IN (
      SELECT site_id FROM public.site_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Site Defaults: 현장 멤버만 조회/수정 가능
CREATE POLICY "Site members can view defaults"
  ON public.site_defaults FOR SELECT
  USING (
    site_id IN (
      SELECT site_id FROM public.site_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Site admins can manage defaults"
  ON public.site_defaults FOR ALL
  USING (
    site_id IN (
      SELECT site_id FROM public.site_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Documents: 현장 멤버만 조회/생성/수정 가능
CREATE POLICY "Site members can view documents"
  ON public.documents FOR SELECT
  USING (
    site_id IN (
      SELECT site_id FROM public.site_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Site members can create documents"
  ON public.documents FOR INSERT
  WITH CHECK (
    site_id IN (
      SELECT site_id FROM public.site_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Site members can update documents"
  ON public.documents FOR UPDATE
  USING (
    site_id IN (
      SELECT site_id FROM public.site_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Site members can delete documents"
  ON public.documents FOR DELETE
  USING (
    site_id IN (
      SELECT site_id FROM public.site_members WHERE user_id = auth.uid()
    )
  );

-- Subscriptions: 본인만 조회 가능
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================
-- 인덱스
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_sites_owner ON public.sites(owner_id);
CREATE INDEX IF NOT EXISTS idx_site_members_user ON public.site_members(user_id);
CREATE INDEX IF NOT EXISTS idx_site_members_site ON public.site_members(site_id);
CREATE INDEX IF NOT EXISTS idx_documents_site ON public.documents(site_id);
CREATE INDEX IF NOT EXISTS idx_documents_date ON public.documents(date DESC);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.documents(type);

-- ============================================================
-- Updated_at 자동 갱신 트리거
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.sites
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.site_defaults
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
