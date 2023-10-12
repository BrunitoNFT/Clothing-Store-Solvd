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
const _1 = require("./");
const _2 = require("./");
/**
 * TODO replace utils by ./
 */
const productModel_1 = __importDefault(require("../models/productModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const deleteOne = (Model) => (0, _1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return next(new _2.AppError("Invalid ID.", 400));
    }
    const doc = yield Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new _2.AppError("No document found with that ID", 404));
    }
    res.status(204).json({
        status: "success",
        data: null,
    });
}));
const updateOne = (Model) => (0, _1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return next(new _2.AppError("Invalid ID.", 400));
    }
    const doc = yield Model.findById(req.params.id).select("+password");
    if (!doc) {
        return next(new _2.AppError("No document found with that ID", 404));
    }
    console.log("doc: ", doc);
    Object.keys(req.body).forEach((key) => {
        console.log("Key: ", key);
        if (key in doc) {
            console.log("Passed");
            doc[key] = req.body[key];
        }
    });
    console.log("doc2: ", doc);
    yield doc.save();
    res.status(200).json({
        status: "success",
        data: doc,
    });
}));
const createOne = (Model) => (0, _1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("create one: ", req.body);
    const aditionalProperties = {};
    console.log("Model: ", Model.modelName);
    console.log("Model instanceof Product", Model instanceof productModel_1.default);
    if (Model.modelName === "Product") {
        console.log("I enter the if in createone");
        const userId = req.user._id;
        aditionalProperties.owner = userId;
    }
    const doc = yield Model.create(Object.assign(Object.assign({}, req.body), aditionalProperties));
    res.status(201).json({
        status: "success",
        data: doc,
    });
}));
const getOne = (Model) => (0, _1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return next(new _2.AppError("Invalid ID.", 400));
    }
    const query = Model.findById(req.params.id);
    const doc = yield query;
    if (!doc) {
        return next(new _2.AppError("No document found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: doc,
    });
}));
const getAll = (Model) => (0, _1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = Model.find();
    const doc = yield query;
    res.status(200).json({
        status: "success",
        results: doc.length,
        data: doc,
    });
}));
exports.default = { getAll, getOne, createOne, deleteOne, updateOne };
//# sourceMappingURL=handlerFactory.js.map