import { NextFunction, Request, Response } from "express";
import { Document, Model, ObjectId } from "mongoose";

import APIFeatures from "./apiFeatures";

import { catchAsync } from "./";
import { AppError } from "./";
/**
 * TODO replace utils by ./
 */
import Product from "../models/productModel";
import mongoose from "mongoose";
import { RequestUser, MyDocument, QueryStringParameters } from "../types";

const deleteOne = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError("Invalid ID.", 400));
    }
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

const updateOne = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError("Invalid ID.", 400));
    }
    const doc: MyDocument = await Model.findById(req.params.id).select(
      "+password"
    );

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    console.log("doc: ", doc);

    Object.keys(req.body).forEach((key) => {
      console.log("Key: ", key);
      if (key in doc) {
        console.log("Passed");
        doc[key] = req.body[key];
      }
    });

    console.log("doc2: ", doc);

    await doc.save();

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });
const createOne = <T>(Model: Model<T>) =>
  catchAsync(async (req: RequestUser, res: Response) => {
    console.log("create one: ", req.body);
    const aditionalProperties: Record<string, string | ObjectId> = {};
    console.log("Model: ", Model.modelName);
    console.log("Model instanceof Product", Model instanceof Product);
    if (Model.modelName === "Product") {
      console.log("I enter the if in createone");
      const userId = req.user._id;
      aditionalProperties.owner = userId;
    }

    const doc = await Model.create({ ...req.body, ...aditionalProperties });

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

const getOne = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new AppError("Invalid ID.", 400));
    }
    const query = Model.findById(req.params.id);
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

const getAll = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response) => {
    const query = new APIFeatures(
      Model.find(),
      req.query as QueryStringParameters
    )
      .filter()
      .limitFields()
      .paginate()
      .sort();

    const [doc, total] = await Promise.all([
      query.query.exec(), // Executes the query to get documents based on filtering and pagination
      query.totalDocuments(), // Executes the query to get the total number of documents
    ]);
    const obj: {
      status: string;
      results: number;
      currentPage?: number;
      totalPages?: number;
      data: Document[];
    } = {
      status: "success",
      results: doc.length,
      data: doc,
    };
    if (query.page) {
      obj.currentPage = query.page;
      obj.totalPages = Math.ceil(total / query.limit);
      if (obj.currentPage > obj.totalPages || obj.currentPage <= 0) {
        throw new AppError(
          `The page ${obj.currentPage} doesn't exist. Total pages count is ${obj.totalPages}.`,
          400
        );
      }
    }

    res.status(200).json(obj);
  });

export default { getAll, getOne, createOne, deleteOne, updateOne };
