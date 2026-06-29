import { response } from "../helpers/response.js";
export const errorBoundry = (err , req , res , next) => {
  return response(res, false, 500, null, err.message);
};
