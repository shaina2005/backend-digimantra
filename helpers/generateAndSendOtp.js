import otp from "../model/otp.model.js";
import argon2 from "argon2";
import { sendOtpMail } from "./sendMail.js";

export async function generateAndSendOtp(email) {
  await otp.deleteMany({ email });

  const otpToSend = Math.floor(100000 + Math.random() * 900000).toString();
  await sendOtpMail(email, otpToSend);
  const oneTimePassword = await argon2.hash(otpToSend);
  const expiresIn = new Date(Date.now() + 5 * 60 * 1000);
  const otpCreated = await otp.create({
    email,
    otp: oneTimePassword,
    expiresIn,
  });
  if (!otpCreated) return false;
  return true;
}
