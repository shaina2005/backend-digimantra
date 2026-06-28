import product from "../model/products.model.js";
import cart from "../model/cart.model.js";
import { response } from "../helpers/response.js";

export const getCart = async (req, res) => {
  try {
    console.log(req.user);
    const { userId } = req.user;
    // Logic to fetch cart items for the user
    const userCart = await cart
      .findOne({ userId })
      .populate("items.productId", "name price description image");
      console.log("userCart", userCart);
    if ( !userCart || userCart.items.length === 0) {
      return response(res, false, 404, null, "Cart is empty");
    }
    return response(
      res,
      true,
      200,
      { cart: userCart },
      "Cart fetched successfully",
    );
  } catch (error) {
    console.log("Error at getCart controller:", error);
    return response(res, false, 500, null, "Internal server error");
  }
};

export const addItemToCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId, quantity: qty } = req.body;
    const quantity = Number(qty);

    const productExistsInDataBase = await product.findById(productId);
    if (!productExistsInDataBase) {
      return response(res, false, 404, null, "Product not found");
    }
    const stockInDataBase = productExistsInDataBase.stock;

    const cartExists = await cart.findOne({ userId });
    if (!cartExists) {
      if (quantity > stockInDataBase) {
        return response(
          res,
          false,
          400,
          null,
          "Requested quantity exceeds available stock",
        );
      }
      const newCart = await cart.create({
        userId,
        items: [{ productId, quantity }],
      });
      if (!newCart) {
        return response(res, false, 400, null, "Failed to create cart");
      }
      return response(
        res,
        true,
        201,
        { cart: newCart },
        "Cart created and item added successfully",
      );
    }

    const productExists = cartExists.items.find((item) =>
      item.productId.equals(productId),
    );
    if (!productExists) {
      if (quantity > stockInDataBase) {
        return response(
          res,
          false,
          400,
          null,
          "Requested quantity exceeds available stock",
        );
      }
      cartExists.items.push({ productId, quantity });
      const updatedCart = await cartExists.save();
      if (!updatedCart) {
        return response(res, false, 400, null, "Failed to add item to cart");
      }
      return response(
        res,
        true,
        200,
        { cart: updatedCart },
        "Item added to cart successfully",
      );
    }
    if (productExists.quantity + quantity > stockInDataBase) {
      return response(
        res,
        false,
        400,
        null,
        "Requested quantity exceeds available stock",
      );
    }
    productExists.quantity += quantity;
    const updatedCart = await cartExists.save();
    if (!updatedCart) {
      return response(res, false, 400, null, "Failed to update item quantity");
    }
    return response(
      res,
      true,
      200,
      { cart: updatedCart },
      "Item quantity updated successfully",
    );
  } catch (error) {
    console.log("Error at addItemToCart controller:", error);
    return response(res, false, 500, null, "Internal server error");
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId, quantity: qty } = req.body;
    const quantity = Number(qty);

    const userCart = await cart.findOne({ userId });
    if (!userCart) {
      return response(res, false, 404, null, "Cart not found");
    }
    const productExistsIncart = userCart.items.find((item) =>
      item.productId.equals(productId),
    );
    if (!productExistsIncart) {
      return response(res, false, 404, null, "Product not found in cart");
    }
    const productExistsInDatabase = await product.findById(productId);
    if (!productExistsInDatabase) {
      return response(
        res,
        false,
        404,
        null,
        "Product doesn't exist in   database",
      );
    }
    const stockInDatabase = productExistsInDatabase.stock;
    if (quantity > stockInDatabase) {
      return response(
        res,
        false,
        400,
        null,
        "Requested quantity is more than available stock",
      );
    } else if (quantity < 0) {
      return response(res, false, 400, null, "Requested quantity is invalid");
    } else if (quantity == 0) {
      const deleteProductFromCart = userCart.items.filter(
        (item) => !item.productId.equals(productId),
      );
      userCart.items = deleteProductFromCart;
      if (userCart.items.length === 0) {
        const deleteCart = await cart.findByIdAndDelete(userCart._id);
        if (!deleteCart) {
          return response(res, false, 500, null, "Deletion of cart failed");
        }
        return response(res, true, 200, null, "CArt delted due to no items");
      }
      await userCart.save();
      return response(
        res,
        true,
        200,
        { cart: userCart },
        "Item removed from cart",
      );
    } else if (quantity == productExistsIncart.quantity) {
      return response(res, true, 200, null, "No chnages needed in quantity");
    }
    productExistsIncart.quantity = quantity;
    await userCart.save();
    return response(
      res,
      true,
      200,
      { cart: userCart },
      "Quantity updated successfully",
    );
  } catch (error) {
    console.log("Error at updateCartItemQuantity controller:", error);
    return response(res, false, 500, null, "Internal server error");
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productid: productId } = req.params;

    const userCart = await cart.findOne({ userId });
    if (!userCart) {
      return response(res, false, 404, null, "userCart not found");
    }
    const existingProductInCart = userCart.items.find((item) =>
      item.productId.equals(productId),
    );
    if (!existingProductInCart) {
      return response(res, false, 404, null, "Product not fount in cart");
    }
    const cartAfterRemovingProduct = userCart.items.filter(
      (item) => !item.productId.equals(productId),
    );
    if (cartAfterRemovingProduct.length === 0) {
      const deleteCart = await cart.findByIdAndDelete(userCart._id);
      if (!deleteCart) {
        return response(res, false, 500, null, "Deletion of cart failed");
      }
      return response(res, true, 200, null, "Cart deleted successfully");
    }
    userCart.items = cartAfterRemovingProduct;
    await userCart.save();

    return response(
      res,
      true,
      200,
      { cart: userCart },
      "Item removed from cart successfully",
    );
  } catch (error) {
    console.log("Error at removeItemFromCart controller:", error);
    return response(res, false, 500, null, "Internal server error");
  }
};
