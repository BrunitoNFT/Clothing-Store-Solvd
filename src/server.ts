import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import mongoose from "mongoose";

import app from "./app";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is up and running on port " + port);
});

console.log(
  "Environment: ",
  process.env.DATABASE_ENV,
  process.env.DATABASE_URL_CONTAINER
);

if (process.env.DATABASE_ENV === "CONTAINER") {
  mongoose
    .connect(process.env.DATABASE_URL_CONTAINER)
    .then(() => console.log("DB CONTAINER connection successful!"))
    .catch((e) => {
      console.log("There was an error connecting with the CONTAINER database.");
      process.exit();
    });
} else if (process.env.DATABASE_ENV === "CLOUD") {
  mongoose
    .connect(process.env.DATABASE_URL_REMOTE)
    .then(() => console.log("DB CLOUD connection successful!"))
    .catch((e) => {
      console.log("There was an error connecting with the cloud database.");
      process.exit();
    });
} else {
  console.log("There is an unexpected behaviour with environment variables.");
  process.exit();
}
