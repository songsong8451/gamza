-- ========================================================
-- 감자(Gamza) 마켓 초기 Mock 데이터 시드 (supabase_seed.sql)
-- 개인식별정보(PII) 일체 미포함 (가명 닉네임, 동 단위 지역)
-- ========================================================

DO $$
DECLARE
  v_seller_1 UUID;
  v_seller_2 UUID;
  v_seller_3 UUID;
  v_seller_4 UUID;
  v_seller_5 UUID;
  v_seller_6 UUID;
  v_seller_7 UUID;
BEGIN
  -- 1. 판매자 프로필 7명 등록 (가명 닉네임, 아바타, 매너온도)
  INSERT INTO public.profiles (nickname, avatar_url, region_name, is_verified, manner_temp)
  VALUES ('연남사과맨', 'https://api.dicebear.com/7.x/bottts/svg?seed=apple&backgroundColor=fdfbf7', '역삼1동', true, 99.0)
  RETURNING id INTO v_seller_1;

  INSERT INTO public.profiles (nickname, avatar_url, region_name, is_verified, manner_temp)
  VALUES ('우디우드', 'https://api.dicebear.com/7.x/bottts/svg?seed=woody&backgroundColor=fdfbf7', '서초2동', true, 82.5)
  RETURNING id INTO v_seller_2;

  INSERT INTO public.profiles (nickname, avatar_url, region_name, is_verified, manner_temp)
  VALUES ('대치동포근이', 'https://api.dicebear.com/7.x/bottts/svg?seed=jacket&backgroundColor=fdfbf7', '대치1동', true, 91.2)
  RETURNING id INTO v_seller_3;

  INSERT INTO public.profiles (nickname, avatar_url, region_name, is_verified, manner_temp)
  VALUES ('향긋한커피', 'https://api.dicebear.com/7.x/bottts/svg?seed=coffee&backgroundColor=fdfbf7', '양재1동', true, 78.4)
  RETURNING id INTO v_seller_4;

  INSERT INTO public.profiles (nickname, avatar_url, region_name, is_verified, manner_temp)
  VALUES ('코딩감자', 'https://api.dicebear.com/7.x/bottts/svg?seed=cleancode&backgroundColor=fdfbf7', '도곡동', true, 96.0)
  RETURNING id INTO v_seller_5;

  INSERT INTO public.profiles (nickname, avatar_url, region_name, is_verified, manner_temp)
  VALUES ('진짜감자농부', 'https://api.dicebear.com/7.x/bottts/svg?seed=potatoKing&backgroundColor=fdfbf7', '개포2동', true, 99.9)
  RETURNING id INTO v_seller_6;

  INSERT INTO public.profiles (nickname, avatar_url, region_name, is_verified, manner_temp)
  VALUES ('댕냥이행복', 'https://api.dicebear.com/7.x/bottts/svg?seed=petlover&backgroundColor=fdfbf7', '삼성동', true, 88.5)
  RETURNING id INTO v_seller_7;

  -- 2. 초기 상품 7개 등록
  INSERT INTO public.products (seller_id, title, category, price, is_free_share, location, status, image_url, description, like_count, created_at)
  VALUES 
    (
      v_seller_1,
      '아이패드 에어 5세대 64GB WiFi 스타라이트',
      '디지털기기',
      520000,
      false,
      '서울시 강남구 역삼동',
      '판매중',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
      '실사용 6개월 미만이며 케이스와 강화유리를 항상 착용하여 기스 없이 깔끔합니다. 배터리 성능 98%이고 충전기, 박스 등 풀박스 구성품 모두 보관 중입니다. 네고 문의는 정중히 사양하며 역삼역 인근 직거래 선호합니다.',
      14,
      NOW() - INTERVAL '15 minutes'
    ),
    (
      v_seller_2,
      '원목 2단 협탁 / 미니 사이드 테이블 (감성 인테리어)',
      '가구/인테리어',
      28000,
      false,
      '서울시 서초구 서초2동',
      '예약중',
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&auto=format&fit=crop&q=80',
      '자작나무 원목으로 제작된 따뜻한 감성의 2단 협탁입니다. 침대 옆이나 소파 옆에 두기 딱 좋은 아담한 사이즈입니다. 이사를 가게 되어 아쉽지만 급처합니다. 차량으로 가져가시는 것을 추천합니다.',
      7,
      NOW() - INTERVAL '42 minutes'
    ),
    (
      v_seller_3,
      '파타고니아 레트로X 클래식 플리스 자켓 M',
      '의류',
      115000,
      false,
      '서울시 강남구 대치1동',
      '판매중',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
      '국내 백화점 정품 매장에서 구입했습니다. 실착 3회 미만으로 상태 아주 깨끗합니다. 털 뭉침이나 소매 때탐 일절 없으며 드라이클리닝 완료 후 보관 중입니다. 따뜻하고 스타일리시해요!',
      23,
      NOW() - INTERVAL '2 hours'
    ),
    (
      v_seller_4,
      '드롱기 아이코나 빈티지 무선 전기포트 (올리브그린)',
      '생활가전',
      45000,
      false,
      '서울시 서초구 양재1동',
      '거래 완료',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80',
      '올리브 그린 색상으로 주방 인테리어에 정말 예쁜 전기주전자입니다. 내부 구연산 세척 완료했고 정상 작동 확인했습니다. 미세한 생활감 외에 상태 양호합니다.',
      5,
      NOW() - INTERVAL '5 hours'
    ),
    (
      v_seller_5,
      '[새책수준] Clean Code 클린 코드 (로버트 C. 마틴)',
      '도서/티켓',
      18000,
      false,
      '서울시 강남구 도곡동',
      '판매중',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      '밑줄, 필기 전혀 없고 겉표지도 아주 깨끗한 소장용 컨디션의 새 책 수준입니다. 개발자 필독서로 추천합니다. 양재역 또는 도곡역 근처에서 직거래 가능합니다.',
      9,
      NOW() - INTERVAL '1 day'
    ),
    (
      v_seller_6,
      '강원도 고랭지 흙감자 5kg (포슬포슬 꿀맛 보장)',
      '기타',
      13000,
      false,
      '서울시 강남구 개포2동',
      '판매중',
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
      '부모님이 강원도 밭에서 직접 농사지어 보내주신 신선한 고랭지 햇감자입니다. 분이 팍팍 나고 쪄 먹으면 아주 고소하고 달콤합니다! 감자전이나 조림용으로 최고입니다. 박스째 드려요.',
      38,
      NOW() - INTERVAL '2 days'
    ),
    (
      v_seller_7,
      '원목 캣타워 & 푹신한 강아지 마약방석 세트',
      '반려동물 용품',
      32000,
      false,
      '서울시 강남구 삼성동',
      '판매중',
      'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800&auto=format&fit=crop&q=80',
      '인테리어와 잘 어울리는 자작나무 원목 캣타워와 거의 사용하지 않은 푹신한 대형 강아지/고양이 방석입니다. 깨끗하게 세탁 및 소독 완료했습니다. 삼성역 부근 직거래 원합니다.',
      16,
      NOW() - INTERVAL '3 hours'
    );
END $$;
