import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
    const {username, fullName, email, password} = req.body;
    if (
        [username, fullName, email, password].some( (field)=>field?.trim()=== "" )
    )
    {
        throw new ApiError(400,"All the fields are required");
    }
    const existedUser = await User.findOne({
        $or: [{email}, {username}]
    });
    if (existedUser) {
        throw new ApiError(409, "Username or Email already exists");    
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar){
        throw new ApiError(400, "Avatar is required");
    }
    const user = await User.create({
        username,
        fullName,
        email,
        password,
        avatar: avatar.url,
        username: username.toLowerCase(),
        coverImage: coverImage?.url || "",
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken"); //by default select all fields except password and refreshToken
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }
    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    )

})

export {registerUser}   