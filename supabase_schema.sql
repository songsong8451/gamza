-- ========================================================
-- 감자(Gamza) 마켓 Supabase 데이터베이스 스키마
-- 개인식별정보(PII: 실명, 주민번호, 연락처, 상세주소) 배제
-- ========================================================

-- 1. 기본 테이블 생성

-- 2. 프로필 (익명 사용자 / 닉네임 기반)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(50) NOT NULL,
  avatar_url TEXT,
  region_name VARCHAR(50) NOT NULL DEFAULT '서울시 마포구 연남동',
  is_verified BOOLEAN DEFAULT true,
  manner_temp NUMERIC(4, 1) DEFAULT 99.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 상품 (중고 물품 게시글)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title VARCHAR(100) NOT NULL,
  category VARCHAR(30) NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  is_free_share BOOLEAN DEFAULT false,
  location VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT '판매중',
  image_url TEXT,
  description TEXT,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 관심 상품 (좋아요 / 찜)
CREATE TABLE IF NOT EXISTS public.product_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- 5. 채팅방 및 메시지
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  message_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 추가 (조회 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_likes_product_id ON public.product_likes(product_id);

-- RLS (Row Level Security) 설정
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 정책 생성 (익명/공개 접근 허용)
DO $$
BEGIN
  -- Profiles 정책
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on profiles') THEN
    CREATE POLICY "Allow public select on profiles" ON public.profiles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on profiles') THEN
    CREATE POLICY "Allow public insert on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update on profiles') THEN
    CREATE POLICY "Allow public update on profiles" ON public.profiles FOR UPDATE USING (true);
  END IF;

  -- Products 정책
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on products') THEN
    CREATE POLICY "Allow public select on products" ON public.products FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on products') THEN
    CREATE POLICY "Allow public insert on products" ON public.products FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update on products') THEN
    CREATE POLICY "Allow public update on products" ON public.products FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public delete on products') THEN
    CREATE POLICY "Allow public delete on products" ON public.products FOR DELETE USING (true);
  END IF;

  -- Product Likes 정책
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on product_likes') THEN
    CREATE POLICY "Allow public select on product_likes" ON public.product_likes FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on product_likes') THEN
    CREATE POLICY "Allow public insert on product_likes" ON public.product_likes FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public delete on product_likes') THEN
    CREATE POLICY "Allow public delete on product_likes" ON public.product_likes FOR DELETE USING (true);
  END IF;

  -- Chat Rooms 정책
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on chat_rooms') THEN
    CREATE POLICY "Allow public select on chat_rooms" ON public.chat_rooms FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on chat_rooms') THEN
    CREATE POLICY "Allow public insert on chat_rooms" ON public.chat_rooms FOR INSERT WITH CHECK (true);
  END IF;

  -- Chat Messages 정책
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public select on chat_messages') THEN
    CREATE POLICY "Allow public select on chat_messages" ON public.chat_messages FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public insert on chat_messages') THEN
    CREATE POLICY "Allow public insert on chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
  END IF;
END $$;
