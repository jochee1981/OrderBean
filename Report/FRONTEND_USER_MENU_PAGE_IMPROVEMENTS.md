# 프론트엔드 사용자 메뉴 페이지 개선 보고서

## 작업 개요

- **작업 일시**: 2024-12-17
- **작업 내용**: 사용자 요청에 따른 메뉴 페이지 UI/UX 개선
- **작업 방법**: 단계적 개선 및 테스트 검증

---

## 개선 요청사항

사용자로부터 다음과 같은 4가지 개선 요청을 받았습니다:

1. **브랜드명 변경**: 제목 표시줄의 'COZY'를 'OrderBean – 커피 주문'으로 수정
2. **장바구니 레이아웃 개선**: 장바구니 영역을 2개로 나누어 왼쪽에는 주문 내역, 오른쪽에는 총 금액과 주문하기 버튼 배치
3. **금액 정렬 개선**: 장바구니 영역의 메뉴별 금액을 보기 좋게 정렬
4. **중복 주문 처리**: 같은 메뉴를 여러 번 주문했을 때 장바구니에 반복 표시하지 말고 개수를 늘림

---

## 구현된 개선사항

### 1. 브랜드명 변경 ✅

**파일**: `frontend/src/components/Layout.tsx`

**변경 내용**:
```tsx
// 기존
<Link to="/" className="text-2xl font-bold text-purple-600">
  COZY
</Link>

// 변경 후
<Link to="/" className="text-2xl font-bold text-purple-600">
  OrderBean – 커피 주문
</Link>
```

**효과**: 브랜드 아이덴티티가 명확해지고, 페이지의 목적이 더욱 분명해짐

---

### 2. 장바구니 레이아웃 개선 ✅

**파일**: `frontend/src/pages/MenuPage.tsx`

**변경 내용**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* 왼쪽: 주문 내역 (2/3 영역) */}
  <div className="md:col-span-2">
    <h3 className="text-lg font-semibold mb-3 text-gray-700">주문 내역</h3>
    <ul className="space-y-3">
      {/* 주문 항목 리스트 */}
    </ul>
  </div>

  {/* 오른쪽: 결제 정보 (1/3 영역) */}
  <div className="md:col-span-1 bg-gray-50 rounded-lg p-4">
    <h3 className="text-lg font-semibold mb-4 text-gray-700">결제 정보</h3>
    {/* 주문 수량, 총 금액, 주문하기 버튼 */}
  </div>
</div>
```

**레이아웃 구조**:
- **왼쪽 (2/3 영역)**: 주문 내역을 상세하게 표시
  - 제품명
  - 옵션 정보
  - 수량
  - 개별 금액
- **오른쪽 (1/3 영역)**: 결제 정보를 강조
  - 주문 수량 합계
  - 총 금액 (큰 글씨로 강조)
  - 주문하기 버튼

**효과**: 
- 정보의 위계가 명확해짐
- 결제 정보가 시각적으로 분리되어 가독성 향상
- 모바일에서는 세로로, 데스크톱에서는 가로로 배치되는 반응형 디자인

---

### 3. 금액 정렬 개선 ✅

**파일**: `frontend/src/pages/MenuPage.tsx`

**변경 내용**:
```tsx
<li className="flex justify-between items-start py-2 border-b border-gray-200">
  <div className="flex-1">
    <div className="font-medium text-gray-800">{item.name}</div>
    {item.options && item.options.length > 0 && (
      <div className="text-sm text-gray-500 mt-1">
        옵션: {item.options.join(', ')}
      </div>
    )}
    <div className="text-sm text-gray-600 mt-1">
      수량: {item.quantity}개
    </div>
  </div>
  <div className="text-right ml-4">
    <div className="font-semibold text-purple-600">
      {(item.price * item.quantity).toLocaleString()}원
    </div>
    <div className="text-xs text-gray-500 mt-1">
      개당 {item.price.toLocaleString()}원
    </div>
  </div>
