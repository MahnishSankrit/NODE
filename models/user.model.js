
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
    {

        username: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "password is required"],
            minlength: [6, "password cannot be less than 6 characters"],
            maxlength: [128, "password cannot exceed than 128 characters"]
        },
        fullname: {
            type: String,
            required: true,
            trim : true,
            index: true
        },
        refreshtoken: {
            type: String
        },
        role: {
            type: String,
            enum: ["user", "agent", "consumer"],
            default: "user",
            required: [true, "role is required"]
        }
    },
    {
        timestamps : true
    }   
)


// this is pre save hook runs before save or create  and use to compare the password
userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();  // only work when the password is changed

    this.password = await bcrypt.hash(this.password, 10) // this will generate and hash for the passworf and
    next()
})

//method for the comparisino
userSchema.methods.ispasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}


//THIS WILL GENERATE THE ACCESS TOKEN
userSchema.methods.generateAcessToken = function(){
    return jwt.sign(
        {
            //this is a payload 
            _id : this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// THIS WILL GENERATE THE REFRESH TOKEN
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            // this is the payload
            _id : this._id,
            role: this.role
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model("User", userSchema);
