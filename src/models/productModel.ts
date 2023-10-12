import mongoose, { Model } from "mongoose";
import { IProduct } from "../types";

const ProductSchema = new mongoose.Schema({
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
});

const Product = mongoose.model<IProduct, Model<IProduct>>(
  "Product",
  ProductSchema
);
export default Product;
