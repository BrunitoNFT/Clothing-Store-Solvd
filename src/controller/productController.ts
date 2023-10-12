import Product from "../models/productModel";
import factory from "../utils/handlerFactory";
import { IProduct } from "../types";

const deleteOneProduct = factory.deleteOne<IProduct>(Product);
const updateOneProduct = factory.updateOne<IProduct>(Product);
const getAllProducts = factory.getAll<IProduct>(Product);
const getOneProduct = factory.getOne<IProduct>(Product);
const createOneProduct = factory.createOne<IProduct>(Product);

export {
  deleteOneProduct,
  updateOneProduct,
  getAllProducts,
  getOneProduct,
  createOneProduct,
};
