import argon2 from "argon2"
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      maxLength: 20,
      minLength: 3,
      required: [true, "Name must be provided!"],
    },
    lastName: {
      type: String,
      maxLength: 20,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    role: {
      type: String,
      required: true,
    },
    isVerified : {
      type : Boolean,
      default : false
    }
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return ;
  }

  this.password = await argon2.hash(this.password);
});

const user = mongoose.model("user" , userSchema);
export default user;
