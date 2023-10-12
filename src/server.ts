import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "./app.js";

dotenv.config({ path: ".env" });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is up and running on port " + port);
});

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("DB connection successful!"));
