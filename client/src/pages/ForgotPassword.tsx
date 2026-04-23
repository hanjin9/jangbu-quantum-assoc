import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { ErrorAlert, FieldError, showToast } from '@/components/ErrorSystem';

type ForgotPasswordStep = 'email' | 'confirm' | 'reset';

export default function ForgotPassword() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<ForgotPasswordStep>('email');
  
  // Step 1: 이메일 입력
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // Step 2: 재설정 링크 확인
  const [resetToken, setResetToken] = useState('');
  
  // Step 3: 새 비밀번호 입력
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // 이메일 검증
  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  // 비밀번호 검증
  const validatePassword = (value: string): boolean => {
    return value.length >= 8;
  };

  // Step 1: 이메일로 재설정 링크 발송
  const handleSendResetLink = async () => {
    setEmailError('');
    setGeneralError('');

    if (!email) {
      setEmailError('이메일을 입력해주세요.');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('유효한 이메일 형식이 아닙니다.');
      return;
    }

    setLoading(true);
    try {
      // 테스트 모드 - 실제 백엔드 연동은 tRPC 타입 개선 후 진행
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const testToken = 'test-reset-' + Date.now();
      setResetToken(testToken);
      setStep('confirm');
      showToast.success('재설정 링크를 이메일로 발송했습니다.', '이메일을 확인해주세요.');
    } catch (error: any) {
      setGeneralError(error.message || '이메일 발송에 실패했습니다.');
      showToast.error('오류', error.message || '다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: 비밀번호 재설정
  const handleResetPassword = async () => {
    setPasswordError('');
    setGeneralError('');

    if (!newPassword) {
      setPasswordError('새 비밀번호를 입력해주세요.');
      return;
    }

    if (!validatePassword(newPassword)) {
      setPasswordError('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    try {
      // 테스트 모드 - 실제 백엔드 연동은 tRPC 타입 개선 후 진행
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStep('reset');
      showToast.success('비밀번호가 변경되었습니다.', '새 비밀번호로 로그인해주세요.');
      
      // 2초 후 로그인 페이지로 이동
      setTimeout(() => navigate('/sms-login'), 2000);
    } catch (error: any) {
      setGeneralError(error.message || '비밀번호 변경에 실패했습니다.');
      showToast.error('오류', error.message || '다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate('/sms-login')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>뒤로가기</span>
        </button>

        {/* Step 1: 이메일 입력 */}
        {step === 'email' && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">비밀번호 찾기</CardTitle>
              <CardDescription>
                가입한 이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드립니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generalError && (
                <ErrorAlert
                  title="오류"
                  message={generalError}
                  level="error"
                />
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  이메일 주소
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                <FieldError message={emailError} />
              </div>

              <Button
                onClick={handleSendResetLink}
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    발송 중...
                  </>
                ) : (
                  '재설정 링크 발송'
                )}
              </Button>

              <p className="text-xs text-slate-500 text-center">
                계정이 없으신가요?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-amber-600 hover:text-amber-700 font-semibold"
                >
                  회원가입
                </button>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 2: 이메일 확인 */}
        {step === 'confirm' && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">이메일 확인</CardTitle>
              <CardDescription>
                {email}로 보낸 이메일을 확인해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-full">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <p className="font-semibold mb-2">📧 이메일을 확인해주세요</p>
                <p>
                  비밀번호 재설정 링크가 포함된 이메일을 받으셨습니다. 이메일의 링크를 클릭하여 새 비밀번호를 설정해주세요.
                </p>
              </div>

              <Button
                onClick={() => setStep('reset')}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-semibold"
              >
                다음 단계로 진행
              </Button>

              <button
                onClick={() => {
                  setStep('email');
                  setEmail('');
                  setResetToken('');
                }}
                className="w-full text-slate-600 hover:text-slate-900 font-semibold py-2 transition-colors"
              >
                다른 이메일 사용
              </button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: 새 비밀번호 입력 */}
        {step === 'reset' && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">새 비밀번호 설정</CardTitle>
              <CardDescription>
                새로운 비밀번호를 입력해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generalError && (
                <ErrorAlert
                  title="오류"
                  message={generalError}
                  level="error"
                />
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  새 비밀번호
                </label>
                <Input
                  type="password"
                  placeholder="최소 8자 이상"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError('');
                  }}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  비밀번호 확인
                </label>
                <Input
                  type="password"
                  placeholder="비밀번호를 다시 입력해주세요"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError('');
                  }}
                  disabled={loading}
                />
              </div>

              <FieldError message={passwordError} />

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 space-y-1">
                <p className="font-semibold">비밀번호 요구사항:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>최소 8자 이상</li>
                  <li>대문자, 소문자, 숫자 포함 권장</li>
                </ul>
              </div>

              <Button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    변경 중...
                  </>
                ) : (
                  '비밀번호 변경'
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: 완료 */}
        {step === 'reset' && !loading && (
          <Card className="shadow-lg mt-4 bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-full">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900">완료!</h3>
                  <p className="text-sm text-green-700 mt-1">
                    비밀번호가 성공적으로 변경되었습니다.
                  </p>
                </div>
                <p className="text-xs text-green-600">
                  로그인 페이지로 이동합니다...
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
