import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, CheckCircle2, Loader2, AlertCircle, FileText } from 'lucide-react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';

interface Certificate {
  id: string;
  courseName: string;
  studentName: string;
  completionDate: string;
  certificateNumber: string;
  score: number;
  instructor: string;
}

export default function CertificateGenerator() {
  const [, navigate] = useLocation();
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: '1',
      courseName: '양자요법 기초',
      studentName: '홍길동',
      completionDate: '2026-04-22',
      certificateNumber: 'CERT-001-2026-001',
      score: 85,
      instructor: '한진 대표',
    },
    {
      id: '2',
      courseName: '에너지 진단법',
      studentName: '홍길동',
      completionDate: '2026-04-22',
      certificateNumber: 'CERT-002-2026-001',
      score: 92,
      instructor: '한진 대표',
    },
  ]);
  const [loading, setLoading] = useState<string | null>(null);

  // PDF 생성 및 다운로드
  const handleDownloadCertificate = async (cert: Certificate) => {
    setLoading(cert.id);
    try {
      // 간단한 PDF 생성 (실제로는 라이브러리 사용)
      const pdfContent = generatePDF(cert);
      
      // Blob 생성
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = url;
      link.download = `${cert.certificateNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('수료증이 다운로드되었습니다.');
    } catch (err) {
      toast.error('수료증 생성에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  // 간단한 PDF 생성 함수 (실제로는 더 복잡한 라이브러리 사용)
  const generatePDF = (cert: Certificate): string => {
    const date = new Date(cert.completionDate);
    const formattedDate = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // HTML 형식의 PDF 콘텐츠 (실제로는 PDF 라이브러리 사용)
    return `
      %PDF-1.4
      1 0 obj
      << /Type /Catalog /Pages 2 0 R >>
      endobj
      2 0 obj
      << /Type /Pages /Kids [3 0 R] /Count 1 >>
      endobj
      3 0 obj
      << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
      endobj
      4 0 obj
      << /Length 1000 >>
      stream
      BT
      /F1 24 Tf
      150 700 Td
      (수료증) Tj
      0 -50 Td
      /F1 14 Tf
      (과정명: ${cert.courseName}) Tj
      0 -30 Td
      (학생명: ${cert.studentName}) Tj
      0 -30 Td
      (수료일: ${formattedDate}) Tj
      0 -30 Td
      (점수: ${cert.score}점) Tj
      0 -30 Td
      (수료증번호: ${cert.certificateNumber}) Tj
      0 -30 Td
      (강사: ${cert.instructor}) Tj
      ET
      endstream
      endobj
      5 0 obj
      << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
      endobj
      xref
      0 6
      0000000000 65535 f 
      0000000009 00000 n 
      0000000058 00000 n 
      0000000115 00000 n 
      0000000214 00000 n 
      0000001264 00000 n 
      trailer
      << /Size 6 /Root 1 0 R >>
      startxref
      1343
      %%EOF
    `;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-4">수료증 관리</h1>
        <p className="text-gray-400 mb-12">완료한 과정의 수료증을 다운로드하세요</p>

        {certificates.length > 0 ? (
          <div className="space-y-6">
            {certificates.map((cert) => (
              <Card key={cert.id} className="bg-slate-800 border-amber-500/20 overflow-hidden hover:border-amber-500/40 transition">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    {/* 수료증 정보 */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-amber-400" />
                        <h3 className="text-xl font-bold text-white">{cert.courseName}</h3>
                        <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-300 text-xs font-semibold">
                          ✓ 수료
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">학생명</p>
                          <p className="text-white font-semibold">{cert.studentName}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">수료일</p>
                          <p className="text-white font-semibold">{new Date(cert.completionDate).toLocaleDateString('ko-KR')}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">점수</p>
                          <p className="text-amber-400 font-bold text-lg">{cert.score}점</p>
                        </div>
                        <div>
                          <p className="text-gray-400">수료증번호</p>
                          <p className="text-white font-mono text-xs">{cert.certificateNumber}</p>
                        </div>
                      </div>
                    </div>

                    {/* 다운로드 버튼 */}
                    <div className="flex-shrink-0">
                      <Button
                        onClick={() => handleDownloadCertificate(cert)}
                        disabled={loading === cert.id}
                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition font-semibold flex items-center gap-2 disabled:opacity-50"
                      >
                        {loading === cert.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            생성 중...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            다운로드
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800 border-amber-500/20">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">아직 수료한 과정이 없습니다.</p>
              <Button
                onClick={() => navigate('/academy')}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition font-semibold"
              >
                교육 과정 보기
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 수료증 미리보기 */}
        <Card className="mt-12 bg-slate-800 border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-white">수료증 샘플</CardTitle>
            <CardDescription className="text-gray-400">다운로드되는 수료증의 형식입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-12 rounded-lg border-4 border-amber-900 text-center space-y-6">
              <h2 className="text-4xl font-bold text-amber-900">수 료 증</h2>
              <div className="space-y-4 text-amber-900">
                <p className="text-lg">
                  <span className="font-semibold">과정명:</span> 양자요법 기초
                </p>
                <p className="text-lg">
                  <span className="font-semibold">학생명:</span> 홍길동
                </p>
                <p className="text-lg">
                  <span className="font-semibold">수료일:</span> 2026년 4월 22일
                </p>
                <p className="text-lg">
                  <span className="font-semibold">점수:</span> 85점
                </p>
              </div>
              <div className="border-t-2 border-amber-900 pt-6">
                <p className="text-sm text-amber-800">수료증번호: CERT-001-2026-001</p>
                <p className="text-sm text-amber-800">발급기관: 장•부 양자요법 관리사 협회</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
