import product from "../model/products.model.js";
import { response } from "../helpers/response.js";

export const getAllproducts = async (_, res) => {
  try {
    const products = await product.find();
    if (!product) {
      return response(res, true, 200, [], "No products Found");
    }

    return response(res, true, 200, products, "Products fetched successfully");
  } catch (error) {
    console.log("Error occured in getAllProducts controller : ", error);
    return response(
      res,
      false,
      500,
      null,
      "Server Error. Please try again later",
    );
  }
};

export const addNewProduct = async (req, res) => {
  try {
    const incomingProduct = req.body;
    const newProduct = await product.create({
      ...incomingProduct,
    });
    return response(res, true, 201, newProduct, "Product Added successfully");
  } catch (error) {
    console.log("Error occured in AddnewProduct controller : ", error);
    return response(
      res,
      false,
      500,
      null,
      "Server Error. Please try again later",
    );
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return response(res, false, 409, null, "Product Not found");
    }
    // const p
  } catch (error) {
    console.log("Error occured in AddnewProduct controller : ", error);
    return response(
      res,
      false,
      500,
      null,
      "Server Error. Please try again later",
    );
  }
};
