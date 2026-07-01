import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email:{
      type : String,
      required : true
    },
    otp: {
      type: String,
      max: 6,
      min : 6,
      required: true,
    },
    expiresIn: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const otp = mongoose.model("otp", otpSchema);
export default otp;
