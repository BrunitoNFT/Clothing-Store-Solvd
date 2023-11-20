import { AppError, catchAsync } from "../utils";

import User from "../models/userModel";
import factory from "../utils/handlerFactory";
import multer from "multer";
import sharp from "sharp";
import mongoose from "mongoose";
import { IUser } from "../types";

const getMe = catchAsync(async (req, res) => {
  res.status(200).send({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

const assignIdToUrl = catchAsync(async (req, res, next) => {
  req.params.id = req.user._id.toString();
  next();
});

const multerConfig = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new AppError("Please upload an image.", 400));
    }

    cb(undefined, true);
  },
});

const postAvatar = catchAsync(async (req, res) => {
  const buffer = await sharp(req.file.buffer)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.status(201).send({
    status: "success",
  });
});

const deleteAvatar = catchAsync(async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

const getUserAvatar = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError("Invalid ID.", 400));
  }

  const user = await User.findById(req.params.id).select("+avatar");

  if (!user || !user.avatar) {
    return next(new AppError("No document or avatar found with that ID", 404));
  }

  res.set("Content-Type", "image/png");
  res.send(user.avatar);
});

const uploadImageMulterMiddleware = multerConfig.single("avatar");

const deleteOneUser = factory.deleteOne<IUser>(User);
const updateOneUser = factory.updateOne<IUser>(User);
const getAllUsers = factory.getAll<IUser>(User);
const getOneUser = factory.getOne<IUser>(User);

export {
  deleteOneUser,
  updateOneUser,
  getAllUsers,
  getOneUser,
  getMe,
  assignIdToUrl,
  multerConfig,
  postAvatar,
  deleteAvatar,
  getUserAvatar,
  uploadImageMulterMiddleware
};
