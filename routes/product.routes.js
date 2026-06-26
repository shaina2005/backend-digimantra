import express from "express";
import {
  addNewProduct,
  getAllproducts,
  getProductByCode,
  getProductById,
  editProduct,
  updateProductById,
  deleteProductById,
  updateStock
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
router.put(
  "/:id",
  allowedAccess("superadmin"),
  schemaValidator(addProductSchema),
  editProduct,
);
router.patch("/update/stock/:id" , allowedAccess("superadmin"), updateStock )
router.patch("/update/:id" , allowedAccess("superadmin"), updateProductById);
router.delete("/delete/:id", allowedAccess("superadmin"), deleteProductById);
export default router;
