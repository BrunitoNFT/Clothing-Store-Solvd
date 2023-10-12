import { NextFunction } from "express";

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { AppError } from "../utils";
import { IUserModel, IUser } from "../types";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    require: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
    validate(value: string) {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        throw new AppError(
          "You must be at least 18 years old to use our services.",
          400
        );
      }
    },
  },

  email: {
    type: String,
    trim: true,
    require: true,
    unique: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new AppError(`The email provided ${value} is invalid.`, 404);
      }
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    select: false,
    minlength: 6,
    required() {
      return this.isNew; // Only required when creating a new user
    },
    validate(value: string) {
      if (value.includes("password")) {
        throw new Error("Invalid password.");
      }
    },
  },
});

userSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "owner",
});

userSchema.pre("save", async function (next: NextFunction) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.statics.findByCredentials = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Credentials are invalid.", 400);
  }
  const isMatch = bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Credentials are invalid.", 400);
  }
  user.password = undefined;
  return user;
};

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
