import cloudinary from "../../config/cloudinary.js";

async function deleteImageFromCloudinary(publicId) {
  return await cloudinary.uploader.destroy(publicId);
}

export default deleteImageFromCloudinary;
