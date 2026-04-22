import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Phone, CheckCircle2, Loader2, AlertCircle, Mail, MessageCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

type Step = 'phone' | 'otp' | 'success' | 'social';
type LoginMethod = 'sms' | 'google' | 'kakao';

export default function SMSLogin() {
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>('social');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('sms');
  const [returnUrl, setReturnUrl] = useState<string>('/'); // 로그인 후 이동할 URL

  const sendOTPMutation = trpc.smsAuth.sendOTP.useMutation();
  const verifyOTPMutation = trpc.smsAuth.verifyOTP.useMutation();
  const loginWithSessionMutation = trpc.smsAuth.loginWithSession.useMutation();

  // 휴대폰 번호 포맷팅
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
  };

  // 국제 형식으로 변환
  const toInternationalFormat = (formatted: string): string => {
    const cleaned = formatted.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return `+82${cleaned.slice(1)}`;
    }
    if (!cleaned.startsWith('82')) {
      return `+82${cleaned}`;
    }
    return `+${cleaned}`;
  };

  // URL에서 returnUrl 파라미터 추출
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tier = params.get('tier');
    const url = params.get('returnUrl');
    
    if (tier) {
      // tier 정보가 있으면 결제 페이지로 리다이렉트
      setReturnUrl(`/payment-checkout?tier=${tier}`);
    } else if (url) {
      setReturnUrl(decodeURIComponent(url));
    }
  }, []);

  // 타이머
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // 1단계: SMS 인증 코드 발송
  const handleSendOTP = async () => {
    setError('');
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      setError('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const internationalPhone = toInternationalFormat(phoneNumber);
      await sendOTPMutation.mutateAsync({ phoneNumber: internationalPhone });
      setStep('otp');
      setTimeLeft(300); // 5분
      toast.success('인증 코드가 발송되었습니다.');
    } catch (err) {
      setError('인증 코드 발송에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2단계: OTP 검증
  const handleVerifyOTP = async () => {
    setError('');
    if (!otpCode || otpCode.length !== 6) {
      setError('6자리 인증 코드를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const internationalPhone = toInternationalFormat(phoneNumber);
      const result = await verifyOTPMutation.mutateAsync({
        phoneNumber: internationalPhone,
        otpCode,
      });
      setSessionToken(result.sessionToken);
      setStep('success');
      toast.success('인증이 완료되었습니다.');
    } catch (err) {
      setError('인증 코드가 올바르지 않습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3단계: 세션으로 로그인
  const handleLoginWithSession = async () => {
    setLoading(true);
    try {
      await loginWithSessionMutation.mutateAsync({ sessionToken });
      toast.success('로그인되었습니다.');
      // returnUrl이 있으면 해당 URL로 이동, 없으면 홈으로 이동
      navigate(returnUrl);
    } catch (err) {
      setError('로그인에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Google 로그인
  const handleGoogleLogin = () => {
    setLoading(true);
    try {
      // 간단한 Google OAuth 리다이렉트
      const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // 실제로는 환경변수에서 가져옴
      const redirectUri = `${window.location.origin}/api/auth/google/callback`;
      const scope = 'openid profile email';
      const responseType = 'code';
      
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
      
      window.location.href = googleAuthUrl;
    } catch (err) {
      setError('Google 로그인에 실패했습니다.');
      console.error(err);
      setLoading(false);
    }
  };

  // 카카오톡 로그인
  const handleKakaoLogin = () => {
    setLoading(true);
    try {
      // 간단한 카카오 OAuth 리다이렉트
      const clientId = 'YOUR_KAKAO_CLIENT_ID'; // 실제로는 환경변수에서 가져옴
      const redirectUri = `${window.location.origin}/api/auth/kakao/callback`;
      
      const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
      
      window.location.href = kakaoAuthUrl;
    } catch (err) {
      setError('카카오톡 로그인에 실패했습니다.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-amber-500/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">로그인</CardTitle>
          <CardDescription className="text-gray-400">편리한 방법을 선택해주세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 소셜 로그인 선택 화면 */}
          {step === 'social' && (
            <div className="space-y-4">
              {/* Google 로그인 */}
              <button
                onClick={() => {
                  setLoginMethod('google');
                  handleGoogleLogin();
                }}
                disabled={loading}
                className="w-full px-4 py-3 bg-white hover:bg-gray-100 text-gray-800 rounded-lg transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Mail className="w-5 h-5" />
                Google로 로그인
              </button>

              {/* 카카오톡 로그인 */}
              <button
                onClick={() => {
                  setLoginMethod('kakao');
                  handleKakaoLogin();
                }}
                disabled={loading}
                className="w-full px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 rounded-lg transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <MessageCircle className="w-5 h-5" />
                카카오톡으로 로그인
              </button>

              {/* SMS 로그인 */}
              <button
                onClick={() => {
                  setStep('phone');
                  setLoginMethod('sms');
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition font-semibold flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                휴대폰 번호로 로그인
              </button>

              {/* 회원가입 링크 */}
              <p className="text-center text-gray-400 text-sm">
                계정이 없으신가요?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  회원가입
                </button>
              </p>
            </div>
          )}

          {/* SMS 로그인 - 휴대폰 번호 입력 */}
          {step === 'phone' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  휴대폰 번호
                </label>
                <Input
                  type="tel"
                  placeholder="010-1234-5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                  className="bg-slate-700 border-amber-500/30 text-white placeholder-gray-500"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <Button
                onClick={handleSendOTP}
                disabled={loading || !phoneNumber}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    발송 중...
                  </>
                ) : (
                  '인증 코드 발송'
                )}
              </Button>

              <button
                onClick={() => {
                  setStep('social');
                  setError('');
                }}
                className="w-full text-amber-400 hover:text-amber-300 font-semibold text-sm"
              >
                다른 방법으로 로그인
              </button>
            </div>
          )}

          {/* SMS 로그인 - OTP 입력 */}
          {step === 'otp' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  인증 코드 (6자리)
                </label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="bg-slate-700 border-amber-500/30 text-white placeholder-gray-500 text-center text-2xl tracking-widest"
                  disabled={loading}
                />
              </div>

              <div className="text-center text-sm text-gray-400">
                {timeLeft > 0 ? (
                  <p>
                    남은 시간: <span className="text-amber-400 font-semibold">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                  </p>
                ) : (
                  <p className="text-red-400">인증 코드가 만료되었습니다.</p>
                )}
              </div>

              {error && (
                <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <Button
                onClick={handleVerifyOTP}
                disabled={loading || otpCode.length !== 6 || timeLeft === 0}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    검증 중...
                  </>
                ) : (
                  '인증 완료'
                )}
              </Button>

              <button
                onClick={() => {
                  setStep('phone');
                  setError('');
                  setOtpCode('');
                }}
                className="w-full text-amber-400 hover:text-amber-300 font-semibold text-sm"
              >
                다시 입력
              </button>
            </div>
          )}

          {/* 로그인 성공 */}
          {step === 'success' && (
            <div className="text-center space-y-4 py-6">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-white mb-1">인증 완료!</h3>
                <p className="text-gray-400">로그인 중입니다...</p>
              </div>
              <Button
                onClick={handleLoginWithSession}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  '로그인'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
