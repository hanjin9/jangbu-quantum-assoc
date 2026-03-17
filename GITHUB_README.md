# 장•부 양자요법 관리사 협회 웹사이트

**장•부 양자요법 관리사 협회**의 공식 웹사이트 및 플랫폼입니다. 양자요법 서비스, 멤버십 관리, 실기시험, 자격증 발급 등 협회의 모든 기능을 통합한 웹 애플리케이션입니다.

## 🌟 주요 기능

### 1. 회원 관리
- **회원가입/로그인**: Manus OAuth 기반 안전한 인증
- **멤버십 플랜**: Silver, Gold, Platinum, Diamond 4가지 등급
- **사용자 대시보드**: 구독 현황, 주문 이력, 계정 설정

### 2. 상담 예약 시스템
- 온라인 캘린더 기반 예약
- 관리사 선택 및 일정 관리
- 자동 알림 및 상담 노트 관리

### 3. 결제 시스템
- **Stripe 통합**: 안전한 카드 결제
- **결제 웹훅**: 자동 주문 처리 및 이메일 발송
- **구독 관리**: 자동 갱신 및 취소 기능

### 4. 이메일 알림
- **Manus 이메일 서비스**: 자동 이메일 발송
- **알림 템플릿**: 결제 확인, 구독 갱신, 예약 알림, 환영 메일
- **이메일 로그**: 모든 발송 기록 추적

### 5. 게시판 및 커뮤니티
- **게시판**: 공지사항, 질문/답변, 자유게시판
- **커뮤니티 그룹**: VIP 라운지, 학습 그룹, 경험 공유
- **댓글 시스템**: 상호작용 및 토론

### 6. 실기시험 및 자격증
- **실기시험**: 기초, 중급, 고급 3단계
- **자동 채점**: 객관식, 단답형, 서술형 문제 지원
- **자격증 발급**: 합격 시 자동 자격증 생성
- **수료증 관리**: 자격증 검증 및 발급

### 7. 관리자 대시보드
- **주문 관리**: 모든 주문 현황 모니터링
- **구독 관리**: 활성 구독 및 갱신 추적
- **이메일 로그**: 발송 기록 및 상태 확인
- **사용자 관리**: 역할 및 권한 설정

## 🛠 기술 스택

### Frontend
- **React 19**: 최신 UI 라이브러리
- **Tailwind CSS 4**: 유틸리티 기반 스타일링
- **shadcn/ui**: 고급 UI 컴포넌트
- **Wouter**: 경량 라우팅
- **Framer Motion**: 부드러운 애니메이션

### Backend
- **Express.js 4**: 웹 서버 프레임워크
- **tRPC 11**: 타입 안전 API 통신
- **Drizzle ORM**: 타입 안전 데이터베이스 쿼리
- **MySQL/TiDB**: 데이터베이스

### 외부 서비스
- **Stripe**: 결제 처리
- **Manus OAuth**: 사용자 인증
- **Manus Email Service**: 이메일 발송
- **AWS S3**: 파일 저장소

## 📁 프로젝트 구조

