# 빠른 시작 가이드

OrderBean 프로젝트를 빠르게 시작하는 방법입니다.

## 🚀 5분 안에 시작하기

### 전제 조건

- Node.js 20.x 이상
- Docker (선택사항, 권장)

### 방법 1: Docker 사용 (가장 빠름) ⚡

```bash
# 1. 저장소 클론
git clone https://github.com/jochee1981/OrderBean.git
cd OrderBean

# 2. 환경 변수 설정 (기본값으로도 동작)
cd backend
cp env.example .env
cd ..

# 3. 모든 서비스 시작
docker-compose up -d

# 4. 데이터베이스 마이그레이션
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed

# 완료! 🎉
```

**접속:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API 문서: http://localhost:3000/api-docs

### 방법 2: 로컬 설치

```bash
# 1. 저장소 클론
git clone https://github.com/jochee1981/OrderBean.git
cd OrderBean

# 2. Backend 설치
cd backend
npm install
cp env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 3. Frontend 설치 (새 터미널)
cd ../frontend
npm install

# 4. 서버 실행
# 터미널 1: Backend
cd backend
npm run dev

# 터미널 2: Frontend
cd frontend
npm run dev
```

## 📝 기본 설정

### 최소 환경 변수

`backend/.env` 파일에 최소한 다음만 설정하면 됩니다:

```env
DATABASE_URL="postgresql://orderbean:orderbean_dev@localhost:5432/orderbean"
REDIS_URL="redis://localhost:6379"
JWT_SECRET=your_secret_key_here
```

Docker를 사용하는 경우 `DATABASE_URL`과 `REDIS_URL`은 자동으로 설정됩니다.

## 🔑 기본 계정

시드 데이터로 다음 계정이 자동 생성됩니다:

### 관리자
- **Email**: `admin@orderbean.com`
- **Password**: `admin123`

### 고객
- **Email**: `customer@orderbean.com`
- **Password**: `customer123`

## ✅ 설치 확인

### 1. Backend 확인

```bash
curl http://localhost:3000/health
```

응답: `{"status":"ok","timestamp":"..."}`

### 2. Frontend 확인

브라우저에서 http://localhost:5173 접속

### 3. API 테스트

```bash
# 로그인 테스트
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@orderbean.com","password":"customer123"}'
```

## 🎯 다음 단계

### 1. API 문서 확인

http://localhost:3000/api-docs 에서 Swagger UI로 API를 탐색하세요.

### 2. 첫 번째 요청 보내기

```bash
# 메뉴 목록 조회
curl http://localhost:3000/api/v1/menus
```

### 3. 개발 시작

- [개발 가이드](./DEVELOPMENT.md) 읽기
- [API 문서](./API.md) 참고
- 코드 수정 시작!

## 🛠️ 유용한 명령어

### Docker

```bash
# 모든 서비스 시작
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 서비스 중지
docker-compose down

# 데이터베이스 리셋
docker-compose down -v
docker-compose up -d
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed
```

### 로컬 개발

```bash
# Backend
cd backend
npm run dev              # 개발 서버 실행
npm run prisma:studio    # 데이터베이스 GUI
npm run build            # 빌드

# Frontend
cd frontend
npm run dev              # 개발 서버 실행
npm run build            # 빌드
npm run preview          # 프로덕션 미리보기
```

## 🐛 문제가 발생했나요?

### 빠른 해결

1. **포트 충돌**
   ```bash
   # .env에서 포트 변경
   PORT=3001  # Backend
   ```

2. **데이터베이스 연결 오류**
   ```bash
   # PostgreSQL 실행 확인
   docker-compose ps postgres
   # 또는
   sudo systemctl status postgresql
   ```

3. **의존성 오류**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

더 자세한 문제 해결은 [문제 해결 가이드](./TROUBLESHOOTING.md)를 참고하세요.

## 📚 추가 문서

- [설치 가이드](./INSTALLATION.md) - 상세한 설치 방법
- [개발 가이드](./DEVELOPMENT.md) - 개발 환경 설정
- [API 문서](./API.md) - API 사용법
- [배포 가이드](./DEPLOYMENT.md) - 프로덕션 배포

## 💡 팁

### 개발 효율성 향상

1. **Prisma Studio 사용**
   ```bash
   cd backend
   npm run prisma:studio
   ```
   브라우저에서 데이터베이스 데이터를 시각적으로 확인할 수 있습니다.

2. **Hot Reload**
   - Backend와 Frontend 모두 자동으로 변경사항을 감지합니다
   - 파일 저장 시 자동으로 재시작됩니다

3. **API 문서 활용**
   - Swagger UI에서 직접 API를 테스트할 수 있습니다
   - http://localhost:3000/api-docs

### 프로젝트 구조 이해

```
OrderBean/
├── frontend/     # React 프론트엔드
├── backend/      # Express 백엔드
├── docs/         # 문서
└── docker-compose.yml  # Docker 설정
```

## 🎉 시작하기

이제 준비가 완료되었습니다! 

1. **프로젝트 실행**: 위의 명령어로 서버를 시작하세요
2. **API 탐색**: http://localhost:3000/api-docs 에서 API를 확인하세요
3. **코드 수정**: `frontend/src`와 `backend/src`에서 개발을 시작하세요

**행운을 빕니다!** 🚀

---

**질문이 있나요?** [이슈를 생성](https://github.com/jochee1981/OrderBean/issues)하거나 문서를 확인하세요.

