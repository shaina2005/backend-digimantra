import fs, { readFileSync } from "fs";
const filePath = "./database/users.json";
import bcrypt from "bcrypt";
import user from "../model/user.model.js";
import {
  readFile,
  findUserById,
  checkIfFileExists,
  findUserByEmail,
} from "../helpers/file.js";
import { response } from "../helpers/response.js";

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "logged out" });
  } catch (error) {
    console.log("An error occured : ", error);
    res.status(500).json({ message: "Please try later!" });
  }
};

export const myProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const userExists = await user.findById(id);
    if (!userExists) {
      return response(res, false, 404, null, "User not found");
    }
    return response(res, true, 200, {user : userExists }, "User found");
  } catch (error) {
    console.log("Error at Myproile controller : ", error);
    return response(
      res,
      false,
      500,
      null,
      "server error.Please try again later!",
    );
  }
};
