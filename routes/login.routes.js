import express from "express";
import {
  loginUser,
  signUp,
} from "../controller/login.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signUp);

export default router;
