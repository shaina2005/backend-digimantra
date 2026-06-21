const filePath = "./database/users.json";
import { signUpSchema, loginSchema } from "../Validators/userValidators.js";
import argon2 from "argon2";
import fs from "fs";
import crypto from "crypto";
import { readFile, findUserByEmail } from "../helpers/file.js";
import jwt from "jsonwebtoken";

const secret = 'trying to be secret';
export const signUp = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]");
    } else {
      const users = readFile(filePath);
      if (!users) {
        fs.writeFileSync(filePath, "[]");
        return;
      }
      const existingUser = findUserByEmail(filePath, email);

      if (existingUser) {
        return res.status(409).json({ message: "user already exists" });
      }

    //   const hashedPassword = await bcrypt.hash(password, 10);
      const hashedPassword = await argon2.hash(password);
      console.log("hashed", hashedPassword);

      const user = {
        id: crypto.randomUUID(),
        email,
        name,
        password: hashedPassword,
      };
      console.log("user", user);

      users.push(user);

      fs.writeFileSync(filePath, JSON.stringify(users));

      res.status(201).json({ message: "User created successfully!!!!" });
    }
  } catch (error) {
    console.log("An error occured : ", error);
    res.status(500).json({ message: "Please try later!!!!!" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(filePath, email);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    console.log("user at login", user);

    const isPasswordCorrect = await argon2.verify(user.password, password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Password Incorrect" });
    }
    const token = jwt.sign({id : user.id} , secret , {expiresIn : "5000s"})
    res.cookie("userId", token);
    return res.status(200).json({ message: "Login Successfull!", user });
  } catch (error) {
    console.log("An error occured : ", error);
    res.status(500).json({ message: "Please try later!" });
  }
};