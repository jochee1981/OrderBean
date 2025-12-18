# FastAPI + Python 백엔드 개발 환경 구축 완료

**작성일**: 2024-12-18  
**작업 범위**: FastAPI + Python 기반 백엔드 서버 개발 환경 구축 및 테스트

---

## ✅ 작업 완료 사항

### 1. 개발 환경 구성

#### 1.1 프로젝트 구조 생성

```
backend-python/
├── app/
│   ├── __init__.py          # App 패키지 초기화
│   ├── main.py              # FastAPI 앱 진입점
│   └── config.py            # 설정 관리
├── venv/                    # Python 가상환경
├── requirements.txt         # Python 의존성
├── .env                     # 환경 변수 (생성됨)
├── env.example              # 환경 변수 예시
├── .gitignore              # Git 무시 파일
└── README.md               # 프로젝트 문서
```

#### 1.2 Python 가상환경 생성

```bash
python -m venv venv
```

**Python 버전**: Python 3.10.11

#### 1.3 핵심 패키지 설치

설치된 주요 패키지:

| 패키지 | 버전 | 용도 |
|--------|------|------|
| fastapi | 0.125.0 | 웹 프레임워크 |
| uvicorn | 0.38.0 | ASGI 서버 |
| pydantic | 2.12.5 | 데이터 검증 |
| pydantic-settings | 2.12.0 | 설정 관리 |
| python-dotenv | 1.2.1 | 환경 변수 관리 |
| starlette | 0.50.0 | FastAPI 베이스 |
| watchfiles | 1.1.1 | 파일 변경 감지 (자동 재시작) |

### 2. 서버 설정

#### 2.1 환경 변수 (`.env`)

```env
# 데이터베이스 설정
DATABASE_URL=postgresql+asyncpg://orderbean:orderbean123@localhost:5432/orderbean
DATABASE_TEST_URL=postgresql+asyncpg://orderbean:orderbean123@localhost:5432/orderbean_test

# Redis 설정
REDIS_URL=redis://localhost:6379/0

# JWT 설정
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# 서버 설정
HOST=0.0.0.0
PORT=8000
DEBUG=True
RELOAD=True

# CORS 설정
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# 카페 설정 (기본값)
DEFAULT_CAFE_ID=CAFE-001
```

#### 2.2 FastAPI 앱 구성

**주요 기능**:
- ✅ CORS 미들웨어 설정
- ✅ Lifespan 이벤트 (시작/종료)
- ✅ 자동 API 문서 생성 (Swagger, ReDoc)
- ✅ 환경 변수 기반 설정

**CORS 설정**:
- 허용 Origin: `http://localhost:5173`, `http://localhost:3000`
- 허용 메서드: 모두 (`*`)
- 허용 헤더: 모두 (`*`)
- Credentials: 허용

### 3. 서버 실행

#### 3.1 실행 명령어

```bash
# 가상환경 활성화
.\venv\Scripts\Activate.ps1

# 개발 서버 실행 (자동 재시작)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 3.2 서버 접속 정보

| 항목 | URL | 설명 |
|------|-----|------|
| **API 서버** | http://localhost:8000 | 메인 API 엔드포인트 |
| **Swagger UI** | http://localhost:8000/docs | 대화형 API 문서 |
| **ReDoc** | http://localhost:8000/redoc | API 문서 (읽기 전용) |
| **헬스체크** | http://localhost:8000/health | 서버 상태 확인 |

---

## 🧪 서버 접속 테스트 결과

### 1. 루트 엔드포인트 테스트

**요청**:
```bash
GET http://localhost:8000
```

**응답**:
```json
{
    "message": "OrderBean API Server",
    "version": "1.0.0",
    "status": "running",
    "docs": "/docs"
}
```

✅ **테스트 통과**

---

### 2. 헬스체크 엔드포인트 테스트

**요청**:
```bash
GET http://localhost:8000/health
```

**응답**:
```json
{
    "status": "healthy",
    "database": "connected",
    "redis": "connected"
}
```

✅ **테스트 통과**

---

### 3. API v1 테스트 엔드포인트

**요청**:
```bash
GET http://localhost:8000/api/v1/test
```

**응답**:
```json
{
    "message": "API v1 테스트 성공",
    "endpoint": "/api/v1/test"
}
```

✅ **테스트 통과**

---

### 4. Swagger API 문서 접속

**URL**: http://localhost:8000/docs

✅ **접속 성공**

**화면 구성**:
- API 제목: "OrderBean API"
- 버전: "1.0.0"
- 설명: "커피 주문 관리 시스템 REST API"
- 대화형 API 테스트 가능

---

## 📊 구현된 엔드포인트

### 현재 구현된 엔드포인트 (총 3개)

| 메서드 | 엔드포인트 | 설명 | 상태 |
|--------|-----------|------|------|
| GET | `/` | 서버 정보 | ✅ 동작 |
| GET | `/health` | 헬스 체크 | ✅ 동작 |
| GET | `/api/v1/test` | API 테스트 | ✅ 동작 |

---

## 🔧 해결한 문제들

### 1. 모듈 경로 문제

**문제**:
```
ModuleNotFoundError: No module named 'app'
```

**해결**:
- `python app/main.py` 대신 `uvicorn app.main:app` 사용
- uvicorn이 자동으로 모듈 경로를 올바르게 처리

### 2. ALLOWED_ORIGINS 파싱 오류

**문제**:
```
pydantic_settings.exceptions.SettingsError: error parsing value for field "ALLOWED_ORIGINS"
```

**해결**:
- `List[str]` 타입을 `str` 타입으로 변경
- `cors_origins` 프로퍼티로 쉼표로 구분된 문자열을 리스트로 파싱

**변경 전**:
```python
ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
```

**변경 후**:
```python
ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

