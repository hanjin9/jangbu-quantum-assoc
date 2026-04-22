import { describe, it, expect, beforeAll } from "vitest";
import { generateOTP, sendOTPCode } from "./server/_core/twilio";

describe("Twilio SMS Service", () => {
  it("should generate a 6-digit OTP code", () => {
    const otp = generateOTP();
    expect(otp).toMatch(/^\d{6}$/);
    expect(otp.length).toBe(6);
  });

  it("should generate different OTP codes on each call", () => {
    const otp1 = generateOTP();
    const otp2 = generateOTP();
    // Note: There's a very small chance (1 in 900,000) they could be the same
    // In practice, this test will almost always pass
    expect(otp1).not.toBe(otp2);
  });

  it("should have valid Twilio credentials configured", () => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    expect(accountSid).toBeDefined();
    expect(accountSid).not.toBe("");
    expect(authToken).toBeDefined();
    expect(authToken).not.toBe("");
    expect(phoneNumber).toBeDefined();
    expect(phoneNumber).not.toBe("");
  });

  it("should have valid phone number format", () => {
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    // Phone number should start with + and contain only digits
    expect(phoneNumber).toMatch(/^\+\d+$/);
  });
});
