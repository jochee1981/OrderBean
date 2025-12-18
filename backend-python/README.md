# OrderBean Backend (FastAPI + Python)

백엔드 PRD 기반으로 구현된 FastAPI 백엔드 서버입니다.

## 🚀 기술 스택

- **Framework**: FastAPI 0.109.0
- **Language**: Python 3.10+
- **Database**: PostgreSQL 15 (asyncpg)
- **ORM**: SQLAlchemy 2.0 (Async)
- **Cache**: Redis
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt (passlib)

## 📁 프로젝트 구조

```
backend-python/
├── app/
│   ├── main.py                 # FastAPI 앱 진입점
│   ├── config.py               # 설정
│   ├── database.py             # DB 연결
│   ├── models/                 # SQLAlchemy 모델
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── cafe.py
│   │   ├── menu.py
│   │   └── order.py
│   ├── schemas/                # Pydantic 스키마
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── menu.py
│   │   └── order.py
│   ├── api/                    # API 라우터
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── menus.py
│   │   ├── orders.py
│   │   └── admin.py
│   ├── services/               # 비즈니스 로직
│   │   ├── __init__.py
│   │   ├── menu_service.py
│   │   ├── order_service.py
│   │   └── stock_service.py
│   ├── utils/                  # 유틸리티
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── cache.py
│   │   └── errors.py
│   └── tests/                  # 테스트
│       ├── __init__.py
│       ├── test_menus.py
│       └── test_orders.py
├── alembic/                    # DB 마이그레이션
├── requirements.txt
├── .env.example
└── README.md
```

## 🛠️ 설치 및 실행

### 1. Python 가상환경 생성

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 2. 의존성 설치

```bash
pip install -r requirements.txt
```

### 3. 환경 변수 설정

```bash
cp .env.example .env
# .env 파일을 편집하여 설정 변경
```

### 4. 데이터베이스 마이그레이션

```bash
alembic upgrade head
```

### 5. 서버 실행

```bash
# 개발 서버 (자동 재시작)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 또는
python -m uvicorn app.main:app --reload
```

서버가 실행되면 다음 URL에서 확인할 수 있습니다:
- API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- API Docs (ReDoc): http://localhost:8000/redoc

## 📚 API 문서

서버 실행 후 Swagger UI에서 자동 생성된 API 문서를 확인할 수 있습니다:
http://localhost:8000/docs

## 🧪 테스트

```bash
# 전체 테스트 실행
pytest

# 커버리지 포함
pytest --cov=app --cov-report=html

# 특정 테스트 파일 실행
pytest app/tests/test_menus.py
```

## 🔒 인증

JWT 토큰 기반 인증을 사용합니다.

### 로그인
```bash
POST /api/v1/auth/login
{
  "email": "admin@example.com",
  "password": "password"
}
```

### 인증된 요청
```bash
Authorization: Bearer {token}
```

## 📖 주요 엔드포인트

### 메뉴 관리
- `GET /api/v1/menus` - 메뉴 목록 조회
- `GET /api/v1/menus/{id}` - 메뉴 상세 조회
- `POST /api/v1/menus` - 메뉴 생성 (관리자)
- `PUT /api/v1/menus/{id}` - 메뉴 수정 (관리자)
- `DELETE /api/v1/menus/{id}` - 메뉴 삭제 (관리자)
- `PATCH /api/v1/menus/{id}/stock` - 재고 수정 (관리자)

### 주문 관리
- `POST /api/v1/orders` - 주문 생성
- `GET /api/v1/orders` - 주문 목록 조회
- `GET /api/v1/orders/{id}` - 주문 상세 조회
- `PATCH /api/v1/admin/orders/{id}/status` - 주문 상태 업데이트 (관리자)
- `POST /api/v1/orders/{id}/cancel` - 주문 취소

### 관리자
- `GET /api/v1/admin/orders/dashboard` - 주문 대시보드
- `GET /api/v1/admin/analytics/orders` - 주문 통계

## 🐛 디버깅

FastAPI는 자동으로 에러 로그를 출력합니다. 추가로:

```python
# 로그 레벨 설정
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📦 배포

### Render 배포
1. GitHub 리포지토리 연결
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Docker 배포
```bash
docker build -t orderbean-backend .
docker run -p 8000:8000 orderbean-backend
```

## 🤝 기여

[CONTRIBUTING.md](../docs/CONTRIBUTING.md)를 참조하세요.

## 📄 라이선스

MIT License
