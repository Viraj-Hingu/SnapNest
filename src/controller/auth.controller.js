import jwt from "jsonwebtoken"
import { toFile } from "@imagekit/nodejs"
import userModel from "../model/auth.model.js"
import { config } from "../config/config.js"
import { imagekit } from "../config/imageKit.js"
import bcrypt from "bcrypt"
import connectionModel from "../model/connection.model.js"
import likeModel from "../model/like.model.js"


export const register = async (req, res) => {
    try {
        const {
            name,
            email,
            bio,
            password
        } = req.body
        const file = req.file

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Profile picture is required",
            })
        }

        if (!file.mimetype?.startsWith("image/")) {
            return res.status(400).json({
                success: false,
                message: "Only image files are allowed",
            })
        }

        const isUserAlreadyExist = await userModel.findOne({
            $or: [
                { email }, { name }
            ]
        })

        if (isUserAlreadyExist) {
            return res.status(409).json({
                message: "User is already exists",
                success: false,
                error: "User is already exists"
            })
        }

        const uploadFile = await toFile(file.buffer, file.originalname)
        const response = await imagekit.files.upload({
            file: uploadFile,
            fileName: `${Date.now()}-${file.originalname}`,
            folder: "/users/profile",
        })

        const user = await userModel.create({
            name,
            email,
            bio,
            profilePicture: response.url,
            password
        })
        const userData = await userModel.findById(user._id).select("+password")

        const token = jwt.sign({
            id: user._id
        }, config.JWT_SECRET, {
            expiresIn: "7D"
        })


        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.status(201).json({
            message: "User get register",
            userData,
            token,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
export const login = async (req, res) => {
    const { identity, password } = req.body

    const user = await userModel.findOne({
        $or: [
            { email: identity }, { name: identity }
        ]
    }).select("+password")

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false
        })
    }

    const isValidPassowrd = await bcrypt.compare(password, user.password)
    if (!isValidPassowrd) {
        return res.status(401).json({
            message: "Invalid credentials",
            success: false
        });
    }

    const userData = await userModel.findById(user._id)
    const token = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, {
        expiresIn: "7D"
    })


    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
        message: "User get login",
        userData,
        token,
        success: true
    })
}
export const getMe = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await userModel
            .findById(userId)
        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {


        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
export const deleteUser = async (req, res) => {
    const userId = req.params.id;

    await postModel.deleteMany({ user: userId });

    await likeModel.deleteMany({ user: userId });

    await connectionModel.deleteMany({
        $or: [
            { follower: userId },
            { following: userId }
        ]
    });

    await userModel.findByIdAndDelete(userId);

    res.status(200).json({
        success: true,
        message: "User and all related data deleted",
    });
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
};

