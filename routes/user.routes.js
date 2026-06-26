import express from "express";
import {
  // deleteUser,
  // editUser,
  // getUserById,
  // getUsers,
  logoutUser,
  // patchUser,
  myProfile,
} from "../controller/user.controller.js";
const router = express.Router();

// router.get("/:id", getUserById);
// router.get("/", getUsers);
router.post("/logout", logoutUser);
// router.put("/", editUser);
// router.patch("/", patchUser);
// router.delete("/", deleteUser);
router.get("/profile", myProfile);
export default router;
