import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productCode: {
      type: String,
      required: true,
      unique: true,
    },
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
      type: [String],
      required: [true, "Product Image is required"],
    },
    stock:{
      type : Number,
      required :[true , "Stock is required"]
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

const product = mongoose.model("product", productSchema);
export default product;
