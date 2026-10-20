/**
 * ========================================================
 * 감자(Gamza) 중고거래 - [화면 3: 글쓰기 모달 스크립트]
 * 파일명: components/product-write.js
 * ========================================================
 */

(function () {
  'use strict';

  // 기본 감자 캐릭터 SVG Data URL (이미지 미업로드 시 기본값으로 사용)
  const DEFAULT_POTATO_SVG_RAW = `<svg viewBox="0 0 160 160" width="160" height="160" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="writePotatoGrad" cx="38%" cy="32%" r="68%">
        <stop offset="0%" stop-color="#F2C58F" />
        <stop offset="55%" stop-color="#C68B59" />
        <stop offset="100%" stop-color="#8D5B4C" />
      </radialGradient>
      <filter id="potatoSoftShadow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#8D5B4C" flood-opacity="0.22" />
      </filter>
    </defs>
    <ellipse cx="80" cy="144" rx="46" ry="9" fill="#8D5B4C" opacity="0.18" />
    <path d="M 80,24 C 118,22 138,48 139,78 C 140,110 120,136 82,136 C 44,136 21,108 23,74 C 25,40 48,26 80,24 Z" fill="url(#writePotatoGrad)" filter="url(#potatoSoftShadow)" />
    <path d="M 80,25 C 80,11 89,5 95,8 C 97,17 90,23 83,26 Z" fill="#70A957" />
    <path d="M 77,25 C 74,14 67,10 63,14 C 63,22 70,25 75,26 Z" fill="#8AC926" />
    <circle cx="48" cy="55" r="2.2" fill="#6B3E31" opacity="0.35" />
    <circle cx="114" cy="58" r="2.8" fill="#6B3E31" opacity="0.35" />
    <circle cx="42" cy="95" r="2.0" fill="#6B3E31" opacity="0.35" />
    <circle cx="118" cy="98" r="2.4" fill="#6B3E31" opacity="0.35" />
    <circle cx="68" cy="122" r="2.0" fill="#6B3E31" opacity="0.35" />
    <circle cx="53" cy="85" r="7.5" fill="#F4A261" opacity="0.75" />
    <circle cx="107" cy="85" r="7.5" fill="#F4A261" opacity="0.75" />
    <ellipse cx="61" cy="74" rx="4" ry="5.5" fill="#2D231E" />
    <circle cx="62.5" cy="72" r="1.5" fill="#FFFFFF" />
    <ellipse cx="99" cy="74" rx="4" ry="5.5" fill="#2D231E" />
    <circle cx="100.5" cy="72" r="1.5" fill="#FFFFFF" />
    <path d="M 72,83 Q 80,91 88,83" fill="none" stroke="#2D231E" stroke-width="2.6" stroke-linecap="round" />
  </svg>`;

  const DEFAULT_POTATO_IMAGE = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(DEFAULT_POTATO_SVG_RAW);

  // 모달 마크업 템플릿 (DOM에 #gamza-write-modal이 없을 때 자동 주입)
  const WRITE_MODAL_HTML = `
<div id="gamza-write-modal" class="gamza-modal-backdrop" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="gamza-write-title-heading">
  <div class="gamza-modal-container" role="document">
    <header class="gamza-modal-header">
      <div class="header-text-group">
        <div class="header-badge">
          <span class="badge-icon">🥔</span>
          <span>감자 마켓</span>
        </div>
        <h2 id="gamza-write-title-heading" class="modal-title">내 물건 팔기</h2>
        <p class="modal-subtitle">이웃과 나누고 싶은 따뜻한 물건을 등록해 보세요.</p>
      </div>
      <button type="button" class="modal-close-btn" id="gamza-write-close-btn" aria-label="글쓰기 모달 닫기">
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </header>

    <form id="gamza-write-form" class="gamza-write-form" novalidate>
      <div class="gamza-modal-body">
        <!-- 1. 상품 이미지 업로드 & 미리보기 -->
        <section class="form-section image-section">
          <div class="section-label-row">
            <label class="form-label">
              상품 이미지
              <span class="label-badge optional">선택</span>
            </label>
            <span class="label-guide">미등록 시 귀여운 감자 캐릭터가 적용돼요!</span>
          </div>

          <div class="image-uploader-wrapper">
            <input type="file" id="write-image-input" class="visually-hidden" accept="image/*" aria-label="상품 이미지 파일 선택">

            <div id="write-image-dropzone" class="image-dropzone" tabindex="0" role="button" aria-label="이미지 업로드 영역">
              <div class="preview-display" id="write-preview-display">
                <div class="default-potato-wrap" id="write-default-potato">
                  ${DEFAULT_POTATO_SVG_RAW}
                  <div class="default-badge">
                    <span class="default-badge-icon">🥔</span> 기본 감자 일러스트
                  </div>
                </div>
                <img id="write-uploaded-img" class="uploaded-img visually-hidden" src="" alt="상품 업로드 미리보기">
              </div>

              <div class="uploader-info">
                <div class="drop-text-box">
                  <p class="drop-primary-text">
                    <span class="upload-icon">📷</span>
                    <strong class="highlight-link">사진 선택</strong>하거나 끌어다 놓으세요
                  </p>
                  <p class="drop-sub-text">JPG, PNG, GIF, WEBP 지원 (최대 10MB)</p>
                </div>

                <div class="uploader-actions">
                  <button type="button" class="btn-chip" id="write-btn-select-file">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>사진 올리기</span>
                  </button>
                  <button type="button" class="btn-chip btn-chip-sub visually-hidden" id="write-btn-remove-file">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    <span>기본 감자로 변경</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="field-error-msg" id="write-image-error"></div>
          </div>
        </section>

        <!-- 2. 상품명 입력 -->
        <section class="form-section">
          <div class="section-label-row">
            <label for="write-title" class="form-label">
              상품명
              <span class="required-mark" aria-hidden="true">*</span>
            </label>
            <span class="char-counter">
              <strong id="write-title-count">0</strong>/60
            </span>
          </div>
          <div class="input-wrap">
            <input 
              type="text" 
              id="write-title" 
              name="title" 
              class="gamza-input"
              maxlength="60" 
              placeholder="예: 아이폰 14 프로 128G 스페이스 블랙 배터리 92%"
              autocomplete="off"
              required>
          </div>
          <div class="field-error-msg" id="write-title-error"></div>
        </section>

        <!-- 3. 카테고리 선택 -->
        <section class="form-section">
          <div class="section-label-row">
            <label for="write-category" class="form-label">
              카테고리
              <span class="required-mark" aria-hidden="true">*</span>
            </label>
          </div>
          <div class="select-wrap">
            <select id="write-category" name="category" class="gamza-select" required>
              <option value="" disabled selected>카테고리를 선택해 주세요</option>
              <option value="디지털기기">💻 디지털기기</option>
              <option value="가구/인테리어">🪑 가구/인테리어</option>
              <option value="의류">👕 의류</option>
              <option value="생활가전">🔌 생활가전</option>
              <option value="도서/티켓">📚 도서/티켓</option>
              <option value="기타">🥔 기타</option>
            </select>
            <span class="select-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </div>
          <div class="field-error-msg" id="write-category-error"></div>
        </section>

        <!-- 4. 가격 입력 & 무료나눔 -->
        <section class="form-section">
          <div class="section-label-row">
            <label for="write-price" class="form-label">
              가격
              <span class="required-mark" aria-hidden="true">*</span>
            </label>
            <div class="free-share-toggle">
              <input type="checkbox" id="write-free-share" class="custom-checkbox">
              <label for="write-free-share" class="checkbox-ui-label">
                <span class="check-box-icon"></span>
                <span class="share-text">🥔 무료 나눔하기</span>
              </label>
            </div>
          </div>

          <div class="price-input-wrap">
            <span class="currency-prefix" aria-hidden="true">₩</span>
            <input 
              type="text" 
              id="write-price" 
              name="price" 
              class="gamza-input price-input"
              inputmode="numeric" 
              placeholder="가격을 입력해 주세요 (예: 25,000)" 
              autocomplete="off"
              required>
            <span class="currency-suffix" aria-hidden="true">원</span>
          </div>

          <div class="price-live-preview" id="write-price-preview-row">
            <span class="preview-badge">실제 안내</span>
            <span class="live-price-text" id="write-price-korean">0원</span>
          </div>

          <div class="field-error-msg" id="write-price-error"></div>
        </section>

        <!-- 5. 거래 희망 동네 & 빠른 칩 -->
        <section class="form-section">
          <div class="section-label-row">
            <label for="write-location" class="form-label">
              거래 희망 동네
              <span class="required-mark" aria-hidden="true">*</span>
            </label>
            <span class="label-guide">만나서 직거래할 동네</span>
          </div>

          <div class="input-wrap location-wrap">
            <span class="input-inline-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </span>
            <input 
              type="text" 
              id="write-location" 
              name="location" 
              class="gamza-input with-left-icon"
              value="서울시 마포구 연남동"
              placeholder="예: 서울시 마포구 연남동" 
              autocomplete="off"
              required>
          </div>

          <div class="quick-chips-row">
            <span class="chips-label">빠른 선택:</span>
            <div class="chips-list">
              <button type="button" class="chip-item" data-location="서울시 마포구 연남동">연남동</button>
              <button type="button" class="chip-item" data-location="서울시 마포구 망원동">망원동</button>
              <button type="button" class="chip-item" data-location="서울시 마포구 서교동">서교동</button>
              <button type="button" class="chip-item" data-location="서울시 마포구 합정동">합정동</button>
              <button type="button" class="chip-item" data-location="서울시 서대문구 신촌동">신촌동</button>
            </div>
          </div>

          <div class="field-error-msg" id="write-location-error"></div>
        </section>

        <!-- 6. 판매 상태 -->
        <section class="form-section">
          <div class="section-label-row">
            <label class="form-label">판매 상태</label>
          </div>

          <div class="status-segmented-control" role="radiogroup" aria-label="판매 상태 선택">
            <label class="segmented-item is-selling">
              <input type="radio" name="status" value="판매중" checked>
              <span class="segmented-btn">
                <span class="status-dot green"></span>
                <span>판매중</span>
              </span>
            </label>

            <label class="segmented-item is-reserved">
              <input type="radio" name="status" value="예약중">
              <span class="segmented-btn">
                <span class="status-dot orange"></span>
                <span>예약중</span>
              </span>
            </label>

            <label class="segmented-item is-completed">
              <input type="radio" name="status" value="거래 완료">
              <span class="segmented-btn">
                <span class="status-dot gray"></span>
                <span>거래 완료</span>
              </span>
            </label>
          </div>
        </section>

        <!-- 7. 자세한 설명 입력 -->
        <section class="form-section">
          <div class="section-label-row">
            <label for="write-description" class="form-label">
              자세한 설명
              <span class="required-mark" aria-hidden="true">*</span>
            </label>
            <span class="char-counter">
              <strong id="write-description-count">0</strong>/500
            </span>
          </div>

          <div class="textarea-wrap">
            <textarea 
              id="write-description" 
              name="description" 
              class="gamza-textarea"
              rows="6" 
              maxlength="500" 
              placeholder="게시글 내용을 작성해 주세요. (가품 및 판매 금지 물품은 제재될 수 있습니다)

신뢰할 수 있는 거래를 위해 다음 내용을 알려주세요:
- 물품 구매 시기 및 실사용 횟수
- 흠집, 파손, 오염 등 상태 상세
- 직거래 선호 장소 및 시간대"
              required></textarea>
          </div>
          <div class="field-error-msg" id="write-description-error"></div>
        </section>

      </div>

      <footer class="gamza-modal-footer">
        <button type="button" class="gamza-btn btn-cancel" id="gamza-write-cancel-btn">
          취소
        </button>
        <button type="submit" class="gamza-btn btn-submit" id="gamza-write-submit-btn">
          <span class="submit-potato-icon">🥔</span>
          <span>작성 완료</span>
        </button>
      </footer>
    </form>

  </div>
</div>
<div id="gamza-toast-container" class="gamza-toast-container" aria-live="polite" aria-atomic="true"></div>
`;

  // 내부 상태 관리
  let uploadedImageDataUrl = null;
  let cachedPreviousPrice = '';

  // DOM 캐싱 객체
  let elements = {};

  /**
   * DOM에 모달이 없으면 자동으로 주입
   */
  function ensureModalInDOM() {
    if (!document.getElementById('gamza-write-modal')) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = WRITE_MODAL_HTML.trim();
      while (wrapper.firstChild) {
        document.body.appendChild(wrapper.firstChild);
      }
    }
  }

  /**
   * DOM 엘리먼트 캐싱
   */
  function cacheElements() {
    ensureModalInDOM();

    elements = {
      modal: document.getElementById('gamza-write-modal'),
      closeBtn: document.getElementById('gamza-write-close-btn'),
      cancelBtn: document.getElementById('gamza-write-cancel-btn'),
      submitBtn: document.getElementById('gamza-write-submit-btn'),
      form: document.getElementById('gamza-write-form'),

      // 이미지 관련
      fileInput: document.getElementById('write-image-input'),
      dropzone: document.getElementById('write-image-dropzone'),
      btnSelectFile: document.getElementById('write-btn-select-file'),
      btnRemoveFile: document.getElementById('write-btn-remove-file'),
      defaultPotato: document.getElementById('write-default-potato'),
      uploadedImg: document.getElementById('write-uploaded-img'),
      imageError: document.getElementById('write-image-error'),

      // 텍스트 필드 & 에러
      titleInput: document.getElementById('write-title'),
      titleCount: document.getElementById('write-title-count'),
      titleError: document.getElementById('write-title-error'),

      categorySelect: document.getElementById('write-category'),
      categoryError: document.getElementById('write-category-error'),

      priceInput: document.getElementById('write-price'),
      freeShareCheckbox: document.getElementById('write-free-share'),
      priceKoreanText: document.getElementById('write-price-korean'),
      priceError: document.getElementById('write-price-error'),

      locationInput: document.getElementById('write-location'),
      locationChips: document.querySelectorAll('.chip-item'),
      locationError: document.getElementById('write-location-error'),

      descriptionInput: document.getElementById('write-description'),
      descriptionCount: document.getElementById('write-description-count'),
      descriptionError: document.getElementById('write-description-error'),

      toastContainer: document.getElementById('gamza-toast-container')
    };
  }

  /**
   * 숫자를 읽기 쉬운 한국어 화폐 단위(만, 억 등)로 변환
   * @param {number} num 
   * @returns {string} 예: "2만 5,000원", "무료 나눔 (0원)"
   */
  function formatKoreanPrice(num) {
    if (isNaN(num) || num <= 0) return '0원';

    if (num < 10000) {
      return num.toLocaleString('ko-KR') + '원';
    }

    const eok = Math.floor(num / 100000000);
    const man = Math.floor((num % 100000000) / 10000);
    const remainder = num % 10000;

    let result = '';
    if (eok > 0) result += `${eok}억 `;
    if (man > 0) {
      result += (remainder === 0 && eok > 0) ? `${man}만` : `${man}만 `;
    }
    if (remainder > 0) {
      result += `${remainder.toLocaleString('ko-KR')}`;
    }
    return result.trim() + '원';
  }

  /**
   * 모달 열기
   * @param {Object} [initialData] - 필요 시 초기값 주입 가능
   */
  function openModal(initialData = null) {
    if (!elements.modal) cacheElements();
    if (!elements.modal) return;

    if (initialData) {
      fillForm(initialData);
    }

    elements.modal.classList.add('is-open');
    elements.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // 첫 번째 인풋으로 자연스러운 포커스
    setTimeout(() => {
      if (elements.titleInput) elements.titleInput.focus();
    }, 150);
  }

  /**
   * 모달 닫기
   */
  function closeModal() {
    if (!elements.modal) return;
    elements.modal.classList.remove('is-open');
    elements.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    clearAllErrors();
  }

  /**
   * 폼 전체 초기화
   */
  function resetForm() {
    if (!elements.form) return;
    elements.form.reset();

    // 이미지 초기화
    resetImagePreview();

    // 글자수 카운터 초기화
    if (elements.titleCount) elements.titleCount.textContent = '0';
    if (elements.descriptionCount) elements.descriptionCount.textContent = '0';

    // 가격 안내 초기화
    if (elements.priceInput) {
      elements.priceInput.disabled = false;
      elements.priceInput.value = '';
    }
    if (elements.freeShareCheckbox) elements.freeShareCheckbox.checked = false;
    if (elements.priceKoreanText) elements.priceKoreanText.textContent = '0원';

    // 기본 동네 재설정
    if (elements.locationInput) {
      elements.locationInput.value = '서울시 마포구 연남동';
      updateLocationChipActive('서울시 마포구 연남동');
    }

    // 기본 라디오 상태 '판매중'
    const defaultRadio = document.querySelector('input[name="status"][value="판매중"]');
    if (defaultRadio) defaultRadio.checked = true;

    clearAllErrors();
  }

  /**
   * 데이터로 폼 채우기 (수정 또는 프리필용)
   */
  function fillForm(data) {
    if (!data) return;
    if (data.title && elements.titleInput) {
      elements.titleInput.value = data.title;
      elements.titleCount.textContent = String(data.title.length);
    }
    if (data.category && elements.categorySelect) {
      elements.categorySelect.value = data.category;
    }
    if (typeof data.price !== 'undefined' && elements.priceInput) {
      if (Number(data.price) === 0) {
        elements.freeShareCheckbox.checked = true;
        elements.priceInput.value = '0';
        elements.priceInput.disabled = true;
        elements.priceKoreanText.textContent = '🥔 무료 나눔 (0원)';
      } else {
        elements.freeShareCheckbox.checked = false;
        elements.priceInput.disabled = false;
        elements.priceInput.value = Number(data.price).toLocaleString('ko-KR');
        elements.priceKoreanText.textContent = formatKoreanPrice(Number(data.price));
      }
    }
    if (data.location && elements.locationInput) {
      elements.locationInput.value = data.location;
      updateLocationChipActive(data.location);
    }
    if (data.description && elements.descriptionInput) {
      elements.descriptionInput.value = data.description;
      elements.descriptionCount.textContent = String(data.description.length);
    }
    if (data.status) {
      const radio = document.querySelector(`input[name="status"][value="${data.status}"]`);
      if (radio) radio.checked = true;
    }
    const candidateImg = data.image || data.imageUrl;
    if (candidateImg && candidateImg !== DEFAULT_POTATO_IMAGE) {
      setImagePreview(candidateImg);
    }
  }

  /**
   * 이미지 미리보기 설정
   */
  function setImagePreview(dataUrl) {
    uploadedImageDataUrl = dataUrl;
    if (elements.uploadedImg && elements.defaultPotato) {
      elements.uploadedImg.src = dataUrl;
      elements.uploadedImg.classList.remove('visually-hidden');
      elements.defaultPotato.classList.add('visually-hidden');
    }
    if (elements.btnRemoveFile) {
      elements.btnRemoveFile.classList.remove('visually-hidden');
    }
    if (elements.imageError) {
      elements.imageError.textContent = '';
    }
  }

  /**
   * 이미지 기본 감자로 리셋
   */
  function resetImagePreview() {
    uploadedImageDataUrl = null;
    if (elements.fileInput) elements.fileInput.value = '';
    if (elements.uploadedImg && elements.defaultPotato) {
      elements.uploadedImg.src = '';
      elements.uploadedImg.classList.add('visually-hidden');
      elements.defaultPotato.classList.remove('visually-hidden');
    }
    if (elements.btnRemoveFile) {
      elements.btnRemoveFile.classList.add('visually-hidden');
    }
  }

  /**
   * 파일 업로드 처리 및 검증
   */
  function handleFileSelection(file) {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showFieldError(elements.imageError, '이미지 파일(JPG, PNG, GIF, WEBP)만 업로드할 수 있습니다.');
      return;
    }

    const maxSizeInMB = 10;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      showFieldError(elements.imageError, `이미지 크기는 최대 ${maxSizeInMB}MB 이하만 가능합니다.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      setImagePreview(e.target.result);
    };
    reader.onerror = function () {
      showFieldError(elements.imageError, '이미지를 읽는 중 오류가 발생했습니다.');
    };
    reader.readAsDataURL(file);
  }

  /**
   * 에러 메시지 표시
   */
  function showFieldError(errorEl, message, inputEl = null) {
    if (errorEl) errorEl.textContent = message;
    if (inputEl) {
      inputEl.classList.add('has-error');
      inputEl.focus();
    }
  }

  /**
   * 특정 필드 에러 초기화
   */
  function clearFieldError(errorEl, inputEl = null) {
    if (errorEl) errorEl.textContent = '';
    if (inputEl) inputEl.classList.remove('has-error');
  }

  /**
   * 모든 에러 메시지 및 인풋 에러 상태 초기화
   */
  function clearAllErrors() {
    const errorEls = [
      elements.imageError,
      elements.titleError,
      elements.categoryError,
      elements.priceError,
      elements.locationError,
      elements.descriptionError
    ];
    errorEls.forEach(el => {
      if (el) el.textContent = '';
    });

    const inputs = document.querySelectorAll('.gamza-input, .gamza-select, .gamza-textarea');
    inputs.forEach(input => input.classList.remove('has-error'));
  }

  /**
   * 동네 칩 active 클래스 동기화
   */
  function updateLocationChipActive(locationText) {
    if (!elements.locationChips) return;
    elements.locationChips.forEach(chip => {
      const chipVal = chip.getAttribute('data-location') || chip.textContent.trim();
      if (chipVal === locationText || locationText.includes(chip.textContent.trim())) {
        chip.classList.add('is-selected');
      } else {
        chip.classList.remove('is-selected');
      }
    });
  }

  /**
   * 폼 유효성 검증
   */
  function validateForm() {
    clearAllErrors();
    let isValid = true;
    let firstInvalidElement = null;

    // 1. 상품명 검증
    const title = elements.titleInput ? elements.titleInput.value.trim() : '';
    if (!title) {
      showFieldError(elements.titleError, '상품명을 입력해 주세요.', elements.titleInput);
      isValid = false;
      if (!firstInvalidElement) firstInvalidElement = elements.titleInput;
    } else if (title.length < 2) {
      showFieldError(elements.titleError, '상품명은 최소 2자 이상 입력해 주세요.', elements.titleInput);
      isValid = false;
      if (!firstInvalidElement) firstInvalidElement = elements.titleInput;
    }

    // 2. 카테고리 검증
    const category = elements.categorySelect ? elements.categorySelect.value : '';
    if (!category) {
      showFieldError(elements.categoryError, '카테고리를 선택해 주세요.', elements.categorySelect);
      isValid = false;
      if (!firstInvalidElement) firstInvalidElement = elements.categorySelect;
    }

    // 3. 가격 검증
    const isFree = elements.freeShareCheckbox && elements.freeShareCheckbox.checked;
    if (!isFree) {
      const rawPrice = elements.priceInput ? elements.priceInput.value.replace(/[^0-9]/g, '') : '';
      if (!rawPrice) {
        showFieldError(elements.priceError, '가격을 입력해 주세요. (무료 나눔은 체크박스를 선택하세요)', elements.priceInput);
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = elements.priceInput;
      }
    }

    // 4. 동네 검증
    const location = elements.locationInput ? elements.locationInput.value.trim() : '';
    if (!location) {
      showFieldError(elements.locationError, '거래 희망 동네를 입력해 주세요.', elements.locationInput);
      isValid = false;
      if (!firstInvalidElement) firstInvalidElement = elements.locationInput;
    }

    // 5. 자세한 설명 검증
    const description = elements.descriptionInput ? elements.descriptionInput.value.trim() : '';
    if (!description) {
      showFieldError(elements.descriptionError, '상품에 대한 자세한 설명을 작성해 주세요.', elements.descriptionInput);
      isValid = false;
      if (!firstInvalidElement) firstInvalidElement = elements.descriptionInput;
    } else if (description.length < 5) {
      showFieldError(elements.descriptionError, '설명은 신뢰할 수 있는 거래를 위해 최소 5자 이상 적어주세요.', elements.descriptionInput);
      isValid = false;
      if (!firstInvalidElement) firstInvalidElement = elements.descriptionInput;
    } else if (description.length > 500) {
      showFieldError(elements.descriptionError, '자세한 설명은 최대 500자까지 작성할 수 있습니다.', elements.descriptionInput);
      isValid = false;
      if (!firstInvalidElement) firstInvalidElement = elements.descriptionInput;
    }

    if (!isValid && firstInvalidElement) {
      firstInvalidElement.focus();
    }

    return isValid;
  }

  /**
   * 폼 전송 처리 (새 상품 객체 생성 & 이벤트 디스패치)
   */
  function handleFormSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    if (!validateForm()) {
      return false;
    }

    // 값 수집
    const title = elements.titleInput.value.trim();
    const category = elements.categorySelect.value;
    const isFree = elements.freeShareCheckbox.checked;
    const rawPrice = isFree ? 0 : parseInt(elements.priceInput.value.replace(/[^0-9]/g, ''), 10) || 0;
    const location = elements.locationInput.value.trim();
    const description = elements.descriptionInput.value.trim();
    const checkedStatusRadio = document.querySelector('input[name="status"]:checked');
    const status = checkedStatusRadio ? checkedStatusRadio.value : '판매중';

    // 상품 이미지 (업로드된 사진 또는 기본 감자)
    const finalImageUrl = uploadedImageDataUrl || DEFAULT_POTATO_IMAGE;
    const hasCustomImage = Boolean(uploadedImageDataUrl);

    // 새 상품 객체 모델 구성 (product-list 및 product-detail 규격 모두 완벽 호환)
    const newProduct = {
      id: Date.now(),
      title: title,
      category: category,
      price: rawPrice,
      priceFormatted: rawPrice === 0 ? '무료나눔' : `${rawPrice.toLocaleString('ko-KR')}원`,
      description: description,
      location: location,
      status: status, // '판매중' | '예약중' | '거래 완료'
      image: finalImageUrl,
      imageUrl: finalImageUrl,
      hasCustomImage: hasCustomImage,
      isFree: rawPrice === 0,
      createdAt: new Date().toISOString(),
      timeAgo: '방금 전',
      likes: 0,
      chats: 0
    };

    // 1) 요구사항 이벤트 디스패치: window.dispatchEvent('gamza:product-created')
    const createdEvent = new CustomEvent('gamza:product-created', {
      detail: newProduct,
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(createdEvent);
    document.dispatchEvent(createdEvent);

    // 2) product-list 모듈 연동 이벤트 디스패치: window.dispatchEvent('gamza:add-product')
    const addProductEvent = new CustomEvent('gamza:add-product', {
      detail: newProduct,
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(addProductEvent);

    // 모달 닫기 및 폼 리셋
    closeModal();
    resetForm();

    // 등록 성공 토스트 메시지 안내
    showToast(`🥔 '${newProduct.title}' 상품이 등록되었습니다!`, 'success');

    return true;
  }

  /**
   * 토스트 메시지 노출 함수
   */
  function showToast(message, type = 'success', duration = 3200) {
    let container = document.getElementById('gamza-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'gamza-toast-container';
      container.className = 'gamza-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `gamza-toast toast-${type}`;
    toast.setAttribute('role', 'status');

    const icon = type === 'success' ? '🥔' : '⚠️';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    // 등장 애니메이션
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // 자동 소멸
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 350);
    }, duration);
  }

  /**
   * 이벤트 리스너 바인딩
   */
  function bindEvents() {
    // 닫기 및 취소 버튼
    if (elements.closeBtn) elements.closeBtn.addEventListener('click', closeModal);
    if (elements.cancelBtn) elements.cancelBtn.addEventListener('click', closeModal);

    // 모달 배경 클릭 시 닫기
    if (elements.modal) {
      elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) {
          closeModal();
        }
      });
    }

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.modal && elements.modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    // 파일 선택 버튼 클릭 시 숨겨진 input[type="file"] 트리거
    if (elements.btnSelectFile && elements.fileInput) {
      elements.btnSelectFile.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.fileInput.click();
      });
    }

    // 드롭존 클릭 시에도 파일 선택 트리거 (드롭존 내부 버튼 클릭이 아닐 때)
    if (elements.dropzone && elements.fileInput) {
      elements.dropzone.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        elements.fileInput.click();
      });

      // 키보드 접근성 (Enter/Space)
      elements.dropzone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          elements.fileInput.click();
        }
      });

      // 드래그 앤 드롭 이벤트
      ['dragenter', 'dragover'].forEach(eventName => {
        elements.dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          elements.dropzone.classList.add('is-dragover');
        });
      });

      ['dragleave', 'dragend', 'drop'].forEach(eventName => {
        elements.dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          elements.dropzone.classList.remove('is-dragover');
        });
      });

      elements.dropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer && e.dataTransfer.files;
        if (files && files.length > 0) {
          handleFileSelection(files[0]);
        }
      });
    }

    // 파일 인풋 변경
    if (elements.fileInput) {
      elements.fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleFileSelection(e.target.files[0]);
        }
      });
    }

    // 기본 감자로 변경 버튼
    if (elements.btnRemoveFile) {
      elements.btnRemoveFile.addEventListener('click', (e) => {
        e.stopPropagation();
        resetImagePreview();
      });
    }

    // 상품명 입력 및 글자수 카운팅
    if (elements.titleInput) {
      elements.titleInput.addEventListener('input', () => {
        const len = elements.titleInput.value.length;
        if (elements.titleCount) elements.titleCount.textContent = String(len);
        clearFieldError(elements.titleError, elements.titleInput);
      });
    }

    // 카테고리 변경 시 에러 해제
    if (elements.categorySelect) {
      elements.categorySelect.addEventListener('change', () => {
        clearFieldError(elements.categoryError, elements.categorySelect);
      });
    }

    // 가격 실시간 포맷팅 & 한글 안내
    if (elements.priceInput) {
      elements.priceInput.addEventListener('input', () => {
        let raw = elements.priceInput.value.replace(/[^0-9]/g, '');
        if (raw) {
          const num = parseInt(raw, 10);
          elements.priceInput.value = num.toLocaleString('ko-KR');
          if (elements.priceKoreanText) {
            elements.priceKoreanText.textContent = formatKoreanPrice(num);
          }
        } else {
          elements.priceInput.value = '';
          if (elements.priceKoreanText) {
            elements.priceKoreanText.textContent = '0원';
          }
        }
        clearFieldError(elements.priceError, elements.priceInput);
      });
    }

    // 무료 나눔 체크박스 토글
    if (elements.freeShareCheckbox) {
      elements.freeShareCheckbox.addEventListener('change', () => {
        const isFree = elements.freeShareCheckbox.checked;
        if (isFree) {
          cachedPreviousPrice = elements.priceInput.value;
          elements.priceInput.value = '0';
          elements.priceInput.disabled = true;
          if (elements.priceKoreanText) {
            elements.priceKoreanText.textContent = '🥔 따뜻한 무료 나눔 (0원)';
          }
          clearFieldError(elements.priceError, elements.priceInput);
        } else {
          elements.priceInput.disabled = false;
          elements.priceInput.value = cachedPreviousPrice && cachedPreviousPrice !== '0' ? cachedPreviousPrice : '';
          const num = parseInt(elements.priceInput.value.replace(/[^0-9]/g, ''), 10) || 0;
          if (elements.priceKoreanText) {
            elements.priceKoreanText.textContent = formatKoreanPrice(num);
          }
        }
      });
    }

    // 동네 입력 및 빠른 선택 칩
    if (elements.locationChips) {
      elements.locationChips.forEach(chip => {
        chip.addEventListener('click', () => {
          const loc = chip.getAttribute('data-location') || chip.textContent.trim();
          if (elements.locationInput) {
            elements.locationInput.value = loc;
            updateLocationChipActive(loc);
            clearFieldError(elements.locationError, elements.locationInput);
          }
        });
      });
    }

    if (elements.locationInput) {
      elements.locationInput.addEventListener('input', () => {
        updateLocationChipActive(elements.locationInput.value.trim());
        clearFieldError(elements.locationError, elements.locationInput);
      });
    }

    // 자세한 설명 글자수 카운팅 (최대 500자)
    if (elements.descriptionInput) {
      elements.descriptionInput.addEventListener('input', () => {
        if (elements.descriptionInput.value.length > 500) {
          elements.descriptionInput.value = elements.descriptionInput.value.slice(0, 500);
        }
        const len = elements.descriptionInput.value.length;
        if (elements.descriptionCount) elements.descriptionCount.textContent = String(len);
        clearFieldError(elements.descriptionError, elements.descriptionInput);
      });
    }

    // 폼 제출
    if (elements.form) {
      elements.form.addEventListener('submit', handleFormSubmit);
    }

    // 외부 버튼 중 [글쓰기] 관련 트리거 자동 연동
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-gamza-open-write], .gamza-btn-write, #gamza-btn-open-write, .btn-open-write, #btn-open-write, #btn-write');
      if (trigger) {
        e.preventDefault();
        openModal();
      }
    });

    // 외부 커스텀 이벤트 수신: 글쓰기 모달 열기 ('gamza:open-write')
    window.addEventListener('gamza:open-write', (e) => {
      const initialData = e && e.detail ? e.detail : null;
      openModal(initialData);
    });
  }

  /**
   * 초기화 실행
   */
  function init() {
    cacheElements();
    bindEvents();
  }

  // DOM 로드 시 자동 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 글로벌 API 공개 (window.GamzaWrite)
  window.GamzaWrite = {
    init: init,
    open: openModal,
    close: closeModal,
    reset: resetForm,
    fill: fillForm,
    submit: handleFormSubmit,
    showToast: showToast,
    getFormData: function () {
      if (!elements.form) cacheElements();
      const isFree = elements.freeShareCheckbox ? elements.freeShareCheckbox.checked : false;
      const rawPrice = isFree ? 0 : (parseInt(elements.priceInput?.value.replace(/[^0-9]/g, ''), 10) || 0);
      const checkedStatus = document.querySelector('input[name="status"]:checked')?.value || '판매중';

      return {
        title: elements.titleInput?.value.trim() || '',
        category: elements.categorySelect?.value || '',
        price: rawPrice,
        priceFormatted: rawPrice === 0 ? '무료나눔' : `${rawPrice.toLocaleString('ko-KR')}원`,
        description: elements.descriptionInput?.value.trim() || '',
        location: elements.locationInput?.value.trim() || '',
        status: checkedStatus,
        image: uploadedImageDataUrl || DEFAULT_POTATO_IMAGE,
        imageUrl: uploadedImageDataUrl || DEFAULT_POTATO_IMAGE,
        hasCustomImage: Boolean(uploadedImageDataUrl),
        isFree: rawPrice === 0
      };
    },
    DEFAULT_POTATO_IMAGE: DEFAULT_POTATO_IMAGE
  };

})();
