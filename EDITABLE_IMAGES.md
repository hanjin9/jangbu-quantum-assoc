# 편집 가능한 이미지 파일 (Editable Images)

## 📁 저장 위치

모든 편집 가능한 이미지 파일은 다음 위치에 보관되어 있습니다:

```
/home/ubuntu/webdev-static-assets/
```

## 📋 파일 목록

| 파일명 | 용도 | 크기 | 메타데이터 |
|--------|------|------|-----------|
| `hero-quantum-main-editable.png` | 홈페이지 히어로 섹션 | 7.0MB | `hero-quantum-main-metadata.txt` |
| `about-practitioners-editable.png` | 관리사 소개 섹션 | 6.7MB | `about-practitioners-metadata.txt` |
| `services-energy-healing-editable.png` | 서비스 섹션 | 6.7MB | `services-energy-healing-metadata.txt` |
| `membership-benefits-editable.png` | 멤버십 섹션 | 7.3MB | `membership-benefits-metadata.txt` |
| `testimonials-success-editable.png` | 고객 후기 섹션 | 6.2MB | `testimonials-success-metadata.txt` |
| `appointment-booking-editable.png` | 상담 예약 섹션 | 4.6MB | `appointment-booking-metadata.txt` |

**총 크기**: 약 39MB

## 🎨 이미지 편집 방법

### 1. PNG 파일 편집
- **Photoshop**: 기본 지원
- **GIMP**: 무료 오픈소스 (https://www.gimp.org/)
- **Affinity Photo**: 전문가용 (https://affinity.serif.com/)
- **Pixlr**: 온라인 편집기 (https://pixlr.com/)
- **Canva**: 디자인 플랫폼 (https://canva.com/)

### 2. 메타데이터 파일
각 이미지마다 `*-metadata.txt` 파일이 있습니다. 이 파일에는 다음 정보가 포함되어 있습니다:
- 원본 해상도
- 색상 정보
- 생성 날짜
- 편집 가이드

### 3. 편집 후 적용
편집이 완료된 후:
1. 이미지를 PNG 형식으로 저장
2. CDN에 업로드: `manus-upload-file --webdev <파일명>`
3. 반환된 URL을 웹사이트 코드에 적용
4. 변경사항 커밋 및 배포

## 🔄 이미지 교체 프로세스

### Step 1: 이미지 편집
```bash
# 편집 도구에서 이미지 수정
# 예: /home/ubuntu/webdev-static-assets/hero-quantum-main-editable.png
```

### Step 2: CDN에 업로드
```bash
cd /home/ubuntu/webdev-static-assets/
manus-upload-file --webdev hero-quantum-main-editable.png
# 반환된 URL 복사
```

### Step 3: 웹사이트 코드 업데이트
```tsx
// client/src/pages/Home.tsx
const FIXED_HERO_IMAGE = 'https://new-cdn-url-here';
```

### Step 4: 변경사항 커밋
```bash
cd /home/ubuntu/jangbu-quantum-assoc
git add client/src/pages/Home.tsx
git commit -m "Update hero image"
git push
```

## 📸 이미지 스펙

### 해상도
- 히어로 이미지: 1920x1080px
- 섹션 이미지: 1200x800px
- 최소 해상도: 1024x768px

### 색상 모드
- RGB (웹 표준)
- 색상 프로필: sRGB

### 파일 형식
- 형식: PNG (손실 없음)
- 압축: 최대 압축 권장
- 투명도: 지원됨

## 🎯 디자인 가이드

### 색상 팔레트
- **Primary Gold**: #F59E0B
- **Dark Background**: #0F172A
- **Light Text**: #FFFFFF
- **Accent Blue**: #3B82F6

### 타이포그래피
- **제목**: 굵은 글씨, 32-48px
- **본문**: 일반 글씨, 14-16px
- **캡션**: 일반 글씨, 12px

### 레이아웃
- 여백: 최소 40px (모바일), 60px (데스크톱)
- 텍스트 오버레이: 반투명 검정 배경 권장
- 이미지 비율: 16:9 (권장)

## 💾 백업 및 복구

### 백업 위치
- **로컬**: `/home/ubuntu/webdev-static-assets/`
- **GitHub**: https://github.com/hanjin9/jangbu-quantum-assoc
- **S3 CDN**: 자동 백업 (Manus 플랫폼)

### 원본 복구
원본 이미지가 필요한 경우:
```bash
# GitHub에서 복구
git log --follow -- "assets/editable-images/*"
git show <commit>:assets/editable-images/<filename>
```

## 🚀 배포 후 확인

이미지 변경 후 다음을 확인하세요:

1. **로컬 개발 서버**
   ```bash
   pnpm dev
   # http://localhost:3000 에서 확인
   ```

2. **반응형 테스트**
   - 모바일 (320px)
   - 태블릿 (768px)
   - 데스크톱 (1920px)

3. **성능 확인**
   - 이미지 로딩 시간 < 2초
   - 파일 크기 < 500KB (압축 후)

4. **CDN 캐시**
   - 변경 후 5-10분 대기 (CDN 갱신)

## 📞 지원

이미지 편집 또는 업로드에 문제가 있으면:
- 📧 Email: info@jangbu-assoc.com
- 💬 GitHub Issues: https://github.com/hanjin9/jangbu-quantum-assoc/issues

---

**마지막 업데이트**: 2026-03-18
**관리자**: 장•부 양자요법 관리사 협회
