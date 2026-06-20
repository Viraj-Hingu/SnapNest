import mongoose from "mongoose";
import { config } from "./config.js";


const connectToDb = async () => {
    try {
        await mongoose.connect(config.MONGO_URI)
        console.log("Database is Connected");

    } catch (error) {
        console.log("Error While connecting", error);
    }
}
export default connectToDb