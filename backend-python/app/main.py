"""
FastAPI 앱 메인 진입점
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

# 설정
from app.config import settings

# 라우터 (나중에 추가)
# from app.api import auth, menus, orders, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    """앱 시작/종료 시 실행되는 함수"""
    # 시작 시
    print("[FastAPI] 서버 시작")
    print(f"[환경] {'개발' if settings.DEBUG else '운영'}")
    print(f"[CORS] 허용 Origin: {settings.cors_origins}")
    
    yield
    
    # 종료 시
    print("[FastAPI] 서버 종료")


# FastAPI 앱 생성
app = FastAPI(
    title="OrderBean API",
    description="커피 주문 관리 시스템 REST API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 헬스체크 엔드포인트
@app.get("/")
async def root():
    """루트 엔드포인트 - 서버 상태 확인"""
    return {
        "message": "OrderBean API Server",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {
        "status": "healthy",
        "database": "connected",  # TODO: 실제 DB 연결 확인
        "redis": "connected"      # TODO: 실제 Redis 연결 확인
    }


@app.get("/api/v1/test")
async def test_endpoint():
    """테스트 엔드포인트"""
    return {
        "message": "API v1 테스트 성공",
        "endpoint": "/api/v1/test"
    }


# 라우터 등록 (나중에 구현)
# app.include_router(auth.router, prefix="/api/v1/auth", tags=["인증"])
# app.include_router(menus.router, prefix="/api/v1/menus", tags=["메뉴"])
# app.include_router(orders.router, prefix="/api/v1/orders", tags=["주문"])
# app.include_router(admin.router, prefix="/api/v1/admin", tags=["관리자"])


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD
    )
