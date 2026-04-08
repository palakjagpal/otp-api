import { Timestamp } from "bson";
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        phone : {
            type : String,
            required : true,
        },

        isVerified : {
            type : Boolean,
            default : false,
        },
    },
    {Timestamp : true}
)

const otpModel = mongoose.model("otpModel",otpSchema);

export default otpModel;