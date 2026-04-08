import rateLimit from "express-rate-limit";

export const otplimit = rateLimit(
    {
        windowMs : 60*1000,
        max : 10,
        message : "Your limit has been exceeded, try later !"
    }
)