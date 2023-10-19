"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
router.post("/signup", authController_1.signup);
router.post("/login", authController_1.login);
/**
 * ! Starting from this endpoint all users should be logged in
 */
router.use(authController_1.protect); //
//
router.get("/me", userController_1.getMe);
router.delete("/me", userController_1.deleteMeMiddleware, userController_1.deleteOneUser);
/**
 * ! Starting from this endpoint all users should be admin
 */
router.use((0, authController_1.allowTo)("admin"));
//
router.get("/:id", userController_1.getOneUser);
router.get("/", userController_1.getAllUsers);
/**
 * ! We have to verify if the user who is editing or deleting has a higher hierarchy
 */ authController_1.verifyRanges;
router.put("/:id", authController_1.verifyRanges, userController_1.updateOneUser); // optionally -> invalidKeys(["password"])
router.delete("/:id", authController_1.verifyRanges, userController_1.deleteOneUser);
//
exports.default = router;
