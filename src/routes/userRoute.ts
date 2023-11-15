import express from "express";

import {
  login,
  signup,
  protect,
  allowTo,
  verifyRanges,
} from "../controller/authController";

import {
  getMe,
  deleteOneUser,
  updateOneUser,
  getAllUsers,
  getOneUser,
  assignIdToUrl,
  postAvatar,
  deleteAvatar,
  getUserAvatar,
  uploadImageMulterMiddleware,
} from "../controller/userController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
/**
 * ! Starting from this endpoint all users should be logged in
 */
router.use(protect); //
//
router.get("/me", getMe);
router.delete("/me", assignIdToUrl, deleteOneUser);
//
router.get("/me/avatar", assignIdToUrl, getUserAvatar);
router.get("/:id/avatar", getUserAvatar);
router.post("/me/avatar", uploadImageMulterMiddleware, postAvatar);
router.delete("/me/avatar", deleteAvatar);
/**
 * ! Starting from this endpoint all users should be admin
 */
router.use(allowTo("admin"));
//
router.get("/:id", getOneUser);
router.get("/", getAllUsers);
/**
 * ! We have to verify if the user who is editing or deleting has a higher hierarchy
 */ verifyRanges;
router.put("/:id", verifyRanges, updateOneUser); // optionally -> invalidKeys(["password"])
router.delete("/:id", verifyRanges, deleteOneUser);
//
export default router;
