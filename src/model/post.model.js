import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User not found"]
    },
    
})

const postModel = mongoose.model("Post", postSchema)
export default postModel