import mongoose,{Schema} from "mongoose"; // Importing mongoose and Schema from mongoose package
import jwt from "jsonwebtoken"; // Importing jsonwebtoken for token generation
import bcrypt from "bcrypt"; // Importing bcrypt for password hashing


const userSchema = new Schema( // Defining the user schema

    {
        username: { // Username field

            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true
        },
        email: { // Email field

            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        fullname: { // Full name field

            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: { // Avatar field (cloudinary URL)

            type: String, //cloudinary url is used
            required: true,
                
        },
        coverImage: { // Cover image field

            type: String,
        },
        watchHistory: [ // Array of watched videos

            {
                type : Schema.Types.ObjectId,
                ref : 'Video',
            }
        ],
        password: { // Password field

            type : String,
            required : [true, "Password is required"],  
        },
        refrashToken: { // Refresh token field

            type : String
        }
    },
    {
        timestamps:true
    }
)
/**
 * Middleware function that hashes the user's password before saving it to the database.
 * This function is executed before the 'save' event is triggered on the user schema.
 * It checks if the password has been modified, and if so, it hashes the password using bcrypt
 * with a cost factor of 10 before saving it to the database.
 */
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Proceed if password is modified


    this.password = await bcrypt.hash(this.password, 10); // Hashing the password before saving

    next()
})
userSchema.methods.isPasswordCorrect = async function (password) { // Method to check if password is correct

    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = function() { // Method to generate access token

    jwt.sign(
        {
            _id: this._id,
            email : this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expireIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function() { // Method to generate refresh token

    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expireIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema); // Creating the user model