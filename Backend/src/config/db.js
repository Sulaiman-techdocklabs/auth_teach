import mongoose from "mongoose";
import { config } from "./env.js";


export const connectDB= async ()=>{

    try {
        await mongoose.connect(config.mongoURI);
        console.log(" db connected");
    } catch (error) {
        console.error(" db not connecting");
        process.exit(1);
    }
}