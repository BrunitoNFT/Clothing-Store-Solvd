"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const productController_1 = require("../controller/productController");
const router = express_1.default.Router();
router.get("/:id", productController_1.getOneProduct);
router.get("/", productController_1.getAllProducts);
/**
 * ! Starting from this endpoint all users should be logged
 */
router.use(authController_1.protect);
//
router.get("/:id/images/:imageId", productController_1.getProductImage);
/**
 * ! Starting from this endpoint all users should be admin
 */
router.use((0, authController_1.allowTo)("admin"));
//
router.post("/:id/images", productController_1.uploadProductImagesMulterMiddleware, productController_1.postProductImages);
router.delete("/:id/images/:imageId", productController_1.deleteProductImage);
router.put("/:id/images/:imageId", productController_1.updateProductImagesMulterMiddleware, productController_1.updateProductImage);
//
router.post("/", productController_1.createOneProduct);
router.put("/:id", productController_1.updateOneProduct);
router.delete("/:id", productController_1.deleteOneProduct);
/**
 * TODO: Buy
 * TODO: Question to the product
 * TODO: Review a product after buying
 */
exports.default = router;
