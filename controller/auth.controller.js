import { ROLES } from "../enum/enum.js";
import { response } from "../helpers/response.js";
// import bcrypt from "bcrypt";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import user from "../model/user.model.js";

export const signUp = async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    const isUserExists = await user.findOne({ email });
    if (isUserExists) {
      return response(res, false, 409, null, "User already exists");
    }
    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = await argon2.hash(password);
    const newUser = {
      email,
      firstName,
      lastName,
      password: hashedPassword,
      role: ROLES.USER,
    };

    const userCreated = await user.create(newUser);

    if (userCreated) {
      return response(res, true, 201, userCreated, "User created successfully");
    }

    return response(false, 409, null, "User creation failed. Try again later");
  } catch (error) {
    console.log("Error occured in singup controller : ", error);
    return response(
      res,
      false,
      500,
      null,
      error?.message ?? error?.msg ?? "Server Error. Please try again later",
    );
  }
};

export const loginUser = async (req, res) => {
  try {
    console.log("req.body", req.body);

    const { email, password } = req.body;
    const userExists = await user.findOne({ email });
    if (!userExists) {
      return response(
        res,
        false,
        404,
        null,
        "User doesn't exists. Please signup first",
      );
    }
    // const isUserValid = await bcrypt.compare(password, userExists.password);
    const isUserValid = await argon2.verify(userExists.password, password);

    if (!isUserValid) {
      return response(res, false, 401, null, "Incorrect password");
    }
    const payload = {userId : userExists._id , role : userExists.role}
    const token = jwt.sign(payload , process.env.MySECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });
    return response(res, true, 200, null, "Login successfull");
  } catch (error) {
    console.log("Error occured in loginuser controller : ", error);
    return response(
      res,
      false,
      500,
      null,
      "Server Error. Please try again later",
    );
  }
};
