import Joi from "joi";

export const signUpSchema = Joi.object({
  firstName: Joi.string().min(3).max(20).required().messages({
    "any.required": "firstname is required",
    "string.empty": "firstname can't be empty",
  }),
  lastName: Joi.string().min(3).max(20),
  email: Joi.string().email().required().messages({
    "any.required": "email is required",
    "string.empty": "email can't be empty",
  }),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
      ),
    )
    .required()
    .messages({
      "any.required": "Password is required.",
      "string.empty": "password can't be empty",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one digit and one special character",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "email is required",
    "string.empty": "email can't be empty",
    "string.email": "please enter a valid email",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required.",
    "string.empty": "password can't be empty",
  }),
});

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
  }),
  otp: Joi.string().length(6).required().messages({
    "string.pattern.base": "OTP must be exactly 6 digits",
    "string.empty": "OTP is required",
    "any.required": "OTP is required",
  }),
});
