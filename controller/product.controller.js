import product from "../model/products.model.js";
import { response } from "../helpers/response.js";
import { uploadBufferToCloudinary } from "../helpers/cloudinary/uploadImageToCloudinary.js";
import deleteImageFromCloudinary from "../helpers/cloudinary/deleteImageFromCloudinary.js";
import mongoose from "mongoose";
export const getAllproducts = async (_, res) => {
  try {
    const products = await product.find();
    if (!products || products.length === 0) {
      return response(res, true, 200, [], "No products Found");
    }

    return response(
      res,
      true,
      200,
      { products },
      "Products fetched successfully",
    );
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
  const session = await mongoose.startSession();
  let uploadedImages = [];
  try {
    session.startTransaction();
    const incomingProduct = req.body;
    console.log("reqfiles", req.files);
    if (!req.files || req.files.length === 0) {
      return response(res, false, 400, null, "Image file is required");
    }
    if (req.files.length > 5) {
      return response(
        res,
        false,
        400,
        null,
        "Maximum 5 images can be uploaded",
      );
    }
     uploadedImages = await Promise.all(
      req.files.map((file) => uploadBufferToCloudinary(file.buffer)),
    );
    const prefix = incomingProduct.name
      .replace(/[^a-zA-Z]/g, "")
      .substring(0, 3)
      .toUpperCase();
    const randomNo = Math.floor(100000 + Math.random() * 900000);
    const productCode = `${prefix}-${randomNo}`;
    const [newProduct] = await product.create([{
      productCode,
      ...incomingProduct,
      image : uploadedImages,
      addedBy: req.user.userId,
    }] , {session});

    await session.commitTransaction();
    return response(res, true, 201, newProduct, "Product Added successfully");
  } catch (error) {
    console.log("Error occured in AddnewProduct controller : ", error);
    await session.abortTransaction();
    if(uploadedImages.length > 0){
      await Promise.all(
        uploadedImages.map((img) => deleteImageFromCloudinary(img.public_id)),
      );
    }
    return response(
      res,
      false,
      500,
      null,
      "Server Error. Please try again later",
    );
  }finally {
    session.endSession();
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

export const editProduct = async (req, res) => {
  const session = await mongoose.startSession();
  let uploadedImage = [];
  try {
    const { id } = req.params;
    const incomingProduct = req.body;
    if (!id) {
      return response(res, false, 404, null, "Product not found");
    }
    if (!req.files || req.files.length === 0) {
      return response(res, false, 400, null, "Image file is required...");
    }
    if (req.files.length > 5) {
      return response(
        res,
        false,
        400,
        null,
        "Maximum 5 images can be uploaded",
      );
    }
    await session.startTransaction();
    const productInDB = await product.findById(id).session(session);

    if (!productInDB) {
      return response(res, false, 404, null, "Product not found");
    }
   
    const image = await Promise.all(
      req.files.map((img) => uploadBufferToCloudinary(img.buffer)),
    );
    uploadedImage = image; // Store the newly uploaded images for potential cleanup
    const updateProduct = await product.findByIdAndUpdate(
      id,
      {
        $set: {
          ...incomingProduct,
          image,
        },
      },
      {
        new: true,
        runValidators: true,
        session
      },
    );
    await session.commitTransaction();
     await Promise.all(
      productInDB.image.map((img) => deleteImageFromCloudinary(img.public_id)),
    );
    return response(
      res,
      true,
      200,
      { product: updateProduct },
      "Product updated successfully",
    );
  } catch (error) {
    await session.abortTransaction();
    if(uploadedImage.length > 0){
      await Promise.all(
        uploadedImage.map((img) => deleteImageFromCloudinary(img.public_id)),
      );
    }
    console.log("Error occured in AddnewProduct controller : ", error);
    return response(
      res,
      false,
      500,
      null,
      "Server Error. Please try again later",
    );
  }finally {
    session.endSession();
  }
};

export const updateStock = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const { id } = req.params;
    const { quantity } = req.body;
    if (!id) {
      return response(res, false, 404, null, "Product not found");
    }
    if (isNaN(quantity)) {
      return response(res, false, 400, null, "Quantity must be integer");
    }
    const oldStock = await product.findById(id).session(session);
    if (!oldStock) {
      return response(res, false, 404, null, "Product can't be found");
    }
    if (oldStock.stock + Number(quantity) < 0) {
      return response(res, false, 400, null, "Insufficient stock");
    }
    const updateStock = await product.findByIdAndUpdate(
      id,
      {
        $inc: {
          stock: Number(quantity),
        },
      },
      { new: true , session },
    );
    if (!updateStock) {
      return response(res, false, 400, null, "Failed adding new stock");
    }
    await session.commitTransaction();
    return response(
      res,
      true,
      200,
      { product: updateStock },
      "Stock update successfully",
    );
  } catch (error) {
    await session.abortTransaction();
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
  const session = await mongoose.startSession();
  let uploadedImage =[]
  try {
    const { id } = req.params;
    if (!id) {
      return response(res, false, 409, null, "Product Not found");
    }
    if (req.files && req.files.length > 5) {
      return response(
        res,
        false,
        400,
        null,
        "Maximum 5 images can be uploaded",
      );
    }
    await session.startTransaction();
    const productInDB = await product.findById(id).session(session);
    if (!productInDB) {
      return response(res, false, 404, null, "Product not found");
    }
    let image = productInDB.image; // Keep existing images if no new images are uploaded
    if (req.files && req.files.length > 0) {
      image = await Promise.all(
        req.files.map((file) => uploadBufferToCloudinary(file.buffer)),
      );
      uploadedImage = image; // Store the newly uploaded images for potential cleanup
    }
    const incomingProduct = req.body;
    const updateProduct = await product.findByIdAndUpdate(
      id,
      { ...incomingProduct, image },
      {
        new: true,
        runValidators: true,
        session,
      },
    );
    await session.commitTransaction();

    if (req.files && req.files.length > 0) {
      try {
        await Promise.all(
          productInDB.image.map((img) =>
            deleteImageFromCloudinary(img.public_id),
          ),
        );
      } catch (err) {
        console.error("Failed to delete old images:", err);
      }
    }
    return response(
      res,
      true,
      200,
      { product: updateProduct },
      "Product updated successfully",
    );
  } catch (error) {
    await session.abortTransaction();
    if(uploadedImage.length > 0){
      await Promise.all(
        uploadedImage.map((img) => deleteImageFromCloudinary(img.public_id)),
      );
    }
    console.log("Error occured in updateProductById controller : ", error);
    return response(
      res,
      false,
      500,
      null,
      "Server Error. Please try again later",
    );
  }finally {
    session.endSession();
  }
};

export const deleteProductById = async (req, res) => {
  const session = await mongoose.startSession();
  try {
     await session.startTransaction();
    const { id } = req.params;
    if (!id) {
      return response(res, false, 409, null, "Product Not found");
    }
    const productToDelete = await product.findById(id).session(session);
    if (!productToDelete) {
      return response(res, false, 409, null, "Product Not found");
    }
    
    const productDeleted = await product.findByIdAndDelete(id , {session});
    if (!productDeleted) {
      return response(res, false, 409, null, "Product Not found");
    }
    await session.commitTransaction();
    // Delete associated images from Cloudinary
     await Promise.all(
      productToDelete.image.map((img) =>
        deleteImageFromCloudinary(img.public_id),
      ),
    );
    return response(res, true, 200, null, "Product deleted successfully");
  } catch (error) {
    await session.abortTransaction();
    console.log("Error occured in deleteProductById controller : ", error);

    return response(
      res,
      false,
      500,
      null,
      "Server Error. Please try again later",
    );
  } finally {
    session.endSession();
  }
};
