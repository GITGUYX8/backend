// Import ApiError class for handling API errors
import { ApiError } from "../utils/ApiError.js";
// Import asyncHandler middleware for handling async operations
import {asyncHandler} from "../utils/asyncHandler.js"
// Import cloudinary upload function for handling file uploads
import {uploadOnCloudinary} from "../utils/cloudinary.js"
// Import User model for database operations
import { User } from "../models/user.model.js";
// Import ApiResponse class for standardized API responses
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAcessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const acessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.acessToken = acessToken

    } catch (error) {
        throw new ApiError(500, "Internal Server Error");
    }

}
// Register user controller wrapped in asyncHandler
const registerUser = asyncHandler(async (req, res) => {
    // Destructure required fields from request body
    const {username, fullName, email, password} = req.body;
    // Check if any required field is empty
    if (
        [username, fullName, email, password].some( (field)=>field?.trim()=== "" )
    )
    {
        throw new ApiError(400,"All the fields are required");
    }
    // Check if user already exists with same l or usemaiername
    const existedUser = await User.findOne({
        $or: [{email}, {username}]
    });
    // If user exists, throw error
    if (existedUser) {
        throw new ApiError(409, "Username or Email already exists");    
    }
    // Get avatar and cover image paths from uploaded files
    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path; //--throw error if cover image is not uploaded
    let avatarLocalPath ;
    if (req.files?.avatar && Array.isArray(req.files.avatar) && req.avatar.length > 0 ) {
        const avatarLocalPath = req.files?.avatar[0]?.path;
    }
    if (req.files?.coverImage && Array.isArray(req.files.coverImage) && req.coverImage.length > 0 ) {
        const coverImageLocalPath = req.files?.coverImage[0]?.path;
    }
    // Check if avatar is uploaded
    if (!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }
    // Upload avatar and cover image to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // Verify if avatar upload was successful
    if (!avatar){
        throw new ApiError(400, "Avatar is required");
    }
    // Create new user in database
    const user = await User.create({
        username,
        fullName,
        email,
        password,
        avatar: avatar?.url || "",
        username: username.toLowerCase(),
        coverImage: coverImage?.url || "",
    })
    // Fetch created user without password and refreshToken
    const createdUser = await User.findById(user._id).select("-password -refreshToken"); //by default select all fields except password and refreshToken
    // Check if user was created successfully
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }
    // Return success response with created user data
    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    )

})

const loginUser = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !email) {
        throw new ApiError(400, "Username and email are required");
    }
    const user = await User.findOne({ username, email });
        {
            $or: [{username},{email}]
        }
    if (!user){
        throw new ApiError(404,"user does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid){
        throw new ApiError(401, "invalid credencials")
    }
    const {acessToken,refreshToken}= await generateAcessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const option = {
        secure: true,
        httpOnly: true,
    }
    return res
    .status(200)
    .cookie("accessToken",acessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,acessToken,refreshToken
            },
            "user logged in successfully"

        )
    )
})
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken:undefined
            },
        },
        {
            new:true
        }
    )
})
const options = {
    secure: true,
    httpOnly: true,
}

return res
.status(200)
.clearCookie("accessToken",options)

 const refresAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken){
        throw new ApiError(401, "unatuhorized request");
    }
   try {
     const decodedToken = jwt.verify(
         incoming.refreshToken,
         process.env.REFRESH_TOKEN_SECRET,
     )
     const user = User.findById(decodedToken._id)
     if (!user){
         throw new ApiError(401, "invalid refresh token");
     }
     if (user?.refreshToken !== incomingRefreshToken){
         throw new ApiError(404, "refresh token is expired");
     }
     const options = {
         httpOnly: true,
         secure: true,
     }
     const {acessToken, newRefreshToken} = await generateAcessAndRefreshToken(user._id);
 
     return res
     .status(200)
     .cookie("accessToken",acessToken,options)
     .cookie("refreshToken",newRefreshToken,options)
     .json(
         new ApiResponse(
             200,
             {
                 user: acessToken,refreshToken : newRefreshToken
             },
             "acess token refreshed successfully"
            )
 )}
    catch (error) {
        throw new ApiError(401, error?.message ||  "invalid refresh token");
    
   }
 })
// Export registerUser controller

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {oldPassword,newPassword} = req.body;
    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect){    
        throw new ApiError(401, "invalid old password");
    }
    user.password = newPassword;
    await user.save({validateBeforeSave:false});
})

const getCurrentUser = asyncHandler(async (req, res ) => {
    return res 
    .status(200)
    .json(
        200,
        req.user,
        "current user fetched successfully")

})
const upadateAccountDetails = asyncHandler(async (req, res) => {

    const user = User.findById(req.user._id,
    {
        $set: {
            fullName: fullName,
            email: email,
        },
        new: true,
    }
    ).select("-password")

return res
.status(200)
.json(
    new ApiResponse(
        200,
        user,
        "user updated successfully"
    ))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath){
        throw new ApiError(400, "avatar is not present");

    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    
})


    

export {registerUser,
    loginUser,
    logoutUser,
    refresAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    upadateAccountDetails
}   