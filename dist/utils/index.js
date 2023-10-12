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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.catchAsync = exports.invalidKeys = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            console.log("There was an unexpected error catched by catchasync.");
            console.log("Error is: ", error);
            return next(error);
        });
    };
};
exports.catchAsync = catchAsync;
const invalidKeys = (invalidKeysArr) => {
    return catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        invalidKeysArr.forEach((invalidKey) => {
            if (Object.keys(req.body).includes(invalidKey)) {
                return next(new AppError(`The property ${invalidKey} cannot be changed by this method. `, 404));
            }
        });
        next();
    }));
};
exports.invalidKeys = invalidKeys;
//# sourceMappingURL=index.js.map