# 문제 해결 가이드

## 목차

1. [일반적인 문제](#일반적인-문제)
2. [Backend 문제](#backend-문제)
3. [Frontend 문제](#frontend-문제)
4. [데이터베이스 문제](#데이터베이스-문제)
5. [Redis 문제](#redis-문제)
6. [배포 문제](#배포-문제)

## 일반적인 문제

### 포트가 이미 사용 중입니다

**증상:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**해결 방법:**

1. 포트를 사용하는 프로세스 찾기:
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

2. 프로세스 종료:
```bash
# Windows
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>
```

3. 또는 다른 포트 사용:
```bash
# Backend .env
PORT=3001

# Frontend vite.config.ts
server: {
  port: 5174
}
```

### 의존성 설치 오류

**증상:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**해결 방법:**

```bash
# node_modules 삭제
rm -rf node_modules package-lock.json

# 캐시 클리어
npm cache clean --force

# 재설치
npm install

# 또는
npm ci
```

## Backend 문제

### Prisma 클라이언트 오류

**증상:**
```
Error: Cannot find module '@prisma/client'
```

**해결 방법:**

```bash
cd backend

# Prisma 클라이언트 재생성
npm run prisma:generate

# 또는
npx prisma generate
```

### 데이터베이스 연결 오류

**증상:**
```
Error: P1001: Can't reach database server
```

**해결 방법:**

1. PostgreSQL이 실행 중인지 확인:
```bash
# Docker
docker-compose ps postgres

# Linux
sudo systemctl status postgresql
```

2. 연결 정보 확인:
```bash
# .env 파일의 DATABASE_URL 확인
cat backend/.env | grep DATABASE_URL
```

3. 연결 테스트:
```bash
psql -h localhost -U orderbean -d orderbean
```

4. Docker로 재시작:
```bash
docker-compose restart postgres
```

### JWT 토큰 오류

**증상:**
```
Error: jwt malformed
Error: jwt expired
```

**해결 방법:**

1. JWT_SECRET 확인:
```bash
# .env 파일에 JWT_SECRET이 설정되어 있는지 확인
```

2. 토큰 만료 시간 확인:
```bash
# JWT_EXPIRES_IN 설정 확인
```

3. 토큰 재발급:
```javascript
// 클라이언트에서 로그인 다시 수행
```

### Redis 연결 오류

**증상:**
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**해결 방법:**

1. Redis가 실행 중인지 확인:
```bash
# Docker
docker-compose ps redis

# Linux
sudo systemctl status redis
```

2. 연결 테스트:
```bash
redis-cli ping
# 응답: PONG
```

3. Docker로 재시작:
```bash
docker-compose restart redis
```

## Frontend 문제

### 빌드 오류

**증상:**
```
Error: Cannot find module '...'
```

**해결 방법:**

```bash
cd frontend

# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 타입 체크
npm run build
```

### 환경 변수 오류

**증상:**
```
VITE_API_URL is undefined
```

**해결 방법:**

1. `.env` 파일 확인:
```bash
# frontend/.env 파일이 존재하는지 확인
cat frontend/.env
```

2. 환경 변수 형식 확인:
```bash
# Vite는 VITE_ 접두사 필요
VITE_API_URL=http://localhost:3000/api/v1
```

3. 개발 서버 재시작:
```bash
# 환경 변수 변경 후 서버 재시작 필요
npm run dev
```

### 라우팅 오류

**증상:**
```
404 Not Found (프로덕션에서 새로고침 시)
```

**해결 방법:**

1. Nginx 설정 확인:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

2. Vite 빌드 설정:
```typescript
// vite.config.ts
export default defineConfig({
  base: '/',
  // ...
})
```

## 데이터베이스 문제

### 마이그레이션 오류

**증상:**
```
Error: Migration failed
```

**해결 방법:**

1. 마이그레이션 상태 확인:
```bash
cd backend
npx prisma migrate status
```

2. 마이그레이션 리셋 (주의: 데이터 삭제됨):
```bash
npx prisma migrate reset
npx prisma migrate dev
```

3. 수동 마이그레이션:
```bash
npx prisma migrate dev --name fix_migration
```

### 스키마 동기화 오류

**증상:**
```
Error: The database schema is not in sync
```

**해결 방법:**

```bash
# 스키마 동기화
npx prisma db push

# 또는 마이그레이션 생성
npx prisma migrate dev
```

### 데이터베이스 연결 풀 오류

**증상:**
```
Error: Too many connections
```

**해결 방법:**

1. Prisma 설정 확인:
```prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // 연결 풀 설정
  connection_limit = 10
}
```

2. PostgreSQL 최대 연결 수 확인:
```sql
SHOW max_connections;
```

## Redis 문제

### 메모리 부족

**증상:**
```
Error: OOM command not allowed
```

**해결 방법:**

1. Redis 메모리 사용량 확인:
```bash
redis-cli info memory
```

2. maxmemory 설정:
```bash
# redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
```

3. 캐시 키 확인:
```bash
redis-cli keys "*"
```

### 캐시 무효화 문제

**해결 방법:**

```bash
# 특정 패턴의 키 삭제
redis-cli --scan --pattern "menus:*" | xargs redis-cli del

# 모든 키 삭제 (주의!)
redis-cli FLUSHALL
```

## 배포 문제

### Docker 빌드 오류

**증상:**
```
Error: failed to solve
```

**해결 방법:**

1. Docker 캐시 클리어:
```bash
docker system prune -a
```

2. 빌드 캐시 없이 재빌드:
```bash
docker-compose build --no-cache
```

### PM2 프로세스 오류

**증상:**
```
Error: Process not found
```

**해결 방법:**

```bash
# 프로세스 목록 확인
pm2 list

# 프로세스 재시작
pm2 restart orderbean-backend

# 로그 확인
pm2 logs orderbean-backend

# 프로세스 삭제 후 재시작
pm2 delete orderbean-backend
pm2 start dist/index.js --name orderbean-backend
```

### Nginx 오류

**증상:**
```
502 Bad Gateway
```

**해결 방법:**

1. Nginx 설정 확인:
```bash
sudo nginx -t
```

2. Backend 서버 상태 확인:
```bash
curl http://localhost:3000/health
```

3. Nginx 로그 확인:
```bash
sudo tail -f /var/log/nginx/error.log
```

## 성능 문제

### 느린 API 응답

**해결 방법:**

1. 데이터베이스 쿼리 최적화:
```typescript
// 인덱스 확인
npx prisma studio

// 쿼리 로그 확인
// schema.prisma에서 log 설정
```

2. Redis 캐싱 확인:
```bash
redis-cli monitor
```

3. 데이터베이스 연결 풀 확인:
```typescript
// Prisma 설정
datasource db {
  connection_limit = 10
}
```

### 메모리 누수

**해결 방법:**

1. Node.js 메모리 사용량 확인:
```bash
# PM2 모니터링
pm2 monit

# 또는
node --inspect dist/index.js
```

2. 힙 스냅샷 분석:
```javascript
// Chrome DevTools 사용
```

## 로그 확인

### Backend 로그

```bash
# 개발 환경
npm run dev

# 프로덕션 (PM2)
pm2 logs orderbean-backend

# Docker
docker-compose logs -f backend
```

### Frontend 로그

```bash
# 브라우저 콘솔
# 개발자 도구 > Console

# 네트워크 요청
# 개발자 도구 > Network
```

### 데이터베이스 로그

```bash
# PostgreSQL 로그
sudo tail -f /var/log/postgresql/postgresql-*.log

# Docker
docker-compose logs -f postgres
```

## 도움 받기

문제가 해결되지 않으면:

1. **로그 확인**: 모든 관련 로그 확인
2. **문서 확인**: README.md, API.md 참고
3. **이슈 등록**: GitHub Issues에 상세 정보와 함께 등록
4. **커뮤니티**: 팀 채널에서 질문

### 이슈 등록 시 포함할 정보

- 오류 메시지 전체
- 재현 단계
- 환경 정보 (OS, Node.js 버전 등)
- 관련 로그
- 스크린샷 (가능한 경우)

