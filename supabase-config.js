/**
 * ========================================================
 * 감자(Gamza) 마켓 - Supabase 연동 클라이언트 설정 & 서비스 레이어
 * ========================================================
 */

(function () {
  'use strict';

  // 1. Supabase 프로젝트 연결 정보 (Seoul Region: ap-northeast-2)
  const SUPABASE_URL = 'https://jtsoqlocysewnmpncmlt.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0c29xbG9jeXNld25tcG5jbWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0ODA0NjgsImV4cCI6MjEwODA1NjQ2OH0.bzzqavddvMbZ5QCz-bkpCZ6HTF4DN-LppQfM8ruO6mw';

  // 기본 판매자 ID (따뜻한감자이웃 - 마포구 연남동, 99.0℃)
  const DEFAULT_SELLER_ID = 'c843ef7e-3ffc-450c-9fd4-3fe9a4b94cf6';

  let client = null;

  if (window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('🥔 [Supabase] 클라이언트 초기화 성공 (Project: gamza)');
    } catch (err) {
      console.warn('🥔 [Supabase] 클라이언트 초기화 실패:', err);
    }
  } else {
    console.warn('🥔 [Supabase] @supabase/supabase-js 라이브러리가 로드되지 않았습니다.');
  }

  // 2. 상대 시간(timeAgo) 계산 유틸리티
  function calculateTimeAgo(dateStr) {
    if (!dateStr) return '방금 전';
    const now = new Date();
    const created = new Date(dateStr);
    const diffSec = Math.floor((now - created) / 1000);

    if (diffSec < 60) return '방금 전';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}시간 전`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) return `${diffDay}일 전`;
    return `${Math.floor(diffDay / 30)}달 전`;
  }

  // 3. 연결 상태 확인
  async function checkConnection() {
    if (!client) return false;
    try {
      const { count, error } = await client
        .from('products')
        .select('*', { count: 'exact', head: true });
      return !error;
    } catch (e) {
      return false;
    }
  }

  // 4. 상품 목록 조회 (Profiles 조인)
  async function fetchProducts() {
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('products')
        .select(`
          id,
          seller_id,
          title,
          category,
          price,
          is_free_share,
          location,
          status,
          image_url,
          description,
          like_count,
          created_at,
          profiles:seller_id (
            id,
            nickname,
            avatar_url,
            region_name,
            manner_temp,
            is_verified
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('🥔 [Supabase] 상품 조회 실패:', error.message);
        return null;
      }

      // UI 포맷으로 변환
      return (data || []).map(row => {
        const profile = row.profiles || {};
        return {
          id: row.id,
          sellerId: row.seller_id,
          title: row.title,
          category: row.category,
          price: row.price,
          location: row.location,
          timeAgo: calculateTimeAgo(row.created_at),
          status: row.status || '판매중',
          image: row.image_url,
          description: row.description,
          seller: {
            nickname: profile.nickname || '따뜻한감자이웃',
            avatar: profile.avatar_url || '',
            location: profile.region_name || row.location,
            mannerTemp: profile.manner_temp ? Number(profile.manner_temp) : 99.0
          },
          likeCount: row.like_count || 0,
          isLiked: false,
          rawCreatedAt: row.created_at
        };
      });
    } catch (err) {
      console.warn('🥔 [Supabase] 상품 조회 네트워크 에러:', err);
      return null;
    }
  }

  // 5. 새 상품 등록 (Insert)
  async function createProduct(productData, customSellerId) {
    if (!client) return null;

    try {
      const actualSellerId = customSellerId || DEFAULT_SELLER_ID;
      const payload = {
        seller_id: actualSellerId,
        title: productData.title,
        category: productData.category,
        price: productData.price,
        is_free_share: productData.price === 0,
        location: productData.location,
        status: productData.status || '판매중',
        image_url: productData.image,
        description: productData.description,
        like_count: 0
      };

      const { data, error } = await client
        .from('products')
        .insert([payload])
        .select(`
          id,
          seller_id,
          title,
          category,
          price,
          is_free_share,
          location,
          status,
          image_url,
          description,
          like_count,
          created_at,
          profiles:seller_id (
            id,
            nickname,
            avatar_url,
            region_name,
            manner_temp,
            is_verified
          )
        `)
        .single();

      if (error) {
        console.warn('🥔 [Supabase] 상품 등록 실패:', error.message);
        return null;
      }

      const profile = data.profiles || {};
      return {
        id: data.id,
        sellerId: data.seller_id,
        title: data.title,
        category: data.category,
        price: data.price,
        location: data.location,
        timeAgo: '방금 전',
        status: data.status,
        image: data.image_url,
        description: data.description,
        seller: {
          nickname: profile.nickname || productData.seller?.nickname || '따뜻한감자이웃',
          avatar: profile.avatar_url || productData.seller?.avatar || '',
          location: profile.region_name || data.location,
          mannerTemp: profile.manner_temp ? Number(profile.manner_temp) : 99.0
        },
        likeCount: 0,
        isLiked: false,
        rawCreatedAt: data.created_at
      };
    } catch (err) {
      console.warn('🥔 [Supabase] 상품 등록 네트워크 에러:', err);
      return null;
    }
  }

  // 5-1. 상품 상태 변경 (판매중 / 예약중 / 거래 완료)
  async function updateProductStatus(productId, status) {
    if (!client || !productId) return null;
    try {
      const { data, error } = await client
        .from('products')
        .update({
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        console.warn('🥔 [Supabase] 상품 상태 변경 실패:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('🥔 [Supabase] 상품 상태 변경 네트워크 에러:', err);
      return null;
    }
  }

  // 5-2. 상품 정보 전체 수정 (Edit)
  async function updateProduct(productId, productData) {
    if (!client || !productId) return null;
    try {
      const payload = {
        title: productData.title,
        category: productData.category,
        price: productData.price,
        is_free_share: productData.price === 0,
        location: productData.location,
        status: productData.status || '판매중',
        image_url: productData.image,
        description: productData.description,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await client
        .from('products')
        .update(payload)
        .eq('id', productId)
        .select(`
          id,
          seller_id,
          title,
          category,
          price,
          is_free_share,
          location,
          status,
          image_url,
          description,
          like_count,
          created_at,
          profiles:seller_id (
            id,
            nickname,
            avatar_url,
            region_name,
            manner_temp,
            is_verified
          )
        `)
        .single();

      if (error) {
        console.warn('🥔 [Supabase] 상품 수정 실패:', error.message);
        return null;
      }

      const profile = data.profiles || {};
      return {
        id: data.id,
        sellerId: data.seller_id,
        title: data.title,
        category: data.category,
        price: data.price,
        location: data.location,
        timeAgo: '방금 전',
        status: data.status,
        image: data.image_url,
        description: data.description,
        seller: {
          nickname: profile.nickname || productData.seller?.nickname || '따뜻한감자이웃',
          avatar: profile.avatar_url || productData.seller?.avatar || '',
          location: profile.region_name || data.location,
          mannerTemp: profile.manner_temp ? Number(profile.manner_temp) : 99.0
        },
        likeCount: data.like_count || 0,
        isLiked: false,
        rawCreatedAt: data.created_at
      };
    } catch (err) {
      console.warn('🥔 [Supabase] 상품 수정 네트워크 에러:', err);
      return null;
    }
  }

  // 5-3. 상품 삭제 (Delete)
  async function deleteProduct(productId) {
    if (!client || !productId) return false;
    try {
      const { error } = await client
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.warn('🥔 [Supabase] 상품 삭제 실패:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('🥔 [Supabase] 상품 삭제 네트워크 에러:', err);
      return false;
    }
  }

  // 6. 사용자 프로필 조회 & 생성/업데이트
  async function getProfile(userId) {
    if (!client || !userId) return null;
    try {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('🥔 [Supabase] 프로필 조회 실패:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('🥔 [Supabase] 프로필 조회 에러:', err);
      return null;
    }
  }

  async function upsertProfile(userId, nickname, avatarUrl) {
    if (!client || !userId) return null;
    try {
      const dicebearAvatar = avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(nickname || 'potato')}&backgroundColor=fdfbf7`;
      const payload = {
        id: userId,
        nickname: (nickname || '').trim() || '따뜻한감자',
        avatar_url: dicebearAvatar,
        region_name: '서울시 마포구 연남동',
        is_verified: true,
        manner_temp: 99.0
      };

      const { data, error } = await client
        .from('profiles')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.warn('🥔 [Supabase] 프로필 생성/갱신 실패:', error.message);
        return payload; // 실패 시 로컬 페이로드 반환
      }
      return data;
    } catch (err) {
      console.warn('🥔 [Supabase] 프로필 upsert 에러:', err);
      return null;
    }
  }

  // 7. 회원가입 (SignUp)
  async function signUp(email, password, nickname) {
    if (!client) throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
    
    const trimmedNick = (nickname || '').trim();
    if (!trimmedNick) {
      throw new Error('닉네임을 입력해 주세요.');
    }

    const cleanEmail = email.trim();
    const dicebearAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedNick)}&backgroundColor=fdfbf7`;

    const { data, error } = await client.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: {
          nickname: trimmedNick,
          avatar_url: dicebearAvatar
        }
      }
    });

    if (error) {
      throw error;
    }

    let session = data.session;
    let user = data.user;

    // Supabase 이메일 확인 설정이 켜져 있는 경우 자동 확인 및 즉시 로그인 처리
    try {
      await client.rpc('confirm_user_email', { user_email: cleanEmail });
      if (!session) {
        const loginRes = await client.auth.signInWithPassword({
          email: cleanEmail,
          password: password
        });
        if (loginRes.data && loginRes.data.session) {
          session = loginRes.data.session;
          user = loginRes.data.user;
        }
      }
    } catch (e) {
      console.warn('🥔 자동 이메일 확인/로그인 처리:', e);
    }

    if (user) {
      // 프로필 테이블에 생성/보장
      const profile = await upsertProfile(user.id, trimmedNick, dicebearAvatar);
      return {
        user: user,
        session: session,
        profile: profile,
        needsEmailConfirmation: false
      };
    }

    return { user: user, session: session, profile: null };
  }

  // 8. 로그인 (SignIn)
  async function signIn(email, password) {
    if (!client) throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');

    const cleanEmail = email.trim();
    let { data, error } = await client.auth.signInWithPassword({
      email: cleanEmail,
      password: password
    });

    // 이메일 미인증 에러 발생 시 자동 확인 처리 후 1회 재시도
    if (error && (error.message.includes('Email not confirmed') || error.code === 'email_not_confirmed')) {
      try {
        await client.rpc('confirm_user_email', { user_email: cleanEmail });
        const retryRes = await client.auth.signInWithPassword({
          email: cleanEmail,
          password: password
        });
        data = retryRes.data;
        error = retryRes.error;
      } catch (retryErr) {
        console.warn('🥔 이메일 확인 후 로그인 재시도 실패:', retryErr);
      }
    }

    if (error) {
      throw error;
    }

    // 로그인된 유저의 프로필 조회 (없으면 메타데이터로 복구 생성)
    let profile = null;
    if (data.user) {
      profile = await getProfile(data.user.id);
      if (!profile) {
        const metaNick = data.user.user_metadata?.nickname || cleanEmail.split('@')[0];
        const metaAvatar = data.user.user_metadata?.avatar_url;
        profile = await upsertProfile(data.user.id, metaNick, metaAvatar);
      }
    }

    return {
      user: data.user,
      session: data.session,
      profile: profile
    };
  }

  // 9. 로그아웃 (SignOut)
  async function signOut() {
    if (!client) return;
    const { error } = await client.auth.signOut();
    if (error) {
      console.warn('🥔 [Supabase] 로그아웃 에러:', error.message);
      throw error;
    }
  }

  // 10. 현재 세션 / 유저 조회
  async function getCurrentSession() {
    if (!client) return null;
    try {
      const { data } = await client.auth.getSession();
      return data?.session || null;
    } catch (e) {
      return null;
    }
  }

  async function getCurrentUser() {
    if (!client) return null;
    try {
      const { data } = await client.auth.getUser();
      return data?.user || null;
    } catch (e) {
      return null;
    }
  }

  // 11. 인증 상태 변경 리스너
  function onAuthStateChange(callback) {
    if (!client || typeof callback !== 'function') return null;
    return client.auth.onAuthStateChange(callback);
  }

  // 12. 관심(좋아요) 토글 & 카운트 업데이트
  async function toggleProductLike(productId, isLiked) {
    if (!client || !productId) return;

    try {
      const { data: prod } = await client
        .from('products')
        .select('like_count')
        .eq('id', productId)
        .single();

      if (!prod) return;
      const current = prod.like_count || 0;
      const updatedCount = isLiked ? current + 1 : Math.max(0, current - 1);

      await client
        .from('products')
        .update({ like_count: updatedCount })
        .eq('id', productId);

      return updatedCount;
    } catch (err) {
      console.warn('🥔 [Supabase] 관심 토글 반영 실패:', err);
    }
  }

  // 7. 실시간 변경사항 구독 (Supabase Realtime)
  function subscribeToProducts(onChangeCallback) {
    if (!client || typeof onChangeCallback !== 'function') return null;

    try {
      const channel = client
        .channel('public:products')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          (payload) => {
            console.log('🥔 [Supabase Realtime] 변경 감지:', payload.eventType);
            onChangeCallback(payload);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('🥔 [Supabase Realtime] 실시간 구독 활성화됨');
          }
        });

      return channel;
    } catch (err) {
      console.warn('🥔 [Supabase Realtime] 구독 실패:', err);
      return null;
    }
  }

  // 전역 API 노출
  window.GamzaSupabase = {
    client: client,
    checkConnection: checkConnection,
    fetchProducts: fetchProducts,
    createProduct: createProduct,
    updateProductStatus: updateProductStatus,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    toggleProductLike: toggleProductLike,
    subscribeToProducts: subscribeToProducts,
    calculateTimeAgo: calculateTimeAgo,
    // Auth & Profile API
    signUp: signUp,
    signIn: signIn,
    signOut: signOut,
    getCurrentSession: getCurrentSession,
    getCurrentUser: getCurrentUser,
    getProfile: getProfile,
    upsertProfile: upsertProfile,
    onAuthStateChange: onAuthStateChange
  };
})();
