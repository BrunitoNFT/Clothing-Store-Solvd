import express from "express";

import { protect, allowTo } from "../controller/authController";

import {
  createOneProduct,
  deleteOneProduct,
  updateOneProduct,
  getAllProducts,
  getOneProduct,
} from "../controller/productController";

const router = express.Router();

router.get("/:id", getOneProduct);
router.get("/", getAllProducts);
/**
 * ! Starting from this endpoint all users should be logged in and admin
 */
router.use(protect, allowTo("admin"));
//
router.post("/", createOneProduct);
router.put("/:id", updateOneProduct);
router.delete("/:id", deleteOneProduct);

/**
 * TODO: Buy
 * TODO: Question to the product
 * TODO: Review a product after buying
 */

export default router;
