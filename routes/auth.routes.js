import express from "express";
import { loginUser, signUp } from "../controller/auth.controller.js";
import { schemaValidator } from "../middleware/schemaValidator.middleware.js";
import { loginSchema, signUpSchema } from "../validators/authValidators.js";
const router = express.Router();

router.post("/login", schemaValidator(loginSchema), loginUser);
router.post("/signup", schemaValidator(signUpSchema), signUp);

export default router;
