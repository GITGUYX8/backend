// Import cloudinary v2 package and rename it as cloudinary
import {v2 as cloudinary} from 'cloudinary';
// Import file system module from node.js
import fs from "fs";

// Configure cloudinary with credentials from environment variables
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Set cloud name from env variable
    api_key: process.env.CLOUDINARY_API_KEY , // Set API key from env variable
    api_secret: process.env.CLOUDINARY_API_SECRET // Set API secret from env variable
});

// Function to upload file to cloudinary - takes local file path as parameter
const uploadFileOnCloudinary = async (localFilePath) => {
    try {
        // Check if file path exists, return null if not
        if (!localFilePath) return null
        // Upload file to cloudinary with auto resource type detection
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
    })
    // Log success message with uploaded file URL
    console.log("file is uploaded on cloudinary", response.url)
    // Return the complete response from cloudinary
    return response 
    }
    catch (error){
        // Delete local file if upload fails
        fs.unlinkSync(localFilePath) 
        // Return null to indicate upload failure
        return null
    }
}
