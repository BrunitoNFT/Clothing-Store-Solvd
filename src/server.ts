import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import mongoose from "mongoose";

import app from "./app";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is up and running on port " + port);
});

mongoose
  .connect(process.env.DATABASE_URL_CONTAINER)
  .then(() => console.log("DB CONTAINER connection successful!"))
  .catch((e) => {
    console.log("There was an error connecting with the CONTAINER database.");
    process.exit();
  });
