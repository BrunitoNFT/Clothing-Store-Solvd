"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_js_1 = __importDefault(require("./app.js"));
dotenv_1.default.config({ path: ".env" });
const port = process.env.PORT || 3000;
app_js_1.default.listen(port, () => {
    console.log("Server is up and running on port " + port);
});
mongoose_1.default
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("DB connection successful!"));
//# sourceMappingURL=server.js.map