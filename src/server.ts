import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import mongoose from "mongoose";

import app from "./app";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is up and running on port " + port);
});

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("DB connection successful!"));
