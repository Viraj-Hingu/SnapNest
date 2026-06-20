import likeModel from "../model/like.model.js"
import postModel from "../model/post.model.js"
import userModel from "../model/auth.model.js"


export const likePost = async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;

    const alreadyLiked = await likeModel.findOne({
        user: userId,
        post: postId,
    });

    if (alreadyLiked) {
        await likeModel.findByIdAndDelete(alreadyLiked._id);

        return res.json({
            success: true,
            liked: false,
            message: "Post unliked",
        });
    }

    await likeModel.create({
        user: userId,
        post: postId,
    });

    res.json({
        success: true,
        liked: true,
        message: "Post liked",
    });
};