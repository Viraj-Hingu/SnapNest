import { Router } from "express";
import { createPost, getAllPost, getPost, getPostDetails } from "../controller/post.controller.js";
import multer from "multer"
import authMiddleware from "../middleware/auth.middleware.js";

const uploads = multer({ storage: multer.memoryStorage() })
const postRouter = Router()

postRouter.post("/", authMiddleware, uploads.single("image"), createPost)
postRouter.get("/getpost", authMiddleware, getPost)
postRouter.get("/details/:postId", authMiddleware, getPostDetails)
postRouter.get("/feed", authMiddleware, getAllPost)

export default postRouter