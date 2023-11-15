import express from "express";

import { protect, allowTo } from "../controller/authController";

import {
  createOneProduct,
  deleteOneProduct,
  updateOneProduct,
  getAllProducts,
  getOneProduct,
  postProductImages,
  uploadProductImagesMulterMiddleware,
  getProductImage,
  deleteProductImage,
  updateProductImagesMulterMiddleware,
  updateProductImage,
} from "../controller/productController";

const router = express.Router();

router.get("/:id", getOneProduct);
router.get("/", getAllProducts);
/**
 * ! Starting from this endpoint all users should be logged
 */
router.use(protect);
//
router.get("/:id/images/:imageId", getProductImage);
/**
 * ! Starting from this endpoint all users should be admin
 */
router.use(allowTo("admin"));
//
router.post(
  "/:id/images",
  uploadProductImagesMulterMiddleware,
  postProductImages
);
router.delete("/:id/images/:imageId", deleteProductImage);
router.put(
  "/:id/images/:imageId",
  updateProductImagesMulterMiddleware,
  updateProductImage
);
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
