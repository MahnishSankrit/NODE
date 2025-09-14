
import mongoose, { Types } from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,

        },
        content:{
            type: String,
            required: true,
        },
        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        likes:[ 
            { 
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: false
            }
        ],
        tags:{
            type: [String],
            default:[]
        },
        commentCount: {
            type: Number,
            default : 0
        },
        isPublished: {
            type: Boolean,
            default: false
        },
        shares:{
            type: Number,
            default: 0
        }
        
    },
    {timestamps: true}
)

export const Post = mongoose.model("Post", postSchema)