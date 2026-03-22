/**
 * 협회 인증서 시스템
 * - PDF 자동 생성
 * - 온라인 검증
 * - 인증서 관리
 */

import * as fs from 'fs';
import * as path from 'path';

export interface Certificate {
  id: number;
  userId: number;
  lectureId: number;
  certificateNumber: string;
  certificateName: string;
  issuedDate: Date;
  validUntil?: Date;
  pdfUrl: string;
  verificationCode: string;
  status: 'issued' | 'revoked' | 'expired';
}

export interface CertificateVerification {
  isValid: boolean;
  certificateNumber: string;
  userName: string;
  lectureName: string;
  issuedDate: Date;
  validUntil?: Date;
  status: 'valid' | 'revoked' | 'expired' | 'invalid';
}

/**
 * 인증서 생성 및 PDF 자동 생성
 */
export async function generateCertificate(
  userId: number,
  lectureId: number,
  userName: string,
  lectureName: string,
  instructorName: string,
  completionDate: Date
): Promise<Certificate> {
  console.log(`[Certificate] Generating certificate for user ${userId}, lecture ${lectureId}`);

  // 1. 인증서 번호 생성
  const certificateNumber = generateCertificateNumber(userId, lectureId);
  const verificationCode = generateVerificationCode();

  // 2. PDF 생성
  const pdfPath = await generateCertificatePDF(
    certificateNumber,
    userName,
    lectureName,
    instructorName,
    completionDate,
    verificationCode
  );

  // 3. PDF를 S3에 업로드
  const pdfUrl = await uploadCertificatePDF(pdfPath, certificateNumber);

  // 4. 인증서 정보 DB에 저장
  const certificate: Certificate = {
    id: Math.floor(Math.random() * 10000),
    userId,
    lectureId,
    certificateNumber,
    certificateName: `${userName}_${lectureName}_수료증`,
    issuedDate: new Date(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1년 유효
    pdfUrl,
    verificationCode,
    status: 'issued',
  };

  // DB에 저장
  // INSERT INTO certificates (...) VALUES (...)

  // 5. 사용자에게 이메일 발송
  await sendCertificateEmail(userId, certificate);

  // 6. 협회장에게 알림
  await notifyOwnerOfCertificateIssuance(certificate);

  console.log(`[Certificate] Certificate ${certificateNumber} generated successfully`);

  return certificate;
}

/**
 * 인증서 번호 생성
 */
function generateCertificateNumber(userId: number, lectureId: number): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const userPart = userId.toString(36).toUpperCase().padStart(4, '0');
  const lecturePart = lectureId.toString(36).toUpperCase().padStart(4, '0');

  return `CERT-${timestamp}-${userPart}-${lecturePart}`;
}

/**
 * 검증 코드 생성
 */
function generateVerificationCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

/**
 * PDF 인증서 생성
 */
async function generateCertificatePDF(
  certificateNumber: string,
  userName: string,
  lectureName: string,
  instructorName: string,
  completionDate: Date,
  verificationCode: string
): Promise<string> {
  console.log(`[Certificate] Generating PDF for certificate ${certificateNumber}`);

  // 실제 구현에서는 PDF 라이브러리 사용 (예: pdfkit, reportlab)
  // const doc = new PDFDocument()
  // doc.fontSize(24).text('수료증', 100, 100)
  // doc.fontSize(14).text(`수강자: ${userName}`, 100, 150)
  // doc.fontSize(14).text(`강의명: ${lectureName}`, 100, 180)
  // doc.fontSize(14).text(`강사: ${instructorName}`, 100, 210)
  // doc.fontSize(14).text(`수료일: ${completionDate.toLocaleDateString('ko-KR')}`, 100, 240)
  // doc.fontSize(10).text(`인증번호: ${certificateNumber}`, 100, 300)
  // doc.fontSize(10).text(`검증코드: ${verificationCode}`, 100, 320)

  const pdfPath = path.join('/tmp', `${certificateNumber}.pdf`);

  // 임시 파일 생성 (실제 구현에서는 PDF 라이브러리 사용)
  fs.writeFileSync(pdfPath, 'PDF Certificate Content');

  return pdfPath;
}

/**
 * PDF를 S3에 업로드
 */
async function uploadCertificatePDF(pdfPath: string, certificateNumber: string): Promise<string> {
  console.log(`[Certificate] Uploading certificate PDF to S3`);

  // 실제 구현에서는 S3에 업로드
  // const fileContent = fs.readFileSync(pdfPath)
  // const s3Url = await storagePut(`certificates/${certificateNumber}.pdf`, fileContent, 'application/pdf')

  const s3Url = `https://cdn.example.com/certificates/${certificateNumber}.pdf`;

  // 임시 파일 삭제
  fs.unlinkSync(pdfPath);

  return s3Url;
}

/**
 * 인증서 이메일 발송
 */
async function sendCertificateEmail(userId: number, certificate: Certificate): Promise<void> {
  console.log(`[Certificate] Sending certificate email to user ${userId}`);

  // 이메일 발송 로직
  // await sendEmail({
  //   type: 'certificate_issued',
  //   recipientEmail: user.email,
  //   recipientName: user.name,
  //   data: {
  //     certificateNumber: certificate.certificateNumber,
  //     lectureName: certificate.certificateName,
  //     pdfUrl: certificate.pdfUrl,
  //     verificationUrl: `https://example.com/verify/${certificate.verificationCode}`
  //   }
  // })
}

/**
 * 협회장에게 인증서 발급 알림
 */
async function notifyOwnerOfCertificateIssuance(certificate: Certificate): Promise<void> {
  console.log('[Certificate] Notifying owner of certificate issuance');

  // 협회장 알림 로직
  // await notifyOwner({
  //   title: '인증서 발급',
  //   content: `${certificate.certificateName} 인증서가 발급되었습니다.`
  // })
}

