import express from "express";
import passport from "passport";
import { protect } from "../middlewares/auth.js";
import {
    signup,
    verifyEmail,
    // login,
    // sendLoginOtp,
    // loginOtpVerify,
    // googleCallback,
    // forgotPassword,
    // resetPassword
    // , getMe
    // , logout
} from "../controllers/auth.controller.js";


const router = express.Router();


router.post("/signup", signup);
router.get("/verify-email/:token", verifyEmail);

// router.post("/login", login);
// router.post("/login-otp/send", sendLoginOtp);
// router.post("/login-otp/verify", loginOtpVerify);

// router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), googleCallback);


// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);

// router.get("/me", protect, getMe);
// router.post("/logout", protect, logout);

export default router;