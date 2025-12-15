# 개발 가이드

## 목차

1. [개발 환경 설정](#개발-환경-설정)
2. [프로젝트 구조](#프로젝트-구조)
3. [개발 워크플로우](#개발-워크플로우)
4. [코딩 컨벤션](#코딩-컨벤션)
5. [테스트](#테스트)
6. [디버깅](#디버깅)

## 개발 환경 설정

### 필수 요구사항

- **Node.js**: v20.x 이상
- **PostgreSQL**: 15.x 이상
- **Redis**: 7.x 이상
- **Docker**: 20.x 이상 (선택사항)
- **Git**: 최신 버전

### 초기 설정

#### 1. 저장소 클론

```bash
git clone <repository-url>
cd OrderBean
```

#### 2. Backend 설정

```bash
cd backend

# 의존성 설치
npm install

# 환경 변수 설정
cp env.example .env
# .env 파일을 편집하여 필요한 값 설정

# Prisma 클라이언트 생성
npm run prisma:generate

# 데이터베이스 마이그레이션
npm run prisma:migrate

# 시드 데이터 생성
npm run prisma:seed
```

#### 3. Frontend 설정

```bash
cd frontend

# 의존성 설치
npm install

# 환경 변수 설정 (필요시)
# .env 파일 생성
echo "VITE_API_URL=http://localhost:3000/api/v1" > .env
echo "VITE_WS_URL=ws://localhost:3000" >> .env
```

#### 4. Docker로 전체 스택 실행 (선택사항)

```bash
# 루트 디렉토리에서
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

### 개발 서버 실행

#### Backend

```bash
cd backend
npm run dev
```

서버는 `http://localhost:3000`에서 실행됩니다.

#### Frontend

```bash
cd frontend
npm run dev
```

프론트엔드는 `http://localhost:5173`에서 실행됩니다.

## 프로젝트 구조

### Backend 구조

```
backend/
├── src/
│   ├── controllers/     # 비즈니스 로직
│   ├── routes/          # API 라우트 정의
│   ├── middleware/      # Express 미들웨어
│   ├── lib/             # 유틸리티 및 라이브러리
│   └── index.ts         # 서버 진입점
├── prisma/
│   ├── schema.prisma    # 데이터베이스 스키마
│   └── seed.ts          # 시드 데이터
└── package.json
```

### Frontend 구조

```
frontend/
├── src/
│   ├── components/      # 재사용 가능한 컴포넌트
│   ├── pages/           # 페이지 컴포넌트
│   ├── stores/          # Zustand 상태 관리
│   ├── lib/             # 유틸리티 및 API 클라이언트
│   ├── App.tsx          # 메인 앱 컴포넌트
│   └── main.tsx         # 진입점
└── package.json
```

## 개발 워크플로우

### 1. 브랜치 전략

- `main`: 프로덕션 배포 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치
- `fix/*`: 버그 수정 브랜치
- `hotfix/*`: 긴급 수정 브랜치

### 2. 새 기능 개발

```bash
# develop 브랜치에서 시작
git checkout develop
git pull origin develop

# 새 기능 브랜치 생성
git checkout -b feature/menu-search

# 작업 후 커밋
git add .
git commit -m "feat: 메뉴 검색 기능 추가"

# 원격 저장소에 푸시
git push origin feature/menu-search
```

### 3. 커밋 메시지 컨벤션

```
<type>: <subject>

<body>

<footer>
```

**Type:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 설정 변경

**예시:**
```
feat(menu): 메뉴 검색 기능 추가

- 메뉴명으로 검색 가능
- 가격대 필터링 추가
- 검색 결과 실시간 업데이트

Closes #123
```

## 코딩 컨벤션

### TypeScript

- **타입 명시**: 가능한 한 명시적으로 타입 지정
- **인터페이스 사용**: 객체 타입은 interface 사용
- **any 금지**: any 타입 사용 지양

```typescript
// 좋은 예
interface User {
  id: string
  email: string
  name: string
}

function getUser(id: string): Promise<User> {
  // ...
}

// 나쁜 예
function getUser(id: any): Promise<any> {
  // ...
}
```

### React 컴포넌트

- **함수형 컴포넌트**: 클래스 컴포넌트 대신 함수형 컴포넌트 사용
- **컴포넌트 이름**: PascalCase
- **Props 타입**: interface로 정의

```typescript
interface MenuCardProps {
  menu: Menu
  onSelect: (menu: Menu) => void
}

export function MenuCard({ menu, onSelect }: MenuCardProps) {
  return (
    <div onClick={() => onSelect(menu)}>
      <h3>{menu.name}</h3>
      <p>{menu.price}원</p>
    </div>
  )
}
```

### Express 라우트

- **라우트 파일**: 기능별로 분리
- **컨트롤러 분리**: 라우트와 비즈니스 로직 분리
- **에러 처리**: try-catch로 에러 처리

```typescript
// routes/menu.routes.ts
router.get('/', getMenus)

// controllers/menu.controller.ts
export const getMenus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 비즈니스 로직
    const menus = await prisma.menu.findMany()
    res.json({ success: true, data: menus })
  } catch (error) {
    next(error)
  }
}
```

## 테스트

### Backend 테스트

```bash
cd backend
npm test
```

### Frontend 테스트

```bash
cd frontend
npm test
```

### E2E 테스트

```bash
npm run test:e2e
```

## 디버깅

### Backend 디버깅

1. **VS Code 디버깅 설정**

`.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "skipFiles": ["<node_internals>/**"],
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

2. **로그 확인**

```typescript
console.log('Debug info:', data)
// 또는
logger.debug('Debug info', { data })
```

### Frontend 디버깅

1. **React DevTools**: 브라우저 확장 프로그램 설치
2. **Redux DevTools**: Zustand DevTools 사용
3. **Network 탭**: API 요청 확인

### 데이터베이스 디버깅

```bash
# Prisma Studio 실행
cd backend
npm run prisma:studio
```

## 유용한 명령어

### Backend

```bash
# 데이터베이스 리셋
npm run prisma:migrate reset

# 마이그레이션 생성
npm run prisma:migrate dev --name migration_name

# Prisma 클라이언트 재생성
npm run prisma:generate

# 린트 실행
npm run lint

# 코드 포맷팅
npm run format
```

### Frontend

```bash
# 빌드
npm run build

# 프로덕션 미리보기
npm run preview

# 린트 실행
npm run lint

# 코드 포맷팅
npm run format
```

## 문제 해결

### 일반적인 문제

1. **포트 충돌**
   - Backend: `.env`에서 `PORT` 변경
   - Frontend: `vite.config.ts`에서 `server.port` 변경

2. **데이터베이스 연결 오류**
   - PostgreSQL이 실행 중인지 확인
   - `.env`의 `DATABASE_URL` 확인

3. **Redis 연결 오류**
   - Redis가 실행 중인지 확인
   - `.env`의 `REDIS_URL` 확인

4. **Prisma 클라이언트 오류**
   ```bash
   npm run prisma:generate
   ```

더 자세한 문제 해결은 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)를 참고하세요.

