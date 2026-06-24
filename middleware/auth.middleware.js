import { response } from "../helpers/response.js";
import jwt from "jsonwebtoken";
export const auth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return response(res, false, 409, null, "Invalid user. Login first");
  }
  try {
    const decoded = jwt.verify(token, process.env.MySECRET);
    console.log("decoded", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.log("An error occured in auth miiddleware. ", error);
    return response(res, false, 500, null, "Server Error.Please try later");
  }
};

export const allowedAccess = (...roles) => {
  return (req, res, next) => {
    const role = req.user.role;
    if (!roles.includes(role)) {
      return response(res, false, 403, null, "Access denied!!!");
    }
    next();
  };
};
