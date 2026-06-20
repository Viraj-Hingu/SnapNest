import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name must be unique"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email must be unique"],
        unique: true
    },
    bio: {
        type: String,
        default: "",
    },
    profilePicture: {
        type: String,
        default: "https://toppng.com/uploads/preview/instagram-default-profile-picture-11562973083brycehrmyv.png",
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    }
})

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

const userModel = mongoose.model("User", userSchema)
export default userModel