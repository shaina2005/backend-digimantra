import express from "express";
import { getCart, addItemToCart, removeItemFromCart , updateCartItemQuantity } from "../controller/cart.controller.js";
const router = express.Router();


router.get("/" , getCart);
router.post("/" , addItemToCart);
router.patch("/", updateCartItemQuantity);
router.delete("/:productid",removeItemFromCart)

export default router;