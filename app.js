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

app.use("/api/otp", otplimit, otpRoutes);

app.get("/",(req,res) =>{
  res.send("<h1>Otp api is running.....</h1>")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

