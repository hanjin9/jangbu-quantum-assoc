import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, Upload, FileCheck, AlertCircle } from 'lucide-react';

type SignupStep = 'email' | 'verification' | 'profile' | 'certification' | 'complete';

export default function SignupProcess() {
  const [currentStep, setCurrentStep] = useState<SignupStep>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [certificationFile, setCertificationFile] = useState<File | null>(null);
  const [certificationNumber, setCertificationNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async () => {
    setIsLoading(true);
    // 이메일 인증 코드 발송
    setTimeout(() => {
      setCurrentStep('verification');
      setIsLoading(false);
    }, 1000);
  };

  const handleVerificationSubmit = async () => {
    setIsLoading(true);
    // 인증 코드 검증
    setTimeout(() => {
      setCurrentStep('profile');
      setIsLoading(false);
    }, 1000);
  };

  const handleProfileSubmit = async () => {
    setIsLoading(true);
    // 프로필 정보 저장
    setTimeout(() => {
      setCurrentStep('certification');
      setIsLoading(false);
    }, 1000);
  };

  const handleCertificationSubmit = async () => {
    setIsLoading(true);
    // 자격증 검증
    setTimeout(() => {
      setCurrentStep('complete');
      setIsLoading(false);
    }, 1000);
  };

  const steps = [
    { id: 'email', label: '이메일 입력', icon: Mail },
    { id: 'verification', label: '이메일 인증', icon: CheckCircle },
    { id: 'profile', label: '프로필 설정', icon: Upload },
    { id: 'certification', label: '자격증 검증', icon: FileCheck },
    { id: 'complete', label: '완료', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > idx;
              
              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                    isActive ? 'bg-yellow-400 text-slate-900' :
                    isCompleted ? 'bg-green-500 text-white' :
                    'bg-slate-700 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs text-center ${isActive ? 'text-yellow-400 font-semibold' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
              style={{ width: `${(steps.findIndex(s => s.id === currentStep) + 1) / steps.length * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-slate-800 border-yellow-400/20">
          <CardHeader>
            <CardTitle className="text-yellow-400">회원 가입</CardTitle>
            <CardDescription className="text-gray-300">
              {currentStep === 'email' && '이메일 주소를 입력하세요'}
              {currentStep === 'verification' && '이메일로 받은 인증 코드를 입력하세요'}
              {currentStep === 'profile' && '프로필 정보를 입력하세요'}
              {currentStep === 'certification' && '자격증을 업로드하세요'}
              {currentStep === 'complete' && '회원 가입이 완료되었습니다'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Step */}
            {currentStep === 'email' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">이메일</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button
                  onClick={handleEmailSubmit}
                  disabled={!email || isLoading}
                  className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500"
                >
                  {isLoading ? '발송 중...' : '인증 코드 발송'}
                </Button>
              </div>
            )}

            {/* Verification Step */}
            {currentStep === 'verification' && (
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-300">{email}로 인증 코드를 발송했습니다</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">인증 코드</label>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button
                  onClick={handleVerificationSubmit}
                  disabled={!verificationCode || isLoading}
                  className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500"
                >
                  {isLoading ? '검증 중...' : '인증 완료'}
                </Button>
              </div>
            )}

            {/* Profile Step */}
            {currentStep === 'profile' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">이름</label>
                  <Input
                    type="text"
                    placeholder="홍길동"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">프로필 사진</label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-yellow-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">
                      {profileImage ? profileImage.name : '사진을 클릭하여 업로드하세요'}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleProfileSubmit}
                  disabled={!profileName || isLoading}
                  className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500"
                >
                  {isLoading ? '저장 중...' : '다음 단계'}
                </Button>
              </div>
            )}

            {/* Certification Step */}
            {currentStep === 'certification' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">자격증 번호</label>
                  <Input
                    type="text"
                    placeholder="예: JBRMA-2024-001"
                    value={certificationNumber}
                    onChange={(e) => setCertificationNumber(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">자격증 파일</label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-yellow-400 transition-colors">
                    <FileCheck className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">
                      {certificationFile ? certificationFile.name : 'PDF 또는 이미지 파일을 업로드하세요'}
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setCertificationFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCertificationSubmit}
                  disabled={!certificationNumber || !certificationFile || isLoading}
                  className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500"
                >
                  {isLoading ? '검증 중...' : '자격증 검증'}
                </Button>
              </div>
            )}

            {/* Complete Step */}
            {currentStep === 'complete' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">회원 가입 완료!</h3>
                  <p className="text-gray-400 text-sm">
                    환영합니다, {profileName}님! 이제 모든 서비스를 이용할 수 있습니다.
                  </p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">이메일</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300">{email}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">자격증</span>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">검증 대기 중</Badge>
                  </div>
                </div>
                <Button className="w-full bg-yellow-400 text-slate-900 hover:bg-yellow-500">
                  대시보드로 이동
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
