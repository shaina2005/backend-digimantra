import fs, { readFileSync } from "fs";
const filePath = "./database/users.json";
import { signUpSchema, loginSchema } from "../Validators/userValidators.js";
import bcrypt from "bcrypt";
import {
  readFile,
  findUserById,
  checkIfFileExists,
  findUserByEmail,
} from "../helpers/file.js";

export const getUsers = async (req, res) => {
  try {
    if (checkIfFileExists(filePath)) {
      const users = readFile(filePath);
      if (users.length > 0) {
        res.json(users);
      } else {
        res.json({ message: "No user found" });
      }
    }
  } catch (error) {
    console.log("An error occured : ", error);
    res.status(500).json({ message: "Please try later!" });
  }
};

export const getUserById = async (req, res) => {
  try {
    if (checkIfFileExists(filePath)) {
      const { id } = req.params;
      const users = readFile(filePath);
      const user = findUserById(filePath, id);
      if (user) {
        return res.status(200).json(user);
      }
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(404).json({ message: "File Doesn't exist" });
  } catch (error) {
    console.log("An error occured : ", error);
    res.status(500).json({ message: "Please try later!" });
  }
};

export const loginUser = async (req, res) => {
  try {
    // const { error } = loginSchema.validate(req.body);

    // if (error) {
    //   return res.status(400).json({ message: error.details[0].message });
    // }
    const { email, password } = req.body;

    const user = await findUserByEmail(filePath, email);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    console.log("user at login", user);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Password Incorrect" });
    }
    res.cookie("userId", user.id);
    return res.status(200).json({ message: "Login Successfull!", user });
  } catch (error) {
    console.log("An error occured : ", error);
    res.status(500).json({ message: "Please try later!" });
  }
};

export const signUp = async (req, res) => {
  try {
    // const { error } = signUpSchema.validate(req.body);

    // if (error) {
    //   return res.status(400).json({ message: error.details[0].message });
    // }
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

      const hashedPassword = await bcrypt.hash(password, 10);
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

export const editUser = async (req, res) => {
  try {
    const { userId: id } = req.cookies;
    const user = req.body;

    if (Object.keys(user).length === 0) {
      return res.status(400).json({ message: "User can't be empty" });
    }

    if (!checkIfFileExists(filePath))
      return res.status(404).json("File Not Found");

    const { error } = signUpSchema.validate(user);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const users = readFile(filePath);
    const userPresent = findUserById(filePath, id);

    if (!userPresent) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUsers = users.map((u) => (u.id === id ? { id, ...user } : u));

    fs.writeFileSync(filePath, JSON.stringify(updatedUsers));

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log("An error occured : ", error);
    res.status(500).json({ message: "Please try later!" });
  }
};
export const patchUser = async (req, res) => {
  try {
    const { userId: id } = req.cookies;
    const incomingUser = req.body;

    if (!checkIfFileExists(filePath))
      return res.status(404).json({ message: "File not found" });

    const userExists = findUserById(filePath, id);

    if (!userExists) {
      return res.status(404).json({ message: "user Not found" });
    }

    const users = readFile(filePath);
    const updatedUser = users.map((u) =>
      u.id === id ? { ...u, ...incomingUser } : u,
    );

    fs.writeFileSync(filePath, JSON.stringify(updatedUser));

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log("An error occured : ", error);
    res.status(500).json({ message: "Please try later!" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId: id } = req.cookies;
    console.log(id, "id");                                                                                                                                                                                                                                                                                                                                                              

    if (!id) {
      return res.json({ message: "Id Not found" });
    }
    if (checkIfFileExists(filePath)) {
      const users = readFile(filePath);
      const user = findUserById(filePath, id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      // users.splice(user, 1);
      const updatedUsers = users.filter((user) => user.id !== id);

      fs.writeFileSync(filePath, JSON.stringify(updatedUsers));
      res.status(200).json({ message: "user deleted successfully" });
    }
    return res.status(404).json({ message: "File Not found" });
  } catch (error) {
    console.log("An error occured : ", error);
    res.status(500).json({ message: "Please try later!" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("userId");
    return res.json({ message: "logged out" });
  } catch (error) {
    console.log("An error occured : ", error);
    res.status(500).json({ message: "Please try later!" });
  }
};
