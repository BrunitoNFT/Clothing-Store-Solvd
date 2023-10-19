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
exports.deleteMeMiddleware = exports.getMe = exports.getOneUser = exports.getAllUsers = exports.updateOneUser = exports.deleteOneUser = void 0;
const utils_1 = require("../utils");
const userModel_1 = __importDefault(require("../models/userModel"));
const handlerFactory_1 = __importDefault(require("../utils/handlerFactory"));
const getMe = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({
        status: "success",
        data: {
            user: req.user,
        },
    });
}));
exports.getMe = getMe;
const deleteMeMiddleware = (0, utils_1.catchAsync)((req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.params.id = req.user._id.toString();
    next();
}));
exports.deleteMeMiddleware = deleteMeMiddleware;
const deleteOneUser = handlerFactory_1.default.deleteOne(userModel_1.default);
exports.deleteOneUser = deleteOneUser;
const updateOneUser = handlerFactory_1.default.updateOne(userModel_1.default);
exports.updateOneUser = updateOneUser;
const getAllUsers = handlerFactory_1.default.getAll(userModel_1.default);
exports.getAllUsers = getAllUsers;
const getOneUser = handlerFactory_1.default.getOne(userModel_1.default);
exports.getOneUser = getOneUser;
