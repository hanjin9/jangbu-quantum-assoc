import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Download, CheckCircle, AlertCircle, Search, FileText } from 'lucide-react';

export function CertificatePage() {
  const [activeTab, setActiveTab] = useState<'my-certificates' | 'verify'>('my-certificates');
  const [verifyNumber, setVerifyNumber] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const myCertificates = [
    {
      id: 1,
      lectureName: '기초 양자요법 입문',
      instructor: '박준호',
      issuedDate: new Date('2026-01-15'),
      certificateNumber: 'CERT-ABC123',
      pdfUrl: 'https://cdn.example.com/certificates/CERT-ABC123.pdf',
      status: 'valid',
    },
    {
      id: 2,
      lectureName: '고급 에너지 치유법',
      instructor: '이미영',
      issuedDate: new Date('2025-12-20'),
      certificateNumber: 'CERT-DEF456',
      pdfUrl: 'https://cdn.example.com/certificates/CERT-DEF456.pdf',
      status: 'valid',
    },
  ];

  const handleVerify = () => {
    if (verifyNumber && verifyCode) {
      // 검증 로직 (실제로는 API 호출)
      setVerificationResult({
        isValid: true,
        certificateNumber: verifyNumber,
        userName: '김민준',
        lectureName: '기초 양자요법 입문',
        issuedDate: new Date('2026-01-15'),
        validUntil: new Date('2027-01-15'),
        status: 'valid',
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 제목 */}
        <h1 className="text-3xl font-bold mb-8 text-white">협회 인증서</h1>

        {/* 탭 */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('my-certificates')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'my-certificates'
                ? 'text-[#d4af37] border-b-2 border-[#d4af37]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            내 인증서
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'verify'
                ? 'text-[#d4af37] border-b-2 border-[#d4af37]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            인증서 검증
          </button>
        </div>

        {/* 내 인증서 탭 */}
        {activeTab === 'my-certificates' && (
          <div className="space-y-6">
            <p className="text-gray-300">
              수료한 강의의 인증서를 다운로드하고 관리할 수 있습니다.
            </p>

            {myCertificates.length > 0 ? (
              <div className="space-y-4">
                {myCertificates.map((cert) => (
                  <Card key={cert.id} className="bg-slate-900 border-slate-700 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <FileText className="w-5 h-5 text-[#d4af37]" />
                          <h3 className="text-lg font-semibold text-white">
                            {cert.lectureName}
                          </h3>
                          <span className="ml-auto">
                            {cert.status === 'valid' && (
                              <span className="flex items-center gap-1 text-green-400 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                유효
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-400">
                          <p>강사: {cert.instructor}</p>
                          <p>발급일: {formatDate(cert.issuedDate)}</p>
                          <p>인증번호: {cert.certificateNumber}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button className="bg-[#d4af37] hover:bg-[#c9a227] text-black font-semibold flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          다운로드
                        </Button>
                        <Button
                          variant="outline"
                          className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-800"
                        >
                          공유
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-900 border-slate-700 p-12 text-center">
                <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">아직 발급된 인증서가 없습니다.</p>
                <p className="text-sm text-gray-500 mt-2">강의를 수료하면 인증서를 받을 수 있습니다.</p>
              </Card>
            )}
          </div>
        )}

        {/* 인증서 검증 탭 */}
        {activeTab === 'verify' && (
          <div className="space-y-6">
            <p className="text-gray-300">
              인증번호와 검증코드를 입력하여 인증서의 유효성을 확인할 수 있습니다.
            </p>

            {/* 검증 입력 폼 */}
            <Card className="bg-slate-900 border-slate-700 p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">인증번호</label>
                <Input
                  placeholder="예: CERT-ABC123"
                  value={verifyNumber}
                  onChange={(e) => setVerifyNumber(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">검증코드</label>
                <Input
                  placeholder="예: ABC12345"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder-gray-500"
                />
              </div>

              <Button
                onClick={handleVerify}
                className="w-full bg-[#d4af37] hover:bg-[#c9a227] text-black font-semibold flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                검증하기
              </Button>
            </Card>

            {/* 검증 결과 */}
            {verificationResult && (
              <Card
                className={`p-6 border ${
                  verificationResult.status === 'valid'
                    ? 'bg-green-900/20 border-green-700'
                    : 'bg-red-900/20 border-red-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  {verificationResult.status === 'valid' ? (
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  )}

                  <div className="flex-1">
                    <h3 className={`font-semibold mb-3 ${
                      verificationResult.status === 'valid'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {verificationResult.status === 'valid'
                        ? '유효한 인증서입니다'
                        : '유효하지 않은 인증서입니다'}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-300">
                      <p>수강자: {verificationResult.userName}</p>
                      <p>강의명: {verificationResult.lectureName}</p>
                      <p>발급일: {formatDate(verificationResult.issuedDate)}</p>
                      {verificationResult.validUntil && (
                        <p>유효기간: {formatDate(verificationResult.validUntil)}까지</p>
                      )}
                      <p>인증번호: {verificationResult.certificateNumber}</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* 검증 정보 */}
            <Card className="bg-slate-900 border-slate-700 p-6">
              <h3 className="font-semibold text-white mb-4">인증서 검증 정보</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  • 인증번호는 인증서 하단에 표시되어 있습니다.
                </p>
                <p>
                  • 검증코드는 인증서 발급 시 이메일로 전송됩니다.
                </p>
                <p>
                  • 인증서의 유효기간은 발급일로부터 1년입니다.
                </p>
                <p>
                  • 위조된 인증서 검증 시도는 기록됩니다.
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
