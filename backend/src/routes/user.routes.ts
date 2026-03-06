import express from "express";
import {upload} from "../middlewares/multer.middleware";
import {requireAnyAuth} from "../middlewares/role.middleware";
import {updateUser} from "../controllers/user.controllers";

const userRoutes = express.Router();

userRoutes.post(
  "/update",
  requireAnyAuth,
  upload.fields([{name: "avatar", maxCount: 1}]),
  updateUser,
);

export default userRoutes;
