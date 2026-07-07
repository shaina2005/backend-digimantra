import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      max: 6,
      min: 6,
      required: true,
    },
    expiresAt: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);
otpSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);

const otp = mongoose.model("otp", otpSchema);
export default otp;
