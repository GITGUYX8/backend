import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2" ;
const videoSchema = new Schema(
    {
        videoFile: {
            type : String,
            required: true
        },
        title: {
            type : String,
            required: true
        },
        description: {
            type : String,
            required: true
        },
        duration: {
            type : numeber,
            required: true
        },
        views: {
            type : numeber,
            default : 0
        },
        isPublished :{
            type : Boolean,
            default : true, 
        },
        owner :{
            type : Schema.Types.ObjectId,
            ref : 'User',
        }
    },
    {
        timestamps: true
    }
    
)