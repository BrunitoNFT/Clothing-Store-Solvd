import { NextFunction, Request, Response } from "express";
import { IAppError } from "../types";

import { AppError } from "./";
import { CastError, MongooseError } from "mongoose";
import mongoose from "mongoose";

const handleCastErrorDB = (err: CastError) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: MongooseError) => {
  let value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  value = value.substring(1, value.length - 1);
  console.log(value);

  const message = `The value ${value} is already in use. Please use another one!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: mongoose.Error.ValidationError) => {
  console.log("handleValidationErrorDB: is ", err);
  const errors = Object.values(err.errors).map((er: Error) => er.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleMongoServerError = (err: MongooseError) => {
  console.log("handleMongoServerError: ", err.name, err.message);
  return new AppError(
    "There was an unexpected error in the server. Please try again later.",
    500
  );
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err: IAppError, res: Response) => {
  console.log("sendErrorDev");
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: IAppError, res: Response) => {
  // Operational, trusted error: send message to client
  console.log("sendErrorProd");
  if (err.isOperational) {
    console.log("Error: ", err, err.message);
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      status: err.status,
      message: "Something went wrong. " + err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    return res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Something went very wrong. " + err.message ? err.message : "",
    });
  }
};

const globalError = (
  err: IAppError & MongooseError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.log("GLOBAL ERROR HANDLING: ");

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.log("HANDLING ERROR", err);

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { message: err.message, name: err.name, ...err };

    console.log("error", error);

    if (error.name === "CastError")
      error = handleCastErrorDB(error as unknown as CastError);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(
        error as unknown as mongoose.Error.ValidationError
      );
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    if (error.name === "MongoServerError")
      error = handleMongoServerError(error);

    sendErrorProd(error, res);
  }
};

export default globalError;
