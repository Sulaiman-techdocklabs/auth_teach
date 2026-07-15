import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns/promises";

dotenv.config();

// Force Node.js to use stable Google DNS servers for resolving URLs
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (dnsError) {
  console.warn("Warning: Could not set custom DNS servers:", dnsError.message);
}

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ DB connection error: MONGODB_URI is undefined in your .env file.");
    process.exit(1);
  }

  // Obfuscate password in console logs for safety
  const safeLogUri = uri.replace(/:([^:@]+)@/, ":******@");
  console.log(`📡 Attempting to connect to: ${safeLogUri}`);

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ Database connected successfully!`);
    console.log(`🏠 Host: ${conn.connection.host}`);
    console.log(`📂 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ DB connection error details:");
    console.error(`  - Code: ${error.code || "N/A"}`);
    console.error(`  - Message: ${error.message}`);
    if (error.syscall) console.error(`  - Syscall: ${error.syscall}`);
    if (error.hostname) console.error(`  - Hostname: ${error.hostname}`);
    
    process.exit(1);
  }
};