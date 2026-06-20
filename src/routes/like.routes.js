import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { likePost } from "../controller/like.controller.js";

const likeRouter = Router()

likeRouter.post("/:id", authMiddleware, likePost)

export default likeRouter
