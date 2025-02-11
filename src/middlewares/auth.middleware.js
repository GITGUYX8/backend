import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
try {
        const token = req.cookie?.accessToken() || req.header("Authorization")?.replace("Bearer ","")
        if (!token) {
            throw new ApiError(401, "Unauthorized");
        }
        const decordedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        User.findById(decordedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "invalid access token ");
        }
        req.user = user;
        next()
} catch (error) {
    throw new ApiError(401, "invalid access token");
}
})