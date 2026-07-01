import nodemailer from "nodemailer";
console.log(process.env.EMAIL);
console.log(process.env.EMAIL_APP_PASSWORD);

export const sendOtpMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
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
  console.log("mail snet to" , email);
  
};
