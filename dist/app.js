"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const handlerError_1 = __importDefault(require("./utils/handlerError"));
const utils_1 = require("./utils");
require("./utils/jwtHandcraft");
require("./controller/authController");
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json()); // for parsing application/json
app.use(express_1.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use((0, morgan_1.default)("dev"));
app.use("/users", userRoute_1.default);
app.use("/products", productRoute_1.default);
app.use("*", (req, res, next) => {
    next(new utils_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(handlerError_1.default);
exports.default = app;
