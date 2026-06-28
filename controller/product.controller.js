import product from "../model/products.model.js";
import { response } from "../helpers/response.js";

export const getAllproducts = async (_, res) => {
  try {
    const products = await product.find();
    if (!products || products.length === 0) {
      return response(res, true, 200, [], "No products Found");
    }

    return response(res, true, 200, {products}, "Products fetched successfully");
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
    const prefix = incomingProduct.name
      .replace(/[^a-zA-Z]/g, "")
      .substring(0, 3)
      .toUpperCase();
    const randomNo = Math.floor(100000 + Math.random() * 900000);
    const productCode = `${prefix}-${randomNo}`;
    const newProduct = await product.create({
      productCode,
      ...incomingProduct,
      addedBy: req.user.userId,
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
      return response(res, false, 404, null, "Product not found");
    }
    return response(
      res,
      true,
      200,
      { product: productExists },
      "product fetched Successfully",
    );
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

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const incomingProduct = req.body;
    if (!id) {
      return response(res, false, 404, null, "Product not found");
    }
    const productInDB = await product.findById(id);
    console.log("productInDb", productInDB);

    if (!productInDB) {
      return response(res, false, 404, null, "Product not found");
    }
    // const updatedProduct = await product.findByIdAndUpdate({});
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

export const getProductByCode = async (req, res) => {
  try {
    const { productcode } = req.params;
    if (!productcode) {
      return response(res, false, 409, null, "Product Not found");
    }
    const productExists = await product.findOne({ productCode: productcode });
    if (!productExists) {
      return response(res, false, 409, null, "Product Not found");
    }
    return response(
      res,
      true,
      200,
      { product: productExists },
      "Product fetched successfully",
    );
  } catch (error) {
    console.log("Error occured in getProductByCode controller : ", error);
    return response(
      res,
      false,
      500,
      null,
      "Server Error. Please try again later",
    );
  }
};

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (!id) {
      return response(res, false, 404, null, "Product not found");
    }
    if (isNaN(quantity)) {
      return response(res, false, 400, null, "Quantity must be integer");
    }
    const oldStock = await product.findById(id);
    if(!oldStock){
      return response(res , false , 404 , null , "Product can't be found")
    }
    if(oldStock.stock + Number(quantity) < 0){
      return response(res , false , 400 , null , "Insufficient stock")
    }
    const updateStock = await product.findByIdAndUpdate(
      id,
      {
        $inc: {
          stock: Number(quantity),
        },
      },
      { new: true },
    );
    if (!updateStock) {
      return response(res, false, 400, null, "Failed adding new stock");
    }
    return response(
      res,
      true,
      200,
      { product: updateStock },
      "Stock update successfully",
    );
  } catch (error) {
    console.log("Error occured in updateStock controller : ", error);
    return response(
      res,
      false,
      500,
      null,
      "Server Error. Please try again later",
    );
  }
};

export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return response(res, false, 409, null, "Product Not found");
    }
    const incomingProduct = req.body;
    const updateProduct = await product.findByIdAndUpdate(id, incomingProduct, {
      new: true,
    });
    if (!updateProduct) {
      return response(res, false, 409, null, "Product Not found");
    }
    return response(
      res,
      true,
      200,
      { product: updateProduct },
      "Product updated successfully",
    );
  } catch (error) {
    console.log("Error occured in updateProductById controller : ", error);
    return response(
      res,
      false,
      500,
      null,
      "Server Error. Please try again later",
    );
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return response(res, false, 409, null, "Product Not found");
    }
    const productDeleted = await product.findByIdAndDelete(id);
    if (!productDeleted) {
      return response(res, false, 409, null, "Product Not found");
    }
    return response(res, true, 200, null, "Product deleted successfully");
  } catch (error) {
    console.log("Error occured in deleteProductById controller : ", error);
    return response(
      res,
      false,
      500,
      null,
      "Server Error. Please try again later",
    );
  }
};
