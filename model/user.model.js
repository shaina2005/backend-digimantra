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
  },
  { timestamps: true },
);

const user = mongoose.model("user" , userSchema);
export default user;
