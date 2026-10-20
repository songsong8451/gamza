/**
 * [화면 1] 감자(Gamza) 상품 목록 자바스크립트 모듈
 * 기능:
 * - Mock 상품 데이터 렌더링 (7종)
 * - 카테고리 필터링 ('전체', '디지털기기', '가구/인테리어', '의류', '생활가전', '도서/티켓', '반려동물 용품', '기타')
 * - 실시간 상품명 검색 (디바운스 적용 및 검색어 지우기 버튼)
 * - '거래 가능만 보기' 토글 스위치 (거래 완료 상품 숨김 처리)
 * - 카드 클릭 시 'gamza:open-detail' 커스텀 이벤트 발송
 * - 글쓰기 버튼 클릭 시 'gamza:open-write' 커스텀 이벤트 발송
 * - 로그인 버튼 클릭 시 준비 중 안내 토스트
 * - 외부 연동 API: window.GamzaProductList & 'gamza:add-product' 이벤트 지원
 */

(function () {
  'use strict';

  // 1. Mock 상품 데이터셋 (총 6개)
  const INITIAL_MOCK_PRODUCTS = [
    {
      id: 1,
      title: '아이패드 에어 5세대 64GB WiFi 스타라이트 (배터리 98%)',
      category: '디지털기기',
      price: 520000,
      location: '역삼동',
      timeAgo: '15분 전',
      status: '판매중', // '판매중' | '예약중' | '거래 완료'
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
      description: '실사용 6개월 미만이며 케이스와 강화유리를 항상 착용하여 기스 없이 깔끔합니다. 풀박스 구성이며 직거래 환영합니다.'
    },
    {
      id: 2,
      title: '원목 2단 협탁 / 미니 사이드 테이블 (감성 인테리어)',
      category: '가구/인테리어',
      price: 28000,
      location: '서초2동',
      timeAgo: '42분 전',
      status: '예약중',
      image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600&auto=format&fit=crop&q=80',
      description: '원목 색감이 따뜻하고 아담해서 침대 옆이나 소파 옆에 두기 좋습니다. 이사 가게 되어 급처합니다.'
    },
    {
      id: 3,
      title: '파타고니아 레트로X 클래식 플리스 자켓 (아이보리, M)',
      category: '의류',
      price: 115000,
      location: '대치1동',
      timeAgo: '2시간 전',
      status: '판매중',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
      description: '파타고니아 정품 매장에서 구매했습니다. 드라이클리닝 후 보관 중이며 보풀 및 오염 전혀 없습니다.'
    },
    {
      id: 4,
      title: '드롱기 아이코나 빈티지 무선 전기포트 (올리브그린)',
      category: '생활가전',
      price: 45000,
      location: '양재1동',
      timeAgo: '5시간 전',
      status: '거래 완료',
      image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80',
      description: '주방 분위기를 살려주는 예쁜 전기주전자입니다. 내부 구연산 세척 마쳤고 작동 상태 아주 좋습니다.'
    },
    {
      id: 5,
      title: '[새책수준] Clean Code 클린 코드 애자일 소프트웨어 장인 정신',
      category: '도서/티켓',
      price: 18000,
      location: '도곡동',
      timeAgo: '1일 전',
      status: '판매중',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      description: '필기나 밑줄 전혀 없고 겉표지도 깨끗합니다. 개발자 필독서로 추천드립니다.'
    },
    {
      id: 6,
      title: '강원도 고랭지 흙감자 5kg (포슬포슬 꿀맛 보장)',
      category: '기타',
      price: 13000,
      location: '개포2동',
      timeAgo: '2일 전',
      status: '판매중',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
      description: '부모님이 강원도에서 직접 정성껏 수확하신 햇감자입니다. 쪄먹어도 맛있고 볶아 먹어도 정말 맛있습니다!'
    },
    {
      id: 7,
      title: '원목 캣타워 & 푹신한 강아지 마약방석 세트',
      category: '반려동물 용품',
      price: 32000,
      location: '삼성동',
      timeAgo: '3시간 전',
      status: '판매중',
      image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=600&auto=format&fit=crop&q=80',
      description: '인테리어와 잘 어울리는 자작나무 원목 캣타워와 거의 사용하지 않은 푹신한 마약방석입니다. 깨끗하게 세탁 완료했습니다.'
    }
  ];

  // 대체용 귀여운 감자 SVG 이미지 (네트워크 실패 또는 이미지 없을 때 폴백)
  const FALLBACK_POTATO_IMG = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <rect width="100%" height="100%" fill="#F7F3EE"/>
      <g transform="translate(150, 140)">
        <!-- 감자 몸체 -->
        <path d="M-60,-40 C-80,-20 -90,30 -50,65 C-10,95 60,85 80,45 C95,10 80,-50 40,-65 C0,-75 -40,-60 -60,-40 Z" fill="#C68B59"/>
        <!-- 감자 눈/입 -->
        <circle cx="-20" cy="-5" r="5" fill="#4A2E18"/>
        <circle cx="20" cy="-5" r="5" fill="#4A2E18"/>
        <ellipse cx="-35" cy="10" rx="7" ry="4" fill="#F4A261" opacity="0.6"/>
        <ellipse cx="35" cy="10" rx="7" ry="4" fill="#F4A261" opacity="0.6"/>
        <path d="M-8,12 Q0,20 8,12" fill="none" stroke="#4A2E18" stroke-width="3" stroke-linecap="round"/>
        <!-- 감자 싹 -->
        <path d="M0,-70 Q10,-85 20,-80 Q10,-70 5,-66" fill="#81C784"/>
      </g>
      <text x="150" y="240" font-family="sans-serif" font-size="14" font-weight="bold" fill="#8D5B4C" text-anchor="middle">감자 마켓 🥔</text>
    </svg>
  `);

  // 2. 상태 저장소 (State)
  const state = {
    products: [...INITIAL_MOCK_PRODUCTS],
    currentCategory: '전체',
    searchKeyword: '',
    availableOnly: false
  };

  // 3. 통화 포맷터 (콤마 포맷 e.g. 18,000원)
  const currencyFormatter = new Intl.NumberFormat('ko-KR');

  function formatPrice(price) {
    if (price === 0 || price === '0') return '무료나눔';
    return `${currencyFormatter.format(price)}원`;
  }

  // 4. 상태 뱃지 매핑 함수
  function getStatusMeta(status) {
    switch (status) {
      case '판매중':
        return {
          className: 'status-selling',
          text: '판매중',
          icon: '●'
        };
      case '예약중':
        return {
          className: 'status-reserved',
          text: '예약중',
          icon: '⏳'
        };
      case '거래 완료':
      case '거래완료':
        return {
          className: 'status-completed',
          text: '거래 완료',
          icon: '✓'
        };
      default:
        return {
          className: 'status-selling',
          text: status || '판매중',
          icon: '●'
        };
    }
  }

  // 5. 토스트 메시지 함수
  let toastTimer = null;
  function showToast(message, duration = 2400) {
    const toastEl = document.getElementById('gamza-toast');
    if (!toastEl) {
      alert(message);
      return;
    }
    toastEl.textContent = message;
    toastEl.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, duration);
  }

  // 6. 상품 카드 HTML 템플릿 생성
  function createProductCardHTML(product) {
    const statusMeta = getStatusMeta(product.status);
    const isCompleted = product.status === '거래 완료' || product.status === '거래완료';
    const safeTitle = escapeHTML(product.title);
    const safeLocation = escapeHTML(product.location || '동네 인증');
    const safeTimeAgo = escapeHTML(product.timeAgo || '방금 전');
    const safeCategory = escapeHTML(product.category || '기타');
    const displayPrice = formatPrice(product.price);
    const imageUrl = product.image || FALLBACK_POTATO_IMG;

    return `
      <article 
        class="gamza-card" 
        data-id="${product.id}" 
        role="button" 
        tabindex="0"
        aria-label="${safeTitle}, 가격 ${displayPrice}, 판매상태 ${statusMeta.text}"
      >
        <div class="card-thumbnail-wrap ${isCompleted ? 'is-completed' : ''}">
          <img 
            src="${imageUrl}" 
            alt="${safeTitle}" 
            class="card-image" 
            loading="lazy"
            onerror="this.onerror=null; this.src='${FALLBACK_POTATO_IMG}';"
          />
        </div>
        <div class="card-body">
          <div class="card-top-row">
            <span class="card-category-tag">${safeCategory}</span>
            <span class="card-status-badge ${statusMeta.className}">
              <span class="status-dot" aria-hidden="true">${statusMeta.icon}</span>
              ${statusMeta.text}
            </span>
          </div>
          <h3 class="card-title" title="${safeTitle}">${safeTitle}</h3>
          <div class="card-meta">
            <span class="meta-location">${safeLocation}</span>
            <span class="meta-divider" aria-hidden="true">·</span>
            <span class="meta-time">${safeTimeAgo}</span>
          </div>
          <div class="card-price-row">
            <span class="card-price">${displayPrice}</span>
          </div>
        </div>
      </article>
    `;
  }

  // 간단한 XSS 방지 함수
  function escapeHTML(str) {
    if (typeof str !== 'string') return String(str ?? '');
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 7. 상품 목록 필터링 및 렌더링
  function render() {
    const gridEl = document.getElementById('product-grid');
    const emptyStateEl = document.getElementById('empty-state');
    const countEl = document.getElementById('product-count');

    if (!gridEl) return;

    // 필터링 적용
    const filtered = state.products.filter(item => {
      // 1) 카테고리 필터
      if (state.currentCategory !== '전체' && item.category !== state.currentCategory) {
        return false;
      }

      // 2) '거래 가능만 보기' 필터 (거래 완료 상품 제외)
      if (state.availableOnly) {
        const isCompleted = item.status === '거래 완료' || item.status === '거래완료';
        if (isCompleted) return false;
      }

      // 3) 검색어 필터 (상품명 또는 동네명 대소문자 무관 검색)
      if (state.searchKeyword) {
        const query = state.searchKeyword.toLowerCase().trim();
        const matchTitle = (item.title || '').toLowerCase().includes(query);
        const matchLocation = (item.location || '').toLowerCase().includes(query);
        const matchCategory = (item.category || '').toLowerCase().includes(query);
        if (!matchTitle && !matchLocation && !matchCategory) {
          return false;
        }
      }

      return true;
    });

    // 개수 업데이트
    if (countEl) {
      countEl.innerHTML = `총 <strong>${filtered.length}</strong>개`;
    }

    // 목록이 비어 있는 경우
    if (filtered.length === 0) {
      gridEl.innerHTML = '';
      if (emptyStateEl) emptyStateEl.style.display = 'block';
      return;
    }

    if (emptyStateEl) emptyStateEl.style.display = 'none';

    // 카드 그리드 HTML 렌더링
    gridEl.innerHTML = filtered.map(item => createProductCardHTML(item)).join('');

    // 각 카드에 클릭 이벤트 연결
    gridEl.querySelectorAll('.gamza-card').forEach(cardEl => {
      const productId = parseInt(cardEl.dataset.id, 10);
      const product = state.products.find(p => p.id === productId);

      const triggerOpenDetail = () => {
        if (!product) return;
        // 요구사항: window.dispatchEvent(new CustomEvent('gamza:open-detail', { detail: product }))
        const event = new CustomEvent('gamza:open-detail', {
          bubbles: true,
          detail: { ...product }
        });
        window.dispatchEvent(event);
      };

      cardEl.addEventListener('click', triggerOpenDetail);

      // 키보드 접근성 (Enter / Space 키로도 상세 진입 지원)
      cardEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerOpenDetail();
        }
      });
    });
  }

  // 8. 이벤트 바인딩
  function bindEvents() {
    // 1) 로고 클릭 -> 홈/필터 초기화
    const logoEl = document.getElementById('header-logo');
    if (logoEl) {
      logoEl.addEventListener('click', (e) => {
        e.preventDefault();
        resetFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 2) 글쓰기 버튼 -> 'gamza:open-write' 이벤트 발송
    const btnWrite = document.getElementById('btn-open-write');
    if (btnWrite) {
      btnWrite.addEventListener('click', () => {
        const event = new CustomEvent('gamza:open-write', {
          bubbles: true,
          detail: { timestamp: Date.now() }
        });
        window.dispatchEvent(event);
      });
    }

    // 3) 로그인 버튼 -> 준비 중 안내
    const btnLogin = document.getElementById('btn-login');
    if (btnLogin) {
      btnLogin.addEventListener('click', () => {
        showToast('🥔 로그인 기능은 준비 중입니다. 곧 만나요!');
      });
    }

    // 4) 카테고리 칩 클릭
    const categoryContainer = document.getElementById('category-filter-list');
    if (categoryContainer) {
      categoryContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.category-chip');
        if (!chip) return;

        const selectedCategory = chip.dataset.category;
        if (!selectedCategory) return;

        categoryContainer.querySelectorAll('.category-chip').forEach(btn => {
          btn.classList.toggle('active', btn === chip);
        });

        state.currentCategory = selectedCategory;
        render();
      });
    }

    // 5) '거래 가능만 보기' 토글 스위치
    const toggleAvailable = document.getElementById('toggle-available-only');
    if (toggleAvailable) {
      toggleAvailable.checked = state.availableOnly;
      toggleAvailable.addEventListener('change', (e) => {
        state.availableOnly = e.target.checked;
        render();
      });
    }

    // 6) 실시간 검색 인풋
    const searchInput = document.getElementById('search-input');
    const btnClearSearch = document.getElementById('btn-clear-search');

    if (searchInput) {
      let debounceTimer = null;
      searchInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (btnClearSearch) {
          btnClearSearch.style.display = value ? 'flex' : 'none';
        }

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          state.searchKeyword = value;
          render();
        }, 150); // 부드러운 150ms 실시간 디바운스
      });

      if (btnClearSearch) {
        btnClearSearch.addEventListener('click', () => {
          searchInput.value = '';
          state.searchKeyword = '';
          btnClearSearch.style.display = 'none';
          searchInput.focus();
          render();
        });
      }
    }

    // 7) 빈 상태 '필터 초기화' 버튼
    const btnResetFilters = document.getElementById('btn-reset-filters');
    if (btnResetFilters) {
      btnResetFilters.addEventListener('click', () => {
        resetFilters();
      });
    }

    // 8) 외부 이벤트 수신: 새 상품 등록 ('gamza:add-product')
    window.addEventListener('gamza:add-product', (e) => {
      if (e.detail) {
        addProduct(e.detail);
        showToast('🥔 새 판매글이 등록되었습니다!');
      }
    });

    // 9) 외부 이벤트 수신: 상품 상태 변경 ('gamza:update-status')
    window.addEventListener('gamza:update-status', (e) => {
      if (e.detail && e.detail.id && e.detail.status) {
        updateProductStatus(e.detail.id, e.detail.status);
      }
    });

    // 10) 외부 이벤트 수신: 상품 목록 재조회 요청 ('gamza:refresh-list')
    window.addEventListener('gamza:refresh-list', () => {
      render();
    });
  }

  // 9. 필터 초기화 함수
  function resetFilters() {
    state.currentCategory = '전체';
    state.searchKeyword = '';
    state.availableOnly = false;

    // 카테고리 칩 활성화 상태 초기화
    const categoryContainer = document.getElementById('category-filter-list');
    if (categoryContainer) {
      categoryContainer.querySelectorAll('.category-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.category === '전체');
      });
    }

    // 검색창 초기화
    const searchInput = document.getElementById('search-input');
    const btnClearSearch = document.getElementById('btn-clear-search');
    if (searchInput) searchInput.value = '';
    if (btnClearSearch) btnClearSearch.style.display = 'none';

    // 토글 초기화
    const toggleAvailable = document.getElementById('toggle-available-only');
    if (toggleAvailable) toggleAvailable.checked = false;

    render();
  }

  // 10. 외부 연동 함수들 (API)
  function addProduct(newProduct) {
    const item = {
      id: newProduct.id || Date.now(),
      title: newProduct.title || '제목 없음',
      category: newProduct.category || '기타',
      price: Number(newProduct.price) || 0,
      location: newProduct.location || '역삼동',
      timeAgo: newProduct.timeAgo || '방금 전',
      status: newProduct.status || '판매중',
      image: newProduct.image || FALLBACK_POTATO_IMG,
      description: newProduct.description || ''
    };

    // 최신 등록글이 맨 앞에 오도록 추가
    state.products.unshift(item);
    render();
  }

  function updateProductStatus(id, newStatus) {
    const target = state.products.find(p => p.id === id);
    if (target) {
      target.status = newStatus;
      render();
    }
  }

  function setProducts(productsList) {
    if (Array.isArray(productsList)) {
      state.products = [...productsList];
      render();
    }
  }

  function getProducts() {
    return [...state.products];
  }

  // 11. 초기화 함수
  function init() {
    bindEvents();
    render();
  }

  // 전역 객체 노출 (다른 화면 모듈이나 인라인 스크립트에서 직접 제어 가능)
  window.GamzaProductList = {
    init,
    render,
    resetFilters,
    addProduct,
    updateProductStatus,
    setProducts,
    getProducts,
    showToast,
    MOCK_PRODUCTS: INITIAL_MOCK_PRODUCTS
  };

  // DOM 로드 시 자동 초기화 (컨테이너 요소가 DOM에 이미 존재할 경우)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('gamza-product-list-container')) {
        init();
      }
    });
  } else {
    if (document.getElementById('gamza-product-list-container')) {
      init();
    }
  }
})();