</li>
```

**개선 사항**:
- **금액 오른쪽 정렬**: 모든 금액이 오른쪽으로 깔끔하게 정렬
- **총 금액 강조**: 보라색으로 표시하여 시각적으로 강조
- **개당 가격 표시**: 작은 글씨로 단가 정보 제공
- **구분선 추가**: 각 항목 사이에 구분선으로 가독성 향상
- **여백 조정**: 적절한 패딩과 마진으로 깔끔한 레이아웃

**효과**:
- 금액 정보가 한눈에 들어옴
- 총 금액과 단가를 동시에 확인 가능
- 전문적이고 깔끔한 UI

---

### 4. 중복 주문 처리 (수량 증가) ✅

**파일**: `frontend/src/stores/cartStore.ts`

**변경 내용**:
```tsx
addItem: (item) => {
  const existingItem = get().items.find(
    (i) =>
      i.id === item.id &&
      JSON.stringify(i.options) === JSON.stringify(item.options)
  )
  if (existingItem) {
    set({
      items: get().items.map((i) =>
        i.id === existingItem.id &&
        JSON.stringify(i.options) === JSON.stringify(existingItem.options)
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      ),
    })
  } else {
    set({ items: [...get().items, item] })
  }
}
```

**로직 설명**:
1. 장바구니에 이미 같은 메뉴가 있는지 확인
2. **메뉴 ID와 옵션을 모두 비교** (같은 메뉴여도 옵션이 다르면 별도 항목으로 처리)
3. 같은 메뉴 + 같은 옵션이면 **수량만 증가**
4. 다른 메뉴 또는 다른 옵션이면 **새 항목으로 추가**

**예시**:
- 아메리카노(ICE) + 샷 추가 → 담기 → 수량 1
- 아메리카노(ICE) + 샷 추가 → 담기 → 수량 2로 증가 ✅
- 아메리카노(ICE) + 시럽 추가 → 담기 → 새 항목 추가 (옵션이 다름)

**효과**:
- 장바구니가 깔끔하게 유지됨
- 동일 항목이 중복 표시되지 않음
- 수량 정보가 명확함

---

### 5. 추가 개선사항

#### 5.1 옵션 선택 초기화
**파일**: `frontend/src/pages/MenuPage.tsx`

```tsx
const handleAddToCart = (menu: Menu) => {
  // ... 장바구니에 추가 로직 ...
  
  // 옵션 선택 초기화
  setSelectedOptions((prev) => ({
    ...prev,
    [menu.id]: [],
  }))
}
```

**효과**: 담기 버튼 클릭 후 옵션이 자동으로 초기화되어 다음 주문이 편리함

#### 5.2 결제 정보 영역 강조
```tsx
<div className="md:col-span-1 bg-gray-50 rounded-lg p-4">
  <h3 className="text-lg font-semibold mb-4 text-gray-700">결제 정보</h3>
  <div className="space-y-3 mb-6">
    <div className="flex justify-between text-gray-600">
      <span>주문 수량</span>
      <span>{items.reduce((sum, item) => sum + item.quantity, 0)}개</span>
    </div>
    <div className="border-t border-gray-300 pt-3">
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-gray-800">총 금액</span>
        <span className="text-2xl font-bold text-purple-600">
          {getTotal().toLocaleString()}원
        </span>
      </div>
    </div>
  </div>
  <button className="w-full bg-purple-500 text-white py-3 px-4 rounded-md hover:bg-purple-600 transition-colors font-semibold">
    주문하기
  </button>
