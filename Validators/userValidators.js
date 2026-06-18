import Joi from "joi";

export const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(3).max(30).required(),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
      ),
    )
    .required().messages({
      "any.required" : "Password is required.",
      "string.empty" : "password can't be empty",
      "string.pattern.base":"Password must contain at least one uppercase letter, one lowercase letter, one digit and one special character",
})
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
      ),
    )
    .required().messages({
      "any.required" : "Password is required.",
      "string.empty" : "password can't be empty",
      "string.pattern.base":"Password must contain at least one uppercase letter, one lowercase letter, one digit and one special character",
})
});
