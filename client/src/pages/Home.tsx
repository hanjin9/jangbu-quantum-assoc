import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ChevronRight, Calendar, Play, Pause, Maximize, Minimize } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

// ✅ CDN 영구 URL
const MOBILE_VIDEO_URL = "/manus-storage/copy_de44592c2c9a60fc0a99a288a573000b_37cb781d.mp4";
const DESKTOP_VIDEO_URL = "/manus-storage/jangbu_intro_desktop_5b8c04a8.mp4";

// 시간 포맷: 초 → mm:ss
function formatTime(sec: number): string {
  if (!isFinite(sec) || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── YouTube 스타일 커스텀 컨트롤바 컴포넌트 ──
interface VideoControlBarProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  isFullscreen: boolean;
  onTogglePlay: () => void;
  onToggleFullscreen: (e: React.MouseEvent | React.TouchEvent) => void;
}

function VideoControlBar({ videoRef, isPlaying, isFullscreen, onTogglePlay, onToggleFullscreen }: VideoControlBarProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  // duration 폴링: loadedmetadata가 이미 지나간 경우 대비
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncDuration = () => {
      if (video.duration && isFinite(video.duration) && video.duration > 0) {
        setDuration(video.duration);
      }
    };

    // 이미 로드된 경우 즉시 읽기
    syncDuration();

    const onTimeUpdate = () => { if (!isDragging) setCurrentTime(video.currentTime); };
    const onDurationChange = () => syncDuration();
    const onLoaded = () => syncDuration();
    const onCanPlay = () => syncDuration();

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('canplaythrough', onCanPlay);

    // 폴링: 0.5초마다 duration 확인 (일부 브라우저 대비)
    const poll = setInterval(() => {
      if (video.duration && isFinite(video.duration) && video.duration > 0) {
        setDuration(video.duration);
        clearInterval(poll);
      }
    }, 500);

    return () => {
      clearInterval(poll);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('canplaythrough', onCanPlay);
    };
  }, [videoRef, isDragging]);

  // 프로그레스바 클릭/드래그로 탐색
  const seekTo = useCallback((clientX: number) => {
    const bar = progressRef.current;
    const video = videoRef.current;
    if (!bar || !video || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    video.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  }, [videoRef, duration]);

  const handleProgressMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    seekTo(e.clientX);
    const onMove = (ev: MouseEvent) => seekTo(ev.clientX);
    const onUp = () => { setIsDragging(false); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleProgressTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    seekTo(e.touches[0].clientX);
    const onMove = (ev: TouchEvent) => seekTo(ev.touches[0].clientX);
    const onEnd = () => { setIsDragging(false); window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd); };
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30 px-3 pb-3 pt-8"
      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)' }}
      onClick={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {/* 프로그레스 바 - YouTube 스타일 빨간색 */}
      <div
        ref={progressRef}
        className="w-full rounded-full bg-white/30 mb-3 cursor-pointer relative group/bar"
        style={{ touchAction: 'none', height: '5px' }}
        onMouseDown={handleProgressMouseDown}
        onTouchStart={handleProgressTouchStart}
      >
        {/* 재생된 부분 (빨간색 - YouTube 동일) */}
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-none"
          style={{ width: `${progress}%`, backgroundColor: '#ff0000' }}
        />
        {/* 드래그 핸들 (빨간 원) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-md"
          style={{ left: `calc(${progress}% - 8px)`, backgroundColor: '#ff0000', opacity: 1 }}
        />
      </div>

      {/* 하단 버튼 행 */}
      <div className="flex items-center gap-3">
        {/* 재생/정지 - 30% 크게 (w-5→w-7) */}
        <button
          className="text-white hover:text-red-400 transition-colors p-1 flex-shrink-0"
          style={{ touchAction: 'manipulation' }}
          onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
          onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); onTogglePlay(); }}
          aria-label={isPlaying ? '일시정지' : '재생'}
        >
          {isPlaying
            ? <Pause className="w-7 h-7" />
            : <Play className="w-7 h-7 ml-0.5" />}
        </button>

        {/* 시간 표시 - 2배 크게 (text-xs→text-base) */}
        <span className="text-white text-base font-mono select-none flex-1 font-bold tracking-wide">
          {formatTime(currentTime)}
          <span className="text-white/60 mx-1">/</span>
          {formatTime(duration)}
        </span>

        {/* 전체화면 - 30% 크게 (w-5→w-7) */}
        <button
          className="text-white hover:text-red-400 transition-colors p-1 flex-shrink-0"
          style={{ touchAction: 'manipulation' }}
          onClick={onToggleFullscreen}
          onTouchEnd={onToggleFullscreen}
          aria-label={isFullscreen ? '전체화면 종료' : '전체화면'}
        >
          {isFullscreen ? <Minimize className="w-7 h-7" /> : <Maximize className="w-7 h-7" />}
        </button>
      </div>
    </div>
  );
}

