import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import otpRoutes from "./routes/otpRoutes.js";
import { otplimit } from "./middlewares/limit.js";

dotenv.config();

connectDB();

const app=express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000

app.use("/api/otp", otplimit, otpRoutes);

app.get("/", (req,res) => {
    console.log("OTP API IS RUNNING.....");
})

app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);

