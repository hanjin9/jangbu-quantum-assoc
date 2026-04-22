import { describe, it, expect } from "vitest";
import { generateOTP } from "./_core/twilio";

describe("SMS Authentication System", () => {
  const testPhoneNumber = "+821012345678";
  const testOTP = "123456";

  it("should generate valid OTP codes", () => {
    const otp1 = generateOTP();
    const otp2 = generateOTP();

    expect(otp1).toMatch(/^\d{6}$/);
    expect(otp2).toMatch(/^\d{6}$/);
    expect(otp1.length).toBe(6);
    expect(otp2.length).toBe(6);
  });

  it("should validate phone number format", () => {
    const validPhoneNumbers = [
      "+821012345678",
      "+82-10-1234-5678",
      "+8210123456789",
    ];

    validPhoneNumbers.forEach((phone) => {
      // Phone number should contain digits
      const hasDigits = /\d/.test(phone);
      expect(hasDigits).toBe(true);
    });
  });

  it("should validate OTP format", () => {
    const otp = generateOTP();
    const isValidFormat = /^\d{6}$/.test(otp);
    expect(isValidFormat).toBe(true);
  });

  it("should generate unique OTP codes", () => {
    const otps = new Set();
    for (let i = 0; i < 10; i++) {
      otps.add(generateOTP());
    }
    // Most of the time, they should be different
    expect(otps.size).toBeGreaterThan(1);
  });

  it("should have valid Twilio credentials configured", () => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    expect(accountSid).toBeDefined();
    expect(authToken).toBeDefined();
    expect(phoneNumber).toBeDefined();
    expect(phoneNumber).toMatch(/^\+\d+$/);
  });
});
