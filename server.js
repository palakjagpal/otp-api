import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { otpLimiter } from "./middleware/rateLimiter.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Apply limiter to OTP routes
app.use("/api/auth", otpLimiter, authRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);