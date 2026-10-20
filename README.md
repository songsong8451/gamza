# 🥔 감자 (Gamza) 마켓

> **"포슬포슬 따뜻한 우리 동네 이웃 간의 중고 직거래 마켓"**  
> 감자(Gamza)는 당근마켓의 친근한 지역 커뮤니티 감성을 감자 테마의 따뜻한 브랜딩으로 재해석한 현대적인 중고 거래 웹 애플리케이션입니다.

---

## ✨ 주요 기능 (Key Features)

### 1. 🏠 상품 탐색 & 실시간 피드
- **카테고리 필터링**: 디지털기기, 생활가전, 가구/인테리어, 유아동, 의류/잡화, 도서/음반, 기타중고 등
- **다양한 정렬 옵션**: 최신 등록순, 낮은 가격순, 높은 가격순, 인기 찜순
- **통합 검색**: 실시간 키워드 검색 (글자 입력 시 즉시 반응 및 지우기 버튼)
- **무료 나눔 필터**: 따뜻한 이웃 간 나눔 물품만 모아보기 토글

### 2. 🔍 상세 모달 (Product Detail)
- **다중 이미지 캐러셀**: 썸네일 탐색 및 터치/클릭 슬라이드 네비게이션
- **판매자 신뢰도**: 프로필 아바타, 동네 인증 뱃지, **매너온도 99.0℃** 인디케이터
- **실시간 상호작용**: 찜하기(Like) 토글 및 카운트 애니메이션, 조회수 실시간 증가
- **안전 직거래 가이드**: 감자 마켓 권장 수칙 및 직거래 팁 제공

### 3. ✍️ 상품 등록 & 수정 (Product Post/Edit)
- **다중 이미지 드래그&드롭 / 미리보기**: 대표 사진 설정 및 개별 삭제
- **스마트 가격 입력**: 숫자 자동 서식화(천 단위 콤마) 및 '나눔' 체크박스 연동
- **유효성 검사**: 실시간 필드 에러 메시지 안내

### 4. 🔐 사용자 인증 & Supabase 연동
- **회원가입 & 로그인 모달**: 이메일/비밀번호 기반 인증
- **클라우드 데이터베이스**: Supabase PostgreSQL 기반 RLS(Row Level Security) 적용
- **실시간 연결 인디케이터**: 헤더 상단에 Supabase 연결 상태(연결 중/연결됨/오프라인) 실시간 표기

---

## 🛠 기술 스택 (Tech Stack)

| 구분 | 기술 / 라이브러리 |
| :--- | :--- |
| **Frontend** | Vanilla JavaScript (ES6+), HTML5 Semantic, Modern CSS3 |
| **UI/UX & Styling** | CSS Custom Properties (Variables), Flexbox & Grid, CSS Micro-interactions |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth, Storage) |
| **Icons & Assets** | Dicebear Avatars API, SVG Vector Icons, System Potato Emojis (🥔) |
| **Deployment** | 정적 웹 호스팅 (GitHub Pages, Vercel, Netlify 호환) |

---

## 📁 프로젝트 구조 (Directory Structure)

```bash
gamza/
├── index.html              # 메인 단일 페이지 애플리케이션 (SPA) HTML
├── style.css               # 감자 테마 디자인 시스템 및 전역 스타일시트
├── app.js                  # 메인 프론트엔드 비즈니스 로직 및 UI 이벤트 핸들러
├── supabase-config.js      # Supabase 클라이언트 초기화 및 API 통신 서비스 레이어
├── supabase_init.sql       # 데이터베이스 테이블, RLS 보안 정책, 시드 데이터 통합 스크립트
├── supabase_schema.sql     # DDL 스키마 정의 (profiles, products, product_likes, chats)
├── supabase_seed.sql       # 초기 Mock 데이터 시드 (익명 가명 닉네임, 샘플 상품 6건)
├── components/             # 컴포넌트별 모듈화 참조 및 개별 테스트 파일
│   ├── product-list.html / .css / .js
│   ├── product-detail.html / .css / .js
│   ├── product-write.html / .css / .js
│   ├── test-product-list.html
│   └── test-product-detail.html
├── .env.example            # Supabase 연동 환경 변수 예시 템플릿
├── .gitignore              # 민감 정보(.env) 및 빌드/OS 캐시 차단 규칙
└── README.md               # 프로젝트 안내 문서
```

---

## 🚀 로컬 실행 방법 (Getting Started)

별도의 복잡한 패키지 설치나 빌드 과정 없이 정적 웹 서버를 통해 즉시 실행할 수 있습니다.

### 방법 1: Python 기본 서버 이용
```bash
# Python 3
python3 -m http.server 8000

# 브라우저 접속
http://localhost:8000
```

### 방법 2: VS Code / IDE Live Server 확장
1. VS Code에서 프로젝트 폴더를 엽니다.
2. `index.html` 우클릭 후 **'Open with Live Server'** 클릭.

---

## 🗄 Supabase 연동 가이드 (Setup Supabase)

1. [Supabase](https://supabase.com/) 대시보드에서 신규 프로젝트를 생성합니다.
2. 대시보드 **SQL Editor**로 이동합니다.
3. `supabase_init.sql` 파일의 내용을 붙여넣고 **Run**을 실행합니다.
   - `profiles`, `products`, `product_likes` 테이블 자동 생성
   - Row Level Security (RLS) 정책 자동 활성화
   - 초기 Mock 데이터 6건 자동 삽입
4. `supabase-config.js` 상단의 `SUPABASE_URL`과 `SUPABASE_ANON_KEY`를 새로 발급받은 프로젝트 정보로 설정합니다:
```javascript
const SUPABASE_URL = 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';
```

---

## 🌐 배포 안내 (Deployment)

본 프로젝트는 정적 파일(HTML/CSS/JS)로 구성되어 있어 다양한 정적 호스팅 서비스에 즉시 배포할 수 있습니다.

### GitHub Pages 배포
1. GitHub 저장소의 **Settings** > **Pages** 탭으로 이동합니다.
2. **Build and deployment** > **Source**를 `Deploy from a branch`로 선택합니다.
3. Branch를 `main` / `/(root)`로 지정하고 **Save**를 누릅니다.
4. 수 분 내에 `https://<github-username>.github.io/gamza/` 주소로 배포가 완료됩니다.

---

## 🔒 보안 및 개인정보 보호 (Security & PII)

- 본 프로젝트의 스키마 및 시드 데이터는 실명, 주민번호, 휴대폰 번호, 상세 주소 등의 **개인식별정보(PII)를 철저히 배제**하고 익명 가명 닉네임과 동 단위 지역명만 사용합니다.
- 데이터베이스 보안을 위해 Supabase의 **Row Level Security (RLS)**를 적용하여 본인의 게시글만 수정/삭제할 수 있도록 구성되어 있습니다.
- 민감한 시크릿 키(Service Role Key)는 클라이언트에 절대 노출되지 않으며 오직 공개용 `Anon Key`만을 사용합니다.

---

## 📄 라이선스 (License)

This project is licensed under the MIT License - see the LICENSE file for details.
