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

        const verifucationtoken = newUser._id + Math.random().toString(36);
        newUser.verificationToken = verifucationtoken;
        await newUser.save();

        await verificationEmailTemplate(email, verifucationtoken);

        const token = generateToken(newUser._id);

        res.status(201).json({
            success: true,
            message: "user created successfully",
            data: {
                token: token,
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    userName: newUser.username,
                    email: newUser.email,
                    isVerified: newUser.isVerified
                }
            }
        })



    } catch (error) {
    console.error("====== ERROR ======");
    console.error(error);
    console.error(error.stack);

    return res.status(400).json({
        success: false,
        destination: "signup",
        error: error.message
    });
}
    
}

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "Invalid verification token"
            })
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        })
    }

}