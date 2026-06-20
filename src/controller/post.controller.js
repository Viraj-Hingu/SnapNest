import { toFile } from "@imagekit/nodejs";
import { imagekit } from "../config/imageKit.js";
import postModel from "../model/post.model.js";
import userModel from "../model/auth.model.js";
import likeModel from "../model/like.model.js";


export const createPost = async (req, res) => {
    try {
        const file = req.file
        const { caption } = req.body

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required.",
            });
        }

        const uploadFile = await toFile(file.buffer, file.originalname);
        const response = await imagekit.files.upload({
            file: uploadFile,
            fileName: `${Date.now()}-${file.originalname}`,
            folder: "/users",
        });

        const post = await postModel.create({
            caption,
            image: response.url,
            user: req.user.id
        })

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const getPost = async (req, res) => {
    try {
        const userId = req.user.id
        if (!userId) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        const post = await postModel.find({ user: userId })

        res.status(200).json({
            message: "Post found",
            post,
            count: post.length

        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }


}

export const getPostDetails = async (req, res) => {
    const postId = req.params.postId
    const userId = req.user.id

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "Post not found",
            success: false
        })
    }

    const isValidUser = post.user.toString() === userId

    if (!isValidUser) {
        return res.status(403).json({
            message: "Forbidden Content"
        })
    }

    res.status(200).json({
        message: "Post found",
        post
    })

}

export const getAllPost = async (req, res) => {
    try {
        const userId = req.user.id;

        const posts = await Promise.all(
            (await postModel
                .find().sort({ _id: -1 })
                .populate("user", "name email bio profilePicture")
                .lean()
            ).map(async (post) => {
                const [isLiked, likeCount] = await Promise.all([
                    likeModel.findOne({ post: post._id, user: userId }),
                    likeModel.countDocuments({ post: post._id })
                ]);
                post.isLiked = !!isLiked;
                post.likeCount = likeCount;
                return post;
            })
        );

        return res.status(200).json({
            success: true,
            message: posts.length ? "Posts found" : "No posts found",
            posts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
