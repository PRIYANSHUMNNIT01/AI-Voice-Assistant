import express from "express";
import { getCurrentUser, updateAssistant } from "../controller/user.controller.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js"

const UserRouter = express.Router();

UserRouter.get("/current",isAuth,getCurrentUser)
UserRouter.post("/update",isAuth,upload.single("assistantImage"),updateAssistant)

export default UserRouter;
