import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, AlertCircle, QrCode } from 'lucide-react';

export default function CertificateVerification() {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    // 시뮬레이션
    setTimeout(() => {
      setVerificationResult({
        isValid: true,
        certificateNumber,
        certificationName: '기초 양자요법 자격증',
        issueDate: new Date().toLocaleDateString('ko-KR'),
        status: 'active',
        holder: '김민지',
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(certificateNumber)}`
      });
      setIsVerifying(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">자격증 검증</h1>

        <Card className="p-8 bg-slate-800 border-slate-700 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <QrCode className="w-8 h-8 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">자격증 번호 입력</h2>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="자격증 번호를 입력하세요 (예: CERT-2026-001)"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
            <Button
              onClick={handleVerify}
              disabled={!certificateNumber || isVerifying}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            >
              {isVerifying ? '검증 중...' : '검증하기'}
            </Button>
          </div>
        </Card>

        {verificationResult && (
          <Card className={`p-8 ${verificationResult.isValid ? 'bg-green-900/20 border-green-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
            <div className="flex items-center gap-4 mb-6">
              {verificationResult.isValid ? (
                <CheckCircle className="w-8 h-8 text-green-400" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-400" />
              )}
              <h3 className={`text-2xl font-bold ${verificationResult.isValid ? 'text-green-400' : 'text-red-400'}`}>
                {verificationResult.isValid ? '유효한 자격증입니다' : '유효하지 않은 자격증입니다'}
              </h3>
            </div>

            {verificationResult.isValid && (
              <div className="space-y-4">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">자격증 번호</p>
                  <p className="text-white font-bold">{verificationResult.certificateNumber}</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">자격증 명</p>
                  <p className="text-white font-bold">{verificationResult.certificationName}</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">발급일</p>
                  <p className="text-white font-bold">{verificationResult.issueDate}</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">상태</p>
                  <p className="text-green-400 font-bold">유효</p>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm mb-4">QR 코드</p>
                  <img src={verificationResult.qrCodeUrl} alt="QR Code" className="mx-auto" />
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
