"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductImage = exports.updateProductImagesMulterMiddleware = exports.deleteProductImage = exports.getProductImage = exports.uploadProductImagesMulterMiddleware = exports.postProductImages = exports.createOneProduct = exports.getOneProduct = exports.getAllProducts = exports.updateOneProduct = exports.deleteOneProduct = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const handlerFactory_1 = __importDefault(require("../utils/handlerFactory"));
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const utils_1 = require("../utils");
const mongoose_1 = __importDefault(require("mongoose"));
const deleteOneProduct = handlerFactory_1.default.deleteOne(productModel_1.default);
exports.deleteOneProduct = deleteOneProduct;
const updateOneProduct = handlerFactory_1.default.updateOne(productModel_1.default);
exports.updateOneProduct = updateOneProduct;
const getAllProducts = handlerFactory_1.default.getAll(productModel_1.default);
exports.getAllProducts = getAllProducts;
const getOneProduct = handlerFactory_1.default.getOne(productModel_1.default);
exports.getOneProduct = getOneProduct;
const createOneProduct = handlerFactory_1.default.createOne(productModel_1.default);
exports.createOneProduct = createOneProduct;
/**
 * todo: make possible to upload product images in the creation of a product
 */
const multerConfig = (0, multer_1.default)({
    limits: {
        fileSize: 1000000, // 1 MB limit for each image
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new utils_1.AppError("Please upload an image.", 400));
        }
        cb(undefined, true);
    },
});
const uploadProductImagesMulterMiddleware = multerConfig.array("images", 5); // 'productImages' should be the name attribute of the input field that accepts images, and '4' is the maximum number of images allowed.
exports.uploadProductImagesMulterMiddleware = uploadProductImagesMulterMiddleware;
const updateProductImagesMulterMiddleware = multerConfig.single("image");
exports.updateProductImagesMulterMiddleware = updateProductImagesMulterMiddleware;
const postProductImages = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("postProductImages");
    if (!req.files || req.files.length === 0) {
        return next(new utils_1.AppError("Please upload at least one image.", 400));
    }
    /**
     * TODO: refactor id checking in utils
     */
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return next(new utils_1.AppError("Invalid ID.", 400));
    }
    const product = yield productModel_1.default.findById(req.params.id);
    // Process and store the images as needed
    const productImages = (product.images || []);
    /**
     * TODO: refactor with promise all
     */
    for (const file of req.files) {
        const buffer = yield (0, sharp_1.default)(file.buffer)
            .resize({ width: 250, height: 250 })
            .png()
            .toBuffer();
        // Store the processed image buffer or save it to your database
        // You may want to associate these images with your product somehow
        // and store their references in your database.
        const _id = new mongoose_1.default.Types.ObjectId();
        const href = `${req.protocol}://${req.get("host")}/products/${req.params.id}/images/${_id}`; // Construct the href based on the request
        productImages.push({ _id, data: buffer, href });
    }
    // Store the productImages in your database or associate them with a product.
    product.images = productImages;
    yield product.save();
    res.status(201).send({
        status: "success",
    });
}));
exports.postProductImages = postProductImages;
const deleteProductImage = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * TODO: refactor id checking in utils
     *
     */
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return next(new utils_1.AppError("Invalid ID.", 400));
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.imageId)) {
        return next(new utils_1.AppError("Invalid ID.", 400));
    }
    const product = yield productModel_1.default.findById(req.params.id).select("+images +images.data");
    if (!product || !product.images) {
        return next(new utils_1.AppError("No product or images were found with that ID", 404));
    }
    const imgObjArr = product.images.filter((obj) => {
        return obj._id.toString() !== req.params.imageId;
    });
    product.images = imgObjArr;
    const doc = yield product.save();
    res.status(204).json({
        status: "success",
        data: null,
    });
}));
exports.deleteProductImage = deleteProductImage;
const updateProductImage = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * TODO: refactor id checking in utils
     *
     */
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return next(new utils_1.AppError("Invalid ID.", 400));
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.imageId)) {
        return next(new utils_1.AppError("Invalid ID.", 400));
    }
    /**
     * todo optimize with promise all
     */
    const product = yield productModel_1.default.findById(req.params.id).select("+images +images.data");
    const buffer = yield (0, sharp_1.default)(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
    if (!product || !product.images) {
        return next(new utils_1.AppError("No product or images were found with that ID", 404));
    }
    const imgObjArr = product.images.map((obj) => {
        if (obj._id.toString() === req.params.imageId) {
            obj.data = buffer;
        }
        return obj;
    });
    product.images = imgObjArr;
    yield product.save();
    res.status(200).json({
        status: "success",
        data: null,
    });
}));
exports.updateProductImage = updateProductImage;
const getProductImage = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * TODO: refactor id checking in utils
     *
     */
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return next(new utils_1.AppError("Invalid ID.", 400));
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.imageId)) {
        return next(new utils_1.AppError("Invalid ID.", 400));
    }
    const product = yield productModel_1.default.findById(req.params.id).select("+images +images.data");
    if (!product || !product.images) {
        return next(new utils_1.AppError("No product or images were found with that ID", 404));
    }
    const imgObj = product.images.find((obj) => {
        return obj._id.toString() === req.params.imageId;
    });
    if (!imgObj) {
        return next(new utils_1.AppError("No image was found with that ID", 404));
    }
    res.set("Content-Type", "image/png");
    res.send(imgObj.data);
}));
exports.getProductImage = getProductImage;
