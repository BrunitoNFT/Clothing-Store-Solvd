/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
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

interface IJWTPayload {
  [key: string]: any;
  iss?: string | undefined;
  sub?: string | undefined;
  aud?: string | string[] | undefined;
  exp?: number | undefined;
  nbf?: number | undefined;
  iat?: number | undefined;
  jti?: string | undefined;
}

interface RequestUser extends Request {
  user: IUser;
}

interface MyDocument extends Document {
  [key: string]: unknown; // This tells TypeScript this could be an object with any string keys.
}

// Interface for the query string parameters (customize this interface based on your needs and actual query parameters you expect)
interface QueryStringParameters {
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
  [key: string]: string | undefined; // for other dynamic properties
}
