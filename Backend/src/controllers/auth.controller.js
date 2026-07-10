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


export const sendLoginOtp = async (req, res) => {
    try {
        const { identifiers } = req.body;

        const user = await User.findOne({ $or: [{ email: identifiers }, { username: identifiers }] }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "Invalid credentials"
            })
        }


        if (!user.isVerified && user.authProvider === 'local') {
            return res.status(401).json({
                success: false,
                error: "pl verify your email "
            })
        }


        const otp = await createOTP(user.email, 'login');
        await sendOtpEmail(user.email, otp.otp, 'login');


        res.status(200).json({
            success: true,
            message: ' otp sent for login',


        })

    } catch (error) {
        console.error("====== ERROR ======");
        console.error(error);
        console.error(error.stack);

        res.status(400).json({
            success: false,
            destination: login,
            error: error.message
        })
    }
}
export const login = async (req, res) => {
    try {
        const { identifiers, password } = req.body;

        const user = await User.findOne({ $or: [{ email: identifiers }, { username: identifiers }] }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "Invalid credentials"
            })
        }


        if (!user.isVerified && user.authProvider === 'local') {
            return res.status(401).json({
                success: false,
                error: "pl verify your email "
            })
        }



        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: "wrong password"
            })
        }


        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'login success full',
            data: {
                token: token,
                user: {
                    user: {
                        id: user._id,
                        name: user.name,
                        userName: user.username,
                        email: user.email,
                        isVerified: user.isVerified
                    }
                }
            }
        })

    } catch (error) {
        console.error("====== ERROR ======");
        console.error(error);
        console.error(error.stack);

        res.status(400).json({
            success: false,
            destination: login,
            error: error.message
        })
    }
}

export const verifyLoginOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        await verifyOTP(email, otp, 'login');
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        const token = generateToken(user._id);
        
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username
                }
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const googleCallback = (req, res) => {
    const { user, token } = req.user;
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        const otpRecord = await createOTP(email, 'reset');
        await sendOTPEmail(email, otpRecord.otp, 'reset');
        
        res.json({
            success: true,
            message: 'OTP sent to your email'
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        
        await verifyOTP(email, otp, 'reset');
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        user.password = newPassword;
        await user.save();
        
        res.json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};


export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const logout = async (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};