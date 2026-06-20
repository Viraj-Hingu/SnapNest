import { Router } from "express";
import multer from "multer";
import authMiddleware from "../middleware/auth.middleware.js";
import { getMe, login, register, logout } from "../controller/auth.controller.js";

const authRouter = Router()
const uploads = multer({ storage: multer.memoryStorage() })

authRouter.post("/register", uploads.single("profilePicture"), register)
authRouter.post("/login", login)
authRouter.post("/logout", logout)
authRouter.get("/getme", authMiddleware, getMe)

export default authRouter
