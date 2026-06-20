import express from "express"
import cookieParser from "cookie-parser"
import connectToDb from "../src/config/database.js"
import authRouter from "./routes/auth.routes.js"
import postRouter from "./routes/post.routes.js"
import connectionRouter from "./routes/connection.routes.js"
import likeRouter from "./routes/like.routes.js"
import profileRouter from "./routes/profile.routes.js"
import path from "path"
import { fileURLToPath } from "url"


const app = express()
connectToDb()

app.use(cookieParser())
app.use(express.json())
app.use("/api/auth", authRouter)
app.use("/api/post", postRouter)
app.use("/api/connection", connectionRouter)
app.use("/api/like", likeRouter)
app.use("/api/profile", profileRouter)

const fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileName);

app.use(express.static(path.join(__dirname, "..", "public")));
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});



export default app