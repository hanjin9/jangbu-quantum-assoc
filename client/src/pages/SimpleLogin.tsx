import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';

export default function SimpleLogin() {
  const [, navigate] = useLocation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendPhoneVerification = trpc.socialAuth.sendPhoneVerification.useMutation();
  const phoneLogin = trpc.socialAuth.phoneLogin.useMutation();
  const kakaoLogin = trpc.socialAuth.kakaoLogin.useMutation();
  const naverLogin = trpc.socialAuth.naverLogin.useMutation();

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      toast.error('휴대폰 번호를 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      const result = await sendPhoneVerification.mutateAsync({
        phoneNumber: phoneNumber.replace(/[^0-9]/g, '')
      });
      setVerificationId(result.verificationId);
      setShowVerification(true);
      toast.success(result.message);
    } catch (error) {
      toast.error('인증번호 발송 실패');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerification = async () => {
    if (!verificationCode.trim()) {
      toast.error('인증번호를 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      const result = await phoneLogin.mutateAsync({
        phoneNumber: phoneNumber.replace(/[^0-9]/g, ''),
        verificationCode
      });
      toast.success(result.message);
      localStorage.setItem('authToken', result.token);
      navigate('/dashboard');
    } catch (error) {
      toast.error('로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const result = await kakaoLogin.mutateAsync({
        kakaoCode: 'test_kakao_code'
      });
      toast.success(result.message);
      localStorage.setItem('authToken', result.token);
      navigate('/dashboard');
    } catch (error) {
      toast.error('카카오 로그인 실패');
    }
  };

  const handleNaverLogin = async () => {
    try {
      const result = await naverLogin.mutateAsync({
        naverCode: 'test_naver_code'
      });
      toast.success(result.message);
      localStorage.setItem('authToken', result.token);
      navigate('/dashboard');
    } catch (error) {
      toast.error('네이버 로그인 실패');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-amber-500/30">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-amber-400">장•부 관리사협회</CardTitle>
          <CardDescription className="text-slate-300">간편 로그인</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 카카오 로그인 */}
          <Button
            onClick={handleKakaoLogin}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold h-12 rounded-lg transition-all"
          >
            <span className="text-lg mr-2">☀️</span>
            카카오로 로그인
          </Button>

          {/* 네이버 로그인 */}
          <Button
            onClick={handleNaverLogin}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-12 rounded-lg transition-all"
          >
            <span className="text-lg mr-2">🟢</span>
            네이버로 로그인
          </Button>

          {/* 구분선 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">또는</span>
            </div>
          </div>

          {/* 휴대폰 로그인 */}
          <div className="space-y-3">
            <Label htmlFor="phone" className="text-slate-200">
              휴대폰 번호
            </Label>
            <div className="flex gap-2">
              <Input
                id="phone"
                type="tel"
                placeholder="010-1234-5678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={loading}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
              <Button
                onClick={handlePhoneSubmit}
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6"
              >
                인증
              </Button>
            </div>
          </div>

          {/* 인증번호 입력 다이얼로그 */}
          <Dialog open={showVerification} onOpenChange={setShowVerification}>
            <DialogContent className="bg-slate-800 border-amber-500/30">
              <DialogHeader>
                <DialogTitle className="text-amber-400">인증번호 입력</DialogTitle>
                <DialogDescription className="text-slate-300">
                  {phoneNumber}로 발송된 인증번호를 입력해주세요
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="6자리 인증번호"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                  maxLength={6}
                  disabled={loading}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-slate-400 text-center">테스트: 123456</p>
                <Button
                  onClick={handlePhoneVerification}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                >
                  {loading ? '확인 중...' : '로그인'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* 안내 텍스트 */}
          <p className="text-xs text-slate-400 text-center">
            고령층 친화적 디자인으로 간단하게 로그인하세요
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
