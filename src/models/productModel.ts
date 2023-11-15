import mongoose, { Model } from "mongoose";
import { IProduct } from "../types";

const ImageSchema = new mongoose.Schema({
  data: { type: Buffer, select: false },
  href: String,
});

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: { type: Number, min: [0, "Min price is $0"], required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Min stock is 0"],
    },
    images: {
      type: [ImageSchema],
      select: true,
    },
  },
  { timestamps: true }
);

//This index can be helpful when querying products based on the owner (user).
ProductSchema.index({ owner: 1 });


const Product = mongoose.model<IProduct, Model<IProduct>>(
  "Product",
  ProductSchema
);
export default Product;
