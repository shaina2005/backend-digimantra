import jwt from "jsonwebtoken";
const secret = "trying to be secret";

export const auth = (req, res, next) => {
  const userId = req.cookies.userId;

  if (!userId) {
    return res
      .status(401)
      .json({ message: "Unauthorised user. Login In first" });
  }
  try {
    const decoded = jwt.verify(userId, secret);
    req.user = decoded;
  } catch (error) {
    console.log("Error in auth middleware : ", error);
    return res
      .status(401)
      .json({ message: "Invalid token. Please login again" });
  }

  next();
};
