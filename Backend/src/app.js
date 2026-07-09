import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.routes.js"; 

const app= express();
await connectDB();

app.use(express.json())
app.use(express.urlencoded({ extended : true }))
const frontendURL = "http://192.168.88.11:5500";

app.use(cors({
    origin: frontendURL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/test', (req, res) => {
    res.json({ 
        message: '✅ CORS is working!',
        frontend: frontendURL,
        backend: `http://localhost:${process.env.PORT || 5000}`
    });
});
app.use('/api/auth',authRouter)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});
export default app;
//domain.com/api/auth/signup 