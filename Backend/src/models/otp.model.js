import mongoose, { Types } from "mongoose";


const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    purpose: {
        type: String,
        require: true,
        enum: ['login', 'signup', 'verify', 'reset']
    },
    verified: {
        type: Boolean,
        default: false,

    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 5 * 60 * 1000)
    }
}, { timestamps: true });

otpSchema = index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;