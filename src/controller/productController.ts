import Product from "../models/productModel";
import factory from "../utils/handlerFactory";
import multer from "multer";
import sharp from "sharp";
import { IProduct, productImages } from "../types";
import { AppError, catchAsync } from "../utils";
import mongoose, { ObjectId } from "mongoose";

const deleteOneProduct = factory.deleteOne<IProduct>(Product);
const updateOneProduct = factory.updateOne<IProduct>(Product);
const getAllProducts = factory.getAll<IProduct>(Product);
const getOneProduct = factory.getOne<IProduct>(Product);
const createOneProduct = factory.createOne<IProduct>(Product);
/**
 * todo: make possible to upload product images in the creation of a product
 */

const multerConfig = multer({
  limits: {
    fileSize: 1000000, // 1 MB limit for each image
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new AppError("Please upload an image.", 400));
    }

    cb(undefined, true);
  },
});

const uploadProductImagesMulterMiddleware = multerConfig.array("images", 5); // 'productImages' should be the name attribute of the input field that accepts images, and '4' is the maximum number of images allowed.

const updateProductImagesMulterMiddleware = multerConfig.single("image");

const postProductImages = catchAsync(async (req, res, next) => {
  console.log("postProductImages");
  if (!req.files || req.files.length === 0) {
    return next(new AppError("Please upload at least one image.", 400));
  }
  /**
   * TODO: refactor id checking in utils
   */
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError("Invalid ID.", 400));
  }
  const product = await Product.findById(req.params.id);

  // Process and store the images as needed

  const productImages = (product.images || []) as productImages[];
  /**
   * TODO: refactor with promise all
   */
  for (const file of req.files as Express.Multer.File[]) {
    const buffer = await sharp(file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    // Store the processed image buffer or save it to your database
    // You may want to associate these images with your product somehow
    // and store their references in your database.
    const _id = new mongoose.Types.ObjectId();
    const href = `${req.protocol}://${req.get("host")}/products/${
      req.params.id
    }/images/${_id}`; // Construct the href based on the request

    productImages.push({ _id, data: buffer, href });
  }

  // Store the productImages in your database or associate them with a product.
  product.images = productImages;
  await product.save();

  res.status(201).send({
    status: "success",
  });
});

const deleteProductImage = catchAsync(async (req, res, next) => {
  /**
   * TODO: refactor id checking in utils
   *
   */
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError("Invalid ID.", 400));
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.imageId)) {
    return next(new AppError("Invalid ID.", 400));
  }
  const product = await Product.findById(req.params.id).select(
    "+images +images.data"
  );
  if (!product || !product.images) {
    return next(
      new AppError("No product or images were found with that ID", 404)
    );
  }
  const imgObjArr = product.images.filter(
    (obj: { data: Buffer; href: string; _id: ObjectId }) => {
      return obj._id.toString() !== req.params.imageId;
    }
  );

  product.images = imgObjArr;
  await product.save();
  res.status(204).json({
    status: "success",
    data: null,
  });
});

const updateProductImage = catchAsync(async (req, res, next) => {
  /**
   * TODO: refactor id checking in utils
   *
   */
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError("Invalid ID.", 400));
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.imageId)) {
    return next(new AppError("Invalid ID.", 400));
  }
  /**
   * todo optimize with promise all
   */
  const product = await Product.findById(req.params.id).select(
    "+images +images.data"
  );
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();
  if (!product || !product.images) {
    return next(
      new AppError("No product or images were found with that ID", 404)
    );
  }
  const imgObjArr = product.images.map(
    (obj: { data: Buffer; href: string; _id: ObjectId }) => {
      if (obj._id.toString() === req.params.imageId) {
        obj.data = buffer;
      }
      return obj;
    }
  );

  product.images = imgObjArr;
  await product.save();

  res.status(200).json({
    status: "success",
    data: null,
  });
});

const getProductImage = catchAsync(async (req, res, next) => {
  /**
   * TODO: refactor id checking in utils
   *
   */
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError("Invalid ID.", 400));
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.imageId)) {
    return next(new AppError("Invalid ID.", 400));
  }
  const product = await Product.findById(req.params.id).select(
    "+images +images.data"
  );
  if (!product || !product.images) {
    return next(
      new AppError("No product or images were found with that ID", 404)
    );
  }
  const imgObj = product.images.find(
    (obj: { data: Buffer; href: string; _id: ObjectId }) => {
      return obj._id.toString() === req.params.imageId;
    }
  );
  if (!imgObj) {
    return next(new AppError("No image was found with that ID", 404));
  }
  res.set("Content-Type", "image/png");
  res.send(imgObj.data);
});

export {
  deleteOneProduct,
  updateOneProduct,
  getAllProducts,
  getOneProduct,
  createOneProduct,
  postProductImages,
  uploadProductImagesMulterMiddleware,
  getProductImage,
  deleteProductImage,
  updateProductImagesMulterMiddleware,
  updateProductImage,
};
