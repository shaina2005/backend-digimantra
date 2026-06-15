import express from "express";
import {
  signUp,
  deleteUser,
  editUser,
  getUserByEmail,
  getUsers,
  loginUser,
} from "../controller/user.controller.js";
const router = express.Router();

router.get("/", getUsers);
router.get("/:email", getUserByEmail);
router.post("/", signUp);
router.post("/login", loginUser)
router.put("/:email" , editUser)
router.delete("/:email", deleteUser);

export default router;
