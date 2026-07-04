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
    image:[
      {
        url:{
          type : String,
          required : [true , "Image is required"] 
        },
        public_id:{
          type : String,
          required : [true , "Image is required"] 
        }
      }
    ]
    ,
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
