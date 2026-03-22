import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Lock, Mail, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export function AdminLogin() {
  const [step, setStep] = useState<'password' | 'mfa'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(5);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: API 호출로 비밀번호 검증
      // const response = await trpc.admin.login.useMutation({
      //   email,
      //   password,
      // });

      // 데모용 로직
      if (email === 'admin@jangbu.com' && password === 'Admin123!') {
        setSuccess('비밀번호 확인 완료. 2단계 인증 코드를 입력해주세요.');
        setStep('mfa');
      } else {
        setRemainingAttempts((prev) => prev - 1);
        setError(
          remainingAttempts > 1
            ? `비밀번호가 올바르지 않습니다. (남은 시도: ${remainingAttempts - 1}회)`
            : '계정이 잠겨있습니다. 15분 후 다시 시도해주세요.'
        );
      }
    } catch (err) {
      setError('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleMFASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: API 호출로 MFA 코드 검증
      if (mfaCode === '123456') {
        setSuccess('2단계 인증 성공! 관리자 대시보드로 이동합니다.');
        // TODO: 리다이렉트 to /admin-dashboard
      } else {
        setError('인증 코드가 올바르지 않습니다.');
      }
    } catch (err) {
      setError('2단계 인증 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-700 shadow-2xl">
        <div className="p-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-[#d4af37]/20 p-3 rounded-lg">
                <Lock className="w-8 h-8 text-[#d4af37]" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">관리자 로그인</h1>
            <p className="text-gray-400 text-sm">
              {step === 'password'
                ? '관리자 계정으로 로그인해주세요'
                : '2단계 인증 코드를 입력해주세요'}
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* 성공 메시지 */}
          {success && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-700 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-300 text-sm">{success}</p>
            </div>
          )}

          {/* 비밀번호 입력 단계 */}
          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* 이메일 입력 */}
              <div>
                <label className="text-sm text-gray-300 mb-2 block">이메일</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type="email"
                    placeholder="admin@jangbu.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-gray-500 disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              {/* 비밀번호 입력 */}
              <div>
                <label className="text-sm text-gray-300 mb-2 block">비밀번호</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="pl-10 pr-10 bg-slate-800 border-slate-600 text-white placeholder-gray-500 disabled:opacity-50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? '숨기기' : '표시'}
                  </button>
                </div>
              </div>

              {/* 남은 시도 횟수 */}
              {remainingAttempts < 5 && (
                <p className="text-xs text-yellow-400">
                  ⚠️ 남은 시도 횟수: {remainingAttempts}회
                </p>
              )}

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                disabled={loading || remainingAttempts === 0}
                className="w-full bg-[#d4af37] hover:bg-[#c9a227] text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? '로그인 중...' : '로그인'}
              </Button>
            </form>
          )}

          {/* 2FA 입력 단계 */}
          {step === 'mfa' && (
            <form onSubmit={handleMFASubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  인증 코드 (6자리)
                </label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.slice(0, 6))}
                  maxLength={6}
                  disabled={loading}
                  className="text-center text-2xl tracking-widest bg-slate-800 border-slate-600 text-white placeholder-gray-500 disabled:opacity-50"
                  required
                />
              </div>

              <p className="text-xs text-gray-400 text-center">
                인증 앱에서 표시된 6자리 코드를 입력해주세요
              </p>

              <Button
                type="submit"
                disabled={loading || mfaCode.length !== 6}
                className="w-full bg-[#d4af37] hover:bg-[#c9a227] text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? '검증 중...' : '인증'}
              </Button>

              <Button
                type="button"
                onClick={() => {
                  setStep('password');
                  setMfaCode('');
                  setSuccess('');
                }}
                variant="outline"
                className="w-full border-slate-600 text-gray-300 hover:bg-slate-800"
              >
                이전 단계로
              </Button>
            </form>
          )}

          {/* 푸터 */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-xs text-gray-500 text-center">
              🔒 이 페이지는 HTTPS로 보호되며, 모든 로그인 시도는 기록됩니다.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
