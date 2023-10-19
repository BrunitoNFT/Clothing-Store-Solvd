"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOneProduct = exports.getOneProduct = exports.getAllProducts = exports.updateOneProduct = exports.deleteOneProduct = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const handlerFactory_1 = __importDefault(require("../utils/handlerFactory"));
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
