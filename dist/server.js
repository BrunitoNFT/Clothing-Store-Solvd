"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT || 3000;
app_1.default.listen(port, () => {
    console.log("Server is up and running on port " + port);
});
mongoose_1.default
    .connect(process.env.DATABASE_URL_CONTAINER)
    .then(() => console.log("DB CONTAINER connection successful!"))
    .catch((e) => {
    console.log("There was an error connecting with the CONTAINER database.");
    process.exit();
});
