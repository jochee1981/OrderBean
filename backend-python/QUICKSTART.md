# FastAPI 백엔드 서버 시작 가이드

## 🚀 빠른 시작

### 1. 가상환경 활성화
```powershell
cd backend-python
.\venv\Scripts\Activate.ps1
```

### 2. 서버 실행
```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. 서버 접속
- **API 서버**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📝 서버 테스트

### PowerShell에서 테스트
```powershell
# 루트 엔드포인트
Invoke-WebRequest -Uri http://localhost:8000 -UseBasicParsing | ConvertFrom-Json

# 헬스체크
Invoke-WebRequest -Uri http://localhost:8000/health -UseBasicParsing | ConvertFrom-Json

# API v1 테스트
Invoke-WebRequest -Uri http://localhost:8000/api/v1/test -UseBasicParsing | ConvertFrom-Json
```

### Python 스크립트로 테스트
```powershell
python test_server.py
```

## 🛠️ 유용한 명령어

### 패키지 설치
```powershell
pip install -r requirements.txt
```

### 새 패키지 추가 후
```powershell
pip freeze > requirements.txt
```

### 서버 로그 확인
서버를 백그라운드로 실행한 경우, 로그는 다음 위치에 저장됩니다:
```
C:\Users\902_11\.cursor\projects\c-dev-Cursor-pro-OrderBean\terminals\{SHELL_ID}.txt
```

## 🔧 문제 해결

### 포트가 이미 사용 중인 경우
```powershell
# 8000번 포트를 사용하는 프로세스 찾기
netstat -ano | findstr :8000

# 프로세스 종료 (PID는 위에서 확인)
taskkill /PID {PID} /F
```

### 가상환경 재생성
```powershell
# 기존 가상환경 삭제
Remove-Item -Recurse -Force venv

# 새로 생성
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## 📚 참고 자료

- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [백엔드 PRD](../Docs/BACKEND_PRD.md)
- [설정 가이드](./README.md)
