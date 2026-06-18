import express from "express";
import {
  deleteUser,
  editUser,
  getUserById,
  getUsers,
  loginUser,
  logoutUser,
  patchUser,
} from "../controller/user.controller.js";
const router = express.Router();

router.get("/:id", getUserById);
router.get("/", getUsers);
router.post("/logout", logoutUser);
router.put("/", editUser);
router.patch("/", patchUser);
router.delete("/", deleteUser);

export default router;
