import dotenv from 'dotenv' // Import dotenv package for environment variables
import connectDB from "./db/index.js" // Import database connection function
import {app} from "./app.js" //Import express app instance

dotenv.config({
    path: './env'
}) // Configure dotenv with environment file path

connectDB() // Call database connection function
.then(()=>{ // Handle successful connection
    app.listen(process.env.PORT || 8000, ()=>{ // Start server on specified port or default to 8000
        console.log(`Server is running on port ${process.env.PORT}`); // Log server start message
    })
})
.catch((err)=>{ // Handle connection error
    console.log("mongodb connection failed",err); // Log database connection error
})/*
import mongoose from 'mongoose';
import { DB_NAME } from './constants.js';

import express from 'express';

const app = express()

(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.error("error:", error);
            throw error
        })
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
    })
}
        catch (error) {
            console.error("error:", error);
            throw error
    }
})
    */