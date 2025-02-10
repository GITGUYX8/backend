import { Router } from "express"; // Import Router class from express framework
import { registerUser } from "../controllers/user.controller.js"; // Import registerUser function from user controller
import { upload } from "../middlewares/multer.middleware.js"; // Import upload middleware for handling file uploads
const router = Router(); // Create a new router instance

router.route("/register").post( // Define a POST route for user registration
  upload.fields([  // Configure multer middleware to handle multiple file uploads
    {
      name: "avatar", // Specify the field name for avatar file upload
      maxCount: 1,    // Allow only 1 file for avatar
    },
    {
      name: "coverImage", // Specify the field name for cover image file upload
      maxCount: 1,        // Allow only 1 file for cover image
    },
  ]),
  registerUser // Handle the registration logic after file upload
);

export default router; // Export the router for use in other parts of the application