# OrderBean 로컬 실행 가이드

## 현재 상황

PostgreSQL과 Redis가 설치되어 있지 않아 서버가 실행되지 않습니다.

## 해결 방법

### 방법 1: PostgreSQL과 Redis 설치 (권장)

#### PostgreSQL 설치

1. **다운로드**: https://www.postgresql.org/download/windows/
2. **설치**: 설치 마법사 따라하기
   - 포트: 5432 (기본값)
   - 비밀번호: `orderbean_dev` (또는 원하는 비밀번호)
3. **데이터베이스 생성**:
   ```sql
   -- psql 또는 pgAdmin에서 실행
   CREATE DATABASE orderbean;
   CREATE USER orderbean WITH PASSWORD 'orderbean_dev';
   GRANT ALL PRIVILEGES ON DATABASE orderbean TO orderbean;
   ```

#### Redis 설치 (Windows)

**옵션 A: WSL2 사용 (권장)**
```bash
# WSL2에서
sudo apt update
sudo apt install redis-server
sudo service redis-server start
```

**옵션 B: Memurai 사용 (Windows 네이티브)**
1. 다운로드: https://www.memurai.com/
2. 설치 후 자동으로 서비스로 실행됨

**옵션 C: Redis for Windows (비공식)**
- GitHub에서 다운로드: https://github.com/tporadowski/redis/releases

### 방법 2: Docker Desktop 설치 (가장 쉬움)

1. **다운로드**: https://www.docker.com/products/docker-desktop/
2. **설치 후 재시작**
3. **실행**:
   ```bash
   docker-compose up -d
   ```

### 방법 3: 임시로 데이터베이스 없이 실행 (개발용)

데이터베이스 연결을 선택적으로 만들도록 코드를 수정할 수 있습니다.

## 설치 후 실행

### 1. 환경 변수 확인

`backend/.env` 파일이 올바르게 설정되어 있는지 확인:

```env
DATABASE_URL="postgresql://orderbean:orderbean_dev@localhost:5432/orderbean"
REDIS_URL="redis://localhost:6379"
JWT_SECRET=your_secret_key_here
```

### 2. 데이터베이스 마이그레이션

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 3. 서버 실행

**터미널 1 - Backend:**
```bash
cd backend
npm run dev
```

**터미널 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. 접속 확인

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API 문서: http://localhost:3000/api-docs

## 빠른 시작 (Docker 사용 시)

```bash
# 모든 서비스 자동 시작
docker-compose up -d

# 데이터베이스 마이그레이션
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed
```

## 문제 해결

### PostgreSQL 연결 오류
- PostgreSQL 서비스가 실행 중인지 확인
- `DATABASE_URL`이 올바른지 확인
- 방화벽 설정 확인

### Redis 연결 오류
- Redis 서비스가 실행 중인지 확인
- `REDIS_URL`이 올바른지 확인

### 포트 충돌
- `.env` 파일에서 포트 변경
- 또는 사용 중인 프로세스 종료

---

**추천**: Docker Desktop을 설치하는 것이 가장 간단하고 빠릅니다!

