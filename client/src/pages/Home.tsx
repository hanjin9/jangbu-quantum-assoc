import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ChevronRight, Calendar, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// 모바일 영상 URL (9:16 세로, 1080x1920)
const MOBILE_VIDEO_URL = "https://8888-ib5azwpfjv7fwu3zin6t1-bec5f8f5.sg1.manus.computer/upload/copy_de44592c2c9a60fc0a99a288a573000b.mp4";
// 데스크톱 영상 URL (16:9 가로, 1920x1080)
const DESKTOP_VIDEO_URL = "https://8888-ib5azwpfjv7fwu3zin6t1-bec5f8f5.sg1.manus.computer/upload/jangbu_intro_desktop.mp4";

export default function Home() {
  const [, navigate] = useLocation();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [isMuted, setIsMuted] = useState(true); // 브라우저 정책상 처음엔 muted로 시작 (상호작용 후 자동 해제)
  const [userUnlocked, setUserUnlocked] = useState(false); // 사용자 상호작용 여부
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 사용자 첫 상호작용 시 소리 자동 ON
  useEffect(() => {
    const unlockAudio = () => {
      if (!userUnlocked) {
        setUserUnlocked(true);
        setIsMuted(false); // 소리 ON으로 전환
        if (mobileVideoRef.current) {
          mobileVideoRef.current.muted = false;
          mobileVideoRef.current.play().catch(() => {
            mobileVideoRef.current!.muted = true;
            setIsMuted(true);
          });
        }
        if (desktopVideoRef.current) {
          desktopVideoRef.current.muted = false;
          desktopVideoRef.current.play().catch(() => {
            desktopVideoRef.current!.muted = true;
            setIsMuted(true);
          });
        }
      }
    };
    // 스크롤, 터치, 클릭 중 하나라도 감지되면 소리 ON
    window.addEventListener('scroll', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('click', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('scroll', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
  }, [userUnlocked]);

  // 소리 토글 함수 (끄기/켜기)
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (mobileVideoRef.current) mobileVideoRef.current.muted = newMuted;
    if (desktopVideoRef.current) desktopVideoRef.current.muted = newMuted;
  };

  // Intersection Observer - 화면 중앙에 올 때 자동 재생, 벗어날 때 정지
  useEffect(() => {
    const setupObserver = (videoEl: HTMLVideoElement | null) => {
      if (!videoEl) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            videoEl.muted = isMuted; // 현재 음소거 상태 반영
            videoEl.play().catch(() => {
              // autoplay 실패 시 무음으로 재시도
              videoEl.muted = true;
              setIsMuted(true);
              videoEl.play().catch(() => console.log('Video autoplay failed'));
            });
          } else {
            videoEl.pause();
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
  }, [isMuted]);

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
            backgroundPosition: 'center',
            backgroundAttachment: isMobile ? 'scroll' : 'fixed',
            backgroundSize: 'cover'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-2xl">
          <h1 className="text-3xl md:text-7xl font-bold text-white mb-4 md:mb-6">
            양자 에너지로 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">건강을 회복하세요</span>
          </h1>
          <p className="text-base md:text-xl text-gray-200 mb-6 md:mb-8">
            전문 양자요법 관리사와 함께 신체의 에너지 밸런스를 회복하고 건강한 삶을 시작하세요
          </p>
          <div className="flex gap-3 md:gap-4 justify-center flex-wrap text-sm md:text-base flex-col md:flex-row pb-12 md:pb-16">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 md:px-12 py-6 md:py-8 text-lg md:text-2xl font-bold flex items-center justify-center"
              onClick={() => navigate('/sms-login')}
            >
              🔐 로그인
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 md:px-12 py-6 md:py-8 text-lg md:text-2xl font-bold flex items-center justify-center"
              onClick={() => navigate('/checkout')}
            >
              📝 회원 가입
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              className="bg-amber-500/20 border-2 border-amber-500 text-amber-400 hover:bg-amber-500/40 hover:border-amber-400 transition-all duration-300 font-bold px-8 md:px-12 py-6 md:py-8 text-lg md:text-2xl flex items-center justify-center"
              onClick={() => navigate('/consultation-booking')}
            >
              <Calendar className="w-5 h-5 mr-2" />
              상담 예약하기
            </Button>
          </div>
        </div>
      </section>

      {/* 협회 소개 영상 섹션 */}
      <section className="py-16 md:py-24 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-amber-400">
            양자요법 협회 소개
          </h2>

          {/* 모바일: 9:16 세로 영상 (화면 가득) */}
          <div className="md:hidden w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-2xl bg-black relative">
            <div className="relative w-full" style={{ paddingBottom: '177.78%' }}>
              <video
                ref={mobileVideoRef}
                className="absolute inset-0 w-full h-full"
                style={{ objectFit: 'cover', backgroundColor: '#000' }}
                muted
                playsInline
                loop
                preload="metadata"
              >
                <source src={MOBILE_VIDEO_URL} type="video/mp4" />
              </video>
              {/* 소리 토글 버튼 */}
              <button
                onClick={toggleMute}
                className="absolute bottom-4 right-4 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all duration-200 border border-white/30"
                aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* 데스크톱: 16:9 가로 영상 */}
          <div className="hidden md:block max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl bg-black relative">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <video
                ref={desktopVideoRef}
                className="absolute inset-0 w-full h-full"
                style={{ objectFit: 'contain', backgroundColor: '#000' }}
                muted
                playsInline
                loop
                preload="metadata"
              >
                <source src={DESKTOP_VIDEO_URL} type="video/mp4" />
              </video>
              {/* 소리 토글 버튼 */}
              <button
                onClick={toggleMute}
                className="absolute bottom-4 right-4 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all duration-200 border border-white/30"
                aria-label={isMuted ? '소리 켜기' : '소리 끄기'}
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
            </div>
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

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-[#1a4d7a]">서비스</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: '커뮤니티', icon: '👥', path: '/community' },
              { title: '시험', icon: '📝', path: '/exam' },
              { title: '자격증 확인', icon: '🏆', path: '/verify-certificate' },
            ].map((feature, i) => (
              <button
                key={i}
                onClick={() => navigate(feature.path)}
                className="p-6 rounded-lg border border-border hover:border-[#d4af37] transition bg-card hover:bg-card/80 text-left"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-[#1a4d7a] mb-2">{feature.title}</h4>
                <p className="text-muted-foreground">전문가와 함께 성장하세요</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
