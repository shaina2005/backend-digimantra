import express from "express";
import {
  addUser,
  deleteUser,
  editUser,
  getUserByEmail,
  getUsers,
} from "../controller/user.controller.js";
const router = express.Router();

router.get("/", getUsers);
router.get("/:email", getUserByEmail);
router.post("/", addUser);
router.put("/:email" , editUser)
router.delete("/:email", deleteUser);

export default router;
