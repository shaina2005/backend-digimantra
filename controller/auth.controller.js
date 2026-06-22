import { ROLES } from "../enum/enum.js";
import { response } from "../helpers/response.js";
import bcrypt from "bcrypt";

import user from "../model/user.model.js";

export const signUp = async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    const isUserExists = await user.findOne({ email });
    if (isUserExists) {
      return response(res, false, 409, null, "User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
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

    const isUserValid = await bcrypt.compare(password, userExists.password);
    
    if (!isUserValid) {
      return response(res, false, 401, null, "Incorrect password");
    }
    res.cookie("userId", userExists._id);
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
