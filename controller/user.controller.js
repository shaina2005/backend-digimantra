import fs, { readFileSync } from "fs";
const filePath = "./database/users.json";
import {addUserSchema} from "../Validators/userValidators.js"

export const getUsers = async (req, res) => {
  try {
    if (fs.existsSync(filePath)) {
      const users = JSON.parse(readFileSync(filePath, "utf-8"));
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

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const userExists = users.find((user) =>
      user.email === email ? user : false,
    );
    if (userExists) {
      return res.status(200).json(userExists);
    }
    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.log("An error occured : ", error);
    res.status(500).json({ message: "Please try later!" });
  }
};

export const addUser = async (req, res) => {
  try {
    await addUserSchema.validate(req.body)
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(401).json({ message: "All fields are required" });
    }


    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]");
    }

    const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      return res.status(409).json({ message: "user already exists" });
    }
    const user = {
      id: crypto.randomUUID(),
      email,
      name,
      password,
    };
    users.push(user);

    fs.writeFileSync(filePath, JSON.stringify(users));

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log("An error occured : ", error);
    res.status(500).json({ message: "Please try later!" });
  }
};

export const editUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = req.body;

    if (!fs.existsSync(filePath)) {
      return res.json({ message: "File not found" });
    }

    const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const userExists = users.findIndex((user) => user.email === email);
    if (userExists === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    users[userExists] = user;

    fs.writeFileSync(filePath, JSON.stringify(users));

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log("An error occured : ", error);
    res.status(500).json({ message: "Please try later!" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Not found" });
    }
    const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const userExists = users.findIndex((user) => user.email === email);
    if (userExists === -1) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    users.splice(userExists, 1);

    fs.writeFileSync(filePath, JSON.stringify(users));
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    console.log("An error occured : ", error);
    res.status(500).json({ message: "Please try later!" });
  }
};
