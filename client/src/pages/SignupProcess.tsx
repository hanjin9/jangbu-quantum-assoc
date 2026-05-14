import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

type SignupStep = 'form' | 'complete';

export default function SignupProcess() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState<SignupStep>('form');
  
  // 인증 관련
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  
  // 프로필 정보
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [contact, setContact] = useState('');
  const [region, setRegion] = useState('');
  const [job, setJob] = useState('');
  const [motivation, setMotivation] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const completeSignupMutation = trpc.signup.completeSignup.useMutation();

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

  // 이메일 인증 코드 발송
  const handleSendEmailOTP = async () => {
    setError('');
    if (!email || !email.includes('@')) {
      setError('올바른 이메일을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      // 실제로는 백엔드에서 이메일 인증 코드 발송
      // 현재는 테스트용으로 즉시 진행
      setOtpSent(true);
      setTimeLeft(300);
      toast.success('인증 코드가 이메일로 발송되었습니다.');
    } catch (err) {
      setError('이메일 발송에 실패했습니다.');
      console.error(err);
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
      // 현재는 테스트용으로 즉시 완료
      setSessionToken(`email-${email}-${Date.now()}`);
      setVerified(true);
      toast.success('인증이 완료되었습니다.');
    } catch (err) {
      setError('인증 코드가 올바르지 않습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 회원가입 완료
  const handleSignupComplete = async () => {
    setError('');
    if (!name || !age || !contact) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (!verified) {
      setError('이메일 인증을 완료해주세요.');
      return;
    }

    setLoading(true);
    try {
      const internationalPhone = toInternationalFormat(contact);
      
      await completeSignupMutation.mutateAsync({
        sessionToken,
        name,
        age,
        contact: internationalPhone,
        region: region || undefined,
        job: job || undefined,
        motivation: motivation || undefined,
      });
      
      setCurrentStep('complete');
      toast.success('회원가입이 완료되었습니다!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('회원가입에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-20 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="bg-slate-800 border-slate-700 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">회원가입</CardTitle>
            <CardDescription className="text-gray-400">
              {currentStep === 'form' && '기본 정보를 입력해주세요'}
              {currentStep === 'complete' && '가입 완료'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 회원가입 폼 */}
            {currentStep === 'form' && (
              <div className="space-y-4">
                {/* 이메일 인증 섹션 */}
                <div className="border border-blue-500/30 rounded-lg p-4 bg-slate-700/50">
                  <h3 className="text-sm font-semibold text-blue-400 mb-3">📧 이메일 인증</h3>
                  
                  <div className="space-y-3">
                    {/* 이메일 주소 입력 */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        이메일 주소 *
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-slate-700 border-blue-500/30 text-white text-sm flex-1"
                          disabled={loading || verified}
                        />
                        <Button
                          onClick={handleSendEmailOTP}
                          disabled={loading || !email || verified}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold whitespace-nowrap"
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            '발송'
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* 인증 코드 입력 */}
                    {otpSent && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">
                          인증 코드 (6자리) *
                        </label>
                        <div className="flex gap-2 items-end">
                          <div className="flex-1">
                            <Input
                              type="text"
                              placeholder="000000"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                              className="bg-slate-700 border-blue-500/30 text-white text-center text-lg tracking-widest"
                              disabled={loading || verified}
                            />
                            {timeLeft > 0 && (
                              <p className="text-xs text-gray-400 mt-1">
                                남은 시간: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                              </p>
                            )}
                          </div>
                          <Button
                            onClick={handleVerifyEmailOTP}
                            disabled={loading || verificationCode.length !== 6 || verified}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold whitespace-nowrap"
                          >
                            {loading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : verified ? (
                              '✓ 완료'
                            ) : (
                              '확인'
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {verified && (
                      <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <p className="text-sm text-green-300">이메일 인증이 완료되었습니다.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 기본 정보 섹션 */}
                <div className="border border-slate-600 rounded-lg p-4 bg-slate-700/30">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">👤 기본 정보</h3>
                  
                  <div className="space-y-2">
                    {/* 필수 항목 */}
                    <div>
                      <label className="block text-xs font-semibold text-amber-400 mb-1">필수 입력</label>
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
                      <label className="block text-xs font-semibold text-gray-400 mb-1">선택 입력</label>
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
                          className="w-full bg-slate-700 border border-slate-600 text-white text-sm p-2 rounded-md resize-none h-16"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 에러 메시지 */}
                {error && (
                  <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                {/* 회원가입 버튼 */}
                <Button
                  onClick={handleSignupComplete}
                  disabled={loading || !name || !age || !contact || !verified}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-6"
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

                {/* 로그인 링크 */}
                <p className="text-center text-gray-400 text-sm">
                  이미 계정이 있으신가요?{' '}
                  <button
                    onClick={() => navigate('/sms-login')}
                    className="text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    로그인
                  </button>
                </p>
              </div>
            )}

            {/* 완료 화면 */}
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
      </div>
    </div>
  );
}
