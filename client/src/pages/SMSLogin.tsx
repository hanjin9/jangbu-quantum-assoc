import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Phone, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

type Step = 'phone' | 'otp' | 'success';

export default function SMSLogin() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

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
    // 한국 번호 (+82로 변환)
    if (cleaned.startsWith('0')) {
      return `+82${cleaned.slice(1)}`;
    }
    if (!cleaned.startsWith('82')) {
      return `+82${cleaned}`;
    }
    return `+${cleaned}`;
  };

  // 1단계: SMS 인증 코드 발송
  const handleSendOTP = async () => {
    setError('');

    if (!phoneNumber.replace(/\D/g, '')) {
      setError('휴대폰 번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const internationalNumber = toInternationalFormat(phoneNumber);
      const result = await sendOTPMutation.mutateAsync({
        phoneNumber: internationalNumber,
      });

      if (result.success) {
        setStep('otp');
        setTimeLeft(result.expiresIn);
        toast.success('인증 코드가 발송되었습니다.');

        // 타이머 시작
        const interval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'SMS 발송에 실패했습니다.');
      toast.error(err.message || 'SMS 발송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 2단계: OTP 코드 검증
  const handleVerifyOTP = async () => {
    setError('');

    if (otpCode.length !== 6) {
      setError('인증 코드는 6자리입니다.');
      return;
    }

    setLoading(true);
    try {
      const internationalNumber = toInternationalFormat(phoneNumber);
      const result = await verifyOTPMutation.mutateAsync({
        phoneNumber: internationalNumber,
        otpCode,
      });

      if (result.success) {
        setSessionToken(result.sessionToken);
        setStep('success');
        toast.success('인증이 완료되었습니다.');

        // 자동 로그인
        setTimeout(() => handleAutoLogin(result.sessionToken), 1000);
      }
    } catch (err: any) {
      setError(err.message || '인증 코드가 올바르지 않습니다.');
      toast.error(err.message || '인증 코드가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 3단계: 자동 로그인
  const handleAutoLogin = async (token: string) => {
    try {
      const result = await loginWithSessionMutation.mutateAsync({
        sessionToken: token,
      });

      if (result.success) {
        toast.success('로그인되었습니다.');
        // 대시보드로 이동
        setTimeout(() => navigate('/dashboard'), 500);
      }
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
      toast.error(err.message || '로그인에 실패했습니다.');
    }
  };

  // 1단계: 휴대폰 번호 입력
  if (step === 'phone') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md card-luxury">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-accent/10 rounded-full p-3">
                <Phone className="text-accent" size={32} />
              </div>
            </div>
            <CardTitle className="text-center">SMS 인증 로그인</CardTitle>
            <CardDescription className="text-center">
              휴대폰 번호로 간편하게 로그인하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                휴대폰 번호
              </label>
              <Input
                type="tel"
                placeholder="010-1234-5678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                disabled={loading}
                className="text-lg"
              />
              <p className="text-xs text-foreground/50">
                한국 휴대폰 번호를 입력해주세요
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              onClick={handleSendOTP}
              disabled={loading || !phoneNumber.replace(/\D/g, '')}
              className="w-full btn-primary"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  발송 중...
                </>
              ) : (
                '인증 코드 발송'
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-foreground/50">또는</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="w-full"
            >
              기존 로그인으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 2단계: OTP 코드 입력
  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md card-luxury">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-accent/10 rounded-full p-3">
                <CheckCircle2 className="text-accent" size={32} />
              </div>
            </div>
            <CardTitle className="text-center">인증 코드 입력</CardTitle>
            <CardDescription className="text-center">
              {phoneNumber}로 발송된 인증 코드를 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                인증 코드 (6자리)
              </label>
              <Input
                type="text"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={loading}
                maxLength={6}
                className="text-center text-2xl tracking-widest font-mono"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-foreground/50">
                  인증 코드는 5분 동안 유효합니다
                </p>
                <p className={`text-sm font-semibold ${timeLeft < 60 ? 'text-red-500' : 'text-foreground'}`}>
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              onClick={handleVerifyOTP}
              disabled={loading || otpCode.length !== 6}
              className="w-full btn-primary"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  확인 중...
                </>
              ) : (
                '인증 완료'
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setStep('phone');
                setOtpCode('');
                setError('');
              }}
              className="w-full"
              disabled={loading}
            >
              다시 입력
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3단계: 성공
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md card-luxury border-green-200">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle2 className="text-green-500" size={32} />
            </div>
          </div>
          <CardTitle className="text-center text-green-600">로그인 완료!</CardTitle>
          <CardDescription className="text-center">
            대시보드로 이동 중입니다...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-accent" size={40} />
          </div>
          <p className="text-center text-sm text-foreground/70">
            잠시만 기다려주세요
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
