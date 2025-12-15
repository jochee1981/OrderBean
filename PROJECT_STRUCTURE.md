# OrderBean 프로젝트 구조

## 📁 디렉토리 구조

```
OrderBean/
├── frontend/                 # React + TypeScript + Vite 프론트엔드
│   ├── src/
│   │   ├── components/      # 재사용 가능한 컴포넌트
│   │   │   └── Layout.tsx
│   │   ├── pages/           # 페이지 컴포넌트
│   │   │   ├── HomePage.tsx
│   │   │   ├── MenuPage.tsx
│   │   │   ├── OrderPage.tsx
│   │   │   ├── OrderHistoryPage.tsx
│   │   │   ├── OrderTrackingPage.tsx
│   │   │   └── admin/
│   │   │       ├── DashboardPage.tsx
│   │   │       ├── MenuPage.tsx
│   │   │       └── OrdersPage.tsx
│   │   ├── stores/           # Zustand 상태 관리
│   │   │   └── authStore.ts
│   │   ├── lib/              # 유틸리티 및 API 클라이언트
│   │   │   └── api.ts
│   │   ├── App.tsx           # 메인 앱 컴포넌트
│   │   ├── main.tsx          # 진입점
│   │   └── index.css         # 글로벌 스타일
│   ├── public/               # 정적 파일
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── Dockerfile
│
├── backend/                  # Node.js + Express + TypeScript 백엔드
│   ├── src/
│   │   ├── controllers/      # 컨트롤러 (비즈니스 로직)
│   │   │   ├── auth.controller.ts
│   │   │   ├── menu.controller.ts
│   │   │   ├── order.controller.ts
│   │   │   └── admin.controller.ts
│   │   ├── routes/           # 라우트 정의
│   │   │   ├── auth.routes.ts
│   │   │   ├── menu.routes.ts
│   │   │   ├── order.routes.ts
│   │   │   └── admin.routes.ts
│   │   ├── middleware/       # 미들웨어
│   │   │   ├── auth.middleware.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── notFoundHandler.ts
│   │   ├── lib/              # 라이브러리 및 유틸리티
│   │   │   ├── prisma.ts
│   │   │   └── redis.ts
│   │   └── index.ts          # 서버 진입점
│   ├── prisma/
│   │   ├── schema.prisma     # 데이터베이스 스키마
│   │   └── seed.ts           # 시드 데이터
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example          # 환경 변수 예제
│
├── docker-compose.yml         # Docker Compose 설정
├── .gitignore
├── .eslintrc.json
├── .prettierrc
└── README.md
```

## 🚀 시작하기

### 1. 환경 설정

#### Backend 환경 변수 설정
```bash
cd backend
cp .env.example .env
# .env 파일을 편집하여 필요한 값 설정
```

#### Frontend 환경 변수 설정
```bash
cd frontend
# .env 파일 생성 (필요시)
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=ws://localhost:3000
```

### 2. Docker로 전체 스택 실행

```bash
# 모든 서비스 시작 (PostgreSQL, Redis, Backend, Frontend)
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

### 3. 로컬 개발 환경 설정

#### Backend
```bash
cd backend

# 의존성 설치
npm install

# Prisma 클라이언트 생성
npm run prisma:generate

# 데이터베이스 마이그레이션
npm run prisma:migrate

# 시드 데이터 생성
npm run prisma:seed

# 개발 서버 실행
npm run dev
```

#### Frontend
```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 📦 주요 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Zustand** - 상태 관리
- **React Query** - 서버 상태 관리
- **Axios** - HTTP 클라이언트
- **Socket.io Client** - 실시간 통신
- **React Router** - 라우팅

### Backend
- **Node.js + Express** - 서버 프레임워크
- **TypeScript** - 타입 안정성
- **Prisma** - ORM
- **PostgreSQL** - 데이터베이스
- **Redis** - 캐싱
- **Bull** - 작업 큐
- **Socket.io** - 실시간 통신
- **JWT** - 인증
- **Swagger** - API 문서화

## 🔧 주요 기능

### 구현된 기능
- ✅ 프로젝트 기본 구조
- ✅ 인증 시스템 (회원가입, 로그인)
- ✅ 메뉴 조회 API
- ✅ 주문 관리 API (기본 구조)
- ✅ 관리자 API (기본 구조)
- ✅ WebSocket 실시간 통신 설정
- ✅ Redis 캐싱
- ✅ 에러 처리 미들웨어
- ✅ Swagger API 문서화

### 구현 필요 기능
- ⏳ 주문 생성 로직 완성
- ⏳ 결제 통합 (Toss Payments)
- ⏳ 이미지 업로드 (AWS S3)
- ⏳ 푸시 알림 (Firebase/FCM)
- ⏳ 관리자 대시보드 UI
- ⏳ 주문 추적 UI
- ⏳ 메뉴 관리 UI

## 📝 API 엔드포인트

### 인증
- `POST /api/v1/auth/signup` - 회원가입
- `POST /api/v1/auth/login` - 로그인
- `POST /api/v1/auth/logout` - 로그아웃
- `POST /api/v1/auth/refresh` - 토큰 갱신

### 메뉴
- `GET /api/v1/menus` - 메뉴 목록 조회
- `GET /api/v1/menus/:id` - 메뉴 상세 조회
- `POST /api/v1/menus` - 메뉴 생성 (관리자)
- `PUT /api/v1/menus/:id` - 메뉴 수정 (관리자)
- `DELETE /api/v1/menus/:id` - 메뉴 삭제 (관리자)

### 주문
- `POST /api/v1/orders` - 주문 생성
- `GET /api/v1/orders` - 주문 목록 조회
- `GET /api/v1/orders/:id` - 주문 상세 조회
- `PATCH /api/v1/orders/:id/cancel` - 주문 취소
- `POST /api/v1/orders/:id/retry` - 주문 재주문

### 관리자
- `GET /api/v1/admin/orders/dashboard` - 주문 모니터링
- `PATCH /api/v1/admin/orders/:id/status` - 주문 상태 업데이트
- `GET /api/v1/admin/analytics/orders` - 주문 통계
- `GET /api/v1/admin/analytics/menus` - 메뉴 판매량

## 🔐 기본 계정 (시드 데이터)

### 관리자
- Email: `admin@orderbean.com`
- Password: `admin123`

### 고객
- Email: `customer@orderbean.com`
- Password: `customer123`

## 📚 추가 문서

- [README.md](./README.md) - 프로젝트 PRD 및 전체 문서
- API 문서: `http://localhost:3000/api-docs` (서버 실행 후)

## 🐛 문제 해결

### 데이터베이스 연결 오류
```bash
# PostgreSQL 컨테이너 상태 확인
docker-compose ps postgres

# 데이터베이스 재시작
docker-compose restart postgres
```

### Redis 연결 오류
```bash
# Redis 컨테이너 상태 확인
docker-compose ps redis

# Redis 재시작
docker-compose restart redis
```

### Prisma 마이그레이션 오류
```bash
cd backend
npm run prisma:migrate reset  # 주의: 모든 데이터 삭제됨
npm run prisma:migrate
npm run prisma:seed
```

