"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ImageSchema = new mongoose_1.default.Schema({
    data: { type: Buffer, select: false },
    href: String,
});
const ProductSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: { type: Number, min: [0, "Min price is $0"], required: true },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, "Min stock is 0"],
    },
    images: {
        type: [ImageSchema],
        select: true,
    },
}, { timestamps: true });
//This index can be helpful when querying products based on the owner (user).
ProductSchema.index({ owner: 1 });
const Product = mongoose_1.default.model("Product", ProductSchema);
exports.default = Product;
