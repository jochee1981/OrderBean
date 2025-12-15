# OrderBean 문서

OrderBean 프로젝트의 전체 문서입니다.

## 📚 문서 목록

### 시작하기

- **[빠른 시작](./QUICK_START.md)**: 5분 안에 시작하기 ⚡
- **[설치 가이드](./INSTALLATION.md)**: 상세한 설치 방법

### 개발자 가이드

- **[개발 가이드](./DEVELOPMENT.md)**: 개발 환경 설정 및 개발 워크플로우
- **[API 문서](./API.md)**: REST API 및 WebSocket API 명세
- **[배포 가이드](./DEPLOYMENT.md)**: 프로덕션 배포 방법
- **[문제 해결](./TROUBLESHOOTING.md)**: 일반적인 문제 해결 방법
- **[기여 가이드](./CONTRIBUTING.md)**: 프로젝트 기여 방법

### 프로젝트 문서

- **[README.md](../README.md)**: 프로젝트 개요 및 PRD
- **[PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md)**: 프로젝트 구조 설명

## 🚀 빠른 시작

가장 빠른 방법으로 시작하려면 [빠른 시작 가이드](./QUICK_START.md)를 확인하세요!

### Docker 사용 (권장)

```bash
git clone https://github.com/jochee1981/OrderBean.git
cd OrderBean
docker-compose up -d
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed
```

자세한 내용은 [빠른 시작](./QUICK_START.md) 또는 [설치 가이드](./INSTALLATION.md)를 참고하세요.

## 📖 문서 읽는 순서

### 새로운 개발자

1. [README.md](../README.md) - 프로젝트 개요 이해
2. [QUICK_START.md](./QUICK_START.md) - 빠르게 시작하기 ⚡
3. [INSTALLATION.md](./INSTALLATION.md) - 상세 설치 방법
4. [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md) - 프로젝트 구조 파악
5. [DEVELOPMENT.md](./DEVELOPMENT.md) - 개발 환경 설정
6. [API.md](./API.md) - API 사용법 학습

### 배포 담당자

1. [DEPLOYMENT.md](./DEPLOYMENT.md) - 배포 가이드
2. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 문제 해결

### 기여자

1. [CONTRIBUTING.md](./CONTRIBUTING.md) - 기여 가이드
2. [DEVELOPMENT.md](./DEVELOPMENT.md) - 개발 환경 설정

## 🔍 문서 검색

특정 주제를 찾고 있다면:

- **빠르게 시작**: [QUICK_START.md](./QUICK_START.md) ⚡
- **설치 방법**: [INSTALLATION.md](./INSTALLATION.md)
- **개발 환경**: [DEVELOPMENT.md](./DEVELOPMENT.md)
- **API 사용**: [API.md](./API.md)
- **배포**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **문제 해결**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **기여 방법**: [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📝 문서 업데이트

문서를 개선하거나 업데이트하고 싶다면:

1. 해당 문서 파일 수정
2. Pull Request 생성
3. [CONTRIBUTING.md](./CONTRIBUTING.md) 가이드 따르기

## 💡 도움말

문서에 대한 질문이나 제안이 있으면:

- **이슈 생성**: GitHub Issues에 생성
- **팀 채널**: 팀 채널에서 질문
- **Pull Request**: 직접 개선 제안

## 🔗 외부 리소스

- [React 공식 문서](https://react.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [Prisma 문서](https://www.prisma.io/docs)
- [Express.js 문서](https://expressjs.com/)
- [Vite 문서](https://vitejs.dev/)

---

**문서 버전**: 1.0  
**최종 업데이트**: 2024-12-15

