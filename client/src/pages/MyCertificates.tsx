import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { Download, Share2, Calendar, Award, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface Certificate {
  id: number;
  certificateNumber: string;
  courseName: string;
  issueDate: Date;
  expiryDate?: Date | null;
  pdfUrl?: string | null;
  status: 'active' | 'revoked' | 'expired';
}

export default function MyCertificates() {
  const [, navigate] = useLocation();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 사용자 수료증 조회
  const { data: certData } = trpc.certificates.getUserCertificates.useQuery();

  useEffect(() => {
    if (certData?.certificates) {
      setCertificates(certData.certificates);
      setIsLoading(false);
    }
  }, [certData]);

  // PDF 다운로드
  const handleDownloadPDF = (pdfUrl: string, certificateNumber: string) => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${certificateNumber}.pdf`;
      link.click();
      toast.success('수료증이 다운로드되었습니다.');
    }
  };

  // SNS 공유 함수
  const handleShare = (certificate: Certificate) => {
    const shareText = `${certificate.courseName} 수료증을 취득했습니다!\n수료증 번호: ${certificate.certificateNumber}`;
    const shareUrl = `${window.location.origin}/verify-certificate?cert=${certificate.certificateNumber}`;

    // 카카오톡 공유
    if ((window as any).Kakao) {
      (window as any).Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: '양자요법 수료증',
          description: shareText,
          imageUrl: 'https://via.placeholder.com/300x300?text=Certificate',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      });
    } else {
      toast.error('카카오톡 공유 기능을 사용할 수 없습니다.');
    }
  };

  // 링크 복사
  const handleCopyLink = (certificate: Certificate) => {
    const shareUrl = `${window.location.origin}/verify-certificate?cert=${certificate.certificateNumber}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('링크가 복사되었습니다.');
  };

  // 페이스북 공유
  const handleShareFacebook = (certificate: Certificate) => {
    const shareUrl = `${window.location.origin}/verify-certificate?cert=${certificate.certificateNumber}`;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      'facebook-share-dialog',
      'width=800,height=600'
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-white mt-4">수료증을 불러오는 중입니다...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">내 수료증</h1>
          <p className="text-gray-300 text-lg">
            취득한 모든 수료증을 확인하고 관리하세요
          </p>
        </div>

        {/* 수료증 목록 */}
        {certificates.length === 0 ? (
          <Card className="p-12 bg-slate-800 border-slate-700 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">수료증이 없습니다</h3>
            <p className="text-gray-400 mb-6">
              과정을 완료하고 결제하면 수료증이 자동으로 발급됩니다.
            </p>
            <Button
              onClick={() => navigate('/academy')}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              강의 보기
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <Card
                key={cert.id}
                className="p-6 bg-slate-800 border-slate-700 hover:border-amber-500/50 transition"
              >
                {/* 헤더 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-amber-500" />
                    <div>
                      <p className="text-xs text-gray-400">수료증</p>
                      <p className="text-sm font-semibold text-amber-400">
                        {cert.status === 'active' ? '유효' : '만료'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 과정명 */}
                <h3 className="text-lg font-bold text-white mb-4 line-clamp-2">
                  {cert.courseName}
                </h3>

                {/* 상세 정보 */}
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>
                      발급: {new Date(cert.issueDate).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">수료증 번호</p>
                    <p className="text-xs font-mono text-amber-400 break-all">
                      {cert.certificateNumber}
                    </p>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="space-y-2">
                  {/* 다운로드 버튼 */}
                  {cert.pdfUrl && (
                    <Button
                      onClick={() => handleDownloadPDF(cert.pdfUrl!, cert.certificateNumber)}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      PDF 다운로드
                    </Button>
                  )}

                  {/* 공유 버튼 */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => handleShare(cert)}
                      variant="outline"
                      className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs"
                      title="카카오톡 공유"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleShareFacebook(cert)}
                      variant="outline"
                      className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs"
                      title="페이스북 공유"
                    >
                      f
                    </Button>
                    <Button
                      onClick={() => handleCopyLink(cert)}
                      variant="outline"
                      className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 text-xs"
                      title="링크 복사"
                    >
                      🔗
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
