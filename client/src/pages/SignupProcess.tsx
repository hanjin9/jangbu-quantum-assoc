import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, Mail, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

type SignupStep = 'auth-method' | 'phone-auth' | 'email-auth' | 'profile' | 'complete';

export default function SignupProcess() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState<SignupStep>('auth-method');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email' | null>(null);
  
  // 인증 관련
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  
  // 프로필 정보
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [contact, setContact] = useState('');
  const [region, setRegion] = useState('');
  const [job, setJob] = useState('');
  const [motivation, setMotivation] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const sendOTPMutation = trpc.smsAuth.sendOTP.useMutation();
  const verifyOTPMutation = trpc.smsAuth.verifyOTP.useMutation();

  // 타이머
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

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

  // 휴대폰 인증 코드 발송
  const handleSendPhoneOTP = async () => {
    setError('');
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      setError('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const internationalPhone = toInternationalFormat(phoneNumber);
      await sendOTPMutation.mutateAsync({ phoneNumber: internationalPhone });
      setCurrentStep('phone-auth');
      setTimeLeft(300);
      toast.success('인증 코드가 발송되었습니다.');
    } catch (err) {
      setError('인증 코드 발송에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 휴대폰 인증 코드 검증
  const handleVerifyPhoneOTP = async () => {
    setError('');
    if (!verificationCode || verificationCode.length !== 6) {
      setError('6자리 인증 코드를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const internationalPhone = toInternationalFormat(phoneNumber);
      const result = await verifyOTPMutation.mutateAsync({
        phoneNumber: internationalPhone,
        otpCode: verificationCode,
      });
      setSessionToken(result.sessionToken);
      setCurrentStep('profile');
      toast.success('인증이 완료되었습니다.');
    } catch (err) {
      setError('인증 코드가 올바르지 않습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 이메일 인증 (간단히 구현)
  const handleSendEmailOTP = async () => {
    setError('');
    if (!email || !email.includes('@')) {
      setError('올바른 이메일을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      // 실제로는 백엔드에서 이메일 인증 코드 발송
      setCurrentStep('email-auth');
      setTimeLeft(300);
      toast.success('인증 코드가 이메일로 발송되었습니다.');
    } catch (err) {
      setError('이메일 발송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 이메일 인증 코드 검증
  const handleVerifyEmailOTP = async () => {
    setError('');
    if (!verificationCode || verificationCode.length !== 6) {
      setError('6자리 인증 코드를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      // 실제로는 백엔드에서 검증
      setCurrentStep('profile');
      toast.success('인증이 완료되었습니다.');
    } catch (err) {
      setError('인증 코드가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 프로필 정보 저장
  const handleProfileSubmit = async () => {
    setError('');
    if (!name || !age || !contact) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      // 실제로는 백엔드에서 저장
      setCurrentStep('complete');
      toast.success('회원가입이 완료되었습니다!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-20 pb-20">
      <div className="max-w-md mx-auto px-4">
        <Card className="bg-slate-800 border-slate-700 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">회원가입</CardTitle>
            <CardDescription className="text-gray-400">
              {currentStep === 'auth-method' && '인증 방법을 선택해주세요'}
              {currentStep === 'phone-auth' && '휴대폰 인증'}
              {currentStep === 'email-auth' && '이메일 인증'}
              {currentStep === 'profile' && '기본 정보 입력'}
              {currentStep === 'complete' && '가입 완료'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 1단계: 인증 방법 선택 */}
            {currentStep === 'auth-method' && (
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setAuthMethod('phone');
                    setCurrentStep('phone-auth');
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-6"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  휴대폰으로 인증
                </Button>
                <Button
                  onClick={() => {
                    setAuthMethod('email');
                    setCurrentStep('email-auth');
                  }}
                  variant="outline"
                  className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-500/10 font-semibold py-6"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  이메일로 인증
                </Button>
              </div>
            )}

            {/* 2단계: 휴대폰 인증 */}
            {currentStep === 'phone-auth' && !sessionToken && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    휴대폰 번호
                  </label>
                  <Input
                    type="tel"
                    placeholder="010-1234-5678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                    className="bg-slate-700 border-amber-500/30 text-white"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleSendPhoneOTP}
                  disabled={loading || !phoneNumber}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
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
                  onClick={() => setCurrentStep('auth-method')}
                  className="w-full text-amber-400 hover:text-amber-300 text-sm font-semibold"
                >
                  다른 방법으로 인증
                </button>
              </div>
            )}

            {/* 2단계: 휴대폰 OTP 입력 */}
            {currentStep === 'phone-auth' && phoneNumber && !sessionToken && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    인증 코드 (6자리)
                  </label>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                    className="bg-slate-700 border-amber-500/30 text-white text-center text-2xl tracking-widest"
                    disabled={loading}
                  />
                  {timeLeft > 0 && (
                    <p className="text-xs text-gray-400 mt-2">
                      남은 시간: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleVerifyPhoneOTP}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
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
              </div>
            )}

            {/* 2단계: 이메일 인증 */}
            {currentStep === 'email-auth' && !sessionToken && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    이메일 주소
                  </label>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-700 border-amber-500/30 text-white"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleSendEmailOTP}
                  disabled={loading || !email}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
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
                  onClick={() => setCurrentStep('auth-method')}
                  className="w-full text-amber-400 hover:text-amber-300 text-sm font-semibold"
                >
                  다른 방법으로 인증
                </button>
              </div>
            )}

            {/* 2단계: 이메일 OTP 입력 */}
            {currentStep === 'email-auth' && email && !sessionToken && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    인증 코드 (6자리)
                  </label>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                    className="bg-slate-700 border-amber-500/30 text-white text-center text-2xl tracking-widest"
                    disabled={loading}
                  />
                  {timeLeft > 0 && (
                    <p className="text-xs text-gray-400 mt-2">
                      남은 시간: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleVerifyEmailOTP}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
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
              </div>
            )}

            {/* 3단계: 프로필 정보 입력 */}
            {currentStep === 'profile' && (
              <div className="space-y-3">
                {/* 필수 항목 */}
                <div className="border-b border-slate-600 pb-3">
                  <p className="text-xs font-semibold text-amber-400 mb-3">필수 입력</p>
                  
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="이름"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-slate-700 border-amber-500/30 text-white text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="나이"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="bg-slate-700 border-amber-500/30 text-white text-sm"
                    />
                    <Input
                      type="tel"
                      placeholder="연락처 (010-1234-5678)"
                      value={contact}
                      onChange={(e) => setContact(formatPhoneNumber(e.target.value))}
                      className="bg-slate-700 border-amber-500/30 text-white text-sm"
                    />
                  </div>
                </div>

                {/* 선택 항목 */}
                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-3">선택 입력</p>
                  
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="거주지역 (예: 서울시 강남구)"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                    />
                    <Input
                      type="text"
                      placeholder="직업"
                      value={job}
                      onChange={(e) => setJob(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                    />
                    <textarea
                      placeholder="가입하게 된 동기"
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 text-white text-sm p-2 rounded-md resize-none h-20"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleProfileSubmit}
                  disabled={loading || !name || !age || !contact}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      가입 중...
                    </>
                  ) : (
                    '회원가입 완료'
                  )}
                </Button>
              </div>
            )}

            {/* 4단계: 완료 */}
            {currentStep === 'complete' && (
              <div className="text-center space-y-4 py-6">
                <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">회원가입 완료!</h3>
                  <p className="text-gray-400 text-sm">곧 홈페이지로 이동합니다...</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 로그인 링크 */}
        {currentStep === 'auth-method' && (
          <p className="text-center text-gray-400 text-sm mt-4">
            이미 계정이 있으신가요?{' '}
            <button
              onClick={() => navigate('/sms-login')}
              className="text-amber-400 hover:text-amber-300 font-semibold"
            >
              로그인
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
