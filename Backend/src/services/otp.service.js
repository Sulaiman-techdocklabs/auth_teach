import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import sendEmail from "./email.service.js";
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()//"958618" 
}
export const createOTP = async (email, purpose) => {
    await OTP.deleteMany({ email, purpose, verified: False });
    const otp = generateOTP();
    const newOTP = await OTP.create({ email, purpose, otp });
    return newOTP;
}
export const verifyOTP = async (email, purpose, otp) => {

    const otpsRecord = await OTP.findOne({ email, purpose, otp });
    if (!otpsRecord) {
        throw new Error('invalid token')  }
    otpsRecord.verified = true;
    await otpsRecord.save();
    if (purpose === 'signup') {
        await User.findOneAndUpdate({ email }, { isVerified: true });  }
}
export const sendOtpEmail = async (email, otp, purpose) => {
    let subject, message;
    if (purpose === "signup") {
        subject = "verify email"
        message = `Sign up  otp :${otp}` }
    else if (purpose === "login") {
        subject = "verify login"
        message = `log in   otp :${otp}`}
    else if (putpose === "reset") {
        subject = "verify reset"
        message = `reset  otp :${otp}`
    }

    await (sendEmail, subject, message);
}