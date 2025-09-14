import mongoose from "mongoose";


const fieldsSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "inprogress", "completed"],
        default: "pending"
    }
    
}, {timestamps : true})


export const Task = mongoose.model("Task", fieldsSchema)