```
jangbu-quantum-assoc/
├── client/                          # React 프론트엔드
│   ├── src/
│   │   ├── pages/                  # 페이지 컴포넌트
│   │   │   ├── Home.tsx            # 홈페이지
│   │   │   ├── About.tsx           # 소개 페이지
│   │   │   ├── Dashboard.tsx       # 사용자 대시보드
│   │   │   ├── AdminDashboard.tsx  # 관리자 대시보드
│   │   │   ├── Appointments.tsx    # 상담 예약
│   │   │   ├── Community.tsx       # 게시판/커뮤니티
│   │   │   ├── PracticalExam.tsx   # 실기시험
│   │   │   └── Checkout.tsx        # 결제 페이지
│   │   ├── components/             # 재사용 가능 컴포넌트
│   │   ├── lib/                    # 유틸리티 함수
│   │   └── App.tsx                 # 라우팅 설정
│   └── public/                     # 정적 파일
├── server/                         # Express 백엔드
│   ├── _core/                      # 핵심 기능
│   │   ├── auth.ts                 # 인증 로직
│   │   ├── email-service-manus.ts  # 이메일 서비스
│   │   ├── stripe-handler.ts       # Stripe 처리
│   │   └── notification.ts         # 알림 서비스
│   ├── routes/                     # API 라우트
│   │   ├── stripe-api.ts           # Stripe API
│   │   ├── stripe-webhook.ts       # Stripe 웹훅
│   │   └── user-api.ts             # 사용자 API
│   ├── db.ts                       # 데이터베이스 쿼리
│   └── routers.ts                  # tRPC 라우터
├── drizzle/                        # 데이터베이스 스키마
│   ├── schema.ts                   # 기본 스키마
│   ├── schema-extended.ts          # 확장 스키마
│   └── migrations/                 # 마이그레이션 파일
├── assets/                         # 프로젝트 자산
│   └── editable-images/            # 편집 가능한 이미지
├── shared/                         # 공유 코드
│   ├── const.ts                    # 상수
│   ├── types.ts                    # 타입 정의
│   └── products.ts                 # 상품 정의
└── todo.md                         # 프로젝트 TODO 리스트
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 22.13.0+
- pnpm 10.4.1+
- MySQL 8.0+ 또는 TiDB

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/jangbu-quantum-assoc.git
cd jangbu-quantum-assoc

# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일 수정

# 데이터베이스 마이그레이션
pnpm db:push

# 개발 서버 시작
pnpm dev
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
pnpm build

# 프로덕션 서버 시작
pnpm start
```

## 🔐 환경 변수

```env
# 데이터베이스
DATABASE_URL=mysql://user:password@localhost:3306/jangbu

# OAuth
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
JWT_SECRET=your_jwt_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Manus 서비스
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

## 📊 데이터베이스 스키마

### 핵심 테이블
- `users`: 사용자 정보
- `orders`: 주문 기록
- `subscriptions`: 구독 정보
- `appointments`: 상담 예약
- `practitioners`: 관리사 정보
- `posts`: 게시글
- `comments`: 댓글
- `practical_exams`: 실기시험
- `exam_attempts`: 시험 응시 기록
- `certifications`: 자격증
- `completion_certificates`: 수료증

## 🧪 테스트

```bash
# 모든 테스트 실행
pnpm test

# 특정 테스트 파일 실행
pnpm test server/auth.logout.test.ts

# 테스트 커버리지
pnpm test --coverage
```

## 📝 API 문서

### 주요 tRPC 엔드포인트

#### 인증
- `auth.me`: 현재 사용자 정보 조회
- `auth.logout`: 로그아웃

#### 사용자
- `user.getProfile`: 사용자 프로필 조회
- `user.updateProfile`: 프로필 업데이트

#### 결제
- `stripe.createCheckoutSession`: 결제 세션 생성
- `stripe.getOrders`: 주문 목록 조회

#### 상담
- `appointments.list`: 상담 예약 목록
- `appointments.create`: 상담 예약 생성
- `appointments.cancel`: 상담 예약 취소

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: Amber (#F59E0B)
- **Background**: Slate (#0F172A)
- **Text**: White (#FFFFFF)
- **Secondary**: Gray (#6B7280)

### 타이포그래피
- **Heading**: Bold, 32-48px
- **Body**: Regular, 14-16px
- **Caption**: Regular, 12px

## 📱 반응형 디자인
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

## 🔄 CI/CD

GitHub Actions를 통한 자동 배포:
- 코드 푸시 시 자동 테스트
- 테스트 통과 시 자동 빌드
- 프로덕션 배포

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 👥 기여

기여는 언제나 환영합니다! Pull Request를 통해 개선 사항을 제안해주세요.

## 📞 연락처

- **이메일**: info@jangbu-assoc.com
- **전화**: +82-10-1234-5678
- **웹사이트**: https://jangbu-quantum-assoc.com

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들을 활용합니다:
- React, Tailwind CSS, shadcn/ui
- Drizzle ORM, Express.js, tRPC
- Stripe API, Manus Platform

---

**장•부 양자요법 관리사 협회** © 2026. All rights reserved.
