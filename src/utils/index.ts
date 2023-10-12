import { NextFunction, Response } from "express";
import { RequestUser } from "../types";

class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  constructor(message: string, statusCode: number) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const catchAsync = (
  fn: (req: RequestUser, res: Response, next: NextFunction) => Promise<void>
): ((req: RequestUser, res: Response, next: NextFunction) => void) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error: Error) => {
      console.log("There was an unexpected error catched by catchasync.");
      console.log("Error is: ", error);
      return next(error);
    });
  };
};

const invalidKeys = (invalidKeysArr: string[]) => {
  return catchAsync(async (req, res, next) => {
    invalidKeysArr.forEach((invalidKey) => {
      if (Object.keys(req.body).includes(invalidKey)) {
        return next(
          new AppError(
            `The property ${invalidKey} cannot be changed by this method. `,
            404
          )
        );
      }
    });
    next();
  });
};

export { invalidKeys, catchAsync, AppError };
