import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Play, Pause } from 'lucide-react';

const MOBILE_VIDEO_URL = '/manus-storage/copy_de44592c2c9a60fc0a99a288a573000b_3c1c8906.mp4';
const DESKTOP_VIDEO_URL = '/manus-storage/jangbu_intro_desktop_2e7dadec.mp4';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [userUnlocked, setUserUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // 초기값 false (재생 전)
  const [showIcon, setShowIcon] = useState(false); // 터치 시 아이콘 잠깐 표시
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const iconTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 화면 크기 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 사용자 첫 상호작용 시 소리 unlock
  useEffect(() => {
    const unlockAudio = () => {
      if (!userUnlocked) {
        setUserUnlocked(true);
      }
    };
    window.addEventListener('scroll', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('click', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('scroll', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
  }, [userUnlocked]);

  // 현재 활성 영상 ref 반환
  const getActiveVideoRef = () => {
    return isMobile ? mobileVideoRef : desktopVideoRef;
  };

  // 재생/정지 토글 (YouTube 스타일 - 화면 터치 or 하단 버튼 공통 사용)
  const togglePlayPause = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // 이벤트 버블링 차단
    const videoRef = getActiveVideoRef();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.muted = false;
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => console.log('Video play failed'));
      });
      setIsPlaying(true);
    }

    // 아이콘 잠깐 표시 (YouTube 스타일)
    setShowIcon(true);
    if (iconTimerRef.current) clearTimeout(iconTimerRef.current);
    iconTimerRef.current = setTimeout(() => setShowIcon(false), 800);
  };

  // Intersection Observer - 화면 중앙에 올 때 자동 재생
  useEffect(() => {
    const setupObserver = (videoEl: HTMLVideoElement | null) => {
      if (!videoEl) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            videoEl.muted = false;
            videoEl.play().then(() => {
              setIsPlaying(true);
            }).catch(() => {
              videoEl.muted = true;
              videoEl.play().then(() => {
                setIsPlaying(true);
              }).catch(() => console.log('Video autoplay failed'));
            });
          } else {
            videoEl.pause();
            setIsPlaying(false);
          }
        },
        { threshold: 0.4 }
      );

      observer.observe(videoEl);
      return observer;
    };

    const mobileObserver = setupObserver(mobileVideoRef.current);
    const desktopObserver = setupObserver(desktopVideoRef.current);

    return () => {
      if (mobileObserver && mobileVideoRef.current) mobileObserver.unobserve(mobileVideoRef.current);
      if (desktopObserver && desktopVideoRef.current) desktopObserver.unobserve(desktopVideoRef.current);
    };
  }, [userUnlocked]);

  // 영상 섹션 공통 렌더링 컴포넌트
  const VideoPlayer = ({
    videoRef,
    src,
    aspectClass,
    objectFit,
  }: {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    src: string;
    aspectClass: string;
    objectFit: 'cover' | 'contain';
  }) => (
    <div
      className="relative w-full cursor-pointer select-none"
      style={{ paddingBottom: aspectClass }}
      onClick={togglePlayPause}
      onTouchEnd={togglePlayPause}
    >
      {/* 영상 */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full"
        style={{ objectFit, backgroundColor: '#000' }}
        playsInline
        loop
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* YouTube 스타일 터치 아이콘 (중앙, 잠깐 표시) - pointer-events-none으로 클릭 통과 */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
          showIcon ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-black/60 rounded-full p-5">
          {isPlaying ? (
            <Pause className="w-10 h-10 text-white" />
          ) : (
            <Play className="w-10 h-10 text-white" />
          )}
        </div>
      </div>

      {/* 하단 재생/정지 버튼 (항상 표시) - pointer-events-auto로 클릭 가능 */}
      <button
        onClick={togglePlayPause}
        onTouchEnd={togglePlayPause}
        className="absolute bottom-4 right-4 z-20 bg-black/60 hover:bg-black/90 active:bg-black text-white rounded-full p-3 transition-all duration-200 border border-white/30 pointer-events-auto"
        aria-label={isPlaying ? '일시정지' : '재생'}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6" />
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${
              isMobile
                ? 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/hero-quantum-mobile-optimized-PwNNHSQ4X3DxpKS4qv3TLP.webp'
                : 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/hero-quantum-main-6jjXaiPbmoCJLUoUaD8J3L.webp'
            })`,
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">양자 에너지로 건강을 회복하세요</h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            전문 양자요법 관리사와 함께 시작하는 에너지 발란스 &amp; 건강한 삶
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#d4af37] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#e6c547] transition">
              🔑 로그인
            </button>
            <button className="border-2 border-[#d4af37] text-[#d4af37] px-8 py-3 rounded-lg font-bold hover:bg-[#d4af37]/10 transition">
              📝 회원 가입
            </button>
            <button className="border-2 border-[#d4af37] text-[#d4af37] px-8 py-3 rounded-lg font-bold hover:bg-[#d4af37]/10 transition">
              📅 상담 예약하기
            </button>
          </div>
        </div>
      </section>

      {/* Introduction Video Section */}
      <section className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            양자요법 협회 소개
          </h2>

          {/* 모바일: 9:16 세로 영상 */}
          <div className="md:hidden w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-2xl bg-black">
            <VideoPlayer
              videoRef={mobileVideoRef}
              src={MOBILE_VIDEO_URL}
              aspectClass="177.78%"
              objectFit="cover"
            />
          </div>

          {/* 데스크톱: 16:9 가로 영상 */}
          <div className="hidden md:block max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl bg-black">
            <VideoPlayer
              videoRef={desktopVideoRef}
              src={DESKTOP_VIDEO_URL}
              aspectClass="56.25%"
              objectFit="contain"
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-300 text-lg">
              저희 협회는 양자 에너지를 통해 건강한 삶을 추구하는 전문가들의 커뮤니티입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-[#1a4d7a]">고객 후기</h3>
          <div className="rounded-lg overflow-hidden shadow-2xl mb-12">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/testimonials-success-FxRZ89mghsSzwmi56YcTgf.webp"
              alt="고객 후기"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: '김민지',
                title: '마케팅 임원',
                testimonial: '양자요법을 통해 만성 스트레스가 완화되었고, 에너지가 회복되었습니다.'
              },
              {
                name: '이준호',
                title: '기업가',
                testimonial: '개인 맞춤형 상담으로 건강이 눈에 띄게 개선되었습니다. 강력히 추천합니다.'
              },
              {
                name: '박수진',
                title: '의료 전문가',
                testimonial: '과학적 접근과 전문성이 돋보이는 서비스입니다. 매우 만족합니다.'
              }
            ].map((testimonial, i) => (
              <div key={i} className="p-6 rounded-lg border border-border bg-card hover:border-[#d4af37] transition">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-[#d4af37]">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.testimonial}"</p>
                <p className="text-[#1a4d7a] font-bold">{testimonial.name}</p>
                <p className="text-[#d4af37] text-sm">{testimonial.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">우리의 서비스</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '개인 상담',
                description: '전문 관리사와 1:1 맞춤형 양자요법 상담'
              },
              {
                title: '그룹 세션',
                description: '함께 성장하는 커뮤니티 기반 에너지 워크숍'
              },
              {
                title: '온라인 교육',
                description: '언제 어디서나 배우는 양자요법 기초 과정'
              }
            ].map((service, i) => (
              <div key={i} className="p-8 rounded-lg border border-[#d4af37]/30 bg-slate-700/50 hover:border-[#d4af37] transition">
                <h4 className="text-xl font-bold text-[#d4af37] mb-4">{service.title}</h4>
                <p className="text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1a4d7a] to-[#0d2847]">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">건강한 삶을 시작하세요</h3>
          <p className="text-gray-200 mb-8">양자 에너지의 힘으로 당신의 삶을 변화시키세요</p>
          <button className="bg-[#d4af37] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#e6c547] transition">
            지금 시작하기
          </button>
        </div>
      </section>
    </div>
  );
}
