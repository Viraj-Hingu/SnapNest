import { Router } from "express";
import {
  acceptedReq,
  followUser,
  getFollowers,
  getFollowing,
  getUser,
  rejectReq,
  showPendingReq,
} from "../controller/connection.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const connectionRouter = Router()

connectionRouter.post("/follow/:id", authMiddleware, followUser)

connectionRouter.get("/followers", authMiddleware, getFollowers)
connectionRouter.get("/following", authMiddleware, getFollowing)
connectionRouter.patch("/request/accept/:id", authMiddleware, acceptedReq)
connectionRouter.patch("/request/reject/:id", authMiddleware, rejectReq)
connectionRouter.get("/users", authMiddleware, getUser)
connectionRouter.get("/pending", authMiddleware, showPendingReq)

export default connectionRouter
