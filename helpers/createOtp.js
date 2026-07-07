import otp from "../model/otp.model.js";
import argon2 from "argon2";
import { sendOtpMail } from "./sendMail.js";

export async function createOtp(email, session) {
  await otp.deleteMany({ email }, { session });

  const otpToSend = Math.floor(100000 + Math.random() * 900000).toString();
  const oneTimePassword = await argon2.hash(otpToSend);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  const [otpCreated] = await otp.create(
    [{
      email,
      otp: oneTimePassword,
      expiresAt,
    }],
    { session },
  );
  // await sendOtpMail(email, otpToSend);
  if (!otpCreated) return false;
  return otpToSend;
}