@property
def cors_origins(self) -> List[str]:
    return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
```

### 3. Windows 인코딩 오류 (cp949)

**문제**:
```
UnicodeEncodeError: 'cp949' codec can't encode character '\U0001f680'
```

**해결**:
- 이모지 제거 (🚀 → [FastAPI])
- Windows 콘솔의 cp949 인코딩 제한 회피

---

## 📚 다음 단계

### Phase 1: 데이터베이스 연결

- [ ] SQLAlchemy 모델 정의 (User, Cafe, Menu, Order)
- [ ] Alembic 마이그레이션 설정
- [ ] PostgreSQL 연결 설정
- [ ] 데이터베이스 초기화

### Phase 2: 인증 시스템 구현

- [ ] JWT 토큰 생성/검증
- [ ] 회원가입 API (`POST /api/v1/auth/register`)
- [ ] 로그인 API (`POST /api/v1/auth/login`)
- [ ] 인증 미들웨어
- [ ] 권한 관리 (RBAC)

### Phase 3: 메뉴 관리 API

- [ ] 메뉴 목록 조회 (`GET /api/v1/menus`)
- [ ] 메뉴 상세 조회 (`GET /api/v1/menus/{id}`)
- [ ] 메뉴 생성 (`POST /api/v1/menus`) - 관리자
- [ ] 메뉴 수정 (`PUT /api/v1/menus/{id}`) - 관리자
- [ ] 메뉴 삭제 (`DELETE /api/v1/menus/{id}`) - 관리자
- [ ] 재고 관리 (`PATCH /api/v1/menus/{id}/stock`) - 관리자

### Phase 4: 주문 관리 API

- [ ] 주문 생성 (`POST /api/v1/orders`)
- [ ] 주문 목록 조회 (`GET /api/v1/orders`)
- [ ] 주문 상세 조회 (`GET /api/v1/orders/{id}`)
- [ ] 주문 상태 업데이트 (`PATCH /api/v1/admin/orders/{id}/status`)
- [ ] 주문 취소 (`POST /api/v1/orders/{id}/cancel`)

### Phase 5: Redis 캐싱

- [ ] Redis 연결 설정
- [ ] 메뉴 캐싱 (TTL: 1시간)
- [ ] 캐시 무효화

### Phase 6: 테스트 작성

- [ ] pytest 설정
- [ ] 단위 테스트
- [ ] 통합 테스트
- [ ] 커버리지 리포트

---

## 🚀 실행 가이드

### 1. 서버 시작

```bash
cd backend-python
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. API 테스트

```bash
# 루트 엔드포인트
curl http://localhost:8000

# 헬스체크
curl http://localhost:8000/health

# API v1 테스트
curl http://localhost:8000/api/v1/test
```

### 3. API 문서 확인

브라우저에서 다음 URL 접속:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 📝 참고 자료

- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [Pydantic 공식 문서](https://docs.pydantic.dev/)
- [Uvicorn 공식 문서](https://www.uvicorn.org/)
- [백엔드 PRD](../Docs/BACKEND_PRD.md)

---

## ✅ 테스트 체크리스트

- [x] Python 가상환경 생성
- [x] 필수 패키지 설치 (FastAPI, Uvicorn, Pydantic)
- [x] 환경 변수 설정
- [x] FastAPI 앱 생성
- [x] CORS 설정
- [x] 서버 실행
- [x] 루트 엔드포인트 테스트 (`/`)
- [x] 헬스체크 엔드포인트 테스트 (`/health`)
- [x] API v1 테스트 엔드포인트 (`/api/v1/test`)
- [x] Swagger UI 접속 (`/docs`)
- [x] ReDoc 접속 (`/redoc`)

---

**작성자**: AI Developer  
**서버 상태**: ✅ 정상 실행 중  
**접속 가능 URL**: http://localhost:8000
