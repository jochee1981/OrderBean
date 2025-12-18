"""
애플리케이션 설정
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """애플리케이션 설정"""
    
    # 데이터베이스
    DATABASE_URL: str = "postgresql+asyncpg://orderbean:orderbean123@localhost:5432/orderbean"
    DATABASE_TEST_URL: str = "postgresql+asyncpg://orderbean:orderbean123@localhost:5432/orderbean_test"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # 서버
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    RELOAD: bool = True
    
    # CORS (환경 변수에서 쉼표로 구분된 문자열을 파싱)
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    # 기본 카페 ID
    DEFAULT_CAFE_ID: str = "CAFE-001"
    
    @property
    def cors_origins(self) -> List[str]:
        """CORS 허용 origin 리스트 반환"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# 전역 설정 인스턴스
settings = Settings()
