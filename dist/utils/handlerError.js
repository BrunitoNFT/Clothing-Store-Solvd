"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new _1.AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    let value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    value = value.substring(1, value.length - 1);
    console.log(value);
    const message = `The value ${value} is already in use. Please use another one!`;
    return new _1.AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
    console.log("handleValidationErrorDB: is ", err);
    const errors = Object.values(err.errors).map((er) => er.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new _1.AppError(message, 400);
};
const handleMongoServerError = (err) => {
    console.log("handleMongoServerError: ", err.name, err.message);
    return new _1.AppError("There was an unexpected error in the server. Please try again later.", 500);
};
const handleJWTError = () => new _1.AppError("Invalid token. Please log in again!", 401);
const handleJWTExpiredError = () => new _1.AppError("Your token has expired! Please log in again.", 401);
const sendErrorDev = (err, res) => {
    console.log("sendErrorDev");
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    console.log("sendErrorProd");
    if (err.isOperational) {
        console.log("Error: ", err, err.message);
        res.status(err.statusCode).json({
            statusCode: err.statusCode,
            status: err.status,
            message: err.message,
        });
        // Programming or other unknown error: don't leak error details
    }
    else {
        // 1) Log error
        console.error("ERROR 💥", err);
        // 2) Send generic message
        res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Something went very wrong!",
        });
    }
};
const globalError = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    console.log("GLOBAL ERROR HANDLING: ");
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    console.log("HANDLING ERROR", err);
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let error = Object.assign({ message: err.message, name: err.name }, err);
        console.log("error", error);
        if (error.name === "CastError")
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (error.name === "ValidationError")
            error = handleValidationErrorDB(error);
        if (error.name === "JsonWebTokenError")
            error = handleJWTError();
        if (error.name === "TokenExpiredError")
            error = handleJWTExpiredError();
        if (error.name === "MongoServerError")
            error = handleMongoServerError(error);
        sendErrorProd(error, res);
    }
};
exports.default = globalError;
