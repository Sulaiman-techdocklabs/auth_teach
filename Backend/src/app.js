import express from "express";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";

const app= express();
await connectDB();

app.use(express.json())
app.use(express.urlencoded({ extended : true }))



export default app;
