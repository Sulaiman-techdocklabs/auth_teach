import express from "express";
import cors from "cors";
import dotenv from "dotenv";
config();
import { config } from "dotenv";
import session from 'express-session';
import passport from 'passport';
import { errorHandler } from './middlewares/errorHandler.js';
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.routes.js"; 
import attendanceRoutes from "./routes/attendance.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import './config/passport.js';


const app= express();
await connectDB();

app.use(express.json())
app.use(express.urlencoded({ extended : true }))
const allowedOrigins = [
    'http://localhost:5500',
    'http://localhost:8000',
    'http://127.0.0.1:5500',
    'http://192.168.88.19:5500',
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`⚠️ CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.url} - Origin: ${req.headers.origin || 'local'}`);
    next();
});


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));


app.get('/test', (req, res) => {
    res.json({ 
        message: '✅ CORS is working!',
        frontend: frontendURL,
        backend: `http://localhost:${process.env.PORT || 5000}`
    });
});
app.use('/api/auth',authRouter);
app.use("/api/attendance", attendanceRoutes);

app.use("/api/leaves", leaveRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

app.use((err, req, res, next) => {
    console.error('💥 Error:', err.message);
    console.error(err.stack);
    
    // CORS error
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            success: false,
            error: 'Origin not allowed by CORS policy'
        });
    }
    
    // Mongoose errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }
    
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});

export default app;