# 이미지 최적화 가이드

## 제공하신 아이스 아메리카노 이미지 사용 방법

### 1단계: 이미지 저장

1. 제공하신 이미지를 저장합니다
2. 경로: `frontend/public/images/americano-ice.jpg`

### 2단계: 이미지 최적화

#### 온라인 도구 사용 (추천)

**TinyPNG (무료)**
1. https://tinypng.com/ 접속
2. 이미지 업로드
3. 압축된 이미지 다운로드
4. `frontend/public/images/americano-ice.jpg`로 저장

**Squoosh (Google, 무료)**
1. https://squoosh.app/ 접속
2. 이미지 업로드
3. 설정:
   - Resize: 400x400px
   - Format: MozJPEG
   - Quality: 85%
4. 다운로드 후 저장

#### 목표 스펙
- **크기**: 400x400px (정사각형)
- **파일 크기**: 50KB 이하
- **포맷**: JPG (85% 품질)
- **파일명**: `americano-ice.jpg`

### 3단계: 코드에 적용

이미지 저장 후 `MenuPage.tsx`를 다음과 같이 수정:

```typescript
{
  id: '1',
  name: '아메리카노 (ICE)',
  price: 4000,
  description: '시원하고 깔끔한 아이스 아메리카노',
  imageUrl: '/images/americano-ice.jpg', // 로컬 경로
  options: [...]
}
```

### 4단계: 확인

1. 이미지가 `frontend/public/images/americano-ice.jpg`에 저장되었는지 확인
2. 브라우저에서 `http://localhost:5173/menu` 접속
3. 아메리카노 (ICE) 메뉴에 이미지가 표시되는지 확인

---

## 이미지 최적화 상세 가이드

### WebP 포맷 사용 (더 작은 크기)

WebP는 JPG보다 30% 작은 파일 크기로 동일한 품질을 제공합니다.

**변환 방법**:
1. Squoosh.app에서 WebP 선택
2. Quality: 80-85%
3. `americano-ice.webp`로 저장

**코드 적용**:
```typescript
imageUrl: '/images/americano-ice.webp'
```

### 반응형 이미지

다양한 해상도를 위한 여러 크기 제공:

```
americano-ice-400.jpg   (400x400px) - 기본
americano-ice-800.jpg   (800x800px) - 레티나 디스플레이
americano-ice-200.jpg   (200x200px) - 썸네일
```

---

## 자동 최적화 (선택사항)

### npm 패키지 사용

```bash
npm install sharp
```

**최적화 스크립트**:
```javascript
// scripts/optimize-images.js
const sharp = require('sharp');

sharp('original/americano-ice.jpg')
  .resize(400, 400, { fit: 'cover' })
  .jpeg({ quality: 85 })
  .toFile('public/images/americano-ice.jpg');
```

---

## 대체 방안: 유사한 무료 이미지

저작권이 걱정되신다면 다음 무료 이미지 사이트에서 유사한 이미지를 찾을 수 있습니다:

### Unsplash (무료, 상업적 사용 가능)

**아이스 아메리카노 검색**:
```
https://unsplash.com/s/photos/iced-americano
```

**추천 이미지**:
1. `photo-1517487881594-2787fef5ebf7` - 투명 잔의 아이스 커피
2. `photo-1461023058943-07fcbe16d735` - 시원한 아이스 커피
3. `photo-1517578239113-b03992dcdd25` - 얼음 가득한 아이스 커피

### Pexels (무료, 상업적 사용 가능)

```
https://www.pexels.com/search/iced%20coffee/
```

---

## 성능 최적화 팁

### 1. Lazy Loading

이미지를 필요할 때만 로드:

```typescript
<img 
  src={menu.imageUrl} 
  alt={menu.name}
  loading="lazy" // Lazy loading
  className="w-full h-full object-cover"
/>
```

### 2. CDN 사용

큰 트래픽이 예상된다면 CDN 사용 고려:
- Cloudflare Images
- Imgix
- Cloudinary (무료 플랜 있음)

### 3. 이미지 캐싱

```typescript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
}
```

---

## 저작권 체크리스트

제공하신 이미지를 사용하기 전에 확인하세요:

- [ ] 이미지 사용 권한이 있습니까?
- [ ] 상업적 사용이 허용됩니까?
- [ ] 브랜드 로고/워터마크를 제거해도 됩니까?
- [ ] 크레딧 표기가 필요합니까?

**안전한 대안**:
1. ✅ 직접 촬영한 이미지
2. ✅ Unsplash/Pexels 무료 이미지
3. ✅ 구매한 스톡 이미지
4. ⚠️ 웹에서 찾은 이미지 (권한 확인 필요)

---

## 최종 파일 구조

```
frontend/
├── public/
│   └── images/
│       ├── americano-ice.jpg      (최적화됨, 50KB 이하)
│       ├── americano-hot.jpg
│       ├── latte.jpg
│       ├── cappuccino.jpg
│       └── vanilla-latte.jpg
└── src/
    └── pages/
        └── MenuPage.tsx
```

---

## 다음 단계

1. **이미지 저장**: 
   - 제공하신 이미지를 `frontend/public/images/americano-ice.jpg`에 저장
   
2. **최적화**:
   - TinyPNG 또는 Squoosh로 압축
   
3. **코드 업데이트**:
   - 제가 코드를 수정해드릴까요?
   
4. **저작권 확인**:
   - 이미지 사용 권한 확인

어떤 방법을 선택하시겠습니까?

