import { Router } from "express";
import { getProfile } from "../controller/profile.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const profileRouter = Router()

profileRouter.get("/", authMiddleware, getProfile)
export default profileRouter