// ── 메인 홈 컴포넌트 ──
export default function Home() {
  const [, navigate] = useLocation();
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [userUnlocked, setUserUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [showPauseIcon, setShowPauseIcon] = useState(true);
  const [mobileVideoLoaded, setMobileVideoLoaded] = useState(false);
  const [desktopVideoLoaded, setDesktopVideoLoaded] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const iconTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeVideoRef = isMobile ? mobileVideoRef : desktopVideoRef;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 전체화면 상태 동기화
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  // 첫 상호작용 시 소리 ON
  useEffect(() => {
    const unlockAudio = () => {
      if (!userUnlocked) {
        setUserUnlocked(true);
        const tryUnmute = (ref: React.RefObject<HTMLVideoElement | null>) => {
          if (ref.current) {
            ref.current.muted = false;
            ref.current.play().catch(() => { if (ref.current) ref.current.muted = true; });
          }
        };
        tryUnmute(mobileVideoRef);
        tryUnmute(desktopVideoRef);
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

  // 영상 종료 이벤트 → 처음으로 복귀 후 정지
  useEffect(() => {
    const setupEndedHandler = (videoEl: HTMLVideoElement | null) => {
      if (!videoEl) return;
      const onEnded = () => {
        videoEl.currentTime = 0;
        videoEl.pause();
        setIsPlaying(false);
        setVideoEnded(true);
      };
      videoEl.addEventListener('ended', onEnded);
      return () => videoEl.removeEventListener('ended', onEnded);
    };
    const cleanM = setupEndedHandler(mobileVideoRef.current);
    const cleanD = setupEndedHandler(desktopVideoRef.current);
    return () => { cleanM?.(); cleanD?.(); };
  }, []);

  // Intersection Observer - 화면 진입 시 자동 재생 (1회만, 종료 후 재진입 시 재시작)
  useEffect(() => {
    const setupObserver = (videoEl: HTMLVideoElement | null) => {
      if (!videoEl) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // 종료 상태라면 처음부터 다시 재생
            if (videoEl.ended || videoEl.currentTime >= videoEl.duration - 0.1) {
              videoEl.currentTime = 0;
            }
            videoEl.muted = !userUnlocked;
            videoEl.play().then(() => { setIsPlaying(true); setVideoEnded(false); }).catch(() => {
              videoEl.muted = true;
              videoEl.play().then(() => { setIsPlaying(true); setVideoEnded(false); }).catch(() => {});
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
    const mObs = setupObserver(mobileVideoRef.current);
    const dObs = setupObserver(desktopVideoRef.current);
    return () => {
      if (mObs && mobileVideoRef.current) mObs.unobserve(mobileVideoRef.current);
      if (dObs && desktopVideoRef.current) dObs.unobserve(desktopVideoRef.current);
    };
  }, [userUnlocked]);

  // YouTube 스타일 중앙 아이콘 피드백
  const flashIcon = useCallback((pausing: boolean) => {
    setShowPauseIcon(pausing);
    setShowIcon(true);
    if (iconTimerRef.current) clearTimeout(iconTimerRef.current);
    iconTimerRef.current = setTimeout(() => setShowIcon(false), 700);
  }, []);

  // 재생/정지 토글
  const doToggle = useCallback(() => {
    const video = activeVideoRef.current;
    if (!video) return;
    if (video.paused || video.ended) {
      if (video.ended) video.currentTime = 0;
      setVideoEnded(false);
      video.muted = false;
      video.play().then(() => { setIsPlaying(true); flashIcon(true); }).catch(() => {
        video.muted = true;
        video.play().then(() => { setIsPlaying(true); flashIcon(true); }).catch(() => {});
      });
    } else {
      video.pause();
      setIsPlaying(false);
      flashIcon(false);
    }
  }, [activeVideoRef, flashIcon]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    doToggle();
  }, [doToggle]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if ('ontouchstart' in window) return;
    doToggle();
  }, [doToggle]);

  // 전체화면 토글
  const toggleFullscreen = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const container = videoContainerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">

      {/* Hero Section - 모바일: 상단바 바로 붙여서, 버튼 아래 1cm만 남기고 잡라내기 */}
      <section className="relative flex items-center justify-center overflow-hidden md:mt-0 -mt-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${
              isMobile
                ? 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/hero-quantum-mobile-optimized-PwNNHSQ4X3DxpKS4qv3TLP.webp'
                : 'https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/hero-quantum-main-6jjXaiPbmoCJLUoUaD8J3L.webp'
            })`,
            backgroundAttachment: isMobile ? 'scroll' : 'fixed',
            backgroundSize: 'cover'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-2xl pt-24 md:pt-32 pb-36 md:pb-40">
          <h1 className="text-3xl md:text-7xl font-bold text-white mb-4 md:mb-6">
            양자 에너지로 <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">건강을 회복하세요</span>
          </h1>
          <p className="text-base md:text-xl text-gray-200 mb-6 md:mb-8">
            전문 양자요법 관리사와 함께 신체의 에너지 밸런스를 회복하고 건강한 삶을 시작하세요
          </p>
          <div className="flex gap-3 md:gap-4 justify-center flex-wrap text-sm md:text-base flex-col md:flex-row mt-28 md:mt-8">
            <Button size="lg" className="bg-amber-500/20 border-2 border-amber-500 text-amber-400 hover:bg-amber-500/40 hover:border-amber-400 transition-all duration-300 font-bold px-8 md:px-12 py-6 md:py-8 text-lg md:text-2xl flex items-center justify-center" onClick={() => navigate('/consultation-booking')}>
              <Calendar className="w-5 h-5 mr-2" />상담 예약하기
            </Button>
            <Button size="lg" className="bg-amber-500/20 border-2 border-amber-500 text-amber-400 hover:bg-amber-500/40 hover:border-amber-400 transition-all duration-300 font-bold px-8 md:px-12 py-6 md:py-8 text-lg md:text-2xl flex items-center justify-center" onClick={() => navigate('/checkout')}>
              📝 회원 가입<ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" className="bg-amber-500/20 border-2 border-amber-500 text-amber-400 hover:bg-amber-500/40 hover:border-amber-400 transition-all duration-300 font-bold px-8 md:px-12 py-6 md:py-8 text-lg md:text-2xl flex items-center justify-center" onClick={() => navigate('/sms-login')}>
              🔐 로그인<ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* 협회 소개 영상 섹션 */}
      <section className="py-2 md:py-24 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 md:mb-12 text-amber-400">
            양자요법 협회 소개
          </h2>

          {/* ── 모바일: 9:16 세로 영상 ── */}
          <div
            className="md:hidden w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-2xl bg-black relative"
            ref={isMobile ? videoContainerRef : undefined}
          >
            <div
              className="relative w-full cursor-pointer"
              style={{ paddingBottom: '177.78%', touchAction: 'manipulation' }}
              onTouchEnd={handleTouchEnd}
            >
              {/* 로딩 스켈레톤 */}
              {!mobileVideoLoaded && (
                <div className="absolute inset-0 z-20 bg-slate-800 flex flex-col items-center justify-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-amber-400/30 animate-ping absolute" />
                    <div className="w-12 h-12 rounded-full border-2 border-amber-400/60 animate-ping absolute" style={{ animationDelay: '0.2s' }} />
                    <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center">
                      <Play className="w-5 h-5 text-amber-400 ml-0.5" />
                    </div>
                  </div>
                  <p className="text-amber-400/70 text-sm font-medium tracking-widest">영상 로딩 중...</p>
                  <div className="w-32 h-1 bg-slate-700 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-gradient-to-r from-amber-400/0 via-amber-400/60 to-amber-400/0" style={{ width: '60%', animation: 'shimmer 1.5s infinite' }} />
                  </div>
                </div>
              )}

              <video
                ref={mobileVideoRef}
                className="absolute inset-0 w-full h-full"
                style={{ objectFit: 'cover', backgroundColor: '#000' }}
                muted
                playsInline
                preload="metadata"
                onCanPlay={() => setMobileVideoLoaded(true)}
                onLoadedData={() => setMobileVideoLoaded(true)}
              >
                <source src={MOBILE_VIDEO_URL} type="video/mp4" />
              </video>

              {/* 영상 종료 오버레이 - 재생 버튼 */}
              {videoEnded && isMobile && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50">
                  <div className="bg-black/70 rounded-full p-6">
                    <Play className="w-14 h-14 text-white ml-1" />
                  </div>
                </div>
              )}

              {/* YouTube 스타일 중앙 아이콘 피드백 */}
              <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-opacity duration-200 ${showIcon ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-black/70 rounded-full p-5">
                  {showPauseIcon ? <Pause className="w-12 h-12 text-white" /> : <Play className="w-12 h-12 text-white ml-1" />}
                </div>
              </div>

              {/* 하단 YouTube 컨트롤바 */}
              {mobileVideoLoaded && (
                <VideoControlBar
                  videoRef={mobileVideoRef}
                  isPlaying={isPlaying && isMobile}
                  isFullscreen={isFullscreen}
                  onTogglePlay={doToggle}
                  onToggleFullscreen={toggleFullscreen}
                />
              )}
            </div>
          </div>

          {/* ── 데스크톱: 16:9 가로 영상 ── */}
          <div
            className="hidden md:block max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl bg-black relative"
            ref={!isMobile ? videoContainerRef : undefined}
          >
            <div
              className="relative w-full cursor-pointer group"
              style={{ paddingBottom: '56.25%' }}
              onClick={handleClick}
            >
              {/* 로딩 스켈레톤 */}
              {!desktopVideoLoaded && (
                <div className="absolute inset-0 z-20 bg-slate-800 flex flex-col items-center justify-center gap-4">
                  <div className="relative flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-2 border-amber-400/30 animate-ping absolute" />
                    <div className="w-14 h-14 rounded-full border-2 border-amber-400/60 animate-ping absolute" style={{ animationDelay: '0.2s' }} />
                    <div className="w-12 h-12 rounded-full bg-amber-400/20 flex items-center justify-center">
                      <Play className="w-6 h-6 text-amber-400 ml-0.5" />
                    </div>
                  </div>
                  <p className="text-amber-400/70 text-base font-medium tracking-widest">영상 로딩 중...</p>
                  <div className="w-48 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400/0 via-amber-400/60 to-amber-400/0" style={{ width: '60%', animation: 'shimmer 1.5s infinite' }} />
                  </div>
                </div>
              )}

              <video
                ref={desktopVideoRef}
                className="absolute inset-0 w-full h-full"
                style={{ objectFit: 'contain', backgroundColor: '#000' }}
                muted
                playsInline
                preload="metadata"
                onCanPlay={() => setDesktopVideoLoaded(true)}
                onLoadedData={() => setDesktopVideoLoaded(true)}
              >
                <source src={DESKTOP_VIDEO_URL} type="video/mp4" />
              </video>

              {/* 영상 종료 오버레이 */}
              {videoEnded && !isMobile && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50">
                  <div className="bg-black/70 rounded-full p-6">
                    <Play className="w-16 h-16 text-white ml-1" />
                  </div>
                </div>
              )}

              {/* 호버 아이콘 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-black/60 rounded-full p-5">
                  {isPlaying ? <Pause className="w-12 h-12 text-white" /> : <Play className="w-12 h-12 text-white ml-1" />}
                </div>
              </div>

              {/* 클릭 피드백 아이콘 */}
              <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-opacity duration-200 ${showIcon ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-black/70 rounded-full p-5">
                  {showPauseIcon ? <Pause className="w-12 h-12 text-white" /> : <Play className="w-12 h-12 text-white ml-1" />}
                </div>
              </div>

              {/* 하단 YouTube 컨트롤바 */}
              {desktopVideoLoaded && (
                <VideoControlBar
                  videoRef={desktopVideoRef}
                  isPlaying={isPlaying && !isMobile}
                  isFullscreen={isFullscreen}
                  onTogglePlay={doToggle}
                  onToggleFullscreen={toggleFullscreen}
                />
              )}
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-300 text-base md:text-lg">
              저희 협회는 양자 에너지를 통해 건강한 삶을 추구하는 전문가들의 커뮤니티입니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 핵심 서비스 카드 (영상 바로 아래) ── */}
      <section className="py-8 md:py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10 text-amber-400">핵심 서비스</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            {[
              {
                title: '커뮤니티',
                icon: '👥',
                path: '/community',
                desc: '전국 양자요법 관리사들과 정보를 나누고 함께 성장하세요.',
                color: 'from-blue-900/60 to-slate-800/80',
                border: 'border-blue-500/40 hover:border-blue-400'
              },
              {
                title: '자격 시험',
                icon: '📝',
                path: '/exam',
                desc: '공인 양자요법 관리사 자격증 취득을 위한 온라인 시험을 응시하세요.',
                color: 'from-amber-900/60 to-slate-800/80',
                border: 'border-amber-500/40 hover:border-amber-400'
              },
              {
                title: '자격증 확인',
                icon: '🏆',
                path: '/verify-certificate',
                desc: '발급된 자격증의 진위 여부를 즉시 확인할 수 있습니다.',
                color: 'from-emerald-900/60 to-slate-800/80',
                border: 'border-emerald-500/40 hover:border-emerald-400'
              },
            ].map((feature, i) => (
              <button
                key={i}
                onClick={() => navigate(feature.path)}
                className={`relative p-7 md:p-9 rounded-2xl border-2 ${feature.border} bg-gradient-to-br ${feature.color} text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl group w-full`}
              >
                <div className="text-5xl md:text-6xl mb-4">{feature.icon}</div>
                <h4 className="text-xl md:text-2xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">{feature.desc}</p>
                <div className="mt-5 flex items-center gap-2 text-amber-400 font-semibold text-base">
                  바로가기 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 협회 소개 상세 섹션 ── */}
      <section className="py-8 md:py-16 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-6 text-amber-400">협회 소개</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663351563633/ZFmCugcMVdsgzLCVvZ8jeT/hero-quantum-mobile-optimized-PwNNHSQ4X3DxpKS4qv3TLP.webp"
                alt="협회 소개"
                className="w-full h-56 md:h-80 object-cover"
              />
            </div>
            <div className="space-y-4">
              {[
                { icon: '⚡', title: '양자 에너지 치유', desc: '최신 양자물리학 원리를 기반으로 신체 에너지 밸런스를 회복합니다.' },
                { icon: '🎓', title: '전문 관리사 양성', desc: '체계적인 교육 과정으로 공인 양자요법 관리사를 양성합니다.' },
                { icon: '🌐', title: '글로벌 네트워크', desc: '국내외 양자요법 전문가들과 연결된 글로벌 협회입니다.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="text-3xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 학습 과정 섹션 ── */}
      <section className="py-8 md:py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-6 text-amber-400">학습 과정</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: '📚', title: '기초 과정', desc: '양자요법의 기본 원리와 이론을 학습합니다.', path: '/learning', badge: '입문' },
              { icon: '🔬', title: '심화 과정', desc: '실전 적용과 고급 기술을 습득합니다.', path: '/learning', badge: '전문가' },
              { icon: '🏅', title: '자격증 취득', desc: '공인 자격증 취득으로 전문성을 인증받으세요.', path: '/exam', badge: '자격증' },
              { icon: '🤝', title: '멘토링', desc: '현직 전문가와 1:1 멘토링을 받으세요.', path: '/community', badge: '1:1' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="flex gap-4 p-5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 text-left group w-full"
              >
                <div className="text-4xl flex-shrink-0">{item.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-bold text-lg">{item.title}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold">{item.badge}</span>
                  </div>
                  <p className="text-gray-400 text-base">{item.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-400/50 group-hover:text-amber-400 group-hover:translate-x-1 transition-all flex-shrink-0 self-center" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 회원 후기 섹션 ── */}
      <section className="py-8 md:py-16 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-6 text-amber-400">회원 후기</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: '김민지', title: '마케팅 임원', testimonial: '양자요법을 통해 만성 스트레스가 완화되었고, 에너지가 회복되었습니다.' },
              { name: '이준호', title: '기업가', testimonial: '개인 맞춤형 상담으로 건강이 눈에 띄게 개선되었습니다. 강력히 추천합니다.' },
              { name: '박수진', title: '의료 전문가', testimonial: '과학적 접근과 전문성이 돋보이는 서비스입니다. 매우 만족합니다.' }
            ].map((t, i) => (
              <div key={i} className="p-5 rounded-2xl border border-slate-700/50 bg-slate-800/60 hover:border-amber-500/50 transition">
                <div className="flex items-center gap-1 mb-3">{[...Array(5)].map((_, j) => <span key={j} className="text-amber-400 text-lg">★</span>)}</div>
                <p className="text-gray-300 mb-4 italic text-base leading-relaxed">"{t.testimonial}"</p>
                <p className="text-white font-bold text-base">{t.name}</p>
                <p className="text-amber-400 text-sm">{t.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 상담 예약 CTA 섹션 ── */}
      <section className="py-10 md:py-16 bg-gradient-to-r from-amber-900/40 via-slate-800 to-amber-900/40">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">지금 바로 시작하세요</h3>
          <p className="text-gray-300 text-base md:text-lg mb-6">전문 양자요법 관리사와 1:1 무료 상담을 예약하세요</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-6 text-lg font-bold"
              onClick={() => navigate('/consultation-booking')}
            >
              <Calendar className="w-5 h-5 mr-2" />무료 상담 예약
            </Button>
            <Button
              size="lg"
              className="bg-transparent border-2 border-amber-500 text-amber-400 hover:bg-amber-500/20 px-10 py-6 text-lg font-bold"
              onClick={() => navigate('/checkout')}
            >
              📝 회원 가입하기
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
