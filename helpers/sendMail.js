import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendOtpMail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Verify your account",
    html: `
      <h2>Email Verification</h2>

      <p>Your OTP is:</p>

      <h1>${otp}</h1>

      <p>This OTP expires in 5 minutes.</p>
    `,
  });
  console.log("Email sent to : " , email);
  
};
