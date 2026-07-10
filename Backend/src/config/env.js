import dotenv from "dotenv";
dotenv.config();

export const config={
    port:process.env.PORT || 5000,
    mongoURI:process.env.MONGODB_URI,
    jwtSecret:process.env.JWT_SECRET,
    jwtExpire:process.env.JWT_EXPIRE,
    sessionSecret:process.env.SESSION_SECRET,
    emailPassword:process.env.EMAIL_PASSWORD,
    email:process.env.EMAIL,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5000',
}