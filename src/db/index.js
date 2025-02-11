// Import mongoose package for MongoDB interactions
import mongoose from "mongoose";
// Import database name from constants file
import { DB_NAME } from "../constants.js";

// Define an async function to connect to MongoDB
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using environment variables and DB name
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        // Log successful connection with host information
        console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
    }
    catch (error) {
        // Log any connection errors that occur
        console.log("MONGODB connection error ",error);
        // Exit process with failure code if connection fails
        process.exit(1);

    }
}

// Export the connectDB function for use in other files
export default connectDB; //debug - new line