/**
 * Certificate Service
 * Handles automatic certificate generation, PDF creation, and verification
 */

import { getDb } from "./db";
import { storagePut } from "./storage";
import { certificates, InsertCertificate, Certificate } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";

/**
 * Generate a unique certificate number
 * Format: CERT-YYYY-MM-DD-XXXXX
 */
export function generateCertificateNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `CERT-${year}-${month}-${day}-${random}`;
}

/**
 * Generate a unique verification code for certificate validation
 */
export function generateVerificationCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase() +
    Math.random().toString(36).substring(2, 10).toUpperCase();
}

/**
 * Generate PDF certificate content as HTML
 */
export function generateCertificatePdfHtml(
  userName: string,
  courseName: string,
  certificateNumber: string,
  issueDate: Date,
  verificationCode: string
): string {
  const formattedDate = issueDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>수료증 - ${courseName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5;
            padding: 20px;
        }
        .certificate-container {
            max-width: 900px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 3px solid #d4af37;
            padding: 60px 80px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
        }
        .certificate-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="%23d4af37" stroke-width="0.5" opacity="0.1"/></svg>');
            pointer-events: none;
        }
        .certificate-content {
            position: relative;
            z-index: 1;
        }
        .header {
            margin-bottom: 40px;
        }
        .organization-name {
            font-size: 28px;
            font-weight: 700;
            color: #d4af37;
            margin-bottom: 10px;
            letter-spacing: 2px;
        }
        .certificate-title {
            font-size: 36px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 30px;
            letter-spacing: 1px;
        }
        .certificate-body {
            margin: 40px 0;
            line-height: 1.8;
        }
        .body-text {
            font-size: 16px;
            color: #e0e0e0;
            margin-bottom: 20px;
        }
        .recipient-name {
            font-size: 32px;
            font-weight: 700;
            color: #d4af37;
            margin: 30px 0;
            text-decoration: underline;
            text-decoration-color: #d4af37;
            text-decoration-thickness: 2px;
            text-underline-offset: 8px;
        }
        .course-name {
            font-size: 20px;
            color: #ffffff;
            margin: 20px 0;
            font-weight: 600;
        }
        .certificate-details {
            display: flex;
            justify-content: space-around;
            margin: 50px 0;
            padding: 30px 0;
            border-top: 1px solid #d4af37;
            border-bottom: 1px solid #d4af37;
        }
        .detail-item {
            flex: 1;
        }
        .detail-label {
            font-size: 12px;
            color: #a0a0a0;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }
        .detail-value {
            font-size: 14px;
            color: #d4af37;
            font-weight: 600;
            font-family: 'Courier New', monospace;
        }
        .footer-text {
            font-size: 14px;
            color: #a0a0a0;
            margin-top: 40px;
            font-style: italic;
        }
        .verification-section {
            margin-top: 40px;
            padding: 20px;
            border: 1px solid #d4af37;
            background: rgba(212, 175, 55, 0.05);
        }
        .verification-label {
            font-size: 12px;
            color: #a0a0a0;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }
        .verification-code {
            font-size: 16px;
            color: #d4af37;
            font-weight: 600;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
        }
        .seal {
            margin-top: 40px;
            font-size: 48px;
            color: #d4af37;
            opacity: 0.3;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .certificate-container {
                box-shadow: none;
                max-width: 100%;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="certificate-content">
            <div class="header">
                <div class="organization-name">장•부 양자요법 관리사 협회</div>
                <div class="certificate-title">수료증</div>
            </div>
            
            <div class="certificate-body">
                <p class="body-text">
                    이 증서는 다음 사람이 본 협회의 교육 프로그램을 성공적으로 이수하였음을 인증합니다.
                </p>
                
                <div class="recipient-name">${userName}</div>
                
                <p class="body-text">
                    다음 과정을 완료하였습니다:
                </p>
                
                <div class="course-name">${courseName}</div>
                
                <div class="certificate-details">
                    <div class="detail-item">
                        <div class="detail-label">발급일</div>
                        <div class="detail-value">${formattedDate}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">수료증 번호</div>
                        <div class="detail-value">${certificateNumber}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">협회 인증</div>
                        <div class="detail-value">공식 인증</div>
                    </div>
                </div>
                
                <p class="footer-text">
                    본 수료증은 해당 교육 프로그램의 완료를 증명하며, 협회의 공식 인증입니다.
                </p>
                
                <div class="verification-section">
                    <div class="verification-label">검증 코드</div>
                    <div class="verification-code">${verificationCode}</div>
                    <p class="body-text" style="margin-top: 10px; font-size: 12px;">
                        이 코드를 사용하여 협회 웹사이트에서 수료증을 검증할 수 있습니다.
                    </p>
                </div>
                
                <div class="seal">★</div>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}

/**
 * Create a certificate record in the database
 */
export async function createCertificate(
  userId: number,
  courseId: string,
  courseName: string,
  orderId?: number
): Promise<Certificate> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database connection not available");
  }

  const certificateNumber = generateCertificateNumber();
  const verificationCode = generateVerificationCode();

  const newCertificate: InsertCertificate = {
    userId,
    orderId: orderId || null,
    courseId,
    courseName,
    certificateNumber,
    verificationCode,
    status: "active",
  };

  const result = await db
    .insert(certificates)
    .values(newCertificate)
    .$returningId();

  // Fetch the created certificate
  const created = await db
    .select()
    .from(certificates)
    .where(eq(certificates.id, result[0].id))
    .limit(1);

  if (!created.length) {
    throw new Error("Failed to create certificate");
  }

  return created[0];
}

/**
 * Generate and upload certificate PDF
 */
export async function generateCertificatePdf(
  certificate: Certificate,
  userName: string
): Promise<string> {
  // Generate HTML content
  const htmlContent = generateCertificatePdfHtml(
    userName,
    certificate.courseName,
    certificate.certificateNumber,
    new Date(certificate.issueDate),
    certificate.verificationCode
  );

  // Convert HTML to PDF using a simple approach
  // For production, consider using a library like puppeteer or pdfkit
  const pdfFileName = `certificates/${certificate.userId}/${certificate.certificateNumber}.pdf`;

  // For now, we'll store the HTML as a PDF-like document
  // In production, you'd use a proper PDF generation library
  const { url } = await storagePut(
    pdfFileName,
    htmlContent,
    "application/pdf"
  );

  // Update certificate with PDF URL
  const db = await getDb();
  if (db) {
    await db
      .update(certificates)
      .set({ certificatePdfUrl: url })
      .where(eq(certificates.id, certificate.id));
  }

  return url;
}

/**
 * Get certificate by ID
 */
export async function getCertificateById(id: number): Promise<Certificate | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(certificates)
    .where(eq(certificates.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Verify certificate by certificate number
 */
export async function verifyCertificateByNumber(
  certificateNumber: string
): Promise<Certificate | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(certificates)
    .where(eq(certificates.certificateNumber, certificateNumber))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get certificates for a user
 */
export async function getUserCertificatesList(userId: number): Promise<Certificate[]> {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(certificates)
    .where(eq(certificates.userId, userId));
}

/**
 * Revoke a certificate
 */
export async function revokeCertificateById(
  certificateId: number,
  reason: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database connection not available");
  }

  await db
    .update(certificates)
    .set({
      status: "revoked",
      revokeReason: reason,
      revokedAt: new Date(),
    })
    .where(eq(certificates.id, certificateId));

  // Notify owner
  await notifyOwner({
    title: "수료증 취소됨",
    content: `수료증 ID ${certificateId}이(가) 취소되었습니다. 사유: ${reason}`,
  });
}

/**
 * Issue certificate after payment completion
 */
export async function issueCertificateAfterPayment(
  userId: number,
  orderId: number,
  courseId: string,
  courseName: string,
  userName: string
): Promise<{ certificate: Certificate; pdfUrl: string }> {
  // Create certificate record
  const certificate = await createCertificate(
    userId,
    courseId,
    courseName,
    orderId
  );

  // Generate and upload PDF
  const pdfUrl = await generateCertificatePdf(certificate, userName);

  // Notify owner
  await notifyOwner({
    title: "새 수료증 발급됨",
    content: `${userName}님이 "${courseName}" 과정을 완료하여 수료증이 발급되었습니다.`,
  });

  return { certificate, pdfUrl };
}
