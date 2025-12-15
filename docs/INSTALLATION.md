# 설치 가이드

OrderBean 프로젝트를 로컬 환경에 설치하는 방법을 안내합니다.

## 목차

1. [필수 요구사항](#필수-요구사항)
2. [설치 방법](#설치-방법)
3. [환경 변수 설정](#환경-변수-설정)
4. [데이터베이스 설정](#데이터베이스-설정)
5. [설치 확인](#설치-확인)
6. [문제 해결](#문제-해결)

## 필수 요구사항

### 필수 소프트웨어

- **Node.js**: v20.x 이상
  - 다운로드: https://nodejs.org/
  - 설치 확인: `node --version`
  
- **npm**: v10.x 이상 (Node.js와 함께 설치됨)
  - 설치 확인: `npm --version`

- **Git**: 최신 버전
  - 다운로드: https://git-scm.com/
  - 설치 확인: `git --version`

### 선택적 소프트웨어 (Docker 사용 시)

- **Docker**: v20.x 이상
  - 다운로드: https://www.docker.com/
  - 설치 확인: `docker --version`

- **Docker Compose**: v2.x 이상
  - 설치 확인: `docker-compose --version`

### 데이터베이스 (Docker 미사용 시)

- **PostgreSQL**: 15.x 이상
  - 다운로드: https://www.postgresql.org/
  - 설치 확인: `psql --version`

- **Redis**: 7.x 이상
  - 다운로드: https://redis.io/
  - 설치 확인: `redis-cli --version`

## 설치 방법

### 방법 1: Docker 사용 (권장)

가장 간단한 방법입니다. Docker가 설치되어 있다면 이 방법을 권장합니다.

#### 1. 저장소 클론

```bash
git clone https://github.com/jochee1981/OrderBean.git
cd OrderBean
```

#### 2. 환경 변수 설정

```bash
# Backend 환경 변수
cd backend
cp env.example .env
# .env 파일을 편집하여 필요한 값 설정 (기본값으로도 동작 가능)
```

#### 3. Docker Compose로 실행

```bash
# 루트 디렉토리에서
docker-compose up -d
```

이 명령어는 다음을 자동으로 실행합니다:
- PostgreSQL 데이터베이스 시작
- Redis 캐시 시작
- Backend 서버 시작
- Frontend 개발 서버 시작

#### 4. 데이터베이스 마이그레이션

```bash
# Backend 컨테이너에서 마이그레이션 실행
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed
```

#### 5. 접속 확인

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API 문서**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

### 방법 2: 로컬 설치

Docker 없이 로컬에 직접 설치하는 방법입니다.

#### 1. 저장소 클론

```bash
git clone https://github.com/jochee1981/OrderBean.git
cd OrderBean
```

#### 2. PostgreSQL 및 Redis 설치 및 실행

**PostgreSQL:**
```bash
# Windows (Chocolatey)
choco install postgresql

# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Redis:**
```bash
# Windows
# WSL2 또는 Docker 사용 권장

# macOS (Homebrew)
brew install redis
brew services start redis

# Linux (Ubuntu/Debian)
sudo apt install redis-server
sudo systemctl start redis
```

#### 3. 데이터베이스 생성

```bash
# PostgreSQL에 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE orderbean;
CREATE USER orderbean WITH PASSWORD 'orderbean_dev';
GRANT ALL PRIVILEGES ON DATABASE orderbean TO orderbean;
\q
```

#### 4. Backend 설치

```bash
cd backend

# 의존성 설치
npm install

# 환경 변수 설정
cp env.example .env
# .env 파일 편집
```

#### 5. Frontend 설치

```bash
cd ../frontend

# 의존성 설치
npm install

# 환경 변수 설정 (선택사항)
# .env 파일 생성 (필요한 경우)
```

#### 6. 데이터베이스 마이그레이션

```bash
cd ../backend

# Prisma 클라이언트 생성
npm run prisma:generate

# 마이그레이션 실행
npm run prisma:migrate

# 시드 데이터 생성
npm run prisma:seed
```

#### 7. 서버 실행

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend (새 터미널):**
```bash
cd frontend
npm run dev
```

## 환경 변수 설정

### Backend (.env)

`backend/env.example` 파일을 복사하여 `.env` 파일을 생성하고 다음 값들을 설정합니다:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="postgresql://orderbean:orderbean_dev@localhost:5432/orderbean?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=24h

# AWS S3 (선택사항 - 이미지 업로드용)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=orderbean-images

# Toss Payments (선택사항 - 결제용)
TOSS_PAYMENTS_SECRET_KEY=your_toss_payments_secret_key

# Firebase (선택사항 - 푸시 알림용)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# SendGrid (선택사항 - 이메일용)
SENDGRID_API_KEY=your_sendgrid_api_key

# CORS
CORS_ORIGIN=http://localhost:5173
```

**최소 필수 설정:**
- `DATABASE_URL`: PostgreSQL 연결 문자열
- `REDIS_URL`: Redis 연결 문자열
- `JWT_SECRET`: JWT 토큰 서명용 시크릿 키

### Frontend (.env)

`frontend/.env` 파일을 생성합니다 (선택사항):

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=ws://localhost:3000
```

기본값으로도 동작하지만, 다른 포트를 사용하는 경우 설정이 필요합니다.

## 데이터베이스 설정

### Prisma 마이그레이션

```bash
cd backend

# 마이그레이션 생성 (스키마 변경 시)
npm run prisma:migrate dev --name migration_name

# 마이그레이션 적용 (프로덕션)
npm run prisma:migrate deploy

# Prisma Studio 실행 (데이터베이스 GUI)
npm run prisma:studio
```

### 시드 데이터

기본 테스트 계정이 자동으로 생성됩니다:

**관리자 계정:**
- Email: `admin@orderbean.com`
- Password: `admin123`

**고객 계정:**
- Email: `customer@orderbean.com`
- Password: `customer123`

## 설치 확인

### 1. Backend 확인

```bash
# Health check
curl http://localhost:3000/health

# 응답 예시:
# {"status":"ok","timestamp":"2024-12-15T14:30:00Z"}
```

### 2. Frontend 확인

브라우저에서 http://localhost:5173 접속

### 3. API 문서 확인

브라우저에서 http://localhost:3000/api-docs 접속

### 4. 데이터베이스 연결 확인

```bash
# PostgreSQL
psql -U orderbean -d orderbean -c "SELECT 1;"

# Redis
redis-cli ping
# 응답: PONG
```

## 문제 해결

### 일반적인 문제

#### 1. 포트가 이미 사용 중입니다

**해결:**
- `.env` 파일에서 `PORT` 변경
- 또는 사용 중인 프로세스 종료

#### 2. 데이터베이스 연결 실패

**확인 사항:**
- PostgreSQL이 실행 중인지 확인
- `DATABASE_URL`이 올바른지 확인
- 데이터베이스와 사용자가 생성되었는지 확인

**해결:**
```bash
# PostgreSQL 상태 확인
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# 연결 테스트
psql -U orderbean -d orderbean
```

#### 3. Redis 연결 실패

**확인 사항:**
- Redis가 실행 중인지 확인
- `REDIS_URL`이 올바른지 확인

**해결:**
```bash
# Redis 상태 확인
redis-cli ping
# 응답: PONG

# Redis 재시작
sudo systemctl restart redis  # Linux
brew services restart redis  # macOS
```

#### 4. Prisma 클라이언트 오류

**해결:**
```bash
cd backend
npm run prisma:generate
```

#### 5. 의존성 설치 오류

**해결:**
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install

# 또는
npm ci
```

### Docker 관련 문제

#### 1. Docker 컨테이너가 시작되지 않음

**해결:**
```bash
# 로그 확인
docker-compose logs

# 컨테이너 재시작
docker-compose restart

# 완전히 재시작
docker-compose down
docker-compose up -d
```

#### 2. 포트 충돌

**해결:**
- `docker-compose.yml`에서 포트 변경
- 또는 사용 중인 프로세스 종료

#### 3. 볼륨 권한 문제

**해결:**
```bash
# 볼륨 삭제 후 재생성
docker-compose down -v
docker-compose up -d
```

## 추가 리소스

- [개발 가이드](./DEVELOPMENT.md) - 개발 환경 설정 상세
- [빠른 시작](./QUICK_START.md) - 빠른 시작 가이드
- [문제 해결](./TROUBLESHOOTING.md) - 상세한 문제 해결 방법
- [API 문서](./API.md) - API 사용법

## 다음 단계

설치가 완료되면:

1. [빠른 시작 가이드](./QUICK_START.md)를 확인하세요
2. [개발 가이드](./DEVELOPMENT.md)를 읽어 개발을 시작하세요
3. [API 문서](./API.md)를 참고하여 API를 사용하세요

---

**설치에 문제가 있나요?** [이슈를 생성](https://github.com/jochee1981/OrderBean/issues)하거나 [문제 해결 가이드](./TROUBLESHOOTING.md)를 확인하세요.

