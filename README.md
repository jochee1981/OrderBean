# OrderBean v1.0 - Product Requirements Document

## Document Info

- **작성자**: AI Developer
- **작성일**: 2024-12-15
- **최종 수정일**: 2024-12-15
- **버전**: 1.0
- **상태**: Draft
- **승인자**: [PM, Tech Lead, Design Lead]

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [목표 및 성공 지표](#2-목표-및-성공-지표)
3. [사용자 & 페르소나](#3-사용자--페르소나)
4. [사용자 스토리](#4-사용자-스토리)
5. [기능 명세](#5-기능-명세)
6. [UX/UI 설계](#6-uxui-설계)
7. [기술 사양](#7-기술-사양)
8. [API 명세](#8-api-명세)
9. [데이터 모델](#9-데이터-모델)
10. [비기능 요구사항](#10-비기능-요구사항)
11. [일정 및 마일스톤](#11-일정-및-마일스톤)
12. [리스크 & 의존성](#12-리스크--의존성)

---

## 1. Executive Summary

### 1.1 제품 개요

OrderBean은 바쁜 직장인 및 단골 고객을 위한 선주문 기반 커피 주문 서비스로, 카페 대기시간 낭비, 복잡한 커스터마이징 주문, 주문 히스토리 관리 어려움을 모바일 앱 & 웹 기반의 사전 주문 시스템으로 해결합니다.

### 1.2 배경 및 필요성

#### 시장 기회

- **국내 커피 시장**: 약 9조 원 규모, 연 8% 성장
- **직장인 커피 소비**: 월 평균 12-15잔 (월 5만원 상당)
- **카페 방문 비율**: 직장인의 72% 주 3회 이상 방문

#### 사용자 문제 (Pain Point)

- **평균 카페 대기시간**: 10-20분 (출근/점심시간)
- **매번 반복되는 복잡한 커스터마이징 설명** (평균 3-5분 소요)
- **좋아하는 주문 조합을 기억하지 못함** (77% 사용자)
- **카페 관리자의 주문 예측 불가능** (자원 낭비)

#### 현재 솔루션의 한계

- **기존 배달앱**: 커피 품질 저하 (따뜻함 유지 불가)
- **카페 자체 앱**: 소수 대형 카페만 구축 (통합성 부족)
- **부분적 선주문 시스템**: 실시간 상태 추적 미흡

### 1.3 핵심 가치

| 가치 | 설명 | 정량적 효과 |
|------|------|-------------|
| 시간 절약 | 선주문으로 카페 대기시간 제거 | 일 10-20분 절약 |
| 편의성 | 1클릭 재주문 + 템플릿 저장 | 주문 시간 50% 단축 |
| 정확한 주문 | 복잡한 커스터마이징 정확하게 전달 | 오류율 90% 감소 |
| 고객 충성도 | 주문 히스토리 + 포인트 시스템 | 재방문율 35% 증가 |
| 카페 운영 효율 | 예측 가능한 주문량 | 준비 시간 최적화 |

### 1.4 범위 (Scope)

#### 포함 (In Scope)

- MVP 5가지 핵심 기능 (메뉴 조회, 주문 생성, 주문 내역 조회, 메뉴 관리, 주문 상태 관리)
- 웹 기반 인터페이스
- 기본 보안 (인증, 인가, 결제)
- 실시간 주문 상태 추적
- 관리자 대시보드

#### 제외 (Out of Scope)

- 모바일 앱 (Phase 2)
- 포인트/리워드 시스템 (Phase 2)
- 다중 카페 관리 (Phase 2)
- 마케팅 자동화 (Phase 3)
- 고급 분석 기능 (Phase 3)

---

## 2. 목표 및 성공 지표

### 2.1 비즈니스 목표

- 출시 후 3개월 내 500개 카페 파트너십 체결
- 월간 활성 사용자 (MAU) 50,000명 달성
- 일일 주문량 10,000건 달성
- 고객 만족도 (NPS) 50 이상 유지

### 2.2 제품 목표

- 주문 처리 시간 80% 단축 (10분 → 2분)
- 고객 재주문율 65% 이상 달성
- 주문 오류율 2% 이하 유지
- 플랫폼 가용성 99.5% 이상 유지

### 2.3 핵심 지표 (Key Metrics)

| 지표 | 목표 | 측정 방법 | 주기 |
|------|------|-----------|------|
| MAU | 50,000명 | 로그인 사용자 | 월간 |
| DAU/MAU | 0.4 (40%) | 일별 활성 사용자 | 월간 |
| 주문 완료율 | 95% | 생성된 주문 중 완료율 | 실시간 |
| 평균 주문 처리 시간 | < 2분 | 주문부터 픽업까지 | 실시간 |
| 재주문율 | 65% | 2주 내 재주문 비율 | 주간 |
| NPS | 50+ | 분기별 고객 설문 | 분기 |
| 앱 크래시율 | < 0.1% | 크래시 발생 빈도 | 실시간 |
| API 응답 시간 | P95 < 200ms | 성능 모니터링 | 실시간 |

### 2.4 성공 기준

#### Launch Criteria

- ✅ 모든 Must-have 기능 완료
- ✅ 크리티컬 버그 0건
- ✅ 로드 테스트 통과 (100 동시 사용자)
- ✅ 보안 감시 통과
- ✅ 베타 테스트 NPS 40 이상

---

## 3. 사용자 & 페르소나

### 3.1 타깃 사용자

**Primary: 바쁜 직장인**

- 규모: 약 1,500만 명 (국내 직장인 기준)
- 연령: 25-45세
- 특성: 시간 효율 중시, 정기적 카페 방문
- 행동: 아침(7-9시), 점심(12-1시), 오후(3-4시)에 주로 방문

**Secondary: 단골 고객**

- 규모: 약 300만 명 (우수 고객)
- 특성: 특정 카페/메뉴 충성도 높음
- 행동: 주 3-5회 정기적 방문
- 니즈: 빠른 재주문, 단골 혜택, 이력 관리

**Tertiary: 카페 운영자**

- 규모: 약 50,000개 카페 (한국)
- 특성: 효율적 주문 관리 필요
- 행동: 실시간 주문 모니터링
- 니즈: 주문 예측, 고객 분석, 매출 통계

### 3.2 Primary Persona

**이름**: 직장인 김민준 (32세)

**배경**:
- 직급: 마케팅 팀장
- 회사: IT 스타트업 (직원 50명)
- 경력: 7년
- 거주지: 서울 강남역 근처
- 월소득: 400만원

**일상 스케줄**:
- 08:30: 출근 → 카페에서 아메리카노
- 12:00: 점심 회의 전 카페라떼
- 15:00: 오후 미팅 전 에스프레소
- 18:00: 야근 준비 콜드브루

**목표**:
- 아침 출근 시간 5분 단축
- 점심시간 여유 확보
- 선호 메뉴를 빠르게 주문

**과제 (Jobs to be Done)**:
- "매일 같은 시간에 같은 커피를 빠르게 사고 싶어"
- "주문할 때마다 복잡하게 설명하기 싫어"
- "내가 뭘 자주 마시는지 한눈에 보고 싶어"

**고충 (Pains)**:
- "출근 길 카페 줄이 너무 길어" (평균 15분)
- "매번 '에스프레소 샷 추가, 시럽 빼고' 반복 설명하기 싫음"
- "새로운 카페에서 뭘 주문할지 몰라서 기본 메뉴만 시킴"
- "지난달에 뭘 마셨는지 기억이 안 나"

**이득 (Gains)**:
- "앱으로 미리 주문하고 바로 픽업하고 싶어"
- "자주 마시는 커피 1클릭으로 주문하고 싶어"
- "어제 마신 커피가 뭐였는지 보고 싶어"
- "매달 커피비가 얼마나 되는지 알고 싶어"

**사용 도구**:
- 스마트폰: iPhone 13 Pro
- 앱: 카카오톡, 슬랙, 노션, 구글 드라이브
- 결제: 신용카드, 삼성페이

**구매 의사결정**:
- 권한: 개인 결정 (월 5만원까지)
- 고려 기간: 1주
- 중요 요소: 편의성 > 가격 > 기능성

### 3.3 Secondary Persona

**이름**: 단골 고객 이현지 (28세)

**특징**:
- 매주 같은 시간에 같은 카페 방문
- 주 3-4회 방문 (월 12-16회)
- 포인트, 멤버십 프로그램 적극 참여
- 새로운 메뉴에 관심 있음

**주요 니즈**:
- "자주 가는 카페 멤버십 적립 빠르게"
- "생일에 특별한 할인받고 싶어"
- "최근에 마신 커피 목록 보고 싶어"

---

## 4. 사용자 스토리

### 4.1 Epic: 메뉴 조회

**Epic ID**: E001

#### User Story 4.1.1: 메뉴 전체 조회

```gherkin
As a 고객
I want to 카페의 모든 메뉴를 한눈에 볼 수 있기를
So that 어떤 커피를 주문할지 쉽게 결정할 수 있다
```

**Acceptance Criteria**:
- [ ] 메뉴가 카테고리별로 분류되어 표시됨 (에스프레소, 라떼, 프라푸치노, 차 등)
- [ ] 각 메뉴에 이미지, 이름, 가격, 설명이 표시됨
- [ ] 메뉴 로딩 시간이 1초 이내
- [ ] 총 메뉴 개수가 50개 이상 표시 가능
- [ ] 모바일에서도 스크롤 가능 (반응형)

**Priority**: Must Have  
**Story Points**: 3  
**Sprint**: Sprint 1

#### User Story 4.1.2: 메뉴 검색 및 필터링

```gherkin
As a 고객
I want to 메뉴를 검색하고 필터링할 수 있기를
So that 원하는 메뉴를 빠르게 찾을 수 있다
```

**Acceptance Criteria**:
- [ ] 메뉴명으로 검색 가능 (최소 2자)
- [ ] 가격대 필터링 가능 (3천~7천원)
- [ ] 온도 필터링 (HOT/ICED)
- [ ] 검색 결과는 0.3초 이내 표시
- [ ] 필터 조합 가능 (가격 + 온도)
- [ ] 검색 결과 0건일 때 안내 메시지 표시

**Priority**: Should Have  
**Story Points**: 5  
**Sprint**: Sprint 1

#### User Story 4.1.3: 메뉴 상세 정보 조회

```gherkin
As a 고객
I want to 메뉴의 상세 정보와 커스터마이징 옵션을 볼 수 있기를
So that 정확하게 주문할 수 있다
```

**Acceptance Criteria**:
- [ ] 메뉴 클릭 시 상세 정보 모달/페이지 열림
- [ ] 다음 정보가 표시됨:
  - 큰 이미지
  - 메뉴명, 설명, 가격
  - 선택 가능한 옵션 (사이즈, 시럽, 우유 등)
  - 영양 정보 (선택사항)
  - 고객 평점 (향후)
- [ ] 옵션 선택 시 가격이 실시간으로 업데이트됨
- [ ] "주문하기" 버튼이 명확히 표시됨

**Priority**: Must Have  
**Story Points**: 5  
**Sprint**: Sprint 1

### 4.2 Epic: 주문 생성

**Epic ID**: E002

#### User Story 4.2.1: 옵션 선택 후 주문 생성

```gherkin
Scenario: 고객이 옵션을 선택하여 주문한다

Given 고객이 메뉴 상세 페이지에서 "카페라떼"를 보고
And "사이즈: Medium(기본값)", "우유: 일반" 옵션이 선택되어 있으며
When 고객이 샷을 "+1"로 변경하고(추가 요금 500원)
And 우유를 "저지방"으로 변경하고(무료)
And "주문하기" 버튼을 클릭하면
Then 주문이 성공적으로 생성되고
And 최종 가격이 4,500원(기본) + 500원(샷) = 5,000원으로 계산되며
And 주문 번호 "ORD-20241215-001"이 발급된다
And 주문 상태 화면으로 이동한다
```

**Priority**: Must Have  
**Story Points**: 8  
**Sprint**: Sprint 1

#### User Story 4.2.2: 장바구니 추가 및 수량 조절

```gherkin
Scenario: 고객이 여러 메뉴를 주문한다

Given 고객이 메뉴 페이지에 있고
When 고객이 "아메리카노"를 수량 2개로 "주문에 추가"하고
And "카페라떼"를 수량 1개로 "주문에 추가"하면
Then 장바구니에 2개의 메뉴 항목이 표시되고
And 총 주문 항목 수는 3개로 계산되며
And 예상 총액이 (3,500 × 2) + 4,500 = 11,500원으로 표시되고
And 수량을 변경하면 가격이 실시간 업데이트된다
And 각 메뉴를 개별 제거할 수 있다
```

**Priority**: Should Have  
**Story Points**: 5  
**Sprint**: Sprint 1

#### User Story 4.2.3: 픽업 시간 선택 및 결제

```gherkin
Scenario: 고객이 픽업 시간을 선택하고 결제한다

Given 고객이 주문 요약 페이지에 있고
And 현재 시간이 14:30이며
When 고객이 픽업 시간을 "지금(14:40)"로 선택하고
And 결제 수단을 선택하고
And "결제하기" 버튼을 클릭하면
Then 결제가 정상 처리되고
And 주문이 생성되며
And 카페에 주문이 즉시 전달되고
And 고객에게 주문 번호와 예상 픽업 시간이 표시된다
```

**Priority**: Must Have  
**Story Points**: 8  
**Sprint**: Sprint 1

### 4.3 Epic: 주문 내역 조회

**Epic ID**: E003

#### User Story 4.3.1: 주문 목록 조회

```gherkin
Scenario: 고객이 주문 내역을 확인한다

Given 고객이 로그인하고
And 고객의 주문 내역에 최근 주문 5개가 있으며
When 고객이 "주문 내역" 페이지에 접속하면
Then 최근 주문순으로 모든 주문이 목록에 표시되고
And 각 주문의 다음 정보가 보여진다:
     - 주문번호
     - 주문일시
     - 메뉴명
     - 총액
     - 현재 상태
And 상태별 필터링이 가능하다 (진행중/완료/취소됨)
```

**Priority**: Must Have  
**Story Points**: 5  
**Sprint**: Sprint 2

#### User Story 4.3.2: 실시간 주문 상태 추적

```gherkin
Scenario: 고객이 주문 상태를 실시간으로 확인한다

Given 고객이 진행 중인 주문을 클릭하고
And 현재 주문 상태가 "준비 중"이며
When 시간이 경과하여 카페에서 상태를 "준비 완료"로 변경하면
Then 고객의 화면이 자동으로 실시간 업데이트되고
And 상태가 "준비 완료"로 변경되며
And 푸시 알림이 발송되고
And 알림 메시지: "준비 완료! 카운터에서 픽업해주세요."
```

**Priority**: Must Have  
**Story Points**: 8  
**Sprint**: Sprint 2

#### User Story 4.3.3: 재주문 (이전 주문 복사)

```gherkin
Scenario: 고객이 이전 주문과 동일하게 재주문한다

Given 고객이 주문 내역에서 과거 주문을 보고
When 고객이 "재주문" 버튼을 클릭하면
Then 동일한 메뉴와 옵션이 장바구니에 추가되고
And 고객은 수정 없이 바로 결제 가능하며
And 또는 필요시 옵션을 수정할 수 있고
And 최종 가격이 자동으로 계산된다
```

**Priority**: Should Have  
**Story Points**: 3  
**Sprint**: Sprint 2

### 4.4 Epic: 메뉴 관리 [관리자]

**Epic ID**: E004

#### User Story 4.4.1: 메뉴 생성 (관리자)

```gherkin
Scenario: 관리자가 새로운 메뉴를 등록한다

Given 관리자가 메뉴 관리 대시보드에 접속하고
When 관리자가 "메뉴 추가" 버튼을 클릭하고
And 다음 정보를 입력한다:
     - 메뉴명: "콜드브루"
     - 가격: 5,500원
     - 설명: "차가운 브루드 커피"
     - 카테고리: "에스프레소"
     - 이미지 업로드
And "저장" 버튼을 클릭하면
Then 새로운 메뉴가 데이터베이스에 저장되고
And 메뉴 목록에 "콜드브루"가 추가되며
And 고객의 메뉴 페이지에 즉시 반영되고
And 감사 로그에 기록된다
```

**Priority**: Must Have  
**Story Points**: 5  
**Sprint**: Sprint 1

#### User Story 4.4.2: 메뉴 옵션 관리

```gherkin
Scenario: 관리자가 메뉴에 커스터마이징 옵션을 추가한다

Given 관리자가 "카페라떼" 메뉴를 편집하고
When 관리자가 "옵션 추가" 버튼을 클릭하고
And 옵션 그룹 "시럽"을 생성하고
And 옵션 항목을 추가한다:
     - 바닐라 시럽 (+500원)
     - 카라멜 시럽 (+500원)
     - 헤이즐넛 시럽 (+500원)
And "저장" 버튼을 클릭하면
Then 옵션이 메뉴에 저장되고
And 고객이 "카페라떼" 주문 시 시럽 옵션을 선택할 수 있으며
And 옵션 선택 시 가격이 자동으로 추가된다
```

**Priority**: Must Have  
**Story Points**: 5  
**Sprint**: Sprint 1

#### User Story 4.4.3: 메뉴 수정 및 삭제

```gherkin
Scenario: 관리자가 메뉴 정보를 수정하고 비활성화한다

Given 관리자가 메뉴 관리 페이지에서 "카페라떼"를 선택하고
And 현재 가격이 4,500원이며
When 관리자가 가격을 4,000원으로 변경하고
And 설명을 수정하고
And "저장" 버튼을 클릭하면
Then 메뉴가 업데이트되고
And 고객의 메뉴 페이지에서 새로운 가격 4,000원이 반영되며
And 업데이트 이력이 기록된다

And 판매를 중단하려면
When 관리자가 "비활성화" 버튼을 클릭하면
Then 메뉴가 고객에게 보이지 않으며
And 기존 주문은 영향을 받지 않는다
```

**Priority**: Must Have  
**Story Points**: 5  
**Sprint**: Sprint 1

### 4.5 Epic: 주문 상태 관리 [관리자]

**Epic ID**: E005

#### User Story 4.5.1: 주문 모니터링 대시보드

```gherkin
Scenario: 관리자가 실시간으로 들어오는 주문을 확인한다

Given 카페의 주문 모니터링 대시보드가 열려 있고
When 고객이 새로운 주문 "ORD-001"(아메리카노, 샷+1)을 생성하면
Then 대시보드에 새 주문이 즉시 맨 위에 표시되고
And "새로운 주문" 알림음이 울리며
And 주문 상세 (메뉴, 옵션, 수량, 픽업 시간)가 표시되고
And 주문 상태는 "새로운 주문"으로 설정된다

And 들어온 주문들이 다음과 같이 분류되어 표시된다:
- "새로운 주문" (최우선)
- "준비 중" (진행 중)
- "준비 완료" (픽업 대기)
```

**Priority**: Must Have  
**Story Points**: 8  
**Sprint**: Sprint 2

#### User Story 4.5.2: 주문 상태 업데이트

```gherkin
Scenario: 관리자가 주문 상태를 업데이트한다

Given 관리자가 "ORD-001" 주문을 보고
And 현재 상태가 "새로운 주문"이며
When 바리스타가 커피 준비를 시작하고
And 관리자가 상태를 "준비 중"으로 변경하면
Then 주문 상태가 업데이트되고
And 고객의 주문 추적 페이지에서 실시간으로 "준비 중"이 표시되며
And 준비가 완료되어 상태를 "준비 완료"로 변경하면
Then 고객에게 즉시 푸시 알림이 발송되고
And 알림 메시지: "준비 완료! 카운터에서 픽업해주세요"
```

**Priority**: Must Have  
**Story Points**: 5  
**Sprint**: Sprint 2

#### User Story 4.5.3: 주문 통계 및 분석

```gherkin
Scenario: 관리자가 주문 통계를 조회한다

Given 관리자가 "분석" 탭에 접속하고
And 기간을 "오늘"로 선택하면
Then 다음 통계가 표시된다:
     - 총 주문 수: 45개
     - 총 매출액: 247,500원
     - 평균 준비 시간: 5분 23초
     - 인기 메뉴 Top 3: 
       • 아메리카노 (15개)
       • 카페라떼 (12개)
       • 콜드브루 (8개)
     - 취소율: 2.2% (1개)
     - 시간대별 주문량 그래프

And 기간을 확장하여 주간/월간 트렌드를 볼 수 있다
```

**Priority**: Should Have  
**Story Points**: 8  
**Sprint**: Sprint 3

---

## 5. 기능 명세

### 5.1 Feature: 메뉴 조회 (F001)

**우선순위**: Must Have  
**담당**: 백엔드팀 + 프론트엔드팀  
**예상 공수**: 1.5 weeks

#### 5.1.1 기능 설명

고객이 카페의 전체 메뉴를 조회하고, 검색/필터링하며, 상세 정보와 커스터마이징 옵션을 확인하는 기능

#### 5.1.2 입력 (Input)

| 필드 | 타입 | 필수 | 제약사항 | 기본값 |
|------|------|------|----------|--------|
| cafeId | UUID | ○ | 유효한 카페 ID | - |
| category | string | | espresso, latte, frappuccino, tea | - |
| minPrice | integer | | 0 이상 | 0 |
| maxPrice | integer | | minPrice 이상 | 10000 |
| searchTerm | string | | 2-50자 | - |
| sortBy | enum | | name, price, popularity | popularity |
| page | integer | | 1 이상 | 1 |
| limit | integer | | 1-100 | 20 |

#### 5.1.3 처리 로직 (Process)

1. **입력 검증**
   - cafeId 존재 여부 확인
   - 가격 범위 유효성 검사 (minPrice ≤ maxPrice)
   - 페이지네이션 범위 확인
   - searchTerm 길이 검증

2. **캐시 확인**
   - Redis에서 같은 쿼리 조건으로 캐시 검색
   - 캐시 히트 시 즉시 반환 (TTL: 1시간)

3. **데이터베이스 조회**
   - menus 테이블에서 다음 조건으로 필터링:
     - cafe_id = cafeId
     - is_active = true
     - category 일치 (지정된 경우)
     - price BETWEEN minPrice AND maxPrice
     - name ILIKE searchTerm (검색어 포함)
   - 정렬 적용:
     - name: 알파벳 순
     - price: 낮은 순/높은 순
     - popularity: 판매량 많은 순
   - 페이지네이션 적용

4. **메뉴별 옵션 조회**
   - 각 메뉴의 option_groups, menu_options 조인

5. **응답 생성 및 캐싱**
   - JSON 응답 포맷팅
   - Redis에 캐시 저장

6. **응답 반환**

#### 5.1.4 출력 (Output)

```json
{
  "success": true,
  "data": {
    "menus": [
      {
        "id": "MENU-001",
        "name": "아메리카노",
        "price": 3500,
        "category": "espresso",
        "description": "진한 에스프레소와 뜨거운 물",
        "imageUrl": "https://cdn.example.com/menu-001.jpg",
        "isActive": true,
        "optionGroups": [
          {
            "id": "OG-001",
            "name": "Size",
            "isRequired": true,
            "allowMultiple": false,
            "options": [
              {
                "id": "OPT-001",
                "name": "Small",
                "priceAdjustment": 0
              },
              {
                "id": "OPT-002",
                "name": "Large",
                "priceAdjustment": 500
              }
            ]
          },
          {
            "id": "OG-002",
            "name": "Shot",
            "isRequired": false,
            "allowMultiple": true,
            "options": [
              {
                "id": "OPT-003",
                "name": "+1 Shot",
                "priceAdjustment": 500
              }
            ]
          }
        ]
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  },
  "timestamp": "2024-12-15T14:30:00Z"
}
```

#### 5.1.5 오류 처리

| HTTP | 에러 코드 | 상황 | 메시지 |
|------|-----------|------|--------|
| 400 | INVALID_INPUT | 입력 검증 실패 | "가격 범위가 올바르지 않습니다" |
| 404 | CAFE_NOT_FOUND | 카페 없음 | "카페를 찾을 수 없습니다" |
| 500 | DB_ERROR | DB 오류 | "메뉴 조회 중 오류가 발생했습니다" |

#### 5.1.6 비기능 요구사항

- 응답 시간: P95 < 200ms, P99 < 500ms
- 캐시: Redis TTL 1시간
- 동시성: 1000+ 동시 요청 처리
- 가용성: 99.9%

### 5.2 Feature: 주문 생성 (F002)

**우선순위**: Must Have  
**담당**: 백엔드팀 + 결제팀  
**예상 공수**: 2 weeks

#### 5.2.1 기능 설명

고객이 메뉴를 선택하고 옵션을 커스터마이징하여 주문을 생성하고 결제하는 기능

#### 5.2.2 입력 (Input)

```json
{
  "cafeId": "CAFE-001",
  "items": [
    {
      "menuId": "MENU-001",
      "quantity": 2,
      "selectedOptions": [
        {
          "optionGroupId": "OG-001",
          "selectedOptionId": "OPT-001"
        },
        {
          "optionGroupId": "OG-002",
          "selectedOptionIds": ["OPT-003"]
        }
      ],
      "notes": "뜨겁게 부탁합니다"
    }
  ],
  "pickupTime": "2024-12-15T14:40:00Z",
  "couponCode": "WELCOME10",
  "paymentMethod": "credit_card",
  "paymentToken": "pm_1234567890"
}
```

#### 5.2.3 처리 로직 (Process)

1. **입력 검증**
   - 모든 필수 필드 확인
   - 옵션 조합 유효성 검사 (필수 옵션 선택 확인)
   - 수량 범위 확인 (1-10)
   - 픽업 시간이 현재 시간 이후인지 확인

2. **트랜잭션 시작** (BEGIN)

3. **재고 확인** (FOR UPDATE)
   - 각 메뉴의 현재 재고 확인
   - 부족 시 에러 반환 및 ROLLBACK

4. **가격 계산**
   - 각 항목의 기본 가격
   - 선택된 옵션의 추가 요금
   - 소계 = (기본 가격 + 옵션 요금) × 수량
   - 합계 = 모든 항목의 소계 합
   - 할인 가능 시 할인액 적용

5. **주문 생성**
   - orders 테이블에 INSERT
   - order_items 테이블에 INSERT
   - order_item_options 테이블에 INSERT

6. **결제 처리**
   - 결제 게이트웨이 호출 (Toss Payments)
   - 거래 ID 저장
   - 결제 실패 시 ROLLBACK

7. **크레딧 차감** (향후 기능)

8. **트랜잭션 커밋** (COMMIT)

9. **실시간 알림 발송**
   - 카페 관리자: 새 주문 알림
   - 고객: 주문 확인 알림

10. **응답 반환**

#### 5.2.4 출력 (Output)

```json
{
  "success": true,
  "data": {
    "orderId": "ORD-001",
    "orderNumber": "ORD-20241215-001",
    "customerId": "CUST-001",
    "cafeId": "CAFE-001",
    "status": "pending",
    "items": [
      {
        "menuId": "MENU-001",
        "menuName": "아메리카노",
        "quantity": 2,
        "unitPrice": 3500,
        "selectedOptions": [
          {
            "groupName": "Size",
            "optionName": "Small",
            "priceAdjustment": 0
          }
        ],
        "subtotal": 7000
      }
    ],
    "totalAmount": 7000,
    "discountAmount": 700,
    "finalAmount": 6300,
    "pickupTime": "2024-12-15T14:40:00Z",
    "pickupEstimatedTime": "2024-12-15T14:45:00Z",
    "paymentStatus": "completed",
    "paymentMethod": "credit_card",
    "createdAt": "2024-12-15T14:30:00Z"
  }
}
```

#### 5.2.5 오류 처리

| HTTP | 에러 코드 | 상황 | 대응 |
|------|-----------|------|------|
| 400 | INVALID_OPTIONS | 필수 옵션 미선택 | "사이즈를 선택해주세요" |
| 400 | OUT_OF_STOCK | 재고 부족 | "일시적으로 품절되었습니다" |
| 402 | PAYMENT_FAILED | 결제 실패 | "결제에 실패했습니다. 다시 시도해주세요" |
| 429 | RATE_LIMIT | 너무 많은 요청 | "잠시 후 다시 시도해주세요" |
| 500 | ORDER_CREATION_ERROR | 주문 생성 오류 | "주문 생성 중 오류 발생" |

### 5.3 Feature: 주문 내역 조회 (F003)

**우선순위**: Must Have  
**담당**: 백엔드팀 + 프론트엔드팀  
**예상 공수**: 1.5 weeks

#### 5.3.1 기능 설명

고객이 자신의 주문 목록을 조회하고, 상세 내역을 보며, 실시간으로 주문 상태를 추적하는 기능

#### 5.3.2 주요 엔드포인트

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|
| GET | `/api/v1/orders` | 주문 목록 조회 |
| GET | `/api/v1/orders/:id` | 주문 상세 조회 |
| PATCH | `/api/v1/orders/:id` | 주문 상태 업데이트 (취소 등) |
| GET | `/api/v1/orders/:id/status` | 실시간 상태 조회 |
| POST | `/api/v1/orders/:id/retry` | 주문 재주문 |

#### 5.3.3 처리 로직

**GET /api/v1/orders** (주문 목록)

1. 사용자 인증 확인
2. 필터링 조건 적용
   - status (pending, preparing, ready, completed, cancelled)
   - date range
   - cafeId
3. 정렬 (최신순, 오래된순)
4. 페이지네이션 적용
5. 응답 반환

**GET /api/v1/orders/:id** (상세 조회)

1. 주문 소유자 인증 확인
2. order_items, order_item_options 조인
3. 결제 정보 포함
4. 응답 반환

**WebSocket: /ws/orders/:id** (실시간 상태 추적)

1. 연결 확인
2. order status 변경 감지
3. 자동 푸시 알림
4. 클라이언트에 실시간 업데이트

#### 5.3.4 출력 예시

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ORD-001",
        "orderNumber": "ORD-20241215-001",
        "status": "ready",
        "items": [
          {
            "menuName": "아메리카노",
            "quantity": 1,
            "options": ["Small", "+1 Shot"]
          }
        ],
        "totalAmount": 4000,
        "finalAmount": 3800,
        "pickupTime": "2024-12-15T14:40:00Z",
        "createdAt": "2024-12-15T14:30:00Z"
      }
    ],
    "pagination": { "total": 25, "page": 1 }
  }
}
```

### 5.4 Feature: 메뉴 관리 (F004) [관리자]

**우선순위**: Must Have  
**담당**: 백엔드팀 + 어드민팀  
**예상 공수**: 1.5 weeks

#### 5.4.1 CRUD 작업

| 작업 | 엔드포인트 | 메서드 | 권한 |
|------|------------|--------|------|
| 조회 | `/api/v1/menus` | GET | customer, admin |
| 생성 | `/api/v1/menus` | POST | admin |
| 수정 | `/api/v1/menus/:id` | PUT | admin |
| 삭제 | `/api/v1/menus/:id` | DELETE | admin |
| 옵션 추가 | `/api/v1/menus/:id/options` | POST | admin |

#### 5.4.2 처리 로직

**POST /api/v1/menus** (메뉴 생성)

1. 관리자 권한 확인
2. 입력 검증 (이름, 가격, 카테고리)
3. 이미지 업로드 (S3)
4. 메뉴 INSERT
5. 캐시 무효화
6. 감사 로그 기록
7. 응답 반환

**PUT /api/v1/menus/:id** (메뉴 수정)

1. 관리자 권한 확인
2. 메뉴 존재 여부 확인
3. 변경 내용 검증
4. 메뉴 UPDATE
5. 캐시 무효화
6. 감사 로그 기록
7. 변경사항 응답 반환

**DELETE /api/v1/menus/:id** (소프트 삭제)

1. 관리자 권한 확인
2. 메뉴 존재 여부 확인
3. deleted_at 설정
4. 캐시 무효화
5. 감사 로그 기록

### 5.5 Feature: 주문 상태 관리 (F005) [관리자]

**우선순위**: Must Have  
**담당**: 백엔드팀 + 어드민팀  
**예상 공수**: 2 weeks

#### 5.5.1 상태 전환 (State Machine)

```
         ┌─────────────────────────────────┐
         ▼                                 │
    [PENDING] ──────► [PREPARING] ──────► [READY] ──────► [PICKED] ──────► [COMPLETED]
         │                                                                        ▲
         │                                                                        │
         └────────────────────── [CANCELLED] ◄──────────────────────────────────┘
              (즉시 가능)         (준비 완료 전까지만 가능)
```

#### 5.5.2 엔드포인트

| 작업 | 엔드포인트 | 메서드 |
|------|------------|--------|
| 모니터링 | `/api/v1/admin/orders/dashboard` | GET |
| 상태 변경 | `/api/v1/admin/orders/:id/status` | PATCH |
| 통계 | `/api/v1/admin/analytics/orders` | GET |

#### 5.5.3 처리 로직

**PATCH /api/v1/admin/orders/:id/status**

1. 관리자 권한 확인
2. 주문 존재 여부 확인
3. 상태 전환 유효성 검사 (상태 머신)
4. orders.status UPDATE
5. 고객에게 푸시 알림 발송
6. WebSocket으로 실시간 업데이트
7. 감사 로그 기록
8. 응답 반환

**GET /api/v1/admin/analytics/orders**

1. 관리자 권한 확인
2. 기간 범위 검증
3. 집계 데이터 계산:
   - 총 주문 수
   - 총 매출액
   - 평균 준비 시간
   - 취소율
   - 메뉴별 판매량
   - 시간대별 분포
4. 응답 반환

---

## 6. UX/UI 설계

### 6.1 디자인 원칙

- **단순성**: 핵심 기능에 집중
- **즉각성**: 모든 액션에 빠른 피드백
- **일관성**: 전체 플랫폼 통일된 경험
- **접근성**: 모든 사용자가 쉽게 사용

### 6.2 주요 화면 설계

#### 6.2.1 메인 화면 (고객)

```
┌─────────────────────────────────┐
│ OrderBean          [🔔] [👤]    │
├─────────────────────────────────┤
│  📍 강남역 카페                   │
│                                 │
│  🔍 메뉴 검색...                 │
│                                 │
│ [에스프레소] [라떼] [프라] [차]  │
│                                 │
│ ┌─────────────┐ ┌─────────────┐ │
│ │ 아메리카노  │ │ 카페라떼    │ │
│ │ 3,500원     │ │ 4,500원     │ │
│ │ ⭐⭐⭐⭐⭐ │ │ ⭐⭐⭐⭐⭐ │ │
│ │ [+추가]     │ │ [+추가]     │ │
│ └─────────────┘ └─────────────┘ │
│                                 │
│ 🛒 2개 선택됨                    │
│ 총액: 11,500원 [주문하기]        │
└─────────────────────────────────┘
```

#### 6.2.2 주문 상태 추적 화면

```
┌─────────────────────────────────┐
│ 주문 번호: ORD-20241215-001     │
├─────────────────────────────────┤
│                                 │
│ 🔴 새로운 주문 ► 🟡 준비 중 ► 🟢 준비 완료 │
│      완료        진행 중                  │
│                                 │
│ 예상 픽업 시간: 14:40           │
│ 남은 시간: 8분                  │
│                                 │
│ 주문 내용:                      │
│ • 아메리카노 × 2                │
│   - Small, +1 Shot              │
│ • 카페라떼 × 1                  │
│   - Medium, 저지방 우유         │
│                                 │
│ 합계: 11,500원                  │
│ 할인: -1,000원                  │
│ 최종: 10,500원                  │
│                                 │
│ [취소하기]  [카운터로 이동]     │
└─────────────────────────────────┘
```

#### 6.2.3 관리자 대시보드

```
┌──────────────────────────────────────┐
│ 카페 관리 대시보드                    │
├──────┬───────────────────────────────┤
│ 메뉴 │ 📥 새 주문 3개 ┌─────────────┐│
│ 주문 │ 🟡 준비 중 5개 │ ORD-001    ││
│ 분석 │ 🟢 완료 대기 2개 │아메리카노×2││
│ 설정 │                │[준비 시작]  ││
│      │ ┌────────────┐ └─────────────┘│
│      │ │ 새 주문    │ ┌─────────────┐│
│      │ │ORD-002    │ │ ORD-002    ││
│      │ │카페라떼×1 │ │카페라떼×1  ││
│      │ │[준비 완료] │ │[픽업 완료]  ││
│      │ └────────────┘ └─────────────┘│
│      │                                │
│      │ 오늘의 통계                    │
│      │ • 총 주문: 45개                │
│      │ • 매출: 247,500원              │
│      │ • 평균 준비: 5분 23초          │
└──────┴───────────────────────────────┘
```

---

## 7. 기술 사양

### 7.1 기술 스택

#### Frontend

- **Framework**: React 18 + TypeScript
- **UI Library**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios + React Query
- **Real-time**: Socket.io
- **Build Tool**: Vite

#### Backend

- **Framework**: Node.js + Express
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Cache**: Redis
- **Task Queue**: Bull
- **API Doc**: Swagger/OpenAPI

#### Infrastructure

- **Hosting**: AWS EC2 / DigitalOcean
- **CDN**: Cloudflare
- **Storage**: AWS S3 (이미지)
- **Monitoring**: Sentry
- **CI/CD**: GitHub Actions
- **Containerization**: Docker

#### Payment

- **Gateway**: Toss Payments
- **Integration**: Toss SDK

### 7.2 시스템 아키텍처

```
┌─────────────────┐
│   Client (SPA)  │
│   React/TS      │
└────────┬────────┘
         │ HTTPS
         ▼
┌──────────────────────────────┐
│   Cloudflare CDN / WAF       │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│   Load Balancer (Nginx)      │
└────────┬─────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌─────────┐┌─────────┐
│App 1    ││App 2    │
│Express  ││Express  │
└────┬────┘└────┬────┘
     │          │
     └────┬─────┘
          │
    ┌─────┴─────┬────────────┬───────────┐
    ▼           ▼            ▼           ▼
┌─────────┐ ┌────────┐ ┌────────┐ ┌─────────┐
│PostgreSQL │Redis   │  S3    │Bull Queue
│ Database  │ Cache  │Storage │ Task
└─────────┘ └────────┘ └────────┘ └─────────┘
    │           │
    └─────┬─────┘
          ▼
    ┌──────────────┐
    │External APIs │
    │• Toss Payments
    │• SendGrid    │
    │• FCM Push    │
    └──────────────┘
```

### 7.3 데이터베이스 스키마 (ERD)

```
┌─────────────────┐         ┌──────────────┐
│    users        │────1:N──│   orders     │
├─────────────────┤         ├──────────────┤
│*id (UUID)       │         │*id (UUID)    │
│*email (UNIQUE)  │         │*customer_id  │
│*password        │         │*cafe_id      │
│name             │         │*status       │
│role (admin/cust)│         │*total_amount │
│created_at       │         │created_at    │
└─────────────────┘         └──────┬───────┘
                                   │1:N
                            ┌──────▼──────┐
                            │order_items  │
                            ├─────────────┤
                            │*id          │
                            │*order_id    │
                            │*menu_id     │
                            │quantity     │
                            │unit_price   │
                            └──────┬──────┘
                                   │1:N
                        ┌──────────▼──────┐
                        │order_item_options
                        ├─────────────────┤
                        │*id              │
                        │*order_item_id   │
                        │*menu_option_id  │
                        │option_price     │
                        └─────────────────┘

┌─────────────┐         ┌──────────────┐
│   cafes     │────1:N──│    menus     │
├─────────────┤         ├──────────────┤
│*id (UUID)   │         │*id (UUID)    │
│*name        │         │*cafe_id      │
│address      │         │*name         │
│phone        │         │*price        │
│is_active    │         │category      │
└─────────────┘         │is_active     │
                        │created_at    │
                        └──────┬───────┘
                               │1:N
                        ┌──────▼──────────┐
                        │option_groups    │
                        ├─────────────────┤
                        │*id              │
                        │*menu_id         │
                        │name             │
                        │is_required      │
                        └──────┬──────────┘
                               │1:N
                        ┌──────▼──────────┐
                        │menu_options     │
                        ├─────────────────┤
                        │*id              │
                        │*option_group_id │
                        │name             │
                        │price_adjustment │
                        └─────────────────┘
```

---

## 8. API 명세

### 8.1 기본 정보

- **Base URL**: `https://api.orderbean.com/v1`
- **인증**: Bearer Token (JWT)
- **응답 형식**: JSON
- **Rate Limit**: 100 req/min (Free), 1000 req/min (Pro)

### 8.2 공통 응답 포맷

```json
{
  "success": true,
  "code": 200,
  "message": "Success",
  "data": { },
  "timestamp": "2024-12-15T14:30:00.000Z",
  "requestId": "req_abc123"
}
```

### 8.3 핵심 엔드포인트

#### 8.3.1 인증

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|
| POST | `/auth/signup` | 회원가입 |
| POST | `/auth/login` | 로그인 |
| POST | `/auth/logout` | 로그아웃 |
| POST | `/auth/refresh` | 토큰 갱신 |

#### 8.3.2 메뉴

| 메서드 | 엔드포인트 | 설명 | 인증 | 권한 |
|--------|------------|------|------|------|
| GET | `/menus` | 메뉴 목록 | ✗ | - |
| GET | `/menus/:id` | 메뉴 상세 | ✗ | - |
| POST | `/menus` | 메뉴 생성 | ✓ | admin |
| PUT | `/menus/:id` | 메뉴 수정 | ✓ | admin |
| DELETE | `/menus/:id` | 메뉴 삭제 | ✓ | admin |

#### 8.3.3 주문

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|
| POST | `/orders` | 주문 생성 |
| GET | `/orders` | 주문 목록 |
| GET | `/orders/:id` | 주문 상세 |
| PATCH | `/orders/:id` | 주문 취소 |
| GET | `/orders/:id/status` | 주문 상태 조회 |

#### 8.3.4 관리자 기능

| 메서드 | 엔드포인트 | 설명 |
|--------|------------|------|
| GET | `/admin/orders/dashboard` | 주문 모니터링 |
| GET | `/admin/analytics/orders` | 주문 통계 |
| GET | `/admin/analytics/menus` | 메뉴 판매량 |

---

## 9. 데이터 모델

### 9.1 Database Tables

#### users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role ENUM ('customer', 'admin') DEFAULT 'customer',
  status ENUM ('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_email (email),
  INDEX idx_role (role)
);
```

#### menus

```sql
CREATE TABLE menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id UUID REFERENCES cafes(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  INDEX idx_cafe_id (cafe_id),
  INDEX idx_is_active (is_active),
  INDEX idx_category (category)
);
```

#### orders

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES users(id),
  cafe_id UUID REFERENCES cafes(id),
  status ENUM ('pending', 'preparing', 'ready', 'picked', 'completed', 'cancelled') DEFAULT 'pending',
  total_amount INTEGER NOT NULL,
  discount_amount INTEGER DEFAULT 0,
  final_amount INTEGER NOT NULL,
  pickup_time TIMESTAMP,
  pickup_estimated_time TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_customer_id (customer_id),
  INDEX idx_cafe_id (cafe_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at DESC)
);
```

#### order_items

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_id UUID REFERENCES menus(id),
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_order_id (order_id)
);
```

#### menu_options & option_groups

```sql
CREATE TABLE option_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID REFERENCES menus(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  is_required BOOLEAN DEFAULT false,
  allow_multiple BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE menu_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  option_group_id UUID REFERENCES option_groups(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  price_adjustment INTEGER DEFAULT 0,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_option_group_id (option_group_id)
);
```

---

## 10. 비기능 요구사항

### 10.1 성능 (Performance)

| 항목 | 기준 | 목표 |
|------|------|------|
| API 응답 시간 | P95 < 200ms, P99 < 500ms | 메뉴 조회 < 200ms |
| 동시 사용자 | 100+ 동시 접속 | 안정적 처리 |
| 데이터베이스 | 인덱싱 + 쿼리 최적화 | 쿼리 < 100ms |
| 캐싱 | Redis TTL 1시간 | 메뉴 캐시 |
| CDN | Cloudflare | 이미지 최적화 |

### 10.2 보안 (Security)

| 항목 | 요구사항 | 구현 |
|------|----------|------|
| 인증 | JWT + Bearer Token | 24시간 만료 |
| 암호화 | HTTPS Only | TLS 1.2+ |
| 패스워드 | bcrypt 해싱 | 10라운드 |
| SQL 주입 | Prepared Statement | ORM 사용 |
| XSS 방지 | 입력 검증/Sanitization | 유효성 검사 |
| Rate Limiting | 분당 100-1000 요청 | API 레벨 |

### 10.3 확장성 (Scalability)

| 항목 | 계획 |
|------|------|
| 데이터베이스 | PostgreSQL + Read Replica (Phase 2) |
| 서버 | 로드 밸런서 + 다중 인스턴스 (Phase 2) |
| 캐시 | Redis Cluster (Phase 2) |
| 메시지 큐 | Bull Queue (현재) → Kafka (Phase 3) |

### 10.4 신뢰성 (Reliability)

| 항목 | 요구사항 |
|------|----------|
| 가용성 | 99.5% (월 3.6시간 다운타임) |
| 백업 | 일일 자동 백업 (7일 보관) |
| 에러 처리 | 자동 재시도 (3회, exponential backoff) |
| 로깅 | 모든 거래 기록 (감사 로그) |

### 10.5 사용성 (Usability)

| 항목 | 요구사항 |
|------|----------|
| 반응형 | Mobile (320px) ~ Desktop (1920px) |
| 브라우저 | Chrome, Firefox, Safari, Edge |
| 접근성 | WCAG 2.1 Level A 기본 준수 |
| 언어 | 한국어 (향후 다국어) |

---

## 11. 일정 및 마일스톤

### 11.1 개발 일정

| Phase | 기간 | 주요 산출물 |
|-------|------|-------------|
| Phase 1 (MVP) | 4주 | 5가지 핵심 기능 |
| Phase 2 (고도화) | 2주 | 포인트, 다중 카페 |
| Phase 3 (마케팅) | 2주 | 푸시 알림, 분석 |

### 11.2 Phase 1 상세 일정

| 주차 | 작업 | 담당 |
|------|------|------|
| W1 | 백엔드 기초 구조 | 백엔드팀 |
| W1 | 프론트엔드 기초 | 프론트팀 |
| W2 | 메뉴 조회 (F001) | BE/FE |
| W2 | 주문 생성 (F002) | BE/결제팀 |
| W3 | 주문 내역 조회 (F003) | BE/FE |
| W3 | 메뉴 관리 (F004) | 어드민팀 |
| W4 | 주문 상태 관리 (F005) | BE/어드민팀 |
| W4 | 테스트 & 배포 | QA/배포팀 |

### 11.3 마일스톤

**📅 W4 (2024-12-31): Alpha 릴리스 (내부 테스트)**
- 모든 핵심 기능 완료
- 베타 테스터 모집 시작

**📅 2025-01-15: Beta 릴리스 (제한된 사용자)**
- 50개 카페 파트너십
- 1,000 DAU 목표

**📅 2025-02-01: 정식 출시 (GA)**
- 500개 카페 확대
- 50,000 MAU 목표

---

## 12. 리스크 & 의존성

### 12.1 주요 리스크

| 리스크 | 영향 | 확률 | 대응 |
|--------|------|------|------|
| 결제 API 지연 | 주문 실패 | 중 | 폴백 결제 수단 준비 |
| 실시간 통신 불안정 | UX 저하 | 낮음 | WebSocket + Polling 병행 |
| 대량 트래픽 대응 | 서버 다운 | 낮음 | 로드 테스트 실시 |
| 카페 파트너 확보 | 사용자 감소 | 중 | 영업팀 조기 시작 |

### 12.2 기술적 의존성

| 의존성 | 영향도 | 대응 |
|--------|--------|------|
| OpenAI GPT-4 (향후) | 높음 | 로컬 모델 검토 |
| 결제 게이트웨이 | 치명적 | Toss + PG사 다중화 |
| AWS 서비스 | 높음 | 재해복구 계획 수립 |

### 12.3 외부 의존성

- ✅ **Toss Payments**: 결제 처리
- ✅ **Firebase/FCM**: 푸시 알림
- ✅ **AWS S3**: 이미지 저장
- ✅ **SendGrid**: 이메일 발송

---

## 빠른 시작

프로젝트를 빠르게 시작하려면:

- **[빠른 시작 가이드](./docs/QUICK_START.md)** - 5분 안에 시작하기 ⚡
- **[설치 가이드](./docs/INSTALLATION.md)** - 상세한 설치 방법
- **[개발 가이드](./docs/DEVELOPMENT.md)** - 개발 환경 설정

## 문서

전체 문서는 [docs/README.md](./docs/README.md)를 참고하세요.

---

## License

This project is proprietary and confidential.

---

**문서 버전**: 1.0  
**최종 업데이트**: 2024-12-15

# To-Do List

## TDD 단계별 작업

### ✅ RED 단계 (완료)
- [x] 실패하는 테스트 작성 (36개 테스트)
- [x] 테스트 실행 및 실패 확인
- [x] 순환 참조 문제 해결

### 🟢 GREEN 단계 (진행 중)
**목표**: 실패하는 테스트를 통과시키는 코드 작성

#### Phase 1: 테스트 환경 및 기본 인프라 (최우선) 🔴
1. **테스트용 데이터베이스 설정**
   - [ ] 테스트 환경별 PostgreSQL 데이터베이스 설정
   - [ ] Prisma 테스트 환경 설정
   - [ ] 또는 Prisma Mock 설정
   - [ ] 테스트 환경 변수 분리 (.env.test)

2. **테스트 격리 구현**
   - [ ] 각 테스트 후 데이터베이스 정리 (beforeEach/afterEach)
   - [ ] 테스트 데이터 시드 함수 구현
   - [ ] 트랜잭션 롤백을 통한 격리

3. **입력 검증 스키마 (Zod) 추가**
   - [ ] 주문 생성 요청 스키마
   - [ ] 회원가입 요청 스키마
   - [ ] 로그인 요청 스키마
   - [ ] 공통 에러 응답 형식 표준화

#### Phase 2: 핵심 비즈니스 로직 (최우선) 🔴
1. **주문 생성 기능 완전 구현**
   - [ ] 입력 검증 로직
     - [ ] 필수 필드 검증 (cafeId, items)
     - [ ] items 배열 비어있지 않음 확인
     - [ ] menuId 유효성 검증
     - [ ] quantity 유효성 검증 (1 이상)
     - [ ] pickupTime 유효성 검증 (과거 시간 불가)
   
   - [ ] 가격 계산 로직
     - [ ] 기본 메뉴 가격 조회
     - [ ] 선택된 옵션 가격 추가
     - [ ] 총액 계산 (totalAmount)
     - [ ] 최종 금액 계산 (finalAmount)
   
   - [ ] 재고 확인 로직
     - [ ] 메뉴 재고 확인
     - [ ] 주문 수량과 재고 비교
     - [ ] 재고 부족 시 `OUT_OF_STOCK` 에러 반환
   
   - [ ] 필수 옵션 검증
     - [ ] 메뉴의 필수 옵션 그룹 확인
     - [ ] 필수 옵션 선택 여부 검증
     - [ ] 필수 옵션 미선택 시 `INVALID_OPTIONS` 에러 반환
   
   - [ ] 주문 데이터 생성
     - [ ] 주문 번호 생성 (고유 번호)
     - [ ] Order 레코드 생성
     - [ ] OrderItem 레코드 생성
     - [ ] OrderItemOption 레코드 생성
     - [ ] 트랜잭션 처리
   
   - [ ] 응답 데이터 구성
     - [ ] orderId, orderNumber 반환
     - [ ] status, totalAmount, finalAmount 반환
     - [ ] items 목록 포함

2. **주문 재시도 기능**
   - [ ] 실패한 주문 재시도 로직 구현

#### Phase 3: 관리자 기능 (높음) 🟡
1. **관리자 대시보드 구현**
   - [ ] 주문 상태별 조회
     - [ ] `newOrders`: PENDING 상태 주문 목록
     - [ ] `preparingOrders`: PREPARING 상태 주문 목록
     - [ ] `readyOrders`: READY 상태 주문 목록
   - [ ] 권한 검증 (ADMIN만 접근)
   - [ ] 403 Forbidden 에러 처리

2. **주문 통계 분석 구현**
   - [ ] `totalOrders`: 전체 주문 수 계산
   - [ ] `totalRevenue`: 총 매출액 계산
   - [ ] `averagePrepTime`: 평균 준비 시간 계산
   - [ ] `cancelRate`: 취소율 계산
   - [ ] `popularMenus`: 인기 메뉴 목록 (판매량 기준)

3. **메뉴 분석 구현**
   - [ ] `menuSales`: 메뉴별 판매 통계
   - [ ] 메뉴별 판매량, 매출액 계산

#### Phase 4: 인증 강화 (중간) 🟢
1. **토큰 갱신 기능 구현**
   - [ ] Refresh token 검증
   - [ ] 새로운 access token 발급
   - [ ] 응답에 새 토큰 포함

2. **권한 검증 미들웨어 강화**
   - [ ] ADMIN 역할 검증 미들웨어
   - [ ] 관리자 전용 엔드포인트 보호
   - [ ] 403 Forbidden 응답 처리

3. **비밀번호 정책 검증**
   - [ ] 최소 길이 검증
   - [ ] 복잡도 검증 (대소문자, 숫자, 특수문자)

#### Phase 5: 품질 향상 (중간) ✅ 완료
1. **테스트 커버리지 향상**
   - [x] Order Controller: 에지 케이스 테스트 추가 완료
   - [x] Admin Controller: 에지 케이스 테스트 추가 완료
   - [x] Menu Controller: 에지 케이스 테스트 추가 완료
   - [x] Auth Middleware: 테스트 작성 완료 (12개 테스트)

2. **에러 처리 개선**
   - [x] 표준화된 에러 코드 체계 (UNAUTHORIZED, FORBIDDEN)
   - [x] 에러 응답 형식 통일 (이미 구현됨)
   - [x] 에지 케이스 테스트 추가 완료

3. **성능 최적화**
   - [x] 데이터베이스 인덱스 추가 (OrderItem, Order, Menu)
   - [x] 복합 인덱스 최적화 (대시보드, 통계 조회)
   - [x] 캐싱 전략 개선 (이미 Redis 캐싱 구현됨)

### 🔵 REFACTOR 단계 (진행 중)

#### Phase 1: 구조 정리 (최우선) 🔴
1. **중복 파일 제거**
   - [x] AdminDashboard.tsx와 admin/DashboardPage.tsx 중복 해결
   - [x] 관리자 페이지 구조 통일 (admin 폴더로 일원화)
   - [x] 사용하지 않는 컴포넌트 정리

2. **빈 페이지 처리**
   - [x] OrderPage.tsx 기능 구현 또는 제거 (MenuPage로 리다이렉트)
   - [x] OrderHistoryPage.tsx 기능 구현 (주문 내역 조회)
   - [x] admin/DashboardPage.tsx 기능 구현 (이전 단계에서 완료)
   - [x] admin/MenuPage.tsx 기능 구현 ("준비 중" UI)
   - [x] admin/OrdersPage.tsx 기능 구현 ("준비 중" UI)
   - [x] 미구현 페이지에 "준비 중" UI 추가

3. **폴더 구조 개선**
   - [x] components를 기능별로 분류 (common, layout, menu, cart, admin)
   - [x] pages를 customer/admin으로 분리 (이미 분리되어 있음)
   - [x] hooks 폴더 생성 및 커스텀 훅 분리
   - [x] services 폴더 생성 (API 서비스 레이어)
   - [x] types 폴더 생성 (공통 타입 정의)
   - [x] constants 폴더 생성 (상수 관리)

4. **라우팅 정리**
   - [x] 중복 라우트 제거 (admin 라우트 정리)
   - [x] 라우트 경로 상수화 (constants/routes.ts 사용)
   - [x] ProtectedRoute 컴포넌트 구현

#### Phase 2: 타입 시스템 강화 (최우선) 🔴
1. **역할(Role) 타입 통일**
   - [x] UserRole enum 정의 (types/auth.ts) - 이미 완료
   - [x] 'admin' | 'ADMIN' | 'customer' | 'CUSTOMER' 통일
   - [x] isAdmin, isCustomer 유틸리티 함수 구현 - 이미 완료
   - [x] 모든 역할 체크 로직 수정

2. **공통 타입 정의**
   - [ ] types/menu.ts 생성 (Menu, ProductOption)
   - [ ] types/order.ts 생성 (Order, OrderItem)
   - [ ] types/cart.ts 생성 (CartItem)
   - [ ] types/auth.ts 생성 (User, AuthState)
   - [ ] types/api.ts 생성 (ApiResponse, PaginatedResponse)
   - [ ] types/inventory.ts 생성 (InventoryItem)

3. **타입 안정성 향상**
   - [ ] ID 타입 브랜딩 (OrderId, MenuId)
   - [ ] API 응답 타입 정의
   - [ ] 엄격한 null 체크 활성화

#### Phase 3: 인증 및 보안 강화 (최우선) 🔴
1. **인증 보호 구현**
   - [ ] ProtectedRoute 컴포넌트 구현
   - [ ] 관리자 라우트에 접근 제어 추가
   - [ ] 로그인하지 않은 사용자 리다이렉트
   - [ ] 권한 없는 사용자 접근 차단

2. **토큰 관리 개선**
   - [ ] tokenManager 유틸리티 구현
   - [ ] authStore와 localStorage 동기화 개선
   - [ ] 토큰 만료 처리 로직 추가
   - [ ] JWT 검증 로직 추가

3. **보안 취약점 수정**
   - [ ] XSS 방지 (DOMPurify 도입)
   - [ ] 사용자 입력 sanitization
   - [ ] CSRF 토큰 고려

#### Phase 4: 컴포넌트 리팩토링 (높음) 🟡
1. **MenuPage 분해** (312줄 → 50줄)
   - [ ] MenuGrid 컴포넌트 분리
   - [ ] MenuCard 컴포넌트 분리
   - [ ] MenuImage 컴포넌트 분리
   - [ ] MenuInfo 컴포넌트 분리
   - [ ] OptionSelector 컴포넌트 분리
   - [ ] Cart 컴포넌트 분리
   - [ ] CartItem 컴포넌트 분리
   - [ ] CartSummary 컴포넌트 분리
   - [ ] EmptyCart 컴포넌트 분리

2. **AdminDashboard 분해** (294줄 → 60줄)
   - [ ] DashboardStats 컴포넌트 분리
   - [ ] StatCard 컴포넌트 분리
   - [ ] InventoryManagement 컴포넌트 분리
   - [ ] InventoryCard 컴포넌트 분리
   - [ ] OrderManagement 컴포넌트 분리
   - [ ] OrderCard 컴포넌트 분리
   - [ ] OrderStatusBadge 컴포넌트 분리

3. **Layout 분해**
   - [ ] Header 컴포넌트 분리
   - [ ] Navigation 컴포넌트 분리
   - [ ] UserMenu 컴포넌트 분리
   - [ ] Layout은 레이아웃만 담당

4. **공통 컴포넌트 생성**
   - [ ] Button 컴포넌트
   - [ ] Card 컴포넌트
   - [ ] Badge 컴포넌트
   - [ ] LoadingSpinner 컴포넌트
   - [ ] ErrorMessage 컴포넌트

#### Phase 5: 상태 관리 개선 (높음) 🟡
1. **React Query 도입**
   - [ ] QueryClientProvider 설정
   - [ ] useMenus 훅 구현
   - [ ] useOrders 훅 구현
   - [ ] useInventory 훅 구현
   - [ ] usePlaceOrder mutation 구현
   - [ ] useUpdateStock mutation 구현
   - [ ] useUpdateOrderStatus mutation 구현

2. **API 서비스 레이어 구축**
   - [ ] services/authService.ts 생성
   - [ ] services/menuService.ts 생성
   - [ ] services/orderService.ts 생성
   - [ ] services/inventoryService.ts 생성
   - [ ] API 에러 처리 통일

3. **전역 상태 정리**
   - [ ] authStore 개선 (localStorage 통합)
   - [ ] cartStore 검토 및 개선
   - [ ] orderStore를 React Query로 마이그레이션
   - [ ] 재고 데이터 전역 상태화

4. **커스텀 훅 구현**
   - [ ] hooks/useAuth.ts
   - [ ] hooks/useCart.ts
   - [ ] hooks/useMenus.ts
   - [ ] hooks/useOrders.ts
   - [ ] hooks/useInventory.ts

#### Phase 6: 데이터 및 상수 관리 (중간) 🟢
1. **하드코딩 데이터 분리**
   - [ ] 메뉴 데이터를 constants/menus.ts로 이동
   - [ ] 재고 데이터를 constants/inventory.ts로 이동
   - [ ] Mock 데이터와 실제 API 분리

2. **매직 넘버/문자열 상수화**
   - [ ] 재고 임계값 상수화 (STOCK_THRESHOLDS)
   - [ ] 재고 상태 상수화 (STOCK_STATUS)
   - [ ] 주문 상태 상수화 (ORDER_STATUS)
   - [ ] API 엔드포인트 상수화
   - [ ] 에러 메시지 상수화

3. **상수 파일 생성**
   - [ ] constants/routes.ts (라우트 경로)
   - [ ] constants/api.ts (API 엔드포인트)
   - [ ] constants/inventory.ts (재고 관련)
   - [ ] constants/order.ts (주문 관련)
   - [ ] constants/messages.ts (메시지)

#### Phase 7: 성능 최적화 (중간) 🟢
1. **메모이제이션 적용**
   - [ ] 가격 계산 로직 useMemo
   - [ ] 필터링/정렬 로직 useMemo
   - [ ] 복잡한 계산 useMemo

2. **컴포넌트 최적화**
   - [ ] React.memo 적용 (OrderCard)
   - [ ] React.memo 적용 (InventoryCard)
   - [ ] React.memo 적용 (MenuCard)
   - [ ] React.memo 적용 (CartItem)
   - [ ] useCallback으로 함수 메모이제이션

3. **이미지 최적화**
   - [ ] 반응형 이미지 (srcSet, sizes)
   - [ ] 이미지 로딩 상태 관리
   - [ ] 이미지 지연 로딩 (lazy loading)
   - [ ] 이미지 폴백 처리
   - [ ] WebP 포맷 고려

4. **번들 최적화**
   - [ ] 코드 스플리팅 (React.lazy)
   - [ ] 라우트 기반 청크 분할
   - [ ] 불필요한 의존성 제거
   - [ ] Tree shaking 확인

#### Phase 8: 코드 품질 향상 (중간) 🟢
1. **주석 및 문서화**
   - [ ] 복잡한 로직에 주석 추가
   - [ ] JSDoc 주석 작성
   - [ ] README 업데이트
   - [ ] 컴포넌트 문서화

2. **유틸리티 함수 분리**
   - [ ] utils/format.ts (날짜, 가격 포맷팅)
   - [ ] utils/validation.ts (유효성 검증)
   - [ ] utils/token.ts (토큰 관리)
   - [ ] utils/sanitize.ts (XSS 방지)
   - [ ] utils/array.ts (배열 유틸)

3. **린터 규칙 강화**
   - [ ] ESLint 규칙 추가
   - [ ] Prettier 설정 검토
   - [ ] import 순서 정리
   - [ ] 사용하지 않는 import 제거

#### Phase 9: 테스트 커버리지 향상 (중간) 🟢
1. **단위 테스트 추가**
   - [ ] stores/authStore.test.ts
   - [ ] stores/cartStore.test.ts (기존 테스트 보완)
   - [ ] hooks/useAuth.test.ts
   - [ ] hooks/useCart.test.ts
   - [ ] utils 함수 테스트

2. **컴포넌트 테스트 추가**
   - [ ] components/menu/MenuCard.test.tsx
   - [ ] components/cart/Cart.test.tsx
   - [ ] components/admin/OrderCard.test.tsx
   - [ ] components/layout/Header.test.tsx

3. **통합 테스트 추가**
   - [ ] 주문 플로우 테스트
   - [ ] 인증 플로우 테스트
   - [ ] 관리자 플로우 테스트

4. **테스트 커버리지 목표**
   - [ ] 전체 커버리지 50% 이상
   - [ ] 핵심 로직 80% 이상
   - [ ] 비즈니스 로직 90% 이상

#### Phase 10: WebSocket 및 실시간 기능 (낮음) 
1. **WebSocket 연결**
   - [ ] Socket.IO 클라이언트 설정
   - [ ] 실시간 주문 수신
   - [ ] 주문 상태 변경 알림
   - [ ] 연결 실패 시 폴링 폴백

2. **실시간 업데이트**
   - [ ] 새 주문 알림
   - [ ] 대시보드 자동 갱신
   - [ ] 재고 실시간 반영

#### 리팩토링 진행 상황
- **Phase 1**: 17/17 완료 (100%) ✅
- **Phase 2**: 4/14 완료 (29%)
- **Phase 3**: 0/10 완료
- **Phase 4**: 0/27 완료
- **Phase 5**: 0/19 완료
- **Phase 6**: 0/13 완료
- **Phase 7**: 0/14 완료
- **Phase 8**: 0/11 완료
- **Phase 9**: 0/13 완료
- **Phase 10**: 0/6 완료

**총 진행률**: 21/144 (14.6%)

#### 예상 일정
- **Phase 1-3 (최우선)**: 2주
- **Phase 4-5 (높음)**: 3주
- **Phase 6-9 (중간)**: 3주
- **Phase 10 (낮음)**: 1주
- **총 예상 기간**: 9주

> 📊 상세 분석: [프론트엔드 리팩토링 분석 보고서](./Report/FRONTEND_CODE_REFACTORING_ANALYSIS.md)

## 우선순위 표시
- 🔴 **최우선**: 테스트 실행을 위해 반드시 필요
- 🟡 **높음**: 핵심 기능 완성을 위해 중요
- 🟢 **중간**: 품질 향상을 위해 필요

## 참고 문서
- [테스트 실행 결과](./Report/02_TEST_EXECUTION_RESULTS.md)
- [구현 요구사항 분석](./Report/IMPLEMENTATION_REQUIREMENTS.md)