/**
 * 인증서 검증
 */
export async function verifyCertificate(
  certificateNumber: string,
  verificationCode: string
): Promise<CertificateVerification> {
  console.log(`[Certificate] Verifying certificate ${certificateNumber}`);

  // 1. DB에서 인증서 조회
  const certificate = await getCertificateByNumber(certificateNumber);

  if (!certificate) {
    return {
      isValid: false,
      certificateNumber,
      userName: '',
      lectureName: '',
      issuedDate: new Date(),
      status: 'invalid',
    };
  }

  // 2. 검증 코드 확인
  if (certificate.verificationCode !== verificationCode) {
    return {
      isValid: false,
      certificateNumber,
      userName: '',
      lectureName: '',
      issuedDate: certificate.issuedDate,
      status: 'invalid',
    };
  }

  // 3. 상태 확인
  let status: 'valid' | 'revoked' | 'expired' | 'invalid' = 'valid';

  if (certificate.status === 'revoked') {
    status = 'revoked';
  } else if (certificate.validUntil && certificate.validUntil < new Date()) {
    status = 'expired';
  }

  // 4. 사용자 및 강의 정보 조회
  const user = await getUserInfo(certificate.userId);
  const lecture = await getLectureInfo(certificate.lectureId);

  return {
    isValid: status === 'valid',
    certificateNumber,
    userName: user?.name || '',
    lectureName: lecture?.title || '',
    issuedDate: certificate.issuedDate,
    validUntil: certificate.validUntil,
    status,
  };
}

/**
 * 인증서 번호로 조회
 */
async function getCertificateByNumber(certificateNumber: string): Promise<Certificate | null> {
  console.log(`[Certificate] Fetching certificate ${certificateNumber}`);

  // 실제 구현에서는 DB에서 조회
  // SELECT * FROM certificates WHERE certificateNumber = certificateNumber

  return {
    id: 1,
    userId: 1,
    lectureId: 1,
    certificateNumber,
    certificateName: '김민준_기초 양자요법 입문_수료증',
    issuedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    validUntil: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
    pdfUrl: 'https://cdn.example.com/certificates/CERT-ABC123.pdf',
    verificationCode: 'ABC12345',
    status: 'issued',
  };
}

/**
 * 사용자 정보 조회
 */
async function getUserInfo(userId: number): Promise<{ name: string } | null> {
  console.log(`[Certificate] Fetching user info for user ${userId}`);

  // 실제 구현에서는 DB에서 조회
  return { name: '김민준' };
}

/**
 * 강의 정보 조회
 */
async function getLectureInfo(lectureId: number): Promise<{ title: string } | null> {
  console.log(`[Certificate] Fetching lecture info for lecture ${lectureId}`);

  // 실제 구현에서는 DB에서 조회
  return { title: '기초 양자요법 입문' };
}

/**
 * 사용자의 모든 인증서 조회
 */
export async function getUserCertificates(userId: number): Promise<Certificate[]> {
  console.log(`[Certificate] Fetching certificates for user ${userId}`);

  // 실제 구현에서는 DB에서 조회
  // SELECT * FROM certificates WHERE userId = userId ORDER BY issuedDate DESC

  return [
    {
      id: 1,
      userId,
      lectureId: 1,
      certificateNumber: 'CERT-ABC123',
      certificateName: '기초 양자요법 입문 수료증',
      issuedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      validUntil: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
      pdfUrl: 'https://cdn.example.com/certificates/CERT-ABC123.pdf',
      verificationCode: 'ABC12345',
      status: 'issued',
    },
    {
      id: 2,
      userId,
      lectureId: 2,
      certificateNumber: 'CERT-DEF456',
      certificateName: '고급 에너지 치유법 수료증',
      issuedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      validUntil: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000),
      pdfUrl: 'https://cdn.example.com/certificates/CERT-DEF456.pdf',
      verificationCode: 'DEF67890',
      status: 'issued',
    },
  ];
}

/**
 * 인증서 취소
 */
export async function revokeCertificate(certificateNumber: string, reason: string): Promise<void> {
  console.log(`[Certificate] Revoking certificate ${certificateNumber}`);

  // 1. DB 업데이트
  // UPDATE certificates SET status = 'revoked' WHERE certificateNumber = certificateNumber

  // 2. 사용자에게 알림
  // await sendEmail({
  //   type: 'certificate_revoked',
  //   content: `인증서 ${certificateNumber}가 취소되었습니다. 사유: ${reason}`
  // })

  // 3. 협회장에게 알림
  // await notifyOwner({
  //   title: '인증서 취소',
  //   content: `인증서 ${certificateNumber}가 취소되었습니다.`
  // })

  console.log(`[Certificate] Certificate ${certificateNumber} revoked`);
}

/**
 * 인증서 통계
 */
export async function getCertificateStats(): Promise<{
  totalIssued: number;
  totalVerified: number;
  activeCount: number;
  revokedCount: number;
  expiredCount: number;
}> {
  console.log('[Certificate] Fetching certificate statistics');

  // 실제 구현에서는 DB에서 조회
  // SELECT
  //   COUNT(*) as totalIssued,
  //   SUM(CASE WHEN status = 'issued' THEN 1 ELSE 0 END) as activeCount,
  //   SUM(CASE WHEN status = 'revoked' THEN 1 ELSE 0 END) as revokedCount,
  //   SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expiredCount
  // FROM certificates

  return {
    totalIssued: 156,
    totalVerified: 142,
    activeCount: 148,
    revokedCount: 5,
    expiredCount: 3,
  };
}
