/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Document, ObjectId, Model } from "mongoose";

interface IAppError extends Error {
  name: string;
  statusCode: number;
  status: string;
  isOperational: boolean;
  code?: number;
}

interface IUser extends Document {
  _id: ObjectId;
  dateOfBirth: Date;
  role: "user" | "admin";
  name: string;
  email: string;
  password: string;
}

interface IProduct extends Document {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  owner: ObjectId;
  stock: number;
}

interface IUserModel extends Model<IUser> {
  findByCredentials({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<IUser>;
}

interface IJWTPayload extends JwtPayload {
  _id: string;
  iat: number;
  exp: number;
}

interface RequestUser extends Request {
  user: IUser;
}

interface MyDocument extends Document {
  [key: string]: unknown; // This tells TypeScript this could be an object with any string keys.
}
