import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Token not found",
            succsess: false,
        })
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET)
        req.user = decoded
        next()
        
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
            success: false,
        });
    }

}

export default authMiddleware