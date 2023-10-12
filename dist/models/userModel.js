"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../utils");
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        require: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
        validate(value) {
            const today = new Date();
            const birthDate = new Date(value);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                throw new utils_1.AppError("You must be at least 18 years old to use our services.", 400);
            }
        },
    },
    email: {
        type: String,
        trim: true,
        require: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new utils_1.AppError(`The email provided ${value} is invalid.`, 404);
            }
        },
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    password: {
        type: String,
        select: false,
        minlength: 6,
        required() {
            return this.isNew; // Only required when creating a new user
        },
        validate(value) {
            if (value.includes("password")) {
                throw new Error("Invalid password.");
            }
        },
    },
});
userSchema.virtual("products", {
    ref: "Product",
    localField: "_id",
    foreignField: "owner",
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            this.password = yield bcryptjs_1.default.hash(this.password, 8);
        }
        next();
    });
});
userSchema.statics.findByCredentials = ({ email, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ email }).select("+password");
    if (!user) {
        throw new utils_1.AppError("Credentials are invalid.", 400);
    }
    const isMatch = bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new utils_1.AppError("Credentials are invalid.", 400);
    }
    user.password = undefined;
    return user;
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=userModel.js.map