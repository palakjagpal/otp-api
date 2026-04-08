import client from "../util/twilio.js";
import otpModel from "../models/model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//Send otp controller
export const sendOTP = async(req,res) => {
    try{
        const { phone } = req.body;

        if(!phone){
            console.log("Phone number is required");
            return res.status(400).json({ message : "Phone number is required" })
        }

        await client.verify.v2.services(process.env.SERVICE_SID).verifications.create(
            {
                to : phone,
                channel : "sms",
            }
        )

        console.log("OTP sent");
        res.json(
            {
                message : "OTP sent"
            }
        )
    }catch(err){
        console.log("Error sending OTP");
        res.status(500).json(
            {
                message : "Error sending OTP"
            }
        )
    }
}

//Verify OTP controller
export const verifyOTP = async(req,res) =>{
    try{
        const { phone, otp } = req.body;

        if(!phone || !otp){
            return res.status(400).json(
                {
                    message : "Phone and OTP are required"
                }
            )
        }

        const phone_regex = /^\+\d{10,15}$/;
        if(!phone_regex.test(phone)){
            return res.status(400).json(
                {
                    message : "Invalid phone format. Use +91xxxxxxxxxx"
                }
            )
        }

        const verification = await client.verify.v2.services(process.env.SERVICE_SID).verificationChecks.create(
            {
                to : phone,
                code : otp,
            }
        )

        if(verification.status !== "approved"){
            console.log("Invalid OTP");
            return res.status(400).json(
                {
                    message : "Invalid OTP"
                }
            )
        }

        let user = await otpModel.findOne(
            {
                phone
            }
        )

        if(!user){
            user = await otpModel.create(
                {
                    phone, isVerified : true,
                }
            )
        }else{
            user.isVerified=true;
            await user.save();
        }

        const token = jwt.sign(
            {
                id : user._id,
                phone : user.phone
            },
            process.env.JWT_SECRET,
            {
                expiresIn : "7d"
            }
        );

        console.log("OTP verified successfully!");
        res.json(
            {
                success : true,
                message : "OTP verified successfully",
                data :{
                    user, token,
                },
            }
        )
    }catch(err){
        console.log("Error in verifying OTP");
        return res.status(500).json(
            {
                message : err.message
            }
        )
    }
}
