# 테스트 디렉토리 구조

## 디렉토리 구조

```
__tests__/
├── README.md                    # 이 파일
├── RED_TEST_RESULTS.md          # RED 단계 테스트 결과 문서
├── setup.ts                     # Jest 테스트 설정
├── app.test.ts                  # 테스트용 Express app 설정
├── order.controller.test.ts     # 주문 컨트롤러 테스트 (10개)
├── auth.controller.test.ts      # 인증 컨트롤러 테스트 (8개)
├── admin.controller.test.ts     # 관리자 컨트롤러 테스트 (6개)
├── menu.controller.test.ts      # 메뉴 컨트롤러 테스트 (7개)
└── helpers/
    └── testHelpers.ts           # 테스트 헬퍼 함수
```

## 테스트 실행 방법

### 모든 테스트 실행
```bash
npm test
```

### 특정 테스트만 실행
```bash
npm test -- order.controller.test.ts
```

### Watch 모드
```bash
npm run test:watch
```

### 커버리지 확인
```bash
npm run test:coverage
```

## 테스트 작성 가이드

### 테스트 파일 네이밍
- `*.test.ts` 또는 `*.spec.ts` 형식 사용
- 예: `order.controller.test.ts`

### 테스트 구조
```typescript
describe('컨트롤러 이름', () => {
  describe('기능 그룹', () => {
    it('should do something', async () => {
      // 테스트 코드
    })
  })
})
```

### 테스트 헬퍼 사용
```typescript
import { createTestUser, getAuthHeaders } from './helpers/testHelpers'

const token = await createTestUser(app)
const headers = getAuthHeaders(token)
```

## 현재 상태

- ✅ 테스트 환경 설정 완료
- ✅ 실패하는 테스트 작성 완료 (RED 단계)
- ✅ 순환 참조 문제 해결 완료 (`socket.ts` 모듈 사용)
- ✅ 테스트 실행 완료 (36개 실패, 1개 통과 - 예상된 결과)
- ⏳ GREEN 단계 대기 중 (테스트 통과시키기)

## 테스트 결과 문서

- `TEST_EXECUTION_RESULTS.md` - 최신 테스트 실행 결과
- `COVERAGE_REPORT.md` - 테스트 커버리지 리포트

## 참고사항

- 모든 테스트는 TDD 방식으로 작성되었습니다
- 현재는 기능이 미구현되어 대부분 실패하는 것이 예상된 결과입니다
- 테스트 실행 및 커버리지 확인 가능

