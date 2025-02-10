// Import mongoose and Schema from mongoose package
import mongoose, { Schema } from "mongoose";
// Import pagination plugin for mongoose aggregation
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
// Create a new mongoose schema for videos
const videoSchema = new Schema(
  {
    // Field for storing video file URL/path
    videoFile: {
      type: String,
      required: true,
    },
    // Field for storing video title
    title: {
      type: String,
      required: true,
    },
    // Field for storing video description
    description: {
      type: String,
      required: true,
    },
    // Field for storing video duration
    duration: {
      type: numeber,
      required: true,
    },
    // Field for tracking video views count
    views: {
      type: numeber,
      default: 0,
    },
    // Field to control video visibility
    isPublished: {
      type: Boolean,
      default: true,
    },
    // Reference field to link video with user who uploaded it
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  // Enable timestamps to track creation and update times
  {
    timestamps: true,
  }
);

// Add pagination plugin to the schema
videoSchema.plugin(mongooseAggregatePaginate);
// Create and export the Video model using the schema
export const Video = mongoose.model("Video", videoSchema);