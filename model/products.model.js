import { required } from "joi";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Prouduct name is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    description: {
      type: String,
      required: [true, "Description must be provided"],
    },
    image: {
      type: "String",
      required: [true, "Product Image is required"],
    },
  },
  { timestamps: true },
);

const product = mongoose.model("product", productSchema);
export default product;
