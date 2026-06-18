export const auth = (req, res, next) => {
const userId = req.cookies.userId;

  if (!userId) {
    return res
      .status(401)
      .json({ message: "Unauthorised user. Login In first" });
  }

  req.id = userId;
  next();
}