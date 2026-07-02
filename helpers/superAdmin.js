import user from "../model/user.model.js";
import { ROLES } from "../enum/enum.js";
import { response } from "./response.js";

export const generateSuperAdmin = async (req, res) => {
  try {
    const email = process.env.SUPERADMIN_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD;
    const firstName = process.env.SUPERADMIN_FIRSTNAME;
    const lastName = process.env.SUPERADMIN_LASTNAME;
    const role = ROLES.SUPERADMIN;

    const addAdmin = {
      email,
      password,
      firstName,
      lastName,
      role,
      isVerified: true,
    };

    const admin = await user.findOne({ email });
    if (!admin) {
      await user.create(addAdmin);
      console.log("Superadmin generated");
    }
    console.log("Superadmin already exists ");
  } catch (error) {
    console.log("An error occured in generating superadmin. ", error);
    return response(res, false, 500, null, "Server Error.Please try later");
  }
};
