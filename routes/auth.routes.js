import express from "express";
import { loginUser, signUp, verifyOtp } from "../controller/auth.controller.js";
import { schemaValidator } from "../middleware/schemaValidator.middleware.js";
import { loginSchema, signUpSchema } from "../validators/authValidators.js";
const router = express.Router();

router.post("/login", schemaValidator(loginSchema), loginUser);
router.post("/signup", schemaValidator(signUpSchema), signUp);
router.post("/signup/verify-otp" , verifyOtp )

export default router;
