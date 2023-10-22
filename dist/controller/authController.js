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
exports.verifyRanges = exports.allowTo = exports.protect = exports.signup = exports.login = void 0;
const jwtHandcraft_1 = __importDefault(require("../utils/jwtHandcraft"));
const utils_1 = require("../utils");
const userModel_1 = __importDefault(require("../models/userModel"));
const utils_2 = require("../utils");
const mongoose_1 = __importDefault(require("mongoose"));
//const SECRET_KEY = process.env.SECRET_PASSWORD || "secretkey";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d";
const JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN || "30d";
const signToken = (payload) => {
    return jwtHandcraft_1.default.signToken(payload, { expiresIn: JWT_EXPIRES_IN });
};
const createAndSendToken = (user, statusCode, res) => {
    const token = signToken({ _id: user._id });
    const cookieOptions = {
        expires: new Date(Date.now() + jwtHandcraft_1.default.parseTimeToMilliseconds(JWT_COOKIE_EXPIRES_IN)),
        httpOnly: true,
    };
    //if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    res.status(statusCode).json({
        status: "success",
        data: {
            user,
            token,
        },
    });
};
const signup = (0, utils_2.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body:_ ", req.body);
    const { name, email, password, dateOfBirth } = req.body;
    const newUser = (yield userModel_1.default.create({
        name,
        email,
        password,
        dateOfBirth,
    }));
    createAndSendToken(newUser, 201, res);
}));
exports.signup = signup;
const login = (0, utils_2.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new utils_1.AppError("Please provide email and password!", 400));
    }
    // 2) Check if user exists && password is correct
    const user = yield userModel_1.default.findByCredentials({ email, password });
    // 3) If everything ok, send token to client
    createAndSendToken(user, 200, res);
}));
exports.login = login;
const protect = (0, utils_2.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 1) Getting token and check of it's there
    let token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
    if (token === undefined &&
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        console.log("check 1");
        return next(new utils_1.AppError("You are not logged in! Please log in to get access", 401));
    }
    // 2) Verification token
    const decoded = jwtHandcraft_1.default.verifyToken(token);
    console.log("Decoded is: ", decoded);
    // 3) Check if user still exists
    const currentUser = yield userModel_1.default.findById(decoded._id);
    if (!currentUser) {
        return next(new utils_1.AppError("The user belonging to this token doesn't exist.", 401));
    }
    // 4) Check if user changed password after the token was issued
    /*  if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError("User recently changed password! Please log in again.", 401)
      );
    } */
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
}));
exports.protect = protect;
const allowTo = (...roles) => {
    return (0, utils_2.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!roles.includes(req.user.role)) {
            return next(new utils_1.AppError("You do not have permission to perform this action", 403));
        }
        next();
    }));
};
exports.allowTo = allowTo;
const verifyRanges = (0, utils_2.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.user: ", req.user);
    console.log("req.params.id:_ ", req.params.id);
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        return next(new utils_1.AppError("Invalid ID.", 400));
    }
    const userToDelete = yield userModel_1.default.findById(req.params.id);
    if (!userToDelete) {
        return next(new utils_1.AppError("No document found with that ID", 404));
    }
    console.log("userToDelete: ", userToDelete);
    if (userToDelete.role === "admin") {
        return next(new utils_1.AppError("You can't modify or delete a user with ADMIN role.", 403));
    }
    next();
}));
exports.verifyRanges = verifyRanges;
