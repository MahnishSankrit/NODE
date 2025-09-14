
import { User } from "../models/user.model.js";
import  jwt  from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynhandler.js";


const generateAccessAndRefreshToken = async(userId)=> {
    try {
        const user = await User.findById(userId)
        const acessToken = user.generateAcessToken()
        const refreshToken = user.generateRefreshToken()

        if(!user){
            throw new ApiError(404, "user not found")
        }
        user.refreshtoken = refreshToken
        await user.save({validateBeforeSave : false})

        return ({acessToken, refreshToken})

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating the refresh and acess token")
    }
}


const register = asynchandler(async(req, res) => {
    const {username, email, password, fullname , role} = req.body

    if(!username){
        throw new  ApiError(400, "username is required")
    }
    if(!email){
        throw new ApiError(400, "email is required")
    }
    if(!password){
        throw new ApiError(400, "password is required")
    }
    if(!fullname){
        throw new ApiError(400, "fullname is required")
    }

    const existedUser = await User.findOne( // findone is a method to check the exixtenc of any entity in the db
         {
            $or: [
                {
                    username
                },
                {
                    email
                }
            ]
         }
    )
    if(existedUser){
        throw new ApiError(400, "username or email is alredy existed")
    }

    
    const user = await User.create({
        fullname,
        username,
        email,
        password,
        role: role || "user" 
    })

    // cheking the user is created successfully or not
    const createdUser =  await User.findById(user._id)
    if(!createdUser){
        throw new ApiError(500, "something went wrong while creating the user")
    }
    await User.findById(user._id).select("-password -refreshtoken")


    return res.status(201)
    .json(
        new ApiResponse( 
            201,
            createdUser,
            "user is successfully created"
        )
    )
    
})


const login = asynchandler(async(req, res) => {
    console.log("REQ BODY:", req.body);
    const {email , password} = req.body  // destructed the field

    if(!email || !password){
        throw new ApiError(400, "email is required for login")
    }
    const user = await User.findOne({email}) // seraching for the user 
    if(!user){
        throw new ApiError(400, "user is not present")  // if not user the throw error 
    }

    const userPassword = await user.ispasswordCorrect(password) // comparing the password 
    if(!userPassword){  // if not matched throe the error
        throw new ApiError(401, " user credential are invalid") 
    }

    const {acessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password, -refreshToken")

    return res.status(201)
    .json(
        new ApiResponse(
            201,
           {
            user: loggedInUser, acessToken, refreshToken
           },
           "user logged in successfully"
        )
    )    

})

const logout = asynchandler(async(req, res) => {
    await User.findByIdAndUpdate( 
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {new: true}

    )
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "user loggedout successfully"
        )
    )
})



export {
    register,
    login,
    logout
}