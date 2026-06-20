import authMiddleware from "../middleware/auth.middleware.js"
import userModel from "../model/auth.model.js";
import connectionModel from "../model/connection.model.js";
import postModel from "../model/post.model.js"


export const getProfile = async (req, res) => {
    const userId = req.user.id;

    const [
        user,
        posts,
        followersCount,
        followingCount
    ] = await Promise.all([
        userModel.findById(userId),
        postModel.find({ user: userId }),
        connectionModel.countDocuments({ following: userId }),
        connectionModel.countDocuments({ follower: userId }),
    ]);

    const profile = {
        user,
        posts,
        postCount: posts.length,
        followersCount,
        followingCount,
    };

    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        profile,
    });
};