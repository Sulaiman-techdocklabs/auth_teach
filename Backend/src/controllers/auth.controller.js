import User from "../models/user.model.js";
import { sendEmail, verificationEmailTemplate } from "../services/email.service.js";
import { createOTP, verifyOTP, sendOtpEmail } from "../services/otp.service.js";
import { generateToken } from "../services/token.service.js";


export const signup = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "email or username already taken"
            })
        }

        const newUser = await User.create({ name, email, password, username });

        const verifucationtoken = newUser._id + Math.randam().toString(36);
        newUser.verificationToken = verifucationtoken;
        await username.save();

        await verificationEmailTemplate(email, verifucationtoken);

        const token = generateToken(newUser._id);

        res.status(201).json({
            success: true,
            message: "user created successfully",
            data: {
                token: token,
                user: {
                    id: newUser_id,
                    name: newUser.name,
                    userName: newUser.username,
                    email: newUser.email,
                    isVerified: newUser.isVerified
                }
            }
        })



    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        })
    }
}

export const verifyEmail = async (req, res) => {
    
}