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
  console.log("reached");
  
  try {
    const incomingProduct = req.body;
    const prefix = incomingProduct.name.replace(/[^a-zA-Z]/g , "").substring(0,3).toUpperCase();
    const randomNo = Math.floor(100000 + Math.random()* 900000);
    const productCode = `${prefix}-${randomNo}`
    const newProduct = await product.create({
      productCode,
      ...incomingProduct,
      addedBy :req.user.userId,
    });
    console.log(newProduct);
    
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
    const productExists = await product.findById(id);
    if (!productExists) {
      return response(res, false, true, null, "product not found");
    }
    return response(res , true , 200 , {product : productExists} , "product fetched Successfully")
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
