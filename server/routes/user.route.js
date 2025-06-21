import express from "express";
import { askToAssistant, getCurrentUser, updateAssistant } from "../controller/user.controller.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js"

const UserRouter = express.Router();

UserRouter.get("/current",isAuth,getCurrentUser)
UserRouter.post("/update",isAuth,upload.single("assistantImage"),updateAssistant)
UserRouter.post("/ask",isAuth,askToAssistant)

export default UserRouter;
