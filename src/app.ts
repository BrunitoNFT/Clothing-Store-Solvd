import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import userRouter from "./routes/userRoute";
import productRouter from "./routes/productRoute";

import handleGlobalErrors from "./utils/handlerError";

import { AppError } from "./utils";

import "./utils/jwtHandcraft";
import "./controller/authController";

const app = express();

app.use(cookieParser());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/* if (process.env.NODE_ENV === "development") {
  console.log("Morgan activated");
  app.use(morgan("dev"));
} */
app.use(morgan("dev"));

app.use("/users", userRouter);
app.use("/products", productRouter);

app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(handleGlobalErrors);

export default app;
