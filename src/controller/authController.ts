
import jwtHandcraft from "../utils/jwtHandcraft";

import { AppError } from "../utils";

import User from "../models/userModel";
import { catchAsync } from "../utils";
import mongoose, { ObjectId } from "mongoose";
import { Response } from "express";
import { IUser, IJWTPayload } from "../types";

//const SECRET_KEY = process.env.SECRET_PASSWORD || "secretkey";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d";
const JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN || "30d";

const signToken = (payload: { _id: ObjectId }) => {
  return jwtHandcraft.signToken(payload, { expiresIn: JWT_EXPIRES_IN });
};

const createAndSendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = signToken({ _id: user._id });
  const cookieOptions = {
    expires: new Date(
      Date.now() + jwtHandcraft.parseTimeToMilliseconds(JWT_COOKIE_EXPIRES_IN)
    ),
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

const signup = catchAsync(async (req, res) => {
  console.log("req.body:_ ", req.body);
  const { name, email, password, dateOfBirth } = req.body;
  const newUser = (await User.create({
    name,
    email,
    password,
    dateOfBirth,
  })) as unknown as IUser;
  createAndSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findByCredentials({ email, password });

  // 3) If everything ok, send token to client
  createAndSendToken(user, 200, res);
});

const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token = req.cookies?.jwt;

  if (
    token === undefined &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    console.log("check 1");
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  // 2) Verification token
  const decoded = jwtHandcraft.verifyToken(token) as IJWTPayload;
  console.log("Decoded is: ",decoded)
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded._id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token doesn't exist.", 401)
    );
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
});

const allowTo = (...roles: string[]) => {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  });
};

const verifyRanges = catchAsync(async (req, res, next) => {
  console.log("req.user: ", req.user);
  console.log("req.params.id:_ ", req.params.id);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError("Invalid ID.", 400));
  }
  const userToDelete = await User.findById(req.params.id);
  if (!userToDelete) {
    return next(new AppError("No document found with that ID", 404));
  }
  console.log("userToDelete: ", userToDelete);
  if (userToDelete.role === "admin") {
    return next(
      new AppError("You can't modify or delete a user with ADMIN role.", 403)
    );
  }
  next();
});

export { login, signup, protect, allowTo, verifyRanges };
