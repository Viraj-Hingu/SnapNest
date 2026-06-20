import userModel from "../model/auth.model.js";
import connectionModel from "../model/connection.model.js";

export const followUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const followingId = req.params.id;

        if (userId === followingId) {
            return res.status(400).json({
                success: false,
                message: "You can't follow yourself",
            });
        }

        const userToFollow = await userModel.findById(followingId);

        if (!userToFollow) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const alreadyFollowing = await connectionModel.findOne({
            follower: userId,
            following: followingId,
        });

        // UNFOLLOW
        if (alreadyFollowing) {
            await connectionModel.findByIdAndDelete(alreadyFollowing._id);

            return res.status(200).json({
                success: true,
                isFollowing: false,
                message: `Unfollowed ${userToFollow.name}`,
            });
        }

        // FOLLOW
        await connectionModel.create({
            follower: userId,
            following: followingId,
        });

        res.status(201).json({
            success: true,
            isFollowing: true,
            status: "pending",
            message: `Following ${userToFollow.name}`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getFollowers = async (req, res) => {
    try {
        const userId = req.user.id

        const myFollower = await connectionModel.find({
            following: userId
        }).populate("follower", "name profilePicture")


        const follower = myFollower.map((item) => item.follower)
        res.status(200).json({
            message: "You're follower is follwing below",
            success: true,
            count: myFollower.length,
            follower
        })
    } catch (error) {
        return res.status(500).json({
            messgage: error.message,
            success: false
        })
    }

}

export const getFollowing = async (req, res) => {
    try {
        const userId = req.user.id

        const myFollowing = await connectionModel.find({
            follower: userId,
            status: { $in: ["pending", "accepted"] }
        }).populate("following", "name profilePicture")

        const following = myFollowing
            .filter((item) => item.following)
            .map((item) => ({
                ...item.following.toObject(),
                status: item.status,
                isFollowing: true,
            }))

        res.status(200).json({
            message: "You're following the users below",
            success: true,
            count: following.length,
            following
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const acceptedReq = async (req, res) => {
    try {
        const requestId = req.params.id
        const userId = req.user.id

        const request = await connectionModel.findById(requestId)

        if (!request) {
            return res.status(404).json({
                message: "request not found",
                success: true
            })
        }
        if (request.following.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }
        // enum: ["pending", "accepted", "rejected"],
        request.status = "accepted"
        await request.save()

        return res.status(200).json({
            message: "Request accepted",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const rejectReq = async (req, res) => {
    try {
        const requestId = req.params.id
        const userId = req.user.id

        const request = await connectionModel.findById(requestId)

        if (!request) {
            return res.status(404).json({
                message: "request not found",
                success: true
            })
        }
        if (request.following.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }
        request.status = "rejected"
        await request.save()

        return res.status(200).json({
            message: "Request rejected",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const showPendingReq = async (req, res) => {
    const userId = req.user.id;

    const pendingReq = await connectionModel
        .find({
            following: userId,
            status: "pending",
        })
        .populate("follower", "name profilePicture");



    res.status(200).json({
        success: true,
        count: pendingReq.length,
        pendingReq
    });
};

export const getUser = async (req, res) => {
    const userId = req.user.id;

    const users = await userModel
        .find({ _id: { $ne: userId } })

    const followingConnections = await connectionModel.find({
        follower: userId,
    });

    const followingIds = followingConnections.map(
        (item) => item.following.toString()
    );

    const result = users.map((user) => ({
        ...user.toObject(),
        isFollowing: followingIds.includes(user._id.toString()),
    }));

    res.status(200).json({
        success: true,
        count: result.length,
        users: result,
    });
};

