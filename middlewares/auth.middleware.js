
// for the auth middleware it is like a security guard at the gate
// ckeck the id-->tokens
// if valid then pass to the next()
//if not valid deny entry or res.status(403)

// now the question comes where will the tokens comes
/*
1. header --> http header  --> authorization: bearer <token>  --> mainly header is use for the building api for mobile/frontend
2. cookies -->take the access token stored in httponly cookies -->more secure for the web pages --> it is used for building api for the webpages
*/

import jwt from "jsonwebtoken";
import { asynchandler } from "../utils/asynhandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";

export const auth =  asynchandler(async(req, res ,next) => {

    const token = req.header('Authorization')?.replace("Bearer ","")

    if(!token) {
        return res.status(401).json({ message: "mo authorization token" })
    }
    
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            const user = await User.findById(decoded._id).select("-password -refreshtoken") 
            if(!user){
                throw new ApiError(401, "no authorization")
            }
            req.user = user // attaching data to the request
            next();
        } catch (error) {
            throw new ApiError(401 ,error.message || "no unaurtorized access")
        }
    })

