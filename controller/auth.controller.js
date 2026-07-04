import { ROLES } from "../enum/enum.js";
import { response } from "../helpers/response.js";
// import bcrypt from "bcrypt";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import user from "../model/user.model.js";
import otp from "../model/otp.model.js";
import { sendOtpMail } from "../helpers/sendMail.js";
import { generateAndSendOtp } from "../helpers/generateAndSendOtp.js";

export const signUp = async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    const isUserExists = await user.findOne({ email }).select("-password");
    if (isUserExists && isUserExists?.isVerified) {
      return response(res, false, 409, null, "User already exists");
    }
    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = await argon2.hash(password);
    const newUser = {
      email,
      firstName,
      lastName,
      password: hashedPassword,
      // password,
      role: ROLES.USER,
    };

    if (isUserExists && !isUserExists.isVerified) {
      const updateUnverifiedUser = await user
        .findOneAndUpdate({ email }, { $set: newUser }, { new: true })
        .select("-password");
      if (!updateUnverifiedUser) {
        return response(
          res,
          false,
          500,
          null,
          "Failed creating account.Please try again.",
        );
      }
      const otpCreated = await generateAndSendOtp(email);
      if (!otpCreated) {
        await user.findOneAndDelete({ email });
        return response(
          res,
          false,
          500,
          null,
          "Failed creating account.Please try again.",
        );
      }
      return response(
        res,
        true,
        201,
        { user: updateUnverifiedUser },
        "Otp sent successfully",
      );
    }
    const userCreated = await user.create(newUser);
    delete userCreated.password
    if (!userCreated) {
      return response(res, false, 500, null, "failed creating user");
    }
    const otpCreated = await generateAndSendOtp(email);

    if (userCreated && !otpCreated) {
      await user.findOneAndDelete({ email });
      return response(
        res,
        false,
        500,
        null,
        "Otp generation failed . rolled back user",
      );
    }
    return response(res, true, 201, userCreated, "Otp sent successfully");
  } catch (error) {
    await user.findOneAndDelete({ email: req.body.email });
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

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp: user_otp } = req.body;

    const existingUser = await otp.findOne({ email });

    if (!existingUser) {
      return response(res, false, 404, null, "Email not found , signup first");
    }
    //checking if otp is expired
    const isOtpexpired = new Date() >= existingUser.expiresIn;
    if (isOtpexpired) {
      return response(res, false, 400, null, "Incorrect or expired otp");
    }
    //checking if otp is correct

    const isOtpCorrect = await argon2.verify(existingUser.otp, user_otp);
    if (!isOtpCorrect) {
      return response(res, false, 400, null, "Incorrect or expired otp");
    }
    const verifyUser = await user.findOne({ email }).select("-password");
    verifyUser.isVerified = true;
    await verifyUser.save();
    await otp.findOneAndDelete({ email });
    return response(
      res,
      true,
      200,
      { user: verifyUser },
      "User verification successfull",
    );
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
    const isUserVerified = userExists.isVerified === true;
    if (!isUserVerified) {
      return response(
        res,
        false,
        401,
        null,
        "Please verify email first to log in",
      );
    }
    // const isUserValid = await bcrypt.compare(password, userExists.password);
    const isUserValid = await argon2.verify(userExists.password, password);

    if (!isUserValid) {
      return response(res, false, 401, null, "Incorrect password");
    }
    const payload = {
      userId: userExists._id,
      role: userExists.role,
      name: userExists.firstName,
    };
    const token = jwt.sign(payload, process.env.MySECRET, {
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
