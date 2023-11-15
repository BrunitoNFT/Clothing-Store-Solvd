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
exports.uploadImageMulterMiddleware = exports.getUserAvatar = exports.deleteAvatar = exports.postAvatar = exports.multerConfig = exports.assignIdToUrl = exports.getMe = exports.getOneUser = exports.getAllUsers = exports.updateOneUser = exports.deleteOneUser = void 0;
const utils_1 = require("../utils");
const userModel_1 = __importDefault(require("../models/userModel"));
const handlerFactory_1 = __importDefault(require("../utils/handlerFactory"));
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const mongoose_1 = __importDefault(require("mongoose"));
const getMe = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({
        status: "success",
        data: {
            user: req.user,
        },
    });
}));
exports.getMe = getMe;
const assignIdToUrl = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.params.id = req.user._id.toString();
    next();
}));
exports.assignIdToUrl = assignIdToUrl;
const multerConfig = (0, multer_1.default)({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new utils_1.AppError("Please upload an image.", 400));
        }
        cb(undefined, true);
    },
});
exports.multerConfig = multerConfig;
const postAvatar = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const buffer = yield (0, sharp_1.default)(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
    req.user.avatar = buffer;
    yield req.user.save();
    res.status(201).send({
        status: "success",
    });
}));
exports.postAvatar = postAvatar;
const deleteAvatar = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.user.avatar = undefined;
    yield req.user.save();
    res.send();
}));
exports.deleteAvatar = deleteAvatar;
const getUserAvatar = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return next(new utils_1.AppError("Invalid ID.", 400));
    }
    const user = yield userModel_1.default.findById(req.params.id).select("+avatar");
    if (!user || !user.avatar) {
        return next(new utils_1.AppError("No document or avatar found with that ID", 404));
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
}));
exports.getUserAvatar = getUserAvatar;
const uploadImageMulterMiddleware = multerConfig.single("avatar");
exports.uploadImageMulterMiddleware = uploadImageMulterMiddleware;
const deleteOneUser = handlerFactory_1.default.deleteOne(userModel_1.default);
exports.deleteOneUser = deleteOneUser;
const updateOneUser = handlerFactory_1.default.updateOne(userModel_1.default);
exports.updateOneUser = updateOneUser;
const getAllUsers = handlerFactory_1.default.getAll(userModel_1.default);
exports.getAllUsers = getAllUsers;
const getOneUser = handlerFactory_1.default.getOne(userModel_1.default);
exports.getOneUser = getOneUser;
