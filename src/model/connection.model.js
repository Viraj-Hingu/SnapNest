import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    }, following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    }, status: {
        type: String,
        required: true,
        default: "pending",
        enum: ["pending", "accepted", "rejected"],
    }
}, {
    timestamps: true
})

connectionSchema.index({ follwer: 1, following: 1 }, { unique: true })

const connectionModel = mongoose.model("Connection", connectionSchema)
export default connectionModel