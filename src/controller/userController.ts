import { catchAsync } from "../utils";

import User from "../models/userModel";
import factory from "../utils/handlerFactory";
import { NextFunction, Response } from "express";
import { RequestUser, IUser } from "../types";

const getMe = catchAsync(async (req: RequestUser, res: Response) => {
  res.status(200).send({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

const deleteMeMiddleware = catchAsync(
  async (req: RequestUser, _, next: NextFunction) => {
    req.params.id = req.user._id.toString();
    next();
  }
);

const deleteOneUser = factory.deleteOne<IUser>(User);
const updateOneUser = factory.updateOne<IUser>(User);
const getAllUsers = factory.getAll<IUser>(User);
const getOneUser = factory.getOne<IUser>(User);

export {
  deleteOneUser,
  updateOneUser,
  getAllUsers,
  getOneUser,
  getMe,
  deleteMeMiddleware,
};