</div>
```

**개선 사항**:
- 배경색으로 영역 구분 (`bg-gray-50`)
- 총 금액을 크고 굵게 표시 (`text-2xl font-bold`)
- 주문하기 버튼 강조 (`py-3`, `font-semibold`)

---

## 테스트 결과

### 테스트 통과율
```
Test Files  1 passed (1)
Tests  15 passed (15)
통과율: 100%
```

### 수정된 테스트
```tsx
it('should render header with OrderBean brand name', () => {
  renderWithRouter(<MenuPage />)
  expect(screen.getByText('OrderBean – 커피 주문')).toBeInTheDocument()
})
```

---

## UI/UX 개선 효과

### Before (기존)
- 브랜드명: "COZY" (의미가 불명확)
- 장바구니: 단순한 리스트 형태
- 금액: 정렬되지 않은 텍스트
- 중복 주문: 항목이 반복 표시됨

### After (개선 후)
- ✅ 브랜드명: "OrderBean – 커피 주문" (명확한 정체성)
- ✅ 장바구니: 2단 레이아웃 (주문 내역 + 결제 정보)
- ✅ 금액: 깔끔하게 정렬되고 강조된 표시
- ✅ 중복 주문: 수량 증가로 처리 (깔끔한 장바구니)

### 사용자 경험 개선
1. **명확성**: 브랜드와 페이지 목적이 명확해짐
2. **가독성**: 정보 위계가 분명하고 금액 정보가 한눈에 들어옴
3. **효율성**: 중복 항목이 수량으로 통합되어 장바구니가 깔끔함
4. **전문성**: 결제 정보 영역 분리로 더욱 전문적인 느낌

---

## 파일 변경 목록

### 수정된 파일
1. `frontend/src/components/Layout.tsx`
   - 브랜드명 변경: "COZY" → "OrderBean – 커피 주문"

2. `frontend/src/pages/MenuPage.tsx`
   - 장바구니 레이아웃 2단 구조로 변경
   - 금액 정렬 및 표시 개선
   - 옵션 선택 초기화 추가

3. `frontend/src/stores/cartStore.ts`
   - 중복 항목 처리 로직 (수량 증가)
   - 메뉴 ID + 옵션 조합으로 중복 체크

4. `frontend/src/pages/__tests__/MenuPage.test.tsx`
   - 브랜드명 테스트 업데이트

---

## 반응형 디자인

### 모바일 (< 768px)
```
┌─────────────────────┐
│ 주문 내역           │
│ • 항목 1            │
│ • 항목 2            │
├─────────────────────┤
│ 결제 정보           │
│ 총 금액             │
│ [주문하기]          │
└─────────────────────┘
```

### 데스크톱 (≥ 768px)
```
┌────────────────────┬──────────┐
│ 주문 내역          │ 결제 정보│
│ • 항목 1           │ 주문 수량│
│ • 항목 2           │ 총 금액  │
│ • 항목 3           │[주문하기]│
└────────────────────┴──────────┘
```

---

## 향후 개선 방향

### Phase 2
- [ ] 장바구니 항목 삭제 기능
- [ ] 장바구니 항목 수량 직접 조정 (+/- 버튼)
- [ ] 장바구니 비우기 버튼
- [ ] 주문 금액 할인/쿠폰 적용

### Phase 3
- [ ] 장바구니 저장 (Local Storage)
- [ ] 즐겨찾기 메뉴 빠른 주문
- [ ] 이전 주문 재주문 기능
- [ ] 주문 수량 제한 알림

---

## 결론

사용자의 4가지 요청사항을 모두 성공적으로 구현했습니다:

1. ✅ 브랜드명 변경: "COZY" → "OrderBean – 커피 주문"
2. ✅ 장바구니 2단 레이아웃: 주문 내역 + 결제 정보
3. ✅ 금액 정렬 개선: 깔끔한 정렬과 강조
4. ✅ 중복 주문 처리: 수량 증가로 통합

### 성과
- **테스트 통과율**: 100% (15/15)
- **코드 품질**: 린터 오류 없음
- **UI/UX**: 전문적이고 사용하기 편리한 인터페이스
- **반응형**: 모바일/데스크톱 모두 최적화

### 사용자 피드백
모든 요청사항이 반영되어 더욱 사용하기 편리하고 전문적인 커피 주문 화면이 완성되었습니다.

---

**작성일**: 2024-12-17  
**작성자**: AI Developer  
**버전**: 1.1

