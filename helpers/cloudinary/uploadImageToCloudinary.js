import cloudinary from "../../config/cloudinary.js";
import { PassThrough } from "stream";

export const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      },
    );
    uploadStream.end(buffer);
  });
};
