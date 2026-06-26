import express from "express";
import {
  addNewProduct,
  getAllproducts,
  getProductByCode,
  getProductById,
  updateProductById,
  deleteProductById
} from "../controller/product.controller.js";
import { schemaValidator } from "../middleware/schemaValidator.middleware.js";
import { addProductSchema } from "../validators/productValidators.js";
import { allowedAccess } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllproducts);
router.get("/:id", getProductById);
router.get("/code/:productcode" , allowedAccess("superadmin") , getProductByCode);
router.post(
  "/",
  allowedAccess("superadmin"),
  schemaValidator(addProductSchema),
  addNewProduct,
);
router.patch("/update/:id" , allowedAccess("superadmin"), updateProductById);
router.delete("/delete/:id", allowedAccess("superadmin"), deleteProductById);
export default router;
