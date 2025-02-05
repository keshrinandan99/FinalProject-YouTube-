import { asyncHandler } from "../utils/AsyncHandler.js";
import { users }from '../models/users.models.js'
import { ApiError } from "../utils/ApiError.js";
import jwt, { decode } from 'jsonwebtoken'

    export const verifyJWT= asyncHandler(async(req, _,next)=>{
    try{   
    const token = req.cookies?.accessToken || req.headers["Authorization"]?.replace("Bearer", "")
    
    
        if(!token)
        {
            throw new ApiError(401, "Unauthorized access");
        }
        const decoded= jwt.verify( token,process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded);
        
       
        const user= await users.findById(decoded?._id).select("-password -refreshToken");
        console.log(user);
        
        if(!user)
        {
            throw new ApiError(401, "Invalid Access Token")
        }
        console.log("dddddd");
        req.user=user;
        next();
    
} 
    catch (error) {
    throw new ApiError(401, error?.message ||  'Invalid access Token ')
    }
   })