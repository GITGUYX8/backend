// Import express framework for building web applications
import express from 'express';
// Import cookie-parser middleware for handling cookies
import cookieParser from 'cookie-parser';
// Import cors middleware for handling Cross-Origin Resource Sharing
import cors from 'cors';

// Create an express application instance
const app = express();

// Configure CORS middleware with specified origin and credentials
// Configure CORS middleware with options
app.use(cors({
    // Allow requests only from specified origin in environment variables
    origin: process.env.CORS_ORIGIN,
    // Allow credentials (cookies, authorization headers) to be sent with requests
    credentials: true
}))// Parse incoming JSON payloads with 16kb limit
app.use(express.json({limit: "16kb"}))
// Parse URL-encoded bodies with extended mode and 16kb limit
app.use(express.urlencoded({extended: true, limit: "16kb"}))
// Serve static files from the 'public' directory
app.use(express.static("public"))
// Parse cookies in incoming requests
app.use(cookieParser()); //debug - newly added line

// Import user routes from the routes directory
import userRouter from "./routes/user.routes.js"

// Mount the user router on the '/api/v1/users' path
app.use("/api/v1/users", userRouter)

// Export the configured express application
export {app}