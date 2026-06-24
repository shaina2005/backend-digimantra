import express from "express";
import {
  addNewProduct,
  getAllproducts,
  getProductById,
} from "../controller/product.controller.js";
import { schemaValidator } from "../middleware/schemaValidator.middleware.js";
import { addProductSchema } from "../validators/productValidators.js";
import { allowedAccess } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllproducts);
router.get("/:id", getProductById);
router.post(
  "/",
  allowedAccess("superadmin"),
  schemaValidator(addProductSchema),
  addNewProduct,
);

export default router;
