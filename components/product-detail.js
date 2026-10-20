/**
 * ==========================================================================
 * [화면 2] 감자(Gamza) 상품 상세 모달 팝업 컨트롤러
 * components/product-detail.js
 * ==========================================================================
 */

(function () {
  'use strict';

  // 귀여운 감자 기본 아바타 SVG (외부 네트워크 없이도 항상 안정적으로 표시)
  const DEFAULT_POTATO_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23F7EFE5"/><ellipse cx="50" cy="53" rx="32" ry="26" fill="%23C87941"/><circle cx="42" cy="49" r="3.2" fill="%232C2420"/><circle cx="58" cy="49" r="3.2" fill="%232C2420"/><ellipse cx="36" cy="54" rx="4" ry="2.5" fill="%23E76F51" opacity="0.7"/><ellipse cx="64" cy="54" rx="4" ry="2.5" fill="%23E76F51" opacity="0.7"/><path d="M 45 56 Q 50 61 55 56" stroke="%232C2420" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`;

  // 상품 대표 이미지 대체용 SVG
  const DEFAULT_PRODUCT_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300"><rect width="100%" height="100%" fill="%23FAF4EC"/><g transform="translate(150, 100)"><ellipse cx="50" cy="45" rx="46" ry="38" fill="%23D48B50"/><ellipse cx="38" cy="40" rx="4" ry="3" fill="%238B5A2B" opacity="0.4"/><ellipse cx="62" cy="52" rx="3" ry="2.5" fill="%238B5A2B" opacity="0.4"/><circle cx="44" cy="42" r="3.5" fill="%232C2420"/><circle cx="58" cy="42" r="3.5" fill="%232C2420"/><ellipse cx="36" cy="47" rx="4.5" ry="2.5" fill="%23E76F51" opacity="0.7"/><ellipse cx="66" cy="47" rx="4.5" ry="2.5" fill="%23E76F51" opacity="0.7"/><path d="M 47 48 Q 51 53 55 48" stroke="%232C2420" stroke-width="2.2" fill="none" stroke-linecap="round"/></g><text x="200" y="215" font-family="sans-serif" font-size="14" font-weight="bold" fill="%238C7F78" text-anchor="middle">포슬포슬 따뜻한 감자 상품</text></svg>`;

  // 모달 마크업 템플릿 (DOM에 #gamza-detail-modal이 없을 때 자동 주입)
  const MODAL_HTML_TEMPLATE = `
<div id="gamza-detail-modal" class="gamza-modal" role="dialog" aria-modal="true" aria-labelledby="gamza-detail-title" hidden>
  <div class="gamza-modal-backdrop" data-action="close" aria-hidden="true"></div>
  <div class="gamza-modal-container" role="document">
    <button type="button" class="gamza-modal-close-btn gamza-detail-close-btn" data-action="close" aria-label="팝업 닫기" title="닫기 (ESC)">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div class="gamza-modal-scrollable">
      <div class="gamza-detail-media-wrap">
        <img id="gamza-detail-image" class="gamza-detail-image" src="" alt="상품 대표 이미지" loading="eager" />
        <div class="gamza-image-fallback" id="gamza-image-fallback" style="display: none;" aria-hidden="true">
          <span class="fallback-icon">🥔</span>
          <span class="fallback-text">이미지를 불러올 수 없습니다</span>
        </div>
        <div class="gamza-image-gradient-overlay" aria-hidden="true"></div>
      </div>
      <div class="gamza-detail-content">
        <div class="gamza-detail-meta-row">
          <span id="gamza-detail-status" class="gamza-badge gamza-badge--sale">판매중</span>
          <span id="gamza-detail-category" class="gamza-category-tag">기타</span>
        </div>
        <h2 id="gamza-detail-title" class="gamza-detail-title">상품 제목</h2>
        <div class="gamza-detail-submeta">
          <span class="gamza-submeta-item gamza-location-item">
            <svg class="submeta-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span id="gamza-detail-location">동네 정보</span>
          </span>
          <span class="gamza-submeta-divider" aria-hidden="true">•</span>
          <span class="gamza-submeta-item gamza-time-item">
            <svg class="submeta-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span id="gamza-detail-time">방금 전</span>
          </span>
        </div>
        <div class="gamza-detail-price-wrap">
          <span id="gamza-detail-price" class="gamza-detail-price">0</span>
          <span class="gamza-price-unit">원</span>
        </div>
        <div class="gamza-detail-divider" aria-hidden="true"></div>
        <div class="gamza-detail-desc-wrap">
          <h3 class="gamza-section-title">상품 설명</h3>
          <p id="gamza-detail-description" class="gamza-detail-description">상품 설명 내용</p>
        </div>
        <div class="gamza-detail-divider" aria-hidden="true"></div>
        <div class="gamza-seller-card" id="gamza-seller-card">
          <div class="gamza-seller-main">
            <div class="gamza-seller-avatar-wrap">
              <img id="gamza-seller-avatar" class="gamza-seller-avatar" src="" alt="판매자 프로필" />
              <span class="gamza-seller-potato-badge" title="따뜻한 감자 이웃">🥔</span>
            </div>
            <div class="gamza-seller-info">
              <div class="gamza-seller-name-row">
                <span id="gamza-seller-name" class="gamza-seller-name">감자왕김감자</span>
                <span class="gamza-verified-badge" title="동네 인증 완료">동네인증</span>
              </div>
              <span id="gamza-seller-location" class="gamza-seller-location">우리 동네</span>
            </div>
          </div>
          <div class="gamza-warmth-card" id="gamza-warmth-card">
            <div class="gamza-warmth-header">
              <div class="gamza-warmth-title-group">
                <span class="gamza-warmth-emoji" aria-hidden="true">🔥</span>
                <span class="gamza-warmth-label">감자 지수</span>
              </div>
              <span id="gamza-warmth-temp" class="gamza-warmth-temp">따뜻한 감자 99℃</span>
            </div>
            <div class="gamza-warmth-bar-track" role="progressbar" aria-valuenow="99" aria-valuemin="0" aria-valuemax="100">
              <div id="gamza-warmth-bar-fill" class="gamza-warmth-bar-fill" style="width: 99%;"></div>
            </div>
            <div class="gamza-warmth-footer">
              <span id="gamza-warmth-message" class="gamza-warmth-message">포슬포슬 맛있게 잘 익은 최고 감자예요! 🥔✨</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="gamza-detail-footer">
      <button type="button" id="btn-gamza-detail-like" class="gamza-btn-like" aria-label="관심 목록에 추가" aria-pressed="false">
        <span class="like-icon-wrap" aria-hidden="true">
          <svg class="like-heart-icon" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </span>
        <span id="gamza-detail-like-count" class="like-count-text">0</span>
      </button>
      <button type="button" id="btn-gamza-detail-chat" class="gamza-btn-chat">
        <svg class="chat-btn-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span class="chat-btn-text">채팅 시작하기</span>
      </button>
    </footer>
    <div id="gamza-detail-toast" class="gamza-detail-toast" role="status" aria-live="polite"></div>
  </div>
</div>
`;

  // 상태 관리 객체
  let currentProduct = null;
  let toastTimer = null;
  let isInitialized = false;

  // DOM 캐시
  let elements = {};

  /**
   * DOM 요소 참조 바인딩
   */
  function bindElements() {
    let modal = document.getElementById('gamza-detail-modal');
    if (!modal) {
      // DOM에 모달이 없으면 body에 자동 삽입
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = MODAL_HTML_TEMPLATE.trim();
      modal = tempDiv.firstElementChild;
      document.body.appendChild(modal);
    }

    elements = {
      modal: modal,
      backdrop: modal.querySelector('.gamza-modal-backdrop'),
      container: modal.querySelector('.gamza-modal-container'),
      closeBtn: modal.querySelector('.gamza-modal-close-btn'),
      scrollable: modal.querySelector('.gamza-modal-scrollable'),
      image: modal.querySelector('#gamza-detail-image'),
      imageFallback: modal.querySelector('#gamza-image-fallback'),
      status: modal.querySelector('#gamza-detail-status'),
      category: modal.querySelector('#gamza-detail-category'),
      title: modal.querySelector('#gamza-detail-title'),
      location: modal.querySelector('#gamza-detail-location'),
      time: modal.querySelector('#gamza-detail-time'),
      price: modal.querySelector('#gamza-detail-price'),
      priceUnit: modal.querySelector('.gamza-price-unit'),
      description: modal.querySelector('#gamza-detail-description'),
      sellerAvatar: modal.querySelector('#gamza-seller-avatar'),
      sellerName: modal.querySelector('#gamza-seller-name'),
      sellerLocation: modal.querySelector('#gamza-seller-location'),
      warmthTemp: modal.querySelector('#gamza-warmth-temp'),
      warmthBarFill: modal.querySelector('#gamza-warmth-bar-fill'),
      warmthMessage: modal.querySelector('#gamza-warmth-message'),
      warmthTrack: modal.querySelector('.gamza-warmth-bar-track'),
      likeBtn: modal.querySelector('#btn-gamza-detail-like'),
      likeCount: modal.querySelector('#gamza-detail-like-count'),
      chatBtn: modal.querySelector('#btn-gamza-detail-chat'),
      toast: modal.querySelector('#gamza-detail-toast')
    };

    // 이미지 로드 에러 처리
    if (elements.image) {
      elements.image.onerror = function () {
        this.src = DEFAULT_PRODUCT_IMAGE;
      };
    }

    // 판매자 아바타 로드 에러 처리
    if (elements.sellerAvatar) {
      elements.sellerAvatar.onerror = function () {
        this.src = DEFAULT_POTATO_AVATAR;
      };
    }
  }

  /**
   * 이벤트 리스너 등록
   */
  function attachEvents() {
    if (isInitialized) return;

    // 1. 닫기 버튼 및 배경 클릭 시 닫기
    if (elements.modal) {
      elements.modal.addEventListener('click', function (e) {
        const actionClose = e.target.closest('[data-action="close"]');
        if (actionClose) {
          e.preventDefault();
          GamzaDetail.close();
        }
      });
    }

    // 2. ESC 키 입력 시 닫기
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && GamzaDetail.isOpen()) {
        e.preventDefault();
        GamzaDetail.close();
      }
    });

    // 3. 관심 추가 버튼 클릭
    if (elements.likeBtn) {
      elements.likeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        GamzaDetail.toggleLike();
      });
    }

    // 4. 채팅 시작하기 버튼 클릭
    if (elements.chatBtn) {
      elements.chatBtn.addEventListener('click', function (e) {
        e.preventDefault();
        GamzaDetail.showToast('💬 채팅 기능은 준비 중입니다. 조금만 기다려주세요!');

        // 채팅 시도 커스텀 이벤트 발행
        window.dispatchEvent(new CustomEvent('gamza:detail:chat', {
          detail: {
            productId: currentProduct ? currentProduct.id : null,
            product: currentProduct,
            seller: currentProduct ? currentProduct.seller : null
          }
        }));
      });
    }

    // 5. 전역 커스텀 이벤트 연동 (화면 1 등 타 컴포넌트 연동용)
    window.addEventListener('gamza:open-detail', function (e) {
      if (e.detail) {
        GamzaDetail.open(e.detail);
      }
    });

    window.addEventListener('gamza:close-detail', function () {
      GamzaDetail.close();
    });

    isInitialized = true;
  }

  /**
   * 가격 포맷터 (숫자 -> 18,000)
   */
  function formatPrice(val) {
    if (val === 0 || val === '0') return '0';
    if (!val) return '0';
    const num = typeof val === 'number' ? val : parseInt(String(val).replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? '0' : num.toLocaleString('ko-KR');
  }

  /**
   * 상대 시간 문자열 생성 보조기
   */
  function formatTime(val) {
    if (!val) return '방금 전';
    if (typeof val === 'string' && (val.includes('전') || val.includes('방금'))) {
      return val;
    }
    try {
      const date = new Date(val);
      if (isNaN(date.getTime())) return String(val);
      const now = new Date();
      const diffSec = Math.floor((now - date) / 1000);
      if (diffSec < 60) return '방금 전';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}분 전`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour}시간 전`;
      const diffDay = Math.floor(diffHour / 24);
      return `${diffDay}일 전`;
    } catch (_) {
      return String(val);
    }
  }

  /**
   * 판매 상태 뱃지 업데이트
   */
  function updateStatusBadge(status) {
    if (!elements.status) return;

    // 초기화
    elements.status.className = 'gamza-badge';

    const normalized = String(status || '').toUpperCase().replace(/\s+/g, '');
    if (normalized === 'FOR_SALE' || normalized === '판매중' || normalized === 'SALE') {
      elements.status.classList.add('gamza-badge--sale');
      elements.status.textContent = '판매중';
    } else if (normalized === 'RESERVED' || normalized === '예약중') {
      elements.status.classList.add('gamza-badge--reserved');
      elements.status.textContent = '예약중';
    } else if (normalized === 'SOLD_OUT' || normalized === '거래완료' || normalized === 'SOLD') {
      elements.status.classList.add('gamza-badge--sold');
      elements.status.textContent = '거래완료';
    } else {
      elements.status.classList.add('gamza-badge--sale');
      elements.status.textContent = status || '판매중';
    }
  }

  /**
   * 감자 지수(매너온도) 렌더링
   */
  function updateWarmthMeter(tempInput, labelInput) {
    let temp = 99.0;
    if (typeof tempInput === 'number' && !isNaN(tempInput)) {
      temp = tempInput;
    } else if (typeof tempInput === 'string') {
      const parsed = parseFloat(tempInput);
      if (!isNaN(parsed)) temp = parsed;
    }

    const tempFormatted = temp.toFixed(1).replace('.0', '');
    const displayText = labelInput || `따뜻한 감자 ${tempFormatted}℃`;

    if (elements.warmthTemp) {
      elements.warmthTemp.textContent = displayText;
    }

    // 0~100 사이 비율 계산 (감자지수는 0~100 기준)
    const percentage = Math.min(Math.max(temp, 0), 100);

    if (elements.warmthBarFill) {
      elements.warmthBarFill.style.width = `${percentage}%`;

      // 온도별 그라데이션 커스텀
      if (temp >= 80) {
        elements.warmthBarFill.style.background = 'linear-gradient(90deg, #F4A261 0%, #E76F51 55%, #C87941 100%)';
      } else if (temp >= 50) {
        elements.warmthBarFill.style.background = 'linear-gradient(90deg, #E9C46A 0%, #F4A261 100%)';
      } else {
        elements.warmthBarFill.style.background = 'linear-gradient(90deg, #81D4FA 0%, #4FC3F7 100%)';
      }
    }

    if (elements.warmthTrack) {
      elements.warmthTrack.setAttribute('aria-valuenow', percentage);
    }

    // 온도별 멘트
    if (elements.warmthMessage) {
      if (temp >= 80) {
        elements.warmthMessage.textContent = '포슬포슬 맛있게 잘 익은 최고 감자예요! 🥔✨';
      } else if (temp >= 50) {
        elements.warmthMessage.textContent = '따끈따끈 훈훈한 온기를 품은 좋은 이웃 감자예요! 🥔♨️';
      } else if (temp >= 36.5) {
        elements.warmthMessage.textContent = '기본 매너가 훌륭한 신뢰할 수 있는 감자예요! 🥔';
      } else {
        elements.warmthMessage.textContent = '조금 더 온기가 필요한 새싹 감자예요 🌱';
      }
    }
  }

  /**
   * 관심(좋아요) 버튼 UI 동기화
   */
  function syncLikeUI(liked, count) {
    if (!elements.likeBtn) return;

    if (liked) {
      elements.likeBtn.classList.add('is-liked');
      elements.likeBtn.setAttribute('aria-pressed', 'true');
      elements.likeBtn.setAttribute('aria-label', '관심 목록에서 제거');
    } else {
      elements.likeBtn.classList.remove('is-liked');
      elements.likeBtn.setAttribute('aria-pressed', 'false');
      elements.likeBtn.setAttribute('aria-label', '관심 목록에 추가');
    }

    if (elements.likeCount) {
      elements.likeCount.textContent = count !== undefined ? count : 0;
    }
  }

  /**
   * 공개 API 객체 (GamzaDetail)
   */
  const GamzaDetail = {
    /**
     * 모달 초기화
     */
    init: function () {
      bindElements();
      attachEvents();
    },

    /**
     * 모달 열림 여부
     */
    isOpen: function () {
      return elements.modal && !elements.modal.hasAttribute('hidden') && elements.modal.style.display !== 'none';
    },

    /**
     * 현재 열린 상품 데이터 반환
     */
    getProduct: function () {
      return currentProduct;
    },

    /**
     * 상품 상세 모달 열기
     * @param {Object} product - 상품 데이터 객체
     */
    open: function (product) {
      this.init();
      if (!product) return;

      currentProduct = {
        id: product.id || product._id || Date.now(),
        title: product.title || product.name || '제목 없는 감자 매물',
        price: product.price !== undefined ? product.price : 0,
        category: product.category || product.categoryName || '기타',
        status: product.status || 'FOR_SALE',
        location: product.location || product.region || (product.seller && product.seller.location) || '우리 동네',
        time: product.timeAgo || product.time || formatTime(product.createdAt),
        image: product.image || product.imageUrl || (Array.isArray(product.images) && product.images[0]) || DEFAULT_PRODUCT_IMAGE,
        description: product.description || product.content || '작성된 상세 설명이 없습니다.',
        seller: {
          name: (product.seller && (product.seller.name || product.seller.nickname)) || '감자왕김감자',
          avatar: (product.seller && (product.seller.avatar || product.seller.profileImg)) || DEFAULT_POTATO_AVATAR,
          location: (product.seller && product.seller.location) || product.location || '강원도 춘천시 퇴계동',
          temperature: (product.seller && (product.seller.temperature || product.seller.mannerTemp || product.seller.potatoIndex)) ?? 99.0,
          temperatureLabel: (product.seller && product.seller.temperatureLabel) || null
        },
        liked: Boolean(product.liked || product.isLiked),
        likeCount: Number(product.likeCount || product.likes || 0)
      };

      // 1. 이미지 설정
      if (elements.image) {
        elements.image.src = currentProduct.image;
        elements.image.alt = currentProduct.title;
      }

      // 2. 메타 & 타이틀
      updateStatusBadge(currentProduct.status);
      if (elements.category) elements.category.textContent = currentProduct.category;
      if (elements.title) elements.title.textContent = currentProduct.title;
      if (elements.location) elements.location.textContent = currentProduct.location;
      if (elements.time) elements.time.textContent = currentProduct.time;

      // 3. 가격
      if (elements.price) {
        if (currentProduct.price === 0 || currentProduct.isFree) {
          elements.price.textContent = '무료나눔';
          if (elements.priceUnit) elements.priceUnit.style.display = 'none';
        } else {
          elements.price.textContent = formatPrice(currentProduct.price);
          if (elements.priceUnit) elements.priceUnit.style.display = 'inline';
        }
      }

      // 4. 상품 설명
      if (elements.description) {
        elements.description.textContent = currentProduct.description;
      }

      // 5. 판매자 정보
      if (elements.sellerAvatar) {
        elements.sellerAvatar.src = currentProduct.seller.avatar || DEFAULT_POTATO_AVATAR;
        elements.sellerAvatar.alt = `${currentProduct.seller.name} 님의 프로필`;
      }
      if (elements.sellerName) {
        elements.sellerName.textContent = currentProduct.seller.name;
      }
      if (elements.sellerLocation) {
        elements.sellerLocation.textContent = currentProduct.seller.location;
      }

      // 6. 감자 지수
      updateWarmthMeter(currentProduct.seller.temperature, currentProduct.seller.temperatureLabel);

      // 7. 관심 버튼 상태
      syncLikeUI(currentProduct.liked, currentProduct.likeCount);

      // 스크롤 맨 위로 초기화
      if (elements.scrollable) {
        elements.scrollable.scrollTop = 0;
      }

      // 모달 표시 & 배경 스크롤 방지
      elements.modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';

      // 닫기 버튼에 포커스 (접근성)
      if (elements.closeBtn) {
        elements.closeBtn.focus();
      }

      // 전역 커스텀 이벤트 발행
      window.dispatchEvent(new CustomEvent('gamza:detail:open', {
        detail: { product: currentProduct }
      }));
    },

    /**
     * 모달 닫기
     */
    close: function () {
      if (!this.isOpen()) return;

      elements.modal.setAttribute('hidden', '');
      document.body.style.overflow = '';

      // 토스트 정리
      if (elements.toast) {
        elements.toast.classList.remove('is-show');
      }

      // 전역 커스텀 이벤트 발행
      window.dispatchEvent(new CustomEvent('gamza:detail:close', {
        detail: { product: currentProduct }
      }));
    },

    /**
     * 관심 토글
     */
    toggleLike: function () {
      if (!currentProduct) return;

      currentProduct.liked = !currentProduct.liked;
      if (currentProduct.liked) {
        currentProduct.likeCount += 1;
        this.showToast('관심 목록에 담겼어요! 🥔❤️');
      } else {
        currentProduct.likeCount = Math.max(0, currentProduct.likeCount - 1);
        this.showToast('관심 목록에서 해제했어요.');
      }

      syncLikeUI(currentProduct.liked, currentProduct.likeCount);

      // 관심 변경 이벤트 발행
      window.dispatchEvent(new CustomEvent('gamza:detail:like', {
        detail: {
          productId: currentProduct.id,
          liked: currentProduct.liked,
          likeCount: currentProduct.likeCount
        }
      }));

      // 목록 뷰 동기화용 이벤트
      window.dispatchEvent(new CustomEvent('gamza:like-toggle', {
        detail: {
          productId: currentProduct.id,
          liked: currentProduct.liked,
          likeCount: currentProduct.likeCount
        }
      }));
    },

    /**
     * 관심 여부 확인
     */
    isLiked: function () {
      return currentProduct ? currentProduct.liked : false;
    },

    /**
     * 모달 내 인라인 토스트 표시
     * @param {string} message 
     * @param {number} duration 
     */
    showToast: function (message, duration = 2400) {
      if (!elements.toast) return;

      if (toastTimer) {
        clearTimeout(toastTimer);
        toastTimer = null;
      }

      elements.toast.textContent = message;
      elements.toast.classList.add('is-show');

      toastTimer = setTimeout(() => {
        elements.toast.classList.remove('is-show');
        toastTimer = null;
      }, duration);
    }
  };

  // 전역 노출
  window.GamzaDetail = GamzaDetail;

  // DOM 로드 완료 시 초기 바인딩
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GamzaDetail.init());
  } else {
    GamzaDetail.init();
  }
})();
