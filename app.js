/**
 * ========================================================
 * 감자(Gamza) 중고 거래 웹 서비스 메인 스크립트
 * ========================================================
 */

(function () {
  'use strict';

  // 1. 기본 감자 캐릭터 SVG (이미지 미업로드 시 또는 로드 실패 시 대체용)
  const DEFAULT_POTATO_IMG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" width="300" height="240">
      <rect width="100%" height="100%" fill="#FAF6F0"/>
      <g transform="translate(150, 115)">
        <ellipse cx="0" cy="55" rx="70" ry="14" fill="#8D5B4C" opacity="0.15"/>
        <path d="M-65,-40 C-90,-10 -85,45 -50,65 C-15,85 55,80 75,45 C95,10 85,-45 45,-60 C0,-75 -40,-60 -65,-40 Z" fill="#C68B59"/>
        <!-- 눈/코/입 -->
        <circle cx="-22" cy="-6" r="5" fill="#2D231E"/>
        <circle cx="22" cy="-6" r="5" fill="#2D231E"/>
        <circle cx="-20" cy="-8" r="1.5" fill="#FFFFFF"/>
        <circle cx="24" cy="-8" r="1.5" fill="#FFFFFF"/>
        <!-- 볼터치 -->
        <ellipse cx="-38" cy="8" rx="8" ry="5" fill="#F4A261" opacity="0.7"/>
        <ellipse cx="38" cy="8" rx="8" ry="5" fill="#F4A261" opacity="0.7"/>
        <!-- 웃는 입 -->
        <path d="M-10,10 Q0,20 10,10" fill="none" stroke="#2D231E" stroke-width="3" stroke-linecap="round"/>
        <!-- 머리 위 새싹 -->
        <path d="M-2,-65 C-2,-80 8,-85 14,-82 C16,-73 9,-67 2,-64 Z" fill="#70A957"/>
        <path d="M-5,-65 C-8,-76 -15,-80 -19,-76 C-19,-68 -12,-65 -7,-64 Z" fill="#8AC926"/>
      </g>
      <text x="150" y="210" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold" fill="#8D5B4C" text-anchor="middle">🥔 포슬포슬 감자 상품</text>
    </svg>
  `)}`;

  // 기본 판매자 아바타 SVG
  const DEFAULT_SELLER_AVATAR = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill="#F7EFE5" stroke="#C68B59" stroke-width="2"/>
      <ellipse cx="50" cy="53" rx="30" ry="24" fill="#C68B59"/>
      <circle cx="42" cy="49" r="3.2" fill="#2D231E"/>
      <circle cx="58" cy="49" r="3.2" fill="#2D231E"/>
      <ellipse cx="36" cy="54" rx="4" ry="2.5" fill="#F4A261" opacity="0.7"/>
      <ellipse cx="64" cy="54" rx="4" ry="2.5" fill="#F4A261" opacity="0.7"/>
      <path d="M 45 56 Q 50 61 55 56" stroke="#2D231E" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    </svg>
  `)}`;

  // 2. 가짜(Mock) 상품 데이터 6종 (인메모리 배열)
  const INITIAL_PRODUCTS = [
    {
      id: 1,
      title: "아이패드 에어 5세대 64GB WiFi 스타라이트",
      category: "디지털기기",
      price: 520000,
      location: "서울시 강남구 역삼동",
      timeAgo: "15분 전",
      status: "판매중", // 판매중 | 예약중 | 거래 완료
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
      description: "실사용 6개월 미만이며 케이스와 강화유리를 항상 착용하여 기스 없이 깔끔합니다. 배터리 성능 98%이고 충전기, 박스 등 풀박스 구성품 모두 보관 중입니다. 네고 문의는 정중히 사양하며 역삼역 인근 직거래 선호합니다.",
      seller: {
        nickname: "연남사과맨",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=apple&backgroundColor=fdfbf7",
        location: "역삼1동",
        mannerTemp: 99.0
      },
      likeCount: 14,
      isLiked: false
    },
    {
      id: 2,
      title: "원목 2단 협탁 / 미니 사이드 테이블 (감성 인테리어)",
      category: "가구/인테리어",
      price: 28000,
      location: "서울시 서초구 서초2동",
      timeAgo: "42분 전",
      status: "예약중",
      image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&auto=format&fit=crop&q=80",
      description: "자작나무 원목으로 제작된 따뜻한 감성의 2단 협탁입니다. 침대 옆이나 소파 옆에 두기 딱 좋은 아담한 사이즈입니다. 이사를 가게 되어 아쉽지만 급처합니다. 차량으로 가져가시는 것을 추천합니다.",
      seller: {
        nickname: "우디우드",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=woody&backgroundColor=fdfbf7",
        location: "서초2동",
        mannerTemp: 82.5
      },
      likeCount: 7,
      isLiked: false
    },
    {
      id: 3,
      title: "파타고니아 레트로X 클래식 플리스 자켓 M",
      category: "의류",
      price: 115000,
      location: "서울시 강남구 대치1동",
      timeAgo: "2시간 전",
      status: "판매중",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
      description: "국내 백화점 정품 매장에서 구입했습니다. 실착 3회 미만으로 상태 아주 깨끗합니다. 털 뭉침이나 소매 때탐 일절 없으며 드라이클리닝 완료 후 보관 중입니다. 따뜻하고 스타일리시해요!",
      seller: {
        nickname: "대치동포근이",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=jacket&backgroundColor=fdfbf7",
        location: "대치1동",
        mannerTemp: 91.2
      },
      likeCount: 23,
      isLiked: false
    },
    {
      id: 4,
      title: "드롱기 아이코나 빈티지 무선 전기포트 (올리브그린)",
      category: "생활가전",
      price: 45000,
      location: "서울시 서초구 양재1동",
      timeAgo: "5시간 전",
      status: "거래 완료",
      image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80",
      description: "올리브 그린 색상으로 주방 인테리어에 정말 예쁜 전기주전자입니다. 내부 구연산 세척 완료했고 정상 작동 확인했습니다. 미세한 생활감 외에 상태 양호합니다.",
      seller: {
        nickname: "향긋한커피",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=coffee&backgroundColor=fdfbf7",
        location: "양재1동",
        mannerTemp: 78.4
      },
      likeCount: 5,
      isLiked: false
    },
    {
      id: 5,
      title: "[새책수준] Clean Code 클린 코드 (로버트 C. 마틴)",
      category: "도서/티켓",
      price: 18000,
      location: "서울시 강남구 도곡동",
      timeAgo: "1일 전",
      status: "판매중",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
      description: "밑줄, 필기 전혀 없고 겉표지도 아주 깨끗한 소장용 컨디션의 새 책 수준입니다. 개발자 필독서로 추천합니다. 양재역 또는 도곡역 근처에서 직거래 가능합니다.",
      seller: {
        nickname: "코딩감자",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cleancode&backgroundColor=fdfbf7",
        location: "도곡동",
        mannerTemp: 96.0
      },
      likeCount: 9,
      isLiked: false
    },
    {
      id: 6,
      title: "강원도 고랭지 흙감자 5kg (포슬포슬 꿀맛 보장)",
      category: "기타",
      price: 13000,
      location: "서울시 강남구 개포2동",
      timeAgo: "2일 전",
      status: "판매중",
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80",
      description: "부모님이 강원도 밭에서 직접 농사지어 보내주신 신선한 고랭지 햇감자입니다. 분이 팍팍 나고 쪄 먹으면 아주 고소하고 달콤합니다! 감자전이나 조림용으로 최고입니다. 박스째 드려요.",
      seller: {
        nickname: "진짜감자농부",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=potatoKing&backgroundColor=fdfbf7",
        location: "개포2동",
        mannerTemp: 99.9
      },
      likeCount: 38,
      isLiked: false
    },
    {
      id: 7,
      title: "원목 캣타워 & 푹신한 강아지 마약방석 세트",
      category: "반려동물 용품",
      price: 32000,
      location: "서울시 강남구 삼성동",
      timeAgo: "3시간 전",
      status: "판매중",
      image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=800&auto=format&fit=crop&q=80",
      description: "인테리어와 잘 어울리는 자작나무 원목 캣타워와 거의 사용하지 않은 푹신한 대형 강아지/고양이 방석입니다. 깨끗하게 세탁 및 소독 완료했습니다. 삼성역 부근 직거래 원합니다.",
      seller: {
        nickname: "댕냥이행복",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=petlover&backgroundColor=fdfbf7",
        location: "삼성동",
        mannerTemp: 88.5
      },
      likeCount: 16,
      isLiked: false
    }
  ];

  // 애플리케이션 상태
  const appState = {
    products: [...INITIAL_PRODUCTS],
    currentCategory: "전체",
    searchKeyword: "",
    availableOnly: false,
    selectedProduct: null,
    editingProduct: null, // null이면 신규 글 작성, 객체면 해당 글 수정 모드
    writeFormImage: null, // Base64 or ObjectURL
    currentUser: null,    // Supabase Auth User
    currentProfile: null, // Supabase public.profiles 레코드
    pendingActionAfterLogin: null, // 로그인 성공 후 실행할 액션 (예: 'openWrite')
    authModalTab: 'login' // 'login' | 'signup'
  };

  // DOM 엘리먼트 캐싱
  const dom = {
    // 헤더 & 필터
    searchInput: document.getElementById('search-input'),
    btnClearSearch: document.getElementById('btn-clear-search'),
    btnOpenWrite: document.getElementById('btn-open-write'),
    btnLogin: document.getElementById('btn-login'),
    authGuestSection: document.getElementById('auth-guest-section'),
    authUserSection: document.getElementById('auth-user-section'),
    headerUserAvatar: document.getElementById('header-user-avatar'),
    headerUserName: document.getElementById('header-user-name'),
    btnLogout: document.getElementById('btn-logout'),
    categoryChips: document.querySelectorAll('.category-chip'),
    productGrid: document.getElementById('product-grid'),
    productCount: document.getElementById('product-count'),
    toggleAvailable: document.getElementById('toggle-available-only'),
    emptyState: document.getElementById('empty-state'),
    btnResetFilters: document.getElementById('btn-reset-filters'),
    toastContainer: document.getElementById('gamza-toast-container'),
    supabaseBadge: document.getElementById('supabase-status-badge'),
    statusIndicatorDot: document.getElementById('status-indicator-dot'),
    statusIndicatorText: document.getElementById('status-indicator-text'),

    // 상세 모달
    detailModal: document.getElementById('gamza-detail-modal'),
    detailImage: document.getElementById('gamza-detail-image'),
    detailStatus: document.getElementById('gamza-detail-status'),
    detailCategory: document.getElementById('gamza-detail-category'),
    detailTitle: document.getElementById('gamza-detail-title'),
    detailLocation: document.getElementById('gamza-detail-location'),
    detailTime: document.getElementById('gamza-detail-time'),
    detailPrice: document.getElementById('gamza-detail-price'),
    detailDescription: document.getElementById('gamza-detail-description'),
    sellerAvatar: document.getElementById('gamza-seller-avatar'),
    sellerName: document.getElementById('gamza-seller-name'),
    sellerLocation: document.getElementById('gamza-seller-location'),
    warmthTemp: document.getElementById('gamza-warmth-temp'),
    warmthBarFill: document.getElementById('gamza-warmth-bar-fill'),
    btnDetailLike: document.getElementById('btn-gamza-detail-like'),
    detailLikeCount: document.getElementById('gamza-detail-like-count'),
    btnDetailChat: document.getElementById('btn-gamza-detail-chat'),
    // 작성자 전용 관리 도구
    ownerBar: document.getElementById('gamza-detail-owner-bar'),
    ownerStatusChips: document.querySelectorAll('.owner-status-chip'),
    btnOwnerEdit: document.getElementById('btn-owner-edit'),
    btnOwnerDelete: document.getElementById('btn-owner-delete'),
    ownerFooterActions: document.getElementById('owner-footer-actions'),
    btnOwnerEditFooter: document.getElementById('btn-owner-edit-footer'),
    btnOwnerDeleteFooter: document.getElementById('btn-owner-delete-footer'),

    // 글쓰기 모달
    writeModal: document.getElementById('gamza-write-modal'),
    writeForm: document.getElementById('gamza-write-form'),
    writeModalHeading: document.getElementById('gamza-write-title-heading'),
    writeSubmitBtn: document.getElementById('gamza-write-submit-btn'),
    writeCloseBtn: document.getElementById('gamza-write-close-btn'),
    writeCancelBtn: document.getElementById('gamza-write-cancel-btn'),
    writeImageInput: document.getElementById('write-image-input'),
    writeImageDropzone: document.getElementById('write-image-dropzone'),
    writeUploadedImg: document.getElementById('write-uploaded-img'),
    writeDefaultPotato: document.getElementById('write-default-potato'),
    writeBtnSelectFile: document.getElementById('write-btn-select-file'),
    writeBtnRemoveFile: document.getElementById('write-btn-remove-file'),
    writeTitle: document.getElementById('write-title'),
    writeTitleCount: document.getElementById('write-title-count'),
    writeCategory: document.getElementById('write-category'),
    writePrice: document.getElementById('write-price'),
    writePriceKorean: document.getElementById('write-price-korean'),
    writeFreeShare: document.getElementById('write-free-share'),
    writeLocation: document.getElementById('write-location'),
    writeDescription: document.getElementById('write-description'),
    writeDescCount: document.getElementById('write-description-count'),

    // 로그인 / 회원가입 모달
    authModal: document.getElementById('gamza-auth-modal'),
    authCloseBtn: document.getElementById('gamza-auth-close-btn'),
    authNoticeBanner: document.getElementById('auth-notice-banner'),
    authNoticeText: document.getElementById('auth-notice-text'),
    tabAuthLogin: document.getElementById('tab-auth-login'),
    tabAuthSignup: document.getElementById('tab-auth-signup'),
    loginForm: document.getElementById('gamza-login-form'),
    signupForm: document.getElementById('gamza-signup-form'),
    loginEmail: document.getElementById('login-email'),
    loginPassword: document.getElementById('login-password'),
    signupNickname: document.getElementById('signup-nickname'),
    signupEmail: document.getElementById('signup-email'),
    signupPassword: document.getElementById('signup-password'),
    signupPasswordConfirm: document.getElementById('signup-password-confirm'),
    btnSwitchToSignup: document.getElementById('btn-switch-to-signup'),
    btnSwitchToLogin: document.getElementById('btn-switch-to-login'),
    loginGlobalError: document.getElementById('login-global-error'),
    signupGlobalError: document.getElementById('signup-global-error'),
    btnSubmitLogin: document.getElementById('btn-submit-login'),
    btnSubmitSignup: document.getElementById('btn-submit-signup')
  };

  // 3. 유틸리티 함수들
  function formatPrice(number) {
    if (number === 0 || number === "0") return "무료나눔";
    return Number(number).toLocaleString('ko-KR');
  }

  function numberToKorean(number) {
    const num = Number(number);
    if (!num || isNaN(num) || num <= 0) return "0원";
    if (num >= 100000000) {
      const eok = Math.floor(num / 100000000);
      const man = Math.floor((num % 100000000) / 10000);
      return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억원`;
    }
    if (num >= 10000) {
      const man = Math.floor(num / 10000);
      const remainder = num % 10000;
      return remainder > 0 ? `${man}만 ${remainder.toLocaleString()}원` : `${man}만원`;
    }
    return `${num.toLocaleString()}원`;
  }

  function showToast(message) {
    if (!dom.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = message;
    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2400);
  }

  function updateSupabaseStatus(state) {
    if (!dom.supabaseBadge || !dom.statusIndicatorDot || !dom.statusIndicatorText) return;
    if (state === 'connected') {
      dom.supabaseBadge.className = 'supabase-status-badge';
      dom.statusIndicatorDot.className = 'status-indicator-dot';
      dom.statusIndicatorText.textContent = 'Supabase 연동됨';
    } else if (state === 'offline') {
      dom.supabaseBadge.className = 'supabase-status-badge offline';
      dom.statusIndicatorDot.className = 'status-indicator-dot offline';
      dom.statusIndicatorText.textContent = '로컬 모드';
    } else {
      dom.supabaseBadge.className = 'supabase-status-badge connecting';
      dom.statusIndicatorDot.className = 'status-indicator-dot connecting';
      dom.statusIndicatorText.textContent = 'Supabase 연결 중...';
    }
  }

  function getStatusBadgeClass(status) {
    const s = (status || '').replace(/\s+/g, '');
    switch (s) {
      case '판매중': return 'gamza-badge--sale';
      case '예약중': return 'gamza-badge--reserved';
      case '거래완료': return 'gamza-badge--done';
      default: return 'gamza-badge--sale';
    }
  }

  // 4. 상품 목록 렌더링
  function renderProductList() {
    // 필터링 적용
    const filtered = appState.products.filter(item => {
      // 카테고리 필터
      if (appState.currentCategory !== '전체' && item.category !== appState.currentCategory) {
        return false;
      }
      // 거래 가능만 보기 필터 (요구사항 3: 거래 완료된 글 확실히 제외)
      if (appState.availableOnly) {
        const s = (item.status || '').replace(/\s+/g, '');
        if (s === '거래완료' || s === '완료') {
          return false;
        }
      }
      // 검색어 필터
      if (appState.searchKeyword.trim()) {
        const query = appState.searchKeyword.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(query);
        const inLocation = (item.location || '').toLowerCase().includes(query);
        const inDesc = (item.description || '').toLowerCase().includes(query);
        if (!inTitle && !inLocation && !inDesc) {
          return false;
        }
      }
      return true;
    });

    // 개수 표시 업데이트
    if (dom.productCount) {
      dom.productCount.innerHTML = `총 <strong>${filtered.length}</strong>개`;
    }

    // 결과 없음 처리
    if (filtered.length === 0) {
      dom.productGrid.style.display = 'none';
      dom.emptyState.style.display = 'block';
      return;
    }

    dom.productGrid.style.display = 'grid';
    dom.emptyState.style.display = 'none';

    // 카드 생성
    dom.productGrid.innerHTML = filtered.map(item => {
      const isCompleted = (item.status || '').replace(/\s+/g, '') === '거래완료';
      const badgeClass = getStatusBadgeClass(item.status);
      const priceText = item.price === 0 ? '무료나눔' : `${formatPrice(item.price)}<span class="card-price-unit">원</span>`;

      return `
        <article class="product-card ${isCompleted ? 'is-completed' : ''}" data-id="${item.id}" tabindex="0" role="button" aria-label="${item.title} 상품 상세보기">
          <div class="card-thumbnail-wrap">
            <img 
              src="${item.image || DEFAULT_POTATO_IMG}" 
              alt="${item.title}" 
              class="card-image"
              loading="lazy"
              onerror="this.onerror=null; this.src='${DEFAULT_POTATO_IMG}';"
            />
            <span class="card-category-badge">${item.category}</span>
          </div>
          <div class="card-content">
            <div class="card-status-row">
              <span class="gamza-badge ${badgeClass}">${item.status}</span>
            </div>
            <h3 class="card-title">${item.title}</h3>
            <div class="card-meta">
              <span class="card-seller-name" title="작성자: ${item.seller?.nickname || '따뜻한감자이웃'}">
                <span class="card-seller-icon" aria-hidden="true">🥔</span>
                ${item.seller?.nickname || '따뜻한감자이웃'}
              </span>
              <span class="card-meta-dot">•</span>
              <span>${item.location}</span>
              <span class="card-meta-dot">•</span>
              <span>${item.timeAgo}</span>
            </div>
            <div class="card-price-row">
              <span class="card-price">${priceText}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // 카드 클릭 이벤트 바인딩
    dom.productGrid.querySelectorAll('.product-card').forEach(card => {
      const id = card.getAttribute('data-id');
      const product = appState.products.find(p => String(p.id) === String(id));

      const handleOpen = () => {
        if (product) openDetailModal(product);
      };

      card.addEventListener('click', handleOpen);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen();
        }
      });
    });
  }

  // 5. 상세 팝업 (모달) 제어
  function openDetailModal(product) {
    appState.selectedProduct = product;

    // 데이터 주입 (요구사항 순서 완벽 준수)
    // 1) 큰 이미지
    dom.detailImage.src = product.image || DEFAULT_POTATO_IMG;
    dom.detailImage.alt = product.title;
    dom.detailImage.onerror = function() {
      this.src = DEFAULT_POTATO_IMG;
    };

    // 2) 판매 상태 뱃지 & 카테고리 태그
    dom.detailStatus.textContent = product.status;
    dom.detailStatus.className = `gamza-badge ${getStatusBadgeClass(product.status)}`;
    dom.detailCategory.textContent = product.category;

    // 3) 상품명
    dom.detailTitle.textContent = product.title;

    // 4) 판매 위치 & 업로드 시간
    dom.detailLocation.textContent = product.location;
    dom.detailTime.textContent = product.timeAgo;

    // 5) 가격
    if (product.price === 0) {
      dom.detailPrice.textContent = '무료나눔';
      const unit = dom.detailPrice.parentElement.querySelector('.gamza-price-unit');
      if (unit) unit.style.display = 'none';
    } else {
      dom.detailPrice.textContent = formatPrice(product.price);
      const unit = dom.detailPrice.parentElement.querySelector('.gamza-price-unit');
      if (unit) unit.style.display = 'inline';
    }

    // 6) 상품 설명
    dom.detailDescription.textContent = product.description || '작성된 상세 설명이 없습니다.';

    // 7) 판매자 정보
    const seller = product.seller || {
      nickname: '감자왕김감자',
      avatar: DEFAULT_SELLER_AVATAR,
      location: product.location,
      mannerTemp: 99.0
    };
    dom.sellerName.textContent = seller.nickname;
    dom.sellerLocation.textContent = seller.location;
    dom.sellerAvatar.src = seller.avatar || DEFAULT_SELLER_AVATAR;
    dom.sellerAvatar.onerror = function() {
      this.src = DEFAULT_SELLER_AVATAR;
    };

    // 감자 지수
    const temp = seller.mannerTemp || 99.0;
    dom.warmthTemp.textContent = `따뜻한 감자 ${temp}℃`;
    dom.warmthBarFill.style.width = `${Math.min(100, Math.max(10, temp))}%`;

    // 8) 관심 상태
    updateLikeButtonUI(product.isLiked, product.likeCount);

    // 요구사항 1: 자신이 쓴 게시글인지 확인 (작성자 전용 관리 도구 표시)
    const isOwner = Boolean(
      (appState.currentUser && product.sellerId && String(product.sellerId) === String(appState.currentUser.id)) ||
      (appState.currentProfile && product.seller && product.seller.nickname === appState.currentProfile.nickname)
    );

    if (isOwner) {
      if (dom.ownerBar) dom.ownerBar.style.display = 'block';
      if (dom.btnDetailChat) dom.btnDetailChat.style.display = 'none';
      if (dom.ownerFooterActions) dom.ownerFooterActions.style.display = 'flex';

      // 현재 상품 상태에 해당하는 칩 active 표시
      if (dom.ownerStatusChips) {
        dom.ownerStatusChips.forEach(chip => {
          const s = chip.getAttribute('data-status');
          chip.classList.toggle('active', s === product.status);
        });
      }
    } else {
      if (dom.ownerBar) dom.ownerBar.style.display = 'none';
      if (dom.btnDetailChat) dom.btnDetailChat.style.display = 'inline-flex';
      if (dom.ownerFooterActions) dom.ownerFooterActions.style.display = 'none';
    }

    // 모달 표시 & 바디 스크롤 방지
    dom.detailModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeDetailModal() {
    dom.detailModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    appState.selectedProduct = null;
  }

  function updateLikeButtonUI(isLiked, count) {
    if (!dom.btnDetailLike) return;
    if (isLiked) {
      dom.btnDetailLike.classList.add('is-liked');
      dom.btnDetailLike.setAttribute('aria-pressed', 'true');
    } else {
      dom.btnDetailLike.classList.remove('is-liked');
      dom.btnDetailLike.setAttribute('aria-pressed', 'false');
    }
    if (dom.detailLikeCount) {
      dom.detailLikeCount.textContent = count || 0;
    }
  }

  // 6. 글쓰기 & 수정 모달 제어
  function openWriteModal() {
    appState.editingProduct = null;
    if (dom.writeModalHeading) dom.writeModalHeading.textContent = '내 물건 팔기';
    if (dom.writeSubmitBtn) {
      const span = dom.writeSubmitBtn.querySelector('span');
      if (span) span.textContent = '🥔 작성 완료';
    }
    resetWriteForm();
    dom.writeModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (dom.writeTitle) dom.writeTitle.focus();
    }, 100);
  }

  function openEditModal(product) {
    if (!product) return;
    appState.editingProduct = product;
    closeDetailModal();

    // 글쓰기 모달 텍스트를 수정 모드로 변경
    if (dom.writeModalHeading) dom.writeModalHeading.textContent = '🥔 내 물건 정보 수정하기';
    if (dom.writeSubmitBtn) {
      const span = dom.writeSubmitBtn.querySelector('span');
      if (span) span.textContent = '🥔 수정 완료';
    }

    // 폼에 기존 값 세팅
    if (dom.writeTitle) dom.writeTitle.value = product.title || '';
    if (dom.writeTitleCount) dom.writeTitleCount.textContent = (product.title || '').length;
    if (dom.writeCategory) dom.writeCategory.value = product.category || '';
    if (dom.writeLocation) dom.writeLocation.value = product.location || '서울시 마포구 연남동';
    if (dom.writeDescription) dom.writeDescription.value = product.description || '';
    if (dom.writeDescCount) dom.writeDescCount.textContent = (product.description || '').length;

    const isFree = product.price === 0;
    if (dom.writeFreeShare) dom.writeFreeShare.checked = isFree;
    if (dom.writePrice) {
      dom.writePrice.disabled = isFree;
      dom.writePrice.value = isFree ? '0' : Number(product.price).toLocaleString();
    }
    if (dom.writePriceKorean) {
      dom.writePriceKorean.textContent = isFree ? '무료 나눔' : numberToKorean(product.price);
    }

    // 판매 상태 세그먼트 세팅
    const radio = dom.writeForm ? dom.writeForm.querySelector(`input[name="status"][value="${product.status}"]`) : null;
    if (radio) radio.checked = true;

    // 이미지 세팅
    if (product.image && product.image !== DEFAULT_POTATO_IMG) {
      appState.writeFormImage = product.image;
      if (dom.writeUploadedImg) {
        dom.writeUploadedImg.src = product.image;
        dom.writeUploadedImg.style.display = 'block';
      }
      if (dom.writeDefaultPotato) dom.writeDefaultPotato.style.display = 'none';
      if (dom.writeBtnRemoveFile) dom.writeBtnRemoveFile.style.display = 'inline-flex';
    } else {
      appState.writeFormImage = null;
      if (dom.writeUploadedImg) dom.writeUploadedImg.style.display = 'none';
      if (dom.writeDefaultPotato) dom.writeDefaultPotato.style.display = 'flex';
      if (dom.writeBtnRemoveFile) dom.writeBtnRemoveFile.style.display = 'none';
    }

    dom.writeModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (dom.writeTitle) dom.writeTitle.focus();
    }, 100);
  }

  function closeWriteModal() {
    dom.writeModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    appState.editingProduct = null;
  }

  function resetWriteForm() {
    if (dom.writeForm) dom.writeForm.reset();
    appState.writeFormImage = null;
    if (dom.writeUploadedImg) {
      dom.writeUploadedImg.src = '';
      dom.writeUploadedImg.style.display = 'none';
    }
    if (dom.writeDefaultPotato) {
      dom.writeDefaultPotato.style.display = 'flex';
    }
    if (dom.writeBtnRemoveFile) {
      dom.writeBtnRemoveFile.style.display = 'none';
    }
    if (dom.writeTitleCount) dom.writeTitleCount.textContent = '0';
    if (dom.writeDescCount) dom.writeDescCount.textContent = '0';
    if (dom.writePriceKorean) dom.writePriceKorean.textContent = '0원';

    // 에러 메시지 초기화
    document.querySelectorAll('.field-error-msg').forEach(el => el.textContent = '');
  }

  // 6-1. 인증 상태 UI 업데이트 (로그인 전: [로그인]만 표시 / 로그인 후: [닉네임]과 [로그아웃]만 표시)
  function updateAuthUI() {
    if (!dom.authGuestSection || !dom.authUserSection) return;

    if (appState.currentUser) {
      dom.authGuestSection.style.display = 'none';
      dom.authUserSection.style.display = 'inline-flex';

      const nickname = appState.currentProfile?.nickname 
        || appState.currentUser.user_metadata?.nickname 
        || appState.currentUser.email?.split('@')[0] 
        || '감자이웃';

      if (dom.headerUserName) {
        dom.headerUserName.textContent = nickname;
      }
    } else {
      dom.authGuestSection.style.display = 'inline-flex';
      dom.authUserSection.style.display = 'none';
    }
  }

  // 6-2. 로그인 / 회원가입 모달 제어
  function openAuthModal(tab = 'login', noticeText = '') {
    switchAuthTab(tab);

    if (dom.authNoticeBanner && dom.authNoticeText) {
      if (noticeText) {
        dom.authNoticeText.textContent = noticeText;
        dom.authNoticeBanner.style.display = 'flex';
      } else {
        dom.authNoticeBanner.style.display = 'none';
      }
    }

    dom.authModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    // 첫 번째 입력창에 자동 포커스
    setTimeout(() => {
      if (tab === 'login' && dom.loginEmail) {
        dom.loginEmail.focus();
      } else if (tab === 'signup' && dom.signupNickname) {
        dom.signupNickname.focus();
      }
    }, 100);
  }

  function closeAuthModal() {
    dom.authModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    resetAuthForms();
  }

  function switchAuthTab(tab) {
    appState.authModalTab = tab;
    resetAuthForms();

    if (tab === 'login') {
      if (dom.tabAuthLogin) {
        dom.tabAuthLogin.classList.add('active');
        dom.tabAuthLogin.setAttribute('aria-selected', 'true');
      }
      if (dom.tabAuthSignup) {
        dom.tabAuthSignup.classList.remove('active');
        dom.tabAuthSignup.setAttribute('aria-selected', 'false');
      }
      if (dom.loginForm) dom.loginForm.style.display = 'flex';
      if (dom.signupForm) dom.signupForm.style.display = 'none';
    } else {
      if (dom.tabAuthSignup) {
        dom.tabAuthSignup.classList.add('active');
        dom.tabAuthSignup.setAttribute('aria-selected', 'true');
      }
      if (dom.tabAuthLogin) {
        dom.tabAuthLogin.classList.remove('active');
        dom.tabAuthLogin.setAttribute('aria-selected', 'false');
      }
      if (dom.loginForm) dom.loginForm.style.display = 'none';
      if (dom.signupForm) dom.signupForm.style.display = 'flex';
    }
  }

  function resetAuthForms() {
    if (dom.loginForm) dom.loginForm.reset();
    if (dom.signupForm) dom.signupForm.reset();
    if (dom.loginGlobalError) {
      dom.loginGlobalError.textContent = '';
      dom.loginGlobalError.style.display = 'none';
    }
    if (dom.signupGlobalError) {
      dom.signupGlobalError.textContent = '';
      dom.signupGlobalError.style.display = 'none';
    }
    ['login-email-error', 'login-password-error', 'signup-nickname-error', 'signup-email-error', 'signup-password-error', 'signup-password-confirm-error'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
  }

  function translateAuthError(err) {
    if (!err || !err.message) return '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    const msg = err.message.toLowerCase();
    if (msg.includes('invalid login credentials') || msg.includes('invalid_grant')) {
      return '이메일 또는 비밀번호가 올바르지 않습니다.';
    }
    if (msg.includes('user already registered') || msg.includes('already exists')) {
      return '이미 가입된 이메일 주소입니다. 로그인 탭에서 로그인을 진행해 주세요.';
    }
    if (msg.includes('email not confirmed')) {
      return '이메일 인증 확인 중입니다. 잠시 후 다시 로그인해 주세요.';
    }
    if (msg.includes('password should be at least')) {
      return '비밀번호는 최소 6자 이상이어야 합니다.';
    }
    if (msg.includes('invalid email') || msg.includes('unable to validate email')) {
      return '유효한 이메일 형식을 입력해 주세요.';
    }
    return err.message;
  }

  // 7. 이벤트 리스너 등록
  function initEventListeners() {
    // --- 검색창 실시간 필터링 ---
    if (dom.searchInput) {
      let timer;
      dom.searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        appState.searchKeyword = val;
        if (dom.btnClearSearch) {
          dom.btnClearSearch.style.display = val.length > 0 ? 'flex' : 'none';
        }
        clearTimeout(timer);
        timer = setTimeout(renderProductList, 150);
      });
    }

    if (dom.btnClearSearch) {
      dom.btnClearSearch.addEventListener('click', () => {
        dom.searchInput.value = '';
        appState.searchKeyword = '';
        dom.btnClearSearch.style.display = 'none';
        dom.searchInput.focus();
        renderProductList();
      });
    }

    // --- 카테고리 칩 클릭 ---
    dom.categoryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        dom.categoryChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        appState.currentCategory = chip.getAttribute('data-category');
        renderProductList();
      });
    });

    // --- 거래 가능만 보기 토글 ---
    if (dom.toggleAvailable) {
      dom.toggleAvailable.addEventListener('change', (e) => {
        appState.availableOnly = e.target.checked;
        renderProductList();
      });
    }

    // --- 필터 초기화 버튼 ---
    if (dom.btnResetFilters) {
      dom.btnResetFilters.addEventListener('click', () => {
        appState.searchKeyword = '';
        appState.currentCategory = '전체';
        appState.availableOnly = false;
        if (dom.searchInput) dom.searchInput.value = '';
        if (dom.btnClearSearch) dom.btnClearSearch.style.display = 'none';
        if (dom.toggleAvailable) dom.toggleAvailable.checked = false;
        dom.categoryChips.forEach(c => {
          c.classList.toggle('active', c.getAttribute('data-category') === '전체');
        });
        renderProductList();
        showToast('🥔 필터가 초기화되었습니다.');
      });
    }

    // --- 로그인 버튼 클릭 (로그인 모달 열기) ---
    if (dom.btnLogin) {
      dom.btnLogin.addEventListener('click', () => {
        appState.pendingActionAfterLogin = null;
        openAuthModal('login');
      });
    }

    // --- 로그아웃 버튼 클릭 ---
    if (dom.btnLogout) {
      dom.btnLogout.addEventListener('click', async () => {
        try {
          if (window.GamzaSupabase && typeof window.GamzaSupabase.signOut === 'function') {
            await window.GamzaSupabase.signOut();
          }
          appState.currentUser = null;
          appState.currentProfile = null;
          updateAuthUI();
          showToast('🥔 안전하게 로그아웃되었습니다.');
        } catch (err) {
          console.warn('🥔 로그아웃 오류:', err);
          showToast('로그아웃 중 오류가 발생했습니다.');
        }
      });
    }

    // --- 글쓰기 버튼 클릭 (요구사항 3: 미로그인 시 로그인 모달 먼저 띄우고 성공 시 글쓰기 모달 이어 띄움) ---
    if (dom.btnOpenWrite) {
      dom.btnOpenWrite.addEventListener('click', () => {
        if (!appState.currentUser) {
          appState.pendingActionAfterLogin = 'openWrite';
          openAuthModal('login', '글을 작성하려면 먼저 로그인이 필요해요! 🥔');
          return;
        }
        openWriteModal();
      });
    }

    // --- 상세 모달 닫기 이벤트 ---
    dom.detailModal.querySelectorAll('[data-action="close"]').forEach(btn => {
      btn.addEventListener('click', closeDetailModal);
    });

    // --- 상세 모달 내 관심 추가 버튼 ---
    if (dom.btnDetailLike) {
      dom.btnDetailLike.addEventListener('click', () => {
        if (!appState.selectedProduct) return;
        const p = appState.selectedProduct;
        p.isLiked = !p.isLiked;
        p.likeCount = (p.likeCount || 0) + (p.isLiked ? 1 : -1);
        updateLikeButtonUI(p.isLiked, p.likeCount);

        if (p.isLiked) {
          showToast('🥔 따뜻한 관심 목록에 담겼어요! ❤️');
        } else {
          showToast('관심 목록에서 제외되었습니다.');
        }

        // Supabase DB에 like_count 실시간 반영
        if (window.GamzaSupabase && typeof window.GamzaSupabase.toggleProductLike === 'function') {
          window.GamzaSupabase.toggleProductLike(p.id, p.isLiked).then(newCount => {
            if (typeof newCount === 'number') {
              p.likeCount = newCount;
              updateLikeButtonUI(p.isLiked, p.likeCount);
              renderProductList();
            }
          }).catch(err => console.warn('🥔 관심 수 DB 업데이트 오류:', err));
        }
      });
    }

    // --- 상세 모달 내 채팅 시작하기 버튼 ---
    if (dom.btnDetailChat) {
      dom.btnDetailChat.addEventListener('click', () => {
        showToast('💬 채팅 기능은 준비 중입니다. 곧 열릴 예정이에요!');
      });
    }

    // --- [작성자 전용] 판매 상태 변경 칩 버튼 (판매중 / 예약중 / 거래 완료) ---
    if (dom.ownerStatusChips) {
      dom.ownerStatusChips.forEach(chip => {
        chip.addEventListener('click', async () => {
          if (!appState.selectedProduct) return;
          const p = appState.selectedProduct;
          const newStatus = chip.getAttribute('data-status');
          if (!newStatus || p.status === newStatus) return;

          p.status = newStatus;

          // 상세 모달 상태 뱃지 업데이트
          if (dom.detailStatus) {
            dom.detailStatus.textContent = newStatus;
            dom.detailStatus.className = 'gamza-badge ' + getStatusBadgeClass(newStatus);
          }

          // 칩 활성화 상태 토글
          dom.ownerStatusChips.forEach(c => {
            c.classList.toggle('active', c.getAttribute('data-status') === newStatus);
          });

          // 로컬 배열의 상태도 동기화
          const localItem = appState.products.find(item => String(item.id) === String(p.id));
          if (localItem) localItem.status = newStatus;

          // 목록 카드 및 배지 즉시 리렌더링 (요구사항 2: 상태배지 및 거래완료 시 흐리게)
          renderProductList();

          // Supabase DB 비동기 반영
          if (window.GamzaSupabase && typeof window.GamzaSupabase.updateProductStatus === 'function') {
            try {
              await window.GamzaSupabase.updateProductStatus(p.id, newStatus);
              console.log('🥔 Supabase DB 상태 변경 완료:', p.id, newStatus);
            } catch (err) {
              console.warn('🥔 DB 상태 변경 오류:', err);
            }
          }

          showToast(`🥔 판매 상태가 '${newStatus}'(으)로 변경되었습니다.`);
        });
      });
    }

    // --- [작성자 전용] 게시글 수정 버튼 바인딩 ---
    const handleEditProduct = () => {
      if (appState.selectedProduct) {
        openEditModal(appState.selectedProduct);
      }
    };
    if (dom.btnOwnerEdit) dom.btnOwnerEdit.addEventListener('click', handleEditProduct);
    if (dom.btnOwnerEditFooter) dom.btnOwnerEditFooter.addEventListener('click', handleEditProduct);

    // --- [작성자 전용] 게시글 삭제 버튼 바인딩 ---
    const handleDeleteProduct = async () => {
      if (!appState.selectedProduct) return;
      const p = appState.selectedProduct;

      const confirmed = window.confirm(`"${p.title}"\n정말 이 게시글을 삭제하시겠습니까? 🥔`);
      if (!confirmed) return;

      const deleteId = p.id;

      // 로컬 목록에서 제거
      appState.products = appState.products.filter(item => String(item.id) !== String(deleteId));
      closeDetailModal();
      renderProductList();
      showToast('🥔 게시글이 삭제되었습니다.');

      // Supabase DB 비동기 삭제
      if (window.GamzaSupabase && typeof window.GamzaSupabase.deleteProduct === 'function') {
        try {
          await window.GamzaSupabase.deleteProduct(deleteId);
          console.log('🥔 Supabase DB 게시글 삭제 완료:', deleteId);
        } catch (err) {
          console.warn('🥔 DB 게시글 삭제 오류:', err);
        }
      }
    };
    if (dom.btnOwnerDelete) dom.btnOwnerDelete.addEventListener('click', handleDeleteProduct);
    if (dom.btnOwnerDeleteFooter) dom.btnOwnerDeleteFooter.addEventListener('click', handleDeleteProduct);

    // --- 글쓰기 모달 닫기 이벤트 ---
    if (dom.writeCloseBtn) dom.writeCloseBtn.addEventListener('click', closeWriteModal);
    if (dom.writeCancelBtn) dom.writeCancelBtn.addEventListener('click', closeWriteModal);
    const writeBackdrop = dom.writeModal.querySelector('.gamza-modal-backdrop');
    if (writeBackdrop) {
      writeBackdrop.addEventListener('click', (e) => {
        if (e.target === writeBackdrop) closeWriteModal();
      });
    }

    // --- 인증 모달 닫기 이벤트 ---
    if (dom.authCloseBtn) dom.authCloseBtn.addEventListener('click', closeAuthModal);
    if (dom.authModal) {
      const authBackdrop = dom.authModal.querySelector('.gamza-modal-backdrop');
      if (authBackdrop) {
        authBackdrop.addEventListener('click', (e) => {
          if (e.target === authBackdrop) closeAuthModal();
        });
      }
    }

    // --- ESC 키 모달 닫기 (상세/글쓰기/인증 모달) ---
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!dom.detailModal.hasAttribute('hidden')) closeDetailModal();
        if (!dom.writeModal.hasAttribute('hidden')) closeWriteModal();
        if (dom.authModal && !dom.authModal.hasAttribute('hidden')) closeAuthModal();
      }
    });

    // --- 인증 모달 탭 전환 & 링크 바인딩 ---
    if (dom.tabAuthLogin) dom.tabAuthLogin.addEventListener('click', () => switchAuthTab('login'));
    if (dom.tabAuthSignup) dom.tabAuthSignup.addEventListener('click', () => switchAuthTab('signup'));
    if (dom.btnSwitchToSignup) dom.btnSwitchToSignup.addEventListener('click', () => switchAuthTab('signup'));
    if (dom.btnSwitchToLogin) dom.btnSwitchToLogin.addEventListener('click', () => switchAuthTab('login'));

    // --- 로그인 폼 제출 이벤트 ---
    if (dom.loginForm) {
      dom.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (dom.loginEmail.value || '').trim();
        const password = dom.loginPassword.value || '';

        const setErr = (id, msg) => {
          const el = document.getElementById(id);
          if (el) el.textContent = msg;
        };
        setErr('login-email-error', '');
        setErr('login-password-error', '');
        if (dom.loginGlobalError) {
          dom.loginGlobalError.textContent = '';
          dom.loginGlobalError.style.display = 'none';
        }

        if (!email) {
          setErr('login-email-error', '이메일을 입력해 주세요.');
          dom.loginEmail.focus();
          return;
        }
        if (!password) {
          setErr('login-password-error', '비밀번호를 입력해 주세요.');
          dom.loginPassword.focus();
          return;
        }

        const originalBtnText = dom.btnSubmitLogin.innerHTML;
        dom.btnSubmitLogin.disabled = true;
        dom.btnSubmitLogin.innerHTML = '<span>로그인 중... 🥔</span>';

        try {
          if (!window.GamzaSupabase || typeof window.GamzaSupabase.signIn !== 'function') {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
          }

          const res = await window.GamzaSupabase.signIn(email, password);
          appState.currentUser = res.user;
          appState.currentProfile = res.profile;

          updateAuthUI();
          closeAuthModal();

          const nick = res.profile?.nickname 
            || res.user?.user_metadata?.nickname 
            || email.split('@')[0];
          showToast(`🥔 ${nick}님, 어서오세요! 반갑습니다.`);

          // 미로그인 상태에서 글쓰기를 눌렀던 경우 바로 글쓰기 모달 띄우기
          if (appState.pendingActionAfterLogin === 'openWrite') {
            appState.pendingActionAfterLogin = null;
            setTimeout(() => {
              openWriteModal();
            }, 250);
          }
        } catch (err) {
          console.warn('🥔 로그인 오류:', err);
          const friendlyMsg = translateAuthError(err);
          if (dom.loginGlobalError) {
            dom.loginGlobalError.textContent = friendlyMsg;
            dom.loginGlobalError.style.display = 'block';
          }
        } finally {
          dom.btnSubmitLogin.disabled = false;
          dom.btnSubmitLogin.innerHTML = originalBtnText;
        }
      });
    }

    // --- 회원가입 폼 제출 이벤트 ---
    if (dom.signupForm) {
      dom.signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nickname = (dom.signupNickname.value || '').trim();
        const email = (dom.signupEmail.value || '').trim();
        const password = dom.signupPassword.value || '';
        const passwordConfirm = dom.signupPasswordConfirm.value || '';

        const setErr = (id, msg) => {
          const el = document.getElementById(id);
          if (el) el.textContent = msg;
        };
        setErr('signup-nickname-error', '');
        setErr('signup-email-error', '');
        setErr('signup-password-error', '');
        setErr('signup-password-confirm-error', '');
        if (dom.signupGlobalError) {
          dom.signupGlobalError.textContent = '';
          dom.signupGlobalError.style.display = 'none';
        }

        // 닉네임 필수 검증
        if (!nickname) {
          setErr('signup-nickname-error', '활동할 닉네임을 입력해 주세요.');
          dom.signupNickname.focus();
          return;
        }
        if (nickname.length < 2 || nickname.length > 20) {
          setErr('signup-nickname-error', '닉네임은 2~20자 사이로 입력해 주세요.');
          dom.signupNickname.focus();
          return;
        }

        if (!email) {
          setErr('signup-email-error', '이메일을 입력해 주세요.');
          dom.signupEmail.focus();
          return;
        }

        if (!password || password.length < 6) {
          setErr('signup-password-error', '비밀번호는 최소 6자 이상이어야 합니다.');
          dom.signupPassword.focus();
          return;
        }

        if (password !== passwordConfirm) {
          setErr('signup-password-confirm-error', '비밀번호가 일치하지 않습니다.');
          dom.signupPasswordConfirm.focus();
          return;
        }

        const originalBtnText = dom.btnSubmitSignup.innerHTML;
        dom.btnSubmitSignup.disabled = true;
        dom.btnSubmitSignup.innerHTML = '<span>가입 처리 중... 🥔</span>';

        try {
          if (!window.GamzaSupabase || typeof window.GamzaSupabase.signUp !== 'function') {
            throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
          }

          const res = await window.GamzaSupabase.signUp(email, password, nickname);

          if (res.needsEmailConfirmation) {
            showToast('🥔 인증 이메일이 발송되었습니다! 메일함을 확인해 주세요.');
            closeAuthModal();
            return;
          }

          appState.currentUser = res.user;
          appState.currentProfile = res.profile;

          updateAuthUI();
          closeAuthModal();

          showToast(`🥔 환영합니다, ${nickname}님! 감자 마켓 회원이 되셨어요.`);

          // 미로그인 상태에서 글쓰기를 눌렀던 경우 바로 글쓰기 모달 띄우기
          if (appState.pendingActionAfterLogin === 'openWrite') {
            appState.pendingActionAfterLogin = null;
            setTimeout(() => {
              openWriteModal();
            }, 250);
          }
        } catch (err) {
          console.warn('🥔 회원가입 오류:', err);
          const friendlyMsg = translateAuthError(err);
          if (dom.signupGlobalError) {
            dom.signupGlobalError.textContent = friendlyMsg;
            dom.signupGlobalError.style.display = 'block';
          }
        } finally {
          dom.btnSubmitSignup.disabled = false;
          dom.btnSubmitSignup.innerHTML = originalBtnText;
        }
      });
    }

    // --- 글쓰기 이미지 파일 업로드 & 미리보기 ---
    if (dom.writeBtnSelectFile && dom.writeImageInput) {
      dom.writeBtnSelectFile.addEventListener('click', (e) => {
        e.stopPropagation();
        dom.writeImageInput.click();
      });
    }

    if (dom.writeImageDropzone && dom.writeImageInput) {
      dom.writeImageDropzone.addEventListener('click', () => {
        dom.writeImageInput.click();
      });

      // 드래그 앤 드롭 지원
      dom.writeImageDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dom.writeImageDropzone.style.borderColor = 'var(--gamza-point-yellow)';
      });
      dom.writeImageDropzone.addEventListener('dragleave', () => {
        dom.writeImageDropzone.style.borderColor = '';
      });
      dom.writeImageDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dom.writeImageDropzone.style.borderColor = '';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleImageFile(e.dataTransfer.files[0]);
        }
      });
    }

    if (dom.writeImageInput) {
      dom.writeImageInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleImageFile(e.target.files[0]);
        }
      });
    }

    if (dom.writeBtnRemoveFile) {
      dom.writeBtnRemoveFile.addEventListener('click', (e) => {
        e.stopPropagation();
        appState.writeFormImage = null;
        dom.writeImageInput.value = '';
        dom.writeUploadedImg.src = '';
        dom.writeUploadedImg.style.display = 'none';
        dom.writeDefaultPotato.style.display = 'flex';
        dom.writeBtnRemoveFile.style.display = 'none';
      });
    }

    function handleImageFile(file) {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        appState.writeFormImage = e.target.result;
        dom.writeUploadedImg.src = e.target.result;
        dom.writeUploadedImg.style.display = 'block';
        dom.writeDefaultPotato.style.display = 'none';
        dom.writeBtnRemoveFile.style.display = 'inline-flex';
      };
      reader.readAsDataURL(file);
    }

    // 글자 수 카운터 (제목)
    if (dom.writeTitle && dom.writeTitleCount) {
      dom.writeTitle.addEventListener('input', (e) => {
        dom.writeTitleCount.textContent = e.target.value.length;
      });
    }

    // 글자 수 카운터 (설명 - 최대 500자)
    if (dom.writeDescription && dom.writeDescCount) {
      dom.writeDescription.addEventListener('input', (e) => {
        if (e.target.value.length > 500) {
          e.target.value = e.target.value.slice(0, 500);
        }
        dom.writeDescCount.textContent = e.target.value.length;
        const errEl = document.getElementById('write-description-error');
        if (errEl) errEl.textContent = '';
      });
    }

    // 가격 입력 & 콤마 포맷팅 & 한글 금액 안내
    if (dom.writePrice) {
      dom.writePrice.addEventListener('input', (e) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val) {
          e.target.value = Number(val).toLocaleString();
          dom.writePriceKorean.textContent = numberToKorean(val);
        } else {
          e.target.value = '';
          dom.writePriceKorean.textContent = '0원';
        }
        if (dom.writeFreeShare) dom.writeFreeShare.checked = false;
      });
    }

    // 무료 나눔 체크박스
    if (dom.writeFreeShare) {
      dom.writeFreeShare.addEventListener('change', (e) => {
        if (e.target.checked) {
          dom.writePrice.value = '0';
          dom.writePrice.disabled = true;
          dom.writePriceKorean.textContent = '무료 나눔';
        } else {
          dom.writePrice.value = '';
          dom.writePrice.disabled = false;
          dom.writePriceKorean.textContent = '0원';
          dom.writePrice.focus();
        }
      });
    }

    // 빠른 동네 선택 칩
    document.querySelectorAll('.chip-item').forEach(chip => {
      chip.addEventListener('click', () => {
        const loc = chip.getAttribute('data-location');
        if (dom.writeLocation && loc) {
          dom.writeLocation.value = loc;
        }
      });
    });

    // --- 글쓰기 폼 제출 (작성 완료) ---
    if (dom.writeForm) {
      dom.writeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 유효성 검사
        const title = (dom.writeTitle.value || '').trim();
        const category = dom.writeCategory.value;
        const isFree = dom.writeFreeShare && dom.writeFreeShare.checked;
        const rawPrice = dom.writePrice.value.replace(/[^0-9]/g, '');
        const location = (dom.writeLocation.value || '').trim();
        const description = (dom.writeDescription.value || '').trim();
        const statusEl = dom.writeForm.querySelector('input[name="status"]:checked');
        const status = statusEl ? statusEl.value : '판매중';

        let isValid = true;
        const setErr = (id, msg) => {
          const el = document.getElementById(id);
          if (el) el.textContent = msg;
          if (msg) isValid = false;
        };

        // 초기화
        setErr('write-title-error', '');
        setErr('write-category-error', '');
        setErr('write-price-error', '');
        setErr('write-location-error', '');
        setErr('write-description-error', '');

        if (!title || title.length < 2) {
          setErr('write-title-error', '상품명을 2자 이상 입력해 주세요.');
          dom.writeTitle.focus();
          return;
        }

        if (!category) {
          setErr('write-category-error', '카테고리를 선택해 주세요.');
          dom.writeCategory.focus();
          return;
        }

        let priceNum = 0;
        if (!isFree) {
          if (!rawPrice) {
            setErr('write-price-error', '가격을 입력해 주세요. (무료 나눔은 체크)');
            dom.writePrice.focus();
            return;
          }
          priceNum = Number(rawPrice);
        }

        if (!location) {
          setErr('write-location-error', '거래 희망 동네를 입력해 주세요.');
          dom.writeLocation.focus();
          return;
        }

        if (!description || description.length < 5) {
          setErr('write-description-error', '상품에 대한 설명을 5자 이상 적어주세요.');
          dom.writeDescription.focus();
          return;
        }

        if (description.length > 500) {
          setErr('write-description-error', '자세한 설명은 최대 500자까지 작성할 수 있습니다.');
          dom.writeDescription.focus();
          return;
        }

        // [수정 모드 처리]
        if (appState.editingProduct) {
          const editId = appState.editingProduct.id;
          const updatedPayload = {
            title: title,
            category: category,
            price: priceNum,
            location: location,
            status: status,
            image: appState.writeFormImage || appState.editingProduct.image || DEFAULT_POTATO_IMG,
            description: description
          };

          // 로컬 데이터 즉시 갱신
          const target = appState.products.find(p => String(p.id) === String(editId));
          if (target) {
            Object.assign(target, updatedPayload);
          }
          if (appState.selectedProduct && String(appState.selectedProduct.id) === String(editId)) {
            Object.assign(appState.selectedProduct, updatedPayload);
          }

          // Supabase DB 비동기 갱신
          if (window.GamzaSupabase && typeof window.GamzaSupabase.updateProduct === 'function') {
            window.GamzaSupabase.updateProduct(editId, updatedPayload).then(saved => {
              if (saved) {
                if (target) Object.assign(target, saved);
                renderProductList();
                console.log('🥔 Supabase DB 게시글 수정 성공:', editId);
              }
            }).catch(err => {
              console.warn('🥔 Supabase DB 게시글 수정 오류:', err);
            });
          }

          closeWriteModal();
          renderProductList();
          showToast('🥔 게시글이 성공적으로 수정되었습니다!');
          return;
        }

        // [신규 등록 모드 처리]
        // 현재 로그인된 작성자 정보 주입 (요구사항 4: 작성자가 DB에 함께 저장되고 목록/상세에 노출)
        const currentUserId = appState.currentUser ? appState.currentUser.id : null;
        const currentNick = appState.currentProfile?.nickname 
          || appState.currentUser?.user_metadata?.nickname 
          || (appState.currentUser?.email ? appState.currentUser.email.split('@')[0] : '따뜻한감자이웃');
        const currentAvatar = appState.currentProfile?.avatar_url 
          || DEFAULT_SELLER_AVATAR;
        const currentManner = appState.currentProfile?.manner_temp 
          ? Number(appState.currentProfile.manner_temp) 
          : 99.0;

        // 새 상품 객체 생성
        const newProduct = {
          id: Date.now(),
          sellerId: currentUserId,
          title: title,
          category: category,
          price: priceNum,
          location: location,
          timeAgo: '방금 전',
          status: status,
          image: appState.writeFormImage || DEFAULT_POTATO_IMG,
          description: description,
          seller: {
            nickname: currentNick,
            avatar: currentAvatar,
            location: location,
            mannerTemp: currentManner
          },
          likeCount: 0,
          isLiked: false
        };

        // 상품 목록 최상단에 추가 (인메모리 배열)
        appState.products.unshift(newProduct);

        // Supabase DB 비동기 저장 (작성자 ID 전달)
        if (window.GamzaSupabase && typeof window.GamzaSupabase.createProduct === 'function') {
          window.GamzaSupabase.createProduct(newProduct, currentUserId).then(saved => {
            if (saved && saved.id) {
              Object.assign(newProduct, saved);
              renderProductList();
              console.log('🥔 Supabase DB에 새 상품 저장 성공:', saved.id);
              showToast('🥔 Supabase 클라우드 DB에 안전하게 등록되었습니다! ✨');
            }
          }).catch(err => {
            console.warn('🥔 Supabase DB 저장 오류 (로컬 유지):', err);
          });
        }

        // 글쓰기 모달 닫기
        closeWriteModal();

        // 목록 새로고침 및 피드백
        renderProductList();
        showToast('🥔 새 상품이 성공적으로 등록되었습니다!');

        // 최상단으로 부드럽게 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 커스텀 이벤트 호환성 바인딩
    window.addEventListener('gamza:open-detail', (e) => {
      if (e.detail) openDetailModal(e.detail);
    });
    window.addEventListener('gamza:open-write', openWriteModal);
  }

  // 8. 앱 초기화
  async function init() {
    initEventListeners();
    updateSupabaseStatus('connecting');

    // 1) Supabase 인증 세션 복원 및 실시간 상태 리스너 등록
    if (window.GamzaSupabase) {
      if (typeof window.GamzaSupabase.getCurrentUser === 'function') {
        try {
          const user = await window.GamzaSupabase.getCurrentUser();
          if (user) {
            appState.currentUser = user;
            if (typeof window.GamzaSupabase.getProfile === 'function') {
              appState.currentProfile = await window.GamzaSupabase.getProfile(user.id);
            }
          }
        } catch (e) {
          console.warn('🥔 기존 로그인 세션 복원 에러:', e);
        }
      }
      updateAuthUI();

      if (typeof window.GamzaSupabase.onAuthStateChange === 'function') {
        window.GamzaSupabase.onAuthStateChange(async (event, session) => {
          console.log('🥔 [Auth Change]:', event);
          if (session && session.user) {
            appState.currentUser = session.user;
            if (typeof window.GamzaSupabase.getProfile === 'function') {
              appState.currentProfile = await window.GamzaSupabase.getProfile(session.user.id);
            }
          } else {
            appState.currentUser = null;
            appState.currentProfile = null;
          }
          updateAuthUI();
        });
      }
    } else {
      updateAuthUI();
    }

    // Supabase 연결 및 초기 데이터 비동기 로드
    if (window.GamzaSupabase && typeof window.GamzaSupabase.fetchProducts === 'function') {
      try {
        const isConnected = await window.GamzaSupabase.checkConnection();
        if (isConnected) {
          const remoteProducts = await window.GamzaSupabase.fetchProducts();
          if (remoteProducts && remoteProducts.length > 0) {
            appState.products = remoteProducts;
            renderProductList();
            updateSupabaseStatus('connected');
            showToast('🥔 Supabase 클라우드 데이터베이스와 연결되었습니다!');
            console.log(`🥔 Supabase DB로부터 상품 ${remoteProducts.length}개를 성공적으로 불러왔습니다.`);
          } else {
            renderProductList();
            updateSupabaseStatus('connected');
          }

          // Realtime 변경 구독 (실시간 데이터 동기화)
          if (typeof window.GamzaSupabase.subscribeToProducts === 'function') {
            window.GamzaSupabase.subscribeToProducts(async () => {
              const fresh = await window.GamzaSupabase.fetchProducts();
              if (fresh && fresh.length > 0) {
                appState.products = fresh;
                renderProductList();
                showToast('🥔 실시간으로 매물 목록이 갱신되었습니다!');
              }
            });
          }
        } else {
          updateSupabaseStatus('offline');
          renderProductList();
        }
      } catch (err) {
        console.warn('🥔 Supabase 초기 데이터 조회 폴백:', err);
        updateSupabaseStatus('offline');
        renderProductList();
      }
    } else {
      updateSupabaseStatus('offline');
      renderProductList();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 전역 API 노출
  window.GamzaApp = {
    state: appState,
    render: renderProductList,
    openDetail: openDetailModal,
    closeDetail: closeDetailModal,
    openWrite: openWriteModal,
    closeWrite: closeWriteModal,
    openAuth: openAuthModal,
    closeAuth: closeAuthModal,
    showToast: showToast
  };
})();
