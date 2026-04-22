import { ENV } from "./env";

/**
 * Twilio SMS 서비스 유틸리티
 * SMS 인증 코드 발송 및 검증
 */

interface TwilioResponse {
  sid?: string;
  status?: string;
  error_code?: string;
  message?: string;
}

/**
 * SMS 인증 코드 생성 (6자리 숫자)
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Twilio를 통해 SMS 발송
 * @param phoneNumber 수신자 전화번호 (국제 형식: +82-10-1234-5678 또는 +821012345678)
 * @param message SMS 메시지 내용
 * @returns Twilio 응답
 */
export async function sendSMS(
  phoneNumber: string,
  message: string
): Promise<TwilioResponse> {
  if (!process.env.TWILIO_ACCOUNT_SID) {
    throw new Error("TWILIO_ACCOUNT_SID is not configured");
  }
  if (!process.env.TWILIO_AUTH_TOKEN) {
    throw new Error("TWILIO_AUTH_TOKEN is not configured");
  }
  if (!process.env.TWILIO_PHONE_NUMBER) {
    throw new Error("TWILIO_PHONE_NUMBER is not configured");
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  // Twilio API 엔드포인트
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  // 기본 인증 (Base64)
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: phoneNumber,
        Body: message,
      }).toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Twilio Error]", errorData);
      throw new Error(
        `Twilio SMS failed: ${response.status} ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[Twilio SMS Error]", error);
    throw error;
  }
}

/**
 * SMS 인증 코드 발송 (편의 함수)
 * @param phoneNumber 수신자 전화번호
 * @param code 인증 코드
 */
export async function sendOTPCode(
  phoneNumber: string,
  code: string
): Promise<TwilioResponse> {
  const message = `[장•부 협회] 인증 코드: ${code}\n\n이 코드는 5분 동안 유효합니다.`;
  return sendSMS(phoneNumber, message);
}
