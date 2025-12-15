# 기여 가이드

OrderBean 프로젝트에 기여해주셔서 감사합니다! 이 문서는 프로젝트에 기여하는 방법을 안내합니다.

## 목차

1. [코드 기여](#코드-기여)
2. [이슈 리포트](#이슈-리포트)
3. [Pull Request](#pull-request)
4. [코딩 스타일](#코딩-스타일)
5. [커밋 메시지](#커밋-메시지)

## 코드 기여

### 1. 저장소 포크

1. GitHub에서 저장소를 포크합니다
2. 로컬에 클론합니다:
```bash
git clone https://github.com/your-username/OrderBean.git
cd OrderBean
```

### 2. 개발 환경 설정

[DEVELOPMENT.md](./DEVELOPMENT.md)를 참고하여 개발 환경을 설정합니다.

### 3. 브랜치 생성

```bash
# develop 브랜치에서 시작
git checkout develop
git pull origin develop

# 새 기능 브랜치 생성
git checkout -b feature/your-feature-name
```

**브랜치 네이밍:**
- `feature/`: 새로운 기능
- `fix/`: 버그 수정
- `docs/`: 문서 수정
- `refactor/`: 리팩토링
- `test/`: 테스트 추가/수정

### 4. 개발 및 테스트

1. 코드 작성
2. 테스트 실행:
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

3. 린트 확인:
```bash
npm run lint
```

4. 코드 포맷팅:
```bash
npm run format
```

### 5. 커밋

[커밋 메시지](#커밋-메시지) 가이드를 따릅니다.

```bash
git add .
git commit -m "feat: 새로운 기능 추가"
```

### 6. Push 및 Pull Request

```bash
git push origin feature/your-feature-name
```

GitHub에서 Pull Request를 생성합니다.

## 이슈 리포트

### 버그 리포트

버그를 발견했을 때:

1. **이슈 검색**: 동일한 이슈가 있는지 확인
2. **새 이슈 생성**: 없으면 새 이슈 생성
3. **템플릿 사용**: 버그 리포트 템플릿 사용

**포함할 정보:**
- 버그 설명
- 재현 단계
- 예상 동작
- 실제 동작
- 환경 정보 (OS, 브라우저, Node.js 버전 등)
- 스크린샷/로그 (가능한 경우)

### 기능 제안

새로운 기능을 제안할 때:

1. **이슈 검색**: 유사한 제안이 있는지 확인
2. **새 이슈 생성**: 기능 제안 이슈 생성
3. **템플릿 사용**: 기능 제안 템플릿 사용

**포함할 정보:**
- 기능 설명
- 사용 사례
- 예상 동작
- 대안 고려사항

## Pull Request

### PR 체크리스트

PR을 생성하기 전에 확인:

- [ ] 코드가 프로젝트 스타일 가이드를 따름
- [ ] 테스트가 통과함
- [ ] 새로운 기능에 대한 테스트 추가
- [ ] 문서 업데이트 (필요한 경우)
- [ ] 커밋 메시지가 컨벤션을 따름
- [ ] 브랜치가 최신 develop과 동기화됨

### PR 템플릿

```markdown
## 변경 사항
- 변경 내용 설명

## 관련 이슈
- Closes #123

## 테스트
- [ ] 테스트 통과
- [ ] 수동 테스트 완료

## 스크린샷 (UI 변경인 경우)
- 스크린샷 첨부

## 체크리스트
- [ ] 코드 리뷰 준비 완료
- [ ] 문서 업데이트 (필요한 경우)
```

### 리뷰 프로세스

1. **자동 검사**: CI/CD 파이프라인 실행
2. **코드 리뷰**: 최소 1명의 승인 필요
3. **수정 요청**: 리뷰어의 피드백 반영
4. **병합**: 승인 후 develop 브랜치로 병합

## 코딩 스타일

### TypeScript

- **타입 명시**: 가능한 한 명시적으로 타입 지정
- **인터페이스**: 객체 타입은 interface 사용
- **any 금지**: any 타입 사용 지양

```typescript
// 좋은 예
interface User {
  id: string
  email: string
}

function getUser(id: string): Promise<User> {
  // ...
}

// 나쁜 예
function getUser(id: any): Promise<any> {
  // ...
}
```

### React

- **함수형 컴포넌트**: 클래스 컴포넌트 대신 함수형 사용
- **컴포넌트 이름**: PascalCase
- **Props 타입**: interface로 정의

```typescript
interface ButtonProps {
  label: string
  onClick: () => void
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}
```

### Express

- **라우트 분리**: 기능별로 라우트 파일 분리
- **컨트롤러 분리**: 라우트와 비즈니스 로직 분리
- **에러 처리**: try-catch로 에러 처리

```typescript
export const getMenus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const menus = await prisma.menu.findMany()
    res.json({ success: true, data: menus })
  } catch (error) {
    next(error)
  }
}
```

## 커밋 메시지

### 형식

```
<type>: <subject>

<body>

<footer>
```

### Type

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 설정 변경

### 예시

```
feat(menu): 메뉴 검색 기능 추가

- 메뉴명으로 검색 가능
- 가격대 필터링 추가
- 검색 결과 실시간 업데이트

Closes #123
```

```
fix(order): 주문 생성 시 가격 계산 오류 수정

- 옵션 가격이 제대로 반영되지 않던 문제 해결
- 단위 테스트 추가

Fixes #456
```

## 코드 리뷰 가이드

### 리뷰어

- **건설적 피드백**: 비판보다는 개선 제안
- **명확한 설명**: 왜 그렇게 해야 하는지 설명
- **긍정적 톤**: 존중하는 톤 유지

### 작성자

- **피드백 수용**: 비판적이지 않게 받아들이기
- **질문하기**: 이해가 안 되면 질문하기
- **학습 기회**: 리뷰를 통해 배우기

## 질문하기

질문이 있으면:

1. **문서 확인**: README.md, DEVELOPMENT.md 등 확인
2. **이슈 검색**: 유사한 질문이 있는지 확인
3. **이슈 생성**: 새 이슈 생성 (질문 라벨)
4. **팀 채널**: 팀 채널에서 질문

## 라이선스

기여하신 코드는 프로젝트의 라이선스를 따릅니다.

## 감사합니다!

OrderBean 프로젝트에 기여해주셔서 감사합니다. 여러분의 기여가 프로젝트를 더 좋게 만듭니다! 🎉

